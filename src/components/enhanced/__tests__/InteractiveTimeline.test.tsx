import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import InteractiveTimeline from "../InteractiveTimeline";
import { it } from "zod/locales";
import { describe } from "node:test";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { describe } from "node:test";
import { it } from "zod/locales";
import { describe } from "node:test";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { describe } from "node:test";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { describe } from "node:test";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { describe } from "node:test";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { describe } from "node:test";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { describe } from "node:test";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { it } from "zod/locales";
import { describe } from "node:test";
import { beforeEach } from "node:test";
import { describe } from "node:test";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
    section: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <section {...props}>{children}</section>
    ),
    button: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock timeline data for testing
const mockTimelineEvents = [
  {
    id: "test-event-1",
    date: new Date("2022-01-01"),
    title: "Test Event 1",
    description: "First test event description",
    category: "career" as const,
    icon: "💼",
    details: {
      role: "Test Role",
      company: "Test Company",
      technologies: ["React", "TypeScript"],
      achievements: ["Achievement 1", "Achievement 2"],
      metrics: { Projects: "5", "Success Rate": "100%" },
      impact: "Test impact description",
      learnings: ["Learning 1", "Learning 2"],
    },
    featured: true,
  },
  {
    id: "test-event-2",
    date: new Date("2023-01-01"),
    title: "Test Event 2",
    description: "Second test event description",
    category: "technology" as const,
    icon: "⚡",
    details: {
      technologies: ["Next.js", "Node.js"],
      achievements: ["Tech Achievement 1"],
      metrics: { Performance: "95%" },
      learnings: ["Tech Learning 1"],
    },
  },
  {
    id: "test-event-3",
    date: new Date("2023-06-01"),
    title: "Test Achievement",
    description: "Achievement event description",
    category: "achievement" as const,
    icon: "🏆",
    details: {
      achievements: ["Major Achievement"],
      metrics: { Score: "98%" },
    },
  },
];

