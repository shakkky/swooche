import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";

export default function TermsOfService() {
  return (
    <Box minHeight="100vh" py={20} bg="base.bg">
      <Container maxW="4xl">
        <VStack gap={8} align="start">
          <Heading as="h1" size="2xl" color="base.fg">
            Terms of Service
          </Heading>

          <Text color="base.muted" fontSize="sm">
            Last updated: 06/09/2025
          </Text>

          <VStack gap={6} align="start">
            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                1. Acceptance of Terms
              </Heading>
              <Text color="base.muted" lineHeight="1.6">
                By accessing and using Swooche ("the Service"), you accept and
                agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use
                this service.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                2. Description of Service
              </Heading>
              <Text color="base.muted" lineHeight="1.6">
                Swooche provides white-label client portals and project
                management tools that help businesses look professional while
                saving time. Our service includes client portals, project
                tracking, and automated updates.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                3. User Accounts
              </Heading>
              <Text color="base.muted" lineHeight="1.6">
                To access certain features of the Service, you must register for
                an account. You are responsible for maintaining the
                confidentiality of your account credentials and for all
                activities that occur under your account. You agree to notify us
                immediately of any unauthorized use of your account.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                4. Acceptable Use
              </Heading>
              <Text color="base.muted" lineHeight="1.6">
                You agree not to use the Service for any unlawful purpose or any
                purpose prohibited under this clause. You may not use the
                Service in any manner that could damage, disable, overburden, or
                impair any server, or the network(s) connected to any server, or
                interfere with any other party's use and enjoyment of the
                Service.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                5. Intellectual Property
              </Heading>
              <Text color="base.muted" lineHeight="1.6">
                The Service and its original content, features, and
                functionality are and will remain the exclusive property of
                Swooche and its licensors. The Service is protected by
                copyright, trademark, and other laws. Our trademarks and trade
                dress may not be used in connection with any product or service
                without our prior written consent.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                6. Privacy Policy
              </Heading>
              <Text color="base.muted" lineHeight="1.6">
                Your privacy is important to us. Please review our Privacy
                Policy, which also governs your use of the Service, to
                understand our practices.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                7. Termination
              </Heading>
              <Text color="base.muted" lineHeight="1.6">
                We may terminate or suspend your account and bar access to the
                Service immediately, without prior notice or liability, under
                our sole discretion, for any reason whatsoever and without
                limitation, including but not limited to a breach of the Terms.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                8. Disclaimer
              </Heading>
              <Text color="base.muted" lineHeight="1.6">
                The information on this Service is provided on an "as is" basis.
                To the fullest extent permitted by law, this Company excludes
                all representations, warranties, conditions and terms relating
                to our Service and the use of this Service.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                9. Limitation of Liability
              </Heading>
              <Text color="base.muted" lineHeight="1.6">
                In no event shall Swooche, nor its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential, or punitive
                damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses, resulting from your
                use of the Service.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                10. Governing Law
              </Heading>
              <Text color="base.muted" lineHeight="1.6">
                These Terms shall be interpreted and governed by the laws of the
                United States, without regard to its conflict of law provisions.
                Our failure to enforce any right or provision of these Terms
                will not be considered a waiver of those rights.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                11. Changes to Terms
              </Heading>
              <Text color="base.muted" lineHeight="1.6">
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will provide at least 30 days notice prior to any new terms
                taking effect.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                12. Contact Information
              </Heading>
              <Text color="base.muted" lineHeight="1.6">
                If you have any questions about these Terms of Service, please
                contact us at legal@swooche.com.
              </Text>
            </Box>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
