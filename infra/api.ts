import { getDomainName, getEcrServiceImageUrl } from "./deployment";
import { vpc } from "./vpc";
import { config } from "./config";

export const cluster = new sst.aws.Cluster("ApiCluster", { vpc });

export const api = new sst.aws.Service("ApiService", {
  path: "./apps/api",
  dockerfile: "./apps/api/Dockerfile",
  cluster,
  architecture: "arm64",
  loadBalancer: {
    domain: getDomainName($app.stage, "api"),
    ports: [
      { listen: "80/http", forward: "3001/http" },
      { listen: "443/https", forward: "3001/http" },
    ],
  },
  containers: [
    {
      image: getEcrServiceImageUrl("api"),
      logging: {
        retention: "3 weeks",
      },
      name: `api-${$app.stage}`,
      ports: [{ container: "3001/http" }],
      environment: {
        ...config,
        NODE_ENV: "production",
      },
    },
  ],
  dev: {
    command: "pnpm dev",
    url: "http://localhost:3001",
  },
  wait: true,
  // Add idempotency configuration to prevent creation conflicts
  forceNewDeployment: true,
});
