import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AdSenseScript } from "@/components/ads/AdSenseScript";
import { CmpScript } from "@/components/consent/CmpScript";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { ConsentDefaults } from "@/components/consent/ConsentDefaults";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { adsConfig } from "@/config/ads";
import { defaultMeta } from "@/config/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: defaultMeta.title, template: `%s | ${siteConfig.name}` },
  description: defaultMeta.description,
  applicationName: siteConfig.name,
  icons: {
    icon: [{ url: "/icons/favicon.svg", type: "image/svg+xml" }, { url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  // AdSense ownership verification without loading any ad script before consent.
  other: adsConfig.clientId ? { "google-adsense-account": adsConfig.clientId } : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ConsentDefaults />
      </head>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-brand-700 focus:shadow-lg"
        >
          Skip to main content
        </a>
        <ConsentProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <ConsentBanner />
          <CmpScript />
          <AdSenseScript />
        </ConsentProvider>
      </body>
    </html>
  );
}
