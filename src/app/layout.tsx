import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

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
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${spaceMono.variable} font-mono antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
