import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Smooth scroll to a section by ID
 * @param sectionId - The ID of the section to scroll to
 * @param offset - Optional offset from the top (default: 80px for fixed header)
 */
export function scrollToSection(sectionId: string, offset: number = 80) {
  const element = document.getElementById(sectionId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}

/**
 * Get the current active section based on scroll position
 * @param sectionIds - Array of section IDs to check
 * @param offset - Offset for determining active section (default: 100px)
 * @returns The ID of the currently active section
 */
export function getActiveSection(
  sectionIds: string[],
  offset: number = 100
): string | null {
  const scrollPosition = window.scrollY + offset;

  for (let i = sectionIds.length - 1; i >= 0; i--) {
    const element = document.getElementById(sectionIds[i]);
    if (element && element.offsetTop <= scrollPosition) {
      return sectionIds[i];
    }
  }

  return sectionIds[0] || null;
}

/**
 * Debounce function for performance optimization
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
