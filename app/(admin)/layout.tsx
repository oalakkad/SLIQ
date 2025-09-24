"use client";

import { ReactNode, useEffect, useState } from "react";
import { Box, Spinner, Center } from "@chakra-ui/react";
import AdminSidebar from "@/components/admin/Sidebar";
import { Providers } from "@/components/ui/provider";
import QueryProvider from "@/components/utils/QueryProvider";
import { Cairo, Work_Sans, Readex_Pro } from "next/font/google";
import { useAppSelector } from "@/redux/hooks";

export const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

export const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-work-sans",
  display: "swap",
});

export const readexPro = Readex_Pro({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-readex-pro",
  display: "swap",
});

export default function AdminClientLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  // Ensure code only runs on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent store access during SSR
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isClient) {
    return (
      <Center minH="100vh" w="100%">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <html lang="en">
      <body
        className={`${cairo.variable} ${workSans.variable} ${readexPro.variable}`}
      >
        <QueryProvider>
          <Providers>
            {isAuthenticated ? (
              <Box display="flex" minH="100vh">
                <AdminSidebar />
                <Box
                  flex="1"
                  display="flex"
                  p={6}
                  bg="gray.50"
                  fontFamily={"var(--font-cairo), serif !important"}
                >
                  {children}
                </Box>
              </Box>
            ) : (
              <Center minH="100vh" w="100%">
                <Spinner size="xl" />
              </Center>
            )}
          </Providers>
        </QueryProvider>
      </body>
    </html>
  );
}
