import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "@/styles/globals.css";
import { Inter, Cairo, Work_Sans, Readex_Pro } from "next/font/google";
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
import QueryProvider from "@/components/utils/QueryProvider";
import { useAppSelector } from "@/redux/hooks";
const inter = Inter({ subsets: ["latin"] });

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
    default: "SAIE Clips",
    template: "%s | SAIE",
  },
  description: "The first local customized clips & brushes brand in Kuwait!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${cairo.variable} ${workSans.variable} ${readexPro.variable}`}
        style={{ fontFamily: "var(--font-cairo), serif" }}
      >
        <QueryProvider>
          <Provider>
            <Setup />
            <Providers>
              <Navbar />
              <Box>{children}</Box>
              <Footer />
            </Providers>
          </Provider>
        </QueryProvider>
      </body>
    </html>
  );
}
