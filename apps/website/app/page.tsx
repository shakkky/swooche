"use client";
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  MdCheckCircle,
  MdArrowForward,
  MdStar,
  MdTrendingUp,
  MdPeople,
  MdDashboard,
  MdSync,
  MdShare,
} from "react-icons/md";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />

      <main>
        {/* Hero Section */}
        <Box
          bg="brand.solid"
          padding={{ base: 8, md: 20 }}
          minHeight="90vh"
          display="flex"
          flexDirection="column"
          alignItems="start"
          justifyContent="center"
          gap={12}
        >
          <VStack maxWidth="1200px" gap={8} alignItems="start">
            <Heading
              as="h1"
              fontSize={{ base: "5xl", md: "5xl" }}
              fontWeight={900}
              letterSpacing="-0.03em"
              lineHeight="1.2"
              color="onBrand.fg"
              width="full"
            >
              Everything Productive does,
              <br />
              <span style={{ color: "#1a1a1a" }}>at half the cost.</span>
            </Heading>

            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              maxWidth="800px"
              color="onBrand.muted"
              lineHeight="1.4"
            >
              Built for small marketing agencies who don&apos;t want ERP pricing
              or bloated software.
            </Text>

            <HStack gap={4} flexWrap="wrap" justifyContent="start">
              <Button
                bg="brand.contrast"
                color="white"
                _hover={{ bg: "onBrand.contrastEmphasized" }}
                size="xl"
                borderRadius="full"
              >
                Create a free account
              </Button>
              <Button
                variant="outline"
                bg="white"
                borderColor="white"
                color="onBrand.solid"
                size="xl"
                borderRadius="full"
              >
                Get a demo
              </Button>
            </HStack>
          </VStack>
        </Box>

        {/* Problem Section */}
        <Box padding={{ base: 16, md: 24 }} bg="white">
          <VStack maxWidth="1200px" margin="0 auto" gap={16}>
            <VStack textAlign="center" gap={6}>
              <Heading
                fontSize={{ base: "4xl", md: "5xl" }}
                fontWeight={800}
                letterSpacing="-0.02em"
                color="base.fg"
                lineHeight="1.1"
              >
                The tools agencies use today don&apos;t work for them.
              </Heading>
            </VStack>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              gap={8}
              width="100%"
            >
              <Box
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={8}
                textAlign="center"
              >
                <Icon as={MdPeople} boxSize={12} color="red.500" mb={4} />
                <Heading size="md" mb={4} color="red.600">
                  ClickUp/Asana hacks
                </Heading>
                <Text color="gray.600">Messy, clients won&apos;t log in.</Text>
              </Box>

              <Box
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={8}
                textAlign="center"
              >
                <Icon as={MdDashboard} boxSize={12} color="red.500" mb={4} />
                <Heading size="md" mb={4} color="red.600">
                  Spreadsheets & Google Drive
                </Heading>
                <Text color="gray.600">Version control nightmares.</Text>
              </Box>

              <Box
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={8}
                textAlign="center"
              >
                <Icon as={MdTrendingUp} boxSize={12} color="red.500" mb={4} />
                <Heading size="md" mb={4} color="red.600">
                  Reporting dashboards
                </Heading>
                <Text color="gray.600">Show KPIs, not deliverables.</Text>
              </Box>

              <Box
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={8}
                textAlign="center"
              >
                <Icon as={MdSync} boxSize={12} color="red.500" mb={4} />
                <Heading size="md" mb={4} color="red.600">
                  Emails & Slack threads
                </Heading>
                <Text color="gray.600">Lost updates, no visibility.</Text>
              </Box>

              <Box
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={8}
                textAlign="center"
              >
                <Icon as={MdPeople} boxSize={12} color="red.500" mb={4} />
                <Heading size="md" mb={4} color="red.600">
                  Scoro/Productive
                </Heading>
                <Text color="gray.600">
                  Too expensive, too much training, teams only use 20% of
                  features.
                </Text>
              </Box>
            </SimpleGrid>
          </VStack>
        </Box>

        {/* Solution Section */}
        <Box padding={{ base: 16, md: 24 }} bg="brand.muted">
          <VStack maxWidth="1200px" margin="0 auto" gap={16}>
            <HStack gap={16} alignItems="center" width="100%">
              <Box flex={1}>
                <VStack alignItems="flex-start" gap={8} textAlign="left">
                  <Heading
                    fontSize={{ base: "4xl", md: "5xl" }}
                    fontWeight={800}
                    letterSpacing="-0.02em"
                    lineHeight="1.1"
                    color="base.fg"
                  >
                    A lean, focused tool just for agencies.
                  </Heading>

                  <VStack alignItems="flex-start" gap={6}>
                    <HStack gap={4}>
                      <Icon as={MdCheckCircle} boxSize={6} color="green.500" />
                      <Text fontSize="xl" color="base.fg">
                        Track deliverables across all clients in one view.
                      </Text>
                    </HStack>
                    <HStack gap={4}>
                      <Icon as={MdCheckCircle} boxSize={6} color="green.500" />
                      <Text fontSize="xl" color="base.fg">
                        Give clients a simple, branded dashboard — no login
                        required.
                      </Text>
                    </HStack>
                    <HStack gap={4}>
                      <Icon as={MdCheckCircle} boxSize={6} color="green.500" />
                      <Text fontSize="xl" color="base.fg">
                        Sync with the tools your team already uses (ClickUp,
                        Asana, Slack, Google Drive).
                      </Text>
                    </HStack>
                    <HStack gap={4}>
                      <Icon as={MdCheckCircle} boxSize={6} color="green.500" />
                      <Text fontSize="xl" color="base.fg">
                        Affordable, transparent pricing.
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>

              <Box flex={1} bg="white" borderRadius="xl" p={8} boxShadow="xl">
                <VStack gap={4} alignItems="stretch">
                  <Box bg="gray.100" p={4} borderRadius="lg">
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                      Client Dashboard
                    </Text>
                  </Box>
                  <VStack gap={3} alignItems="stretch">
                    <Box
                      bg="green.100"
                      p={3}
                      borderRadius="md"
                      borderLeft="4px solid"
                      borderColor="green.500"
                    >
                      <Text fontSize="sm" fontWeight="medium" color="green.800">
                        ✅ Website Redesign - Done
                      </Text>
                    </Box>
                    <Box
                      bg="yellow.100"
                      p={3}
                      borderRadius="md"
                      borderLeft="4px solid"
                      borderColor="yellow.500"
                    >
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="yellow.800"
                      >
                        ⏳ Social Media Campaign - Pending
                      </Text>
                    </Box>
                    <Box
                      bg="blue.100"
                      p={3}
                      borderRadius="md"
                      borderLeft="4px solid"
                      borderColor="blue.500"
                    >
                      <Text fontSize="sm" fontWeight="medium" color="blue.800">
                        📋 Content Calendar - In Progress
                      </Text>
                    </Box>
                  </VStack>
                </VStack>
              </Box>
            </HStack>
          </VStack>
        </Box>

        {/* How It Works Section */}
        <Box padding={{ base: 16, md: 24 }} bg="white">
          <VStack maxWidth="1200px" margin="0 auto" gap={16}>
            <VStack textAlign="center" gap={6}>
              <Heading
                fontSize={{ base: "4xl", md: "5xl" }}
                fontWeight={800}
                letterSpacing="-0.02em"
                color="base.fg"
                lineHeight="1.1"
              >
                From promised → to delivered → to reported.
              </Heading>
            </VStack>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4 }}
              gap={8}
              width="100%"
            >
              <VStack gap={6} textAlign="center">
                <Box
                  bg="brand.solid"
                  borderRadius="full"
                  p={6}
                  boxSize="80px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={MdSync} boxSize={10} color="onBrand.fg" />
                </Box>
                <VStack gap={3}>
                  <Heading size="md" color="base.fg">
                    Connect your project tool
                  </Heading>
                  <Text color="gray.600">
                    Link ClickUp, Asana, or any tool your team uses.
                  </Text>
                </VStack>
              </VStack>

              <VStack gap={6} textAlign="center">
                <Box
                  bg="brand.solid"
                  borderRadius="full"
                  p={6}
                  boxSize="80px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={MdDashboard} boxSize={10} color="onBrand.fg" />
                </Box>
                <VStack gap={3}>
                  <Heading size="md" color="base.fg">
                    Choose deliverables to track
                  </Heading>
                  <Text color="gray.600">
                    Select which projects to show clients.
                  </Text>
                </VStack>
              </VStack>

              <VStack gap={6} textAlign="center">
                <Box
                  bg="brand.solid"
                  borderRadius="full"
                  p={6}
                  boxSize="80px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={MdShare} boxSize={10} color="onBrand.fg" />
                </Box>
                <VStack gap={3}>
                  <Heading size="md" color="base.fg">
                    Share the client portal link
                  </Heading>
                  <Text color="gray.600">
                    Send clients a branded dashboard URL.
                  </Text>
                </VStack>
              </VStack>

              <VStack gap={6} textAlign="center">
                <Box
                  bg="brand.solid"
                  borderRadius="full"
                  p={6}
                  boxSize="80px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={MdTrendingUp} boxSize={10} color="onBrand.fg" />
                </Box>
                <VStack gap={3}>
                  <Heading size="md" color="base.fg">
                    Automate weekly updates
                  </Heading>
                  <Text color="gray.600">
                    Clients get progress reports automatically.
                  </Text>
                </VStack>
              </VStack>
            </SimpleGrid>

            <Button
              bg="brand.contrast"
              color="white"
              _hover={{ bg: "onBrand.contrastEmphasized" }}
              size="lg"
              borderRadius="full"
            >
              Try it now <MdArrowForward />
            </Button>
          </VStack>
        </Box>

        {/* Pricing Section */}
        <Box padding={{ base: 16, md: 24 }} bg="brand.muted">
          <VStack maxWidth="1200px" margin="0 auto" gap={16}>
            <VStack textAlign="center" gap={6}>
              <Heading
                fontSize={{ base: "4xl", md: "5xl" }}
                fontWeight={800}
                letterSpacing="-0.02em"
                color="base.fg"
              >
                Pricing that grows with your agency.
              </Heading>
              <Text fontSize="xl" color="gray.600" maxWidth="600px">
                Per-client portal pricing. No per-user fees. Scale as you grow.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} width="100%">
              {/* Starter Plan */}
              <Box
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                boxShadow="lg"
                borderRadius="xl"
                p={8}
                textAlign="center"
                position="relative"
              >
                <Heading size="lg" color="base.fg" mb={4}>
                  Starter
                </Heading>
                <Text fontSize="4xl" fontWeight="bold" color="brand.600" mb={2}>
                  $49
                  <span style={{ fontSize: "1.5rem", fontWeight: "normal" }}>
                    /mo
                  </span>
                </Text>
                <Text color="gray.600" fontSize="lg" mb={6}>
                  5 portals
                </Text>
                <VStack gap={4} alignItems="flex-start" textAlign="left">
                  <HStack gap={3}>
                    <Icon as={MdCheckCircle} color="green.500" />
                    <Text>5 client portals</Text>
                  </HStack>
                  <HStack gap={3}>
                    <Icon as={MdCheckCircle} color="green.500" />
                    <Text>Basic integrations</Text>
                  </HStack>
                  <HStack gap={3}>
                    <Icon as={MdCheckCircle} color="green.500" />
                    <Text>Client dashboard</Text>
                  </HStack>
                  <HStack gap={3}>
                    <Icon as={MdCheckCircle} color="green.500" />
                    <Text>Email support</Text>
                  </HStack>
                </VStack>
              </Box>

              {/* Growing Plan */}
              <Box
                bg="white"
                border="2px solid"
                borderColor="brand.400"
                boxShadow="xl"
                borderRadius="xl"
                p={8}
                textAlign="center"
                position="relative"
              >
                <Box
                  position="absolute"
                  top={-3}
                  left="50%"
                  transform="translateX(-50%)"
                  bg="brand.400"
                  color="white"
                  px={4}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="bold"
                >
                  Most Popular
                </Box>
                <Heading size="lg" color="base.fg" mb={4}>
                  Growing
                </Heading>
                <Text fontSize="4xl" fontWeight="bold" color="brand.600" mb={2}>
                  $99
                  <span style={{ fontSize: "1.5rem", fontWeight: "normal" }}>
                    /mo
                  </span>
                </Text>
                <Text color="gray.600" fontSize="lg" mb={6}>
                  20 portals + white-label + automations
                </Text>
                <VStack gap={4} alignItems="flex-start" textAlign="left">
                  <HStack gap={3}>
                    <Icon as={MdCheckCircle} color="green.500" />
                    <Text>20 client portals</Text>
                  </HStack>
                  <HStack gap={3}>
                    <Icon as={MdCheckCircle} color="green.500" />
                    <Text>White-label branding</Text>
                  </HStack>
                  <HStack gap={3}>
                    <Icon as={MdCheckCircle} color="green.500" />
                    <Text>Automated reporting</Text>
                  </HStack>
                  <HStack gap={3}>
                    <Icon as={MdCheckCircle} color="green.500" />
                    <Text>Advanced integrations</Text>
                  </HStack>
                  <HStack gap={3}>
                    <Icon as={MdCheckCircle} color="green.500" />
                    <Text>Priority support</Text>
                  </HStack>
                </VStack>
              </Box>

              {/* Scaling Plan */}
              <Box
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                boxShadow="lg"
                borderRadius="xl"
                p={8}
                textAlign="center"
                position="relative"
              >
                <Heading size="lg" color="base.fg" mb={4}>
                  Scaling
                </Heading>
                <Text fontSize="4xl" fontWeight="bold" color="brand.600" mb={2}>
                  $199
                  <span style={{ fontSize: "1.5rem", fontWeight: "normal" }}>
                    /mo
                  </span>
                </Text>
                <Text color="gray.600" fontSize="lg" mb={6}>
                  Unlimited portals + custom domain + advanced reporting
                </Text>
                <VStack gap={4} alignItems="flex-start" textAlign="left">
                  <HStack gap={3}>
                    <Icon as={MdCheckCircle} color="green.500" />
                    <Text>Unlimited client portals</Text>
                  </HStack>
                  <HStack gap={3}>
                    <Icon as={MdCheckCircle} color="green.500" />
                    <Text>Custom domain</Text>
                  </HStack>
                  <HStack gap={3}>
                    <Icon as={MdCheckCircle} color="green.500" />
                    <Text>Advanced reporting</Text>
                  </HStack>
                  <HStack gap={3}>
                    <Icon as={MdCheckCircle} color="green.500" />
                    <Text>API access</Text>
                  </HStack>
                  <HStack gap={3}>
                    <Icon as={MdCheckCircle} color="green.500" />
                    <Text>Dedicated support</Text>
                  </HStack>
                </VStack>
              </Box>
            </SimpleGrid>
          </VStack>
        </Box>

        {/* Testimonials Section */}
        <Box padding={{ base: 16, md: 24 }} bg="white">
          <VStack maxWidth="1200px" margin="0 auto" gap={16}>
            <VStack textAlign="center" gap={6}>
              <Heading
                fontSize={{ base: "4xl", md: "5xl" }}
                fontWeight={800}
                letterSpacing="-0.02em"
                color="base.fg"
              >
                What agencies are saying
              </Heading>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} width="100%">
              <Box
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={8}
              >
                <HStack mb={4}>
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} as={MdStar} color="yellow.400" />
                  ))}
                </HStack>
                <Text fontSize="lg" color="base.fg" mb={4} fontStyle="italic">
                  &ldquo;Finally a tool my clients actually use.&rdquo;
                </Text>
                <Text fontSize="sm" color="gray.600">
                  — Sarah Chen, Creative Director at Pixel & Co
                </Text>
              </Box>

              <Box
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={8}
              >
                <HStack mb={4}>
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} as={MdStar} color="yellow.400" />
                  ))}
                </HStack>
                <Text fontSize="lg" color="base.fg" mb={4} fontStyle="italic">
                  &ldquo;We cut reporting time in half.&rdquo;
                </Text>
                <Text fontSize="sm" color="gray.600">
                  — Mike Rodriguez, Founder at GrowthLab
                </Text>
              </Box>
            </SimpleGrid>

            <VStack gap={6} textAlign="center">
              <Heading size="lg" color="base.fg">
                Ready to streamline your agency?
              </Heading>
              <Button
                bg="brand.contrast"
                color="white"
                _hover={{ bg: "onBrand.contrastEmphasized" }}
                size="lg"
                borderRadius="full"
              >
                Get Started Free <MdArrowForward />
              </Button>
              <Text fontSize="sm" color="gray.500">
                No credit card required • 14-day free trial
              </Text>
            </VStack>
          </VStack>
        </Box>
      </main>
    </div>
  );
}
