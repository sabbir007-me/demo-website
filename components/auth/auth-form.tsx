"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { CircleAlert, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authenticate, type AuthState } from "@/lib/actions/auth";
import {
  FIELD_ORDER,
  MIN_PASSWORD,
  readAuthFields,
  validateAuth,
  type AuthErrors,
  type AuthFields,
  type AuthMode,
} from "@/lib/auth-validation";

const COPY = {
  login: {
    title: "Welcome back",
    description: "Sign in to your Corridor account.",
    submit: "Sign in",
    pending: "Signing in…",
    switchText: "Don't have an account?",
    switchLabel: "Create one",
    switchHref: "/signup",
  },
  signup: {
    title: "Create your account",
    description: "Start with a hero that already looks finished.",
    submit: "Create account",
    pending: "Creating account…",
    switchText: "Already have an account?",
    switchLabel: "Sign in",
    switchHref: "/login",
  },
} as const;

// 44px tall: comfortable touch targets.
const inputClass = "h-11 px-3";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const [state, formAction, pending] = React.useActionState<AuthState, FormData>(
    authenticate,
    {},
  );
  const [clientErrors, setClientErrors] = React.useState<AuthErrors | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const summaryRef = React.useRef<HTMLDivElement>(null);
  const copy = COPY[mode];

  const errors = clientErrors ?? state.errors ?? {};
  const errorFields = FIELD_ORDER.filter((field) => errors[field]);

  // Server-side failures land here; move focus to the summary like the
  // client-side path does.
  React.useEffect(() => {
    if (state.errors && Object.keys(state.errors).length > 0) {
      summaryRef.current?.focus();
    }
  }, [state]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const found = validateAuth(mode, readAuthFields(formData));

    if (Object.keys(found).length > 0) {
      // Render the summary first so it exists to receive focus.
      flushSync(() => setClientErrors(found));
      summaryRef.current?.focus();
      return;
    }

    setClientErrors(null);
    // Dispatching manually (instead of <form action>) skips React's automatic
    // form reset, so fields keep their values if the server rejects them.
    React.startTransition(() => formAction(formData));
  }

  function clearError(field: keyof AuthFields) {
    setClientErrors((prev) => {
      if (!prev?.[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function describedBy(field: keyof AuthFields, hasDescription = false) {
    const ids = [
      hasDescription ? `${field}-description` : null,
      errors[field] ? `${field}-error` : null,
    ].filter(Boolean);
    return ids.length > 0 ? ids.join(" ") : undefined;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      <input type="hidden" name="mode" value={mode} />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="text-muted-foreground">{copy.description}</p>
      </div>

      {errorFields.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          aria-labelledby="error-summary-title"
          className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 outline-none focus-visible:ring-2 focus-visible:ring-destructive/60"
        >
          <p
            id="error-summary-title"
            className="flex items-center gap-2 text-sm font-medium text-destructive"
          >
            <CircleAlert className="size-4 shrink-0" aria-hidden />
            {errorFields.length === 1 ? "There's a problem" : "There are some problems"}
          </p>
          <ul className="mt-2 flex flex-col gap-1 pl-6 text-sm">
            {errorFields.map((field) => (
              <li key={field}>
                <a
                  href={`#${field}`}
                  onClick={(event) => {
                    event.preventDefault();
                    document.getElementById(field)?.focus();
                  }}
                  className="rounded text-foreground underline underline-offset-4 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {errors[field]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {state.message ? (
        <p
          role="alert"
          className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
        >
          {state.message}
        </p>
      ) : null}

      <FieldGroup>
        {mode === "signup" ? (
          <Field data-invalid={errors.name ? true : undefined}>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              required
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={describedBy("name")}
              onChange={() => clearError("name")}
              className={inputClass}
            />
            {/* The focused summary already announces errors, so no live region here. */}
            <FieldError id="name-error" role={undefined}>
              {errors.name}
            </FieldError>
          </Field>
        ) : null}

        <Field data-invalid={errors.email ? true : undefined}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@example.com"
            required
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
            onChange={() => clearError("email")}
            className={inputClass}
          />
          <FieldError id="email-error" role={undefined}>
            {errors.email}
          </FieldError>
        </Field>

        <Field data-invalid={errors.password ? true : undefined}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              minLength={mode === "signup" ? MIN_PASSWORD : undefined}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={describedBy("password", mode === "signup")}
              onChange={() => clearError("password")}
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden />
              ) : (
                <Eye className="size-4" aria-hidden />
              )}
            </button>
          </div>
          {mode === "signup" ? (
            <FieldDescription id="password-description">
              At least {MIN_PASSWORD} characters.
            </FieldDescription>
          ) : null}
          <FieldError id="password-error" role={undefined}>
            {errors.password}
          </FieldError>
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-4">
        <Button type="submit" disabled={pending} className="h-11 w-full gap-2 text-base">
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {copy.pending}
            </>
          ) : (
            copy.submit
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {copy.switchText}{" "}
          <Link
            href={copy.switchHref}
            className="rounded font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copy.switchLabel}
          </Link>
        </p>
      </div>
    </form>
  );
}
