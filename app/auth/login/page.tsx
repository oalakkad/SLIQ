"use client";

import { useAppSelector } from "@/redux/hooks";
import { Box, Flex, Heading, Text, useMediaQuery } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import saieLogo from "@/public/saie-logo.png";
import LoginForm from "@/components/forms/LoginForm"; // ✅ Import your LoginForm here

export default function LoginPage() {
  const [isMobile] = useMediaQuery(["(max-width: 768px)"]);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  if (isAuthenticated) {
    router.push("/");
  }

  return (
    <Box
      bg="brand.pink"
      minH="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box
        bg="white"
        p={8}
        rounded="xl"
        boxShadow="lg"
        width="100%"
        maxW="md"
        textAlign="center"
      >
        {/* Logo */}
        <Flex w={"100%"} justifyContent={"center"}>
          <Image src={saieLogo} alt="SAIE" width={128} height={49} />
        </Flex>

        {/* Login Form */}
        <Box mt={6}>
          <Heading
            size="sm"
            textAlign="center"
            mb={2}
            fontWeight="semibold"
            color="gray.700"
          >
            Sign in
          </Heading>
          <LoginForm />
        </Box>

        {/* Footer */}
        <Box mt={4} fontSize="xs" color="gray.500">
          <Text as="span" cursor="pointer" mr={3}>
            Privacy
          </Text>
          <Text as="span" cursor="pointer">
            Terms
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
