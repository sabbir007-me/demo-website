import os from "node:os";
import type { NextConfig } from "next";

// This Mac's addresses on the networks it is on right now: the "Network:"
// URL that `next dev` prints. They change from one Wi-Fi to the next, so
// they're read at startup rather than written down.
const lanAddresses = Object.values(os.networkInterfaces())
  .flat()
  .filter((net) => net?.family === "IPv4" && !net.internal)
  .map((net) => net!.address);

const nextConfig: NextConfig = {
  /* config options here */
  // Lets a phone on the same Wi-Fi use the dev server. Next only trusts
  // localhost by default, and from any other host the page never hydrates
  // (its dev connection is refused), so forms and links stop working.
  // The .local name (e.g. Nafizs-MacBook-Air.local) stays the same on every network.
  allowedDevOrigins: [...lanAddresses, os.hostname()],
  cacheComponents: true,
  partialPrefetching: true,
  // Tailwind is compiled via postcss.config.mjs. Don't add a turbopack.rules
  // loader for *.css: CSS-to-CSS loaders aren't supported there, and the
  // @tailwindcss/turbopack loader left stale CSS in the persistent dev cache.
};

export default nextConfig;
