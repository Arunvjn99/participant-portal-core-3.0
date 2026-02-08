/**
 * Gemini API Client
 * Rewrites intent strings into natural, clear sentences
 */

export async function generateMessage(intent: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY environment variable is not set");
  }

  const systemPrompt = `You are a retirement enrollment assistant. Your role is to rewrite the provided intent into a natural, clear sentence.

Constraints:
- Do not ask unrelated questions
- Do not invent steps
- Do not add small talk
- Only rewrite the provided intent clearly
- Keep the message concise and professional
- Focus on the specific task at hand

Return only the rewritten sentence, nothing else.`;

  const userPrompt = `Rewrite this intent into a natural, clear sentence: "${intent}"`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\n${userPrompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts ||
      !data.candidates[0].content.parts[0] ||
      !data.candidates[0].content.parts[0].text
    ) {
      throw new Error("Invalid response format from Gemini API");
    }

    const generatedText = data.candidates[0].content.parts[0].text.trim();
    return generatedText;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to generate message: ${String(error)}`);
  }
}
