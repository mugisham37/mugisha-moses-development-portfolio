"use client";

import React, { useEffect, useRef, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import BrutalistButton from "../ui/BrutalistButton";

export interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  variant?: "default" | "success" | "warning" | "error" | "info";
  closable?: boolean;
  backdrop?: boolean;
  backdropClosable?: boolean;
  keyboard?: boolean;
  centered?: boolean;
  scrollable?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  footer?: ReactNode;
  loading?: boolean;
  loadingText?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  initialFocus?: React.RefObject<HTMLElement>;
  returnFocus?: React.RefObject<HTMLButtonElement>;
  onOpen?: () => void;
  onClosed?: () => void;
  preventBodyScroll?: boolean;
  zIndex?: number;
}

const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  variant = "default",
  closable = true,
  backdrop = true,
  backdropClosable = true,
  keyboard = true,
  centered = true,
  scrollable = false,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
  footer,
  loading = false,
  loadingText = "Loading...",
  ariaLabel,
  ariaDescribedBy,
  initialFocus,
  returnFocus,
  onOpen,
  onClosed,
  preventBodyScroll = true,
  zIndex = 1000,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Size classes
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "w-full h-full max-w-none max-h-none",
  };

  // Variant styles
  const variantStyles = {
    default: {
      border: "border-black",
      header: "bg-white",
      icon: null,
    },
    success: {
      border: "border-green-600",
      header: "bg-green-50",
      icon: <CheckCircle size={24} className="text-green-600" />,
    },
    warning: {
      border: "border-yellow-600",
      header: "bg-yellow-50",
      icon: <AlertTriangle size={24} className="text-yellow-600" />,
    },
    error: {
      border: "border-red-600",
      header: "bg-red-50",
      icon: <AlertCircle size={24} className="text-red-600" />,
    },
    info: {
      border: "border-blue-600",
      header: "bg-blue-50",
      icon: <Info size={24} className="text-blue-600" />,
    },
  };

  const currentVariant = variantStyles[variant];

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Call onOpen callback
      onOpen?.();

      // Focus the modal or initial focus element
      setTimeout(() => {
        if (initialFocus?.current) {
          initialFocus.current.focus();
        } else if (modalRef.current) {
          const firstFocusable = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement;

          if (firstFocusable) {
            firstFocusable.focus();
          } else {
            modalRef.current.focus();
          }
        }
      }, 100);
    } else if (previousActiveElement.current) {
      // Return focus to the previously focused element
      const elementToFocus =
        returnFocus?.current || previousActiveElement.current;
      if (elementToFocus && document.contains(elementToFocus)) {
        elementToFocus.focus();
      }
      previousActiveElement.current = null;

      // Call onClosed callback
      onClosed?.();
    }
  }, [isOpen, initialFocus, returnFocus, onOpen, onClosed]);

  // Keyboard event handling
  useEffect(() => {
    if (!isOpen || !keyboard) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closable) {
        event.preventDefault();
        onClose();
      }

      // Tab trapping
      if (event.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, keyboard, closable, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (!preventBodyScroll) return;

    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen, preventBodyScroll]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && backdropClosable && closable) {
      onClose();
    }
  };

  // Animation handlers
  const handleAnimationStart = () => setIsAnimating(true);
  const handleAnimationComplete = () => setIsAnimating(false);

  return (
    <AnimatePresence onExitComplete={() => setIsAnimating(false)}>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onAnimationStart={handleAnimationStart}
          onAnimationComplete={handleAnimationComplete}
        >
          {/* Backdrop */}
          {backdrop && (
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleBackdropClick}
            />
          )}

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            className={cn(
              "relative bg-white border-3 shadow-lg",
              currentVariant.border,
              sizeClasses[size],
              centered ? "mx-auto" : "",
              scrollable ? "overflow-auto max-h-[90vh]" : "",
              className
            )}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel || title}
            aria-describedby={ariaDescribedBy}
            tabIndex={-1}
          >
            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
                <div className="text-center">
                  <motion.div
                    className="w-8 h-8 border-3 border-black border-t-transparent rounded-full mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <p className="font-mono font-bold">{loadingText}</p>
                </div>
              </div>
            )}

            {/* Modal Header */}
            {(title || closable || currentVariant.icon) && (
              <div
                className={cn(
                  "flex items-center justify-between p-4 border-b-3 border-black",
                  currentVariant.header,
                  headerClassName
                )}
              >
                <div className="flex items-center gap-3">
                  {currentVariant.icon}
                  {title && (
                    <h2 className="text-xl font-black uppercase tracking-wider font-mono">
                      {title}
                    </h2>
                  )}
                </div>

                {closable && (
                  <BrutalistButton
                    onClick={onClose}
                    variant="secondary"
                    size="sm"
                    className="p-2"
                    aria-label="Close modal"
                  >
                    <X size={16} />
                  </BrutalistButton>
                )}
              </div>
            )}

            {/* Modal Body */}
            <div
              className={cn(
                "p-6",
                scrollable ? "overflow-auto" : "",
                bodyClassName
              )}
            >
              {children}
            </div>

            {/* Modal Footer */}
            {footer && (
              <div
                className={cn(
                  "p-4 border-t-3 border-black bg-gray-50",
                  footerClassName
                )}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Utility components for common modal patterns
export const ConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "warning" | "error" | "info";
  loading?: boolean;
}> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
  loading = false,
}) => {
    const handleConfirm = () => {
      onConfirm();
      onClose();
    };

    return (
      <AccessibleModal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        size="sm"
        variant={variant}
        loading={loading}
        footer={
          <div className="flex items-center justify-end gap-3">
            <BrutalistButton
              onClick={onClose}
              variant="secondary"
              size="md"
              disabled={loading}
            >
              {cancelText}
            </BrutalistButton>
            <BrutalistButton
              onClick={handleConfirm}
              variant={variant === "error" ? "primary" : "primary"}
              size="md"
              disabled={loading}
              className={variant === "error" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {confirmText}
            </BrutalistButton>
          </div>
        }
      >
        <p className="font-mono text-lg">{message}</p>
      </AccessibleModal>
    );
  };

export const AlertModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  variant?: "success" | "warning" | "error" | "info";
  buttonText?: string;
}> = ({
  isOpen,
  onClose,
  title = "Alert",
  message,
  variant = "info",
  buttonText = "OK",
}) => {
    return (
      <AccessibleModal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        size="sm"
        variant={variant}
        footer={
          <div className="flex items-center justify-center">
            <BrutalistButton onClick={onClose} variant="primary" size="md">{buttonText}</BrutalistButton>
          </div>
        }
      >
        <p className="font-mono text-lg text-center">{message}</p>
      </AccessibleModal>
    );
  };

export default AccessibleModal;
