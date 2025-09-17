"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useActivationMutation } from "@/redux/features/authApiSlice";
import { Flex, Heading, Spinner, useToast } from "@chakra-ui/react";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ uid: string; token: string }>();
  const [activation] = useActivationMutation();
  const toast = useToast();

  useEffect(() => {
    const uid = params?.uid;
    const token = params?.token;

    if (!uid || !token) return;

    activation({ uid, token })
      .unwrap()
      .then(() => {
        toast({
          title: "Account activated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(() => {
        toast({
          title: "Failed to activate account",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        router.push("/auth/login");
      });
  }, [activation, params, router, toast]);

  return (
    <Flex minH="50vh" alignItems="center" flexDir="column">
      <Heading mb="2rem">Activating Your Account</Heading>
      <Spinner color="brand.pink" size="xl" />
    </Flex>
  );
}
