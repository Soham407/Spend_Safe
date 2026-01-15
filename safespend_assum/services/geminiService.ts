
import { GoogleGenAI } from "@google/genai";
import { FinancialSnapshot } from "../types";

export const getPanicFraming = async (snapshot: FinancialSnapshot): Promise<string> => {
  try {
    // Initialize GoogleGenAI inside the function to ensure the API key is current.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, conservative financial framing text for a freelancer in a high-stress "panic" situation. 
      Total Income: $${snapshot.totalIncome.toLocaleString()}
      Assumed Savings: $${snapshot.estimatedSavings.toLocaleString()}
      Safe to Spend: $${snapshot.safeToSpend.toLocaleString()}
      Pending Assumptions: ${snapshot.pendingCount}
      
      Tone requirements: 
      - Non-authoritative (no "you should").
      - Acknowledge uncertainty.
      - Emphasize that these are user-defined assumptions.
      - Keep it under 60 words.`,
      config: {
        temperature: 0.7,
      },
    });
    // The .text property is used directly to access the result string.
    return response.text || "Financial clarity depends on your confirmed inputs. Current numbers are snapshots of your chosen assumptions.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "This snapshot reflects your current confirmed and pending assumptions. Uncertainty increases with every unconfirmed event.";
  }
};
