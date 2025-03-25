import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import Layout from "./components/layout";

//styles
import "@mantine/core/styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <MantineProvider>
          <ModalsProvider>
            <Layout>{children}</Layout>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
