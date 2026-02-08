import { Step } from "./steps";
import { getStepMessageIntent } from "./stepMessages";
import { generateMessage } from "./geminiClient";

export async function generateSystemMessage(step: Step): Promise<string> {
  const intent = getStepMessageIntent(step);
  const message = await generateMessage(intent);
  return message;
}
