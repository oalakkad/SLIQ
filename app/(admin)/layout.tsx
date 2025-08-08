"use client";

import { ReactNode } from "react";
import { Box } from "@chakra-ui/react";
import AdminSidebar from "@/components/admin/Sidebar";
import { Providers } from "@/components/ui/provider";

export default function AdminClientLayout({
  children,
}: {
  children: ReactNode;
}) {
  // const headingFont = isArabic
  //   ? "var(--font-cairo), sans-serif"
  //   : "var(--font-readex-pro), sans-serif";

  // const bodyFont = isArabic
  //   ? "var(--font-cairo), serif"
  //   : "var(--font-work-sans), serif";
  return (
    <Providers>
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
    </Providers>
  );
}
