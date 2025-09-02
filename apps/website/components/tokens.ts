"use client";
import {
  defaultConfig,
  defineSemanticTokens,
  defineTokens,
} from "@chakra-ui/react";

export const tokens = defineTokens({
  ...defaultConfig.theme?.tokens,
  colors: {
    brand: {
      50: { value: "{colors.yellow.50}" },
      100: { value: "{colors.yellow.100}" },
      200: { value: "{colors.yellow.200}" },
      300: { value: "{colors.yellow.300}" },
      400: { value: "{colors.yellow.400}" },
      500: { value: "{colors.yellow.500}" },
      600: { value: "{colors.yellow.600}" },
      700: { value: "{colors.yellow.700}" },
      800: { value: "{colors.yellow.800}" },
      900: { value: "{colors.yellow.900}" },
    },
    base: {
      bg: { value: "{colors.brand.50}" },
      fg: { value: "black" },
    },
  },
  fonts: {
    heading: { value: "var(--font-modak" },
    body: { value: "var(--font-modak)" },
  },
});

export const semanticTokens = defineSemanticTokens({
  ...defaultConfig.theme?.semanticTokens,
  colors: {
    brand: {
      solid: { value: "{colors.brand.200}" },
      contrast: { value: "black" },
      fg: { value: "black" },
      muted: { value: "{colors.brand.100}" },
      subtle: { value: "{colors.brand.200}" },
      emphasized: { value: "{colors.brand.300}" },
    },
    onBrand: {
      solid: { value: "black" },
      contrast: { value: "{colors.brand.900}" },
      fg: { value: "{colors.brand.500}" },
      muted: { value: "{colors.brand.900}" },
      subtle: { value: "{colors.brand.800}" },
      emphasized: { value: "{colors.brand.700}" },
    },
    base: {
      bg: { value: "{colors.brand.50}" },
      fg: { value: "{colors.brand.900}" },
    },
  },
});

// https://thetemplateemporium.com/should-you-use-yellow-as-your-branding-colour/
