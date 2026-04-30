import type { Express } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkAIGenerationLimit, incrementAIGeneration } from "./subscriptions";
import { isAuthenticated, getSessionUserId } from "./middleware/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export function registerImageEditRoute(app: Express) {
  app.post("/api/image/edit", isAuthenticated, async (req, res) => {
    try {
      const userId = getSessionUserId(req)!;
      const { image, prompt } = req.body;

      if (!image || !prompt) {
        return res.status(400).json({ error: "Image and prompt required" });
      }

      // ── Subscription limit check (always enforced) ─────────────
      const allowed = await checkAIGenerationLimit(userId);
      if (!allowed) {
        return res.status(403).json({
          error: "limit_reached",
          message: "AI generation limit reached. Upgrade to Premium for unlimited generations.",
        });
      }
      // ──────────────────────────────────────────────────────────

      // Extract base64 data from data URL
      const base64Data = image.split(',')[1];
      const mimeType = image.match(/data:([^;]+);/)?.[1] || 'image/png';

      // Use Imagen 3 for image editing
      const model = genAI.getGenerativeModel({ 
        model: "imagen-3.0-generate-001"
      });

      const result = await model.generateContent({
        contents: [{
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            },
            { 
              text: `Edit this nail photo: ${prompt}. Maintain the original nail design but apply the requested changes. Keep it photorealistic and professional.` 
            }
          ]
        }]
      });

      const response = await result.response;
      const imageData = response.candidates?.[0]?.content?.parts?.[0];

      if (!imageData || !('inlineData' in imageData)) {
        throw new Error("No image generated");
      }

      // Increment AFTER successful generation
      incrementAIGeneration(userId).catch((err) =>
        console.error("[subscriptions] increment failed:", err)
      );

      res.json({
        b64_json: imageData.inlineData.data,
        mimeType: imageData.inlineData.mimeType
      });

    } catch (error: any) {
      console.error("Image edit error:", error);
      res.status(500).json({ 
        error: "Failed to edit image",
        details: error.message 
      });
    }
  });
}
