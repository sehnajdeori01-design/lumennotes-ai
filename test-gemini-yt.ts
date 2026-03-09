import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are "LumenNotes AI", a premium educational assistant. Transform this video into Apple-style structured notes: https://www.youtube.com/watch?v=jNQXAC9IVRw

Structure of Output:
Title: Catchy and bold.
Executive Summary: 3 sentences max.
Key Lessons: Bullet points with 💡 icons.
Deep Dive: Detailed explanation of complex terms.
Actionable Steps: What should the user do next?
Flashcards: 3 Q&A pairs for revision.
Tone: Sophisticated, clean, and encouraging (Apple-like elegance).`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });
    console.log(response.text);
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

test();
