"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, ExternalLink } from "lucide-react";

interface FooterProps {
  className?: string;
}

const socialLinks = [
  {
    href: "https://github.com",
    icon: Github,
    label: "GitHub",
    username: "@devportfolio",
  },
  {
    href: "https://linkedin.com",
    icon: Linkedin,
    label: "LinkedIn",
    username: "/in/devportfolio",
  },
  {
    href: "https://twitter.com",
    icon: Twitter,
    label: "Twitter",
    username: "@devportfolio",
  },
  {
    href: "mailto:hello@devportfolio.com",
    icon: Mail,
    label: "Email",
    username: "hello@devportfolio.com",
  },
];

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Footer({ className = "" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className={`bg-brutalist-light-gray border-t-[5px] border-black ${className}`}
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="brutalist-container">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link
                href="/"
                className="inline-block font-mono font-black text-2xl lg:text-3xl uppercase tracking-wider hover-footer-link mb-4"
                aria-label="Developer Portfolio - Home"
              >
                DEV.PORTFOLIO
              </Link>
              <p className="font-mono text-sm lg:text-base leading-relaxed mb-6 max-w-md">
                Building exceptional web experiences that convert visitors into
                customers. Specializing in React, Next.js, and high-performance
                applications.
              </p>

              {/* Availability Status */}
              <div
                className="inline-flex items-center space-x-3 px-4 py-2 bg-[#ffff00] border-[3px] border-black"
                role="status"
                aria-label="Current availability status"
              >
                <div
                  className="w-3 h-3 bg-green-500 rounded-full animate-pulse"
                  aria-hidden="true"
                ></div>
                <span className="font-mono font-bold text-sm uppercase tracking-wider">
                  Available for Projects
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <nav aria-label="Footer navigation">
              <h3 className="font-mono font-bold text-lg uppercase tracking-wider mb-6 border-b-[3px] border-black pb-2">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-mono text-sm uppercase tracking-wider hover-footer-link inline-flex items-center group"
                    >
                      {link.label}
                      <ExternalLink
                        size={12}
                        className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Social Links */}
            <nav aria-label="Social media links">
              <h3 className="font-mono font-bold text-lg uppercase tracking-wider mb-6 border-b-[3px] border-black pb-2">
                Connect
              </h3>
              <ul className="space-y-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm hover-social-link inline-flex items-center group"
                        aria-label={`${social.label} - ${social.username}`}
                      >
                        <IconComponent
                          size={16}
                          className="mr-3 group-hover:scale-110 transition-transform duration-200"
                          aria-hidden="true"
                        />
                        <div>
                          <div className="font-bold uppercase tracking-wider">
                            {social.label}
                          </div>
                          <div className="text-xs text-contrast-safe-medium">
                            {social.username}
                          </div>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-[3px] border-black py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="font-mono text-sm text-center md:text-left">
              <span className="font-bold uppercase tracking-wider">
                © {currentYear} DEV.PORTFOLIO
              </span>
              <span className="mx-2">•</span>
              <span>All rights reserved</span>
              <span className="mx-2">•</span>
              <span>Built with Next.js & ❤️</span>
            </div>

            {/* Legal Links */}
            <nav
              className="flex items-center space-x-6"
              aria-label="Legal and site information"
            >
              <Link
                href="/privacy"
                className="font-mono text-sm uppercase tracking-wider hover-footer-link"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="font-mono text-sm uppercase tracking-wider hover-footer-link"
              >
                Terms
              </Link>
              <Link
                href="/sitemap"
                className="font-mono text-sm uppercase tracking-wider hover-footer-link"
              >
                Sitemap
              </Link>
            </nav>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 p-3 border-[3px] border-black hover-back-to-top z-40 group focus-contrast-safe"
          aria-label="Back to top"
        >
          <svg
            className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </footer>
  );
}
