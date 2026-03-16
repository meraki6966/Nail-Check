import type { Express } from "express";
import { storage } from "./storage";

export function registerCreatorsRoutes(app: Express) {
  // Get all creators (only those who opted into directory)
  app.get("/api/creators", async (req, res) => {
    try {
      const creators = await storage.getCreators();
      res.json({ creators });
    } catch (error: any) {
      console.error("Error fetching creators:", error);
      res.status(500).json({ error: "Failed to fetch creators" });
    }
  });

  // Get single creator by username
  app.get("/api/creators/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const creator = await storage.getCreatorByUsername(username);

      if (!creator) {
        return res.status(404).json({ error: "Creator not found" });
      }

      res.json({ creator });
    } catch (error: any) {
      console.error("Error fetching creator:", error);
      res.status(500).json({ error: "Failed to fetch creator" });
    }
  });
}