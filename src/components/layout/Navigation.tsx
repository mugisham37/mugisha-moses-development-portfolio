"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

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
        className={`fixed top-0 left-0 right-0 z-50 bg-white border-b-[5px] border-black ${className}`}
      >
        <div className="brutalist-container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="font-mono font-black text-xl lg:text-2xl uppercase tracking-wider hover:text-brutalist-yellow transition-colors duration-200"
            >
              DEV.PORTFOLIO
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-mono font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:text-brutalist-yellow relative ${
                    pathname === item.href
                      ? "text-brutalist-yellow after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-[3px] after:bg-brutalist-yellow"
                      : "text-black"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 border-[3px] border-black bg-white hover:bg-black hover:text-white transition-all duration-200"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div
          className="absolute bottom-0 left-0 h-[3px] bg-brutalist-yellow transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={toggleMenu}
          />

          {/* Menu Panel */}
          <div className="absolute top-0 right-0 h-full w-80 max-w-[80vw] bg-white border-l-[5px] border-black transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full pt-20 px-6">
              {/* Mobile Navigation Items */}
              <div className="flex flex-col space-y-6">
                {navigationItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`font-mono font-bold text-lg uppercase tracking-wider transition-all duration-200 hover:text-[#ffff00] hover:translate-x-2 ${
                      pathname === item.href
                        ? "text-[#ffff00] border-l-[5px] border-[#ffff00] pl-4"
                        : "text-black"
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Menu Footer */}
              <div className="mt-auto pb-8">
                <div className="border-t-[3px] border-black pt-6">
                  <p className="font-mono text-sm uppercase tracking-wider text-gray-600">
                    Available for Projects
                  </p>
                  <Link
                    href="/contact"
                    className="inline-block mt-3 px-4 py-2 bg-[#ffff00] border-[3px] border-black font-mono font-bold text-sm uppercase tracking-wider hover:bg-black hover:text-[#ffff00] transition-all duration-200"
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
