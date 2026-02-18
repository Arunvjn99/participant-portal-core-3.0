import { GoogleGenAI } from "@google/genai";
import { PortfolioData, Plan, AllocationItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPerformanceIntelligence = async (
  data: PortfolioData,
  plans: Plan[]
): Promise<{ explanation: string; optimization: string }> => {
  if (!process.env.API_KEY) {
    return {
        explanation: "Your portfolio alpha of +2.5% is primarily driven by the aggressive equity weighting in your 401(k), which captured recent tech sector momentum.",
        optimization: "Consider rebalancing the Roth IRA account to lock in recent small-cap gains and maintain your target risk profile."
    };
  }

  try {
    const prompt = `
      Act as a senior investment strategist.
      Analyze this portfolio:
      Total Return: ${data.totalGainPercent}%
      Alpha: ${data.alpha}%
      Plans: ${JSON.stringify(plans)}

      Provide two distinct outputs in JSON format:
      1. "explanation": A technical but clear sentence explaining WHY the portfolio outperformed/underperformed.
      2. "optimization": A specific, actionable recommendation for the user.

      Tone: Professional, analytical, trustworthy. No marketing fluff.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
        explanation: "Portfolio performance is tracking closely with the broader market, with slight divergence due to international exposure.",
        optimization: "Review your contribution rate to ensure you are maximizing the employer match in your primary 401(k)."
    };
  }
};

export const getPortfolioInsights = async (
  data: PortfolioData,
  allocations: AllocationItem[]
): Promise<string> => {
  if (!process.env.API_KEY) return "Portfolio is well-balanced and aligned with your long-term growth objectives.";
  
  try {
      const prompt = `
          Analyze this portfolio summary:
          Total Balance: ${data.totalBalance}
          Gain: ${data.totalGain}
          Allocations: ${JSON.stringify(allocations)}
          
          Provide a single, short, insightful sentence (max 15 words) about the portfolio health.
          Tone: Professional, encouraging.
      `;
      const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
      });
      return response.text || "Portfolio is well-balanced and aligned with your long-term growth objectives.";
  } catch (e) {
      return "Portfolio is well-balanced and aligned with your long-term growth objectives.";
  }
};

export const getAllocationInsight = async (
  allocations: AllocationItem[],
  riskProfile: string
): Promise<string> => {
  if (!process.env.API_KEY) return "Current allocation matches your risk profile with a focus on growth.";
  
  try {
      const prompt = `
          Analyze this allocation for a ${riskProfile} risk profile:
          ${JSON.stringify(allocations)}
          
          Provide a single short insight (max 12 words) about the diversification.
      `;
      const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
      });
      return response.text || "Current allocation matches your risk profile well.";
  } catch (e) {
      return "Current allocation matches your risk profile well.";
  }
};

export const getAllocationDriftAnalysis = async (
  allocations: AllocationItem[]
): Promise<string> => {
  if (!process.env.API_KEY) return "Slight drift in International Equities detected.";
  
  try {
      const prompt = `
          Analyze these allocation drifts:
          ${JSON.stringify(allocations.map(a => ({ name: a.name, drift: a.drift })))}
          
          Summarize the drift situation in one short sentence (max 10 words).
      `;
      const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
      });
      return response.text || "Slight drift detected in equity holdings.";
  } catch (e) {
      return "Slight drift detected in equity holdings.";
  }
};
