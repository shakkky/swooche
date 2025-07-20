import { getDomainName, getEcrServiceImageUrl } from "./deployment";
import { vpc } from "./vpc";

export const cluster = new sst.aws.Cluster("WebsiteCluster", { vpc });

export const website = new sst.aws.Service("WebsiteService", {
  path: "./apps/website",
  dockerfile: "./apps/website/Dockerfile",
  cluster,
  architecture: "arm64",
  loadBalancer: {
    domain: getDomainName($app.stage, "website"),
    ports: [
      { listen: "80/http", forward: "3000/http" },
      { listen: "443/https", forward: "3000/http" },
    ],
  },
  containers: [
    {
      image: getEcrServiceImageUrl("website"),
      logging: {
        retention: "3 weeks",
      },
      name: `website-${$app.stage}`,
      ports: [{ container: "3000/http" }],
    },
  ],
  dev: {
    command: "pnpm dev",
    url: "http://localhost:3000",
  },
  wait: true,
  // Add idempotency configuration to prevent creation conflicts
  forceNewDeployment: true,
});
