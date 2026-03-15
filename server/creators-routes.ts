import type { Express } from "express";
import { db } from "./db";

export function registerCreatorsRoutes(app: Express) {
  // Get all creators (only those who opted into directory)
  app.get("/api/creators", async (req, res) => {
    try {
      const result = await db.query(`
        SELECT 
          id,
          name,
          username,
          specialty,
          location,
          instagram,
          linktree,
          profile_image as "profileImage",
          affiliate_link as "affiliateLink"
        FROM nail_techs
        WHERE show_in_directory = true
        ORDER BY created_at DESC
      `);

      res.json({ creators: result.rows });
    } catch (error: any) {
      console.error("Error fetching creators:", error);
      res.status(500).json({ error: "Failed to fetch creators" });
    }
  });

  // Get single creator by username
  app.get("/api/creators/:username", async (req, res) => {
    try {
      const { username } = req.params;

      const result = await db.query(`
        SELECT 
          id,
          name,
          username,
          specialty,
          location,
          bio,
          instagram,
          linktree,
          email,
          profile_image as "profileImage",
          affiliate_link as "affiliateLink",
          portfolio_images as "portfolioImages"
        FROM nail_techs
        WHERE username = $1 AND show_in_directory = true
      `, [username]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Creator not found" });
      }

      res.json({ creator: result.rows[0] });
    } catch (error: any) {
      console.error("Error fetching creator:", error);
      res.status(500).json({ error: "Failed to fetch creator" });
    }
  });
}
