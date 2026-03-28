import type { Express, Request, Response } from "express";
import { generateImage } from "./client";
import { checkAIGenerationLimit, incrementAIGeneration } from "../../subscriptions";

export function registerImageRoutes(app: Express): void {
  app.post("/api/image/generate", async (req: Request, res: Response) => {
    try {
      const { prompt, image } = req.body;

      if (!prompt && !image) {
        return res.status(400).json({ error: "A prompt or a canvas image is required to begin." });
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

      const dataUrl = await generateImage(prompt, image);
      const [header, base64Data] = dataUrl.split(",");
      const mimeType = header.split(":")[1].split(";")[0];

      // Increment AFTER successful generation so failed calls don't count
      if (userId) {
        incrementAIGeneration(userId).catch((err) =>
          console.error("[subscriptions] increment failed:", err)
        );
      }

      res.json({ b64_json: base64Data, mimeType });

    } catch (error) {
      console.error("Nail Check AI Error:", error);
      res.status(500).json({
        error: "The Technical Hub encountered an error rendering your vision. Please try again."
      });
    }
  });
}