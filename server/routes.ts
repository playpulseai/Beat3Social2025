import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Firebase config endpoint - copy server env vars to client VITE_ vars
  app.get('/api/firebase-config', (req, res) => {
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

  // API routes for Firebase Firestore integration
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Beat3 Social API with Firebase Firestore" });
  });

  // User management endpoints
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Posts endpoints - Firebase integration ready
  app.get("/api/posts", async (req, res) => {
    res.json({ 
      message: "Posts are handled via Firebase Firestore on the frontend",
      collections: ["posts", "comments", "users", "moderationLogs"]
    });
  });

  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Configure multer for file uploads
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
      }
    }),
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  // File upload endpoint
  app.post("/api/upload", upload.single('file'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      const fileUrl = `/uploads/${req.file.filename}`;
      
      res.json({ 
        success: true, 
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        message: 'File uploaded successfully'
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: "Upload failed", details: error });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(uploadsDir));

  const httpServer = createServer(app);
  return httpServer;
}
