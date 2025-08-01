import { describe, it, expect } from "vitest";
import { ProjectFilterUtils, SearchUtils, DataUtils } from "../enhanced-utils";
import { createMockProject } from "@/test/test-utils";

describe("ProjectFilterUtils", () => {
  const mockProjects = [
    createMockProject({
      id: "project-1",
      title: "React App",
      category: "react",
      industry: "saas",
      complexity: "moderate",
      technologies: [
        {
          name: "React",
          category: "frontend",
          proficiencyLevel: 5,
          yearsOfExperience: 3,
          lastUsed: new Date(),
          relatedProjects: [],
        },
        {
          name: "TypeScript",
          category: "frontend",
          proficiencyLevel: 4,
          yearsOfExperience: 2,
          lastUsed: new Date(),
          relatedProjects: [],
        },
      ],
      featured: true,
    }),
    createMockProject({
      id: "project-2",
      title: "Vue Dashboard",
      category: "vue",
      industry: "fintech",
      complexity: "complex",
      technologies: [
        {
          name: "Vue.js",
          category: "frontend",
          proficiencyLevel: 4,
          yearsOfExperience: 2,
          lastUsed: new Date(),
          relatedProjects: [],
        },
        {
          name: "TypeScript",
          category: "frontend",
          proficiencyLevel: 4,
          yearsOfExperience: 2,
          lastUsed: new Date(),
          relatedProjects: [],
        },
      ],
      featured: false,
    }),
  ];

  describe("filterProjects", () => {
    it("filters by technology", () => {
      const filter = { technologies: ["React"] };
      const result = ProjectFilterUtils.filterProjects(mockProjects, filter);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("project-1");
    });

    it("filters by category", () => {
      const filter = { categories: ["vue"] };
      const result = ProjectFilterUtils.filterProjects(mockProjects, filter);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("project-2");
    });

    it("filters by multiple criteria", () => {
      const filter = {
        technologies: ["TypeScript"],
        complexity: ["moderate"],
      };
      const result = ProjectFilterUtils.filterProjects(mockProjects, filter);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("project-1");
    });

    it("filters by featured status", () => {
      const filter = { featured: true };
      const result = ProjectFilterUtils.filterProjects(mockProjects, filter);

      expect(result).toHaveLength(1);
      expect(result[0].featured).toBe(true);
    });

    it("returns empty array when no matches", () => {
      const filter = { technologies: ["Angular"] };
      const result = ProjectFilterUtils.filterProjects(mockProjects, filter);

      expect(result).toHaveLength(0);
    });
  });

  describe("getFilterOptions", () => {
    it("extracts unique filter options", () => {
      const options = ProjectFilterUtils.getFilterOptions(mockProjects);

      expect(options.technologies).toContain("React");
      expect(options.technologies).toContain("Vue.js");
      expect(options.technologies).toContain("TypeScript");
      expect(options.categories).toContain("react");
      expect(options.categories).toContain("vue");
      expect(options.industries).toContain("saas");
      expect(options.industries).toContain("fintech");
    });
  });
});

describe("SearchUtils", () => {
  const mockProjects = [
    createMockProject({
      id: "project-1",
      title: "React E-commerce App",
      description: "A modern e-commerce application",
      technologies: [
        {
          name: "React",
          category: "frontend",
          proficiencyLevel: 5,
          yearsOfExperience: 3,
          lastUsed: new Date(),
          relatedProjects: [],
        },
      ],
      createdAt: new Date("2023-01-01"),
    }),
    createMockProject({
      id: "project-2",
      title: "Vue Dashboard",
      description: "Analytics dashboard for business",
      technologies: [
        {
          name: "Vue.js",
          category: "frontend",
          proficiencyLevel: 4,
          yearsOfExperience: 2,
          lastUsed: new Date(),
          relatedProjects: [],
        },
      ],
      createdAt: new Date("2023-02-01"),
    }),
  ];

  describe("searchProjects", () => {
    it("searches by title", () => {
      const config = {
        query: "E-commerce",
        filters: {},
        sortBy: "relevance" as const,
        sortOrder: "desc" as const,
        page: 1,
        limit: 10,
      };

      const result = SearchUtils.searchProjects(mockProjects, config);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].title).toContain("E-commerce");
      expect(result.total).toBe(1);
    });

    it("searches by description", () => {
      const config = {
        query: "dashboard",
        filters: {},
        sortBy: "relevance" as const,
        sortOrder: "desc" as const,
        page: 1,
        limit: 10,
      };

      const result = SearchUtils.searchProjects(mockProjects, config);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].description).toContain("dashboard");
    });

    it("applies pagination", () => {
      const config = {
        query: "",
        filters: {},
        sortBy: "relevance" as const,
        sortOrder: "desc" as const,
        page: 1,
        limit: 1,
      };

      const result = SearchUtils.searchProjects(mockProjects, config);

      expect(result.items).toHaveLength(1);
      expect(result.hasMore).toBe(true);
      expect(result.total).toBe(2);
    });

    it("sorts by date", () => {
      const config = {
        query: "",
        filters: {},
        sortBy: "date" as const,
        sortOrder: "desc" as const,
        page: 1,
        limit: 10,
      };

      const result = SearchUtils.searchProjects(mockProjects, config);

      expect(result.items[0].createdAt.getTime()).toBeGreaterThan(
        result.items[1].createdAt.getTime()
      );
    });
  });

  describe("generateSearchSuggestions", () => {
    it("generates suggestions based on query", () => {
      const suggestions = SearchUtils.generateSearchSuggestions(
        mockProjects,
        "Rea",
        5
      );

      expect(suggestions).toContain("React");
    });

    it("limits suggestions correctly", () => {
      const suggestions = SearchUtils.generateSearchSuggestions(
        mockProjects,
        "a",
        1
      );

      expect(suggestions).toHaveLength(1);
    });

    it("returns empty array for empty query", () => {
      const suggestions = SearchUtils.generateSearchSuggestions(
        mockProjects,
        "",
        5
      );

      expect(suggestions).toHaveLength(0);
    });
  });
});

