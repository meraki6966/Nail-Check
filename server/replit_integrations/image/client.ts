import { GoogleGenAI, Modality } from "@google/genai";

// Prevents 'project' undefined error by passing as an options object
export const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY!
});

export async function generateImage(prompt: string, base64Image?: string): Promise<string> {
  const systemInstruction = `
    You are the Nail Check Technical AI... [Your Elite Instructions]
    User Request: ${prompt}
  `;

  const parts: any[] = [{ text: systemInstruction }];

  if (base64Image) {
    // Cleanly strips the data URL prefix if it exists
    const base64Data = base64Image.split(',')[1] || base64Image;
    parts.push({
      inlineData: {
        mimeType: "image/png",
        data: base64Data
      }
    });
  }

  const response = await ai.models.generateContent({
    // Using the high-fidelity 2026 model for Tier 1 Billing accounts
    model: "gemini-3-pro-image-preview", 
    contents: [{ role: "user", parts: parts }],
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  const candidate = response.candidates?.[0];
  const imagePart = candidate?.content?.parts?.find(
    (part: any) => part.inlineData
  );

  if (!imagePart?.inlineData?.data) {
    throw new Error("The AI Hub could not render this vision. Please check your regional settings.");
  }

  const mimeType = imagePart.inlineData.mimeType || "image/png";
  return `data:${mimeType};base64,${imagePart.inlineData.data}`;
}