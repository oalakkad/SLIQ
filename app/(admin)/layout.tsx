"use client";

import { ReactNode, useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";

import { Box, Center, Spinner } from "@chakra-ui/react";
import AdminSidebar from "@/components/admin/Sidebar";
import { Providers as UIProviders } from "@/components/ui/provider";
import QueryProvider from "@/components/utils/QueryProvider";
import { Cairo, Work_Sans, Readex_Pro } from "next/font/google";

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

/** Runs ONLY under ReduxProvider */
function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAppSelector((s) => s.auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <Center minH="100vh" w="100%">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return null; // prevent flicker while redirecting
  }

  return <>{children}</>;
}

export default function AdminClientLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${cairo.variable} ${workSans.variable} ${readexPro.variable}`}>
        <ReduxProvider store={store}>
          <QueryProvider>
            <UIProviders>
              <Box display="flex" minH="100vh">
                <AdminSidebar />
                <Box
                  flex="1"
                  display="flex"
                  p={6}
                  bg="gray.50"
                  fontFamily={"var(--font-cairo), serif !important"}
                >
                  <AuthGate>{children}</AuthGate>
                </Box>
              </Box>
            </UIProviders>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
