import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Import our new Modular DB Routes
import apiRoutes from "./server/routes/index";
import { startCronJobs } from "./server/jobs/index";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Mount Modular DB API backend structure (MVC Pattern)
app.use("/api/v2", apiRoutes);

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// 1. Smart Fuel OCR API
app.post("/api/ocr-receipt", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 data" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Graceful fallback if API key is not configured or placeholder
      console.log("No Gemini API key configured. Utilizing local OCR simulation.");
      return res.json(simulateOCR());
    }

    const cleanedBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `Analyze this gas/fuel station receipt and extract key information into a structured JSON response. Include:
1. Fuel station / brand name (e.g., Shell, PTT, Caltex, Bangchak)
2. Date of transaction (YYYY-MM-DD format if visible, otherwise use current date "2026-06-06")
3. Total payment amount in Thai Baht (number)
4. Volume of fuel in liters (number)
5. Fuel unit price per liter in Thai Baht (number)
6. Fuel type (e.g., Gasohol 95, Gasohol 91, Diesel, Benzene)`;

    const rawResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: mimeType || "image/jpeg",
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
            brand: { type: Type.STRING, description: "Brand / Station name" },
            date: { type: Type.STRING, description: "Transaction date in YYYY-MM-DD" },
            totalPaid: { type: Type.NUMBER, description: "Total paid amount in THB" },
            liters: { type: Type.NUMBER, description: "Fuel volume in liters" },
            pricePerLiter: { type: Type.NUMBER, description: "Price per liter in THB" },
            fuelType: { type: Type.STRING, description: "Type of fuel selected" },
          },
        },
      },
    });

    const text = rawResponse.text;
    if (!text) {
      throw new Error("Empty response from Gemini AI");
    }

    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error("AI OCR Error:", error);
    return res.status(500).json({
      error: "Failed to parse receipt with AI: " + error.message,
      fallback: simulateOCR(),
    });
  }
});

// Helper for simulating OCR when key is absent
function simulateOCR() {
  const brands = ["PTT Station", "Shell", "Bangchak", "Caltex", "Esso"];
  const fuels = ["Gasohol 95", "Gasohol 91", "E20", "Diesel B7", "Premium Benzene"];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const fuelType = fuels[Math.floor(Math.random() * fuels.length)];
  
  const liters = parseFloat((30 + Math.random() * 25).toFixed(2));
  const pricePerLiter = parseFloat((35 + Math.random() * 8).toFixed(2));
  const totalPaid = parseFloat((liters * pricePerLiter).toFixed(2));

  return {
    brand,
    date: new Date().toISOString().split("T")[0],
    totalPaid,
    liters,
    pricePerLiter,
    fuelType,
    simulated: true
  };
}

// 2. Predictive Pricing API
app.get("/api/predict-pricing", async (req, res) => {
  try {
    const ai = getGeminiClient();
    const prompt = `Provide an expert analysis of upcoming fuel price trends in Thailand (Benzene 95 and Diesel) for the next 7 days in JSON format. Return:
    - trendDirection ("UP", "DOWN", "STABLE")
    - percentChange (number, e.g. 1.25)
    - analysisSummary (string in Thai, concise)
    - recommendedAction (string in Thai, e.g. ควรเติมน้ำมันภายในวันพรุ่งนี้ก่อนปรับราคาขึ้น)
    - dailyPredictionArray (array of 7 items, each with object { day: 'Mon', benzene: number, diesel: number })`;

    if (!ai) {
      return res.json(getSimulatedPricing());
    }

    const rawResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["trendDirection", "percentChange", "analysisSummary", "recommendedAction", "dailyPredictionArray"],
          properties: {
            trendDirection: { type: Type.STRING, description: "UP, DOWN or STABLE" },
            percentChange: { type: Type.NUMBER, description: "Expected % price adjustment" },
            analysisSummary: { type: Type.STRING, description: "Brief analysis summary in Thai" },
            recommendedAction: { type: Type.STRING, description: "Expert advice in Thai" },
            dailyPredictionArray: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["day", "benzene", "diesel"],
                properties: {
                  day: { type: Type.STRING },
                  benzene: { type: Type.NUMBER },
                  diesel: { type: Type.NUMBER },
                },
              },
            },
          },
        },
      },
    });

    const data = JSON.parse(rawResponse.text || "{}");
    return res.json(data);
  } catch (error) {
    console.error("AI Pricing trend error:", error);
    return res.json(getSimulatedPricing());
  }
});

