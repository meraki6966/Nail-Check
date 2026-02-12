import { GoogleGenAI, Modality } from "@google/genai";

// 1. Initialize with ONLY the API Key to talk directly to Google
// This fixes the 404 error caused by the Replit Base URL proxy.
export const ai = new GoogleGenAI(process.env.AI_INTEGRATIONS_GEMINI_API_KEY!);

/**
 * Generate a nail design. 
 * If base64Image is provided, it performs an Image-to-Image modification.
 */
export async function generateImage(prompt: string, base64Image?: string): Promise<string> {

  // The "Brand Envelope" - This forces the AI to stay elite
  const systemInstruction = `
    You are the Nail Check Technical AI. 
    Your style is: Architectural, Luxury, High-Gloss, and Elite. 
    Instructions:
    - If the user prompt is vague, apply high-end textures like 3D chrome, jelly finishes, or structural sculpting.
    - Maintain a 'Vogue' editorial photography aesthetic.
    - Focus strictly on the nail plate and technical execution.
    - Avoid messy, amateur, or 'craft-style' art. 
    User Request: ${prompt}
  `;

  const parts: any[] = [{ text: systemInstruction }];

  // Handle image-to-image if a base image exists
  if (base64Image) {
    const base64Data = base64Image.split(',')[1] || base64Image;
    parts.push({
      inlineData: {
        mimeType: "image/png",
        data: base64Data
      }
    });
  }

  // 2. Use gemini-1.5-flash to ensure compatibility and avoid 404s.
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash", 
    contents: [{ role: "user", parts: parts }],
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  const candidate = response.candidates?.[0];
  const imagePart = candidate?.content?.parts?.find(
    (part: { inlineData?: { data?: string; mimeType?: string } }) => part.inlineData
  );

  // Error handling if the AI fails to generate an actual image
  if (!imagePart?.inlineData?.data) {
    throw new Error("The AI Hub could not render this vision. Please check your canvas and try again.");
  }

  const mimeType = imagePart.inlineData.mimeType || "image/png";
  return `data:${mimeType};base64,${imagePart.inlineData.data}`;
}