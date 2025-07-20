import { replaceTscAliasPaths } from "tsc-alias";
export default {
  esbuild: {
    logLevel: "error",
    minify: false,
    target: "esnext",
    format: "esm",
    platform: "node",
  },
  tsConfigFilePath: "./tsconfig.json",
  module: "ESNext",
  target: "es2022",
  postbuild: async () => {
    await replaceTscAliasPaths({
      tsConfigPath: "./tsconfig.json",
      watch: false,
    });
  },
};
