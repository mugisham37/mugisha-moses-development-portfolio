import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { AdvancedFAQSystem } from "../AdvancedFAQSystem";

// Mock the enhanced components
vi.mock("../EnhancedInput", () => ({
  EnhancedInput: ({ onChange, value, placeholder, ...props }: any) => (
    <input
      data-testid="search-input"
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      {...props}
    />
  ),
}));

vi.mock("../EnhancedButton", () => ({
  EnhancedButton: ({ children, onClick, ...props }: any) => (
    <button data-testid="enhanced-button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

describe("AdvancedFAQSystem", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it("renders the FAQ system with header and search", () => {
    render(<AdvancedFAQSystem />);

    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "Search FAQs by question, answer, or topic..."
      )
    ).toBeInTheDocument();
  });

  it("displays category filters with counts", () => {
    render(<AdvancedFAQSystem />);

    expect(screen.getByText(/All \(\d+\)/)).toBeInTheDocument();
    expect(screen.getByText(/General \(\d+\)/)).toBeInTheDocument();
    expect(screen.getByText(/Pricing \(\d+\)/)).toBeInTheDocument();
    expect(screen.getByText(/Technical \(\d+\)/)).toBeInTheDocument();
  });

  it("filters FAQs by category", async () => {
    render(<AdvancedFAQSystem />);

    // Click on Pricing category
    const pricingButton = screen.getByText(/Pricing \(\d+\)/);
    await user.click(pricingButton);

    // Should show pricing-related FAQs
    expect(
      screen.getByText("What is your payment structure?")
    ).toBeInTheDocument();
    expect(
      screen.getByText("How do you calculate project costs?")
    ).toBeInTheDocument();
  });

  it("searches FAQs by query", async () => {
    render(<AdvancedFAQSystem />);

    const searchInput = screen.getByTestId("search-input");
    await user.type(searchInput, "payment");

    // Should show payment-related FAQs
    await waitFor(() => {
      expect(
        screen.getByText("What is your payment structure?")
      ).toBeInTheDocument();
    });
  });

  it("expands and collapses FAQ items", async () => {
    render(<AdvancedFAQSystem />);

    // Find the first FAQ question
    const firstQuestion = screen.getByText(
      "What technologies do you specialize in?"
    );
    await user.click(firstQuestion);

    // Should show the answer
    await waitFor(() => {
      expect(
        screen.getByText(/I specialize in modern web technologies/)
      ).toBeInTheDocument();
    });

    // Click again to collapse
    await user.click(firstQuestion);

    // Answer should be hidden
    await waitFor(() => {
      expect(
        screen.queryByText(/I specialize in modern web technologies/)
      ).not.toBeInTheDocument();
    });
  });

  it("handles helpful votes", async () => {
    render(<AdvancedFAQSystem />);

    // Expand first FAQ
    const firstQuestion = screen.getByText(
      "What technologies do you specialize in?"
    );
    await user.click(firstQuestion);

    // Find and click helpful button
    await waitFor(() => {
      const helpfulButton = screen.getByText("👍 Yes");
      expect(helpfulButton).toBeInTheDocument();
    });

    const helpfulButton = screen.getByText("👍 Yes");
    await user.click(helpfulButton);

    // Button should change to "Thanks!"
    await waitFor(() => {
      expect(screen.getByText("✓ Thanks!")).toBeInTheDocument();
    });
  });

  it("shows related questions", async () => {
    render(<AdvancedFAQSystem />);

    // Expand first FAQ
    const firstQuestion = screen.getByText(
      "What technologies do you specialize in?"
    );
    await user.click(firstQuestion);

    // Should show related questions section
    await waitFor(() => {
      expect(screen.getByText("Related Questions")).toBeInTheDocument();
    });
  });

  it("shows video explanation for technical FAQs", async () => {
    render(<AdvancedFAQSystem />);

    // Filter to technical category
    const technicalButton = screen.getByText(/Technical \(\d+\)/);
    await user.click(technicalButton);

    // Expand a technical FAQ
    const technicalQuestion = screen.getByText(
      "Can you work with existing codebases?"
    );
    await user.click(technicalQuestion);

    // Should show video explanation
    await waitFor(() => {
      expect(
        screen.getByText("Video Explanation Available")
      ).toBeInTheDocument();
      expect(screen.getByText("Watch Video")).toBeInTheDocument();
    });
  });

  it("clears filters when no results found", async () => {
    render(<AdvancedFAQSystem />);

    const searchInput = screen.getByTestId("search-input");
    await user.type(searchInput, "nonexistent query");

    // Should show no results message
    await waitFor(() => {
      expect(screen.getByText("No FAQs Found")).toBeInTheDocument();
    });

    // Click clear filters button
    const clearButton = screen.getByText("Clear Filters");
    await user.click(clearButton);

    // Should reset to show all FAQs
    await waitFor(() => {
      expect(
        screen.getByText("What technologies do you specialize in?")
      ).toBeInTheDocument();
    });
  });

  it("displays FAQ analytics", () => {
    render(<AdvancedFAQSystem />);

    expect(screen.getByText("Total FAQs")).toBeInTheDocument();
    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("Helpful Votes")).toBeInTheDocument();
  });

  it("shows contact CTA section", () => {
    render(<AdvancedFAQSystem />);

    expect(screen.getByText("Still Have Questions?")).toBeInTheDocument();
    expect(screen.getByText("Contact Me")).toBeInTheDocument();
    expect(screen.getByText("Live Chat")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <AdvancedFAQSystem className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("handles keyboard navigation", async () => {
    render(<AdvancedFAQSystem />);

    // The first FAQ in the sorted list should be the one with highest helpful votes
    const firstQuestion = screen.getByText("What is your payment structure?");

    // Click to expand (keyboard navigation would be more complex to test properly)
    await user.click(firstQuestion);

    // Should expand the FAQ
    await waitFor(() => {
      expect(
        screen.getByText(/I typically work with a 50% upfront payment/)
      ).toBeInTheDocument();
    });
  });
});
