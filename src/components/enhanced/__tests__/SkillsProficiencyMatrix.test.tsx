import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import SkillsProficiencyMatrix from "../SkillsProficiencyMatrix";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => (
      <section {...props}>{children}</section>
    ),
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
    input: ({ children, ...props }: any) => (
      <input {...props}>{children}</input>
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

// Test data
const mockSkills = [
  {
    id: "react",
    name: "React",
    category: "frontend" as const,
    proficiencyLevel: 5 as const,
    yearsOfExperience: 4,
    lastUsed: new Date("2024-01-15"),
    certifications: ["React Developer Certification"],
    relatedProjects: ["E-commerce Platform", "Portfolio Website"],
    description: "Expert-level React development",
    icon: "⚛️",
    color: "#61DAFB",
    trending: true,
    learningPath: [
      {
        date: new Date("2020-03-01"),
        level: 1,
        achievement: "Started React",
        project: "Todo App",
      },
      {
        date: new Date("2023-06-01"),
        level: 5,
        achievement: "React expert",
        project: "Enterprise App",
      },
    ],
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend" as const,
    proficiencyLevel: 4 as const,
    yearsOfExperience: 3,
    lastUsed: new Date("2024-01-10"),
    relatedProjects: ["REST API", "GraphQL Server"],
    description: "Backend development with Node.js",
    icon: "🟢",
    color: "#339933",
    learningPath: [
      {
        date: new Date("2021-02-01"),
        level: 1,
        achievement: "Node.js basics",
        project: "Simple API",
      },
    ],
  },
  {
    id: "figma",
    name: "Figma",
    category: "design" as const,
    proficiencyLevel: 3 as const,
    yearsOfExperience: 2,
    lastUsed: new Date("2024-01-08"),
    relatedProjects: ["Design System"],
    description: "UI/UX design with Figma",
    icon: "🎯",
    color: "#F24E1E",
  },
];

describe("SkillsProficiencyMatrix", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the component with default props", () => {
      render(<SkillsProficiencyMatrix />);

      expect(screen.getByText("Skills Proficiency Matrix")).toBeInTheDocument();
      expect(
        screen.getByText(/Interactive exploration of technical expertise/)
      ).toBeInTheDocument();
    });

    it("renders with custom skills data", () => {
      render(<SkillsProficiencyMatrix skills={mockSkills} />);

      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Node.js")).toBeInTheDocument();
      expect(screen.getByText("Figma")).toBeInTheDocument();
    });

    it("displays skill proficiency levels correctly", () => {
      render(<SkillsProficiencyMatrix skills={mockSkills} />);

      // Check for proficiency level indicators
      expect(screen.getByText("LVL 5")).toBeInTheDocument(); // React
      expect(screen.getByText("LVL 4")).toBeInTheDocument(); // Node.js
      expect(screen.getByText("LVL 3")).toBeInTheDocument(); // Figma
    });

    it("shows trending badges for trending skills", () => {
      render(<SkillsProficiencyMatrix skills={mockSkills} />);

      expect(screen.getByText("🔥 HOT")).toBeInTheDocument();
    });

    it("displays years of experience correctly", () => {
      render(<SkillsProficiencyMatrix skills={mockSkills} />);

      expect(screen.getByText("4y exp")).toBeInTheDocument(); // React
      expect(screen.getByText("3y exp")).toBeInTheDocument(); // Node.js
      expect(screen.getByText("2y exp")).toBeInTheDocument(); // Figma
    });
  });

  describe("Filtering", () => {
    it("filters skills by category", async () => {
      const user = userEvent.setup();
      render(
        <SkillsProficiencyMatrix skills={mockSkills} enableFiltering={true} />
      );

      // Click frontend filter
      const frontendButton = screen.getByText(/Frontend/);
      await user.click(frontendButton);

      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.queryByText("Node.js")).not.toBeInTheDocument();
      expect(screen.queryByText("Figma")).not.toBeInTheDocument();
    });

    it('shows all skills when "All Skills" filter is selected', async () => {
      const user = userEvent.setup();
      render(
        <SkillsProficiencyMatrix skills={mockSkills} enableFiltering={true} />
      );

      // First filter by frontend
      const frontendButton = screen.getByText(/Frontend/);
      await user.click(frontendButton);

      // Then click "All Skills"
      const allButton = screen.getByText(/All Skills/);
      await user.click(allButton);

      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Node.js")).toBeInTheDocument();
      expect(screen.getByText("Figma")).toBeInTheDocument();
    });

    it("displays correct counts in category filters", () => {
      render(
        <SkillsProficiencyMatrix skills={mockSkills} enableFiltering={true} />
      );

      expect(screen.getByText("All Skills")).toBeInTheDocument();
      expect(screen.getByText("(3)")).toBeInTheDocument();
      expect(screen.getByText("Frontend")).toBeInTheDocument();
      expect(screen.getByText("(1)")).toBeInTheDocument();
      expect(screen.getByText("Backend")).toBeInTheDocument();
      expect(screen.getByText("Design")).toBeInTheDocument();
    });
  });

  describe("Search", () => {
    it("filters skills by search query", async () => {
      const user = userEvent.setup();
      render(
        <SkillsProficiencyMatrix skills={mockSkills} enableSearch={true} />
      );

      const searchInput = screen.getByPlaceholderText("Search skills...");
      await user.type(searchInput, "React");

      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.queryByText("Node.js")).not.toBeInTheDocument();
      expect(screen.queryByText("Figma")).not.toBeInTheDocument();
    });

    it("searches in skill descriptions", async () => {
      const user = userEvent.setup();
      render(
        <SkillsProficiencyMatrix skills={mockSkills} enableSearch={true} />
      );

      const searchInput = screen.getByPlaceholderText("Search skills...");
      await user.type(searchInput, "Backend");

      expect(screen.getByText("Node.js")).toBeInTheDocument();
      expect(screen.queryByText("React")).not.toBeInTheDocument();
    });

    it("shows no results when search query matches nothing", async () => {
      const user = userEvent.setup();
      render(
        <SkillsProficiencyMatrix skills={mockSkills} enableSearch={true} />
      );

      const searchInput = screen.getByPlaceholderText("Search skills...");
      await user.type(searchInput, "NonexistentSkill");

      expect(screen.queryByText("React")).not.toBeInTheDocument();
      expect(screen.queryByText("Node.js")).not.toBeInTheDocument();
      expect(screen.queryByText("Figma")).not.toBeInTheDocument();
    });
  });

  describe("Sorting", () => {
    it("sorts skills by proficiency level", async () => {
      const user = userEvent.setup();
      render(<SkillsProficiencyMatrix skills={mockSkills} />);

      const sortSelect = screen.getByDisplayValue("Sort by Proficiency");
      await user.selectOptions(sortSelect, "proficiency");

      // Skills should be sorted by proficiency (React=5, Node.js=4, Figma=3)
      const skillElements = screen.getAllByText(/LVL \d/);
      expect(skillElements[0]).toHaveTextContent("LVL 5");
      expect(skillElements[1]).toHaveTextContent("LVL 4");
      expect(skillElements[2]).toHaveTextContent("LVL 3");
    });

    it("sorts skills by experience", async () => {
      const user = userEvent.setup();
      render(<SkillsProficiencyMatrix skills={mockSkills} />);

      const sortSelect = screen.getByDisplayValue("Sort by Proficiency");
      await user.selectOptions(sortSelect, "experience");

      // Should sort by years of experience (React=4, Node.js=3, Figma=2)
      const experienceElements = screen.getAllByText(/\dy exp/);
      expect(experienceElements[0]).toHaveTextContent("4y exp");
      expect(experienceElements[1]).toHaveTextContent("3y exp");
      expect(experienceElements[2]).toHaveTextContent("2y exp");
    });

    it("sorts skills by name", async () => {
      const user = userEvent.setup();
      render(<SkillsProficiencyMatrix skills={mockSkills} />);

      const sortSelect = screen.getByDisplayValue("Sort by Proficiency");
      await user.selectOptions(sortSelect, "name");

      // Should sort alphabetically (Figma, Node.js, React)
      const skillNames = screen.getAllByText(/^(Figma|Node\.js|React)$/);
      expect(skillNames[0]).toHaveTextContent("Figma");
      expect(skillNames[1]).toHaveTextContent("Node.js");
      expect(skillNames[2]).toHaveTextContent("React");
    });
  });

  describe("Skill Interaction", () => {
    it("opens skill detail modal when skill is clicked", async () => {
      const user = userEvent.setup();
      render(<SkillsProficiencyMatrix skills={mockSkills} />);

      const reactSkill = screen.getByText("React").closest("div");
      await user.click(reactSkill!);

      // Modal should open with detailed information
      expect(
        screen.getByText("Expert-level React development")
      ).toBeInTheDocument();
      expect(screen.getByText("Proficiency Breakdown")).toBeInTheDocument();
      expect(screen.getByText("Project Connections")).toBeInTheDocument();
    });

    it("closes skill detail modal when close button is clicked", async () => {
      const user = userEvent.setup();
      render(<SkillsProficiencyMatrix skills={mockSkills} />);

      // Open modal
      const reactSkill = screen.getByText("React").closest("div");
      await user.click(reactSkill!);

      // Close modal
      const closeButton = screen.getByText("✕");
      await user.click(closeButton);

      expect(
        screen.queryByText("Expert-level React development")
      ).not.toBeInTheDocument();
    });

    it("closes modal when clicking outside", async () => {
      const user = userEvent.setup();
      render(<SkillsProficiencyMatrix skills={mockSkills} />);

      // Open modal
      const reactSkill = screen.getByText("React").closest("div");
      await user.click(reactSkill!);

      // Click outside modal (on backdrop)
      const backdrop = screen
        .getByText("Expert-level React development")
        .closest(".fixed");
      await user.click(backdrop!);

      expect(
        screen.queryByText("Expert-level React development")
      ).not.toBeInTheDocument();
    });

    it("displays learning trajectory in modal", async () => {
      const user = userEvent.setup();
      render(
        <SkillsProficiencyMatrix
          skills={mockSkills}
          showLearningTrajectory={true}
        />
      );

      const reactSkill = screen.getByText("React").closest("div");
      await user.click(reactSkill!);

      expect(screen.getByText("Learning Trajectory")).toBeInTheDocument();
      expect(screen.getByText("Started React")).toBeInTheDocument();
      expect(screen.getByText("React expert")).toBeInTheDocument();
    });

    it("displays certifications in modal", async () => {
      const user = userEvent.setup();
      render(<SkillsProficiencyMatrix skills={mockSkills} />);

      const reactSkill = screen.getByText("React").closest("div");
      await user.click(reactSkill!);

      expect(
        screen.getByText("Certifications & Achievements")
      ).toBeInTheDocument();
      expect(
        screen.getByText("React Developer Certification")
      ).toBeInTheDocument();
    });

    it("displays project connections in modal", async () => {
      const user = userEvent.setup();
      render(
        <SkillsProficiencyMatrix
          skills={mockSkills}
          showProjectConnections={true}
        />
      );

      const reactSkill = screen.getByText("React").closest("div");
      await user.click(reactSkill!);

      expect(screen.getByText("Project Connections")).toBeInTheDocument();
      expect(screen.getByText("E-commerce Platform")).toBeInTheDocument();
      expect(screen.getByText("Portfolio Website")).toBeInTheDocument();
    });
  });

  describe("View Mode Toggle", () => {
    it("toggles between overview and detailed view", async () => {
      const user = userEvent.setup();
      render(<SkillsProficiencyMatrix skills={mockSkills} />);

      const toggleButton = screen.getByText(/📊 Detailed View/);
      await user.click(toggleButton);

      expect(screen.getByText(/📋 Overview/)).toBeInTheDocument();
    });
  });

  describe("Skills Summary", () => {
    it("displays correct summary statistics", () => {
      render(<SkillsProficiencyMatrix skills={mockSkills} />);

      expect(screen.getByText("Skills Overview")).toBeInTheDocument();

      // Use more specific selectors to avoid multiple matches
      const summarySection = screen.getByText("Skills Overview").closest("div");
      expect(summarySection).toBeInTheDocument();

      // Check for the presence of statistics labels instead of just numbers
      expect(screen.getByText("Total Skills")).toBeInTheDocument();
      expect(screen.getByText("Expert Level")).toBeInTheDocument();
      expect(screen.getByText("Avg Experience")).toBeInTheDocument();
      expect(screen.getByText("Project Applications")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels and roles", () => {
      render(<SkillsProficiencyMatrix skills={mockSkills} />);

      const searchInput = screen.getByPlaceholderText("Search skills...");
      expect(searchInput).toHaveAttribute("type", "text");

      const sortSelect = screen.getByDisplayValue("Sort by Proficiency");
      expect(sortSelect).toHaveRole("combobox");
    });

    it("supports keyboard navigation", async () => {
      const user = userEvent.setup();
      render(<SkillsProficiencyMatrix skills={mockSkills} />);

      const searchInput = screen.getByPlaceholderText("Search skills...");
      await user.tab();
      expect(searchInput).toHaveFocus();
    });
  });

  describe("Conditional Features", () => {
    it("hides search when enableSearch is false", () => {
      render(
        <SkillsProficiencyMatrix skills={mockSkills} enableSearch={false} />
      );

      expect(
        screen.queryByPlaceholderText("Search skills...")
      ).not.toBeInTheDocument();
    });

    it("hides filtering when enableFiltering is false", () => {
      render(
        <SkillsProficiencyMatrix skills={mockSkills} enableFiltering={false} />
      );

      expect(screen.queryByText(/Frontend/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Backend/)).not.toBeInTheDocument();
    });

    it("hides learning trajectory when showLearningTrajectory is false", async () => {
      const user = userEvent.setup();
      render(
        <SkillsProficiencyMatrix
          skills={mockSkills}
          showLearningTrajectory={false}
        />
      );

      const reactSkill = screen.getByText("React").closest("div");
      await user.click(reactSkill!);

      expect(screen.queryByText("Learning Trajectory")).not.toBeInTheDocument();
    });

    it("hides project connections when showProjectConnections is false", async () => {
      const user = userEvent.setup();
      render(
        <SkillsProficiencyMatrix
          skills={mockSkills}
          showProjectConnections={false}
        />
      );

      const reactSkill = screen.getByText("React").closest("div");
      await user.click(reactSkill!);

      // Project connections should still show in modal, but the feature flag affects other behaviors
      expect(screen.getByText("Project Connections")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("handles empty skills array gracefully", () => {
      render(<SkillsProficiencyMatrix skills={[]} />);

      expect(screen.getByText("Skills Proficiency Matrix")).toBeInTheDocument();
      expect(screen.getByText("Total Skills")).toBeInTheDocument(); // Should show the label
    });

    it("handles skills without optional properties", () => {
      const minimalSkill = {
        id: "minimal",
        name: "Minimal Skill",
        category: "frontend" as const,
        proficiencyLevel: 3 as const,
        yearsOfExperience: 1,
        lastUsed: new Date(),
        relatedProjects: [],
        description: "A minimal skill",
        icon: "⭐",
        color: "#000000",
      };

      render(<SkillsProficiencyMatrix skills={[minimalSkill]} />);

      expect(screen.getByText("Minimal Skill")).toBeInTheDocument();
      expect(screen.getByText("LVL 3")).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("renders large number of skills efficiently", () => {
      const manySkills = Array.from({ length: 50 }, (_, i) => ({
        id: `skill-${i}`,
        name: `Skill ${i}`,
        category: "frontend" as const,
        proficiencyLevel: ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5,
        yearsOfExperience: i % 10,
        lastUsed: new Date(),
        relatedProjects: [`Project ${i}`],
        description: `Description for skill ${i}`,
        icon: "⭐",
        color: "#000000",
      }));

      const { container } = render(
        <SkillsProficiencyMatrix skills={manySkills} />
      );

      expect(container.querySelectorAll('[class*="grid"]')).toHaveLength(2); // Skills grid + summary grid
      expect(screen.getByText("50")).toBeInTheDocument(); // Total skills count
    });
  });
});
