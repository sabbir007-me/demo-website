import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Lets a phone on the same Wi-Fi load the dev server's scripts.
  allowedDevOrigins: ["192.168.0.249"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
