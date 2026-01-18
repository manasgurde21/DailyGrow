import { GoogleGenAI } from "@google/genai";
import { Habit, Task } from '../types';

const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is not defined.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateDailyMotivation = async (
  completedCount: number, 
  totalCount: number
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Keep pushing forward! You're doing great.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, punchy, inspiring motivational quote (max 15 words) for a user who has completed ${completedCount} out of ${totalCount} habits today. If they have done 0, be encouraging. If they are almost done, tell them to finish strong.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Believe you can and you're halfway there.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Every small step counts towards a bigger goal.";
  }
};

export const generateHabitInsight = async (habits: Habit[]): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Consistency is key to building lasting habits.";

  try {
    const habitSummary = habits.map(h => `${h.name} (Streak: ${h.streak})`).join(', ');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Here are the user's current habits and streaks: ${habitSummary}. Give one specific, actionable piece of advice (max 25 words) on how to improve or maintain these streaks.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Tracking your habits is the first step to changing them.";
  } catch (error) {
    return "Stay consistent and patient with yourself.";
  }
};