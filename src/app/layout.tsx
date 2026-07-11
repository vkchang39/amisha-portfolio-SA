import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import localFont from "next/font/local";
import Providers from "./providers";
import "./globals.css";

const pricedown = localFont({
  src: "../../public/fonts/pricedown.woff",
  variable: "--font-pricedown",
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
  return (
    <html
      lang="en"
      className={`${pricedown.variable} ${oswald.variable} ${inter.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject
          attributes into <body> before React hydrates, causing false mismatches */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
