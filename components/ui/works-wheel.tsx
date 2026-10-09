"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Orbit } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * A ring of cards that unrolls into a 3D drum. Position 0 is the ring
 * overview; position k (1…n) focuses card k-1 on the drum. Scroll, drag,
 * the arrow keys, the index or the control bar move between them.
 *
 * Geometry ported from crafterui's Works Wheel. Everything is measured
 * against the drum card height so the wheel scales with its stage.
 */

export type WorksWheelItem = {
  id: string;
  title: string;
  image: string;
};

const CARD_ASPECT = 1.45;
const CARD_HEIGHT = 0.38; // share of the stage height
const CARD_WIDTH = 0.34; // share of the stage width…
const CARD_WIDTH_NARROW = 0.78; // …or on phones, where the drum card fills the screen
const RING_RADIUS = 1.14;
const RING_FILL = 0.82; // share of each ring slot a card takes up
const DRUM_RADIUS = 2.22;
const DRUM_STEP = 40; // degrees between neighbours on the drum
const BOW = 1.82; // how far off-centre drum cards curve to the left
const PERSPECTIVE = 2.7;
const DRUM_VISIBLE = 1.6; // drum neighbours further out than this are hidden
const TITLE = 0.124;

const WHEEL_PX = 900; // scroll distance per card
const DRAG_PX = 420; // drag distance per card
const DRAG_SLOP = 6; // below this a press is a click, not a drag
const SNAP_MS = 140;
const EASE = 0.12; // per 60fps frame

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rad = (deg: number) => (deg * Math.PI) / 180;

function measure(w: number, h: number, count: number, inset: number) {
  const narrow = w < 640;
  const cardW = Math.min(h * CARD_HEIGHT * CARD_ASPECT, w * (narrow ? CARD_WIDTH_NARROW : CARD_WIDTH));
  const cardH = cardW / CARD_ASPECT;
  // Ring card width per unit of radius, and how far its far corner reaches.
  const slot = count ? ((2 * Math.PI) / count) * RING_FILL : 1;
  const reach = 1 + slot * 0.61;
  const ringR = Math.max(0, Math.min(cardH * RING_RADIUS, (w / 2 - 24) / reach, (h / 2 - inset) / reach));
  return {
    narrow,
    cardW,
    cardH,
    ringR,
    ringScale: clamp((slot * ringR) / cardW, 0.16, 1),
    drumR: cardH * DRUM_RADIUS,
    // Phones have no spare width for the full curve.
    bow: cardH * BOW * (narrow ? 0.5 : 1),
    depth: cardH * PERSPECTIVE,
    title: Math.max(24, cardH * TITLE),
    // Room for the detail panel between the left gutter and the drum card.
    detailWidth: w / 2 - cardW / 2 - w * 0.08 - 32,
  };
}

type Geometry = ReturnType<typeof measure>;

// Blends from a ring slot (morph 0) to a drum slot (morph 1).
function place(ringAngle: number, drumAngle: number, g: Geometry, morph: number) {
  const bow = -g.bow * (1 - Math.cos(rad(drumAngle)));
  return (
    `translateX(${morph * bow}px) rotateZ(${(1 - morph) * ringAngle}deg) ` +
    `translateY(${-(1 - morph) * g.ringR}px) rotateX(${morph * drumAngle}deg) ` +
    `translateZ(${morph * g.drumR}px)`
  );
}

