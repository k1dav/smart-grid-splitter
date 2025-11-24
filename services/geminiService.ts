import { GoogleGenAI } from "@google/genai";

export const analyzeImageForSplitting = async (base64Image: string, mimeType: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key is missing. Unable to analyze image.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base64Data = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this image. Briefly describe its structure and suggest an optimal grid layout (rows x columns) for splitting it if it looks like a sprite sheet, comic page, or Instagram puzzle. If it's just a regular photo, just describe the content briefly."
          },
        ],
      },
    });

    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to analyze the image. Please ensure your API key is valid.";
  }
};
