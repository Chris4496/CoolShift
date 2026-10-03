import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { ServiceWorkerRegistrar } from "@/components/pwa";

export const metadata: Metadata = {
  title: "Cool Shift · Powered by CLP",
  description:
    "CLP Cool Shift: small actions, everyday value. A personal AI assistant that helps Hong Kong households shift energy use, save money and earn local rewards.",
  applicationName: "Cool Shift",
  appleWebApp: {
    capable: true,
    title: "Cool Shift",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f6f4",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
