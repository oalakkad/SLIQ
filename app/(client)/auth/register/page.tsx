"use client";
import Link from "next/link";
import { RegisterForm } from "@/components/forms";
import { SocialButtons } from "@/components/common";
import { Box, Heading, Text } from "@chakra-ui/react";
import { useAppSelector } from "@/redux/hooks";

export default function Page() {
  const isArabic = useAppSelector((state) => state.lang.isArabic);
  const headingFont = isArabic
    ? "var(--font-cairo), sans-serif"
    : "var(--font-readex-pro), sans-serif";

  const bodyFont = isArabic
    ? "var(--font-cairo), serif"
    : "var(--font-work-sans), serif";
  return (
    <Box w={"full"} px={6} pb={12} fontFamily={bodyFont}>
      <Heading
        mt={5}
        color={"brand.pink"}
        textAlign={"center"}
        fontFamily={headingFont}
      >
        {isArabic ? "انشاء حساب" : "Sign up for your account"}
      </Heading>
      <div className="flex min-h-full flex-1 flex-col justify-center">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <RegisterForm />

          <Text
            className="mt-10 text-center text-sm text-gray-500"
            dir={isArabic ? "rtl" : "ltr"}
          >
            {isArabic ? "لديك حساب بالفعل؟" : "Already have an account?"}
            <Link
              href="/auth/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              <Text
                as={"span"}
                color={"brand.pink"}
                mx={1}
                fontFamily={headingFont}
              >
                {isArabic ? "تسجيل الدخول" : "Login here"}
              </Text>
            </Link>
          </Text>
        </div>
      </div>
    </Box>
  );
}
