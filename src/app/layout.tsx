import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { preload } from "react-dom";
import Script from "next/script";
import { Oswald, Source_Sans_3 } from "next/font/google";
import localFont from "next/font/local";
import Providers from "./providers";
import { getBasePath } from "@/lib/basePath";
import { LOADING_SPLASHES } from "@/lib/loadingTips";
import { PERSON_JSON_LD, SITE_URL } from "@/lib/structuredData";
import { GOATCOUNTER_CODE, hasAnalytics } from "@/lib/siteConfig";
import "./globals.css";

const pricedown = localFont({
  src: "../../public/fonts/pricedown.woff",
  variable: "--font-pricedown",
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const SITE_TITLE =
  "Amisha Sharma — IT Project Coordinator | San Andreas Edition";
const SITE_DESCRIPTION =
  "Amisha Sharma — IT Project Coordinator. Agile/SDLC delivery across web, mobile, and enterprise (CERT-IN DMS, high-growth apps). San Andreas Edition.";
const OG_IMAGE = `${SITE_URL}/images/og-share.jpg?v=2`;

export const viewport: Viewport = {
  themeColor: "#0c0913",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Amisha Sharma",
    statusBarStyle: "black-translucent",
  },
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: "Amisha Sharma Portfolio",
  authors: [{ name: "Amisha Sharma" }],
  keywords: [
    "Amisha Sharma",
    "IT Project Coordinator",
    "Junior Project Manager",
    "Scrum Master",
    "Agile",
    "SDLC",
    "portfolio",
    "project management",
    "GTA San Andreas",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Amisha Sharma — San Andreas Edition",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        secureUrl: OG_IMAGE,
        type: "image/jpeg",
        width: 1200,
        height: 630,
        alt: "Amisha Sharma — IT Project Coordinator, San Andreas Edition",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const basePath = getBasePath();

  // The loading screen paints first; get its art in flight before JS hydrates.
  preload(`${basePath}${LOADING_SPLASHES[0]}`, { as: "image", fetchPriority: "high" });

  return (
    <html
      lang="en"
      className={`${pricedown.variable} ${oswald.variable} ${sourceSans.variable} h-full antialiased`}
      style={
        {
          ["--cursor-crosshair" as string]: `url("${basePath}/cursors/sa-crosshair.svg")`,
          ["--cursor-pointer" as string]: `url("${basePath}/cursors/sa-crosshair-pointer.svg")`,
        } as CSSProperties
      }
    >
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject
          attributes into <body> before React hydrates, causing false mismatches */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          // JSON.stringify output is trusted static data from src/lib/structuredData.ts
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
        <Providers>{children}</Providers>
        {hasAnalytics && (
          // GoatCounter: cookieless, no personal data, ~3 KB. Only rendered when configured.
          <Script
            src="//gc.zgo.at/count.js"
            data-goatcounter={`https://${GOATCOUNTER_CODE}.goatcounter.com/count`}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