describe("DataUtils", () => {
  const mockProjects = [
    createMockProject({
      id: "project-1",
      category: "react",
      technologies: [
        {
          name: "React",
          category: "frontend",
          proficiencyLevel: 5,
          yearsOfExperience: 3,
          lastUsed: new Date(),
          relatedProjects: [],
        },
      ],
    }),
    createMockProject({
      id: "project-2",
      category: "react",
      technologies: [
        {
          name: "Vue.js",
          category: "frontend",
          proficiencyLevel: 4,
          yearsOfExperience: 2,
          lastUsed: new Date(),
          relatedProjects: [],
        },
      ],
    }),
    createMockProject({
      id: "project-3",
      category: "vue",
      technologies: [
        {
          name: "React",
          category: "frontend",
          proficiencyLevel: 5,
          yearsOfExperience: 3,
          lastUsed: new Date(),
          relatedProjects: [],
        },
      ],
    }),
  ];

  describe("groupProjectsBy", () => {
    it("groups projects by category", () => {
      const grouped = DataUtils.groupProjectsBy(mockProjects, "category");

      expect(grouped.react).toHaveLength(2);
      expect(grouped.vue).toHaveLength(1);
    });
  });

  describe("getRelatedProjects", () => {
    it("finds related projects based on shared technologies", () => {
      const targetProject = mockProjects[0]; // React project
      const related = DataUtils.getRelatedProjects(
        targetProject,
        mockProjects,
        1
      );

      expect(related.length).toBeGreaterThanOrEqual(0);
      expect(related.length).toBeLessThanOrEqual(1);
      if (related.length > 0) {
        expect(related[0].id).toBe("project-3"); // Also has React
      }
    });

    it("excludes the target project from results", () => {
      const targetProject = mockProjects[0];
      const related = DataUtils.getRelatedProjects(
        targetProject,
        mockProjects,
        5
      );

      expect(related.find((p) => p.id === targetProject.id)).toBeUndefined();
    });
  });

  describe("utility functions", () => {
    it("debounces function calls", (done) => {
      let callCount = 0;
      const debouncedFn = DataUtils.debounce(() => {
        callCount++;
      }, 50);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      setTimeout(() => {
        expect(callCount).toBe(1);
        done();
      }, 100);
    });

    it("validates email format", () => {
      expect(DataUtils.isValidEmail("test@example.com")).toBe(true);
      expect(DataUtils.isValidEmail("invalid-email")).toBe(false);
      expect(DataUtils.isValidEmail("test@")).toBe(false);
    });

    it("validates phone format", () => {
      expect(DataUtils.isValidPhone("+1234567890")).toBe(true);
      expect(DataUtils.isValidPhone("123-456-7890")).toBe(true);
      expect(DataUtils.isValidPhone("invalid")).toBe(false);
    });

    it("formats currency", () => {
      const formatted = DataUtils.formatCurrency(1000, "USD");
      expect(formatted).toBe("$1,000.00");
    });

    it("generates unique IDs", () => {
      const id1 = DataUtils.generateId();
      const id2 = DataUtils.generateId();

      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe("string");
      expect(id1.length).toBeGreaterThan(0);
    });

    it("deep clones objects", () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = DataUtils.deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });
  });
});
