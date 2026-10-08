"use server";

import { redirect } from "next/navigation";
import {
  readAuthFields,
  validateAuth,
  type AuthErrors,
  type AuthMode,
} from "@/lib/auth-validation";

export type AuthState = {
  message?: string;
  errors?: AuthErrors;
};

export async function authenticate(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const mode: AuthMode = formData.get("mode") === "signup" ? "signup" : "login";
  const errors = validateAuth(mode, readAuthFields(formData));

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // TODO: No auth provider is connected yet, so any well-formed credentials
  // get through. Call your provider's sign-in / sign-up here and return
  // { message } on failure instead of redirecting.
  redirect("/");
}
