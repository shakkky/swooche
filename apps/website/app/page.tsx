"use client";
import Navbar from "@/components/Navbar";
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
import Link from "next/link";
import {
  MdArrowForward,
  MdCheckCircle,
  MdDashboard,
  MdPeople,
  MdShare,
  MdStar,
  MdSync,
  MdTrendingUp,
} from "react-icons/md";

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
              Professional client portals
              <br />
              <span style={{ color: "#1a1a1a" }}>without ERP complexity.</span>
            </Heading>

            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              maxWidth="800px"
              color="onBrand.muted"
              lineHeight="1.4"
            >
              Stop client status calls forever. White-label portals that make
              you look professional while saving hours every week.
            </Text>

            <HStack gap={4} flexWrap="wrap" justifyContent="start">
              <Link href={`${process.env.APP_URL}/signin`}>
                <Button
                  bg="brand.contrast"
                  color="white"
                  _hover={{ bg: "onBrand.contrastEmphasized" }}
                  size="xl"
                  borderRadius="full"
                >
                  Create a free account
                </Button>
              </Link>
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

        {/* Client Portal Mockup Section */}
        <Box padding={{ base: 16, md: 24 }} bg="white">
          <VStack maxWidth="1200px" margin="0 auto" gap={12}>
            <VStack textAlign="center" gap={6}>
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight={800}
                letterSpacing="-0.02em"
                color="base.fg"
                lineHeight="1.1"
              >
                This is what your clients see
              </Heading>
              <Text fontSize="lg" color="gray.600" maxWidth="600px">
                A professional, branded portal that updates automatically. No
                more status calls.
              </Text>
            </VStack>

            {/* Client Portal Mockup */}
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="2xl"
              boxShadow="2xl"
              overflow="hidden"
              maxWidth="1000px"
              width="100%"
            >
              {/* Portal Header */}
              <Box
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                p={6}
                color="white"
              >
                <HStack justifyContent="space-between" alignItems="center">
                  <HStack gap={3}>
                    <Box
                      bg="white"
                      borderRadius="full"
                      p={2}
                      boxSize="40px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="lg" fontWeight="bold" color="gray.700">
                        S
                      </Text>
                    </Box>
                    <VStack alignItems="start" gap={0}>
                      <Text fontSize="lg" fontWeight="bold">
                        ACME Inc. Campaign Portal
                      </Text>
                      <Text fontSize="sm" opacity={0.9}>
                        Q4 Marketing Campaign Dashboard
                      </Text>
                    </VStack>
                  </HStack>
                  <Text fontSize="sm" opacity={0.8}>
                    Last updated: 2 hours ago
                  </Text>
                </HStack>
              </Box>

              {/* Portal Content */}
              <Box p={8}>
                {/* Project Overview */}
                <VStack gap={6} alignItems="stretch">
                  <Box>
                    <Heading size="md" color="base.fg" mb={4}>
                      Q4 Holiday Marketing Campaign
                    </Heading>
                    <Text color="gray.600" mb={4}>
                      Multi-channel campaign to boost holiday sales and brand
                      awareness for ACME Inc.
                    </Text>
                    <Box
                      bg="green.50"
                      border="1px solid"
                      borderColor="green.200"
                      borderRadius="lg"
                      p={4}
                    >
                      <HStack gap={3}>
                        <Box bg="green.500" borderRadius="full" boxSize="3" />
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="green.700"
                        >
                          On Track • 65% Complete
                        </Text>
                      </HStack>
                    </Box>
                  </Box>

                  {/* Deliverables Grid */}
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                    {/* Completed Deliverable */}
                    <Box
                      bg="green.50"
                      border="1px solid"
                      borderColor="green.200"
                      borderRadius="lg"
                      p={4}
                    >
                      <HStack gap={3} mb={3}>
                        <Icon as={MdCheckCircle} color="green.500" />
                        <Text fontWeight="medium" color="green.700">
                          Campaign Strategy & Creative
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="green.600">
                        ✅ Completed 3 days ago
                      </Text>
                      <Text fontSize="sm" color="gray.600" mt={2}>
                        Campaign concept, messaging, and visual assets approved
                        by ACME team
                      </Text>
                    </Box>

                    {/* In Progress Deliverable */}
                    <Box
                      bg="blue.50"
                      border="1px solid"
                      borderColor="blue.200"
                      borderRadius="lg"
                      p={4}
                    >
                      <HStack gap={3} mb={3}>
                        <Icon as={MdSync} color="blue.500" />
                        <Text fontWeight="medium" color="blue.700">
                          Social Media & PPC Launch
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="blue.600">
                        ⏳ In Progress • Due in 2 days
                      </Text>
                      <Text fontSize="sm" color="gray.600" mt={2}>
                        Facebook, Instagram, and Google Ads campaigns are live
                        and optimizing
                      </Text>
                    </Box>

                    {/* Pending Deliverable */}
                    <Box
                      bg="yellow.50"
                      border="1px solid"
                      borderColor="yellow.200"
                      borderRadius="lg"
                      p={4}
                    >
                      <HStack gap={3} mb={3}>
                        <Icon as={MdTrendingUp} color="yellow.500" />
                        <Text fontWeight="medium" color="yellow.700">
                          Email Marketing Series
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="yellow.600">
                        �� Pending • Due in 8 days
                      </Text>
                      <Text fontSize="sm" color="gray.600" mt={2}>
                        Holiday email sequences and automation workflows being
                        built
                      </Text>
                    </Box>

                    {/* Upcoming Deliverable */}
                    <Box
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="lg"
                      p={4}
                    >
                      <HStack gap={3} mb={3}>
                        <Icon as={MdPeople} color="gray.500" />
                        <Text fontWeight="medium" color="gray.700">
                          Campaign Performance & Optimization
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.600">
                        �� Upcoming • Due in 12 days
                      </Text>
                      <Text fontSize="sm" color="gray.600" mt={2}>
                        A/B testing, performance analysis, and campaign
                        optimization
                      </Text>
                    </Box>
                  </SimpleGrid>

                  {/* Recent Activity */}
                  <Box>
                    <Heading size="sm" color="base.fg" mb={4}>
                      Recent Activity
                    </Heading>
                    <VStack gap={3} alignItems="stretch">
                      <HStack gap={3} p={3} bg="gray.50" borderRadius="md">
                        <Box bg="green.500" borderRadius="full" boxSize="2" />
                        <Text fontSize="sm" color="gray.600">
                          <strong>Campaign Strategy & Creative</strong>{" "}
                          completed and approved by ACME team
                        </Text>
                        <Text fontSize="xs" color="gray.500" ml="auto">
                          2 days ago
                        </Text>
                      </HStack>
                      <HStack gap={3} p={3} bg="gray.50" borderRadius="md">
                        <Box bg="blue.500" borderRadius="full" boxSize="2" />
                        <Text fontSize="sm" color="gray.600">
                          <strong>Social Media & PPC</strong> campaigns launched
                          and optimizing
                        </Text>
                        <Text fontSize="xs" color="gray.500" ml="auto">
                          1 day ago
                        </Text>
                      </HStack>
                      <HStack gap={3} p={3} bg="gray.50" borderRadius="md">
                        <Box bg="yellow.500" borderRadius="full" boxSize="2" />
                        <Text fontSize="sm" color="gray.600">
                          <strong>Email Marketing Series</strong> scheduled to
                          begin next week
                        </Text>
                        <Text fontSize="xs" color="gray.500" ml="auto">
                          3 days ago
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>
                </VStack>
              </Box>
            </Box>

            <VStack gap={4} textAlign="center">
              <Text fontSize="lg" color="gray.600">
                This portal updates automatically from your project tools
              </Text>
            </VStack>
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
                Client communication is killing your productivity.
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
                  Client status calls
                </Heading>
                <Text color="gray.600">
                  &quot;What are you working on?&quot; calls waste hours every
                  week.
                </Text>
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
                  Unprofessional client updates
                </Heading>
                <Text color="gray.600">
                  Spreadsheets and emails make you look amateur.
                </Text>
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
                  Manual reporting
                </Heading>
                <Text color="gray.600">
                  Hours spent creating status updates every week.
                </Text>
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
                  Lost client updates
                </Heading>
                <Text color="gray.600">
                  Important updates buried in emails and Slack.
                </Text>
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
                  ERP-level complexity
                </Heading>
                <Text color="gray.600">
                  Scoro/Productive are too bloated and expensive for what you
                  actually need.
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
                    Connect → Tag → Share → Auto-update.
                  </Heading>

                  <VStack alignItems="flex-start" gap={6}>
                    <HStack gap={4}>
                      <Icon as={MdCheckCircle} boxSize={6} color="green.500" />
                      <Text fontSize="xl" color="base.fg">
                        Pull deliverables from your existing tools (ClickUp,
                        Asana, Drive).
                      </Text>
                    </HStack>
                    <HStack gap={4}>
                      <Icon as={MdCheckCircle} boxSize={6} color="green.500" />
                      <Text fontSize="xl" color="base.fg">
                        White-label client portals that look professional and
                        branded.
                      </Text>
                    </HStack>
                    <HStack gap={4}>
                      <Icon as={MdCheckCircle} boxSize={6} color="green.500" />
                      <Text fontSize="xl" color="base.fg">
                        Automated weekly updates sent to clients automatically.
                      </Text>
                    </HStack>
                    <HStack gap={4}>
                      <Icon as={MdCheckCircle} boxSize={6} color="green.500" />
                      <Text fontSize="xl" color="base.fg">
                        Stop client status calls forever.
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
                Four simple steps to professional client communication.
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
                    Tag client-facing deliverables
                  </Heading>
                  <Text color="gray.600">
                    Mark which projects and tasks clients should see.
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
                    Share your white-label portal
                  </Heading>
                  <Text color="gray.600">
                    Send clients a professional, branded dashboard URL.
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
                    Automate client communication
                  </Heading>
                  <Text color="gray.600">
                    Clients get weekly progress reports automatically.
                  </Text>
                </VStack>
              </VStack>
            </SimpleGrid>

            <Link href={`${process.env.APP_URL}/signin`}>
              <Button
                bg="brand.contrast"
                color="white"
                _hover={{ bg: "onBrand.contrastEmphasized" }}
                size="lg"
                borderRadius="full"
              >
                Try it now <MdArrowForward />
              </Button>
            </Link>
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
                  &ldquo;My clients stopped asking for status updates.&rdquo;
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
                  &ldquo;We cut client reporting time in half.&rdquo;
                </Text>
                <Text fontSize="sm" color="gray.600">
                  — Mike Rodriguez, Founder at GrowthLab
                </Text>
              </Box>
            </SimpleGrid>

            <VStack gap={6} textAlign="center">
              <Heading size="lg" color="base.fg">
                Ready to stop client status calls forever?
              </Heading>
              <Link href={`${process.env.APP_URL}/signin`}>
                <Button
                  bg="brand.contrast"
                  color="white"
                  _hover={{ bg: "onBrand.contrastEmphasized" }}
                  size="lg"
                  borderRadius="full"
                >
                  Get Started Free <MdArrowForward />
                </Button>
              </Link>
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
