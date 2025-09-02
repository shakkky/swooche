"use client";
import SnapScrollPage from "@/components/ui/SnapScrollPage";
import {
  Box,
  Button,
  Flex,
  Group,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  SimpleGrid,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Md3dRotation } from "react-icons/md";

const usps = [
  // keep your personal number private

  // mark callers as important, while automatically voicemailing others if calling outside of business hours
  {
    title: "Built for real estate agents",
    subtitle:
      "Know Swooche is built for real estate agents on-the-go, with a focus on speed, efficiency, and professionalism.",
    // icon: <PhoneIcon />,
  },

  // CRM-powered caller ID
  {
    title: "Powerful CRM integration",
    subtitle:
      "Know who's calling, what you spoke about last time, and more before you pick up and greet them.",
    // icon: <PhoneIcon />,
  },

  // auto-send brochures, Section 32s, or contracts after the call
  {
    title: "Auto-send documents after the call",
    subtitle:
      "Swooche will suggest documents to send after the call, and you can send them with a tap. No more forgetting to send them later.",
    // icon: <PhoneIcon />,
  },
];

const comparisonTable = [
  {
    feature: "Cost per month",
    swooche: "$29–$149",
    "second phone": "$80–$120",
    "aircall / ringcentral": "$60–$200+/user",
  },
  {
    feature: "CRM integration (e.g. VaultRE)",
    swooche: "✅ Yes",
    "second phone": "❌ None",
    "aircall / ringcentral": "⚠️ Difficult/limited",
  },
  {
    feature: "Smart caller ID",
    swooche: "✅ Yes",
    "second phone": "❌ No",
    "aircall / ringcentral": "⚠️ With effort",
  },
  {
    feature: "Auto-send docs after call",
    swooche: "✅ Yes",
    "second phone": "❌ No",
    "aircall / ringcentral": "⚠️ Add-on/workaround",
  },
  {
    feature: "Call transcripts + summaries",
    swooche: "✅ Yes",
    "second phone": "❌ No",
    "aircall / ringcentral": "✅ Yes (higher plans)",
  },
  {
    feature: "Setup time",
    swooche: "Minutes",
    "second phone": "Hours",
    "aircall / ringcentral": "Hours/days",
  },
  {
    feature: "Mobile-friendly",
    swooche: "✅ Native",
    "second phone": "✅ (but clunky)",
    "aircall / ringcentral": "⚠️ Mostly desktop",
  },
  {
    feature: "Designed for real estate",
    swooche: "🎯 Yes",
    "second phone": "❌ No",
    "aircall / ringcentral": "❌ No",
  },
];

