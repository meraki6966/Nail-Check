import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // API Routes
  app.get(api.tutorials.list.path, async (req, res) => {
    const filters = {
      search: req.query.search as string,
      style: req.query.style as string,
      difficulty: req.query.difficulty as string,
    };
    const tutorials = await storage.getTutorials(filters);
    res.json(tutorials);
  });

  app.get(api.tutorials.get.path, async (req, res) => {
    const id = Number(req.params.id);
    const tutorial = await storage.getTutorial(id);
    if (!tutorial) {
      return res.status(404).json({ message: "Tutorial not found" });
    }
    res.json(tutorial);
  });

  app.post(api.tutorials.create.path, async (req, res) => {
    try {
      const input = api.tutorials.create.input.parse(req.body);
      const tutorial = await storage.createTutorial(input);
      res.status(201).json(tutorial);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getTutorials();
  if (existing.length === 0) {
    const samples = [
      {
        title: "Classic French Tip",
        imageSource: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1000",
        styleCategory: "French",
        difficultyLevel: "Beginner",
        toolsRequired: ["Base Coat", "Nude Polish", "White Polish", "Fine Liner Brush", "Top Coat"],
        tutorialContent: "1. Apply base coat.\n2. Apply two coats of nude polish.\n3. Use a fine liner brush to draw the white tip, following your natural smile line.\n4. Clean up any mistakes with acetone.\n5. Seal with a glossy top coat.",
        creatorCredit: "@classicnails",
      },
      {
        title: "Chrome Glazed Donut",
        imageSource: "/attached_assets/stock_images/chrome_glazed_donut__3ce475bb.jpg",
        styleCategory: "Chrome",
        difficultyLevel: "Intermediate",
        toolsRequired: ["Gel Base", "Sheer White Gel", "Chrome Powder", "Applicator", "No-Wipe Top Coat"],
        tutorialContent: "1. Prep nails and apply gel base coat. Cure.\n2. Apply one coat of sheer white or milky white gel. Cure.\n3. Apply a no-wipe top coat. Cure for 30s only (half cure).\n4. Rub chrome powder onto the nail using an applicator.\n5. Dust off excess powder.\n6. Apply final top coat and cure fully.",
        creatorCredit: "@haileybieber_inspo",
      },
      {
        title: "Tortoise Shell",
        imageSource: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=1000",
        styleCategory: "Abstract",
        difficultyLevel: "Intermediate",
        toolsRequired: ["Amber Jelly Polish", "Brown Polish", "Black Polish", "Blooming Gel", "Brush"],
        tutorialContent: "1. Apply amber jelly base. Cure.\n2. Apply blooming gel (do not cure).\n3. Dot brown polish into the wet gel to create spots. Cure.\n4. Layer more jelly polish for depth. Cure.\n5. Add smaller black dots for contrast.\n6. Top coat.",
        creatorCredit: "@tortienails",
      },
      {
        title: "Checkerboard Vibes",
        imageSource: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=1000",
        styleCategory: "Abstract",
        difficultyLevel: "Pro",
        toolsRequired: ["Base Color", "Contrast Color", "Striping Tape", "Detail Brush"],
        tutorialContent: "1. Apply base color. Dry completely.\n2. Use a detail brush or striping tape to create a grid.\n3. Fill in alternating squares with contrast color.\n4. Cure or let dry.\n5. Top coat.",
        creatorCredit: "@vanscheckers",
      },
      {
        title: "Blush Aura",
        imageSource: "https://images.unsplash.com/photo-1599692613955-32cb7c64eb07?auto=format&fit=crop&q=80&w=1000",
        styleCategory: "Aura",
        difficultyLevel: "Intermediate",
        toolsRequired: ["Base Color", "Eyeshadow/Pigment", "Sponge", "Matte Top Coat"],
        tutorialContent: "1. Apply base color (usually light/nude). Cure.\n2. Use a sponge to dab pigment in the center of the nail, fading outwards.\n3. Repeat to build intensity in the center.\n4. Seal with top coat.",
        creatorCredit: "@auravibes",
      },
    ];

    for (const sample of samples) {
      await storage.createTutorial(sample);
    }
  }
}
