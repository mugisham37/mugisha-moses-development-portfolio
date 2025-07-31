import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import { Navigation, Footer } from "@/components/layout";
import { ThemeProvider } from "@/components/providers";
import { CursorTrail, ScrollProgress } from "@/components/interactive";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Developer Portfolio | High-Converting Web Development",
  description:
    "Professional web developer specializing in React, Next.js, and high-converting digital experiences. Building exceptional web applications that drive results.",
  keywords:
    "web developer, React developer, Next.js, frontend developer, full-stack developer",
  authors: [{ name: "Developer Portfolio" }],
  openGraph: {
    title: "Developer Portfolio | High-Converting Web Development",
    description:
      "Professional web developer specializing in React, Next.js, and high-converting digital experiences.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Portfolio | High-Converting Web Development",
    description:
      "Professional web developer specializing in React, Next.js, and high-converting digital experiences.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${spaceMono.variable} font-mono antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <ScrollProgress height={6} showPercentage={false} />
          <CursorTrail />
          <Navigation />
          <main className="flex-1 pt-16 lg:pt-20">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
