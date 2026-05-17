import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
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
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to communicate with the Botanist AI." });
    }
  });

  app.post("/api/botanist/recommend", async (req, res) => {
    try {
      const { answers } = req.body;
      const prompt = `Act as a senior botanist. Based on these environment details: ${JSON.stringify(answers)}, recommend 3 specific houseplants. 
      If 'pets' is 'restrictive', you MUST only recommend non-toxic, pet-safe plants.
      Consider light level '${answers.light}', humidity '${answers.humidity}', and care effort '${answers.experience}'.
      Provide unique and highly suitable recommendations.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", description: "The common name of the plant" },
                reason: { type: "string", description: "Specifically why this plant matches the user's answers" },
                careLevel: { type: "string", enum: ["Easy", "Intermediate", "Expert"] },
                light: { type: "string", description: "Specific light requirements for this plant" }
              },
              required: ["name", "reason", "careLevel", "light"]
            }
          }
        },
      });

      res.json(JSON.parse(response.text || "[]"));
    } catch (error) {
      console.error("Recommendation Error:", error);
      res.status(500).json({ error: "The botanical index is currently inaccessible." });
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
            type: "object",
            properties: {
              careTips: { 
                type: "array", 
                items: { type: "string" },
                description: "3-4 detailed care instructions"
              },
              troubleshooting: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    issue: { type: "string", description: "Common problem" },
                    solution: { type: "string", description: "How to fix it" }
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
    } catch (error) {
      console.error("Tips Error:", error);
      res.status(500).json({ error: "Failed to retrieve advanced botanical tips." });
    }
  });

  // Vite Middleware / Static Files
  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
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
