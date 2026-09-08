import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Oswald, Inter } from "next/font/google";
import localFont from "next/font/local";
import Providers from "./providers";
import { getBasePath } from "@/lib/basePath";
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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://vkchang39.github.io/amisha-portfolio-SA";
const SITE_TITLE =
  "Amisha Sharma — IT Project Coordinator | San Andreas Edition";
const SITE_DESCRIPTION =
  "Portfolio of Amisha Sharma, IT Project Coordinator. Grove Street. Home. Missions delivered, respect earned.";
const OG_IMAGE = `${SITE_URL}/images/og-share.jpg?v=2`;

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: "Amisha Sharma Portfolio",
  authors: [{ name: "Amisha Sharma" }],
  keywords: [
    "Amisha Sharma",
    "IT Project Coordinator",
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

  return (
    <html
      lang="en"
      className={`${pricedown.variable} ${oswald.variable} ${inter.variable} h-full antialiased`}
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
