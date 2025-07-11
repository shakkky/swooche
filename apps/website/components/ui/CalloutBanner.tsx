"use client";
import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export const CalloutBanner = () => (
  <MotionBox
    bgGradient="linear(to-r, brand.400, purple.500)"
    borderRadius="2xl"
    p={5}
    color="white"
    textAlign="center"
    fontWeight="semibold"
    fontSize="lg"
    boxShadow="lg"
    initial={{ y: -40, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    🎉 Launching soon! Get early access and secure your Swooche number today.
  </MotionBox>
);