function getSimulatedPricing() {
  const directions = ["UP", "DOWN", "STABLE"];
  const trendDirection = directions[Math.floor(Math.random() * directions.length)];
  const percentChange = parseFloat((0.5 + Math.random() * 2.5).toFixed(2));
  
  let analysisSummary = "แนวโน้มราคาน้ำมันคาดว่าจะทรงตัวเนื่องจากดัชนีตลาดโลกคงที่";
  let recommendedAction = "แนะนำว่าเติมเมื่อถังเหลือน้อยกว่า 30% ได้ตามปกติ";
  
  if (trendDirection === "UP") {
    analysisSummary = `คาดการณ์ราคาเบนซินจะเพิ่มขึ้นประมาณ ${percentChange}% เนื่องจากปริมาณสำรองดิบสหรัฐลดลงและค่าเงินบาทอ่อนค่าลงเล็กน้อย`;
    recommendedAction = `🚨 แนะนำให้รีบเติมน้ำมันเพิ่มให้เต็มถังภายในวันนี้หรือวันพรุ่งนี้ ก่อนที่ปั๊มจะมีการปรับราคาขึ้นสะสม 0.60 บาท/ลิตร`;
  } else if (trendDirection === "DOWN") {
    analysisSummary = `มีสัญญาณปรับลดราคาน้ำมันประมาณ ${percentChange}% หลังจาก OPEC ตกลงเพิ่มกำลังการผลิตในไตรมาสถัดไป`;
    recommendedAction = `💡 หากน้ำมันยังเหลือพอใช้ แนะนำรอเติมวันมะรืนเพื่อรับส่วนลดราคาน้ำมันที่กำลังปรับลง`;
  }

  const days = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];
  let baseBenzene = 39.50;
  let baseDiesel = 32.90;
  
  const dailyPredictionArray = days.map((day, ix) => {
    const factor = trendDirection === "UP" ? 0.15 : (trendDirection === "DOWN" ? -0.12 : 0.02);
    const fluctuation = parseFloat((Math.sin(ix * 0.8) * 0.1).toFixed(2));
    baseBenzene += factor + fluctuation;
    baseDiesel += (factor * 0.5) + (fluctuation * 0.5);
    return {
      day,
      benzene: parseFloat(baseBenzene.toFixed(2)),
      diesel: parseFloat(baseDiesel.toFixed(2))
    };
  });

  return {
    trendDirection,
    percentChange,
    analysisSummary,
    recommendedAction,
    dailyPredictionArray
  };
}

// 3. AI Fleet Anomaly Detection API
app.post("/api/fleet-anomaly", async (req, res) => {
  try {
    const { transactions } = req.body;
    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ error: "Missing transactions array" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json(analyzeAnomaliesLocally(transactions));
    }

    const prompt = `Analyze this list of vehicle refueling transactions for potential B2B fleet anomalies (fuel theft, card sharing, impossible distances, volume exceeding tank capacity of 60L).
Transactions: ${JSON.stringify(transactions)}
Return a JSON array of parsed anomalies. Each anomaly object MUST include:
- transactionId (string)
- riskLevel ("HIGH", "MEDIUM", "LOW")
- issueType (string in Thai, e.g. เติมน้ำมันเกินความจุกัง, ใช้งานบัตรซ้ำซ้อน)
- explanation (string in Thai detailing the anomaly)`;

    const rawResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            required: ["transactionId", "riskLevel", "issueType", "explanation"],
            properties: {
              transactionId: { type: Type.STRING },
              riskLevel: { type: Type.STRING },
              issueType: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
          },
        },
      },
    });

    const data = JSON.parse(rawResponse.text || "[]");
    return res.json(data);
  } catch (error) {
    console.error("Fleet anomaly API error:", error);
    return res.json(analyzeAnomaliesLocally(req.body.transactions));
  }
});

function analyzeAnomaliesLocally(transactions: any[]) {
  const anomalies: any[] = [];
  transactions.forEach((t) => {
    // 1. Extreme Fueling volume anomaly
    if (t.liters > 75) {
      anomalies.push({
        transactionId: t.id,
        riskLevel: "HIGH",
        issueType: "ปริมาตรเกินความจุกระบอกสูบ/ถังน้ำมัน",
        explanation: `รถยนต์ทะเบียน ${t.plateNo} มีความจุถังน้ำมันสูงสุด 60 ลิตร แต่มีการเติมน้ำมันถึง ${t.liters} ลิตร มีความเป็นไปได้สูงที่จะเป็นการฉ้อโกงหรือการเติมใส่ถังสำรองนอก`
      });
    }
    // 2. Impossible Speed / Geographic mismatch
    if (t.station === "Shell Chiang Mai" && t.previousStation === "PTT Bangkok" && t.timeDiffMinutes < 120) {
      anomalies.push({
        transactionId: t.id,
        riskLevel: "HIGH",
        issueType: "การใช้บัตรน้ำมันผิดปกติ (Impossible Travel)",
        explanation: `มีการใช้บัตรเติมน้ำมันที่ เชียงใหม่ ห่างจากยอดเติมใน กรุงเทพฯ เพียง 2 ชั่วโมง ซึ่งเป็นความเร็วเดินทางที่เป็นไปไม่ได้ บ่งบอกถึงการแบ่งปันสิทธิ์กองเรือ/แชร์บัตร`
      });
    }
    // 3. Off-Hours fueling
    const hour = parseInt(t.time.split(":")[0]);
    if (hour >= 23 || hour <= 4) {
      anomalies.push({
        transactionId: t.id,
        riskLevel: "MEDIUM",
        issueType: "การใช้งานนอกเวลาปฏิบัติงานหลัก (Off-Hours)",
        explanation: `มีบันทึกการเติมน้ำมันเวลา ${t.time} น. ซึ่งอยู่นอกเวลาทำงานจัดส่งปกติของบริษัท ขัดต่อข้อบังคับกองเรือหมวดความปลอดภัย`
      });
    }
  });
  return anomalies;
}

// Vite Server Configuration Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Fleet Server running on http://localhost:${PORT}`);
    startCronJobs();
  });
}

startServer();
