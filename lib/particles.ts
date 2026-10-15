/*
 * A work page draws its language's logo in particles after it mounts, so
 * whatever starts the navigation can't hand it a callback. The sculpture
 * (components/works/work-sculpture.tsx) fires a window event instead.
 */

const READY = "particles:ready";

export function signalParticlesReady() {
  window.dispatchEvent(new Event(READY));
}

/**
 * Resolves when the next particle effect is on screen. It also gives up on
 * Back/Forward (the page that would signal is gone) and after `timeoutMs`
 * (a failed load), so a loader waiting on it can't be held up forever.
 */
export function waitForParticles(timeoutMs = 10_000): Promise<void> {
  return new Promise((resolve) => {
    const done = () => {
      window.removeEventListener(READY, done);
      window.removeEventListener("popstate", done);
      window.clearTimeout(timer);
      resolve();
    };
    const timer = window.setTimeout(done, timeoutMs);
    window.addEventListener(READY, done);
    window.addEventListener("popstate", done);
  });
}
