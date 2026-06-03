import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google
      { protocol: "https", hostname: "avatars.githubusercontent.com" }, // GitHub (for later)
    ],
  },
};

export default nextConfig;
