"use client";

import SculptureHero, { type SculptureHeroProps } from "@/components/ui/liquid-sculpture-hero";
import { signalParticlesReady } from "@/lib/particles";

// The work page is a server component and can't pass a function prop.
export function WorkSculpture(props: Omit<SculptureHeroProps, "onReady">) {
  return <SculptureHero {...props} onReady={signalParticlesReady} />;
}
