// api/gemini.js — Proxy serverless para Google Gemini
// La API Key está protegida en el servidor, nunca se expone al browser

const GEMINI_API_KEY = "AIzaSyD3YAL5U-F1HqPPy29b0n2h1FS5il5aJBg";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { model = "gemini-2.0-flash", ...body } = req.body;

    const geminiRes = await fetch(
      `${BASE_URL}/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("Gemini proxy error:", error);
    return res.status(500).json({
      error: { message: `Server error: ${error.message}` }
    });
  }
}
