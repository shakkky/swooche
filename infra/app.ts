import { getDomainName } from "./deployment";

export const app = new sst.aws.StaticSite("AppService", {
  path: "./apps/app",
  build: {
    command: "pnpm build",
    output: "dist",
  },
  domain: getDomainName($app.stage, "app"),
  environment: {
    VITE_WEBSITE_URL: `https://${getDomainName($app.stage, "website")}`,
    VITE_API_URL: `https://${getDomainName($app.stage, "api")}`,
    VITE_APP_URL: `https://${getDomainName($app.stage, "app")}`,
    VITE_CLICKUP_CLIENT_ID: process.env.CLICKUP_CLIENT_ID,
  },
  dev: {
    command: "pnpm dev",
    url: "http://localhost:3001",
  },
});
