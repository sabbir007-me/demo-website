"use client";

import * as React from "react";

type ShowWhileOptions = {
  /** Shortest time loading lasts, so the loader never just flickers. */
  minMs?: number;
  /** What is loading, for the loading screen. */
  label?: string;
};

/** Applies the loading on/off update, e.g. as an animated screen swap. */
type Swap = (direction: "in" | "out", update: () => void) => Promise<void>;

const immediate: Swap = async (_, update) => update();

/**
 * Loading state that stays on until a task settles *and* `minMs` has passed.
 * A task that rejects still ends it: the loader must never get stuck.
 */
export function useLoadingWithParticles(swap: Swap = immediate) {
  const [state, setState] = React.useState<{ loading: boolean; label?: string }>({
    loading: false,
  });
  // When calls overlap, only the newest may end the loading state.
  const latest = React.useRef(0);

  const showWhile = React.useCallback(
    async (
      task: Promise<unknown> | (() => Promise<unknown>),
      { minMs = 2000, label }: ShowWhileOptions = {},
    ) => {
      const call = ++latest.current;
      const minimum = new Promise((resolve) => setTimeout(resolve, minMs));
      const shown = swap("in", () => setState({ loading: true, label }));
      // A function only starts once the loader is fully up, so whatever it
      // changes (a navigation, say) happens out of sight.
      const work = typeof task === "function" ? shown.then(task) : task;
      // `shown` too, so the screen is never taken down before it is fully up.
      await Promise.all([shown, work.catch(() => {}), minimum]);
      if (call === latest.current) await swap("out", () => setState({ loading: false }));
    },
    [swap],
  );

  return { ...state, showWhile };
}
