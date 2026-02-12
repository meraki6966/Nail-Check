import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";

/**
 * Register auth-specific routes for Railway/Passport compatibility.
 */
export function registerAuthRoutes(app: Express): void {
  // Get current authenticated user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      // FIX: Safely retrieve the User ID using optional chaining
      // This checks Replit claims first, then falls back to standard Passport IDs.
      const userId = req.user?.claims?.sub || req.user?.id || req.user?.sub;

      if (!userId) {
        console.warn("Auth check passed but no User ID was found in the session.");
        return res.status(401).json({ message: "User session is invalid" });
      }

      // Fetch the full user profile from your database
      const user = await authStorage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User profile not found" });
      }

      res.json(user);
    } catch (error) {
      // This prevents the server from crashing if the database lookup fails
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}