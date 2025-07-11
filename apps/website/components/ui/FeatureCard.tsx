"use client";
import { Box, Heading, Text, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiPhoneCall } from "react-icons/fi";

const MotionBox = motion(Box);

export const FeatureCard = () => (
  <MotionBox
    bg="white"
    borderRadius="xl"
    boxShadow="lg"
    p={6}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, scale: 1.02 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    <Icon as={FiPhoneCall} boxSize={8} color="brand.400" mb={4} />
    <Heading size="md" mb={2}>
      Never Miss a Call
    </Heading>
    <Text color="gray.600">
      We forward calls to your mobile and even summarize voicemails. You’re
      always in control.
    </Text>
  </MotionBox>
);
