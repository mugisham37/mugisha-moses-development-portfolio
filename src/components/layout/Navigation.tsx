"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useTheme } from "@/components/providers";
import { validateNavigationColors } from "@/utils/colorUtils";
import { runNavigationColorCheck } from "@/utils/verifyNavigation";

const DarkModeToggle = dynamic(() => import("@/components/ui/DarkModeToggle"), {
  ssr: false,
  loading: () => (
    <div
      className="brutalist-toggle-skeleton brutalist-toggle-md"
      aria-hidden="true"
    />
  ),
});

interface NavigationProps {
  className?: string;
}

const navigationItems = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/portfolio", label: "PORTFOLIO" },
  { href: "/services", label: "SERVICES" },
  { href: "/contact", label: "CONTACT" },
];

export default function Navigation({ className = "" }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  // Safely get theme with fallback
  let theme: "light" | "dark" = "light";
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
  } catch {
    // Fallback to light theme if ThemeProvider is not available
    theme = "light";
  }

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Validate color combinations in development
  useEffect(() => {
    if (typeof window !== "undefined") {
      validateNavigationColors(theme);
      runNavigationColorCheck();
    }
  }, [theme]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav
        id="navigation"
        className={`fixed top-0 left-0 right-0 z-50 bg-background border-b-[5px] border-foreground transition-colors duration-300 nav-theme-aware ${className}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="brutalist-container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="font-mono font-black text-xl lg:text-2xl uppercase tracking-wider text-safe-on-white hover:text-brutalist-yellow transition-colors duration-200 focus:outline-none focus:ring-3 focus:ring-brutalist-yellow focus:ring-offset-2"
              aria-label="Developer Portfolio - Home"
            >
              DEV.PORTFOLIO
            </Link>

            {/* Desktop Navigation */}
            <div
              className="hidden lg:flex items-center space-x-8"
              role="menubar"
            >
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-mono font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:text-brutalist-yellow relative focus:outline-none focus:ring-3 focus:ring-brutalist-yellow focus:ring-offset-2 ${
                    pathname === item.href
                      ? "text-brutalist-yellow after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-[3px] after:bg-brutalist-yellow"
                      : "text-safe-on-white"
                  }`}
                  role="menuitem"
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}

              {/* Dark Mode Toggle */}
              <DarkModeToggle size="md" />
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden flex items-center space-x-3">
              {/* Dark Mode Toggle for Mobile */}
              <DarkModeToggle size="sm" />

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="p-2 border-[3px] border-foreground bg-background text-safe-on-white hover:bg-foreground hover:text-background transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-brutalist-yellow focus:ring-offset-2"
                aria-label={
                  isOpen ? "Close navigation menu" : "Open navigation menu"
                }
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                aria-haspopup="true"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div
          className="absolute bottom-0 left-0 h-[3px] bg-brutalist-yellow border-t border-foreground transition-all duration-100 ease-out"
          style={{
            width: `${scrollProgress}%`,
            boxShadow: "0 -1px 0 var(--foreground)",
          }}
          role="progressbar"
          aria-label="Page scroll progress"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 mobile-backdrop"
            onClick={toggleMenu}
          />

          {/* Menu Panel */}
          <div
            id="mobile-menu"
            className="absolute top-0 right-0 h-full w-80 max-w-[80vw] bg-background border-l-[5px] border-foreground transform transition-all duration-300 ease-in-out mobile-menu-theme-aware"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <div className="flex flex-col h-full pt-20 px-6">
              {/* Mobile Navigation Items */}
              <nav
                className="flex flex-col space-y-6"
                role="menubar"
                aria-orientation="vertical"
              >
                {navigationItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`font-mono font-bold text-lg uppercase tracking-wider transition-all duration-200 hover:text-brutalist-yellow hover:translate-x-2 focus:outline-none focus:ring-3 focus:ring-brutalist-yellow focus:ring-offset-2 ${
                      pathname === item.href
                        ? "text-brutalist-yellow border-l-[5px] border-brutalist-yellow pl-4"
                        : "text-safe-on-white"
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                    role="menuitem"
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Menu Footer */}
              <div className="mt-auto pb-8">
                <div className="border-t-[3px] border-foreground pt-6">
                  <p className="font-mono text-sm uppercase tracking-wider text-safe-on-white opacity-60">
                    Available for Projects
                  </p>
                  <Link
                    href="/contact"
                    className="inline-block mt-3 px-4 py-2 bg-brutalist-yellow text-safe-on-yellow border-[3px] border-foreground font-mono font-bold text-sm uppercase tracking-wider hover:bg-foreground hover:text-brutalist-yellow transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-brutalist-yellow focus:ring-offset-2"
                  >
                    Get Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
