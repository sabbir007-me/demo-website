"use client";

import * as React from "react";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useLoadingWithParticles } from "@/hooks/use-loading-with-particles";
import { swapScreens } from "@/lib/screen-transition";

type ShowWhile = ReturnType<typeof useLoadingWithParticles>["showWhile"];

const LoadingContext = React.createContext<ShowWhile | null>(null);

/**
 * Mounted in the root layout so the loading screen outlasts the route that
 * opened it: a click on the dashboard keeps it up while the next page builds.
 */
export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const { loading, label, showWhile } = useLoadingWithParticles(swapScreens);

  // Inert stops clicks and focus but not scrolling, which could carry the new
  // page's sculpture out of view (pausing it) before it reports in. The
  // gutter stays reserved, so a classic scrollbar coming back doesn't resize
  // the page as it is revealed. A layout effect, so all of this lands before
  // the screen swap snapshots the page.
  React.useLayoutEffect(() => {
    if (!loading) return;
    const root = document.documentElement;
    const { overflow, scrollbarGutter } = root.style;
    const focused = document.activeElement;
    root.style.overflow = "hidden";
    root.style.scrollbarGutter = "stable";
    return () => {
      Object.assign(root.style, { overflow, scrollbarGutter });
      // The inert page dropped focus. If loading ended where it began (Back
      // pressed), hand it back; an element on a page hidden since can't take it.
      if (focused instanceof HTMLElement && focused.isConnected) {
        focused.focus({ preventScroll: true });
      }
    };
  }, [loading]);

  return (
    <LoadingContext value={showWhile}>
      {/* `contents` keeps the body's flex layout; inert also stops keyboard and screen reader access. */}
      <div className="contents" inert={loading} aria-busy={loading}>
        {children}
      </div>
      <LoadingOverlay visible={loading} label={label} />
    </LoadingContext>
  );
}

export function useLoading() {
  const showWhile = React.use(LoadingContext);
  if (!showWhile) throw new Error("useLoading must be used inside <LoadingProvider>");
  return { showWhile };
}
