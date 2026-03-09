import express from "express";
import { createServer as createViteServer } from "vite";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { YoutubeTranscript } from "youtube-transcript";

dotenv.config({ override: true });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  console.log("Server starting. GEMINI_API_KEY present:", !!process.env.GEMINI_API_KEY);

  // Razorpay Order Creation
  app.post("/api/razorpay/create-order", async (req, res) => {
    try {
      const { planId } = req.body;

      if (!process.env.RAZORPAY_KEY_SECRET || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        console.error("Razorpay keys are missing");
        return res.status(500).json({ error: "Server configuration error" });
      }

      const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.replace(/^["']|["']$/g, '');
      const key_secret = process.env.RAZORPAY_KEY_SECRET.replace(/^["']|["']$/g, '');

      const razorpay = new Razorpay({
        key_id,
        key_secret,
      });

      // Amount in paise
      const amount = planId === 'pro' ? 99900 : 199900; 

      const options = {
        amount: amount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
      };

      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error) {
      console.error("Razorpay Error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Razorpay UPI Transaction
  app.post("/api/razorpay/upi-transaction", async (req, res) => {
    try {
      const { planId, upiId } = req.body;

      if (!process.env.RAZORPAY_KEY_SECRET || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        return res.status(500).json({ error: "Server configuration error" });
      }

      if (!upiId || !upiId.includes('@')) {
        return res.status(400).json({ error: "Invalid UPI ID" });
      }

      const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.replace(/^["']|["']$/g, '');
      const key_secret = process.env.RAZORPAY_KEY_SECRET.replace(/^["']|["']$/g, '');

      const razorpay = new Razorpay({
        key_id,
        key_secret,
      });

      const amount = planId === 'pro' ? 99900 : 199900; 

      const options = {
        amount: amount,
        currency: "INR",
        receipt: `upi_receipt_${Date.now()}`,
        payment_capture: 1,
        notes: {
          type: 'UPI_COLLECT',
          upi_id: upiId
        }
      };

      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error) {
      console.error("Razorpay UPI Error:", error);
      res.status(500).json({ error: "Failed to create UPI transaction" });
    }
  });

  // Razorpay Verification
  app.post("/api/razorpay/verify", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!process.env.RAZORPAY_KEY_SECRET) {
        return res.status(500).json({ error: "Server configuration error" });
      }

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      
      const key_secret = process.env.RAZORPAY_KEY_SECRET.replace(/^["']|["']$/g, '');

      const expectedSignature = crypto
        .createHmac("sha256", key_secret)
        .update(body.toString())
        .digest("hex");

      const isAuthentic = expectedSignature === razorpay_signature;

      if (isAuthentic) {
        // Here you would typically update the user's subscription status in your database
        res.status(200).json({ message: "Payment verified successfully" });
      } else {
        res.status(400).json({ message: "Invalid signature" });
      }
    } catch (error) {
      console.error("Verification Error:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  });
  // AI Tutor Endpoint (Fixed Version)
  app.post("/api/ai-tutor", async (req, res) => {
    try {
      const { prompt, context } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is missing" });
      }

      // Strip quotes if they exist
      const apiKey = process.env.GEMINI_API_KEY.replace(/^["']|["']$/g, '');

      const ai = new GoogleGenAI({ apiKey });

      const fullPrompt = `You are a helpful AI Tutor. Use the following lecture notes as context to answer the student's question. 
      Notes: ${context}
      Student Question: ${prompt}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
      });

      res.json({ reply: response.text });
    } catch (error) {
      console.error("AI Tutor Error:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  // Generate Notes Endpoint
  app.post("/api/generate-notes", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: "YouTube URL is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is missing" });
      }

      // Extract video ID for better compatibility
      const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;

      // 1. Fetch Transcript
      let transcriptText = "";
      try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId || url);
        transcriptText = transcript.map(t => t.text).join(" ");
      } catch (err: any) {
        console.log("youtube-transcript failed, trying fallback extractor...", err.message);
        try {
          if (videoId) {
            const { getSubtitles } = await import('youtube-caption-extractor');
            const subtitles = await getSubtitles({ videoID: videoId, lang: 'en' });
            if (subtitles && subtitles.length > 0) {
              transcriptText = subtitles.map((t: any) => t.text).join(" ");
            } else {
              throw new Error("No English subtitles found");
            }
          } else {
            throw new Error("Could not extract video ID");
          }
        } catch (fallbackErr: any) {
          console.error("Transcript Error:", fallbackErr.message);
          // Fallback to Gemini with Google Search
          transcriptText = "";
        }
      }

      // 2. Generate Notes with Gemini
      const apiKey = process.env.GEMINI_API_KEY!.replace(/^["']|["']$/g, '');
      const ai = new GoogleGenAI({ apiKey });

      let prompt = `You are "LumenNotes AI", a premium educational assistant.
Mission: Transform raw transcripts into Apple-style structured notes.
Tone: Sophisticated, clean, and encouraging (Apple-like elegance).

Analyze the following video transcript and extract key topics, definitions, and important dates. Make sure to highlight any specific dates, historical events, or core definitions mentioned in the content.

Structure of Output:
Title: Catchy and bold.
Executive Summary: 3 sentences max.
Key Lessons: Bullet points with 💡 icons.
Deep Dive: Detailed explanation of complex terms.
Actionable Steps: What should the user do next?
Flashcards: 3 Q&A pairs for revision.

Transcript:
${transcriptText.substring(0, 30000)}`;

      let config: any = {};

      if (!transcriptText) {
        prompt = `You are "LumenNotes AI", a premium educational assistant.
Mission: Transform this video into Apple-style structured notes: ${url}

Tone: Sophisticated, clean, and encouraging (Apple-like elegance).

Analyze the video using Google Search and extract key topics, definitions, and important dates. Make sure to highlight any specific dates, historical events, or core definitions mentioned in the content. If you cannot access the video directly, search for summaries or transcripts of this specific video online and use that information.

CRITICAL: You MUST output ONLY a raw JSON object with the following structure, and absolutely NO markdown formatting, NO \`\`\`json blocks, and NO other text before or after:
{
  "title": "Catchy and bold title",
  "summary": "Executive Summary: 3 sentences max.",
  "lessons": ["Lesson 1", "Lesson 2"],
  "deepDive": "Detailed explanation of complex terms.",
  "actionable": "What should the user do next?",
  "flashcards": [
    { "q": "Question 1", "a": "Answer 1" }
  ]
}`;
        config.tools = [{ googleSearch: {} }];
      } else {
        config.responseMimeType = "application/json";
        config.responseSchema = {
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
        };
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: config
      });

      let responseText = response.text || "";
      // Clean up markdown if present
      responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const notes = JSON.parse(responseText);
      res.json(notes);

    } catch (error: any) {
      console.error("Generate Notes Error:", error.message || error);
      res.status(500).json({ error: "Failed to generate notes: " + (error.message || error) });
    }
  });

  // Vite middleware for development
  if (true) { // Forcefully enable Vite for local dev
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();