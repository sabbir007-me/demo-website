"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SYSTEM_DARK, THEME_KEY, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

function storedTheme(): Theme | null {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "light" || t === "dark" ? t : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  // Swap without every `transition-colors` element animating at its own pace.
  const freeze = document.createElement("style");
  freeze.textContent = "*,*::before,*::after{transition:none!important}";
  document.head.appendChild(freeze);
  root.classList.toggle("dark", theme === "dark");
  // Flush styles so the swap lands while transitions are still frozen.
  void window.getComputedStyle(root).opacity;
  requestAnimationFrame(() => freeze.remove());
}

function resolvedTheme(): Theme {
  return storedTheme() ?? (window.matchMedia(SYSTEM_DARK).matches ? "dark" : "light");
}

/**
 * Mounted once in the root layout. The inline head script sets the theme on
 * hard loads; this keeps it right afterwards: it re-applies after the dev
 * Strict Mode remount resets <html>'s class, follows OS changes while no
 * explicit choice is saved, and syncs a choice made in another tab.
 */
export function ThemeSync() {
  React.useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme() === "dark");

    const system = window.matchMedia(SYSTEM_DARK);
    const onSystem = () => {
      if (!storedTheme()) applyTheme(resolvedTheme());
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_KEY) applyTheme(resolvedTheme());
    };
    system.addEventListener("change", onSystem);
    window.addEventListener("storage", onStorage);
    return () => {
      system.removeEventListener("change", onSystem);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return null;
}

/** Flips between light and dark and remembers the choice. */
export function ThemeToggle({ className }: { className?: string }) {
  function toggle() {
    const next: Theme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage blocked: the switch still applies for this page view.
    }
    applyTheme(next);
  }

  // The icon follows the `dark` class through CSS, so the server render and
  // the hydrated client always agree whatever the stored theme is.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      title="Toggle theme"
      className={buttonVariants({
        variant: "ghost",
        size: "icon",
        className: cn("size-10 text-muted-foreground", className),
      })}
    >
      <Sun className="hidden size-5 dark:block" aria-hidden />
      <Moon className="size-5 dark:hidden" aria-hidden />
    </button>
  );
}
