"use client";

import { useEffect } from "react";

const skipLinks = [
  { href: "#main-content", text: "Skip to main content" },
  { href: "#navigation", text: "Skip to navigation" },
  { href: "#footer", text: "Skip to footer" },
];

export default function SkipLinks() {
  useEffect(() => {
    // Add skip link styles
    const style = document.createElement("style");
    style.textContent = `
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000000;
        color: #ffff00;
        padding: 8px 16px;
        text-decoration: none;
        font-family: monospace;
        font-weight: bold;
        font-size: 14px;
        border: 3px solid #ffff00;
        z-index: 9999;
        transition: top 0.3s;
      }
      
      .skip-link:focus {
        top: 6px;
      }
      
      .skip-link:hover {
        background: #ffff00;
        color: #000000;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  const handleSkipClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const target = document.querySelector(targetId) as HTMLElement;
    if (target) {
      // Make target focusable if it isn't already
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
      }

      target.focus();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // Remove tabindex after focus to restore natural tab order
      setTimeout(() => {
        if (target.getAttribute("tabindex") === "-1") {
          target.removeAttribute("tabindex");
        }
      }, 100);
    }
  };

  return (
    <>
      {skipLinks.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="skip-link"
          onClick={(e) => handleSkipClick(e, link.href)}
        >
          {link.text}
        </a>
      ))}
    </>
  );
}
