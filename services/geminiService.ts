import { GoogleGenAI, Chat, GenerateContentResponse, Content } from "@google/genai";

let chatSession: Chat | null = null;

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const initializeChat = (history?: Content[]) => {
  const ai = getAIClient();
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are "The Operator", a sophisticated AI within a Matrix-themed financial trading system. 
      Your tone is cryptic, professional, yet highly intelligent. 
      You assist the user with financial analysis, code generation for trading strategies, and system diagnostics.
      Keep responses concise and use technical financial terminology where appropriate.`,
    },
    history: history
  });
};

export const sendMessageStream = async function* (message: string) {
  if (!chatSession) {
    initializeChat();
  }
  
  if (!chatSession) {
    throw new Error("Failed to initialize chat session");
  }

  const result = await chatSession.sendMessageStream({ message });
  
  for await (const chunk of result) {
    const c = chunk as GenerateContentResponse;
    if (c.text) {
      yield c.text;
    }
  }
};

export const generateAgentTask = async (taskPrompt: string, context: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Context: ${context}\nTask: ${taskPrompt}`,
    config: {
      systemInstruction: 'You are a specialized financial agent. Output valid JSON or structured text as requested. Do not include markdown fencing in the response if specifically asked for raw data.',
    }
  });
  return response.text || "Error executing task.";
};