// Utility functions for filtering, searching, and data manipulation

import {
  EnhancedProject,
  EnhancedService,
  ProjectFilter,
  SearchConfig,
  SearchResult,
  Technology,
  ProjectCategory,
  Industry,
  ComplexityLevel,
} from "@/types/enhanced";

// Project filtering utilities
export class ProjectFilterUtils {
  /**
   * Filter projects based on the provided filter criteria
   */
  static filterProjects(
    projects: EnhancedProject[],
    filter: ProjectFilter
  ): EnhancedProject[] {
    return projects.filter((project) => {
      // Technology filter
      if (filter.technologies && filter.technologies.length > 0) {
        const projectTechNames = project.technologies.map((tech) =>
          tech.name.toLowerCase()
        );
        const hasMatchingTech = filter.technologies.some((tech) =>
          projectTechNames.includes(tech.toLowerCase())
        );
        if (!hasMatchingTech) return false;
      }

      // Category filter
      if (filter.categories && filter.categories.length > 0) {
        if (!filter.categories.includes(project.category)) return false;
      }

      // Industry filter
      if (filter.industries && filter.industries.length > 0) {
        if (!filter.industries.includes(project.industry)) return false;
      }

      // Complexity filter
      if (filter.complexity && filter.complexity.length > 0) {
        if (!filter.complexity.includes(project.complexity)) return false;
      }

      // Status filter
      if (filter.status && filter.status.length > 0) {
        if (!filter.status.includes(project.status)) return false;
      }

      // Date range filter
      if (filter.dateRange) {
        const projectDate = new Date(project.createdAt);
        if (
          projectDate < filter.dateRange.start ||
          projectDate > filter.dateRange.end
        ) {
          return false;
        }
      }

      // Featured filter
      if (filter.featured !== undefined) {
        if (project.featured !== filter.featured) return false;
      }

      return true;
    });
  }

  /**
   * Get unique values for filter options
   */
  static getFilterOptions(projects: EnhancedProject[]) {
    const technologies = new Set<string>();
    const categories = new Set<ProjectCategory>();
    const industries = new Set<Industry>();
    const complexities = new Set<ComplexityLevel>();

    projects.forEach((project) => {
      project.technologies.forEach((tech) => technologies.add(tech.name));
      categories.add(project.category);
      industries.add(project.industry);
      complexities.add(project.complexity);
    });

    return {
      technologies: Array.from(technologies).sort(),
      categories: Array.from(categories).sort(),
      industries: Array.from(industries).sort(),
      complexities: Array.from(complexities).sort(),
    };
  }

  /**
   * Get project counts for each filter option
   */
  static getFilterCounts(
    projects: EnhancedProject[],
    currentFilter: ProjectFilter
  ) {
    const counts = {
      technologies: {} as Record<string, number>,
      categories: {} as Record<string, number>,
      industries: {} as Record<string, number>,
      complexities: {} as Record<string, number>,
    };

    projects.forEach((project) => {
      // Only count if project matches other filters
      const tempFilter = { ...currentFilter };

      // Count technologies
      project.technologies.forEach((tech) => {
        delete tempFilter.technologies;
        if (this.filterProjects([project], tempFilter).length > 0) {
          counts.technologies[tech.name] =
            (counts.technologies[tech.name] || 0) + 1;
        }
      });

      // Count categories
      delete tempFilter.categories;
      if (this.filterProjects([project], tempFilter).length > 0) {
        counts.categories[project.category] =
          (counts.categories[project.category] || 0) + 1;
      }

      // Count industries
      tempFilter.categories = currentFilter.categories;
      delete tempFilter.industries;
      if (this.filterProjects([project], tempFilter).length > 0) {
        counts.industries[project.industry] =
          (counts.industries[project.industry] || 0) + 1;
      }

      // Count complexities
      tempFilter.industries = currentFilter.industries;
      delete tempFilter.complexity;
      if (this.filterProjects([project], tempFilter).length > 0) {
        counts.complexities[project.complexity] =
          (counts.complexities[project.complexity] || 0) + 1;
      }
    });

    return counts;
  }
}

