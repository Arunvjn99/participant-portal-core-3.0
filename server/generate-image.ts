import OpenAI from "openai";
import type { Request, Response } from "express";

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export async function generateImageHandler(req: Request, res: Response) {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      return res.status(503).json({ error: "OpenAI API key not configured" });
    }

    const { prompt } = req.body as { prompt?: string };

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
      console.error("OpenAI images: missing b64_json in response");
      return res.status(502).json({ error: "Image generation returned no image data" });
    }

    const imageBuffer = Buffer.from(base64, "base64");

    res.setHeader("Content-Type", "image/png");
    res.send(imageBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image generation failed" });
  }
}
