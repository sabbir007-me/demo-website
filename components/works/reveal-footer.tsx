"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, ArrowUp, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type RevealFooterProps = {
  /** The language name, set as the giant word along the bottom. */
  title: string;
  /** Words for the diagonal marquee. */
  marquee: string[];
  next: { title: string; href: string } | null;
};

// A glass pill that leans toward the pointer and springs back with a small
// overshoot when it leaves. Touch input never moves it.
function Magnetic({ className, children, ...props }: React.ComponentProps<typeof Link>) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 11, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 180, damping: 11, mass: 0.5 });
  const reduce = useReducedMotion();

  return (
    <motion.div
      style={reduce ? undefined : { x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.45);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="inline-flex"
    >
      <Link
        {...props}
        className={cn(
          "inline-flex items-center gap-2.5 rounded-full border border-border/70 bg-foreground/[0.04] backdrop-blur-md transition-colors hover:border-foreground/30 hover:bg-foreground/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
      >
        {children}
      </Link>
    </motion.div>
  );
}

// Curtain reveal: the page above lifts away (its rounded bottom sits on top
// of this) while the footer stays pinned to the bottom of the viewport. The
// clip-path keeps the pinned footer hidden until its slot scrolls into view.
export function RevealFooter({ title, marquee, next }: RevealFooterProps) {
  const slot = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: slot, offset: ["start end", "end end"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [140, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.25, 0.85], [0, 1]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const wordY = useTransform(scrollYProgress, [0, 1], ["45%", "22%"]);
  const stripX = useTransform(scrollYProgress, [0, 1], ["6%", "0%"]);

  const items = [...marquee, ...marquee];

  return (
    <div
      ref={slot}
      className="relative -mt-12 h-svh sm:-mt-16"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="relative -top-[100svh] h-[200svh]">
        <footer className="sticky top-0 flex h-svh flex-col overflow-hidden bg-[color-mix(in_oklch,var(--background)_94%,var(--foreground))] pt-12 sm:pt-16">
          {/* grid and glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_7%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_7%,transparent)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_50%_45%,black_30%,transparent_80%)]"
          />
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="reveal-aurora absolute left-1/2 top-[38%] h-[46vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--work-accent)] opacity-25 blur-[90px] dark:opacity-20" />
            <div className="reveal-aurora reveal-aurora--slow absolute left-[30%] top-[55%] h-[34vmin] w-[44vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground opacity-[0.06] blur-[80px]" />
          </div>

          {/* diagonal marquee */}
          <motion.div
            aria-hidden
            style={reduce ? undefined : { x: stripX }}
            className="relative -left-[10%] mt-6 w-[120%] -rotate-[3deg] border-y border-border/60 bg-background/40 py-4 backdrop-blur-sm sm:mt-10"
          >
            <div className="reveal-marquee flex w-max items-center gap-10 pr-10">
              {items.map((word, i) => (
                <span key={i} className="flex items-center gap-10">
                  <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground sm:text-sm">
                    {word}
                  </span>
                  <span className="text-[var(--work-accent)]">✦</span>
                </span>
              ))}
            </div>
          </motion.div>

          {/* call to action */}
          <motion.div
            style={reduce ? undefined : { y: contentY, opacity: contentOpacity, scale: contentScale }}
            className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-24 text-center"
          >
            <h2 className="text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.045em] sm:text-7xl lg:text-8xl">
              <span className="bg-gradient-to-b from-foreground to-foreground/55 bg-clip-text text-transparent">
                Ready for the{" "}
              </span>
              <span className="pr-2 font-[family-name:var(--font-instrument)] font-normal italic tracking-normal text-[var(--work-accent)]">
                next one?
              </span>
            </h2>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {next ? (
                <Magnetic href={next.href} className="h-14 px-7 text-base font-medium">
                  Next: {next.title}
                  <ArrowRight className="size-4" aria-hidden />
                </Magnetic>
              ) : null}
              <Magnetic href="/dashboard" className="h-14 px-7 text-base font-medium">
                All works
              </Magnetic>
            </div>

            <nav aria-label="Footer" className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "The code", href: "#code" },
                { label: "Dashboard", href: "/dashboard" },
              ].map((link) => (
                <Magnetic
                  key={link.label}
                  href={link.href}
                  className="h-11 px-5 text-sm text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </Magnetic>
              ))}
            </nav>
          </motion.div>

          {/* giant word */}
          <motion.p
            aria-hidden
            style={{
              y: reduce ? "22%" : wordY,
              fontSize: `min(${Math.round(118 / Math.max(title.length, 2))}vw, 26rem)`,
            }}
            className="pointer-events-none absolute inset-x-0 bottom-0 select-none text-center font-semibold uppercase leading-none tracking-[-0.06em] [background-image:linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_11%,transparent),transparent_85%)] bg-clip-text text-transparent"
          >
            {title}
          </motion.p>

          {/* bottom bar */}
          <div className="relative z-10 flex items-center justify-between gap-4 px-5 pb-6 sm:px-10 sm:pb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">
              © 2026 Corridor
            </p>
            <p className="hidden items-center gap-2 rounded-full border border-border/70 bg-background/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-md sm:flex">
              Crafted with
              <Heart className="size-3.5 fill-[#ff4d6d] text-[#ff4d6d]" aria-hidden />
              in <span className="normal-case tracking-normal text-foreground">Corridor</span>
            </p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
              aria-label="Back to top"
              className="flex size-12 items-center justify-center rounded-full border border-border/70 bg-background/60 text-foreground backdrop-blur-md transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowUp className="size-4" aria-hidden />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
