import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { EnhancedAppProvider } from "@/contexts/EnhancedAppContext";
import AccessibilityControlCenter from "../AccessibilityControlCenter";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { beforeEach } from "node:test";
import { describe } from "node:test";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: unknown) => <div {...props}>{children}</div>,
  },
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(<EnhancedAppProvider>{component}</EnhancedAppProvider>);
};

describe("AccessibilityControlCenter", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Reset document styles
    document.documentElement.style.removeProperty("--accessibility-font-size");
    document.documentElement.style.removeProperty(
      "--accessibility-font-family"
    );
    document.documentElement.style.removeProperty("--accessibility-contrast");
    document.documentElement.classList.remove(
      "enhanced-focus",
      "screen-reader-optimized"
    );
  });

  it("renders all accessibility controls", () => {
    renderWithProvider(<AccessibilityControlCenter />);

    expect(screen.getByText("Font Size")).toBeInTheDocument();
    expect(screen.getByText("Font Family")).toBeInTheDocument();
    expect(screen.getByText("Contrast Ratio")).toBeInTheDocument();
    expect(screen.getByText("Focus Indicators")).toBeInTheDocument();
    expect(screen.getByText("Screen Reader Optimization")).toBeInTheDocument();
    expect(
      screen.getByText("Enhanced Keyboard Navigation")
    ).toBeInTheDocument();
    expect(screen.getByText("Audio Descriptions")).toBeInTheDocument();
    expect(screen.getByText("Captions")).toBeInTheDocument();
  });

  it("shows live preview notice", () => {
    renderWithProvider(<AccessibilityControlCenter />);

    expect(screen.getByText("Live Preview Active")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Changes are applied immediately for preview. Save to make them permanent."
      )
    ).toBeInTheDocument();
  });

  it("allows font size selection", async () => {
    const user = userEvent.setup();
    renderWithProvider(<AccessibilityControlCenter />);

    // Find and click the large font size option
    const largeOption = screen.getByLabelText(/Large.*Easier to read text/);
    await user.click(largeOption);

    // Check if the option is selected
    expect(largeOption).toBeChecked();

    // Check if CSS variable is applied
    expect(
      document.documentElement.style.getPropertyValue(
        "--accessibility-font-size"
      )
    ).toBe("18px");
  });

  it("allows font family selection", async () => {
    const user = userEvent.setup();
    renderWithProvider(<AccessibilityControlCenter />);

    // Find and click the dyslexia-friendly font option
    const dyslexiaOption = screen.getByLabelText(
      /Dyslexia Friendly.*OpenDyslexic font/
    );
    await user.click(dyslexiaOption);

    // Check if the option is selected
    expect(dyslexiaOption).toBeChecked();

    // Check if CSS variable is applied
    expect(
      document.documentElement.style.getPropertyValue(
        "--accessibility-font-family"
      )
    ).toContain("OpenDyslexic");
  });

  it("allows contrast ratio selection", async () => {
    const user = userEvent.setup();
    renderWithProvider(<AccessibilityControlCenter />);

    // Find and click the high contrast option
    const highContrastOption = screen.getByLabelText(/High.*Enhanced contrast/);
    await user.click(highContrastOption);

    // Check if the option is selected
    expect(highContrastOption).toBeChecked();

    // Check if CSS variable is applied
    expect(
      document.documentElement.style.getPropertyValue(
        "--accessibility-contrast"
      )
    ).toBe("1.2");
  });

  it("toggles focus indicators", async () => {
    const user = userEvent.setup();
    renderWithProvider(<AccessibilityControlCenter />);

    // Find the focus indicators toggle
    const focusToggle = screen.getByRole("checkbox", {
      name: /Enhanced visual focus indicators/,
    });

    // Initially should be enabled (default)
    expect(focusToggle).toBeChecked();
    expect(document.documentElement.classList.contains("enhanced-focus")).toBe(
      true
    );

    // Toggle off
    await user.click(focusToggle);
    expect(focusToggle).not.toBeChecked();
    expect(document.documentElement.classList.contains("enhanced-focus")).toBe(
      false
    );

    // Toggle back on
    await user.click(focusToggle);
    expect(focusToggle).toBeChecked();
    expect(document.documentElement.classList.contains("enhanced-focus")).toBe(
      true
    );
  });

  it("toggles screen reader optimization", async () => {
    const user = userEvent.setup();
    renderWithProvider(<AccessibilityControlCenter />);

    // Find the screen reader optimization toggle
    const screenReaderToggle = screen.getByRole("checkbox", {
      name: /Optimize content structure/,
    });

    // Initially should be disabled (default)
    expect(screenReaderToggle).not.toBeChecked();
    expect(
      document.documentElement.classList.contains("screen-reader-optimized")
    ).toBe(false);

    // Toggle on
    await user.click(screenReaderToggle);
    expect(screenReaderToggle).toBeChecked();
    expect(
      document.documentElement.classList.contains("screen-reader-optimized")
    ).toBe(true);
  });

  it("shows save button when changes are made", async () => {
    const user = userEvent.setup();
    renderWithProvider(<AccessibilityControlCenter />);

    // Initially save button should be disabled
    const saveButton = screen.getByRole("button", { name: /Save Changes/ });
    expect(saveButton).toBeDisabled();

    // Make a change
    const largeOption = screen.getByLabelText(/Large.*Easier to read text/);
    await user.click(largeOption);

    // Save button should now be enabled
    expect(saveButton).not.toBeDisabled();
  });

  it("saves settings when save button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProvider(<AccessibilityControlCenter />);

    // Make changes
    const largeOption = screen.getByLabelText(/Large.*Easier to read text/);
    await user.click(largeOption);

    const highContrastOption = screen.getByLabelText(/High.*Enhanced contrast/);
    await user.click(highContrastOption);

    // Click save
    const saveButton = screen.getByRole("button", { name: /Save Changes/ });
    await user.click(saveButton);

    // Check for saving state
    await waitFor(() => {
      expect(screen.getByText("Saving...")).toBeInTheDocument();
    });

    // Check for saved state
    await waitFor(() => {
      expect(screen.getByText("Saved!")).toBeInTheDocument();
    });
  });

  it("resets to defaults when reset button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProvider(<AccessibilityControlCenter />);

    // Make changes
    const largeOption = screen.getByLabelText(/Large.*Easier to read text/);
    await user.click(largeOption);

    const highContrastOption = screen.getByLabelText(/High.*Enhanced contrast/);
    await user.click(highContrastOption);

    // Click reset
    const resetButton = screen.getByRole("button", {
      name: /Reset to Defaults/,
    });
    await user.click(resetButton);

    // Check if settings are reset
    const mediumOption = screen.getByLabelText(
      /Medium.*Standard readable size/
    );
    expect(mediumOption).toBeChecked();

    const normalContrastOption = screen.getByLabelText(
      /Normal.*Standard contrast/
    );
    expect(normalContrastOption).toBeChecked();
  });

  it("displays accessibility testing information", () => {
    renderWithProvider(<AccessibilityControlCenter />);

    expect(screen.getByText("Accessibility Testing")).toBeInTheDocument();
    expect(screen.getByText("Current Settings Impact:")).toBeInTheDocument();
    expect(screen.getByText("Keyboard Shortcuts:")).toBeInTheDocument();

    // Check for keyboard shortcuts
    expect(screen.getByText("• Tab: Navigate forward")).toBeInTheDocument();
    expect(
      screen.getByText("• Shift+Tab: Navigate backward")
    ).toBeInTheDocument();
    expect(
      screen.getByText("• Enter/Space: Activate controls")
    ).toBeInTheDocument();
    expect(screen.getByText("• Esc: Close modals/menus")).toBeInTheDocument();
  });

  it("applies real-time preview changes", async () => {
    const user = userEvent.setup();
    renderWithProvider(<AccessibilityControlCenter />);

    // Change font size
    const largeOption = screen.getByLabelText(/Large.*Easier to read text/);
    await user.click(largeOption);

    // Check if CSS variable is immediately applied
    expect(
      document.documentElement.style.getPropertyValue(
        "--accessibility-font-size"
      )
    ).toBe("18px");

    // Change contrast
    const highContrastOption = screen.getByLabelText(/High.*Enhanced contrast/);
    await user.click(highContrastOption);

    // Check if CSS variable is immediately applied
    expect(
      document.documentElement.style.getPropertyValue(
        "--accessibility-contrast"
      )
    ).toBe("1.2");
  });

  it("maintains accessibility compliance", () => {
    renderWithProvider(<AccessibilityControlCenter />);

    // Check for proper ARIA labels and roles
    const fontSizeSection = screen.getByText("Font Size").closest("div");
    expect(fontSizeSection).toBeInTheDocument();

    // Check for proper form controls
    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons.length).toBeGreaterThan(0);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThan(0);

    // Check for proper button roles
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
