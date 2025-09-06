import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { tokens, semanticTokens } from "./tokens";

const config = defineConfig({
  ...defaultConfig,
  globalCss: {
    ...defaultConfig.globalCss,
    html: {
      margin: 0,
      padding: 0,
    },
    body: {
      bg: "black",
    },
  },
  theme: {
    ...defaultConfig.theme,
    tokens: tokens,
    semanticTokens: semanticTokens,
  },
});

export const system = createSystem(config, defaultConfig);
