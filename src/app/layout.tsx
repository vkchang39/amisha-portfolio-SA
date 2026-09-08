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

export const metadata: Metadata = {
  title: "Amisha Sharma — IT Project Coordinator | San Andreas Edition",
  description:
    "Portfolio of Amisha Sharma, IT Project Coordinator. Grove Street. Home. Missions delivered, respect earned.",
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
