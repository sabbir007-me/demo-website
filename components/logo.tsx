import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xl font-semibold text-white",
        className,
      )}
    >
      <span className="flex size-7 items-center justify-center rounded-md bg-white text-black">
        <GalleryVerticalEnd className="size-4" aria-hidden />
      </span>
      Corridor
    </span>
  );
}
