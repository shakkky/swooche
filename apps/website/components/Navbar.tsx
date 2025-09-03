"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Text,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { MdMenu, MdClose } from "react-icons/md";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const onToggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById("navbar");
      if (navbar) {
        if (window.scrollY > 10) {
          navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
        } else {
          navbar.style.boxShadow = "none";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      as="nav"
      bg="brand.solid"
      position="sticky"
      top={0}
      zIndex={1000}
      transition="box-shadow 0.3s ease"
      id="navbar"
    >
      <Box maxWidth="1200px" margin="0 auto" padding={{ base: 4, md: 6 }}>
        {/* Desktop Navigation */}
        <HStack
          justifyContent="space-between"
          alignItems="center"
          display={{ base: "none", md: "flex" }}
        >
          {/* Logo */}
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            letterSpacing="-0.02em"
            lineHeight="0.9"
            fontFamily="modak"
          >
            Swooche
          </Text>

          {/* Navigation Buttons */}
          <HStack gap={4}>
            <Button
              variant="outline"
              bg="white"
              borderColor="white"
              color="onBrand.solid"
              size="md"
              borderRadius="full"
            >
              Get a demo
            </Button>
            <Button
              bg="brand.contrast"
              color="white"
              _hover={{ bg: "onBrand.contrastEmphasized" }}
              size="md"
              borderRadius="full"
            >
              Create a free account
            </Button>
          </HStack>
        </HStack>

        {/* Mobile Navigation */}
        <HStack
          justifyContent="space-between"
          alignItems="center"
          display={{ base: "flex", md: "none" }}
        >
          {/* Logo */}
          <Text
            fontSize="2xl"
            letterSpacing="-0.02em"
            lineHeight="0.9"
            fontFamily="modak"
          >
            Swooche
          </Text>

          {/* Mobile Menu Button */}
          <IconButton
            aria-label="Toggle menu"
            onClick={onToggle}
            variant="ghost"
            color="onBrand.fg"
            size="md"
            _hover={{ bg: "rgba(0, 0, 0, 0.1)" }}
          >
            {isOpen ? <MdClose /> : <MdMenu />}
          </IconButton>
        </HStack>

        {/* Mobile Menu */}
        <Box
          display={{ base: "block", md: "none" }}
          bg="brand.solid"
          borderTop="1px solid"
          borderColor="rgba(0, 0, 0, 0.1)"
          mt={4}
          pt={4}
          pb={4}
          transform={isOpen ? "translateY(0)" : "translateY(-100%)"}
          opacity={isOpen ? 1 : 0}
          transition="all 0.3s ease"
          position="absolute"
          left={0}
          right={0}
          top="100%"
          zIndex={999}
          onClick={onToggle}
        >
          <VStack gap={4} px={4}>
            <Button
              variant="outline"
              bg="white"
              borderColor="white"
              color="onBrand.solid"
              size="md"
              width="full"
              borderRadius="full"
            >
              Get a demo
            </Button>
            <Button
              bg="brand.contrast"
              color="white"
              size="md"
              width="full"
              borderRadius="full"
            >
              Create a free account
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
