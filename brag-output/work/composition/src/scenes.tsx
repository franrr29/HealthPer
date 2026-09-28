import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, fontMono, fontSans } from "./theme";
import { typedSubstring } from "./Scene";
import { MicIcon, PauseIcon, SparklesIcon, MessageIcon, BotIcon, BrainIcon } from "./icons";

const AppFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: colors.background,
      fontFamily: fontSans,
      color: colors.foreground,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      background: colors.card,
      border: `1px solid ${colors.border}`,
      borderRadius: 24,
      boxShadow: "0 8px 32px rgba(10,14,46,0.08)",
      padding: 40,
      width: 860,
      ...style,
    }}
  >
    {children}
  </div>
);

const CardHeader: React.FC<{ title: string; step: string }> = ({ title, step }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: `1px solid ${colors.border}`,
      paddingBottom: 18,
      marginBottom: 24,
    }}
  >
    <h3
      style={{
        margin: 0,
        fontFamily: fontMono,
        fontSize: 20,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: colors.foreground,
      }}
    >
      {title}
    </h3>
    <span
      style={{
        fontFamily: fontMono,
        fontSize: 15,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: colors.mutedForeground,
      }}
    >
      {step}
    </span>
  </div>
);

// ───────────────────────── Hook ─────────────────────────
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 30], [0.94, 1], { extrapolateRight: "clamp" });
  const kickerOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: colors.primary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
        fontFamily: fontSans,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18, transform: `scale(${scale})` }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: `linear-gradient(160deg, #2E6BEB, ${colors.navyElevated})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 30,
            color: "white",
            fontWeight: 700,
          }}
        >
          ✦
        </div>
        <span style={{ color: "white", fontSize: 56, fontWeight: 700, letterSpacing: "-0.02em" }}>Healthper</span>
      </div>
      <div
        style={{
          opacity: kickerOpacity,
          fontFamily: fontMono,
          fontSize: 17,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.55)",
        }}
      >
        Ambient clinical copilot
      </div>
    </div>
  );
};

// ───────────────────────── Recording + live transcript ─────────────────────────
const TRANSCRIPT_LINES = [
  { s: "DR", t: "How long have the headaches been recurring?" },
  { s: "PT", t: "About three weeks. Usually late afternoon, right behind the eyes." },
  { s: "DR", t: "Anything change around when they started — new medication, sleep?" },
  { s: "PT", t: "I switched to the new antihypertensive on the 4th." },
];

export const RecordingScene: React.FC<{
  paused?: boolean;
  linesShown?: number;
  startTypingAt?: number;
  instantCount?: number;
}> = ({ paused = false, linesShown = TRANSCRIPT_LINES.length, startTypingAt = 0, instantCount = 0 }) => {
  const frame = useCurrentFrame();
  const pulse = 0.55 + 0.45 * Math.abs(Math.sin(frame / 10));

  return (
    <AppFrame>
      <Card>
        <CardHeader title="1. Consultation Recording" step="Step 1 of 3" />

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: paused ? colors.slate600 : colors.rose600,
              opacity: paused ? 1 : pulse,
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: fontMono,
              fontSize: 15,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: paused ? colors.slate600 : colors.rose600,
            }}
          >
            {paused ? "Paused" : "Recording"}
          </span>
        </div>

        <div
          style={{
            background: "rgba(245,245,245,0.9)",
            border: `1px solid ${colors.border}`,
            borderRadius: 14,
            padding: 22,
            minHeight: 220,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {TRANSCRIPT_LINES.slice(0, linesShown).map((line, i) => {
            if (i < instantCount) {
              return (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span
                    style={{
                      fontFamily: fontMono,
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: line.s === "DR" ? colors.primary : colors.mutedForeground,
                      background: line.s === "DR" ? colors.accent : colors.slate100,
                      borderRadius: 6,
                      padding: "2px 8px",
                      minWidth: 32,
                      textAlign: "center",
                    }}
                  >
                    {line.s}
                  </span>
                  <span style={{ fontSize: 20, lineHeight: 1.5, color: colors.foreground }}>{line.t}</span>
                </div>
              );
            }
            const lineStart = startTypingAt + (i - instantCount) * 34;
            const shown = typedSubstring(line.t, frame, lineStart, 0.9);
            const done = shown.length === line.t.length;
            if (shown.length === 0) return null;
            return (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span
                  style={{
                    fontFamily: fontMono,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: line.s === "DR" ? colors.primary : colors.mutedForeground,
                    background: line.s === "DR" ? colors.accent : colors.slate100,
                    borderRadius: 6,
                    padding: "2px 8px",
                    minWidth: 32,
                    textAlign: "center",
                  }}
                >
                  {line.s}
                </span>
                <span style={{ fontSize: 20, lineHeight: 1.5, color: colors.foreground }}>
                  {shown}
                  {!done && <span style={{ opacity: frame % 20 < 10 ? 1 : 0, color: colors.primary }}>▍</span>}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 24, display: "flex", gap: 14 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: colors.slate600,
              color: "white",
              borderRadius: 12,
              padding: "12px 20px",
              fontSize: 15,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              opacity: paused ? 0.55 : 1,
            }}
          >
            <PauseIcon size={16} color="white" />
            Pause &amp; analyze
          </div>
        </div>
      </Card>
    </AppFrame>
  );
};

// ───────────────────────── Analyzing (pause) ─────────────────────────
export const AnalyzingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rot = (frame * 10) % 360;
  return (
    <AppFrame>
      <Card>
        <CardHeader title="1. Consultation Recording" step="Step 1 of 3" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: colors.slate100,
            border: `1px solid ${colors.border}`,
            borderRadius: 14,
            padding: "22px 26px",
          }}
        >
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 999,
              border: `3px solid ${colors.slate300}`,
              borderTopColor: colors.slate600,
              display: "inline-block",
              transform: `rotate(${rot}deg)`,
            }}
          />
          <span style={{ fontSize: 20, color: colors.slate600, fontWeight: 500 }}>
            Transcribing and analyzing consultation...
          </span>
        </div>
      </Card>
    </AppFrame>
  );
};

// ───────────────────────── Suggested question / resume ─────────────────────────
export const ResumeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const highlight = interpolate(frame, [40, 55, 70], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AppFrame>
      <Card>
        <CardHeader title="1. Consultation Recording" step="Step 1 of 3" />

        <div
          style={{
            background: colors.muted,
            border: `1px solid ${colors.border}`,
            borderRadius: 14,
            padding: 20,
            marginBottom: 22,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <SparklesIcon size={16} color={colors.navyElevated} />
            <span
              style={{
                fontFamily: fontMono,
                fontSize: 14,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: colors.mutedForeground,
              }}
            >
              AI suggested questions
            </span>
          </div>
          <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: "18px 22px" }}>
            <div style={{ display: "flex", gap: 10 }}>
              <MessageIcon size={18} color={colors.navyElevated} />
              <p style={{ margin: 0, fontSize: 19, fontWeight: 700, color: colors.foreground }}>
                Ask about the recent medication change
              </p>
            </div>
            <p style={{ margin: "10px 0 0 28px", fontSize: 15, color: colors.mutedForeground, lineHeight: 1.5 }}>
              Patient started a new antihypertensive this week — worth confirming timing against symptom onset.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 12,
            padding: "12px 20px",
            fontSize: 15,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: colors.foreground,
            boxShadow: highlight > 0 ? `0 0 0 ${2 + highlight * 2}px rgba(10,14,46,${0.15 * highlight})` : "none",
          }}
        >
          <MicIcon size={16} color={colors.foreground} />
          Continue recording
        </div>
      </Card>
    </AppFrame>
  );
};

// ───────────────────────── Chat widget ─────────────────────────
const ChatShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppFrame>
    <div
      style={{
        width: 900,
        height: 760,
        background: "rgba(255,255,255,0.97)",
        borderRadius: 28,
        boxShadow: "0 24px 64px rgba(10,14,46,0.16)",
        border: `1px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: colors.primary,
          color: "white",
          padding: "22px 28px",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            padding: 10,
            display: "flex",
          }}
        >
          <BotIcon size={22} color="#C7D6FF" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 600 }}>AI Assistant</span>
            <SparklesIcon size={15} color="#9DB4FF" />
          </div>
          <span style={{ fontSize: 13, color: "rgba(238,242,250,0.7)" }}>Consultation context</span>
        </div>
      </div>
      <div style={{ flex: 1, padding: 32, display: "flex", flexDirection: "column", gap: 22, background: "rgba(245,245,245,0.4)" }}>
        {children}
      </div>
    </div>
  </AppFrame>
);

