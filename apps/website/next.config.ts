import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  experimental: {
    optimizePackageImports: ["@chakra-ui/react", "@swooche/models"],
  },
  env: {
    APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
    MONGODB_URI: process.env.MONGODB_URI,
  },
};

export default nextConfig;
