import { z } from "zod";
import { logger } from "../config/logger";
import { LLM_PRIMARY, WHISPER } from "../config/llm.config";
import { ExternalServiceError, ValidationError } from "../errors";
import { withRetry } from "../modules/ai/retry";
import { GroqLLMProvider } from "../modules/ai/providers/groqLLM.provider";
import { GroqWhisperProvider } from "../modules/ai/providers/groqWhisper.provider";
import { FallbackLLMProvider } from "../modules/ai/providers/fallbackLLM.provider";

const retry = { maxRetries: 2, baseDelay: 1, maxDelay: 5 };

const failWith = (props: Record<string, unknown>, message = "boom") =>
    Object.assign(new Error(message), props);

const chatClient = (create: (body: any, options: any) => Promise<any>) =>
    ({ chat: { completions: { create } } }) as any;

const reply = (content: string | null) => ({ choices: [{ message: { content } }] });

describe("withRetry", () => {

    beforeEach(() => {
        jest.spyOn(logger, "warn").mockImplementation(() => undefined);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("retries a 429 and succeeds", async () => {
        let calls = 0;

        const result = await withRetry(async () => {
            calls++;
            if (calls < 3) throw failWith({ status: 429 });
            return "ok";
        }, retry, "test");

        expect(result).toBe("ok");
        expect(calls).toBe(3);
    });

    test.each([
        ["ECONNRESET", { code: "ECONNRESET" }],
        ["ETIMEDOUT", { code: "ETIMEDOUT" }],
        ["ECONNREFUSED", { code: "ECONNREFUSED" }],
        ["EPIPE", { code: "EPIPE" }],
        ["code inside cause", { cause: { code: "ECONNRESET" } }],
        ["request-timeout type", { type: "request-timeout" }],
        ["sdk timeout error", { name: "APIConnectionTimeoutError" }],
    ])("retries transient failure: %s", async (_label, props) => {
        let calls = 0;

        const result = await withRetry(async () => {
            calls++;
            if (calls < 2) throw failWith(props);
            return "ok";
        }, retry, "test");

        expect(result).toBe("ok");
        expect(calls).toBe(2);
    });

    test.each([400, 401, 404, 422])("does not retry a %i", async (status) => {
        let calls = 0;

        await expect(withRetry(async () => {
            calls++;
            throw failWith({ status });
        }, retry, "test")).rejects.toBeInstanceOf(ExternalServiceError);

        expect(calls).toBe(1);
    });

    test("gives up after maxRetries and reports the provider", async () => {
        let calls = 0;

        const error = await withRetry(async () => {
            calls++;
            throw failWith({ status: 503 });
        }, retry, "groq").catch((e) => e);

        expect(error).toBeInstanceOf(ExternalServiceError);
        expect(error.provider).toBe("groq");
        expect(calls).toBe(retry.maxRetries + 1);
    });

    test("does not touch errors that are already AppErrors", async () => {
        let calls = 0;

        await expect(withRetry(async () => {
            calls++;
            throw new ValidationError("mine");
        }, retry, "test")).rejects.toBeInstanceOf(ValidationError);

        expect(calls).toBe(1);
    });

    test("logs the kind of failure on each retry", async () => {
        const warn = jest.spyOn(logger, "warn").mockImplementation(() => undefined);
        let calls = 0;

        await withRetry(async () => {
            calls++;
            if (calls === 1) throw failWith({ status: 429 });
            if (calls === 2) throw failWith({ code: "ETIMEDOUT" });
            return "ok";
        }, retry, "test");

        const kinds = warn.mock.calls
            .filter(([, message]) => message === "retrying external call")
            .map(([context]) => (context as { kind: string }).kind);

        expect(kinds).toEqual(["rate_limit", "timeout"]);
    });
});

describe("GroqLLMProvider", () => {

    beforeEach(() => {
        jest.spyOn(logger, "warn").mockImplementation(() => undefined);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("generateText sends the configured model, limits and timeout", async () => {
        let seen: any;

        const provider = new GroqLLMProvider(LLM_PRIMARY, retry, chatClient(async (body, options) => {
            seen = { body, options };
            return reply("  hello  ");
        }));

        await expect(provider.generateText("hi", "be brief")).resolves.toBe("hello");

        expect(seen.body.model).toBe(LLM_PRIMARY.model);
        expect(seen.body.max_completion_tokens).toBe(LLM_PRIMARY.maxTokens);
        expect(seen.body.temperature).toBe(LLM_PRIMARY.temperature);
        expect(seen.options.timeout).toBe(LLM_PRIMARY.timeout);
        expect(seen.body.messages[0]).toEqual({ role: "system", content: "be brief" });
        expect(seen.body.response_format).toBeUndefined();
    });

    test("generateJSON requests json mode and validates against the schema", async () => {
        let seen: any;

        const provider = new GroqLLMProvider(LLM_PRIMARY, retry, chatClient(async (body) => {
            seen = body;
            return reply('{"a":1}');
        }));

        const result = await provider.generateJSON("hi", undefined, z.object({ a: z.number() }));

        expect(result.a).toBe(1);
        expect(seen.response_format).toEqual({ type: "json_object" });
        expect(seen.messages).toHaveLength(1);
    });

    test("invalid json, schema mismatch and empty content are upstream failures", async () => {
        const notJson = new GroqLLMProvider(LLM_PRIMARY, retry, chatClient(async () => reply("not json")));
        const valid = new GroqLLMProvider(LLM_PRIMARY, retry, chatClient(async () => reply('{"a":1}')));
        const empty = new GroqLLMProvider(LLM_PRIMARY, retry, chatClient(async () => reply(null)));

        await expect(notJson.generateJSON("x")).rejects.toBeInstanceOf(ExternalServiceError);
        await expect(valid.generateJSON("x", undefined, z.object({ a: z.string() }))).rejects.toBeInstanceOf(ExternalServiceError);
        await expect(empty.generateText("x")).rejects.toBeInstanceOf(ExternalServiceError);
    });
});

describe("FallbackLLMProvider", () => {

    const down = () => new GroqLLMProvider(LLM_PRIMARY, retry, chatClient(async () => {
        throw failWith({ status: 500 });
    }));

    const up = () => new GroqLLMProvider(LLM_PRIMARY, retry, chatClient(async () => reply("from fallback")));

    beforeEach(() => {
        jest.spyOn(logger, "warn").mockImplementation(() => undefined);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("uses the fallback when the primary is down", async () => {
        await expect(new FallbackLLMProvider([down(), up()]).generateText("x")).resolves.toBe("from fallback");
    });

    test("does not fall back on errors that are not upstream failures", async () => {
        const rejecting = {
            generateText: async () => { throw new ValidationError("no"); },
            generateJSON: async () => { throw new ValidationError("no"); },
        };

        await expect(new FallbackLLMProvider([rejecting, up()]).generateText("x")).rejects.toBeInstanceOf(ValidationError);
    });

    test("fails with ExternalServiceError when every provider is down", async () => {
        await expect(new FallbackLLMProvider([down(), down()]).generateText("x")).rejects.toBeInstanceOf(ExternalServiceError);
    });
});

describe("GroqWhisperProvider", () => {

    test("sends the configured model, language and timeout and names the file after the mimetype", async () => {
        let seen: any;

        const client = {
            audio: {
                transcriptions: {
                    create: async (body: any, options: any) => {
                        seen = { body, options };
                        return { text: "hola" };
                    },
                },
            },
        } as any;

        const provider = new GroqWhisperProvider(WHISPER, retry, client);

        await expect(provider.transcribe(Buffer.from("audio"), "audio/mp4")).resolves.toBe("hola");

        expect(seen.body.model).toBe(WHISPER.model);
        expect(seen.body.language).toBe(WHISPER.language);
        expect(seen.options.timeout).toBe(WHISPER.timeout);
        expect(seen.body.file.name).toBe("audio.mp4");
    });
});
