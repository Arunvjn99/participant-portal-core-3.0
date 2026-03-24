/**
 * Minimal local server for /ai-assets image generation only.
 * Run: cd server && node dev-server.js
 * Requires OPENAI_API_KEY in server/.env (never commit .env).
 */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = Number(process.env.IMAGE_DEV_PORT || process.env.PORT || 3001);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

app.post("/api/generate-image", async (req, res) => {
  try {
    const openai = getOpenAI();
    if (!openai) {
      return res.status(503).json({ error: "OPENAI_API_KEY not configured" });
    }

    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      background: "transparent",
    });

    const base64 = result.data?.[0]?.b64_json;
    if (!base64) {
      console.error("OpenAI images: missing b64_json");
      return res.status(502).json({ error: "No image data in response" });
    }

    const buffer = Buffer.from(base64, "base64");

    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image generation failed" });
  }
});

app.listen(port, () => {
  console.log(`AI image dev server: http://localhost:${port} (POST /api/generate-image)`);
});
