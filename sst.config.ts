// <reference path="./.sst/platform.config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "swooche",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      region: "ap-southeast-2",
    };
  },
  async run() {
    const { website } = await import("./infra/website");
    const { api } = await import("./infra/api");
    const { app } = await import("./infra/app");
    return {
      website: website.url.apply((x) => x),
      api: api.url.apply((x) => x),
      app: app.url.apply((x) => x),
    };
  },
});
