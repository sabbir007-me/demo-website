import Link from "next/link";
import { Logo } from "@/components/logo";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";
import { STREAM_IMAGES } from "@/lib/stream-images";

/**
 * Split auth layout: the form on the left, the image corridor on the right.
 * On small screens the corridor becomes a short banner above the form.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-svh bg-black text-white lg:grid-cols-2">
      <div className="flex flex-col gap-8 p-6 md:p-10">
        <Link href="/" aria-label="Corridor home" className="self-start">
          <Logo />
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </div>
      </div>

      <div className="order-first h-48 p-3 sm:h-60 lg:order-none lg:h-auto">
        <ImageStreamHero
          images={STREAM_IMAGES}
          speed={24}
          className="h-full rounded-2xl border border-gray-800/50 bg-gray-950"
        >
          <div className="relative z-10 hidden h-full flex-col justify-end bg-gradient-to-t from-black/90 via-black/10 to-transparent p-10 lg:flex">
            <p className="text-2xl font-medium tracking-tight text-white">
              Your work, front and centre.
            </p>
            <p className="mt-2 max-w-sm text-sm text-gray-400">
              A hero that leads with the images instead of describing them.
            </p>
          </div>
        </ImageStreamHero>
      </div>
    </main>
  );
}
