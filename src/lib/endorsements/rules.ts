/** Validation shared by the form (instant feedback) and the API (the real check). */

export const LIMITS = {
  quote: { min: 10, max: 280 },
  name: { min: 2, max: 60 },
  role: { min: 2, max: 80 },
} as const;

export type EndorsementInput = {
  quote: string;
  name: string;
  role: string;
  rating: number;
};

export type FieldErrors = Partial<Record<keyof EndorsementInput, string>>;

export type ValidationResult =
  { ok: true; value: EndorsementInput } | { ok: false; errors: FieldErrors };

const LABELS = {
  quote: "Your endorsement",
  name: "Your name",
  role: "Your role",
};

// Control characters, zero-width characters and text-direction overrides.
const INVISIBLE = /[\p{Cc}\p{Cf}]/gu;
const LINK = /https?:|www\./i;

function clean(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .replace(INVISIBLE, "")
    .trim();
}

function checkText(field: keyof typeof LIMITS, value: string) {
  const { min, max } = LIMITS[field];
  const label = LABELS[field];
  if (!value) return `${label} is required.`;
  if (value.length < min) return `${label} needs at least ${min} characters.`;
  if (value.length > max) return `${label} can be at most ${max} characters.`;
  if (LINK.test(value)) return "Please leave out web links.";
  return undefined;
}

export function validateEndorsement(data: unknown): ValidationResult {
  const input = (data ?? {}) as Record<string, unknown>;
  const value: EndorsementInput = {
    quote: clean(input.quote),
    name: clean(input.name),
    role: clean(input.role),
    rating: Number(input.rating),
  };

  const errors: FieldErrors = {};
  for (const field of ["quote", "name", "role"] as const) {
    const error = checkText(field, value[field]);
    if (error) errors[field] = error;
  }
  if (!Number.isInteger(value.rating) || value.rating < 1 || value.rating > 5) {
    errors.rating = "Please choose a rating from 1 to 5 stars.";
  }

  return Object.keys(errors).length
    ? { ok: false, errors }
    : { ok: true, value };
}
