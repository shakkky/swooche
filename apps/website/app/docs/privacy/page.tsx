import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";

export default function PrivacyPolicy() {
  return (
    <Box minHeight="100vh" py={20} bg="base.bg">
      <Container maxW="4xl">
        <VStack gap={8} align="start">
          <Heading as="h1" size="2xl" color="base.fg">
            Privacy Policy
          </Heading>

          <Text color="base.muted" fontSize="sm">
            Last updated: 06/09/2025
          </Text>

          <VStack gap={6} align="start">
            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                1. Information We Collect
              </Heading>
              <Text color="base.muted" lineHeight="1.6" mb={4}>
                We collect information you provide directly to us, such as when
                you create an account, use our services, or contact us for
                support.
              </Text>
              <Text color="base.muted" lineHeight="1.6">
                <strong>Personal Information:</strong> Name, email address,
                profile information, and any other information you choose to
                provide.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                2. How We Use Your Information
              </Heading>
              <Text color="base.muted" lineHeight="1.6" mb={4}>
                We use the information we collect to:
              </Text>
              <Text color="base.muted" lineHeight="1.6">
                • Provide, maintain, and improve our services
                <br />
                • Process transactions and send related information
                <br />
                • Send technical notices, updates, security alerts, and support
                messages
                <br />
                • Respond to your comments, questions, and requests
                <br />• Monitor and analyze trends, usage, and activities in
                connection with our services
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                3. Information Sharing and Disclosure
              </Heading>
              <Text color="base.muted" lineHeight="1.6" mb={4}>
                We do not sell, trade, or otherwise transfer your personal
                information to third parties without your consent, except in the
                following circumstances:
              </Text>
              <Text color="base.muted" lineHeight="1.6">
                • With service providers who assist us in operating our website
                and conducting our business
                <br />
                • When we believe release is appropriate to comply with the law,
                enforce our site policies, or protect ours or others' rights,
                property, or safety
                <br />• In connection with a merger, acquisition, or sale of all
                or a portion of our assets
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                4. Data Security
              </Heading>
              <Text color="base.muted" lineHeight="1.6">
                We implement appropriate security measures to protect your
                personal information against unauthorized access, alteration,
                disclosure, or destruction. However, no method of transmission
                over the internet or electronic storage is 100% secure, so we
                cannot guarantee absolute security.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                5. Cookies and Tracking Technologies
              </Heading>
              <Text color="base.muted" lineHeight="1.6">
                We use cookies and similar tracking technologies to collect and
                use personal information about you. You can control cookies
                through your browser settings, but disabling cookies may limit
                your ability to use certain features of our service.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                6. Third-Party Services
              </Heading>
              <Text color="base.muted" lineHeight="1.6">
                Our service may contain links to third-party websites or
                services. We are not responsible for the privacy practices of
                these third parties. We encourage you to read their privacy
                policies before providing any personal information.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                7. Data Retention
              </Heading>
              <Text color="base.muted" lineHeight="1.6">
                We retain your personal information for as long as necessary to
                provide our services and fulfill the purposes outlined in this
                Privacy Policy, unless a longer retention period is required or
                permitted by law.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                8. Your Rights and Choices
              </Heading>
              <Text color="base.muted" lineHeight="1.6" mb={4}>
                You have certain rights regarding your personal information:
              </Text>
              <Text color="base.muted" lineHeight="1.6">
                • Access: You can request access to your personal information
                <br />
                • Correction: You can request correction of inaccurate personal
                information
                <br />
                • Deletion: You can request deletion of your personal
                information
                <br />
                • Portability: You can request a copy of your personal
                information in a portable format
                <br />• Opt-out: You can opt out of certain communications from
                us
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                9. Children's Privacy
              </Heading>
              <Text color="base.muted" lineHeight="1.6">
                Our service is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If you are a parent or guardian and believe your child
                has provided us with personal information, please contact us.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                10. International Data Transfers
              </Heading>
              <Text color="base.muted" lineHeight="1.6">
                Your information may be transferred to and processed in
                countries other than your own. We ensure that such transfers
                comply with applicable data protection laws and implement
                appropriate safeguards to protect your personal information.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                11. Changes to This Privacy Policy
              </Heading>
              <Text color="base.muted" lineHeight="1.6">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date. You are advised
                to review this Privacy Policy periodically for any changes.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="base.fg">
                12. Contact Us
              </Heading>
              <Text color="base.muted" lineHeight="1.6">
                If you have any questions about this Privacy Policy or our
                privacy practices, please contact us at privacy@swooche.com.
              </Text>
            </Box>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
