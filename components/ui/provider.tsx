// components/ui/provider.tsx
"use client"; // if using Next.js App Router (optional but recommended)

import theme from "@/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
