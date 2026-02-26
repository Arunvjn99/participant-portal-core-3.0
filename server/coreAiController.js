/**
 * Core AI Controller — Data-backed retirement assistant with Gemini.
 * Uses structured prompt builder and deterministic confidence. Returns data_sources.
 */

import { model } from "./geminiClient.js";
import { buildStructuredPrompt } from "./promptBuilder.js";

const SYSTEM_PROMPT = `You are a US retirement assistant for a participant portal.
- Use ONLY the provided structured data below. If a section says "Value unavailable", state that the information is not available. Never fabricate financial numbers.
- Keep spoken_text concise (1-3 sentences). Be professional and encouraging.
- Respond with valid JSON only, no markdown or extra text.`;

const JSON_SCHEMA = `Respond with exactly this JSON shape:
{
  "type": "<intent type, e.g. balance_answer>",
  "spoken_text": "<short answer for the user>",
  "ui_data": { "<key>": <value> for any numbers or facts to show in UI, e.g. balance, vested_balance, or {} },
  "confidence": "high" | "medium" | "low"
}`;

/**
 * Deterministic confidence from data sources. Overrides model output.
 * high = retirement_accounts or plan_rules present
 * medium = retirement_knowledge only
 * low = no data or partial
 */
export function computeDeterministicConfidence(sources) {
  if (!Array.isArray(sources)) return "low";
  const has = (name) => sources.includes(name);
  if (has("retirement_accounts") || has("plan_rules")) return "high";
  if (has("retirement_knowledge") && sources.length === 1) return "medium";
  return "low";
}

function parseStructuredResponse(text, intent) {
  const trimmed = text.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        type: parsed.type ?? intent,
        spoken_text: parsed.spoken_text ?? trimmed,
        ui_data: parsed.ui_data != null ? parsed.ui_data : {},
      };
    } catch (_) {
      /* fall through */
    }
  }
  return {
    type: intent,
    spoken_text: trimmed || "I couldn't generate a response. Please try again.",
    ui_data: {},
  };
}

/**
 * Generate data-backed reply. Intent, data, and sources from intentResolver + retirementService.
 * Confidence is deterministic from sources; data_sources returned for API and logging.
 * @param {string} userMessage
 * @param {{ intent: string, data: object, serverContext: object, sources: string[] }} options
 * @returns {Promise<{ reply, filtered, type, spoken_text, ui_data, confidence, data_sources }>}
 */
export async function generateCoreReply(userMessage, options = {}) {
  const { intent, data = {}, serverContext, sources = [] } = options;

  if (!model) {
    return {
      reply: "I'm currently unable to process your request. Please try again later or contact support.",
      filtered: false,
      type: intent,
      spoken_text: "I'm currently unable to process your request. Please try again later or contact support.",
      ui_data: {},
      confidence: "low",
      data_sources: sources,
      error: "Gemini model not initialized",
    };
  }

  const contextBlock = buildStructuredPrompt(intent, data, serverContext, userMessage);
  const fullPrompt = `${SYSTEM_PROMPT}

${contextBlock}

${JSON_SCHEMA}`;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    const structured = parseStructuredResponse(text, intent);

    const confidence = computeDeterministicConfidence(sources);

    return {
      reply: structured.spoken_text,
      filtered: false,
      type: structured.type,
      spoken_text: structured.spoken_text,
      ui_data: structured.ui_data,
      confidence,
      data_sources: sources,
    };
  } catch (error) {
    console.error("Gemini API error:", error.message);

    if (error.status === 429 || error.message?.includes("429")) {
      return {
        reply: "I'm receiving a lot of questions right now. Please wait a moment and try again.",
        filtered: false,
        type: intent,
        spoken_text: "I'm receiving a lot of questions right now. Please wait a moment and try again.",
        ui_data: {},
        confidence: "low",
        data_sources: sources,
        error: "rate_limited",
      };
    }

    return {
      reply: "I'm having trouble right now. Please try again in a moment.",
      filtered: false,
      type: intent,
      spoken_text: "I'm having trouble right now. Please try again in a moment.",
      ui_data: {},
      confidence: "low",
      data_sources: sources,
      error: error.message,
    };
  }
}
