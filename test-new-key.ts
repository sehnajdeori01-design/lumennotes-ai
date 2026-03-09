import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ override: true });

async function test() {
  try {
    const apiKey = process.env.GEMINI_API_KEY!.replace(/^["']|["']$/g, '');
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Hello",
    });
    console.log(response.text);
  } catch (err: any) {
    console.error(err.message || err);
  }
}

test();
