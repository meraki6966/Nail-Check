import type { Express } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkAIGenerationLimit, incrementAIGeneration } from "./subscriptions";

const genAI = new GoogleGenerativeAI(
  process.env.AI_INTEGRATIONS_GEMINI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  ""
);

export function registerImageCritiqueRoute(app: Express) {
  app.post("/api/image/critique", async (req, res) => {
    try {
      const { image } = req.body;

      if (!image) {
        return res.status(400).json({ error: "Image required" });
      }

      // ── Subscription limit check ───────────────────────────────
      const userId = (req.session as any)?.user?.id
        ? String((req.session as any).user.id)
        : null;

      if (userId) {
        const allowed = await checkAIGenerationLimit(userId);
        if (!allowed) {
          return res.status(403).json({
            error: "limit_reached",
            message: "AI generation limit reached. Upgrade to Premium for unlimited generations.",
          });
        }
      }
      // ──────────────────────────────────────────────────────────

      // Extract base64 data from data URL
      const base64Data = image.split(',')[1];
      const mimeType = image.match(/data:([^;]+);/)?.[1] || 'image/png';

      // Use Gemini for nail analysis
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
      });

      const prompt = `You are a professional nail technician and competition judge. Analyze this nail photo and provide a detailed critique in JSON format.

Evaluate these aspects (score each 1-10):
1. Shape & Symmetry - evenness, consistency, structural integrity
2. Cuticle Work - cleanliness, precision around nail bed
3. Application Quality - smoothness, no bubbles, even coverage
4. Color/Design - aesthetic appeal, color balance, artistry
5. Overall Finish - shine, durability indicators, professional appearance

Return JSON with this exact structure:
{
  "overallScore": number (1-10),
  "sections": [
    {
      "title": "Shape & Symmetry",
      "score": number (1-10),
      "feedback": "detailed observation",
      "suggestions": "how to improve"
    },
    ...
  ],
  "recommendations": ["product suggestion 1", "product suggestion 2"]
}

Be constructive, specific, and encouraging. Focus on actionable improvements.`;

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
            { text: prompt }
          ]
        }]
      });

      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
      const critiqueData = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : JSON.parse(text);

      // Increment AFTER successful critique
      if (userId) {
        incrementAIGeneration(userId).catch((err) =>
          console.error("[subscriptions] increment failed:", err)
        );
      }

      res.json({ critique: critiqueData });

    } catch (error: any) {
      console.error("Critique error:", error);
      res.status(500).json({ 
        error: "Failed to analyze image",
        details: error.message 
      });
    }
  });
}
