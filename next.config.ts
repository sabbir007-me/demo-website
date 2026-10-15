import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Lets a phone on the same Wi-Fi load the dev server's scripts.
  allowedDevOrigins: ["192.168.0.249"],
  cacheComponents: true,
  partialPrefetching: true,
  // Tailwind is compiled via postcss.config.mjs. Don't add a turbopack.rules
  // loader for *.css: CSS-to-CSS loaders aren't supported there, and the
  // @tailwindcss/turbopack loader left stale CSS in the persistent dev cache.
};

export default nextConfig;