const QuestionBubble: React.FC<{ text: string; opacity: number }> = ({ text, opacity }) => (
  <div style={{ display: "flex", justifyContent: "flex-end", opacity }}>
    <div
      style={{
        background: colors.primary,
        color: "white",
        borderRadius: "20px 20px 4px 20px",
        padding: "16px 22px",
        maxWidth: "80%",
        fontSize: 19,
        lineHeight: 1.5,
      }}
    >
      {text}
    </div>
  </div>
);

const TypingDots: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, opacity }}>
      <div
        style={{
          background: colors.slate100,
          border: `1px solid ${colors.slate300}`,
          borderRadius: 10,
          padding: 8,
        }}
      >
        <BotIcon size={17} color={colors.slate600} />
      </div>
      <div
        style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: "20px 20px 20px 4px",
          padding: "16px 20px",
          display: "flex",
          gap: 6,
        }}
      >
        {[0, 1, 2].map((i) => {
          const t = (frame - i * 4) % 30;
          const dotOpacity = 0.3 + 0.7 * Math.max(0, Math.sin((t / 30) * Math.PI));
          return (
            <span
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: colors.primary,
                opacity: dotOpacity,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const AnswerBubble: React.FC<{ text: string; opacity: number }> = ({ text, opacity }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, opacity }}>
    <div style={{ background: colors.slate100, border: `1px solid ${colors.slate300}`, borderRadius: 10, padding: 8 }}>
      <BotIcon size={17} color={colors.slate600} />
    </div>
    <div
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: "20px 20px 20px 4px",
        padding: "16px 22px",
        maxWidth: "78%",
        fontSize: 18,
        lineHeight: 1.55,
        color: colors.foreground,
      }}
    >
      {text}
    </div>
  </div>
);

