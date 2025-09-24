"use client";

import { ReactNode } from "react";
import { useAppSelector } from "@/redux/hooks";
import { Center, Spinner } from "@chakra-ui/react";

export default function ClientAuthWrapper({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <Center minH="100vh" w="100%">
        <Spinner size="xl" />
      </Center>
    );
  }

  return <>{children}</>;
}