// Search utilities
export class SearchUtils {
  /**
   * Search projects based on query and configuration
   */
  static searchProjects(
    projects: EnhancedProject[],
    config: SearchConfig
  ): SearchResult<EnhancedProject> {
    let filteredProjects = projects;

    // Apply filters first
    if (Object.keys(config.filters).length > 0) {
      filteredProjects = ProjectFilterUtils.filterProjects(
        projects,
        config.filters
      );
    }

    // Apply text search
    if (config.query.trim()) {
      filteredProjects = this.performTextSearch(filteredProjects, config.query);
    }

    // Sort results
    filteredProjects = this.sortProjects(
      filteredProjects,
      config.sortBy,
      config.sortOrder
    );

    // Calculate pagination
    const total = filteredProjects.length;
    const startIndex = (config.page - 1) * config.limit;
    const endIndex = startIndex + config.limit;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    return {
      items: paginatedProjects,
      total,
      page: config.page,
      limit: config.limit,
      hasMore: endIndex < total,
      facets: this.generateFacets(filteredProjects),
    };
  }

  /**
   * Perform text search across project fields
   */
  private static performTextSearch(
    projects: EnhancedProject[],
    query: string
  ): EnhancedProject[] {
    const searchTerms = query
      .toLowerCase()
      .split(" ")
      .filter((term) => term.length > 0);

    return projects.filter((project) => {
      const searchableText = [
        project.title,
        project.description,
        project.longDescription,
        ...project.technologies.map((tech) => tech.name),
        project.category,
        project.industry,
        project.caseStudy.challenge,
        project.caseStudy.solution,
        ...project.caseStudy.approach,
        ...project.caseStudy.results,
      ]
        .join(" ")
        .toLowerCase();

      return searchTerms.every((term) => searchableText.includes(term));
    });
  }

  /**
   * Sort projects based on criteria
   */
  private static sortProjects(
    projects: EnhancedProject[],
    sortBy: SearchConfig["sortBy"],
    sortOrder: SearchConfig["sortOrder"]
  ): EnhancedProject[] {
    const sorted = [...projects].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "complexity":
          const complexityOrder = {
            simple: 1,
            moderate: 2,
            complex: 3,
            enterprise: 4,
          };
          comparison =
            complexityOrder[a.complexity] - complexityOrder[b.complexity];
          break;
        case "relevance":
        default:
          // For relevance, we could implement a scoring system
          // For now, we'll sort by featured status and then by date
          if (a.featured !== b.featured) {
            comparison = a.featured ? -1 : 1;
          } else {
            comparison =
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          break;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

    return sorted;
  }

  /**
   * Generate facets for search results
   */
  private static generateFacets(
    projects: EnhancedProject[]
  ): Record<string, number> {
    const facets: Record<string, number> = {};

    projects.forEach((project) => {
      // Technology facets
      project.technologies.forEach((tech) => {
        const key = `tech:${tech.name}`;
        facets[key] = (facets[key] || 0) + 1;
      });

      // Category facets
      const categoryKey = `category:${project.category}`;
      facets[categoryKey] = (facets[categoryKey] || 0) + 1;

      // Industry facets
      const industryKey = `industry:${project.industry}`;
      facets[industryKey] = (facets[industryKey] || 0) + 1;

      // Complexity facets
      const complexityKey = `complexity:${project.complexity}`;
      facets[complexityKey] = (facets[complexityKey] || 0) + 1;
    });

    return facets;
  }

  /**
   * Generate search suggestions based on query
   */
  static generateSearchSuggestions(
    projects: EnhancedProject[],
    query: string,
    limit: number = 5
  ): string[] {
    if (!query.trim()) return [];

    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();

    projects.forEach((project) => {
      // Title suggestions
      if (project.title.toLowerCase().includes(queryLower)) {
        suggestions.add(project.title);
      }

      // Technology suggestions
      project.technologies.forEach((tech) => {
        if (tech.name.toLowerCase().includes(queryLower)) {
          suggestions.add(tech.name);
        }
      });

      // Category suggestions
      if (project.category.toLowerCase().includes(queryLower)) {
        suggestions.add(project.category);
      }

      // Industry suggestions
      if (project.industry.toLowerCase().includes(queryLower)) {
        suggestions.add(project.industry);
      }
    });

    return Array.from(suggestions).slice(0, limit);
  }
}

// Data manipulation utilities
export class DataUtils {
  /**
   * Group projects by a specific field
   */
  static groupProjectsBy<K extends keyof EnhancedProject>(
    projects: EnhancedProject[],
    field: K
  ): Record<string, EnhancedProject[]> {
    return projects.reduce((groups, project) => {
      const key = String(project[field]);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(project);
      return groups;
    }, {} as Record<string, EnhancedProject[]>);
  }