function useReducedMotion() {
  return React.useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

type WorksWheelProps<T extends WorksWheelItem> = {
  items: T[];
  /** Centre title of the ring overview. */
  label: string;
  caption?: React.ReactNode;
  /** Shown beside the focused drum card. */
  renderDetail?: (item: T, index: number) => React.ReactNode;
  /** Space kept clear above and below the ring, e.g. for a header. */
  inset?: number;
  className?: string;
};

export function WorksWheel<T extends WorksWheelItem>({
  items,
  label,
  caption,
  renderDetail,
  inset = 24,
  className,
}: WorksWheelProps<T>) {
  const count = items.length;
  const lastIndex = Math.max(count - 1, 0);
  const reduced = useReducedMotion();
  const instructionsId = React.useId();

  const stageRef = React.useRef<HTMLDivElement>(null);
  const drumRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const detailRef = React.useRef<HTMLDivElement>(null);
  const scrimRef = React.useRef<HTMLDivElement>(null);

  const target = React.useRef(0);
  const position = React.useRef(0);
  const frame = React.useRef(0);
  const kick = React.useRef(() => {});
  const drag = React.useRef<{ start: number; last: number; moved: boolean } | null>(null);
  const swallowClick = React.useRef(false);

  const [size, setSize] = React.useState({ w: 0, h: 0 });
  const [active, setActive] = React.useState(0);
  const [focused, setFocused] = React.useState(false);

  const geo = React.useMemo(
    () => (size.h ? measure(size.w, size.h, count, inset) : null),
    [size.w, size.h, count, inset],
  );

  const go = React.useCallback(
    (next: number) => {
      target.current = clamp(next, 0, count);
      setFocused(target.current >= 0.5);
      kick.current();
    },
    [count],
  );
  const step = (delta: number) => go(Math.round(target.current) + delta);

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const read = () => setSize({ w: stage.clientWidth, h: stage.clientHeight });
    read();
    const observer = new ResizeObserver(read);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // Transforms are written straight to the DOM each frame; React only hears
  // about it when the focused card changes.
  React.useEffect(() => {
    if (!geo) return;
    let last = performance.now();

    const draw = (s: number) => {
      const morph = clamp(s, 0, 1);
      const offset = Math.max(0, s - 1);
      drumRef.current!.style.transform = `translateZ(${-morph * geo.drumR}px)`;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const rel = i - offset;
        card.style.transform = place(rel * (360 / count), rel * DRUM_STEP, geo, morph);
        card.style.opacity = morph > 0.5 && Math.abs(rel) > DRUM_VISIBLE ? "0" : "1";
        card.style.zIndex = String(Math.round(100 - Math.abs(rel) * 2));
        (card.firstElementChild as HTMLElement).style.transform =
          `scale(${lerp(geo.ringScale, 1, morph)})`;
      });
      labelRef.current!.style.opacity = String(1 - morph);
      detailRef.current!.style.opacity = String(morph);
      scrimRef.current!.style.opacity = String(morph);
      const index = clamp(Math.round(offset), 0, lastIndex);
      setActive((prev) => (prev === index ? prev : index));
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const diff = target.current - position.current;
      if (reduced || Math.abs(diff) < 5e-4) position.current = target.current;
      else position.current += diff * (1 - Math.pow(1 - EASE, dt * 60));
      draw(position.current);
      frame.current =
        position.current === target.current ? 0 : requestAnimationFrame(tick);
    };

    kick.current = () => {
      if (frame.current) return;
      last = performance.now();
      frame.current = requestAnimationFrame(tick);
    };

    draw(position.current);
    if (position.current !== target.current) kick.current();
    return () => {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, [geo, reduced, count, lastIndex]);

  // React's onWheel is passive, so it can't stop the page from scrolling.
  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let snap = 0;
    const onWheel = (event: WheelEvent) => {
      const unit =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientHeight : 1;
      const next = target.current + (event.deltaY * unit) / WHEEL_PX;
      if (next > 0 && next < count) event.preventDefault();
      go(next);
      window.clearTimeout(snap);
      snap = window.setTimeout(() => go(Math.round(target.current)), SNAP_MS);
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      stage.removeEventListener("wheel", onWheel);
      window.clearTimeout(snap);
    };
  }, [go, count]);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    drag.current = { start: event.clientY, last: event.clientY, moved: false };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    if (!d.moved) {
      if (Math.abs(event.clientY - d.start) < DRAG_SLOP) return;
      d.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    go(target.current + (d.last - event.clientY) / DRAG_PX);
    d.last = event.clientY;
  }

  function onPointerUp() {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    go(Math.round(target.current));
    // A drag that ends over a card must not also count as a click on it.
    swallowClick.current = true;
    window.setTimeout(() => (swallowClick.current = false));
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
      case "PageDown":
        step(1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
      case "PageUp":
        step(-1);
        break;
      case "Home":
        go(1);
        break;
      case "End":
        go(count);
        break;
      case "Escape":
        go(0);
        break;
      case "Enter":
      case " ":
        if (focused) return;
        go(1);
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  const current = items[active];
  const counter = `${String(active + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;

  return (
    <section
      aria-label={label}
      className={cn("relative overflow-hidden select-none", className)}
      style={geo ? ({ "--wheel-title": `${geo.title}px` } as React.CSSProperties) : undefined}
    >
      <div
        ref={stageRef}
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label={label}
        aria-describedby={instructionsId}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(event) => {
          if (!swallowClick.current) return;
          event.preventDefault();
          event.stopPropagation();
        }}
        onKeyDown={onKeyDown}
        className={cn(
          "absolute inset-0 cursor-grab touch-pan-x touch-pinch-zoom outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-foreground active:cursor-grabbing",
          "transition-opacity duration-700 motion-reduce:transition-none",
          geo ? "opacity-100" : "opacity-0",
        )}
        style={geo ? { perspective: `${geo.depth}px` } : undefined}
      >
        {/* The index and live status below say the same thing to assistive tech. */}
        <div
          ref={drumRef}
          aria-hidden
          className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
        >
          {items.map((item, i) => (
            // Not buttons: a click should leave focus on the stage so the
            // arrow keys keep working.
            <div
              key={item.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onClick={() => go(i + 1)}
              className="group absolute cursor-pointer [backface-visibility:hidden] will-change-transform"
              style={
                geo
                  ? {
                      width: geo.cardW,
                      height: geo.cardH,
                      marginLeft: -geo.cardW / 2,
                      marginTop: -geo.cardH / 2,
                    }
                  : undefined
              }
            >
              <span className="relative block size-full overflow-hidden rounded-lg bg-muted shadow-[0_18px_40px_-18px_rgb(255_255_255/0.14)]">
                {/* Plain <img>: the cards are 3D-transformed and the URL already carries the crop size. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt=""
                  draggable={false}
                  decoding="async"
                  className="size-full object-cover transition-[filter] duration-300 group-hover:brightness-110"
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Ring overview title. */}
      <div
        ref={labelRef}
        className="pointer-events-none absolute inset-0 grid place-items-center text-center"
      >
        <div>
          <p className="text-[length:var(--wheel-title)] leading-none tracking-tight">{label}</p>
          {caption ? <p className="mt-3 text-sm text-muted-foreground">{caption}</p> : null}
        </div>
      </div>

      {/* Phones stack the detail under the card, so it needs a backdrop. */}
      <div
        ref={scrimRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-background from-35% via-background/90 to-transparent opacity-0 lg:hidden"
      />

      <div
        ref={detailRef}
        inert={!focused}
        className="pointer-events-none absolute inset-x-6 bottom-28 opacity-0 lg:inset-x-auto lg:bottom-auto lg:left-[8%] lg:top-1/2 lg:max-w-(--detail-max) lg:-translate-y-1/2"
        style={
          geo ? ({ "--detail-max": `${Math.max(geo.detailWidth, 240)}px` } as React.CSSProperties) : undefined
        }
      >
        {current && renderDetail ? renderDetail(current, active) : null}
      </div>

      <nav
        aria-label={`${label} index`}
        className="absolute right-6 hidden text-right md:block lg:right-10"
        style={{ top: inset }}
      >
        <ol className="text-sm leading-[1.9]">
          {items.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => go(i + 1)}
                aria-current={focused && i === active ? "true" : undefined}
                className={cn(
                  "cursor-pointer rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
                  focused && i === active && "font-medium text-foreground",
                )}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {/* Buttons for everything scroll and drag do (WCAG 2.5.7). */}
      <div className="absolute inset-x-0 bottom-6 flex justify-center px-6">
        <div className="flex items-center gap-1 rounded-full border border-border bg-card/80 p-1.5 backdrop-blur-md">
          {focused ? (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous work"
                className="grid size-11 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-foreground"
              >
                <ChevronUp className="size-5" aria-hidden />
              </button>
              <span className="min-w-16 text-center font-mono text-xs tabular-nums text-muted-foreground">
                {counter}
              </span>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={active === lastIndex}
                aria-label="Next work"
                className="grid size-11 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronDown className="size-5" aria-hidden />
              </button>
              <span aria-hidden className="mx-1 h-6 w-px bg-border" />
              <button
                type="button"
                onClick={() => go(0)}
                className="flex h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-sm transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-foreground"
              >
                <Orbit className="size-4" aria-hidden />
                Overview
                <kbd className="hidden rounded border border-border px-1.5 font-mono text-[11px] text-muted-foreground sm:inline">
                  Esc
                </kbd>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => go(1)}
                className="flex h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                Browse works
                <ChevronDown className="size-4" aria-hidden />
              </button>
              <span className="hidden pr-4 pl-2 text-sm text-muted-foreground sm:inline">
                or scroll
              </span>
            </>
          )}
        </div>
      </div>

      <p id={instructionsId} className="sr-only">
        Arrow keys move between works, Escape returns to the overview.
      </p>
      <p aria-live="polite" aria-atomic className="sr-only">
        {focused && current ? `${current.title}, ${active + 1} of ${count}` : `Overview, ${count} works`}
      </p>
    </section>
  );
}
