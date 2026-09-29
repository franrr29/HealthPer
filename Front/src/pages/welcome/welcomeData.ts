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
  { n: "01", title: "Listen", img: "/microfono.jpg", tag: "Audio Capture", desc: "The doctor records the consultation directly in the browser. No external devices needed." },
  { n: "02", title: "Ask", img: "/generaPreguntas.jpg", tag: "Patient Memory + RAG", desc: "Between recording rounds, the system suggests follow-up questions based on the patient’s full clinical history.", accent: true },
  { n: "03", title: "Transcribe", img: "/transcribe.jpg", tag: "Groq Whisper", desc: "Audio is converted to text preserving medical terminology, drug names, and clinical context." },
  { n: "04", title: "Summarize", img: "/resumen.jpg", tag: "LLM → SOAP", desc: "An LLM generates a structured SOAP note. The doctor reviews, edits, and signs — nothing is saved without approval." },
  { n: "05", title: "Follow up", img: "/enviaMail.jpg", tag: "Resend Email", desc: "A plain-language summary is emailed to the patient, explaining what was discussed and next steps." },
];

export const RETRIEVED = [
  { score: "0.92", text: "Reacts to amoxicillin — documented on 2025-11-04. Switched to azithromycin." },
  { score: "0.87", text: "Seasonal rhinitis — mild, on cetirizine PRN. No respiratory involvement." },
  { score: "0.81", text: "No known drug reactions beyond penicillin family." },
];

export const DECISIONS = [
  { n: "01", cat: "Retrieval", t: "Search that understands context, not just keywords", b: "Combines semantic similarity with keyword matching to find relevant clinical history. Neither method alone catches everything — fusing both does.", tag: "Hybrid RAG · Cosine + FULLTEXT · RRF fusion" },
  { n: "02", cat: "Security", t: "Each patient is only visible to their doctor", b: "Access control is enforced at the database query level, not just middleware. Every query filters by doctor_id — verified with dedicated tests.", tag: "IDOR protection · SQL-level filtering" },
  { n: "03", cat: "Resilience", t: "AI processing never blocks the consultation", b: "Chunking, embedding, memory updates and email delivery run in the background after the doctor signs. The clinical workflow never waits on them.", tag: "Non-blocking background jobs" },
  { n: "04", cat: "State", t: "The patient’s memory grows without slowing down", b: "Each signed summary is merged into a single running memory of the patient, so the cost of every request stays constant however many visits accumulate.", tag: "Incremental LLM memory · Constant prompt size" },
  { n: "05", cat: "Storage", t: "Simple infrastructure, sized for the real problem", b: "Retrieval is always scoped to one patient, so embeddings live in the existing MySQL database instead of a separate vector service.", tag: "MySQL JSON embeddings · No vector DB" },
  { n: "06", cat: "Auth", t: "Sessions that scripts in the browser can’t steal", b: "Tokens live in httpOnly cookies, out of reach of XSS. A single interceptor renews an expired session automatically through one refresh endpoint.", tag: "JWT · httpOnly cookies · /auth/refresh" },
];

export const TRANSCRIPT_LINES = [
  { s: "DR", t: "How long have the headaches been recurring?" },
  { s: "PT", t: "About three weeks. Usually late afternoon, right behind the eyes." },
  { s: "DR", t: "Anything different around when they started — new medication, sleep, screens?" },
  { s: "PT", t: "I switched to the new antihypertensive on the 4th. Sleep’s the same." },
  { s: "DR", t: "Any nausea or visual disturbance with them?" },
];
