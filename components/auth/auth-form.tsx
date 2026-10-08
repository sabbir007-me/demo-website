"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { authenticate, type AuthMode, type AuthState } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const COPY = {
  login: {
    eyebrow: "Corridor · Secure node 01",
    title: ["Welcome", "back"],
    submit: "Sign in",
    pending: "Signing in…",
    links: [
      // Placeholder until a password-reset flow exists.
      { label: "Forgot password", href: "#" },
      { label: "Create account", href: "/signup" },
    ],
  },
  signup: {
    eyebrow: "Corridor · New archive",
    title: ["Create", "account"],
    submit: "Create account",
    pending: "Creating account…",
    links: [
      { label: "Back to home", href: "/" },
      { label: "Sign in instead", href: "/login" },
    ],
  },
} as const;

// The signature ease of the reference: fast out, long settle.
const settle = "ease-[cubic-bezier(0.2,1,0.3,1)]";

// Staggered rise-in. The delay goes inline because Tailwind can't see
// class names assembled at runtime.
const enter = cn(
  "animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 motion-reduce:animate-none",
  settle,
);
const stagger = (ms: number): React.CSSProperties => ({ animationDelay: `${ms}ms` });

type FieldProps = React.ComponentProps<"input"> & {
  id: string;
  label: string;
  error?: string;
  trailing?: React.ReactNode;
};

function Field({ id, label, error, trailing, className, ...props }: FieldProps) {
  const errorId = `${id}-error`;
  return (
    <div
      className={cn(
        "group/field transition-transform duration-500 focus-within:translate-x-2.5 motion-reduce:transition-none motion-reduce:focus-within:translate-x-0",
        settle,
      )}
    >
      <label
        htmlFor={id}
        className="block font-terminal text-[11px] tracking-[0.14em] text-white/55 uppercase transition-colors group-focus-within/field:text-white/90"
      >
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "peer w-full rounded-none border-0 border-b border-white/15 bg-transparent py-3 text-lg text-white caret-white outline-none transition-colors placeholder:text-white/30 hover:border-white/30 aria-invalid:border-red-400/50",
            "autofill:shadow-[inset_0_0_0_1000px_#050505] autofill:[-webkit-text-fill-color:#fff]",
            trailing ? "pr-11" : null,
            className,
          )}
          {...props}
        />
        {/* The mercury line that pours across the field on focus. */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[#e0e0e0] shadow-[0_0_15px_#e0e0e0] transition-transform duration-700 peer-focus:scale-x-100 motion-reduce:transition-none",
            "peer-aria-invalid:scale-x-100 peer-aria-invalid:bg-red-400 peer-aria-invalid:shadow-[0_0_12px_rgb(248_113_113/0.6)]",
            settle,
          )}
        />
        {trailing}
      </div>
      {error ? (
        <p id={errorId} className="mt-2 font-terminal text-[11px] text-red-400">
          {error}
        </p>
      ) : null}
    </div>
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
  const fieldDelay = mode === "signup" ? 80 : 0;

  // Dispatching manually (instead of <form action>) skips React's automatic
  // form reset, so the fields keep what was typed when validation fails.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    React.startTransition(() => formAction(formData));
  }

  return (
    <div>
      {/* Blur + alpha threshold: makes the button and its drop melt together. */}
      <svg aria-hidden className="absolute size-0">
        <defs>
          <filter id="mercury-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <header className={cn("mb-14", enter)} style={stagger(100)}>
        <p className="font-terminal text-[11px] tracking-[0.35em] text-white/50 uppercase">
          {copy.eyebrow}
        </p>
        <h1 className="mt-3 -ml-0.5 text-5xl leading-[0.9] font-extrabold tracking-[-0.045em] uppercase">
          {copy.title[0]}
          <br />
          {copy.title[1]}
        </h1>
      </header>

      <form onSubmit={handleSubmit}>
        <input type="hidden" name="mode" value={mode} />

        {state.message ? (
          <p
            role="alert"
            className="mb-8 border-l-2 border-red-400 bg-red-500/10 px-3 py-2 font-terminal text-xs text-red-300"
          >
            {state.message}
          </p>
        ) : null}

        <div className="flex flex-col gap-8">
          {mode === "signup" ? (
            <div className={enter} style={stagger(200)}>
              <Field
                id="name"
                name="name"
                label="Name"
                autoComplete="name"
                placeholder="Ada Lovelace"
                required
                error={errors.name}
              />
            </div>
          ) : null}

          <div className={enter} style={stagger(200 + fieldDelay)}>
            <Field
              id="email"
              name="email"
              type="email"
              label="Email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              error={errors.email}
            />
          </div>

          <div className={enter} style={stagger(280 + fieldDelay)}>
            <Field
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
              required
              minLength={mode === "signup" ? 8 : undefined}
              error={errors.password}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 my-auto flex size-11 items-center justify-center rounded-md text-white/45 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  aria-label="Show password"
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff size={18} aria-hidden />
                  ) : (
                    <Eye size={18} aria-hidden />
                  )}
                </button>
              }
            />
          </div>
        </div>

        {/* The focus ring lives outside the goo filter, which would erase it. */}
        <div
          className={cn(
            "mt-12 rounded-[1.25rem] has-focus-visible:ring-2 has-focus-visible:ring-white/70 has-focus-visible:ring-offset-4 has-focus-visible:ring-offset-[#050505]",
            enter,
          )}
          style={stagger(380 + fieldDelay)}
        >
          <div className="group/submit relative [filter:url(#mercury-goo)]">
            <span
              aria-hidden
              className="absolute inset-0 rounded-full bg-[#e0e0e0] transition-[scale,filter] duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover/submit:scale-x-105 group-hover/submit:scale-y-120 group-hover/submit:brightness-110 motion-reduce:transition-none"
            />
            <button
              type="submit"
              disabled={pending}
              className="relative flex w-full items-center justify-center gap-2 rounded-[1.1rem] bg-white px-10 py-5 text-sm font-extrabold tracking-[0.15em] text-black uppercase transition-[letter-spacing] duration-300 outline-none hover:tracking-[0.28em] disabled:cursor-wait disabled:hover:tracking-[0.15em] motion-reduce:transition-none"
            >
              {pending ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden />
                  {copy.pending}
                </>
              ) : (
                copy.submit
              )}
            </button>
          </div>
        </div>
      </form>

      <nav
        aria-label="Account"
        className={cn(
          "mt-8 flex justify-between font-terminal text-[11px] tracking-[0.08em] uppercase",
          enter,
        )}
        style={stagger(460 + fieldDelay)}
      >
        {copy.links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="inline-flex min-h-11 items-center rounded-sm text-white/55 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
