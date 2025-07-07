import { getDomainName, getEcrServiceImageUrl } from "./deployment";

export const vpc = new sst.aws.Vpc("Vpc");
export const cluster = new sst.aws.Cluster("WebsiteCluster", { vpc });

export const website = new sst.aws.Service("WebsiteService", {
  path: "./apps/website",
  dockerfile: "./apps/website/Dockerfile",
  cluster,
  architecture: "arm64",
  loadBalancer: {
    domain: getDomainName($app.stage),
    ports: [
      { listen: "80/http", forward: "3000/http" },
      { listen: "443/https", forward: "3000/http" },
    ],
  },
  containers: [
    {
      image: getEcrServiceImageUrl(),
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
});
