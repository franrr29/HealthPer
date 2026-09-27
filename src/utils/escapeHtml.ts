const ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (char) => ESCAPE_MAP[char]);
}

// LLM output for patient summaries is instructed to use only these bare tags (see prompt.service.ts).
// Escape everything first, then restore just this exact allow-list, so any attribute or unlisted
// tag (script, img onerror, a href=javascript:, etc.) stays fully escaped as inert text.
const ALLOWED_SUMMARY_TAG_PATTERN = /&lt;(\/?(?:strong|em|p|ul|li)|br\s*\/?)&gt;/gi;

export function sanitizeSummaryHtml(input: string): string {
  const escaped = escapeHtml(input);

  return escaped.replace(ALLOWED_SUMMARY_TAG_PATTERN, (match) => `<${match.slice(4, -4)}>`);
}
