import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ hostname: "drive.google.com" }],
  },
};

export default nextConfig;
