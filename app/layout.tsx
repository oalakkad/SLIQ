import "@/styles/globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Provider from "@/redux/provider";
import { Footer, Navbar } from "@/components/common";
import { Setup } from "@/components/utils";
import { Providers } from "@/components/ui/provider";
import "@fontsource/work-sans/100.css"; // Thin
import "@fontsource/work-sans/300.css"; // Light
import "@fontsource/readex-pro/500.css"; // Medium
import "@fontsource/readex-pro/600.css"; // SemiBold
import "@fontsource/readex-pro/700.css"; // Bold
import { Box } from "@chakra-ui/react";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Full Auth",
  description: "Full Auth application that provides jwt authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <Setup />
          <Providers>
            <Navbar />
            <Box>{children}</Box>
            <Footer />
          </Providers>
        </Provider>
      </body>
    </html>
  );
}
