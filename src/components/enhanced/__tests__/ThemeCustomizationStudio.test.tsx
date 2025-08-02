import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EnhancedAppProvider } from "@/contexts/EnhancedAppContext";
import ThemeCustomizationStudio from "../ThemeCustomizationStudio";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(<EnhancedAppProvider>{component}</EnhancedAppProvider>);
};

describe("ThemeCustomizationStudio", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Mock CSS custom property support
    Object.defineProperty(document.documentElement.style, "setProperty", {
      value: vi.fn(),
      writable: true,
    });

    Object.defineProperty(document.documentElement.style, "removeProperty", {
      value: vi.fn(),
      writable: true,
    });
  });

  it("renders theme customization studio with all controls", () => {
    renderWithProvider(<ThemeCustomizationStudio />);

    expect(screen.getByText("Live Preview Active")).toBeInTheDocument();
    expect(screen.getByText("Color Scheme")).toBeInTheDocument();
    expect(screen.getByText("Primary Color")).toBeInTheDocument();
    expect(screen.getByText("Accent Color")).toBeInTheDocument();
    expect(screen.getByText("Layout Density")).toBeInTheDocument();
    expect(screen.getByText("Animations")).toBeInTheDocument();
    expect(screen.getByText("Reduced Motion")).toBeInTheDocument();
    expect(screen.getByText("Custom CSS")).toBeInTheDocument();
  });

  it("displays color scheme options", () => {
    renderWithProvider(<ThemeCustomizationStudio />);

    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(screen.getByText("Auto")).toBeInTheDocument();
    expect(screen.getByText("High Contrast")).toBeInTheDocument();
  });

  it("displays layout density options", () => {
    renderWithProvider(<ThemeCustomizationStudio />);

    expect(screen.getByText("Compact")).toBeInTheDocument();
    expect(screen.getByText("Comfortable")).toBeInTheDocument();
    expect(screen.getByText("Spacious")).toBeInTheDocument();
  });

  it("shows color preset options", () => {
    renderWithProvider(<ThemeCustomizationStudio />);

    expect(screen.getByText("Classic")).toBeInTheDocument();
    expect(screen.getByText("Ocean")).toBeInTheDocument();
    expect(screen.getByText("Forest")).toBeInTheDocument();
    expect(screen.getByText("Sunset")).toBeInTheDocument();
    expect(screen.getByText("Purple")).toBeInTheDocument();
    expect(screen.getByText("Monochrome")).toBeInTheDocument();
  });

  it("handles color scheme selection", async () => {
    renderWithProvider(<ThemeCustomizationStudio />);

    const darkOption = screen.getByLabelText(/Dark/);
    fireEvent.click(darkOption);

    await waitFor(() => {
      expect(darkOption).toBeChecked();
    });
  });

  it("handles toggle controls", async () => {
    renderWithProvider(<ThemeCustomizationStudio />);

    const animationsToggle = screen.getAllByRole("checkbox")[0]; // Get first checkbox
    const initialState = animationsToggle.checked;

    fireEvent.click(animationsToggle);

    await waitFor(() => {
      expect(animationsToggle.checked).toBe(!initialState);
    });
  });

  it("shows performance impact indicators", () => {
    renderWithProvider(<ThemeCustomizationStudio />);

    expect(screen.getAllByText("low impact")).toHaveLength(2); // Layout density and reduced motion
    expect(screen.getByText("medium impact")).toBeInTheDocument();
    expect(screen.getByText("high impact")).toBeInTheDocument();
  });

  it("displays accessibility notes", () => {
    renderWithProvider(<ThemeCustomizationStudio />);

    expect(screen.getAllByText("Accessibility Note:")).toHaveLength(5); // Multiple accessibility notes
    expect(screen.getByText(/Ensure sufficient contrast/)).toBeInTheDocument();
  });

  it("shows theme preview panel", () => {
    renderWithProvider(<ThemeCustomizationStudio />);

    expect(screen.getByText("Theme Preview")).toBeInTheDocument();
    expect(screen.getByText("Sample Content")).toBeInTheDocument();
    expect(screen.getByText("Sample Button")).toBeInTheDocument();
  });

  it("displays current settings summary", () => {
    renderWithProvider(<ThemeCustomizationStudio />);

    expect(screen.getByText("Current Settings:")).toBeInTheDocument();
    expect(screen.getByText(/Color Scheme:/)).toBeInTheDocument();
    expect(screen.getByText(/Primary Color:/)).toBeInTheDocument();
    expect(screen.getByText(/Accent Color:/)).toBeInTheDocument();
  });

  it("shows save and reset buttons", () => {
    renderWithProvider(<ThemeCustomizationStudio />);

    expect(screen.getByText("Save Changes")).toBeInTheDocument();
    expect(screen.getByText("Reset to Defaults")).toBeInTheDocument();
  });

  it("displays performance and accessibility info", () => {
    renderWithProvider(<ThemeCustomizationStudio />);

    expect(
      screen.getByText("Performance & Accessibility Impact")
    ).toBeInTheDocument();
    expect(screen.getByText("Performance Notes:")).toBeInTheDocument();
    expect(screen.getByText("Accessibility Features:")).toBeInTheDocument();
  });

  it("handles custom CSS input", async () => {
    renderWithProvider(<ThemeCustomizationStudio />);

    const customCSSTextarea =
      screen.getByPlaceholderText(/Add your custom CSS/);
    const testCSS = ".test { color: red; }";

    fireEvent.change(customCSSTextarea, { target: { value: testCSS } });

    await waitFor(() => {
      expect(customCSSTextarea.value).toBe(testCSS);
    });
  });

  it("validates custom CSS for balanced braces", async () => {
    renderWithProvider(<ThemeCustomizationStudio />);

    const customCSSTextarea =
      screen.getByPlaceholderText(/Add your custom CSS/);
    const invalidCSS = ".test { color: red;"; // Missing closing brace

    fireEvent.change(customCSSTextarea, { target: { value: invalidCSS } });

    await waitFor(() => {
      expect(
        screen.getByText(/Invalid CSS: Unbalanced braces/)
      ).toBeInTheDocument();
    });
  });

  it("applies color preset when clicked", async () => {
    renderWithProvider(<ThemeCustomizationStudio />);

    const oceanPreset = screen.getByText("Ocean");
    fireEvent.click(oceanPreset);

    // The preset should update the color inputs
    await waitFor(() => {
      const primaryColorInputs = screen.getAllByDisplayValue("#1e40af");
      const accentColorInputs = screen.getAllByDisplayValue("#06b6d4");
      expect(primaryColorInputs).toHaveLength(2); // Color picker and text input
      expect(accentColorInputs).toHaveLength(2); // Color picker and text input
    });
  });

  it("disables save button when there are no changes", () => {
    renderWithProvider(<ThemeCustomizationStudio />);

    const saveButton = screen.getByText("Save Changes");
    expect(saveButton).toBeDisabled();
  });

  it("enables save button when changes are made", async () => {
    renderWithProvider(<ThemeCustomizationStudio />);

    const darkOption = screen.getByLabelText(/Dark/);
    fireEvent.click(darkOption);

    await waitFor(() => {
      const saveButton = screen.getByText("Save Changes");
      expect(saveButton).not.toBeDisabled();
    });
  });

  it("disables save button when CSS validation fails", async () => {
    renderWithProvider(<ThemeCustomizationStudio />);

    const customCSSTextarea =
      screen.getByPlaceholderText(/Add your custom CSS/);
    const invalidCSS = ".test { color: red;"; // Missing closing brace

    fireEvent.change(customCSSTextarea, { target: { value: invalidCSS } });

    await waitFor(() => {
      const saveButton = screen.getByText("Save Changes");
      expect(saveButton).toBeDisabled();
    });
  });
});
