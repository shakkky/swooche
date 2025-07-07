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
      50: { value: "{colors.blue.50}" },
      100: { value: "{colors.blue.100}" },
      200: { value: "{colors.blue.200}" },
      300: { value: "{colors.blue.300}" },
      400: { value: "{colors.blue.400}" },
      500: { value: "{colors.blue.500}" },
      600: { value: "{colors.blue.600}" },
      700: { value: "{colors.blue.700}" },
      800: { value: "{colors.blue.800}" },
      900: { value: "{colors.blue.900}" },
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
      solid: { value: "{colors.brand.500}" },
      contrast: { value: "{colors.brand.100}" },
      fg: { value: "{colors.brand.700}" },
      muted: { value: "{colors.brand.100}" },
      subtle: { value: "{colors.brand.200}" },
      emphasized: { value: "{colors.brand.300}" },
    },
    onBrand: {
      solid: { value: "{colors.brand.100}" },
      contrast: { value: "{colors.brand.900}" },
      fg: { value: "{colors.brand.100}" },
      muted: { value: "{colors.brand.900}" },
      subtle: { value: "{colors.brand.800}" },
      emphasized: { value: "{colors.brand.700}" },
    },
  },
});