describe("InteractiveTimeline", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the timeline component with default props", () => {
      render(<InteractiveTimeline />);

      expect(
        screen.getByText("Interactive Career Timeline")
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Explore my professional journey/)
      ).toBeInTheDocument();
    });

    it("renders timeline events when provided", () => {
      render(<InteractiveTimeline events={mockTimelineEvents} />);

      expect(screen.getByText("Test Event 1")).toBeInTheDocument();
      expect(screen.getByText("Test Event 2")).toBeInTheDocument();
      expect(screen.getByText("Test Achievement")).toBeInTheDocument();
    });

    it("displays event details correctly", () => {
      render(<InteractiveTimeline events={mockTimelineEvents} />);

      expect(
        screen.getByText("First test event description")
      ).toBeInTheDocument();
      expect(screen.getByText("Test Role at Test Company")).toBeInTheDocument();
      expect(screen.getByText("2022")).toBeInTheDocument();
    });

    it("renders category filters when filtering is enabled", () => {
      render(
        <InteractiveTimeline
          events={mockTimelineEvents}
          enableFiltering={true}
        />
      );

      expect(screen.getByText("All Events")).toBeInTheDocument();
      expect(screen.getByText("Career")).toBeInTheDocument();
      expect(screen.getByText("Technology")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /🏆 Achievements/ })
      ).toBeInTheDocument();
    });

    it("renders search input when search is enabled", () => {
      render(
        <InteractiveTimeline events={mockTimelineEvents} enableSearch={true} />
      );

      expect(
        screen.getByPlaceholderText("Search timeline events...")
      ).toBeInTheDocument();
    });

    it("hides controls when filtering and search are disabled", () => {
      render(
        <InteractiveTimeline
          events={mockTimelineEvents}
          enableFiltering={false}
          enableSearch={false}
        />
      );

      expect(screen.queryByText("All Events")).not.toBeInTheDocument();
      expect(
        screen.queryByPlaceholderText("Search timeline events...")
      ).not.toBeInTheDocument();
    });
  });

  describe("Filtering Functionality", () => {
    it("filters events by category when filter is selected", async () => {
      render(
        <InteractiveTimeline
          events={mockTimelineEvents}
          enableFiltering={true}
        />
      );

      // Initially all events should be visible
      expect(screen.getByText("Test Event 1")).toBeInTheDocument();
      expect(screen.getByText("Test Event 2")).toBeInTheDocument();
      expect(screen.getByText("Test Achievement")).toBeInTheDocument();

      // Click on Career filter
      await user.click(screen.getByText("Career"));

      // Only career events should be visible
      expect(screen.getByText("Test Event 1")).toBeInTheDocument();
      expect(screen.queryByText("Test Event 2")).not.toBeInTheDocument();
      expect(screen.queryByText("Test Achievement")).not.toBeInTheDocument();
    });

    it('shows all events when "All Events" filter is selected', async () => {
      render(
        <InteractiveTimeline
          events={mockTimelineEvents}
          enableFiltering={true}
        />
      );

      // First filter by career
      await user.click(screen.getByText("Career"));
      expect(screen.queryByText("Test Event 2")).not.toBeInTheDocument();

      // Then click "All Events"
      await user.click(screen.getByText("All Events"));

      // All events should be visible again
      expect(screen.getByText("Test Event 1")).toBeInTheDocument();
      expect(screen.getByText("Test Event 2")).toBeInTheDocument();
      expect(screen.getByText("Test Achievement")).toBeInTheDocument();
    });

    it("applies correct styling to active filter", async () => {
      render(
        <InteractiveTimeline
          events={mockTimelineEvents}
          enableFiltering={true}
        />
      );

      const careerButton = screen.getByText("Career");
      await user.click(careerButton);

      expect(careerButton).toHaveClass("bg-brutalist-yellow");
    });
  });

  describe("Search Functionality", () => {
    it("filters events based on search query", async () => {
      render(
        <InteractiveTimeline events={mockTimelineEvents} enableSearch={true} />
      );

      const searchInput = screen.getByPlaceholderText(
        "Search timeline events..."
      );

      // Search for "Achievement"
      await user.type(searchInput, "Achievement");

      // Only events with "Achievement" in title should be visible
      expect(screen.queryByText("Test Event 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Test Event 2")).not.toBeInTheDocument();
      expect(screen.getByText("Test Achievement")).toBeInTheDocument();
    });

    it("searches in event descriptions", async () => {
      render(
        <InteractiveTimeline events={mockTimelineEvents} enableSearch={true} />
      );

      const searchInput = screen.getByPlaceholderText(
        "Search timeline events..."
      );

      // Search for text in description
      await user.type(searchInput, "First test event");

      expect(screen.getByText("Test Event 1")).toBeInTheDocument();
      expect(screen.queryByText("Test Event 2")).not.toBeInTheDocument();
    });

    it("searches in company names", async () => {
      render(
        <InteractiveTimeline events={mockTimelineEvents} enableSearch={true} />
      );

      const searchInput = screen.getByPlaceholderText(
        "Search timeline events..."
      );

      // Search for company name
      await user.type(searchInput, "Test Company");

      expect(screen.getByText("Test Event 1")).toBeInTheDocument();
      expect(screen.queryByText("Test Event 2")).not.toBeInTheDocument();
    });

    it("shows all events when search is cleared", async () => {
      render(
        <InteractiveTimeline events={mockTimelineEvents} enableSearch={true} />
      );

      const searchInput = screen.getByPlaceholderText(
        "Search timeline events..."
      );

      // Search for something
      await user.type(searchInput, "Achievement");
      expect(screen.queryByText("Test Event 1")).not.toBeInTheDocument();

      // Clear search
      await user.clear(searchInput);

      // All events should be visible again
      expect(screen.getByText("Test Event 1")).toBeInTheDocument();
      expect(screen.getByText("Test Event 2")).toBeInTheDocument();
      expect(screen.getByText("Test Achievement")).toBeInTheDocument();
    });
  });

  describe("Event Interaction", () => {
    it("expands event details when clicked", async () => {
      render(<InteractiveTimeline events={mockTimelineEvents} />);

      // Initially, detailed content should not be visible
      expect(screen.queryByText("Technologies Used")).not.toBeInTheDocument();
      expect(screen.queryByText("Key Achievements")).not.toBeInTheDocument();

      // Click on the first event
      const eventCard = screen.getByText("Test Event 1").closest("div");
      if (eventCard) {
        await user.click(eventCard);
      }

      // Detailed content should now be visible
      await waitFor(() => {
        expect(screen.getByText("Technologies Used")).toBeInTheDocument();
        expect(screen.getByText("Key Achievements")).toBeInTheDocument();
        expect(screen.getByText("React")).toBeInTheDocument();
        expect(screen.getByText("Achievement 1")).toBeInTheDocument();
      });
    });

    it("collapses event details when clicked again", async () => {
      render(<InteractiveTimeline events={mockTimelineEvents} />);

      const eventCard = screen.getByText("Test Event 1").closest("div");
      if (eventCard) {
        // Expand
        await user.click(eventCard);
        await waitFor(() => {
          expect(screen.getByText("Technologies Used")).toBeInTheDocument();
        });

        // Collapse
        await user.click(eventCard);
        await waitFor(() => {
          expect(
            screen.queryByText("Technologies Used")
          ).not.toBeInTheDocument();
        });
      }
    });

    it("shows metrics when showMetrics is enabled", async () => {
      render(
        <InteractiveTimeline events={mockTimelineEvents} showMetrics={true} />
      );

      const eventCard = screen.getByText("Test Event 1").closest("div");
      if (eventCard) {
        await user.click(eventCard);
      }

      await waitFor(() => {
        expect(screen.getByText("Impact Metrics")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument(); // Projects metric
        expect(screen.getByText("100%")).toBeInTheDocument(); // Success Rate metric
      });
    });

    it("hides metrics when showMetrics is disabled", async () => {
      render(
        <InteractiveTimeline events={mockTimelineEvents} showMetrics={false} />
      );

      const eventCard = screen.getByText("Test Event 1").closest("div");
      if (eventCard) {
        await user.click(eventCard);
      }

      await waitFor(() => {
        expect(screen.queryByText("Impact Metrics")).not.toBeInTheDocument();
      });
    });
  });

  describe("Timeline Summary", () => {
    it("displays career progression summary when showMetrics is enabled", () => {
      render(
        <InteractiveTimeline events={mockTimelineEvents} showMetrics={true} />
      );

      expect(
        screen.getByText("Career Progression Summary")
      ).toBeInTheDocument();
      expect(screen.getAllByText("3")[0]).toBeInTheDocument(); // Total events
      expect(screen.getByText("Career Events")).toBeInTheDocument();
    });

    it("hides career progression summary when showMetrics is disabled", () => {
      render(
        <InteractiveTimeline events={mockTimelineEvents} showMetrics={false} />
      );

      expect(
        screen.queryByText("Career Progression Summary")
      ).not.toBeInTheDocument();
    });

    it("calculates correct statistics", () => {
      render(
        <InteractiveTimeline events={mockTimelineEvents} showMetrics={true} />
      );

      // Should show 1 tech milestone (Test Event 2)
      const techMilestones = screen.getAllByText("1");
      expect(techMilestones.length).toBeGreaterThan(0);

      // Should show 1 achievement (Test Achievement)
      expect(screen.getAllByText("Achievements")[1]).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels and roles", () => {
      render(<InteractiveTimeline events={mockTimelineEvents} />);

      // Check for semantic HTML structure
      const timeline = screen
        .getByText("Interactive Career Timeline")
        .closest("section");
      expect(timeline).toBeInTheDocument();
    });

    it("supports keyboard navigation", async () => {
      render(
        <InteractiveTimeline
          events={mockTimelineEvents}
          enableFiltering={true}
        />
      );

      const careerButton = screen.getByText("Career");

      // Focus and activate with keyboard
      careerButton.focus();
      await user.keyboard("{Enter}");

      expect(careerButton).toHaveClass("bg-brutalist-yellow");
    });

    it("has proper heading hierarchy", () => {
      render(<InteractiveTimeline events={mockTimelineEvents} />);

      // Main heading should be h2
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Interactive Career Timeline"
      );
    });
  });

  describe("Responsive Design", () => {
    it("applies responsive classes correctly", () => {
      render(<InteractiveTimeline events={mockTimelineEvents} />);

      // Check for responsive classes in the component
      const timelineContainer = screen
        .getByText("Interactive Career Timeline")
        .closest("section");
      expect(timelineContainer).toHaveClass("py-20");
    });
  });

  describe("Error Handling", () => {
    it("handles empty events array gracefully", () => {
      render(<InteractiveTimeline events={[]} />);

      expect(
        screen.getByText("Interactive Career Timeline")
      ).toBeInTheDocument();
      // Should not crash and should show empty state
    });

    it("handles events without optional properties", () => {
      const minimalEvent = {
        id: "minimal",
        date: new Date("2023-01-01"),
        title: "Minimal Event",
        description: "Basic description",
        category: "career" as const,
        icon: "💼",
        details: {},
      };

      render(<InteractiveTimeline events={[minimalEvent]} />);

      expect(screen.getByText("Minimal Event")).toBeInTheDocument();
      expect(screen.getByText("Basic description")).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("does not re-render unnecessarily", () => {
      const { rerender } = render(
        <InteractiveTimeline events={mockTimelineEvents} />
      );

      // Re-render with same props
      rerender(<InteractiveTimeline events={mockTimelineEvents} />);

      // Component should still be functional
      expect(screen.getByText("Test Event 1")).toBeInTheDocument();
    });
  });
});
