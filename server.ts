import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const IS_PROD = process.env.NODE_ENV === "production";

async function startServer() {
  const app = express();
  app.use(express.json());

  // Gemini Setup
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.post("/api/botanist/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are the 'Sprout Botanist AI', a refined and knowledgeable plant expert. You provide clear, scientific but accessible advice on plant care, species identification, and troubleshooting (like root rot, light issues, etc.). Keep responses concise and use a warm, high-end botanical tone. If asked about a plant not in your expertise, admit it but offer general horticultural principles.",
        },
        history: history || [],
      });

      const response = await chat.sendMessage({ message });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Chat Error:", error);
      res.status(500).json({ 
        error: "Failed to communicate with the Botanist AI.",
        details: error?.message || String(error)
      });
    }
  });

  app.post("/api/botanist/recommend", async (req, res) => {
    try {
      console.log("Recommend Request:", req.body);
      const { answers } = req.body;
      const prompt = `Act as a senior botanist. Based on these environment details: ${JSON.stringify(answers)}, recommend 3 specific houseplants. 
      If 'pets' is 'restrictive', you MUST only recommend non-toxic, pet-safe plants.
      Consider light level '${answers.light}', humidity '${answers.humidity}', and care effort '${answers.experience}'.
      Provide unique and highly suitable recommendations.
      For each plant, also provide 2 dynamic stats: 'growthPotential' and 'oxygenDensity' as integers between 60 and 98 based on the plant's characteristics.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "The common name of the plant" },
                scientificName: { type: Type.STRING, description: "The botanical name" },
                reason: { type: Type.STRING, description: "Specifically why this plant matches the user's answers" },
                careLevel: { type: Type.STRING, enum: ["Easy", "Intermediate", "Expert"] },
                waterInterval: { type: Type.NUMBER, description: "Recommended watering interval in days" },
                light: { type: Type.STRING, description: "Specific light requirements for this plant" },
                growthPotential: { type: Type.NUMBER },
                oxygenDensity: { type: Type.NUMBER }
              },
              required: ["name", "scientificName", "reason", "careLevel", "waterInterval", "light", "growthPotential", "oxygenDensity"]
            }
          }
        },
      });

      console.log("Recommend AI Response:", response.text);
      res.json(JSON.parse(response.text || "[]"));
    } catch (error: any) {
      console.error("Recommendation Error:", error);
      res.status(500).json({ 
        error: "The botanical index is currently inaccessible.",
        details: error?.message || String(error)
      });
    }
  });

  app.post("/api/botanist/tips", async (req, res) => {
    try {
      const { plantName, scientificName } = req.body;
      const prompt = `Act as a senior botanist. Provide detailed care tips and troubleshooting advice for the houseplant '${plantName}' (${scientificName}). 
      Focus on expert-level watering nuances, specific humidity preferences, and common issues (like yellowing leaves or pests) with solutions.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              careTips: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "3-4 detailed care instructions"
              },
              troubleshooting: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    issue: { type: Type.STRING, description: "Common problem" },
                    solution: { type: Type.STRING, description: "How to fix it" }
                  },
                  required: ["issue", "solution"]
                },
                description: "2-3 common problems and their solutions"
              }
            },
            required: ["careTips", "troubleshooting"]
          }
        },
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Tips Error:", error);
      res.status(500).json({ 
        error: "Failed to retrieve advanced botanical tips.",
        details: error?.message || String(error)
      });
    }
  });

  app.post("/api/botanist/search", async (req, res) => {
    try {
      console.log("Search Request:", req.body);
      const { query } = req.body;
      const prompt = `Act as a senior botanist. Provide technical details for the plant matching the query: '${query}'.
      If the query is ambiguous, pick the most common houseplant. 
      Return structured data including its common name, scientific name, typical water interval in days (integer), light requirements, humidity needs, and a short description.
      Also include 3-4 detailed care tips and 2-3 troubleshooting issues with solutions.
      Also provide 2 dynamic stats: 'growthPotential' and 'oxygenDensity' as integers between 60 and 98.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              scientificName: { type: Type.STRING },
              waterInterval: { type: Type.NUMBER, description: "Suggested interval in days for watering" },
              category: { type: Type.STRING, enum: ["Succulents", "Leafy", "Flowering", "Trees", "Cacti"] },
              careLevel: { type: Type.STRING, enum: ["Easy", "Intermediate", "Expert"] },
              light: { type: Type.STRING },
              humidity: { type: Type.STRING },
              description: { type: Type.STRING },
              growthPotential: { type: Type.NUMBER },
              oxygenDensity: { type: Type.NUMBER },
              careTips: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }
              },
              troubleshooting: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    issue: { type: Type.STRING },
                    solution: { type: Type.STRING }
                  },
                  required: ["issue", "solution"]
                }
              }
            },
            required: ["name", "scientificName", "careLevel", "waterInterval", "category", "light", "humidity", "description", "careTips", "troubleshooting", "growthPotential", "oxygenDensity"]
          }
        },
      });

      console.log("Search AI Response:", response.text);
      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Search Error:", error);
      res.status(500).json({ 
        error: "Failed to retrieve botanical data for this species.",
        details: error?.message || String(error)
      });
    }
  });

  // Vite Middleware / Static Files
  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
