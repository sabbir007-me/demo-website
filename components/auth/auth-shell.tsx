import Link from "next/link";
import { Inter, Space_Mono } from "next/font/google";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LiquidMetalBackground } from "@/components/ui/liquid-metal-background";
import { cn } from "@/lib/utils";

// The Neural Access look: a heavy grotesk display face over terminal labels.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-space-mono",
});

/**
 * Full-bleed auth layout: a single form column floating over a raymarched
 * liquid-metal scene. The column carries `data-liquid-avoid` so the metal
 * stays out from behind the fields.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main
      className={cn(
        inter.variable,
        spaceMono.variable,
        "relative isolate flex min-h-svh flex-col bg-background font-display text-foreground",
      )}
    >
      <LiquidMetalBackground className="fixed inset-0 -z-10 size-full" />
      {/* Keeps the form legible whenever a blob drifts toward the centre. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_45%_60%_at_50%_50%,color-mix(in_srgb,var(--background)_92%,transparent)_0%,color-mix(in_srgb,var(--background)_60%,transparent)_55%,transparent_100%)]"
      />

      <header className="flex items-center justify-between px-6 pt-6 md:px-10 md:pt-10">
        <Link
          href="/"
          aria-label="Corridor home"
          className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <Logo />
        </Link>
        <ThemeToggle />
      </header>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div data-liquid-avoid className="w-full max-w-[22rem]">
          {children}
        </div>
      </div>
    </main>
  );
}
