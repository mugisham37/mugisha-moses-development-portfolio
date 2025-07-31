import type { Metadata, Viewport } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import { Navigation, Footer } from "@/components/layout";
import { ThemeProvider, ExitIntentProvider } from "@/components/providers";
import { CursorTrail, ScrollProgress } from "@/components/interactive";
import StickyContactButton from "@/components/ui/StickyContactButton";
import {
  generateMetadata as generateSEOMetadata,
  generateWebSiteStructuredData,
  generateOrganizationStructuredData,
} from "@/lib/seo";
import PerformanceMonitor from "@/components/ui/PerformanceMonitor";
import AccessibilityProvider from "@/components/providers/AccessibilityProvider";
import SkipLinks from "@/components/ui/SkipLinks";
import AccessibilityToolbar from "@/components/ui/AccessibilityToolbar";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = generateSEOMetadata({
  title: "Developer Portfolio | High-Converting Web Development",
  description:
    "Professional web developer specializing in React, Next.js, and high-converting digital experiences. Building exceptional web applications that drive results.",
  keywords:
    "web developer, React developer, Next.js, frontend developer, full-stack developer, e-commerce development, SaaS development, high-converting websites",
  path: "/",
});

export const viewport: Viewport = {
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
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebSiteStructuredData()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationStructuredData()),
          }}
        />

        {/* Additional Meta Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Developer Portfolio" />
        <meta name="application-name" content="Developer Portfolio" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${spaceMono.variable} font-mono antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <SkipLinks />
        <PerformanceMonitor />
        <AccessibilityProvider>
          <ThemeProvider>
            <ExitIntentProvider>
              <ScrollProgress height={6} showPercentage={false} />
              <CursorTrail />
              <Navigation />
              <main
                id="main-content"
                className="flex-1 pt-16 lg:pt-20"
                tabIndex={-1}
              >
                {children}
              </main>
              <Footer />
              <StickyContactButton />
              <AccessibilityToolbar />
            </ExitIntentProvider>
          </ThemeProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
