import BoxLoader from "@/components/ui/box-loader";

type LoadingOverlayProps = {
  visible: boolean;
  /** What is loading. Shown under the loader and announced to screen readers. */
  label?: string;
};

/*
 * A full screen that hides the page while it loads. It comes and goes as a
 * view transition (lib/screen-transition.ts); whatever renders it should
 * also make the page under it inert.
 */
export function LoadingOverlay({ visible, label = "Loading" }: LoadingOverlayProps) {
  return (
    <>
      {visible ? (
        <div
          aria-hidden
          className="fixed inset-0 z-[100] grid place-items-center bg-background px-4"
        >
          {/* Its own snapshot in the screen swaps, so it can move separately.
              The cubes' floor shadow hangs below the loader's box; the gap clears it. */}
          <div className="flex flex-col items-center gap-[calc(var(--box-size)*2.5)] [--box-size:clamp(48px,17vw,64px)] [view-transition-name:loading-screen-loader]">
            <BoxLoader />
            <p className="text-center text-base text-muted-foreground">{label}…</p>
          </div>
        </div>
      ) : null}
      {/* Always mounted, so the change of text is announced. */}
      <p role="status" className="sr-only">
        {visible ? `${label}…` : ""}
      </p>
    </>
  );
}
