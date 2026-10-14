import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Instrument_Serif } from "next/font/google";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import SculptureHero from "@/components/ui/liquid-sculpture-hero";
import { cn } from "@/lib/utils";
import { WORK_PAGES } from "@/lib/work-pages";
import { WORKS } from "@/lib/works";

// The hero's italic accent face.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const day = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function find(slug: string) {
  const index = WORKS.findIndex((work) => work.id === slug);
  const page = WORK_PAGES[slug];
  return index >= 0 && page ? { work: WORKS[index], index, page } : null;
}

// The slug decides between the page and a real 404, so it is read before
// anything renders rather than behind a <Suspense> placeholder. Pages listed
// in generateStaticParams are prerendered, so navigating to them stays fast.
export const instant = false;

export function generateStaticParams() {
  return Object.keys(WORK_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/works/[slug]">): Promise<Metadata> {
  const found = find((await params).slug);
  return found ? { title: found.work.title, description: found.page.body } : {};
}

export default async function WorkLandingPage({ params }: PageProps<"/works/[slug]">) {
  const found = find((await params).slug);
  if (!found) notFound();
  const { work, index, page } = found;
  // A custom hero is organic artwork; the generated card is a flat rectangle.
  const hero = page.hero;
  const sculpture = hero?.src ?? `/code-art/hero/${work.id}.svg`;
  const subject = hero?.subject ?? "card";
  const position = `${String(index + 1).padStart(2, "0")} / ${String(WORKS.length).padStart(2, "0")}`;

  return (
    <main
      className={cn(instrumentSerif.variable, "flex-1 bg-background text-foreground")}
      style={
        {
          "--work-accent-light": page.accentLight,
          "--work-accent-dark": page.accentDark,
        } as React.CSSProperties
      }
    >
      <div className="[--work-accent:var(--work-accent-light)] dark:[--work-accent:var(--work-accent-dark)]">
        <SculptureHero
          src={sculpture}
          darkSrc={sculpture}
          mobileSrc={sculpture}
          mobileDarkSrc={sculpture}
          imageAlt={hero?.alt ?? `The ${work.title} card: ${work.medium.toLowerCase()} in an editor window`}
          brand="Corridor"
          brandHref="/"
          navLinks={[
            { label: "Home", href: "/" },
            { label: "The code", href: "#code" },
          ]}
          navCta={{ label: "All works", href: "/dashboard" }}
          navActions={<ThemeToggle />}
          themeToggle={false}
          eyebrow={`Works '26 — ${position}`}
          headline={page.headline}
          headlineAccent={page.accent}
          body={page.body}
          primaryCta={{ label: "Read the code", href: "#code" }}
          secondaryCta={{ label: "Back to works", href: "/dashboard" }}
          hint={`Move across the ${subject}`}
          hintTouch={`Touch the ${subject}`}
          // Site tokens, so the hero follows the light/dark switch with no flash.
          background="var(--background)"
          darkBackground="var(--background)"
          textColor="var(--foreground)"
          darkTextColor="var(--foreground)"
          accentColor="var(--work-accent)"
          darkAccentColor="var(--work-accent)"
          headingFont="var(--font-sans), sans-serif"
          bodyFont="var(--font-sans), sans-serif"
          accentFont="var(--font-instrument), serif"
          loadFonts={false}
          backdropText={work.title}
          // Both images are solid all the way through, so they need fewer
          // particles than a filigree sculpture to stay smooth.
          particleDensity={hero ? 0.4 : 0.35}
          // A card has straight edges, where much idle drift reads as a
          // glitch; artwork can shimmer and float freely.
          ambientIntensity={hero ? 0.6 : 0.15}
          float={Boolean(hero)}
          sculptureScale={hero ? (hero.scale ?? 0.9) : 0.8}
          mobileSculptureScale={hero ? (hero.mobileScale ?? 0.62) : 0.52}
        />
      </div>

      <section id="code" className="scroll-mt-8 border-t border-border/60 py-24 sm:py-32">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <figure className="overflow-hidden rounded-2xl border border-border/60 bg-card">
            <figcaption className="flex items-center gap-2 border-b border-border/60 px-4 py-3 font-mono text-xs text-muted-foreground">
              <span className="size-2.5 rounded-full bg-[#FF5F57]" aria-hidden />
              <span className="size-2.5 rounded-full bg-[#FEBC2E]" aria-hidden />
              <span className="size-2.5 rounded-full bg-[#28C840]" aria-hidden />
              <span className="ml-2">{page.file}</span>
            </figcaption>
            <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed text-foreground">
              <code>{page.code}</code>
            </pre>
            <div className="border-t border-border/60 px-5 py-4 font-mono text-sm">
              <span className="text-muted-foreground">Output </span>
              <span className="text-foreground">{page.output}</span>
            </div>
          </figure>

          <div>
            <p className="text-sm font-medium text-muted-foreground">{work.medium}</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              How the snippet works
            </h2>
            <ol className="mt-8 flex flex-col gap-6">
              {page.notes.map((note, i) => (
                <li key={note.title} className="flex gap-4">
                  <span
                    aria-hidden
                    className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border/70 font-mono text-sm text-muted-foreground"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-medium">{note.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{note.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
              {[
                ["Views", compact.format(work.views)],
                ["Saves", compact.format(work.saves)],
                ["Status", work.status],
                ["Updated", day.format(new Date(work.updated))],
              ].map(([term, value]) => (
                <div key={term}>
                  <dt className="text-xs text-muted-foreground">{term}</dt>
                  <dd className="mt-1 text-lg tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>

            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "outline", className: "mt-10 h-12 gap-2 px-6 text-base" })}
            >
              <ArrowLeft className="size-4" aria-hidden />
              Back to works
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
