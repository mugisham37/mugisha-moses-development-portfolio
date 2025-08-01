"use client";

import { useEffect, useRef, ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { trapFocus } from "@/lib/accessibility";
import { useAccessibility } from "@/components/providers/AccessibilityProvider";

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export default function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: AccessibleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const { announceToScreenReader } = useAccessibility();

  // Size classes
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Prevent body scroll
      document.body.style.overflow = "hidden";

      // Set up focus trap
      let cleanup: (() => void) | undefined;
      if (modalRef.current) {
        cleanup = trapFocus(modalRef.current);
      }

      // Announce modal opening
      announceToScreenReader(`${title} dialog opened`, "polite");

      return () => {
        // Restore body scroll
        document.body.style.overflow = "";

        // Clean up focus trap
        if (cleanup) {
          cleanup();
        }

        // Restore focus to previously focused element
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }

        // Announce modal closing
        announceToScreenReader(`${title} dialog closed`, "polite");
      };
    }
  }, [isOpen, title, announceToScreenReader]);

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-75"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          "relative bg-brutalist-light-gray border-5 border-black shadow-lg w-full",
          sizeClasses[size],
          "max-h-[90vh] overflow-y-auto",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-3 border-black">
          <h2
            id="modal-title"
            className="text-xl font-black font-mono uppercase tracking-wider"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className={cn(
              "p-2 hover:bg-yellow-400 transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2",
              "border-2 border-black"
            )}
            aria-label="Close dialog"
            data-close
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div id="modal-description" className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
