/**
 * Core AI — local scripted assistant only (no external LLM or /api/core-ai).
 * Kept for type compatibility and Bella fallback text.
 */

export interface CoreAIRequest {
  message: string;
  context?: Record<string, unknown>;
}

export interface CoreAIResponse {
  reply: string;
  filtered: boolean;
  isFallback: boolean;
  type?: string;
  spoken_text?: string;
  ui_data?: Record<string, unknown>;
  confidence?: "high" | "medium" | "low";
  data_sources?: string[];
}

/**
 * Returns a deterministic local reply (no network).
 */
export async function sendCoreAIMessage(
  message: string,
  _context?: CoreAIRequest["context"],
  _accessToken?: string | null,
): Promise<CoreAIResponse> {
  const { getLocalAssistantReply } = await import("@/core/ai/bellaLocalReply");
  const reply = getLocalAssistantReply(message);
  return {
    reply,
    filtered: false,
    isFallback: false,
    spoken_text: reply,
    confidence: "high",
  };
}
