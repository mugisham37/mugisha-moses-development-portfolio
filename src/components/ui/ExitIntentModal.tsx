"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Calendar, Mail, Phone } from "lucide-react";
import { BrutalistButton } from "@/components/ui";

interface ExitIntentModalProps {
  enabled?: boolean;
  delay?: number;
  showOnce?: boolean;
  onClose?: () => void;
  onConsultationRequest?: (method: "calendar" | "email" | "phone") => void;
}

export default function ExitIntentModal({
  enabled = true,
  delay = 1000,
  showOnce = true,
  onClose,
  onConsultationRequest,
}: ExitIntentModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Check if modal has been shown before (localStorage)
  useEffect(() => {
    if (showOnce) {
      const hasShownBefore = localStorage.getItem("exit-intent-modal-shown");
      if (hasShownBefore) {
        setHasShown(true);
      }
    }
  }, [showOnce]);

  // Handle exit intent detection
  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      // Only trigger if mouse is leaving from the top of the viewport
      if (e.clientY <= 0 && e.relatedTarget === null) {
        if (enabled && !hasShown && !isVisible) {
          setTimeout(() => {
            setIsVisible(true);
            if (showOnce) {
              setHasShown(true);
              localStorage.setItem("exit-intent-modal-shown", "true");
            }
          }, delay);
        }
      }
    },
    [enabled, hasShown, isVisible, delay, showOnce]
  );

  // Track mouse movement for animation effects
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  // Add/remove event listeners
  useEffect(() => {
    if (enabled && !hasShown) {
      document.addEventListener("mouseleave", handleMouseLeave);
      document.addEventListener("mousemove", handleMouseMove);

      return () => {
        document.removeEventListener("mouseleave", handleMouseLeave);
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [enabled, hasShown, handleMouseLeave, handleMouseMove]);

  // Handle modal close
  const handleClose = useCallback(() => {
    setIsVisible(false);
    onClose?.();
  }, [onClose]);

  // Handle consultation request
  const handleConsultationRequest = useCallback(
    (method: "calendar" | "email" | "phone") => {
      onConsultationRequest?.(method);

      // Track conversion (you can integrate with analytics here)
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "exit_intent_conversion", {
          event_category: "engagement",
          event_label: method,
          value: 1,
        });
      }

      handleClose();
    },
    [onConsultationRequest, handleClose]
  );

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }
  }, [isVisible, handleClose]);

  if (!isVisible) return null;

  return (
    <div className="exit-intent-modal-overlay">
      {/* Backdrop */}
      <div
        className="exit-intent-backdrop"
        onClick={handleClose}
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 0, 0.1) 0%, rgba(0, 0, 0, 0.8) 50%)`,
        }}
      />

      {/* Modal Content */}
      <div className="exit-intent-modal">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="exit-intent-close"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Modal Header */}
        <div className="exit-intent-header">
          <h2 className="exit-intent-title">
            Wait! Don&apos;t Leave Empty-Handed
          </h2>
          <div className="exit-intent-accent-line" />
        </div>

        {/* Modal Body */}
        <div className="exit-intent-body">
          <p className="exit-intent-subtitle">
            Get a{" "}
            <span className="text-brutalist-yellow font-bold">
              FREE 30-minute consultation
            </span>{" "}
            to discuss your project
          </p>

          <div className="exit-intent-benefits">
            <div className="exit-intent-benefit">
              <div className="exit-intent-benefit-icon">✓</div>
              <span>Project scope & timeline discussion</span>
            </div>
            <div className="exit-intent-benefit">
              <div className="exit-intent-benefit-icon">✓</div>
              <span>Technology recommendations</span>
            </div>
            <div className="exit-intent-benefit">
              <div className="exit-intent-benefit-icon">✓</div>
              <span>Honest pricing estimate</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="exit-intent-actions">
            <BrutalistButton
              variant="accent"
              size="lg"
              glow
              onClick={() => handleConsultationRequest("calendar")}
              className="exit-intent-cta-primary"
            >
              <Calendar size={20} />
              Book Free Call
            </BrutalistButton>

            <div className="exit-intent-secondary-actions">
              <button
                onClick={() => handleConsultationRequest("email")}
                className="exit-intent-cta-secondary"
              >
                <Mail size={16} />
                Email Me
              </button>
              <button
                onClick={() => handleConsultationRequest("phone")}
                className="exit-intent-cta-secondary"
              >
                <Phone size={16} />
                Call Me
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="exit-intent-trust">
            <p className="exit-intent-trust-text">
              <span className="font-bold">50+ projects delivered</span> •
              <span className="font-bold"> 4.9/5 client rating</span> •
              <span className="font-bold"> Response within 4 hours</span>
            </p>
          </div>
        </div>

        {/* Animated Elements */}
        <div className="exit-intent-decoration">
          <div className="exit-intent-decoration-dot exit-intent-decoration-dot-1" />
          <div className="exit-intent-decoration-dot exit-intent-decoration-dot-2" />
          <div className="exit-intent-decoration-dot exit-intent-decoration-dot-3" />
        </div>
      </div>
    </div>
  );
}

// Hook for easy integration
export function useExitIntentModal(
  options: Omit<ExitIntentModalProps, "enabled"> = {}
) {
  const [isEnabled, setIsEnabled] = useState(true);

  const enable = useCallback(() => setIsEnabled(true), []);
  const disable = useCallback(() => setIsEnabled(false), []);
  const reset = useCallback(() => {
    localStorage.removeItem("exit-intent-modal-shown");
    setIsEnabled(true);
  }, []);

  return {
    ExitIntentModal: (props: Partial<ExitIntentModalProps>) => (
      <ExitIntentModal {...options} {...props} enabled={isEnabled} />
    ),
    enable,
    disable,
    reset,
    isEnabled,
  };
}
