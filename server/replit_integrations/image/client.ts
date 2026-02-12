import { GoogleGenAI, Modality } from "@google/genai";

// 1. Initialize with an options object to prevent 'project' undefined errors
export const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY!
});

/**
 * Generate a luxury nail design. 
 * Performs Text-to-Image or Image-to-Image modification.
 */
export async function generateImage(prompt: string, base64Image?: string): Promise<string> {

  // RESTORED: Full Elite System Instructions
  const systemInstruction = `
    You are the Nail Check Technical AI. 
    Your style is: Architectural, Luxury, High-Gloss, and Elite. 
    Instructions:
    - If the user prompt is vague, apply high-end textures like 3D chrome, jelly finishes, or structural sculpting.
    - Maintain a 'Vogue' editorial photography aesthetic with professional studio lighting.
    - Focus strictly on the nail plate and technical execution; results must look like a professional macro-shot.
    - Avoid messy, amateur, or 'craft-style' art. 
    - Ensure anatomical correctness and clean cuticle lines.
    User Request: ${prompt}
  `;

  const parts: any[] = [
    { text: systemInstruction },
    { text: "Output modality: IMAGE. Focus on photorealistic high-resolution rendering." }
  ];

  if (base64Image) {
    const base64Data = base64Image.split(',')[1] || base64Image;
    parts.push({
      inlineData: {
        mimeType: "image/png",
        data: base64Data
      }
    });
  }

  // 2. Using the 2026 "Nano Banana Pro" model for Tier 1 Billing accounts
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-image-preview", 
    contents: [{ role: "user", parts: parts }],
    config: {
      // Explicitly request IMAGE modality to bypass regional text-only blocks
      responseModalities: [Modality.IMAGE], 
    },
  });

  const candidate = response.candidates?.[0];
  const imagePart = candidate?.content?.parts?.find(
    (part: any) => part.inlineData
  );

  // If the AI Hub didn't return an image, we log the text response for debugging
  if (!imagePart?.inlineData?.data) {
    const aiReason = candidate?.content?.parts?.[0]?.text || "Unknown error";
    console.error("AI HUB REJECTION REASON:", aiReason);
    throw new Error(`The AI Hub could not render this vision: ${aiReason}`);
  }

  const mimeType = imagePart.inlineData.mimeType || "image/png";
  return `data:${mimeType};base64,${imagePart.inlineData.data}`;
}