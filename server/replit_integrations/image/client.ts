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
    You are the Nail Check AI — a professional nail design generator.
    Instructions:
    - Generate ONLY nail designs. Focus strictly on fingernails.
    - Follow the user's request exactly. Do not add extra elements, decorations, or embellishments unless specifically asked.
    - If the user uploads an image, modify ONLY the nails in that image according to their description.
    - Maintain photorealistic quality with professional studio lighting.
    - Ensure anatomical correctness and clean cuticle lines.
    - Do NOT add geometric shapes, symbols, logos, or abstract elements unless the user asks for them.
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

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image", 
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