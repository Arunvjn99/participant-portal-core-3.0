/**
 * Core AI Service — Frontend client for the data-backed retirement assistant.
 * All AI goes through /api/core-ai with JWT. No local mock or fallback.
 */

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
 * Send a user message to the Core AI backend.
 * Requires a valid Supabase JWT. Backend resolves intent, fetches DB data, and returns structured response.
 */
export async function sendCoreAIMessage(
  message: string,
  context?: CoreAIRequest["context"],
  accessToken?: string | null
): Promise<CoreAIResponse> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch("/api/core-ai", {
      method: "POST",
      headers,
      body: JSON.stringify({ message, context: context ?? {} }),
    });

    if (response.status === 401) {
      return {
        reply: "Please sign in to use Core AI.",
        filtered: false,
        isFallback: false,
      };
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      reply: data.reply ?? data.spoken_text ?? "",
      filtered: data.filtered ?? false,
      isFallback: false,
      type: data.type,
      spoken_text: data.spoken_text ?? data.reply,
      ui_data: data.ui_data ?? {},
      confidence: data.confidence,
      data_sources: Array.isArray(data.data_sources) ? data.data_sources : undefined,
    };
  } catch (error) {
    console.warn("Core AI backend unavailable:", (error as Error).message);
    return {
      reply: "Core AI is temporarily unavailable. Please try again later.",
      filtered: false,
      isFallback: true,
    };
  }
}
