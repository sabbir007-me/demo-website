import Link from "next/link";
import {
  Accessibility,
  ArrowRight,
  Blocks,
  Box,
  Images,
  LockKeyhole,
  Proportions,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";
import { PrismaHero } from "@/components/ui/prisma-hero";
import { STREAM_IMAGES } from "@/lib/stream-images";
import { cn } from "@/lib/utils";

/* Layout follows the "Hero + Features + CTA" / "Product Demo" landing
 * patterns: a full-screen video hero, then the corridor itself as the
 * product demo. Motion is limited to the hero and the corridor, and both
 * stand still under prefers-reduced-motion. */

const container = "mx-auto w-full max-w-6xl px-4 sm:px-6";

const NAV = [
  { label: "Showcase", href: "#showcase" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Sign in", href: "/login" },
];

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
    <div className="p-2 sm:p-3">
      <PrismaHero
        title="Corridor"
        description="A landing page kit that leads with your images instead of describing them. Drop in your shots and a 3D corridor streams them toward the viewer."
        cta={{ label: "Get started", href: "/signup" }}
        navItems={NAV}
        // The notch is always black, so the switch keeps the hero's cream.
        navActions={
          <ThemeToggle className="-my-2 size-8 text-[#E1E0CC]/80 hover:bg-white/10 hover:text-[#E1E0CC] md:size-9" />
        }
        // "Corridor" is eight letters, so it runs smaller than the default.
        titleClassName="text-[24vw] lg:text-[15vw]"
        // Fills the screen exactly, inside the frame's padding.
        className="h-[calc(100svh-1rem)] sm:h-[calc(100svh-1.5rem)]"
      />
    </div>
  );
}

function Showcase() {
  return (
    <section id="showcase" className="scroll-mt-8 pt-24 sm:pt-32">
      <div className={container}>
        <SectionHeading
          eyebrow="Showcase"
          title="Your work, front and centre."
          body="Drop in your shots and a 3D corridor streams them toward the viewer, on two mirrored rails."
        />
      </div>
      <div className="relative mt-12">
        <ImageStreamHero
          images={STREAM_IMAGES}
          // One card per language, so every language shows on each rail.
          cards={STREAM_IMAGES.length}
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
    <section id="features" className="scroll-mt-8 py-24 sm:py-32">
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
    <section id="how-it-works" className="scroll-mt-8 border-t border-border/60 py-24 sm:py-32">
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
                "radial-gradient(60% 80% at 50% 100%, var(--glow), transparent 70%)",
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
      <main className="flex-1 bg-background text-foreground">
        <Hero />
        <Showcase />
        <Features />
        <HowItWorks />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
