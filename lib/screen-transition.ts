import { flushSync } from "react-dom";

export type ScreenSwap = "in" | "out";

let latest = 0;

/**
 * Applies a React state update as a view transition: the browser animates
 * from a snapshot of the screen before the update to the screen after it.
 * The `data-screen-swap` attribute picks the animation in app/globals.css.
 * Resolves once the animation has finished. Without View Transitions support
 * (or in a hidden tab) the browser skips the animation and simply cuts.
 */
export function swapScreens(direction: ScreenSwap, update: () => void): Promise<void> {
  if (typeof document.startViewTransition !== "function") {
    update();
    return Promise.resolve();
  }
  const swap = ++latest;
  const root = document.documentElement;
  root.dataset.screenSwap = direction;
  const transition = document.startViewTransition(() => flushSync(update));
  // A skipped transition (tab hidden, viewport resized) rejects `ready`; the
  // update still applies, so that is no error here.
  transition.ready.catch(() => {});
  // The swaps animate for about a second. A window that stops drawing
  // mid-swap would hold `finished` (and whatever waits on it, like the
  // navigation) indefinitely, so cut the animation short past this.
  const cap = window.setTimeout(() => transition.skipTransition(), 2000);
  return transition.finished
    .catch(() => {})
    .finally(() => {
      window.clearTimeout(cap);
      // A newer swap owns the attribute now.
      if (swap === latest) delete root.dataset.screenSwap;
    });
}
