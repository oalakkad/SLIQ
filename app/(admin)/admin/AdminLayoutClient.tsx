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
  return (
    <Providers>
      <Box display="flex" minH="100vh">
        <AdminSidebar />
        <Box flex="1" p={6} bg="gray.50">
          {children}
        </Box>
      </Box>
    </Providers>
  );
}
