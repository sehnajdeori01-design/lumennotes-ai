import dotenv from "dotenv";

dotenv.config();

async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/generate-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://www.youtube.com/watch?v=fHsa9DqaCQ8" })
    });
    const data = await res.json();
    console.log(data);
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

test();
