# HealthPer — Project Context

## What is this

AI-powered medical consultation copilot. The doctor records the consultation, the system transcribes it, suggests follow-up questions based on patient history, generates a SOAP summary, and can email the patient a plain-language after-visit summary.

Core flow: record → pause → suggested questions → resume → finalize → transcribe → edit summary → sign → (optional) email patient.

## Stack

- **Backend:** Node.js + Express + TypeScript (strict mode)
- **Frontend:** React 19 + Vite + TypeScript + Tailwind v4 + shadcn/ui + TanStack Query
- **Database:** MySQL (raw SQL, no ORM — parameterized queries only)
- **AI:** Groq Whisper (transcription) + LLM via Groq SDK (summaries/questions) + Gemini embeddings (RAG)
- **Auth:** JWT + Google OAuth + Passport, httpOnly cookies, refresh tokens

## Project Structure

Modular monolith organized by feature domains:

```
src/
├── config/          # db, env (Zod-validated), cookies, logger
├── errors/          # AppError and error hierarchy
├── middleware/       # auth, errorHandler, multer
├── modules/
│   ├── ai/          # chunking, embedding, indexing, llm, prompt, rag, whisper
│   ├── auth/        # login, register, Google OAuth, refresh
│   ├── consultation/ # CRUD, transcription, summary, sign, rounds
│   ├── doctor/      # profile, stats, dashboard
│   ├── email/       # patient after-visit email
│   └── patient/     # CRUD, memory, ask (RAG Q&A)
├── schemas/         # Zod validation schemas
├── types/           # shared TypeScript types and domain interfaces
└── tests/

Front/src/
├── components/      # auth, common, ui (shadcn)
├── context/         # AuthContext
├── hooks/           # custom hooks (logic extraction)
├── layouts/
├── pages/           # organized by feature
├── services/        # API layer (axios)
└── types/           # frontend type definitions
```

## Architecture Rules

### Layers — each layer has ONE job

```
Controller → Service → Repository → Database
```

- **Controller:** receives HTTP request, validates input (Zod), calls service, sends response. No business logic, no SQL.
- **Service:** business logic and orchestration. Calls repositories, never `db.query()` directly. Throws `AppError` with proper status codes.
- **Repository:** data access only. Executes SQL, returns typed data. No business logic, no HTTP concepts.

Every module must follow this structure. No exceptions.

### Design Patterns

- **Repository Pattern:** all database access goes through repository files. Services never touch SQL.
- **Strategy Pattern:** LLM provider must be swappable. Use a common interface so changing from Groq to OpenAI or another provider is a config change, not a rewrite.
- **LLM Fallback + Retry:** all external AI calls (Groq, Gemini) go through a resilience wrapper that handles:
  1. Retry with exponential backoff on 429/5xx (max 3 attempts).
  2. Read `x-ratelimit-remaining` headers for preventive throttle.
  3. If retries are exhausted, fall to the next provider in the fallback chain.
  4. The fallback chain and retry config are defined in config, not hardcoded in services.
- **Singleton:** database pool, logger, SDK clients — instantiated once in config, imported everywhere.
- **Custom Error Hierarchy:** AppError base class with typed subclasses (NotFoundError, ValidationError, UnauthorizedError, ConflictError, ExternalServiceError).
- **Fail-fast config:** all env vars validated with Zod at startup.

### Principles

- **Single Responsibility:** one file, one reason to change. If a service is doing CRUD + AI + email, split it.
- **Open/Closed:** new LLM providers, new email providers → add new implementations, don't modify existing ones.
- **Dependency Inversion:** services depend on abstractions (interfaces/types), not on concrete SDK instances.
- **DRY:** if you see the same logic in 3 places, extract it. JWT signing, cookie options, doctor_id extraction, JSON column parsing — each lives in exactly one place.
- **KISS:** no abstraction without a problem to solve. No wrapper classes just for the sake of wrapping. No comments explaining what the code already says.

### Naming Conventions

- Files: `camelCase` — `patient.repository.ts`, `llm.service.ts`, `auth.controller.ts`
- Functions: `verbNoun` — `getPatientById`, `createConsultation`, `buildSummaryPrompt`
- Interfaces/Types: `PascalCase` — `Patient`, `Consultation`, `LLMProvider`
- Constants: `UPPER_SNAKE_CASE` — `MAX_RETRIES`, `DEFAULT_TOP_K`
- Boolean vars: `is/has/should` prefix — `isSigned`, `hasMemory`

### Code Style

- Minimal comments. Code should be self-explanatory. Comment only the WHY, never the WHAT.
- No emoji in comments. No decorative comments. No section banners.
- Comments in lowercase, short — `// validate ownership before proceeding`
- No `any` — use proper types. If you need a generic, use generics.
- Every function that can fail returns typed errors via AppError subclasses, never generic `new Error()`.
- Async errors propagate to the centralized error handler. No silent catch-and-swallow unless explicitly justified with a comment explaining why.

## Security

- **Helmet:** enabled with defaults (`app.use(helmet())`). Custom configuration is optional — defaults are sufficient for a JSON API. Only customize if a specific header needs overriding.
- **CORS:** restricted to `FRONTEND_URL` with credentials.
- **Cookies:** httpOnly, secure in production, sameSite appropriate per environment.
- **SQL:** parameterized queries only. Never concatenate user input into SQL strings.
- **Validation:** every endpoint validates params, query, and body with Zod before reaching the service layer.
- **Rate limiting:** required on auth routes and on any endpoint that calls external paid APIs (Groq, Gemini, Resend).
- **Google OAuth password_hash:** accounts created via Google OAuth must store a real bcrypt hash of a random string (not a literal like "oauth_google"). This ensures bcrypt.compare takes constant time regardless of auth method.

## What NOT to Do

- **Never put SQL in a service or controller.** All queries go in `.repository.ts` files.
- **Never hardcode model names, timeouts, or magic numbers.** They go in config.
- **Never install packages without asking.** Discuss the dependency first.
- **Never write tests that depend on a real database connection** for unit tests. Integration tests use a test database.
- **Never use `dangerouslySetInnerHTML` without sanitization.**
- **Never return inconsistent response formats.** All API responses follow the same shape.
- **Never catch an error just to re-throw it unchanged.** Let it propagate.
- **Never log PII** (patient names, emails, medical data) in production logs.
- **Never commit secrets, .env files, or database dumps.**

## API Response Contract

All endpoints must follow this format:

```typescript
// Success
{ success: true, data: T, message?: string }

// Error
{ success: false, message: string, code?: string }
```

No exceptions. No `{ error }`, no `{ consultation }`, no raw objects.

## Running the Project

```bash
# Backend
cd src && npm install && npm run dev

# Frontend
cd Front && npm install && npm run dev

# Tests
npm test
```

## Current Refactor Status

Active branch: `refactor/repository-layer` (or current refactor branch)

Phase 1: Extracting Repository layer from services (in progress)
Phase 2: Drizzle ORM integration inside repositories (planned)