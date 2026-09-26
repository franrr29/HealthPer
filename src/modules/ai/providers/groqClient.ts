import OpenAI from "openai";
import { env } from "../../../config/env";
import { GROQ_BASE_URL } from "../../../config/llm.config";

// retries are handled by withRetry, so the sdk's own retries are disabled to avoid stacking them
export const groqClient = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: GROQ_BASE_URL,
  maxRetries: 0,
});
