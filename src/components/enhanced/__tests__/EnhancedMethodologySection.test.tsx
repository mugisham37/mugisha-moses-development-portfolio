import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EnhancedMethodologySection from "../EnhancedMethodologySection";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock intersection observer
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe("EnhancedMethodologySection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the section header correctly", () => {
    render(<EnhancedMethodologySection />);

    expect(
      screen.getByText("Enhanced Development Methodology")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /interactive deep-dive into my comprehensive development process/i
      )
    ).toBeInTheDocument();
  });

  it("renders all process phases", () => {
    render(<EnhancedMethodologySection />);

    // Check that all 6 phases are rendered
    expect(screen.getByText("DISCOVERY & ANALYSIS")).toBeInTheDocument();
    expect(screen.getByText("STRATEGY & ARCHITECTURE")).toBeInTheDocument();
    expect(
      screen.getByText("DEVELOPMENT & IMPLEMENTATION")
    ).toBeInTheDocument();
    expect(screen.getByText("TESTING & QUALITY ASSURANCE")).toBeInTheDocument();
    expect(screen.getByText("LAUNCH & DEPLOYMENT")).toBeInTheDocument();
    expect(screen.getByText("SUPPORT & MAINTENANCE")).toBeInTheDocument();
  });

  it("displays phase numbers correctly", () => {
    render(<EnhancedMethodologySection />);

    expect(screen.getByText("Phase 01")).toBeInTheDocument();
    expect(screen.getByText("Phase 02")).toBeInTheDocument();
    expect(screen.getByText("Phase 03")).toBeInTheDocument();
    expect(screen.getByText("Phase 04")).toBeInTheDocument();
    expect(screen.getByText("Phase 05")).toBeInTheDocument();
    expect(screen.getByText("Phase 06")).toBeInTheDocument();
  });

  it("shows phase details when a phase is clicked", async () => {
    render(<EnhancedMethodologySection />);

    // Click on the first phase
    const discoveryPhase = screen.getByText("DISCOVERY & ANALYSIS");
    fireEvent.click(discoveryPhase);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Deep dive into your business needs, goals, and technical requirements"
        )
      ).toBeInTheDocument();
      expect(screen.getByText("1-2 WEEKS")).toBeInTheDocument();
    });
  });

  it("renders all tab options when a phase is selected", async () => {
    render(<EnhancedMethodologySection />);

    // Click on the first phase
    const discoveryPhase = screen.getByText("DISCOVERY & ANALYSIS");
    fireEvent.click(discoveryPhase);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /overview/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /quality checks/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /communication/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /deliverables/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /risk management/i })
      ).toBeInTheDocument();
    });
  });

  it("switches between tabs correctly", async () => {
    render(<EnhancedMethodologySection />);

    // Click on the first phase
    const discoveryPhase = screen.getByText("DISCOVERY & ANALYSIS");
    fireEvent.click(discoveryPhase);

    await waitFor(() => {
      // Should show overview by default
      expect(screen.getByText("Phase Activities")).toBeInTheDocument();
    });

    // Click on Quality Checks tab
    const qualityTab = screen.getByRole("button", { name: /quality checks/i });
    fireEvent.click(qualityTab);

    await waitFor(() => {
      expect(
        screen.getByText("Quality Assurance Checklist")
      ).toBeInTheDocument();
    });

    // Click on Communication tab
    const communicationTab = screen.getByRole("button", {
      name: /communication/i,
    });
    fireEvent.click(communicationTab);

    await waitFor(() => {
      expect(screen.getByText("Communication Standards")).toBeInTheDocument();
    });
  });

  it("displays quality checks with correct status indicators", async () => {
    render(<EnhancedMethodologySection />);

    // Click on the first phase
    const discoveryPhase = screen.getByText("DISCOVERY & ANALYSIS");
    fireEvent.click(discoveryPhase);

    // Click on Quality Checks tab
    const qualityTab = screen.getByText("Quality Checks");
    fireEvent.click(qualityTab);

    await waitFor(() => {
      expect(screen.getByText("Requirements Completeness")).toBeInTheDocument();
      expect(screen.getByText("Stakeholder Alignment")).toBeInTheDocument();
      expect(screen.getByText("Technical Feasibility")).toBeInTheDocument();

      // Check for critical badges
      const criticalBadges = screen.getAllByText("Critical");
      expect(criticalBadges.length).toBeGreaterThan(0);
    });
  });

  it("displays communication milestones with frequency and method", async () => {
    render(<EnhancedMethodologySection />);

    // Click on the first phase
    const discoveryPhase = screen.getByText("DISCOVERY & ANALYSIS");
    fireEvent.click(discoveryPhase);

    // Click on Communication tab
    const communicationTab = screen.getByRole("button", {
      name: /communication/i,
    });
    fireEvent.click(communicationTab);

    await waitFor(() => {
      expect(screen.getByText("Project Kickoff Meeting")).toBeInTheDocument();
      expect(
        screen.getByText("Discovery Progress Updates")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Requirements Review Session")
      ).toBeInTheDocument();

      // Check for frequency and method badges
      expect(screen.getByText("Once")).toBeInTheDocument();
      expect(screen.getByText("Every 2 days")).toBeInTheDocument();
      expect(screen.getByText("Video Call")).toBeInTheDocument();
      expect(screen.getByText("Email + Slack")).toBeInTheDocument();
    });
  });

  it("displays deliverables in a grid layout", async () => {
    render(<EnhancedMethodologySection />);

    // Click on the first phase
    const discoveryPhase = screen.getByText("DISCOVERY & ANALYSIS");
    fireEvent.click(discoveryPhase);

    // Click on Deliverables tab
    const deliverablesTab = screen.getByText("Deliverables");
    fireEvent.click(deliverablesTab);

    await waitFor(() => {
      expect(screen.getByText("Phase Deliverables")).toBeInTheDocument();
      expect(
        screen.getByText("Project Requirements Document (PRD)")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Technical Specification Document")
      ).toBeInTheDocument();
      expect(
        screen.getByText("User Personas and Journey Maps")
      ).toBeInTheDocument();
    });
  });

  it("displays risk management information", async () => {
    render(<EnhancedMethodologySection />);

    // Click on the first phase
    const discoveryPhase = screen.getByText("DISCOVERY & ANALYSIS");
    fireEvent.click(discoveryPhase);

    // Click on Risk Management tab
    const riskTab = screen.getByRole("button", { name: /risk management/i });
    fireEvent.click(riskTab);

    await waitFor(() => {
      expect(screen.getAllByText("Risk Management")).toHaveLength(3); // Tab button, heading, and project management section
      expect(
        screen.getByText("Incomplete or changing requirements")
      ).toBeInTheDocument();
      expect(screen.getByText("Stakeholder misalignment")).toBeInTheDocument();
      expect(
        screen.getByText("Technical complexity underestimation")
      ).toBeInTheDocument();
    });
  });

  it("closes phase details when close button is clicked", async () => {
    render(<EnhancedMethodologySection />);

    // Click on the first phase
    const discoveryPhase = screen.getByText("DISCOVERY & ANALYSIS");
    fireEvent.click(discoveryPhase);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Deep dive into your business needs, goals, and technical requirements"
        )
      ).toBeInTheDocument();
    });

    // Click the close button
    const closeButton = screen.getByText("×");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Deep dive into your business needs, goals, and technical requirements"
        )
      ).not.toBeInTheDocument();
    });
  });

  it("toggles phase details when same phase is clicked twice", async () => {
    render(<EnhancedMethodologySection />);

    // Click on the first phase
    const discoveryPhase = screen.getByText("DISCOVERY & ANALYSIS");
    fireEvent.click(discoveryPhase);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Deep dive into your business needs, goals, and technical requirements"
        )
      ).toBeInTheDocument();
    });

    // Click the same phase again
    fireEvent.click(discoveryPhase);

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Deep dive into your business needs, goals, and technical requirements"
        )
      ).not.toBeInTheDocument();
    });
  });

  it("applies correct styling classes", () => {
    render(<EnhancedMethodologySection className="custom-class" />);

    const section = document.querySelector("section");
    expect(section).toHaveClass("custom-class");
  });

  it("displays tools and technologies in overview tab", async () => {
    render(<EnhancedMethodologySection />);

    // Click on the first phase
    const discoveryPhase = screen.getByText("DISCOVERY & ANALYSIS");
    fireEvent.click(discoveryPhase);

    await waitFor(() => {
      expect(screen.getByText("Tools & Technologies")).toBeInTheDocument();
      expect(screen.getByText("Notion")).toBeInTheDocument();
      expect(screen.getByText("Figma")).toBeInTheDocument();
      expect(screen.getByText("Miro")).toBeInTheDocument();
    });
  });

  it("handles phase interaction correctly", async () => {
    render(<EnhancedMethodologySection />);

    const discoveryPhase = screen.getByText("DISCOVERY & ANALYSIS");

    // Test click interaction
    fireEvent.click(discoveryPhase);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Deep dive into your business needs, goals, and technical requirements"
        )
      ).toBeInTheDocument();
    });
  });

  it("displays different phases with unique content", async () => {
    render(<EnhancedMethodologySection />);

    // Test different phases have different content
    const strategyPhase = screen.getByText("STRATEGY & ARCHITECTURE");
    fireEvent.click(strategyPhase);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Creating the technical roadmap and system architecture"
        )
      ).toBeInTheDocument();
    });

    // Click on Quality Checks tab to see the Architecture Review
    const qualityTab = screen.getByText("Quality Checks");
    fireEvent.click(qualityTab);

    await waitFor(() => {
      expect(screen.getByText("Architecture Review")).toBeInTheDocument();
    });

    // Switch to development phase
    const developmentPhase = screen.getByText("DEVELOPMENT & IMPLEMENTATION");
    fireEvent.click(developmentPhase);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Building your solution with precision, testing, and continuous integration"
        )
      ).toBeInTheDocument();
    });

    // Click on Quality Checks tab to see Code Coverage
    const qualityTabDev = screen.getByText("Quality Checks");
    fireEvent.click(qualityTabDev);

    await waitFor(() => {
      expect(screen.getByText("Code Coverage")).toBeInTheDocument();
    });
  });

  it("maintains accessibility standards", () => {
    render(<EnhancedMethodologySection />);

    // Check for proper heading structure
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2); // Interactive Process Flow and Project Management Approach

    // Check for proper button roles
    const phaseButtons = screen.getAllByRole("button");
    expect(phaseButtons.length).toBeGreaterThan(0);

    // Each phase button should be focusable (buttons are focusable by default)
    phaseButtons.forEach((button) => {
      expect(button.tagName).toBe("BUTTON");
    });
  });
});
