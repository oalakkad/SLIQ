"use client";

import { useAppSelector } from "@/redux/hooks";
import { Box, Flex, Heading, Text, useMediaQuery } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import saieLogo from "@/public/saie-logo.png";
import LoginForm from "@/components/forms/LoginForm"; // ✅ Import your LoginForm here
import Link from "next/link";

export default function LoginPage() {
  const [isMobile] = useMediaQuery(["(max-width: 768px)"]);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const isArabic = useAppSelector((state) => state.lang.isArabic);

  const headingFont = isArabic
    ? "var(--font-cairo), sans-serif"
    : "var(--font-readex-pro), sans-serif";

  const bodyFont = isArabic
    ? "var(--font-cairo), serif"
    : "var(--font-work-sans), serif";

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
      fontFamily={bodyFont}
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
        {/* Login Form */}
        <Box mt={2}>
          <Heading
            textAlign="center"
            mb={2}
            fontFamily={headingFont}
            fontWeight="semibold"
            color="gray.500"
          >
            {isArabic ? "تسجيل الدخول" : "SIGN IN"}
          </Heading>
          <LoginForm />
          <Text color={"gray.500"} mt={5} dir={isArabic ? "rtl" : "ltr"}>
            {isArabic ? "ليس لديك حساب؟" : "Do not have an account?"}
            <Link
              href="/auth/register"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              <Text as={"span"} color={"#7ea2ca"} mx={1}>
                {isArabic ? "انشاء حساب" : "Register"}
              </Text>
            </Link>
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
