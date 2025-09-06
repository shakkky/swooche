import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  env: {
    APP_URL: process.env.APP_URL || "http://localhost:3001",
  },
};

export default nextConfig;
