import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";
import { STREAM_IMAGES } from "@/lib/stream-images";

/**
 * Split auth layout: the form on the left, the image corridor on the right
 * (pinned to the viewport on large screens). On small screens the corridor
 * becomes a short banner above the form.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid flex-1 bg-background text-foreground lg:min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col gap-10 px-4 py-4 sm:px-10 sm:py-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="Corridor home"
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Logo />
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-1.5 rounded-lg px-3 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center pb-10">
          <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both motion-reduce:animate-none">
            {children}
          </div>
        </div>
      </div>

      <div className="order-first h-52 p-2 sm:h-64 lg:sticky lg:top-0 lg:order-none lg:h-svh lg:p-3">
        <ImageStreamHero
          images={STREAM_IMAGES}
          speed={24}
          className="h-full rounded-2xl border border-border/60 bg-card"
        >
          <div className="relative z-10 hidden h-full flex-col justify-end bg-gradient-to-t from-background/90 via-background/10 to-transparent p-10 lg:flex">
            <p className="text-sm font-medium text-muted-foreground">Corridor</p>
            <p className="mt-2 max-w-md text-balance text-3xl font-semibold tracking-tight">
              Your work, front and centre.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A hero that leads with the images instead of describing them.
            </p>
          </div>
        </ImageStreamHero>
      </div>
    </main>
  );
}
