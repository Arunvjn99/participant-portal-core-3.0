/**
 * Core AI Service — Frontend client for the data-backed retirement assistant.
 * In development, Vite proxies /core-ai to the n8n webhook to avoid CORS.
 */

const CORE_AI_ENDPOINT = "/core-ai";

export interface CoreAIRequest {
  message: string;
  context?: Record<string, unknown>;
}

export interface CoreAIResponse {
  reply: string;
  filtered: boolean;
  /** True when the response came from a local/fallback path (e.g. backend unreachable) */
  isFallback: boolean;
  type?: string;
  spoken_text?: string;
  ui_data?: Record<string, unknown>;
  confidence?: "high" | "medium" | "low";
  /** Table names that contributed data (e.g. retirement_accounts, plan_rules) */
  data_sources?: string[];
}

/**
 * Send a user message to the n8n webhook (Core AI).
 * Payload: { message, context }. Webhook returns { reply }.
 */
export async function sendCoreAIMessage(
  message: string,
  context?: CoreAIRequest["context"],
  _accessToken?: string | null
): Promise<CoreAIResponse> {
  const payload = { message, context: context ?? {} };

  try {
    console.log("[Core AI] endpoint:", CORE_AI_ENDPOINT);
    console.log("[Core AI] request payload:", payload);

    const response = await fetch(CORE_AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        context: context ?? {},
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[Core AI] server error:", text);
      throw new Error(`AI request failed with status ${response.status}`);
    }

    let data: Record<string, unknown>;
    const text = await response.text();
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      console.error("[Core AI] invalid JSON response:", text);
      throw new Error("AI server returned invalid JSON");
    }

    console.log("[Core AI] raw response:", data);

    const reply =
      (data.reply as string) ||
      (data.content as { parts?: Array<{ text?: string }> })?.parts?.[0]?.text ||
      (data.text as string) ||
      (data.message as string) ||
      "No response from AI";

    return {
      reply,
      type: "text",
      confidence: "high",
      filtered: false,
      isFallback: false,
      spoken_text: reply,
    };
  } catch (error) {
    console.error("Core AI request failed:", error);
    return {
      reply: "Core AI is temporarily unavailable.",
      isFallback: true,
      filtered: false,
    };
  }
}
