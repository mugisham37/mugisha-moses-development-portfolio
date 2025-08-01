import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@/test/test-utils";
import { EnhancedButton } from "../EnhancedButton";

describe("EnhancedButton", () => {
  it("renders with default props", () => {
    render(<EnhancedButton>Click me</EnhancedButton>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-black", "text-white");
  });

  it("applies different variants correctly", () => {
    const { rerender } = render(
      <EnhancedButton variant="secondary">Secondary</EnhancedButton>
    );

    let button = screen.getByRole("button");
    expect(button).toHaveClass("bg-white", "text-black");

    rerender(<EnhancedButton variant="outline">Outline</EnhancedButton>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("bg-transparent", "text-black");
  });

  it("applies different sizes correctly", () => {
    const { rerender } = render(
      <EnhancedButton size="sm">Small</EnhancedButton>
    );

    let button = screen.getByRole("button");
    expect(button).toHaveClass("px-3", "py-1.5", "text-sm");

    rerender(<EnhancedButton size="lg">Large</EnhancedButton>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("px-6", "py-3", "text-lg");
  });

  it("shows loading state correctly", () => {
    render(<EnhancedButton loading>Loading</EnhancedButton>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("opacity-50", "cursor-not-allowed");

    // Check for loading spinner
    const spinner = button.querySelector("svg");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<EnhancedButton onClick={handleClick}>Click me</EnhancedButton>);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not trigger click when disabled", () => {
    const handleClick = vi.fn();
    render(
      <EnhancedButton disabled onClick={handleClick}>
        Disabled
      </EnhancedButton>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders with icons", () => {
    const leftIcon = <span data-testid="left-icon">←</span>;
    const rightIcon = <span data-testid="right-icon">→</span>;

    render(
      <EnhancedButton leftIcon={leftIcon} rightIcon={rightIcon}>
        With Icons
      </EnhancedButton>
    );

    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("applies fullWidth correctly", () => {
    render(<EnhancedButton fullWidth>Full Width</EnhancedButton>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("w-full");
  });

  it("applies shadow correctly", () => {
    render(<EnhancedButton shadow>Shadow</EnhancedButton>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<EnhancedButton ref={ref}>Ref Test</EnhancedButton>);

    expect(ref).toHaveBeenCalled();
  });

  it("has proper accessibility attributes", () => {
    render(<EnhancedButton>Accessible Button</EnhancedButton>);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("focus:outline-none", "focus:ring-2");
  });
});
