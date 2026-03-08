import { nailTechs } from "@shared/schema";
import { desc, eq } from "drizzle-orm";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerImageRoutes } from "./replit_integrations/image";

// WordPress API Configuration
const WORDPRESS_API_URL = "https://nail-check.com/wp-json/nail-check/v1";
const WORDPRESS_API_KEY = "nc_railway_auth_2026_secret_key";

// Helper function to sync to WordPress
async function syncToWordPress(endpoint: string, data: any): Promise<{ success: boolean; wordpress_id?: number; error?: string }> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": WORDPRESS_API_KEY,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`WordPress sync failed: ${response.status} - ${errorText}`);
      return { success: false, error: `HTTP ${response.status}` };
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("WordPress sync error:", error);
    return { success: false, error: String(error) };
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // AI Routes
  registerImageRoutes(app);

  // ============================================
  // AI CRITIQUE API ROUTES
  // ============================================
  
  // AI Critique endpoint - analyzes uploaded nail images
  app.post("/api/ai/critique", async (req, res) => {
    try {
      const { image, imageUrl } = req.body;
      
      // Get the image - either base64 or URL
      let imageData = image;
      if (!imageData && imageUrl) {
        // Fetch image from URL if provided
        try {
          const response = await fetch(imageUrl);
          const buffer = await response.arrayBuffer();
          imageData = Buffer.from(buffer).toString('base64');
        } catch (fetchError) {
          console.error("Failed to fetch image from URL:", fetchError);
          return res.status(400).json({ message: "Failed to fetch image from URL" });
        }
      }
      
      if (!imageData) {
        return res.status(400).json({ message: "Image is required (base64 or URL)" });
      }

      // Build the AI prompt for nail critique
      const critiquePrompt = `You are a professional nail technician and educator with 15+ years of experience. Analyze this nail design image and provide a detailed critique.

Please evaluate and respond in this EXACT JSON format (no markdown, just raw JSON):
{
  "overallScore": <number 1-10>,
  "styleDetected": "<detected nail style/technique like French, Chrome, Ombre, Abstract, etc>",
  "shapeDetected": "<nail shape: Square, Coffin, Almond, Stiletto, Oval, Round, Duck/Flare, etc>",
  "whatWorks": [
    "<specific positive aspect 1>",
    "<specific positive aspect 2>",
    "<specific positive aspect 3>"
  ],
  "areasToImprove": [
    "<specific improvement suggestion 1>",
    "<specific improvement suggestion 2>",
    "<specific improvement suggestion 3>"
  ],
  "technicalNotes": "<brief technical observation about application, structure, cuticle work, or finish>",
  "suggestedStyles": ["<related style to try 1>", "<related style to try 2>"],
  "suggestedProducts": ["<product type 1>", "<product type 2>", "<product type 3>"],
  "skillLevel": "<Beginner|Intermediate|Advanced|Competition>"
}

Be encouraging but honest. Focus on:
- Shape consistency and symmetry
- Cuticle work and sidewall cleanliness
- Product application (thickness, apex placement)
- Design execution and creativity
- Finish quality (shine, texture)

If this is not a nail image, return:
{
  "overallScore": 0,
  "styleDetected": "Not a nail image",
  "shapeDetected": "N/A",
  "whatWorks": ["Please upload a clear photo of nails"],
  "areasToImprove": ["Upload a well-lit, focused image of your nail work"],
  "technicalNotes": "For best results, photograph nails against a plain background with good lighting.",
  "suggestedStyles": [],
  "suggestedProducts": [],
  "skillLevel": "N/A"
}`;

      // Call Google Gemini API for vision analysis
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
      
      if (!GEMINI_API_KEY) {
        console.error("No Gemini API key found");
        return res.status(500).json({ message: "AI service not configured" });
      }

      const aiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: critiquePrompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageData.replace(/^data:image\/\w+;base64,/, "")
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error("Gemini API error:", errorText);
        return res.status(500).json({ message: "AI analysis failed" });
      }

      const aiData = await aiResponse.json();
      const responseText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      // Parse the JSON response
      let critique;
      try {
        // Extract JSON from the response (handle markdown code blocks)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          critique = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (parseError) {
        console.error("Failed to parse AI response:", responseText);
        // Return a fallback response
        critique = {
          overallScore: 7,
          styleDetected: "Unable to determine",
          shapeDetected: "Unable to determine",
          whatWorks: ["Image uploaded successfully", "Design shows creativity"],
          areasToImprove: ["Try uploading a clearer image for better analysis"],
          technicalNotes: "For best results, upload a well-lit, focused image of your nails.",
          suggestedStyles: ["Chrome", "French"],
          suggestedProducts: ["Top Coat", "Base Coat"],
          skillLevel: "Intermediate"
        };
      }

      // Fetch matching tutorials based on detected style
      let tutorials: any[] = [];
      try {
        const allTutorials = await storage.getTutorials({});
        // Filter tutorials that match the detected style or skill level
        tutorials = allTutorials.filter(t => 
          t.styleCategory?.toLowerCase().includes(critique.styleDetected?.toLowerCase()) ||
          t.difficultyLevel?.toLowerCase() === critique.skillLevel?.toLowerCase() ||
          critique.suggestedStyles?.some((style: string) => 
            t.styleCategory?.toLowerCase().includes(style.toLowerCase())
          )
        ).slice(0, 3);
        
        // If no matches, return first 3 tutorials
        if (tutorials.length === 0) {
          tutorials = allTutorials.slice(0, 3);
        }
      } catch (tutorialError) {
        console.error("Error fetching tutorials:", tutorialError);
      }
      
      // Fetch matching supplies based on suggested products
      let matchedSupplies: any[] = [];
      try {
        const supplies = await storage.getSupplyProducts();
        matchedSupplies = supplies.filter(supply => 
          critique.suggestedProducts?.some((prod: string) => 
            supply.name?.toLowerCase().includes(prod.toLowerCase()) ||
            supply.category?.toLowerCase().includes(prod.toLowerCase()) ||
            supply.tags?.some((tag: string) => prod.toLowerCase().includes(tag.toLowerCase()))
          )
        ).slice(0, 4);
        
        // If no matches, return featured supplies
        if (matchedSupplies.length === 0) {
          matchedSupplies = supplies.filter(s => s.featured).slice(0, 4);
        }
      } catch (supplyError) {
        console.error("Error fetching supplies:", supplyError);
      }

      // Return the complete critique with recommendations
      res.json({
        critique,
        recommendations: {
          tutorials,
          supplies: matchedSupplies
        }
      });

    } catch (error) {
      console.error("AI Critique error:", error);
      res.status(500).json({ message: "Failed to analyze image" });
    }
  });

  // Track critique usage (uses same credit system)
  app.post("/api/ai/critique/use-credit", async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId || userId === "guest") {
        // Guest gets 1 free critique
        return res.json({ success: true, remainingCredits: 0, isFirstCritique: true });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Use same credit pool as generation
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
      console.error("Error using critique credit:", err);
      res.status(500).json({ message: "Failed to use credit" });
    }
  });

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

  // ============================================
  // NAIL TECH LOCATOR API ROUTES
  // ============================================
  
  // GET all approved nail techs
  app.get("/api/techs", async (req, res) => {
    try {
      const techs = await storage.getNailTechs();
      res.json(techs);
    } catch (err) {
      console.error("Error fetching nail techs:", err);
      res.status(500).json({ message: "Failed to fetch nail techs" });
    }
  });

  // GET single nail tech by ID
  app.get("/api/techs/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const tech = await storage.getNailTech(id);
      if (!tech) {
        return res.status(404).json({ message: "Nail tech not found" });
      }
      res.json(tech);
    } catch (err) {
      console.error("Error fetching nail tech:", err);
      res.status(500).json({ message: "Failed to fetch nail tech" });
    }
  });

  // POST register new nail tech
  app.post("/api/techs/register", async (req, res) => {
    try {
      const { name, email, phone, businessName, city, state, zipCode, bio, profileImage, bookingUrl, instagram, website, skillLevel, specialties } = req.body;
      
      if (!name || !email || !city || !state || !zipCode || !bio) {
        return res.status(400).json({ message: "name, email, city, state, zipCode, and bio are required" });
      }

      const tech = await storage.createNailTech({
        name,
        email,
        phone,
        businessName,
        city,
        state,
        zipCode,
        bio,
        profileImage,
        bookingUrl,
        instagram,
        website,
        skillLevel,
        specialties,
      });
      
      res.status(201).json(tech);
    } catch (err) {
      console.error("Error registering nail tech:", err);
      res.status(500).json({ message: "Failed to register nail tech" });
    }
  });

  // PUT approve nail tech (admin)
  app.put("/api/techs/:id/approve", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const tech = await storage.approveNailTech(id);
      res.json(tech);
    } catch (err) {
      console.error("Error approving nail tech:", err);
      res.status(500).json({ message: "Failed to approve nail tech" });
    }
  });

  // DELETE nail tech
  app.delete("/api/techs/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteNailTech(id);
      res.status(204).send();
    } catch (err) {
      console.error("Error deleting nail tech:", err);
      res.status(500).json({ message: "Failed to delete nail tech" });
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

  // GOOGLE PLACES API ROUTE - Search for nail salons by zip code
  app.get("/api/places/search", async (req, res) => {
    try {
      const zip = req.query.zip as string;
      
      if (!zip || zip.length < 5) {
        return res.status(400).json({ message: "Valid zip code required" });
      }

      const GOOGLE_API_KEY = "AIzaSyC7gL4Q3YAcXmvE63F2Xq_ELd-O--kFB5o";

      // Step 1: Geocode the zip code to get lat/lng
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zip},USA&key=${GOOGLE_API_KEY}`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (!geocodeData.results || geocodeData.results.length === 0) {
        return res.status(404).json({ message: "Zip code not found" });
      }

      const location = geocodeData.results[0].geometry.location;

      // Step 2: Search for nail salons near this location
      const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=16093&type=beauty_salon&keyword=nail&key=${GOOGLE_API_KEY}`;
      
      const placesResponse = await fetch(placesUrl);
      const placesData = await placesResponse.json();

      res.json({
        results: placesData.results || [],
        location: location,
        status: placesData.status,
      });

    } catch (error) {
      console.error("Google Places API error:", error);
      res.status(500).json({ message: "Failed to search for nail salons" });
    }
  });

  // Get place details
  app.get("/api/places/:placeId", async (req, res) => {
    try {
      const { placeId } = req.params;
      const GOOGLE_API_KEY = "AIzaSyC7gL4Q3YAcXmvE63F2Xq_ELd-O--kFB5o";
      
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,opening_hours,rating,reviews,photos&key=${GOOGLE_API_KEY}`;
      
      const response = await fetch(detailsUrl);
      const data = await response.json();

      res.json(data.result || {});

    } catch (error) {
      console.error("Google Places details error:", error);
      res.status(500).json({ message: "Failed to get place details" });
    }
  });

  // ADMIN - Get pending nail techs (not approved)
  app.get("/api/admin/techs/pending", async (req, res) => {
    try {
      const pendingTechs = await db
        .select()
        .from(nailTechs)
        .where(eq(nailTechs.isApproved, false))
        .orderBy(desc(nailTechs.createdAt));
      res.json(pendingTechs);
    } catch (error) {
      console.error("Error fetching pending techs:", error);
      res.status(500).json({ message: "Failed to fetch pending techs" });
    }
  });

  // ADMIN - Add gallery image
  app.post("/api/admin/gallery", async (req, res) => {
    try {
      const { title, imageUrl, category, tags, description } = req.body;
      
      if (!title || !imageUrl || !category) {
        return res.status(400).json({ message: "title, imageUrl, and category are required" });
      }

      const design = await storage.saveDesign({
        imageUrl,
        prompt: title,
        tags: tags || [],
        userId: "admin",
        canvasImageUrl: null,
      });
      
      res.status(201).json(design);
    } catch (error) {
      console.error("Error adding gallery image:", error);
      res.status(500).json({ message: "Failed to add gallery image" });
    }
  });

  // ============================================
  // WORDPRESS SYNC API ROUTES (Server-side)
  // ============================================

  // Sync Gallery to WordPress
  app.post("/api/sync/gallery", async (req, res) => {
    try {
      const { title, imageUrl, category, tags, description, memberOnly, railwayId } = req.body;
      
      const wpResult = await syncToWordPress("/content/gallery", {
        title,
        imageUrl,
        category,
        tags,
        description,
        memberOnly,
        railwayId,
      });
      
      res.json(wpResult);
    } catch (error) {
      console.error("Error syncing gallery to WordPress:", error);
      res.status(500).json({ success: false, error: "Sync failed" });
    }
  });

  // Sync Tutorial to WordPress
  app.post("/api/sync/tutorial", async (req, res) => {
    try {
      const { title, imageSource, styleCategory, difficultyLevel, toolsRequired, tutorialContent, creatorCredit, railwayId } = req.body;
      
      const wpResult = await syncToWordPress("/content/tutorials", {
        title,
        imageSource,
        styleCategory,
        difficultyLevel,
        toolsRequired,
        tutorialContent,
        creatorCredit,
        railwayId,
      });
      
      res.json(wpResult);
    } catch (error) {
      console.error("Error syncing tutorial to WordPress:", error);
      res.status(500).json({ success: false, error: "Sync failed" });
    }
  });

  // Sync Seasonal to WordPress
  app.post("/api/sync/seasonal", async (req, res) => {
    try {
      const { title, imageUrl, season, category, description, tags, featured, railwayId } = req.body;
      
      const wpResult = await syncToWordPress("/content/seasonal", {
        title,
        imageUrl,
        season,
        category,
        description,
        tags,
        featured,
        railwayId,
      });
      
      res.json(wpResult);
    } catch (error) {
      console.error("Error syncing seasonal to WordPress:", error);
      res.status(500).json({ success: false, error: "Sync failed" });
    }
  });

  // Sync Supply to WordPress
  app.post("/api/sync/supply", async (req, res) => {
    try {
      const { name, brand, category, description, imageUrl, productUrl, price, utility, tags, featured, memberOnly, railwayId } = req.body;
      
      const wpResult = await syncToWordPress("/content/supplies", {
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
        railwayId,
      });
      
      res.json(wpResult);
    } catch (error) {
      console.error("Error syncing supply to WordPress:", error);
      res.status(500).json({ success: false, error: "Sync failed" });
    }
  });

  // Sync Nail Tech to WordPress
  app.post("/api/sync/tech", async (req, res) => {
    try {
      const techData = req.body;
      
      const wpResult = await syncToWordPress("/content/techs", techData);
      
      res.json(wpResult);
    } catch (error) {
      console.error("Error syncing tech to WordPress:", error);
      res.status(500).json({ success: false, error: "Sync failed" });
    }
  });

  // Update Flavor of the Month
  app.post("/api/sync/flavor-of-month", async (req, res) => {
    try {
      const { title, description, image } = req.body;
      
      const wpResult = await syncToWordPress("/flavor-of-month", {
        title,
        description,
        image,
      });
      
      res.json(wpResult);
    } catch (error) {
      console.error("Error updating flavor of month:", error);
      res.status(500).json({ success: false, error: "Update failed" });
    }
  });

  // Get Flavor of the Month
  app.get("/api/sync/flavor-of-month", async (req, res) => {
    try {
      const response = await fetch(`${WORDPRESS_API_URL}/flavor-of-month`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching flavor of month:", error);
      res.status(500).json({ title: "", description: "", image: "" });
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
