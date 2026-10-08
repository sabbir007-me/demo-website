import Link from "next/link";
import {
  Accessibility,
  ArrowRight,
  Blocks,
  Box,
  Images,
  LockKeyhole,
  Proportions,
  Sparkles,
} from "lucide-react";
import { SiteNav } from "@/components/landing/site-nav";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";
import { STREAM_IMAGES } from "@/lib/stream-images";
import { cn } from "@/lib/utils";

/* Layout follows the "Hero + Features + CTA" / "Product Demo" landing
 * patterns: the corridor itself is the product demo. Motion is limited to
 * the hero entrance and the corridor, and both stand still under
 * prefers-reduced-motion. */

const container = "mx-auto w-full max-w-6xl px-4 sm:px-6";

// Staggered entrance for the hero copy only.
const enter =
  "animate-in fade-in slide-in-from-bottom-3 duration-700 ease-out fill-mode-both motion-reduce:animate-none";

const FACTS = [
  { title: "Pure CSS 3D", body: "No WebGL, no animation library" },
  { title: "Any width", body: "Sized in container units" },
  { title: "Calm by default", body: "Freezes under reduced motion" },
];

const FEATURES = [
  {
    icon: Images,
    title: "Images lead",
    body: "Your work streams toward the viewer on two mirrored rails, so the hero shows instead of tells.",
  },
  {
    icon: Box,
    title: "Pure CSS motion",
    body: "One set of generated keyframes drives every card. Nothing to load, nothing running on the main thread.",
  },
  {
    icon: Proportions,
    title: "Fits any width",
    body: "Every length is in container units, so the corridor keeps its shape from a phone to an ultrawide.",
  },
  {
    icon: Accessibility,
    title: "Respects reduced motion",
    body: "With reduced motion on, the corridor pauses as a finished still instead of collapsing.",
  },
  {
    icon: Blocks,
    title: "Built on shadcn/ui",
    body: "Next.js, TypeScript, Tailwind CSS v4 and shadcn/ui — copy the components straight into your project.",
  },
  {
    icon: LockKeyhole,
    title: "Auth screens included",
    body: "Sign-in and sign-up pages share the same look, with inline validation and a show-password toggle.",
  },
];

const STEPS = [
  {
    title: "Bring your images",
    body: "Pass any list of image URLs. If there are fewer images than cards, they simply repeat.",
  },
  {
    title: "Tune the corridor",
    body: "Adjust cards, speed and axis, or override the path geometry. Everything scales with the container.",
  },
  {
    title: "Put your copy on top",
    body: "Anything you pass as children renders above the corridor — headline, buttons, whatever the page needs.",
  },
];

const USAGE = `<ImageStreamHero
  images={images}
  cards={9}
  speed={18}
  className="h-[560px]"
>
  <YourHeadline />
</ImageStreamHero>`;

function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 sm:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px]"
        style={{
          background:
            "radial-gradient(55% 60% at 50% 0%, rgb(255 255 255 / 0.12), transparent 70%)",
        }}
      />

      <div className={cn(container, "flex max-w-3xl flex-col items-center text-center")}>
        <p
          className={cn(
            enter,
            "inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground",
          )}
        >
          <Sparkles className="size-3.5" aria-hidden />
          Image-first landing kit
        </p>

        <h1
          className={cn(
            enter,
            "delay-100 mt-6 text-balance text-5xl font-semibold tracking-tighter sm:text-6xl lg:text-7xl",
          )}
        >
          Your work,{" "}
          <span className="text-muted-foreground">front and centre.</span>
        </h1>

        <p
          className={cn(
            enter,
            "delay-200 mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg",
          )}
        >
          A landing page kit that leads with your images instead of describing
          them. Drop in your shots and a 3D corridor streams them toward the
          viewer.
        </p>

        <div className={cn(enter, "delay-300 mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row")}>
          <Link
            href="/signup"
            className={buttonVariants({ className: "h-12 gap-2 px-6 text-base" })}
          >
            Get started
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <a
            href="#showcase"
            className={buttonVariants({
              variant: "outline",
              className: "h-12 px-6 text-base",
            })}
          >
            See it in motion
          </a>
        </div>
      </div>

      <div id="showcase" className="relative mt-16 scroll-mt-24 sm:mt-20">
        <h2 className="sr-only">Showcase</h2>
        <ImageStreamHero
          images={STREAM_IMAGES}
          className="aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[21/9] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
        />
      </div>

      <ul className={cn(container, "grid gap-px sm:grid-cols-3")}>
        {FACTS.map((fact) => (
          <li
            key={fact.title}
            className="flex flex-col items-center gap-1 border-t border-border/60 px-4 py-6 text-center"
          >
            <span className="text-sm font-medium text-foreground">{fact.title}</span>
            <span className="text-sm text-muted-foreground">{fact.body}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-24 sm:py-32">
      <div className={container}>
        <SectionHeading
          eyebrow="Features"
          title="Everything the hero needs. Nothing it doesn't."
          body="One component does the heavy lifting; the rest of the kit stays out of its way."
        />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="bg-background p-6 sm:p-8">
              <span className="flex size-10 items-center justify-center rounded-lg border border-border/70 bg-card">
                <Icon className="size-5 text-foreground" aria-hidden />
              </span>
              <h3 className="mt-5 font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-t border-border/60 py-24 sm:py-32">
      <div className={cn(container, "grid items-start gap-12 lg:grid-cols-2 lg:gap-16")}>
        <div>
          <SectionHeading
            eyebrow="How it works"
            title="Three steps from a folder of images to a finished hero."
            body="The corridor is a single client component with sensible defaults."
          />
          <ol className="mt-10 flex flex-col gap-6">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border/70 font-mono text-sm text-muted-foreground"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <figure className="overflow-hidden rounded-2xl border border-border/60 bg-card">
          <figcaption className="flex items-center gap-2 border-b border-border/60 px-4 py-3 font-mono text-xs text-muted-foreground">
            <span className="size-2.5 rounded-full bg-border" aria-hidden />
            <span className="size-2.5 rounded-full bg-border" aria-hidden />
            <span className="size-2.5 rounded-full bg-border" aria-hidden />
            <span className="ml-2">hero.tsx</span>
          </figcaption>
          <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed text-foreground">
            <code>{USAGE}</code>
          </pre>
        </figure>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="pb-24 sm:pb-32">
      <div className={container}>
        <div className="relative isolate overflow-hidden rounded-3xl border border-border/60 bg-card px-6 py-16 text-center sm:px-16 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 100%, rgb(255 255 255 / 0.10), transparent 70%)",
            }}
          />
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Put your work front and centre.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Create an account and start from a hero that already looks finished.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className={buttonVariants({ className: "h-12 gap-2 px-6 text-base" })}
            >
              Get started
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline", className: "h-12 px-6 text-base" })}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className={cn(container, "flex flex-col items-center justify-between gap-4 py-8 sm:flex-row")}>
        <Logo className="text-base" />
        <p className="text-sm text-muted-foreground">
          Built with Next.js, Tailwind CSS and shadcn/ui.
        </p>
        <nav aria-label="Account" className="flex gap-1">
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Create account
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export default function Component() {
  return (
    <>
      <SiteNav />
      <main className="flex-1 bg-background text-foreground">
        <Hero />
        <Features />
        <HowItWorks />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
