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
    return {
      website: website.url.apply((x) => x),
    };
  },
});
