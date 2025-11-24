import { GoogleGenAI } from "@google/genai";

// ============================================================
// AI 客户端工厂函数
// ============================================================
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
};

// ============================================================
// 提示词优化函数
// 使用 Gemini AI 优化用户输入的提示词，使其更加有效
// ============================================================
/**
 * Optimizes a user's raw prompt using Gemini.
 */
export const optimizePrompt = async (currentContent: string): Promise<string> => {
  if (!import.meta.env.VITE_API_KEY) {
    throw new Error("API Key is missing. Please select a paid API key to use AI features.");
  }

  const ai = getAiClient();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Improve the following prompt to be more effective for an LLM. 
      Keep the core intent but add necessary context, persona, or constraints if missing. 
      Do not add conversational filler. Just return the improved prompt text.
      
      Original Prompt:
      ${currentContent}`,
      config: {
        systemInstruction: "You are an expert Prompt Engineer. Your goal is to refine prompts to be clear, concise, and highly effective for Large Language Models.",
        temperature: 0.7,
      }
    });

    const text = response.text;
    return text || currentContent;
  } catch (error) {
    console.error("Failed to optimize prompt:", error);
    throw error;
  }
};

// ============================================================
// 主题提示词生成函数
// 根据给定主题生成一个完整的提示词
// ============================================================
/**
 * Generates a prompt based on a topic.
 */
export const generatePromptFromTopic = async (topic: string): Promise<string> => {
  if (!import.meta.env.VITE_API_KEY) {
    throw new Error("API Key is missing. Please select a paid API key to use AI features.");
  }

  const ai = getAiClient();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a high-quality prompt for the following task/topic: ${topic}`,
      config: {
        systemInstruction: "You are a helpful assistant that writes detailed, structured prompts.",
      }
    });
    return response.text || "";
  } catch (error) {
    console.error("Failed to generate prompt:", error);
    throw error;
  }
};