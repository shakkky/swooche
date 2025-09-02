"use client";
import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";

const features = [
  {
    title: "A dedicated business number (no new SIM needed)",
    subtitle:
      "No more switching between personal and business numbers. No more switching between personal and business numbers. No more switching between personal and business numbers. No more switching between personal and business numbers",
    appContent: {
      title: "Business Number",
      subtitle: "Text back automatically",
      icon: "📱",
    },
  },
  {
    title: "Never miss a lead again",
    subtitle:
      "Powerful immediate text-back when you miss a call. Powerful immediate text-back when you miss a call. Powerful immediate text-back when you miss a call",
    appContent: {
      title: "Missed Call",
      subtitle: "Text back automatically",
      icon: "📱",
    },
  },
  {
    title: "Integrates with your existing CRM",
    subtitle:
      "Plug your CRM into incoming calls to know who's calling. Plug your CRM into incoming calls to know who's calling. Plug your CRM into incoming calls to know who's calling",
    appContent: {
      title: "Call Summary",
      subtitle: "AI-generated notes",
      icon: "📝",
    },
  },
  {
    title: "Auto-send brochures, Section 32s, or contracts after the call",
    subtitle:
      "No more forgetting to send documents. No more forgetting to send documents. No more forgetting to send documents. No more forgetting to send documents",
    appContent: {
      title: "Voice Greeting",
      subtitle: "Your brand, your voice",
      icon: "🎤",
    },
  },
];

export default function SnapScrollPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Observe scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex(
              (ref) => ref === entry.target
            );
            if (index !== -1) setCurrentSection(index);
          }
        }
      },
      { root: null, threshold: 0.5 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    console.log(currentSection);
  }, [currentSection]);

  return (
    <Box
      height="100vh"
      overflowY="scroll"
      css={{
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <Flex height="auto" minHeight="100vh" maxWidth="1200px" margin="0 auto">
        {/* Left Column */}
        <Box flex="1">
          <VStack gap={0} align="stretch">
            {features.map((feature, index) => (
              <Box
                key={index}
                ref={(el) => (sectionRefs.current[index] = el)}
                height="100vh"
                px={8}
                py={16}
                color="black"
                scrollSnapAlign="start"
                width="100%"
              >
                <Flex direction="column" justifyContent="center" height="100%">
                  <Text
                    fontSize="5xl"
                    mb={4}
                    letterSpacing="-0.05em"
                    lineHeight="1.1"
                    fontWeight={700}
                  >
                    {feature.title}
                  </Text>
                  <Text fontSize="xl" opacity={0.8} maxWidth="500px">
                    {feature.subtitle}
                  </Text>
                </Flex>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Right Column - Sticky */}
        <Box
          flex="0.5"
          position="sticky"
          top="0"
          height="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {/* iPhone Mockup */}
          <Box
            width="280px"
            height="560px"
            borderRadius="40px"
            border="8px solid #1a1a1a"
            backgroundColor="#000"
            boxShadow="0 20px 40px rgba(0,0,0,0.3)"
            overflow="hidden"
          >
            {/* Screen content */}
            <Box
              width="100%"
              height="100%"
              backgroundColor="#f8f9fa"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <VStack gap={4} textAlign="center">
                <Box
                  width="60px"
                  height="60px"
                  borderRadius="full"
                  backgroundColor="brand.solid"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="2xl"
                  color="white"
                  fontWeight="bold"
                >
                  {features[currentSection]?.appContent.icon}
                </Box>
                <Text fontSize="lg" fontWeight="bold" color="gray.700">
                  {features[currentSection]?.appContent.title}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {features[currentSection]?.appContent.subtitle}
                </Text>
              </VStack>
            </Box>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
