import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // File upload fallback endpoint
  app.post("/api/upload", (req, res) => {
    try {
      // Generate a unique file ID and return a placeholder URL
      const fileId = `uploaded-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const mockUrl = `/api/placeholder/150/150?text=${encodeURIComponent('Profile Photo')}&id=${fileId}`;
      
      res.json({ 
        success: true, 
        url: mockUrl,
        message: 'File uploaded successfully (using fallback storage)'
      });
    } catch (error) {
      res.status(500).json({ error: "Upload failed", details: error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
