import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerImageRoutes } from "./replit_integrations/image";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // AI Routes
  registerImageRoutes(app);

  // Tutorial API Routes
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

  // FIRE VAULT API ROUTES
  app.get("/api/designs", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      const designs = await storage.getSavedDesigns(userId);
      res.json(designs);
    } catch (err) {
      console.error("Error fetching saved designs:", err);
      res.status(500).json({ message: "Failed to fetch saved designs" });
    }
  });

  app.get("/api/designs/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const design = await storage.getSavedDesign(id);
      if (!design) {
        return res.status(404).json({ message: "Design not found" });
      }
      res.json(design);
    } catch (err) {
      console.error("Error fetching design:", err);
      res.status(500).json({ message: "Failed to fetch design" });
    }
  });

  app.post("/api/designs", async (req, res) => {
    try {
      const { imageUrl, prompt, canvasImageUrl, tags, userId } = req.body;
      
      if (!imageUrl || !prompt) {
        return res.status(400).json({ message: "imageUrl and prompt are required" });
      }

      const design = await storage.saveDesign({
        userId,
        imageUrl,
        prompt,
        canvasImageUrl,
        tags,
      });
      
      res.status(201).json(design);
    } catch (err) {
      console.error("Error saving design:", err);
      res.status(500).json({ message: "Failed to save design" });
    }
  });

  app.delete("/api/designs/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteDesign(id);
      res.status(204).send();
    } catch (err) {
      console.error("Error deleting design:", err);
      res.status(500).json({ message: "Failed to delete design" });
    }
  });

  app.patch("/api/designs/:id/favorite", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const design = await storage.toggleFavorite(id);
      res.json(design);
    } catch (err) {
      console.error("Error toggling favorite:", err);
      res.status(500).json({ message: "Failed to toggle favorite" });
    }
  });

  // SEASONAL VAULT API ROUTES
  app.get("/api/seasonal", async (req, res) => {
    try {
      const season = req.query.season as string | undefined;
      const designs = await storage.getSeasonalDesigns(season);
      res.json(designs);
    } catch (err) {
      console.error("Error fetching seasonal designs:", err);
      res.status(500).json({ message: "Failed to fetch seasonal designs" });
    }
  });

  app.get("/api/seasonal/featured", async (req, res) => {
    try {
      const designs = await storage.getFeaturedSeasonalDesigns();
      res.json(designs);
    } catch (err) {
      console.error("Error fetching featured designs:", err);
      res.status(500).json({ message: "Failed to fetch featured designs" });
    }
  });

  app.get("/api/seasonal/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const design = await storage.getSeasonalDesign(id);
      if (!design) {
        return res.status(404).json({ message: "Design not found" });
      }
      res.json(design);
    } catch (err) {
      console.error("Error fetching seasonal design:", err);
      res.status(500).json({ message: "Failed to fetch design" });
    }
  });

  app.post("/api/seasonal", async (req, res) => {
    try {
      const { title, imageUrl, season, category, description, tags, featured } = req.body;
      
      if (!title || !imageUrl || !season) {
        return res.status(400).json({ message: "title, imageUrl, and season are required" });
      }

      const design = await storage.createSeasonalDesign({
        title,
        imageUrl,
        season,
        category,
        description,
        tags,
        featured,
      });
      
      res.status(201).json(design);
    } catch (err) {
      console.error("Error creating seasonal design:", err);
      res.status(500).json({ message: "Failed to create seasonal design" });
    }
  });

  // SUPPLY SUITE API ROUTES
  app.get("/api/supplies", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const products = await storage.getSupplyProducts(category);
      res.json(products);
    } catch (err) {
      console.error("Error fetching supply products:", err);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/supplies/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedSupplyProducts();
      res.json(products);
    } catch (err) {
      console.error("Error fetching featured products:", err);
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/supplies/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query required" });
      }
      const products = await storage.searchSupplyProducts(query);
      res.json(products);
    } catch (err) {
      console.error("Error searching products:", err);
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  app.get("/api/supplies/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const product = await storage.getSupplyProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      console.error("Error fetching product:", err);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/supplies", async (req, res) => {
    try {
      const { name, brand, category, description, imageUrl, productUrl, price, utility, tags, featured, memberOnly } = req.body;
      
      if (!name || !brand || !category) {
        return res.status(400).json({ message: "name, brand, and category are required" });
      }

      const product = await storage.createSupplyProduct({
        name,
        brand,
        category,
        description,
        imageUrl,
        productUrl,
        price,
        utility,
        tags,
        featured,
        memberOnly,
      });
      
      res.status(201).json(product);
    } catch (err) {
      console.error("Error creating product:", err);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // CREDIT SYSTEM API
  app.get("/api/user/credits", async (req, res) => {
    try {
      const userId = req.query.userId as string || "guest";
      
      if (userId === "guest") {
        return res.json({ 
          credits: 1, 
          generationsUsed: 0,
          isPaidMember: false,
          canGenerate: true 
        });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const canGenerate = user.isPaidMember || (user.credits > user.generationsUsed);
      
      res.json({
        credits: user.credits,
        generationsUsed: user.generationsUsed,
        isPaidMember: user.isPaidMember,
        canGenerate
      });
    } catch (err) {
      console.error("Error fetching credits:", err);
      res.status(500).json({ message: "Failed to fetch credits" });
    }
  });

  app.post("/api/user/use-credit", async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId || userId === "guest") {
        return res.json({ success: true, remainingCredits: 0 });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (!user.isPaidMember && user.generationsUsed >= user.credits) {
        return res.status(403).json({ 
          message: "No credits remaining",
          showPaywall: true 
        });
      }
      
      await storage.incrementGenerationsUsed(userId);
      
      const remainingCredits = user.isPaidMember 
        ? 999
        : user.credits - (user.generationsUsed + 1);
      
      res.json({ 
        success: true, 
        remainingCredits,
        showPaywall: remainingCredits <= 0 && !user.isPaidMember
      });
    } catch (err) {
      console.error("Error using credit:", err);
      res.status(500).json({ message: "Failed to use credit" });
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  // Seed tutorials
  const existingTutorials = await storage.getTutorials();
  if (existingTutorials.length === 0) {
    const tutorialSamples = [
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
        tutorialContent: "1. Apply base coat (usually light/nude). Cure.\n2. Use a sponge to dab pigment in the center of the nail, fading outwards.\n3. Repeat to build intensity in the center.\n4. Seal with top coat.",
        creatorCredit: "@auravibes",
      },
    ];

    for (const sample of tutorialSamples) {
      await storage.createTutorial(sample);
    }
  }

  // Seed seasonal designs
  const existingSeasonal = await storage.getSeasonalDesigns();
  if (existingSeasonal.length === 0) {
    const seasonalSamples = [
      // WINTER
      { title: "Icy Blue Glitter", imageUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=800", season: "Winter", category: "Festive", description: "Frozen elegance with shimmer", tags: ["glitter", "blue", "festive"], featured: true },
      { title: "Snowflake Chrome", imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=800", season: "Winter", category: "Holiday", description: "Delicate winter patterns", tags: ["chrome", "white", "snowflake"], featured: true },
      { title: "Burgundy Velvet", imageUrl: "https://images.unsplash.com/photo-1610992015877-47b84e5e8b39?auto=format&fit=crop&q=80&w=800", season: "Winter", category: "Elegant", description: "Deep winter tones", tags: ["burgundy", "matte", "elegant"], featured: false },
      
      // SPRING
      { title: "Pastel Garden", imageUrl: "https://images.unsplash.com/photo-1599692613955-32cb7c64eb07?auto=format&fit=crop&q=80&w=800", season: "Spring", category: "Floral", description: "Soft spring blooms", tags: ["pastel", "floral", "pink"], featured: true },
      { title: "Cherry Blossom", imageUrl: "https://images.unsplash.com/photo-1604654894526-a5d7c622b90f?auto=format&fit=crop&q=80&w=800", season: "Spring", category: "Nature", description: "Delicate pink petals", tags: ["pink", "floral", "spring"], featured: true },
      { title: "Mint Fresh", imageUrl: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&q=80&w=800", season: "Spring", category: "Fresh", description: "Cool mint tones", tags: ["mint", "green", "fresh"], featured: false },
      
      // SUMMER
      { title: "Tropical Sunset", imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800", season: "Summer", category: "Beach", description: "Vibrant summer vibes", tags: ["orange", "yellow", "tropical"], featured: true },
      { title: "Ocean Wave", imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800", season: "Summer", category: "Beach", description: "Blue wave patterns", tags: ["blue", "wave", "ocean"], featured: true },
      { title: "Neon Coral", imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=800", season: "Summer", category: "Bold", description: "Bright summer pop", tags: ["coral", "neon", "bold"], featured: false },
      
      // FALL
      { title: "Pumpkin Spice", imageUrl: "https://images.unsplash.com/photo-1599692613955-32cb7c64eb07?auto=format&fit=crop&q=80&w=800", season: "Fall", category: "Cozy", description: "Warm autumn tones", tags: ["orange", "brown", "fall"], featured: true },
      { title: "Maple Leaf Gold", imageUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=800", season: "Fall", category: "Nature", description: "Golden autumn leaves", tags: ["gold", "metallic", "fall"], featured: true },
      { title: "Mocha Matte", imageUrl: "https://images.unsplash.com/photo-1610992015877-47b84e5e8b39?auto=format&fit=crop&q=80&w=800", season: "Fall", category: "Cozy", description: "Deep coffee tones", tags: ["brown", "matte", "cozy"], featured: false },
      
      // HOLIDAYS/EVENTS
      { title: "Valentine Hearts", imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800", season: "Holiday", category: "Valentine's Day", description: "Love-themed designs", tags: ["red", "hearts", "love"], featured: true },
      { title: "Halloween Spooky", imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=800", season: "Holiday", category: "Halloween", description: "Dark and mysterious", tags: ["black", "orange", "spooky"], featured: true },
      { title: "New Year Sparkle", imageUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=800", season: "Holiday", category: "New Year", description: "Glittery celebration", tags: ["glitter", "gold", "party"], featured: false },
    ];

    for (const sample of seasonalSamples) {
      await storage.createSeasonalDesign(sample);
    }
  }

  // Seed supply products
  const existingSupplies = await storage.getSupplyProducts();
  if (existingSupplies.length === 0) {
    const supplySamples = [
      // BASE COATS
      { name: "Ridge Filler Base", brand: "OPI", category: "Base Coat", description: "Smooths nail ridges for perfect application", imageUrl: "https://images.unsplash.com/photo-1610992015877-47b84e5e8b39?auto=format&fit=crop&q=80&w=400", productUrl: "https://www.opi.com", price: "$10.99", utility: "Fills ridges and creates smooth surface", tags: ["ridge filler", "smooth"], featured: true, memberOnly: true },
      { name: "Strengthen & Grow", brand: "Sally Hansen", category: "Base Coat", description: "Nail strengthening treatment", imageUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=400", productUrl: "https://www.sallyhansen.com", price: "$8.99", utility: "Strengthens weak nails", tags: ["strengthening", "growth"], featured: false, memberOnly: true },
      
      // TOP COATS
      { name: "High-Gloss Structural Gel", brand: "Founder's Choice", category: "Top Coat", description: "Professional 3D sculpting gel with mirror shine", imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=400", productUrl: "#", price: "$24.99", utility: "Essential for 3D sculpting and high-gloss finish", tags: ["gel", "high-gloss", "3d"], featured: true, memberOnly: true },
      { name: "Quick Dry Top Coat", brand: "Essie", category: "Top Coat", description: "Dries in 60 seconds", imageUrl: "https://images.unsplash.com/photo-1599692613955-32cb7c64eb07?auto=format&fit=crop&q=80&w=400", productUrl: "https://www.essie.com", price: "$9.99", utility: "Fast drying top coat", tags: ["quick-dry", "glossy"], featured: true, memberOnly: true },
      
      // COLORS - REDS
      { name: "Ruby Woo", brand: "MAC Cosmetics", category: "Color - Red", description: "Classic matte red", imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400", productUrl: "https://www.maccosmetics.com", price: "$12.00", utility: "Bold statement color", tags: ["red", "matte", "classic"], featured: true, memberOnly: true },
      { name: "Bordeaux", brand: "Chanel", category: "Color - Red", description: "Deep burgundy wine", imageUrl: "https://images.unsplash.com/photo-1610992015877-47b84e5e8b39?auto=format&fit=crop&q=80&w=400", productUrl: "https://www.chanel.com", price: "$28.00", utility: "Luxury deep red", tags: ["burgundy", "luxury"], featured: false, memberOnly: true },
      
      // COLORS - NUDES
      { name: "Ballet Slippers", brand: "Essie", category: "Color - Nude", description: "Sheer pale pink nude", imageUrl: "https://images.unsplash.com/photo-1599692613955-32cb7c64eb07?auto=format&fit=crop&q=80&w=400", productUrl: "https://www.essie.com", price: "$9.00", utility: "Classic nude shade", tags: ["nude", "pink", "sheer"], featured: true, memberOnly: true },
      { name: "Samoan Sand", brand: "OPI", category: "Color - Nude", description: "Warm beige nude", imageUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=400", productUrl: "https://www.opi.com", price: "$10.99", utility: "Perfect neutral", tags: ["nude", "beige", "neutral"], featured: false, memberOnly: true },
      
      // TOOLS
      { name: "Precision Detail Brush", brand: "Technical Hub", category: "Tool - Brush", description: "Custom bristles for surgical linework", imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=400", productUrl: "#", price: "$15.99", utility: "Ultra-fine detail work and nail art", tags: ["brush", "detail", "art"], featured: true, memberOnly: true },
      { name: "Dotting Tool Set", brand: "Winstonia", category: "Tool - Dotting", description: "5 different tip sizes", imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=400", productUrl: "https://www.winstonia.com", price: "$7.99", utility: "Create perfect dots and patterns", tags: ["dotting", "nail art"], featured: false, memberOnly: true },
      
      // EQUIPMENT
      { name: "UV/LED Lamp 48W", brand: "MelodySusie", category: "Equipment - Lamp", description: "Professional curing lamp", imageUrl: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&q=80&w=400", productUrl: "https://www.melodysusie.com", price: "$35.99", utility: "Cures gel polish in 30-60 seconds", tags: ["lamp", "uv", "gel"], featured: true, memberOnly: true },
      { name: "Electric Nail File", brand: "Makartt", category: "Equipment - File", description: "Professional e-file system", imageUrl: "https://images.unsplash.com/photo-1604654894526-a5d7c622b90f?auto=format&fit=crop&q=80&w=400", productUrl: "https://www.makartt.com", price: "$49.99", utility: "Precision filing and shaping", tags: ["efile", "filing", "professional"], featured: true, memberOnly: true },
      
      // CHROME/SPECIALTY
      { name: "Chrome Powder - Silver", brand: "Born Pretty", category: "Specialty - Chrome", description: "Mirror chrome powder", imageUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=400", productUrl: "https://www.bornprettystore.com", price: "$3.99", utility: "Creates chrome mirror effect", tags: ["chrome", "powder", "mirror"], featured: true, memberOnly: true },
      { name: "Blooming Gel", brand: "Modelones", category: "Specialty - Gel", description: "Creates watercolor effects", imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=400", productUrl: "https://www.modelones.com", price: "$6.99", utility: "Marble and watercolor nail art", tags: ["blooming", "marble", "art"], featured: false, memberOnly: true },
      
      // NAIL CARE
      { name: "Cuticle Oil Pen", brand: "CND", category: "Nail Care", description: "Nourishing cuticle treatment", imageUrl: "https://images.unsplash.com/photo-1599692613955-32cb7c64eb07?auto=format&fit=crop&q=80&w=400", productUrl: "https://www.cnd.com", price: "$9.50", utility: "Hydrates cuticles and nails", tags: ["cuticle", "oil", "care"], featured: false, memberOnly: true },
    ];

    for (const sample of supplySamples) {
      await storage.createSupplyProduct(sample);
    }
  }
}