export const ChatQAScene: React.FC<{
  question: string;
  answer: string;
  questionAt: number;
  typingAt: number;
  answerAt: number;
  priorQuestion?: string;
  priorAnswer?: string;
}> = ({ question, answer, questionAt, typingAt, answerAt, priorQuestion, priorAnswer }) => {
  const frame = useCurrentFrame();
  const qOpacity = interpolate(frame, [questionAt, questionAt + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const typingOpacity = interpolate(frame, [typingAt, typingAt + 8, answerAt - 2, answerAt], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const aOpacity = interpolate(frame, [answerAt, answerAt + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <ChatShell>
      {priorQuestion && priorAnswer && (
        <>
          <QuestionBubble text={priorQuestion} opacity={0.55} />
          <AnswerBubble text={priorAnswer} opacity={0.55} />
        </>
      )}
      <QuestionBubble text={question} opacity={qOpacity} />
      {typingOpacity > 0.01 && <TypingDots opacity={typingOpacity} />}
      {aOpacity > 0.01 && <AnswerBubble text={answer} opacity={aOpacity} />}
    </ChatShell>
  );
};

// ───────────────────────── Context panel ─────────────────────────
const TAGS: { label: string; value: string; tone: "blue" | "rose" | "neutral" }[] = [
  { label: "Chronic Diseases", value: "Hypertension", tone: "blue" },
  { label: "Allergies", value: "Penicillin (amoxicillin)", tone: "rose" },
  { label: "Active Medications", value: "Lisinopril — started Nov 4", tone: "neutral" },
  { label: "Recurrent Symptoms", value: "Tension headaches", tone: "neutral" },
];

const toneStyles: Record<string, { box: string; border: string; label: string; value: string }> = {
  blue: { box: "rgba(219,234,254,0.9)", border: "#93C5FD", label: "#1D4ED8", value: "#172554" },
  rose: { box: "rgba(255,228,230,0.9)", border: "#FDA4AF", label: "#BE123C", value: "#4C0519" },
  neutral: { box: "rgba(255,255,255,0.7)", border: colors.border, label: colors.mutedForeground, value: colors.foreground },
};

export const ContextScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AppFrame>
      <Card style={{ width: 980, background: "rgba(239,246,255,0.55)", border: "1px solid #BFDBFE" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #BFDBFE",
            paddingBottom: 18,
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BrainIcon size={22} color={colors.blue700} />
            <h3 style={{ margin: 0, fontFamily: fontMono, fontSize: 20, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: colors.blue950 }}>
              Patient History
            </h3>
          </div>
          <span
            style={{
              background: colors.blue700,
              color: "white",
              borderRadius: 999,
              padding: "6px 16px",
              fontFamily: fontMono,
              fontSize: 13,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Context
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {TAGS.map((tag, i) => {
            const t = toneStyles[tag.tone];
            const appear = interpolate(frame, [i * 8, i * 8 + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const rise = interpolate(frame, [i * 8, i * 8 + 14], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div
                key={tag.label}
                style={{
                  background: t.box,
                  border: `1px solid ${t.border}`,
                  borderRadius: 12,
                  padding: 16,
                  opacity: appear,
                  transform: `translateY(${rise}px)`,
                }}
              >
                <div style={{ fontFamily: fontMono, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: t.label, marginBottom: 6 }}>
                  {tag.label}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: t.value }}>{tag.value}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </AppFrame>
  );
};

// ───────────────────────── Outro ─────────────────────────
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [0, 20], [16, 0], { extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: colors.primary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        fontFamily: fontSans,
      }}
    >
      <div style={{ display: "flex", gap: 40, transform: `translateY(${rise}px)`, opacity }}>
        <div
          style={{
            width: 320,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 18,
            padding: 22,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: colors.rose600 }} />
            <span style={{ fontFamily: fontMono, fontSize: 12, color: colors.rose600, fontWeight: 700, letterSpacing: "0.1em" }}>RECORDING</span>
          </div>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.85)", fontSize: 15, lineHeight: 1.5 }}>
            "...switched to the new antihypertensive on the 4th."
          </p>
        </div>
        <div
          style={{
            width: 320,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 18,
            padding: 22,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginBottom: 10 }}>
            <div style={{ background: "rgba(255,255,255,0.14)", borderRadius: "12px 12px 2px 12px", padding: "8px 12px", fontSize: 13, color: "white" }}>
              Could that be causing the headaches?
            </div>
          </div>
          <div style={{ background: "white", borderRadius: "12px 12px 12px 2px", padding: "10px 14px", fontSize: 13, color: colors.foreground, maxWidth: "90%" }}>
            Timing lines up with symptom onset — worth a dosage review.
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `linear-gradient(160deg, #2E6BEB, ${colors.navyElevated})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 19,
              color: "white",
            }}
          >
            ✦
          </div>
          <span style={{ color: "white", fontSize: 32, fontWeight: 700 }}>Healthper</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 17 }}>Transcribes live. Answers with context.</span>
      </div>
    </div>
  );
};
