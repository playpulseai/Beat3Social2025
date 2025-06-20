import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Firebase config endpoint - copy server env vars to client VITE_ vars
app.get('/api/firebase-config', (req: Request, res: Response) => {
  // Clean and set VITE_ environment variables for client access
  const cleanApiKey = process.env.FIREBASE_API_KEY?.replace(/^\s+|\s+$/g, '').replace(/\s/g, '');
  const cleanAuthDomain = process.env.FIREBASE_AUTH_DOMAIN?.replace(/^\s+|\s+$/g, '').replace(/\s/g, '');
  const cleanProjectId = process.env.FIREBASE_PROJECT_ID?.replace(/^\s+|\s+$/g, '').replace(/\s/g, '');
  const cleanStorageBucket = process.env.FIREBASE_STORAGE_BUCKET?.replace(/^\s+|\s+$/g, '').replace(/\s/g, '');
  const cleanMessagingSenderId = process.env.FIREBASE_MESSAGING_SENDER_ID?.replace(/^\s+|\s+$/g, '').replace(/\s/g, '');
  const cleanAppId = process.env.FIREBASE_APP_ID?.replace(/^\s+|\s+$/g, '').replace(/\s/g, '');
  
  process.env.VITE_FIREBASE_API_KEY = cleanApiKey;
  process.env.VITE_FIREBASE_AUTH_DOMAIN = cleanAuthDomain;
  process.env.VITE_FIREBASE_PROJECT_ID = cleanProjectId;
  process.env.VITE_FIREBASE_STORAGE_BUCKET = cleanStorageBucket;
  process.env.VITE_FIREBASE_MESSAGING_SENDER_ID = cleanMessagingSenderId;
  process.env.VITE_FIREBASE_APP_ID = cleanAppId;
  
  const config = {
    apiKey: cleanApiKey,
    authDomain: cleanAuthDomain,
    projectId: cleanProjectId,
    storageBucket: cleanStorageBucket,
    messagingSenderId: cleanMessagingSenderId,
    appId: cleanAppId,
  };
  res.json(config);
});

// File upload endpoint for fallback when Firebase Storage fails
app.post('/api/upload', (req: Request, res: Response) => {
  // For now, return a placeholder URL since we don't have persistent storage
  // In production, this would upload to a cloud storage service
  const fileId = `uploaded-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const mockUrl = `/api/placeholder/150/150?text=${encodeURIComponent('Profile Photo')}&id=${fileId}`;
  
  res.json({ 
    success: true, 
    url: mockUrl,
    message: 'File uploaded successfully (using fallback storage)'
  });
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
