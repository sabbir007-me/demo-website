"use server";

import { redirect } from "next/navigation";

export type AuthMode = "login" | "signup";

export type AuthState = {
  message?: string;
  errors?: Partial<Record<"name" | "email" | "password", string>>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function authenticate(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const mode: AuthMode = formData.get("mode") === "signup" ? "signup" : "login";
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const errors: NonNullable<AuthState["errors"]> = {};
  if (mode === "signup" && !name) errors.name = "Enter your name.";
  if (!EMAIL.test(email)) errors.email = "Enter a valid email address.";
  if (mode === "signup" && password.length < 8) {
    errors.password = "Use at least 8 characters.";
  } else if (!password) {
    errors.password = "Enter your password.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // TODO: No auth provider is connected yet, so any well-formed credentials
  // get through. Call your provider's sign-in / sign-up here and return
  // { message } on failure instead of redirecting.
  redirect("/");
}