  /**
   * Get related projects based on shared technologies or categories
   */
  static getRelatedProjects(
    targetProject: EnhancedProject,
    allProjects: EnhancedProject[],
    limit: number = 3
  ): EnhancedProject[] {
    const targetTechNames = targetProject.technologies.map((tech) => tech.name);

    const scoredProjects = allProjects
      .filter((project) => project.id !== targetProject.id)
      .map((project) => {
        let score = 0;

        // Score based on shared technologies
        const sharedTechs = project.technologies.filter((tech) =>
          targetTechNames.includes(tech.name)
        ).length;
        score += sharedTechs * 3;

        // Score based on same category
        if (project.category === targetProject.category) {
          score += 2;
        }

        // Score based on same industry
        if (project.industry === targetProject.industry) {
          score += 1;
        }

        // Score based on similar complexity
        if (project.complexity === targetProject.complexity) {
          score += 1;
        }

        return { project, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.project);

    return scoredProjects;
  }

  /**
   * Calculate project statistics
   */
  static calculateProjectStats(projects: EnhancedProject[]) {
    const stats = {
      total: projects.length,
      featured: projects.filter((p) => p.featured).length,
      byCategory: {} as Record<string, number>,
      byIndustry: {} as Record<string, number>,
      byComplexity: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      technologies: {} as Record<string, number>,
      averageProjectDuration: 0,
      totalTechnologies: 0,
    };

    let totalDuration = 0;
    const allTechnologies = new Set<string>();

    projects.forEach((project) => {
      // Count by category
      stats.byCategory[project.category] =
        (stats.byCategory[project.category] || 0) + 1;

      // Count by industry
      stats.byIndustry[project.industry] =
        (stats.byIndustry[project.industry] || 0) + 1;

      // Count by complexity
      stats.byComplexity[project.complexity] =
        (stats.byComplexity[project.complexity] || 0) + 1;

      // Count by status
      stats.byStatus[project.status] =
        (stats.byStatus[project.status] || 0) + 1;

      // Count technologies
      project.technologies.forEach((tech) => {
        stats.technologies[tech.name] =
          (stats.technologies[tech.name] || 0) + 1;
        allTechnologies.add(tech.name);
      });

      // Calculate duration
      const startDate = new Date(project.timeline.startDate);
      const endDate = new Date(project.timeline.endDate);
      const duration = endDate.getTime() - startDate.getTime();
      totalDuration += duration;
    });

    stats.averageProjectDuration =
      projects.length > 0 ? totalDuration / projects.length : 0;
    stats.totalTechnologies = allTechnologies.size;

    return stats;
  }

  /**
   * Format duration in human-readable format
   */
  static formatDuration(milliseconds: number): string {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""}`;
    } else if (weeks > 0) {
      return `${weeks} week${weeks > 1 ? "s" : ""}`;
    } else {
      return `${days} day${days > 1 ? "s" : ""}`;
    }
  }

  /**
   * Debounce function for search input
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Throttle function for scroll events
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Deep clone an object
   */
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (obj instanceof Array)
      return obj.map((item) => this.deepClone(item)) as unknown as T;
    if (typeof obj === "object") {
      const clonedObj = {} as T;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
    return obj;
  }

  /**
   * Generate a unique ID
   */
  static generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  }

  /**
   * Format currency
   */
  static formatCurrency(amount: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  }

  /**
   * Format date
   */
  static formatDate(date: Date, format: string = "MM/DD/YYYY"): string {
    const options: Intl.DateTimeFormatOptions = {};

    switch (format) {
      case "MM/DD/YYYY":
        options.year = "numeric";
        options.month = "2-digit";
        options.day = "2-digit";
        break;
      case "DD/MM/YYYY":
        options.year = "numeric";
        options.month = "2-digit";
        options.day = "2-digit";
        break;
      case "YYYY-MM-DD":
        return date.toISOString().split("T")[0];
      default:
        options.year = "numeric";
        options.month = "long";
        options.day = "numeric";
    }

    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  /**
   * Sanitize HTML content
   */
  static sanitizeHtml(html: string): string {
    const div = document.createElement("div");
    div.textContent = html;
    return div.innerHTML;
  }

  /**
   * Calculate reading time for text content
   */
  static calculateReadingTime(
    text: string,
    wordsPerMinute: number = 200
  ): number {
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }
}
