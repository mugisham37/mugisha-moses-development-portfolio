"use client";

import { useState } from "react";
import { Settings, Type, Eye, Volume2, X } from "lucide-react";
import { useAccessibility } from "@/components/providers/AccessibilityProvider";
import { cn } from "@/lib/utils";

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { fontSize, setFontSize, announceToScreenReader } = useAccessibility();

  const handleFontSizeChange = (size: "normal" | "large" | "extra-large") => {
    setFontSize(size);
    announceToScreenReader(`Font size changed to ${size}`);
  };

  const handleToggleHighContrast = () => {
    const root = document.documentElement;
    const hasHighContrast = root.classList.contains("high-contrast");

    if (hasHighContrast) {
      root.classList.remove("high-contrast");
      announceToScreenReader("High contrast mode disabled");
    } else {
      root.classList.add("high-contrast");
      announceToScreenReader("High contrast mode enabled");
    }
  };

  const handleToggleReducedMotion = () => {
    const root = document.documentElement;
    const hasReducedMotion = root.classList.contains("reduce-motion");

    if (hasReducedMotion) {
      root.classList.remove("reduce-motion");
      announceToScreenReader("Animations enabled");
    } else {
      root.classList.add("reduce-motion");
      announceToScreenReader("Animations reduced");
    }
  };

  return (
    <>
      {/* Accessibility Toolbar Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed top-4 right-4 z-50 p-3 bg-black text-yellow-400 border-2 border-yellow-400",
          "hover:bg-yellow-400 hover:text-black transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2",
          "font-mono font-bold text-sm"
        )}
        aria-label={
          isOpen ? "Close accessibility toolbar" : "Open accessibility toolbar"
        }
        aria-expanded={isOpen}
        aria-controls="accessibility-toolbar"
      >
        {isOpen ? <X size={20} /> : <Settings size={20} />}
      </button>

      {/* Accessibility Toolbar */}
      {isOpen && (
        <div
          id="accessibility-toolbar"
          className={cn(
            "fixed top-16 right-4 z-40 bg-brutalist-light-gray border-4 border-black p-6 shadow-lg",
            "w-80 max-w-[calc(100vw-2rem)]"
          )}
          role="dialog"
          aria-label="Accessibility Settings"
        >
          <h2 className="text-lg font-black font-mono uppercase tracking-wider mb-4 border-b-2 border-black pb-2">
            Accessibility Settings
          </h2>

          {/* Font Size Controls */}
          <div className="mb-6">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider mb-3 flex items-center">
              <Type size={16} className="mr-2" />
              Font Size
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {(["normal", "large", "extra-large"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => handleFontSizeChange(size)}
                  className={cn(
                    "p-2 border-2 border-black font-mono text-xs font-bold uppercase",
                    "hover:bg-yellow-400 transition-colors duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2",
                    fontSize === size
                      ? "bg-yellow-400"
                      : "bg-brutalist-light-gray"
                  )}
                  aria-pressed={fontSize === size}
                >
                  {size === "normal" ? "A" : size === "large" ? "A+" : "A++"}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast Toggle */}
          <div className="mb-6">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider mb-3 flex items-center">
              <Eye size={16} className="mr-2" />
              Visual
            </h3>
            <button
              onClick={handleToggleHighContrast}
              className={cn(
                "w-full p-3 border-2 border-black font-mono text-sm font-bold uppercase",
                "hover:bg-yellow-400 transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2",
                "bg-brutalist-light-gray"
              )}
            >
              Toggle High Contrast
            </button>
          </div>

          {/* Motion Controls */}
          <div className="mb-6">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider mb-3 flex items-center">
              <Volume2 size={16} className="mr-2" />
              Motion
            </h3>
            <button
              onClick={handleToggleReducedMotion}
              className={cn(
                "w-full p-3 border-2 border-black font-mono text-sm font-bold uppercase",
                "hover:bg-yellow-400 transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2",
                "bg-brutalist-light-gray"
              )}
            >
              Toggle Reduced Motion
            </button>
          </div>

          {/* Keyboard Navigation Help */}
          <div className="border-t-2 border-black pt-4">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider mb-2">
              Keyboard Navigation
            </h3>
            <ul className="text-xs font-mono space-y-1 text-gray-700">
              <li>
                <kbd className="bg-gray-200 px-1 rounded">Tab</kbd> - Navigate
                forward
              </li>
              <li>
                <kbd className="bg-gray-200 px-1 rounded">Shift+Tab</kbd> -
                Navigate backward
              </li>
              <li>
                <kbd className="bg-gray-200 px-1 rounded">Enter/Space</kbd> -
                Activate
              </li>
              <li>
                <kbd className="bg-gray-200 px-1 rounded">Esc</kbd> - Close
                dialogs
              </li>
              <li>
                <kbd className="bg-gray-200 px-1 rounded">Arrow keys</kbd> -
                Navigate menus
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
