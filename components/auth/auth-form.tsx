"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/saa-s-template";
import { authenticate, type AuthMode, type AuthState } from "@/lib/actions/auth";

const COPY = {
  login: {
    title: "Welcome back",
    description: "Sign in to your account to continue.",
    submit: "Sign in",
    pending: "Signing in…",
    switchText: "Don't have an account?",
    switchLabel: "Sign up",
    switchHref: "/signup",
  },
  signup: {
    title: "Create your account",
    description: "Start streaming your work in under a minute.",
    submit: "Create account",
    pending: "Creating account…",
    switchText: "Already have an account?",
    switchLabel: "Sign in",
    switchHref: "/login",
  },
} as const;

// Same gradient treatment as the landing page headline.
const gradientText: React.CSSProperties = {
  background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  letterSpacing: "-0.04em",
};

const inputClass = "h-10 border-gray-800 bg-gray-900/50 px-3 placeholder:text-gray-500";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-xs text-red-400">
      {message}
    </p>
  );
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const [state, formAction, pending] = React.useActionState<AuthState, FormData>(
    authenticate,
    {},
  );
  const [showPassword, setShowPassword] = React.useState(false);
  const copy = COPY[mode];
  const errors = state.errors ?? {};

  // Dispatching manually (instead of <form action>) skips React's automatic
  // form reset, so the fields keep what was typed when validation fails.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    React.startTransition(() => formAction(formData));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <input type="hidden" name="mode" value={mode} />

      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-medium" style={gradientText}>
          {copy.title}
        </h1>
        <p className="text-sm text-gray-400">{copy.description}</p>
      </div>

      {state.message ? (
        <p
          role="alert"
          className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
        >
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-4">
        {mode === "signup" ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Ada Lovelace"
              required
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={inputClass}
            />
            <FieldError id="name-error" message={errors.name} />
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputClass}
          />
          <FieldError id="email-error" message={errors.email} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {mode === "login" ? (
              // Placeholder until a password-reset flow exists.
              <a href="#" className="text-xs text-gray-400 transition-colors hover:text-white">
                Forgot password?
              </a>
            ) : null}
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
              required
              minLength={mode === "signup" ? 8 : undefined}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-gray-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <FieldError id="password-error" message={errors.password} />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className={buttonVariants({
          variant: "gradient",
          size: "lg",
          className: "w-full rounded-lg hover:scale-[1.02] active:scale-[0.98]",
        })}
      >
        {pending ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden />
            {copy.pending}
          </>
        ) : (
          copy.submit
        )}
      </button>

      <p className="text-center text-sm text-gray-400">
        {copy.switchText}{" "}
        <Link
          href={copy.switchHref}
          className="font-medium text-white underline-offset-4 hover:underline"
        >
          {copy.switchLabel}
        </Link>
      </p>
    </form>
  );
}
