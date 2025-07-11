import { CalloutBanner } from "@/components/ui/CalloutBanner";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

export default function Home() {
  return (
    <div>
      <main>
        <Box
          bg="brand.solid"
          padding={{ base: 8, md: 16 }}
          minHeight="100vh"
          minWidth="100vw"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          gap={8}
          maxWidth="1400px"
        >
          <Heading
            as="h1"
            color="onBrand.fg"
            fontSize={{ base: "6xl", md: "7xl" }}
            fontFamily="modak"
            fontWeight="normal"
            letterSpacing="-0.02em"
            rotate={{ base: "-2deg", md: "-2deg" }}
            marginTop={{ base: 16, md: 0 }}
          >
            Swooche
          </Heading>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={8}
            color="brand.fg"
          >
            <Text
              fontSize={{ base: "5xl", md: "6xl" }}
              fontWeight={900}
              letterSpacing="-0.05em"
            >
              The power of a whole{" "}
              <span style={{ position: "relative" }}>
                team
                <Image
                  src="/handrawn-arrow.svg"
                  alt="handrawn arrow"
                  width="80px"
                  height="80px"
                  position="absolute"
                  top={{ base: "20px", sm: "10px", md: "60px" }}
                  transform="rotateX(180deg) rotate(-170deg)"
                  zIndex={0}
                  right={{ base: -5, sm: -10, md: 5 }}
                  // display={{ base: "none", md: "block" }}
                />
              </span>
              <br />
              Even if it&apos;s just you.
            </Text>

            <VStack maxWidth="1000px" gap={8}>
              <Text fontSize="2xl" fontWeight={700}>
                A professional business number that links on your own mobile
                phone
              </Text>
              <Text fontWeight={400}>
                💬 Never miss another lead again with powerful immediate
                text-back when you miss a call.
                <br />
                🤙 Never forget what you spoke about with AI-powered call
                summaries.
                <br />
                💁‍♀️ Personalise your brand greetings with your own voice.
                <br />
                🗓️ Get ahead with configurable call forwarding, and smart
                calendar booking suggestions.
              </Text>
              <Flex direction={{ base: "column", md: "row" }} gap={4}>
                <Button
                  colorPalette="onBrand"
                  variant="solid"
                  size="2xl"
                  fontWeight={900}
                  borderRadius="full"
                  color="brand.solid"
                >
                  Reserve your number now
                </Button>
                <Button
                  colorPalette="onBrand"
                  variant="outline"
                  fontWeight={900}
                  size="2xl"
                  borderRadius="full"
                  color="brand.fg"
                  borderColor="brand.fg"
                  borderWidth={2}
                >
                  See what Swooche can do
                </Button>
              </Flex>
            </VStack>

            <Text color="brand.fg">
              Get ready to operate your business like the big guys and{" "}
              <b>swooche</b> your customers off their feet.
            </Text>
          </Box>
        </Box>

        <CalloutBanner />
      </main>
    </div>
  );
}
