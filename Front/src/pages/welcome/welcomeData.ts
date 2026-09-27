export const STACK_ITEMS = [
  "Whisper Large-v3",
  "Llama 3.3 · 70B",
  "Gemini Embeddings",
  "Hybrid RAG · RRF",
  "MySQL FULLTEXT",
  "JWT / httpOnly",
  "Resend Delivery",
  "React 19 · TS",
];

export const STEPS = [
  { n: "01", title: "Listen", img: "/microfono.jpg", tag: "CAPTURE", desc: "Multi-speaker clinical audio, in the browser." },
  { n: "02", title: "Ask", img: "/generaPreguntas.jpg", tag: "CONTEXT", desc: "Pause and get follow-ups drawn from the patient’s memory.", accent: true },
  { n: "03", title: "Transcribe", img: "/transcribe.jpg", tag: "WHISPER-V3", desc: "Speaker turns and clinical terms preserved." },
  { n: "04", title: "Summarize", img: "/resumen.jpg", tag: "SOAP", desc: "A structured note, review-and-sign." },
  { n: "05", title: "Follow up", img: "/enviaMail.jpg", tag: "RESEND", desc: "Patient-friendly summary in their inbox." },
];

export const RETRIEVED = [
  { score: "0.92", text: "Reacts to amoxicillin — documented on 2025-11-04. Switched to azithromycin." },
  { score: "0.87", text: "Seasonal rhinitis — mild, on cetirizine PRN. No respiratory involvement." },
  { score: "0.81", text: "No known drug reactions beyond penicillin family." },
];

export const DECISIONS = [
  { n: "01", cat: "Retrieval", t: "Hybrid RAG · RRF fusion", b: "Cosine similarity misses exact terms. Keyword misses paraphrase. Reciprocal Rank Fusion combines both without hand-tuning a weight." },
  { n: "02", cat: "Security", t: "doctor_id in every query", b: "Filtered at the SQL level, not the middleware. Verified by an explicit IDOR test in patients.test.ts." },
  { n: "03", cat: "Resilience", t: "Non-blocking background jobs", b: "Chunking, embedding, memory-merge and email delivery are fired after signing — the clinical workflow never waits." },
  { n: "04", cat: "State", t: "Incremental patient memory", b: "Each summary is merged into the previous memory row by the LLM. Prompt cost stays constant no matter how many visits accumulate." },
  { n: "05", cat: "Storage", t: "No dedicated vector DB", b: "Embeddings live in a MySQL JSON column. Retrieval is always scoped to a single patient — operational simplicity over premature scale." },
  { n: "06", cat: "Auth", t: "JWT in httpOnly cookies", b: "Token out of reach of XSS. A single interceptor retries once against /auth/refresh on a 401 — one endpoint, one moving part." },
];

export const TRANSCRIPT_LINES = [
  { s: "DR", t: "How long have the headaches been recurring?" },
  { s: "PT", t: "About three weeks. Usually late afternoon, right behind the eyes." },
  { s: "DR", t: "Anything different around when they started — new medication, sleep, screens?" },
  { s: "PT", t: "I switched to the new antihypertensive on the 4th. Sleep’s the same." },
  { s: "DR", t: "Any nausea or visual disturbance with them?" },
];
