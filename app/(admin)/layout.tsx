"use client";

import { ReactNode } from "react";
import { Box } from "@chakra-ui/react";
import AdminSidebar from "@/components/admin/Sidebar";
import { Providers } from "@/components/ui/provider";
import QueryProvider from "@/components/utils/QueryProvider";
import { Inter, Cairo, Work_Sans, Readex_Pro } from "next/font/google";
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

export const metadata = {
  title: {
    default: "Admin Dashboard | SAIE Clips",
    template: "%s | SAIE",
  },
};

export default function AdminClientLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${cairo.variable} ${workSans.variable} ${readexPro.variable}`}
      >
        <QueryProvider>
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
        </QueryProvider>
      </body>
    </html>
  );
}
