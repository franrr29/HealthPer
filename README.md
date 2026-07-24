# HealthPer

A web app for doctors to record consultations, get them transcribed and summarized by AI, and keep a running memory of each patient's history that they can query in plain language.

## Demo

**Live app:** [healthper.app](https://healthper.online) · **Try it without an account:** click **"Recruiter Preview"** on the login screen. It logs you in as a demo doctor with sample patients and consultations already loaded — no credentials needed. It's gated by an `ALLOW_DEMO` env flag on the backend, so it can be disabled without touching code.

## What it does

- The doctor records the consultation in the browser; the audio is transcribed with Whisper (via Groq) and a structured clinical summary (chief complaint, symptoms, diagnosis, treatment, follow-up) is generated with Llama 3.3 70B.
- The doctor can edit the AI-generated summary before signing it. Signing locks the consultation and stamps it with a server-side timestamp.
- Signing also triggers two background jobs that don't block the UI: the transcript is chunked, embedded (Gemini) and indexed for retrieval, and the patient's long-term memory (chronic conditions, allergies, medications, recurring symptoms, master summary) is merged with the new summary through another LLM call.
- Doctors can ask free-text questions about a patient's history through a chat widget; answers are grounded in a hybrid RAG pipeline (cosine similarity + MySQL FULLTEXT, combined with Reciprocal Rank Fusion) over that patient's indexed consultations.
- Signed summaries can be emailed straight to the patient in plain language via Resend.
- Auth supports email/password, Google OAuth, and the one-click demo login described above. The dashboard shows pending signatures, recent activity, and the doctor's most common chronic conditions/allergies across all patients.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite, TanStack Query, React Router v7, Tailwind CSS v4, Radix UI / shadcn, axios |
| Backend | Node.js, Express 5, TypeScript, Zod, JWT + httpOnly cookies, Passport (Google OAuth 2.0) |
| AI | Groq (Llama 3.3 70B for summaries/chat, Whisper large-v3 for transcription), Google Gemini (`gemini-embedding-001`) |
| Database | MySQL (`mysql2`) — hybrid retrieval via in-app cosine similarity + native MySQL FULLTEXT, no dedicated vector DB |
| Other services | Resend (transactional email) |
| Testing | Jest, Supertest, ts-jest |

## Architecture

The backend is organized into domain modules (`auth`, `patient`, `doctor`, `consultation`, `email`, `ai`) instead of flat layer folders — each module keeps its controller, service and routes together. `ai/` is the exception: it has no routes of its own, it's internal infrastructure consumed by `consultation` (summaries, indexing) and `patient` (RAG chat).

**Auth flow:** JWT access token (15 min) + refresh token (7 days), both in httpOnly, `sameSite=strict` cookies. Login is email/password or Google OAuth via Passport; an axios interceptor on the frontend retries a request once against `/auth/refresh` on a 401 before logging the user out.

**RAG pipeline:** when a consultation is signed, its transcript is split into chunks, embedded with Gemini, and stored in MySQL. When a doctor asks a question, the pipeline ranks chunks by cosine similarity and by MySQL FULLTEXT independently, fuses both rankings with Reciprocal Rank Fusion, and feeds the top chunks into the LLM prompt.

<details>
<summary><strong>Running it locally</strong></summary>

Requires Node.js and a running MySQL instance.

```
git clone https://github.com/franrr29/HealthPer.git
cd HealthPer
npm install
```

Create the database and load the schema:

```
mysql -u root -p -e "CREATE DATABASE healthper"
mysql -u root -p healthper < schema.sql
```

Create a `.env` file at the project root with:

```
PORT=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
REFRESH_TOKEN_SECRET=
NODE_ENV=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GROQ_API_KEY=
GEMINI_API_KEY=
FRONTEND_URL=
ALLOW_REGISTER=
ALLOW_DEMO=
RESEND_API_KEY=
```

Run the backend:

```
npm run dev
```

In a separate terminal, set up the frontend:

```
cd Front
npm install
```

Create `Front/.env`:

```
VITE_API_URL=
```

Run it:

```
npm run dev
```

</details>

## Testing

Backend integration tests use Jest + Supertest against the actual Express app and a real MySQL database (a separate `healthper_test` DB via `.env.test`) — repositories aren't mocked, only the LLM/OpenAI client is, in the two suites that would otherwise hit Groq for real. Coverage includes:

- **Auth:** register, login, wrong password, nonexistent user, missing/invalid token
- **Patients:** CRUD, validation errors, and an explicit IDOR test (one doctor can't reach another doctor's patient)
- **Consultations:** signing (success, already-signed, missing summary, not found), editing the summary, generating the summary
- **Health check** and env sanity check

Run with:

```
npm test
```

There are no frontend tests yet.

## Technical decisions

**Hybrid RAG instead of vector-only search.** Pure embedding similarity misses exact clinical terms (drug names, specific wording a doctor used); keyword search misses paraphrased context. Reciprocal Rank Fusion combines both rankings without having to hand-tune a similarity weight. There's also no dedicated vector database — embeddings are stored as JSON in a MySQL column and cosine similarity is computed in the Node process, because retrieval is always scoped to one patient's chunks (a few dozen rows, not millions), so a separate vector store would be operational overhead for no real benefit at this scale.

**`doctor_id` baked into every query, not just the auth middleware.** Every patient/consultation lookup joins or filters on `doctor_id` directly in the SQL, instead of trusting a resource ID from the URL and checking ownership afterward. This is what the IDOR test in `patients.test.ts` actually verifies — that a doctor can't reach another doctor's patient by guessing an ID.

**JWT in httpOnly cookies instead of localStorage.** Keeps the token out of reach of XSS, at the cost of needing an explicit `/auth/refresh` endpoint and a client-side interceptor to retry once after a 401 — more moving parts than reading a token from `localStorage`, but it closes off a common attack vector for a lower-value tradeoff.

**Patient memory is merged incrementally, not re-summarized from scratch.** Each signed consultation sends the previous `patient_memory` row plus the new summary to the LLM, which returns a merged version. This keeps the prompt (and the cost) roughly constant no matter how many consultations a patient accumulates, instead of growing with the full history every time.

## Scope decisions

- **RBAC:** the schema already supports roles (`doctor`/`admin`) and the role is embedded in the JWT, but the MVP is single-role so enforcement isn't wired up yet — adding it is a middleware change, not a schema change.
- **Observability tables:** `ai_logs` (LLM cost/latency) and `audit_log` (action auditing) are defined in the schema and ready to receive data; wiring them up is next after deploy stabilizes.
- **Frontend tests:** not yet — backend coverage was prioritized first given the auth and IDOR surface area.

## Author

**Francisco Rodríguez** — [LinkedIn](https://www.linkedin.com/in/franrod-dev/) · [GitHub](https://github.com/franrr29)