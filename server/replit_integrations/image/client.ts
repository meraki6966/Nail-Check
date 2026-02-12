import { GoogleGenAI, Modality } from "@google/genai";

export const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

/**
 * Generate a nail design. 
 * If base64Image is provided, it performs an Image-to-Image modification.
 */
export async function generateImage(prompt: string, base64Image?: string): Promise<string> {

  // 1. The "Brand Envelope" - This forces the AI to stay elite
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
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  const candidate = response.candidates?.[0];
  const imagePart = candidate?.content?.parts?.find(
    (part: { inlineData?: { data?: string; mimeType?: string } }) => part.inlineData
  );

  if (!imagePart?.inlineData?.data) {
    throw new Error("The AI Hub could not render this vision. Please check your canvas and try again.");
  }

  const mimeType = imagePart.inlineData.mimeType || "image/png";
  return `data:${mimeType};base64,${imagePart.inlineData.data}`;
}