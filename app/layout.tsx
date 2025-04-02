"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { PrivateGuard } from "./guards";
import Layout from "./components/layout";

//styles
import "./globals.css";
import "@mantine/core/styles.css"; // Make sure this comes after globals.css
import "@mantine/charts/styles.css";

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 12, // 12 seconds
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider>
            <ModalsProvider>
              <PrivateGuard>
                <Layout>{children}</Layout>
              </PrivateGuard>
            </ModalsProvider>
          </MantineProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
