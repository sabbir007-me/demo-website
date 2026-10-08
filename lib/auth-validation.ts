// Shared by the auth form (instant feedback) and the server action (source of
// truth), so both always agree on what's valid.

export type AuthMode = "login" | "signup";

export type AuthFields = { name: string; email: string; password: string };

export type AuthErrors = Partial<Record<keyof AuthFields, string>>;

/** Field order used for the error summary and for focus. */
export const FIELD_ORDER: (keyof AuthFields)[] = ["name", "email", "password"];

export const MIN_PASSWORD = 8;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function readAuthFields(formData: FormData): AuthFields {
  return {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
}

export function validateAuth(mode: AuthMode, fields: AuthFields): AuthErrors {
  const errors: AuthErrors = {};
  if (mode === "signup" && !fields.name) errors.name = "Enter your name.";
  if (!fields.email) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL.test(fields.email)) {
    errors.email = "Enter an email address like name@example.com.";
  }
  if (!fields.password) {
    errors.password = "Enter your password.";
  } else if (mode === "signup" && fields.password.length < MIN_PASSWORD) {
    errors.password = `Use at least ${MIN_PASSWORD} characters for your password.`;
  }
  return errors;
}
