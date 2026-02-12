import type { Express, Request, Response } from "express";
import { generateImage } from "./client";

export function registerImageRoutes(app: Express): void {
  app.post("/api/generate-image", async (req: Request, res: Response) => {
    try {
      // 1. Grab both the prompt AND the optional canvas image from the request
      const { prompt, image } = req.body;

      if (!prompt && !image) {
        return res.status(400).json({ error: "A prompt or a canvas image is required to begin." });
      }

      // 2. Call our upgraded function from client.ts
      // This now handles both Text-to-Image and Image-to-Image (Canvas)
      const dataUrl = await generateImage(prompt, image);

      // 3. Extract the base64 data to send back to the frontend
      const [header, base64Data] = dataUrl.split(",");
      const mimeType = header.split(":")[1].split(";")[0];

      res.json({
        b64_json: base64Data,
        mimeType,
      });

    } catch (error) {
      console.error("Nail Check AI Error:", error);
      res.status(500).json({ 
        error: "The Technical Hub encountered an error rendering your vision. Please try again." 
      });
    }
  });
}