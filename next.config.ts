import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The desktop scroll engine sets up window listeners once per page load.
  reactStrictMode: false,
};

export default nextConfig;
