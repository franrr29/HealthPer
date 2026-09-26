// unknown because mysql2 may hand back either the raw json string or an already parsed array
export function parseJsonArray(value: unknown): string[] | null {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : null;
  } catch {
    // a corrupt json column must not break the read
    return null;
  }
}
