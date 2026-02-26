/**
 * @deprecated All AI must go through /api/core-ai. Do not call LLMs from the frontend.
 * This module is kept only to avoid breaking existing imports; it no longer calls any API.
 */

export async function generateMessage(intent: string): Promise<string> {
  throw new Error(
    "Frontend Gemini is disabled. All AI must go through /api/core-ai. Use sendCoreAIMessage with a valid session token instead."
  );
}
