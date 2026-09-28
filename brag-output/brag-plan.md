# Healthper — brag-slim plan

## Rubric

- **What is it, one sentence:** An ambient clinical copilot that transcribes a consultation live, lets the doctor pause/resume, and answers contextual questions about the patient in the same view.
- **Who / what for:** Doctors during a live consultation who want the visit transcribed and quick answers about patient history without breaking eye contact with the patient.
- **What sets it apart:** The transcript and the AI chat share the same clinical context in real time — the answer isn't generic, it's grounded in *this* consultation and *this* patient's memory.
- **Most impressive/specific claim:** The doctor can pause recording, ask the copilot a clinical question mid-consultation, and get a context-aware answer, then resume — all without leaving the flow.
- **Visual hook:** The live "Recording" badge pulsing next to a transcript that's actively being typed out.
- **Real UI/flow to show:** `RecordingStep` (recording badge, pause & analyze / continue recording), the live transcript, the real `PatientChatWidget` Q&A bubble UI, `PatientMemoryPanel` context tags.
- **Tone:** `polished` — serious, elegant, restrained. This is clinical software, not a startup toy.
- **One-line share caption:** "Healthper transcribes the consultation live — and answers clinical questions with the same context, without breaking the visit."

## Scope lock

Only transcription + pause/resume + chat Q&A + context. No patients list, dashboard, analytics, settings, or recruiter preview.

## Colors (pulled directly from Front/src/index.css — the site's real tokens, not invented)

- `--primary` / navy: `#0A0E2E`
- `--navy-elevated`: `#141B4D`
- `--background`: `#F5F5F5`
- `--card`: `#FFFFFF`
- `--border`: `#E5E5E5`
- `--muted`: `#F5F5F5`, `--muted-foreground`: `#404040`
- `--accent`: `#EEF2FA`
- `--foreground`: `#171717`
- `rose-600` (recording badge): `#E11D48`
- Font: Inter (same as the product)

## Storyboard — 1920×1080, 30fps, 750 frames (25.0s), tone: polished

Initial target was 600 frames/20s; the pause/resume + two Q&A turns + context pull
needed more room to stay readable per the "don't outrun the viewer" rule, so the
final cut runs 25s — still inside the 15–25s window.

| # | Frames | Time | Scene | Real component reused |
|---|---|---|---|---|
| 1 | 0–45 | 0.0–1.5s | Hook: Healthper wordmark on navy, kicker "Ambient clinical copilot" | Navy brand tokens |
| 2 | 45–165 | 1.5–5.5s | Recording begins; live transcript types in, lines 1–2 | `RecordingStep` recording badge + transcript typing |
| 3 | 165–225 | 5.5–7.5s | Doctor clicks "Pause & analyze" → badge switches to Analyzing | `RecordingStep` pause button + analyzing state |
| 4 | 225–285 | 7.5–9.5s | Suggested question appears → "Continue recording" resumes | `SuggestedQuestions` + `RecordingStep` resume |
| 5 | 285–405 | 9.5–13.5s | Recording resumes; transcript continues, lines 3–4 | `RecordingStep` recording badge + transcript typing |
| 6 | 405–495 | 13.5–16.5s | Doctor asks a question in the chat; copilot answers with context | `PatientChatWidget` bubbles |
| 7 | 495–585 | 16.5–19.5s | Second question, new contextualized answer (prior turn kept faded above) | `PatientChatWidget` bubbles |
| 8 | 585–660 | 19.5–22.0s | Context pull: chronic conditions / allergies / medication tags | `PatientMemoryPanel` tag chips |
| 9 | 660–750 | 22.0–25.0s | Outro: transcript + chat side by side, "real-time" close | Combined layout + wordmark |

## Poster

Frame 465 (settled mid-scene 6 — the "Could the new antihypertensive be causing
these headaches?" / "Possible. The medication change lines up..." exchange) was
picked as the strongest, fully-settled, on-brand frame and baked in as frame 0 of
`brag.mp4` (duration/frame count unchanged: 750 frames, 25.00s).

## Audio

No voice-over (per instructions). No music/SFX included in this pass — no licensed track or audio-generation tool was available in this environment, and the brief treats audio as optional ("if the workflow needs it"). The video is fully understandable silently, which was the explicit requirement. Flagging this as the one deliberate scope cut.

## Output

`brag-output/composition/` (Remotion project), rendered to `brag-output/brag.mp4`, poster at `brag-output/brag.jpg`, caption at `brag-output/share-copy.txt`.
