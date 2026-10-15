import { Check, Eye, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

/* Features as a bento grid (UI/UX Pro Max: "Bento Box Grid" style,
 * "Bento Grid Showcase" pattern). Each tile illustrates its own claim with
 * a small decorative scene instead of an icon. Tiles aren't links, so hover
 * only brightens the border; nothing lifts as if clickable. Pure CSS, and
 * every scene is already in its finished state under reduced motion. */

// Screenshots of this site's own pages (public/bento/sites), so the wall
// reads as whole websites rather than repeating the corridor's code cards.
const site = (name: string) => `/bento/sites/${name}.webp`;

// Three columns, each mixing light and dark pages. [file, address shown]
const COLUMNS: [string, string][][] = [
  [["home", "itzsabbir.me"], ["kotlin", "/works/kotlin"], ["csharp", "/works/csharp"], ["login", "/login"]],
  [["python", "/works/python"], ["swift", "/works/swift"], ["dashboard", "/dashboard"], ["go", "/works/go"]],
  [["rust", "/works/rust"], ["signup", "/signup"], ["typescript", "/works/typescript"], ["php", "/works/php"]],
];

const STACK = ["Next.js 16", "TypeScript", "Tailwind CSS v4", "shadcn/ui"];

function Tile({
  index,
  title,
  body,
  className,
  children,
}: {
  index: number;
  title: string;
  body: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <li
      className={cn(
        "group relative isolate flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card p-6 transition-colors duration-300 hover:border-foreground/25 sm:p-7",
        className,
      )}
    >
      {/* A soft light from above, the same glow the hero and CTA use. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-2/3 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(70% 60% at 50% 0%, var(--glow), transparent 70%)" }}
      />
      <div aria-hidden className="relative flex-1">
        {children}
      </div>
      <div className="mt-6">
        <p className="font-mono text-xs tabular-nums text-muted-foreground">{String(index).padStart(2, "0")}</p>
        <h3 className="mt-2 text-lg font-medium tracking-tight">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </li>
  );
}

/* 01: a tilted wall of browser windows, columns drifting in opposite directions. */
function BrowserCard({ name, address }: { name: string; address: string }) {
  return (
    <div className="mb-3 overflow-hidden rounded-xl border border-border bg-card shadow-[0_18px_40px_-18px_rgb(0_0_0/0.45)]">
      <div className="flex h-5 items-center gap-1 border-b border-border px-2">
        <span className="size-1.5 rounded-full bg-red-400/80" />
        <span className="size-1.5 rounded-full bg-amber-400/80" />
        <span className="size-1.5 rounded-full bg-emerald-400/80" />
        <span className="mx-auto truncate rounded-full bg-muted px-2 font-mono text-[7px] leading-3 text-muted-foreground">
          {address}
        </span>
      </div>
      {/* Plain <img>: small decorative screenshots, already sized by the column. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={site(name)}
        alt=""
        // Not lazy: hidden copies scroll into view inside the tile.
        decoding="async"
        draggable={false}
        className="block aspect-[16/10] w-full object-cover"
      />
    </div>
  );
}

function WallScene() {
  return (
    // The mask fades the wall out at the top and bottom of the scene.
    <div className="relative h-64 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)] sm:h-80 lg:h-full lg:min-h-80">
      <div className="absolute -inset-x-[12%] -inset-y-1/2 flex -rotate-12 justify-center gap-3">
        {COLUMNS.map((column, c) => (
          <div key={c} className="min-w-0 flex-1">
            {/* Four copies, so even the tall desktop tile stays filled and
                the loop (half the list) has no seam. */}
            <div className={cn("bento-column", c % 2 === 1 && "bento-column--down")}>
              {[...column, ...column, ...column, ...column].map(([name, address], i) => (
                <BrowserCard key={i} name={name} address={address} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 02: a keyframe timeline with a playhead, driven by one CSS animation. */
function KeyframeScene() {
  return (
    <div className="flex h-full min-h-40 flex-col justify-center gap-4">
      <pre className="font-mono text-xs leading-relaxed text-muted-foreground">
        <span className="text-foreground">@keyframes</span> stream {"{"}
        {"\n"}
        {"  "}to {"{"} transform: translateZ(0); {"}"}
        {"\n"}
        {"}"}
      </pre>
      <div className="relative h-10">
        <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
        {[0, 25, 50, 75, 100].map((p) => (
          <span key={p} className="absolute top-1/2 size-2 -translate-1/2 rotate-45 border border-border bg-card" style={{ left: `${p}%` }} />
        ))}
        {/* The track itself slides, so the playhead moves on transform alone. */}
        <span className="bento-playhead absolute inset-0">
          <span className="absolute top-0 left-0 h-full w-px bg-foreground">
            <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-foreground" />
          </span>
        </span>
      </div>
      <div className="flex justify-between font-mono text-[11px] text-muted-foreground tabular-nums">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

/* 03: the same scene in phone, tablet and desktop frames. */
function WidthScene() {
  const frame = "absolute bottom-0 left-0 rounded-lg border border-border bg-background/60";
  return (
    <div className="relative h-40">
      <div className={cn(frame, "h-full w-full")} />
      <div className={cn(frame, "h-[78%] w-[62%]")} />
      <div className={cn(frame, "h-[56%] w-[28%] border-foreground/40")} />
      <span className="absolute top-2 right-3 font-mono text-[11px] text-muted-foreground">100cqw</span>
      <span className="absolute bottom-2 left-2 h-1 w-[calc(28%-1rem)] rounded-full bg-foreground/50" />
    </div>
  );
}

/* 04: the OS setting, switched on, and the corridor paused. */
function ReducedMotionScene() {
  return (
    <div className="flex h-40 flex-col justify-center gap-4">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3">
        <span className="font-mono text-[11px] leading-tight text-muted-foreground">prefers-reduced-motion</span>
        <span className="flex h-6 w-10 shrink-0 items-center justify-end rounded-full bg-foreground p-0.5">
          <span className="size-5 rounded-full bg-background" />
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="flex size-7 items-center justify-center rounded-full border border-border">
          <Pause className="size-3.5" />
        </span>
        Finished still
      </div>
    </div>
  );
}

/* 05: the stack, as layers. */
function StackScene() {
  return (
    <div className="flex h-full min-h-40 flex-col justify-center gap-2">
      {STACK.map((item, i) => (
        <span
          key={item}
          className="flex h-9 items-center justify-between rounded-xl border border-border bg-background/60 px-3 font-mono text-xs"
          style={{ marginLeft: `${i * 6}%`, marginRight: `${(STACK.length - 1 - i) * 6}%` }}
        >
          <span className="text-foreground">{item}</span>
          <span className="text-muted-foreground">0{i + 1}</span>
        </span>
      ))}
    </div>
  );
}

/* 06: a sign-in form, mid-way through being filled in. */
function AuthScene() {
  return (
    <div className="mx-auto flex h-full min-h-40 w-full max-w-sm flex-col justify-center gap-2.5">
      <span className="flex h-10 items-center justify-between rounded-xl border border-border bg-background/60 px-3 text-sm">
        <span>you@studio.dev</span>
        <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
      </span>
      <span className="flex h-10 items-center justify-between rounded-xl border border-foreground/40 bg-background/60 px-3 text-sm ring-2 ring-foreground/10">
        <span className="tracking-[0.3em]">••••••••</span>
        <Eye className="size-4 text-muted-foreground" />
      </span>
      <span className="flex h-10 items-center justify-center rounded-xl bg-foreground text-sm font-medium text-background">
        Sign in
      </span>
    </div>
  );
}

export function FeatureBento() {
  return (
    <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Tile
        index={1}
        title="Images lead"
        body="Your work streams toward the viewer on two mirrored rails, so the hero shows instead of tells."
        className="md:col-span-2 lg:row-span-2"
      >
        <WallScene />
      </Tile>
      <Tile
        index={2}
        title="Pure CSS motion"
        body="One set of generated keyframes drives every card. Nothing to load, nothing running on the main thread."
        className="md:col-span-2"
      >
        <KeyframeScene />
      </Tile>
      <Tile
        index={3}
        title="Fits any width"
        body="Every length is in container units, so the corridor keeps its shape from a phone to an ultrawide."
      >
        <WidthScene />
      </Tile>
      <Tile
        index={4}
        title="Respects reduced motion"
        body="With reduced motion on, the corridor pauses as a finished still instead of collapsing."
      >
        <ReducedMotionScene />
      </Tile>
      <Tile
        index={5}
        title="Built on shadcn/ui"
        body="Next.js, TypeScript, Tailwind CSS v4 and shadcn/ui — copy the components straight into your project."
        className="md:col-span-2"
      >
        <StackScene />
      </Tile>
      <Tile
        index={6}
        title="Auth screens included"
        body="Sign-in and sign-up pages share the same look, with inline validation and a show-password toggle."
        className="md:col-span-2"
      >
        <AuthScene />
      </Tile>
    </ul>
  );
}
