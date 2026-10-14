"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { WorksWheel } from "@/components/ui/works-wheel";
import { cn } from "@/lib/utils";
import { workHref } from "@/lib/work-pages";
import { WORKS, type Work } from "@/lib/works";

// Fixed locale and zone so the server and client render the same text.
const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const day = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const totalViews = WORKS.reduce((sum, work) => sum + work.views, 0);
const drafts = WORKS.filter((work) => work.status === "Draft").length;

function WorkDetail({ work }: { work: Work }) {
  const published = work.status === "Published";
  const href = workHref(work.id);
  return (
    <article>
      <h2 className="text-[length:var(--wheel-title)] leading-none tracking-tight">
        {work.title}
      </h2>
      <p className="mt-3 text-sm text-muted-foreground">
        {work.medium} · Updated {day.format(new Date(work.updated))}
      </p>
      <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-border pt-4 lg:mt-7 lg:pt-5">
        <div>
          <dt className="text-xs text-muted-foreground">Views</dt>
          <dd className="mt-1 text-lg tabular-nums">{compact.format(work.views)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Saves</dt>
          <dd className="mt-1 text-lg tabular-nums">{compact.format(work.saves)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Status</dt>
          <dd className="mt-1 flex items-center gap-1.5 text-lg">
            <span
              aria-hidden
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                published ? "bg-emerald-500 dark:bg-emerald-400" : "bg-amber-500 dark:bg-amber-400",
              )}
            />
            {work.status}
          </dd>
        </div>
      </dl>
      {href ? (
        // The panel lets drags through to the wheel; the link opts back in.
        <Link
          href={href}
          className={buttonVariants({ className: "pointer-events-auto mt-6 h-11 gap-2 px-5 lg:mt-8" })}
        >
          Open landing page
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground lg:mt-8">Landing page coming soon.</p>
      )}
    </article>
  );
}

export function WorksDashboard() {
  return (
    <WorksWheel
      items={WORKS}
      label="Works '26"
      caption={`${WORKS.length} works · ${compact.format(totalViews)} views · ${drafts} drafts`}
      inset={88}
      renderDetail={(work) => <WorkDetail work={work} />}
      hrefFor={(work) => workHref(work.id)}
      className="absolute inset-0"
    />
  );
}