export default function Home() {
  return (
    <div>
      <main>
        <Box
          bg="brand.solid"
          padding={{ base: 8, md: 16 }}
          minHeight="80vh"
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
            fontSize={{ base: "6xl", md: "8xl" }}
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
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight={700}
              letterSpacing="-0.05em"
              lineHeight="1.2"
            >
              A powerful phone{" "}
              <span style={{ position: "relative" }}>
                app
                <Image
                  src="/handrawn-arrow.svg"
                  alt="handrawn arrow"
                  width="80px"
                  height="80px"
                  position="absolute"
                  top={{ base: "20px", sm: "40px", md: "10px" }}
                  transform="rotateX(180deg) rotate(-170deg)"
                  zIndex={0}
                  right={{ base: -20, sm: -10, md: -10 }}
                  display={{ base: "none", md: "block" }}
                />
              </span>
              <br />
              built for real estate agents on-the-go
            </Text>

            <VStack maxWidth="1000px" gap={8}>
              <Text fontSize="xl">
                Welcome callers with your <b>own professional brand</b>, recieve
                the calls and texts on <b>your phone</b> and have the{" "}
                <b>power of your CRM</b> system while you&apos;re on-the-go.
              </Text>

              <Group attached w="full" maxW="2xl" borderRadius="full">
                <Input
                  flex="1"
                  placeholder="Enter your email"
                  borderRadius="full"
                  borderColor="brand.fg"
                  borderWidth={1}
                  backgroundColor="white"
                  size="lg"
                />
                <Button
                  bg="bg.subtle"
                  variant="outline"
                  borderRadius="full"
                  size="lg"
                >
                  Register for early access
                </Button>
              </Group>
            </VStack>

            <Text color="brand.fg">
              Get a <b>free number</b> for 30 days for registering early.
            </Text>
          </Box>
        </Box>

        <VStack
          padding={16}
          maxWidth="1400px"
          margin="0 auto"
          textAlign="center"
          gap={8}
        >
          <Heading
            fontSize="5xl"
            fontWeight={700}
            letterSpacing="-0.05em"
            lineHeight="normal"
          >
            Stop Missing Leads.
            <br />
            Stay on top of your business.
          </Heading>

          <Text fontSize="xl" maxWidth="800px" margin="0 auto">
            Every call could be your next listing. But missed calls, lost
            context, and slow follow-ups are costing you business. Swooche gives
            you a dedicated business number with:
          </Text>

          <SimpleGrid
            templateColumns="repeat(3, 1fr)"
            gap={8}
            maxWidth="1200px"
            margin="0 auto"
          >
            {usps.map((usp, index) => (
              <Flex
                key={index}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                borderRadius="md"
                padding={4}
              >
                <Icon size="lg" color="tomato">
                  <Md3dRotation />
                </Icon>
                <Text fontSize="2xl" fontWeight={700} flex={1}>
                  {usp.title}
                </Text>
                <Text>{usp.subtitle}</Text>
              </Flex>
            ))}
          </SimpleGrid>

          <Text fontSize="xl">
            Don&apos;t just answer calls. Win business with them.
          </Text>
        </VStack>

        <HStack
          padding={16}
          gap={16}
          alignItems="stretch"
          maxWidth="1400px"
          margin="0 auto"
        >
          <Box width="50%">
            <Icon size="2xl" color="tomato">
              <Md3dRotation />
            </Icon>
            <Heading
              fontSize="5xl"
              fontWeight={700}
              letterSpacing="-0.05em"
              lineHeight="normal"
            >
              Why not just keep using a personal number?
            </Heading>

            <Text fontSize="xl">
              You can keep using your personal number, but you&apos;re missing
              out on a lot. With Swooche installed as an app on your phone, you
              can finally keep your personal and business calls separate.
            </Text>

            <Text fontSize="xl">
              ✅ NO LOCK-IN CONTRACTS. Forget about paying over $80 a month for
              a phone that does nothing besides ring.
            </Text>

            <Text fontSize="xl">
              ✅ Get a dedicated, professional business number (no new SIM
              needed)
            </Text>

            <Text fontSize="xl">
              ✅ See who’s calling — with details from your CRM
            </Text>

            <Text fontSize="xl">
              ✅ Auto-send brochures, Section 32s, or contracts after the call
            </Text>

            <Text fontSize="xl">
              ✅ Get call summaries + next steps via email or SMS
            </Text>

            <Text fontSize="xl">
              ✅ Route calls to your voice after hours while still being able to
              allow important clients through
            </Text>
          </Box>

          <Box flex={1} bg="brand.solid" borderRadius="md">
            Mockup goes here
            <Image
              src="/mockup.png"
              alt="Mockup"
              width="100%"
              height="100%"
              objectFit="cover"
            />
          </Box>
        </HStack>

        <HStack
          padding={16}
          gap={16}
          alignItems="stretch"
          maxWidth="1400px"
          margin="0 auto"
        >
          <Box bg="orange.400" borderRadius="md" flex={1}>
            Mockup goes here
            <Image
              src="/mockup.png"
              alt="Mockup"
              width="100%"
              height="100%"
              objectFit="cover"
            />
          </Box>
          <Box flex={1} width="50%">
            <Icon size="2xl" color="tomato">
              <Md3dRotation />
            </Icon>
            <Heading
              fontSize="5xl"
              fontWeight={700}
              letterSpacing="-0.05em"
              lineHeight="normal"
            >
              Show your callers the brand you&apos;ve built
            </Heading>

            <Text fontSize="xl">
              With your own professional welcome message to callers, after-call
              follow-up messages, and more, you can show your callers why you
              stand out above the rest.
            </Text>

            <Text fontSize="xl">You don&apos;t know who it is,</Text>

            <Text fontSize="xl">You don&apos;t answer in time,</Text>

            <Text fontSize="xl">and you forget to follow up.</Text>

            <Text fontSize="xl">
              This time, your client won&apos;t feel ignored and lose interest.
              Swooche will instantly text them back, and you don&apos;t have to
              worry about missing out.
            </Text>
          </Box>
        </HStack>

        <HStack
          padding={16}
          gap={16}
          alignItems="stretch"
          maxWidth="1400px"
          margin="0 auto"
        >
          <Box width="50%">
            <Icon size="2xl" color="tomato">
              <Md3dRotation />
            </Icon>
            <Heading
              fontSize="5xl"
              fontWeight={700}
              letterSpacing="-0.05em"
              lineHeight="normal"
            >
              Instantly text-back when you miss a call
            </Heading>

            <Text fontSize="xl">
              You&apos;re running between open homes, chasing down paperwork,
              juggling buyers and sellers, and then your phone rings...
            </Text>

            <Text fontSize="xl">You don&apos;t know who it is,</Text>

            <Text fontSize="xl">You don&apos;t answer in time,</Text>

            <Text fontSize="xl">and you forget to follow up.</Text>

            <Text fontSize="xl">
              This time, your client won&apos;t feel ignored and lose interest.
              Swooche will instantly text them back, and you don&apos;t have to
              worry about missing out.
            </Text>
          </Box>

          <Box flex={1} bg="brand.solid" borderRadius="md">
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="flex-end"
              height="100%"
              overflow="hidden"
            >
              <Box
                bg="white"
                borderTopRadius="md"
                padding="1px 1px 0px 1px"
                height="80%"
                width="280px"
                borderTopLeftRadius="40px"
                borderTopRightRadius="40px"
                borderWidth="8px 8px 0px 8px"
                borderColor="#1a1a1a"
                borderStyle="solid"
                backgroundColor="#000"
                boxShadow="0 20px 40px rgba(0,0,0,0.3)"
              >
                {/* Screen content */}
                <Box
                  width="100%"
                  height="100%"
                  backgroundColor="#f8f9fa"
                  display="flex"
                  flexDirection="column"
                  borderTopLeftRadius="32px"
                  borderTopRightRadius="32px"
                  overflow="hidden"
                >
                  <Flex
                    height="80px"
                    width="100%"
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    borderBottomColor="gray.300"
                    borderBottomWidth="1px"
                    borderBottomStyle="solid"
                  >
                    <Box
                      width="40px"
                      height="40px"
                      bg="gray.200"
                      borderRadius="full"
                      marginBottom={1}
                    />
                    <Text fontSize="10px" fontWeight={400}>
                      Brenda
                    </Text>
                  </Flex>
                  <Box
                    width="80%"
                    background="blue.500"
                    color="white"
                    marginTop={4}
                    marginLeft={2}
                    borderRadius={8}
                    padding={2}
                    fontSize="xs"
                  >
                    <Text>
                      Hey Brenda, I&apos;m showing an open house at the moment.
                      How can I help you?
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Flex>
          </Box>
        </HStack>

        <SnapScrollPage />

        <Box bg="brand.solid">
          <VStack
            padding={16}
            maxWidth="1400px"
            margin="0 auto"
            textAlign="center"
            gap={8}
          >
            <Icon size="2xl" color="tomato">
              <Md3dRotation />
            </Icon>
            <Heading
              fontSize="5xl"
              fontWeight={700}
              letterSpacing="-0.05em"
              lineHeight="normal"
            >
              Lets compare the options
            </Heading>

            <Table.Root
              size="sm"
              variant="outline"
              maxWidth="1000px"
              margin="0 auto"
              background="white"
              borderRadius="md"
              fontSize="md"
            >
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Feature</Table.ColumnHeader>
                  <Table.ColumnHeader>Swooche</Table.ColumnHeader>
                  <Table.ColumnHeader>Second Phone</Table.ColumnHeader>
                  <Table.ColumnHeader>Aircall / RingCentral</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {comparisonTable.map((row, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{row.feature}</Table.Cell>
                    <Table.Cell>{row.swooche}</Table.Cell>
                    <Table.Cell>{row["second phone"]}</Table.Cell>
                    <Table.Cell>{row["aircall / ringcentral"]}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </VStack>
        </Box>
      </main>
    </div>
  );
}

// Beats going to Telstra for another phone, where you can't even know
//       whos calling, and you're locked in for 24 months.
