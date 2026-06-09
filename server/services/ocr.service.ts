import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: { "User-Agent": "aistudio-build" },
        },
      });
    }
  }
  return aiClient;
}

export const processReceiptOcr = async (imageBase64: string, mimeType: string = "image/jpeg") => {
  const ai = getGeminiClient();
  
  if (!ai) {
    console.log("No Gemini API key. Utilizing simulated OCR.");
    return {
      brand: "PTT Station",
      date: new Date().toISOString().split("T")[0],
      totalPaid: 1000.0,
      liters: 30.45,
      pricePerLiter: 32.84,
      fuelType: "Gasohol 95",
      simulated: true
    };
  }

  const cleanedBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  const prompt = `Analyze this gas/fuel station receipt and extract key information into a structured JSON response. Include:
1. Fuel station / brand name (e.g., Shell, PTT, Caltex, Bangchak)
2. Date of transaction (YYYY-MM-DD format if visible, otherwise use current date)
3. Total payment amount in Thai Baht (number)
4. Volume of fuel in liters (number)
5. Fuel unit price per liter in Thai Baht (number)
6. Fuel type (e.g., Gasohol 95, Gasohol 91, Diesel, Benzene)`;

  const rawResponse = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [
      {
        inlineData: {
          mimeType: mimeType,
          data: cleanedBase64,
        },
      },
      prompt,
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
         type: Type.OBJECT,
         required: ["brand", "date", "totalPaid", "liters", "pricePerLiter", "fuelType"],
         properties: {
             brand: { type: Type.STRING },
             date: { type: Type.STRING },
             totalPaid: { type: Type.NUMBER },
             liters: { type: Type.NUMBER },
             pricePerLiter: { type: Type.NUMBER },
             fuelType: { type: Type.STRING },
         }
      }
    },
  });

  const text = rawResponse.text;
  if (!text) throw new Error("Empty response from Gemini AI");
  return JSON.parse(text);
};
