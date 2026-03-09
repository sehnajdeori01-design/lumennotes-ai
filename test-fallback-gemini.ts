import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ override: true });

async function test() {
  const apiKey = process.env.GEMINI_API_KEY!.replace(/^["']|["']$/g, '');
  const ai = new GoogleGenAI({ apiKey });

  const url = "https://youtu.be/P_q7-2gkIjQ?si=OvadAuAQHLvdvho4";
  const prompt = `You are "LumenNotes AI", a premium educational assistant.
Mission: Transform raw transcripts into Apple-style structured notes.
Tone: Sophisticated, clean, and encouraging (Apple-like elegance).

Analyze the following video and extract key topics, definitions, and important dates. Make sure to highlight any specific dates, historical events, or core definitions mentioned in the content.

Video URL: ${url}
Please use your search tools to find information about this video and summarize its content.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Catchy and bold title." },
            summary: { type: Type.STRING, description: "Executive Summary: 3 sentences max." },
            lessons: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Key Lessons: Bullet points."
            },
            deepDive: { type: Type.STRING, description: "Detailed explanation of complex terms." },
            actionable: { type: Type.STRING, description: "What should the user do next?" },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  q: { type: Type.STRING, description: "Question" },
                  a: { type: Type.STRING, description: "Answer" }
                },
                required: ["q", "a"]
              },
              description: "3 Q&A pairs for revision."
            }
          },
          required: ["title", "summary", "lessons", "deepDive", "actionable", "flashcards"]
        }
      }
    });
    console.log(response.text);
  } catch (err: any) {
    console.error("Error:", err.message || err);
  }
}

test();
