"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import {
  SearchResult,
  SearchQuery,
  SearchHistory,
  SavedSearch,
  SearchSuggestion,
  SearchAnalytics,
  ContentDiscovery,
} from "@/types/search";

interface SearchState {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  suggestions: SearchSuggestion[];
  history: SearchHistory[];
  savedSearches: SavedSearch[];
  analytics: SearchAnalytics;
  discoveries: ContentDiscovery[];
  recentQueries: string[];
  popularQueries: string[];
  searchIndex: Map<string, SearchResult>;
}

type SearchAction =
  | { type: "SET_QUERY"; payload: string }
  | { type: "SET_RESULTS"; payload: SearchResult[] }
  | { type: "SET_SEARCHING"; payload: boolean }
  | { type: "ADD_SUGGESTION"; payload: SearchSuggestion }
  | { type: "SET_SUGGESTIONS"; payload: SearchSuggestion[] }
  | { type: "ADD_TO_HISTORY"; payload: SearchHistory }
  | { type: "SAVE_SEARCH"; payload: SavedSearch }
  | { type: "UPDATE_ANALYTICS"; payload: Partial<SearchAnalytics> }
  | { type: "ADD_DISCOVERY"; payload: ContentDiscovery }
  | {
      type: "TRACK_RESULT_CLICK";
      payload: { resultId: string; position: number };
    }
  | { type: "INITIALIZE_INDEX"; payload: SearchResult[] };

const initialState: SearchState = {
  query: "",
  results: [],
  isSearching: false,
  suggestions: [],
  history: [],
  savedSearches: [],
  analytics: {
    totalSearches: 0,
    popularQueries: [],
    popularResults: [],
    searchTrends: [],
    userBehavior: {
      avgQueryLength: 0,
      avgResultsViewed: 0,
      avgClickPosition: 0,
      refinementRate: 0,
    },
  },
  discoveries: [],
  recentQueries: [],
  popularQueries: [],
  searchIndex: new Map(),
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case "SET_QUERY":
      return {
        ...state,
        query: action.payload,
      };

    case "SET_RESULTS":
      return {
        ...state,
        results: action.payload,
        isSearching: false,
      };

    case "SET_SEARCHING":
      return {
        ...state,
        isSearching: action.payload,
      };

    case "ADD_SUGGESTION":
      const existingSuggestions = state.suggestions.filter(
        (s) => s.id !== action.payload.id
      );
      return {
        ...state,
        suggestions: [...existingSuggestions, action.payload]
          .sort((a, b) => b.score - a.score)
          .slice(0, 10),
      };

    case "SET_SUGGESTIONS":
      return {
        ...state,
        suggestions: action.payload,
      };

    case "ADD_TO_HISTORY":
      const newHistory = [action.payload, ...state.history.slice(0, 49)]; // Keep last 50
      const newRecentQueries = [
        action.payload.query,
        ...state.recentQueries.filter((q) => q !== action.payload.query),
      ].slice(0, 10);

      return {
        ...state,
        history: newHistory,
        recentQueries: newRecentQueries,
      };

    case "SAVE_SEARCH":
      const existingSavedSearches = state.savedSearches.filter(
        (s) => s.id !== action.payload.id
      );
      return {
        ...state,
        savedSearches: [...existingSavedSearches, action.payload],
      };

    case "UPDATE_ANALYTICS":
      return {
        ...state,
        analytics: {
          ...state.analytics,
          ...action.payload,
        },
      };

    case "ADD_DISCOVERY":
      const existingDiscoveries = state.discoveries.filter(
        (d) => d.id !== action.payload.id
      );
      return {
        ...state,
        discoveries: [...existingDiscoveries, action.payload]
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, 5),
      };

    case "TRACK_RESULT_CLICK":
      // Update analytics for result clicks
      const updatedPopularResults = [...state.analytics.popularResults];
      const existingResult = updatedPopularResults.find(
        (r) => r.resultId === action.payload.resultId
      );

      if (existingResult) {
        existingResult.clickCount += 1;
        existingResult.avgPosition =
          (existingResult.avgPosition + action.payload.position) / 2;
      } else {
        const result = state.results.find(
          (r) => r.id === action.payload.resultId
        );
        if (result) {
          updatedPopularResults.push({
            resultId: action.payload.resultId,
            title: result.title,
            clickCount: 1,
            avgPosition: action.payload.position,
          });
        }
      }

      return {
        ...state,
        analytics: {
          ...state.analytics,
          popularResults: updatedPopularResults
            .sort((a, b) => b.clickCount - a.clickCount)
            .slice(0, 10),
        },
      };

    case "INITIALIZE_INDEX":
      const searchIndex = new Map();
      action.payload.forEach((result) => {
        searchIndex.set(result.id, result);
      });

      return {
        ...state,
        searchIndex,
      };

    default:
      return state;
  }
}

const SearchContext = createContext<{
  state: SearchState;
  dispatch: React.Dispatch<SearchAction>;
  search: (query: string, filters?: any) => Promise<void>;
  getSuggestions: (query: string) => SearchSuggestion[];
  saveSearch: (name: string, query: SearchQuery) => void;
  generateDiscoveries: () => void;
} | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  // Initialize search index with sample data
  useEffect(() => {
    const sampleData: SearchResult[] = [
      {
        id: "home",
        title: "Home - Developer Portfolio",
        description:
          "Professional web developer specializing in React, Next.js, and high-converting digital experiences.",
        content:
          "Welcome to my portfolio. I'm a passionate developer who creates exceptional web applications.",
        url: "/",
        type: "page",
        category: "navigation",
        relevanceScore: 1.0,
        metadata: { priority: "high" },
        lastUpdated: new Date(),
        tags: ["home", "portfolio", "developer", "introduction"],
      },
      {
        id: "about",
        title: "About - Professional Background",
        description:
          "Learn about my journey as a full-stack developer, skills, and development methodology.",
        content:
          "My story, skills, experience, and the methodology I use to deliver exceptional results.",
        url: "/about",
        type: "page",
        category: "navigation",
        relevanceScore: 0.9,
        metadata: { priority: "high" },
        lastUpdated: new Date(),
        tags: ["about", "background", "skills", "experience", "methodology"],
      },
      {
        id: "portfolio",
        title: "Portfolio - Project Showcase",
        description:
          "Explore detailed case studies and examples of my work across various industries.",
        content:
          "A comprehensive showcase of projects, case studies, and technical implementations.",
        url: "/portfolio",
        type: "page",
        category: "navigation",
        relevanceScore: 0.95,
        metadata: { priority: "high" },
        lastUpdated: new Date(),
        tags: ["portfolio", "projects", "work", "case-studies", "examples"],
      },
      {
        id: "services",
        title: "Services - Development Solutions",
        description:
          "Comprehensive web development services with transparent pricing and clear processes.",
        content:
          "Full-stack development, consulting, and digital solutions tailored to your needs.",
        url: "/services",
        type: "page",
        category: "navigation",
        relevanceScore: 0.85,
        metadata: { priority: "high" },
        lastUpdated: new Date(),
        tags: ["services", "development", "consulting", "pricing", "solutions"],
      },
      {
        id: "contact",
        title: "Contact - Get in Touch",
        description:
          "Multiple ways to reach out and start your project with consultation booking.",
        content:
          "Contact information, consultation booking, and project inquiry forms.",
        url: "/contact",
        type: "page",
        category: "navigation",
        relevanceScore: 0.8,
        metadata: { priority: "high" },
        lastUpdated: new Date(),
        tags: [
          "contact",
          "consultation",
          "inquiry",
          "booking",
          "communication",
        ],
      },
      // Sample project results
      {
        id: "project-ecommerce",
        title: "E-commerce Platform",
        description:
          "Full-stack e-commerce solution with React, Node.js, and Stripe integration.",
        content:
          "Modern e-commerce platform with advanced features, payment processing, and admin dashboard.",
        url: "/portfolio#ecommerce",
        type: "project",
        category: "web-development",
        relevanceScore: 0.9,
        metadata: { technologies: ["React", "Node.js", "Stripe", "MongoDB"] },
        lastUpdated: new Date(),
        tags: [
          "ecommerce",
          "react",
          "nodejs",
          "stripe",
          "mongodb",
          "fullstack",
        ],
      },
      {
        id: "project-saas",
        title: "SaaS Dashboard",
        description:
          "Analytics dashboard for SaaS companies with real-time data visualization.",
        content:
          "Comprehensive SaaS dashboard with analytics, user management, and billing integration.",
        url: "/portfolio#saas",
        type: "project",
        category: "web-development",
        relevanceScore: 0.85,
        metadata: {
          technologies: ["Next.js", "TypeScript", "D3.js", "PostgreSQL"],
        },
        lastUpdated: new Date(),
        tags: [
          "saas",
          "dashboard",
          "analytics",
          "nextjs",
          "typescript",
          "visualization",
        ],
      },
      // Sample service results
      {
        id: "service-fullstack",
        title: "Full-Stack Development",
        description:
          "End-to-end web application development with modern technologies.",
        content:
          "Complete web application development from concept to deployment.",
        url: "/services#fullstack",
        type: "service",
        category: "development",
        relevanceScore: 0.9,
        metadata: { pricing: "custom", duration: "2-6 months" },
        lastUpdated: new Date(),
        tags: ["fullstack", "development", "web-app", "custom", "modern"],
      },
      {
        id: "service-consulting",
        title: "Technical Consulting",
        description:
          "Expert advice on architecture, technology choices, and best practices.",
        content: "Strategic technical guidance for your development projects.",
        url: "/services#consulting",
        type: "service",
        category: "consulting",
        relevanceScore: 0.8,
        metadata: { pricing: "hourly", duration: "flexible" },
        lastUpdated: new Date(),
        tags: [
          "consulting",
          "architecture",
          "strategy",
          "advice",
          "best-practices",
        ],
      },
    ];

    dispatch({ type: "INITIALIZE_INDEX", payload: sampleData });
  }, []);

  const search = async (query: string, filters: any = {}) => {
    if (!query.trim()) {
      dispatch({ type: "SET_RESULTS", payload: [] });
      return;
    }

    dispatch({ type: "SET_SEARCHING", payload: true });

    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Simple search implementation
    const results = Array.from(state.searchIndex.values())
      .filter((result) => {
        const searchText = `${result.title} ${result.description} ${
          result.content
        } ${result.tags.join(" ")}`.toLowerCase();
        const queryLower = query.toLowerCase();

        // Basic text matching
        const textMatch = searchText.includes(queryLower);

        // Apply filters
        if (filters.types && filters.types.length > 0) {
          if (!filters.types.includes(result.type)) return false;
        }

        if (filters.categories && filters.categories.length > 0) {
          if (!filters.categories.includes(result.category)) return false;
        }

        return textMatch;
      })
      .map((result) => ({
        ...result,
        relevanceScore: calculateRelevanceScore(result, query),
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 20);

    dispatch({ type: "SET_RESULTS", payload: results });

    // Add to history
    const historyEntry: SearchHistory = {
      id: `search_${Date.now()}`,
      query,
      timestamp: new Date(),
      resultsCount: results.length,
      clickedResults: [],
    };
    dispatch({ type: "ADD_TO_HISTORY", payload: historyEntry });

    // Update analytics
    dispatch({
      type: "UPDATE_ANALYTICS",
      payload: {
        totalSearches: state.analytics.totalSearches + 1,
      },
    });
  };

  const getSuggestions = (query: string): SearchSuggestion[] => {
    if (!query.trim()) return [];

    const suggestions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();

    // Add query suggestions based on search history
    state.recentQueries
      .filter((q) => q.toLowerCase().includes(queryLower) && q !== query)
      .slice(0, 3)
      .forEach((q, index) => {
        suggestions.push({
          id: `recent_${index}`,
          text: q,
          type: "query",
          score: 0.8 - index * 0.1,
        });
      });

    // Add content-based suggestions
    Array.from(state.searchIndex.values())
      .filter((result) => result.title.toLowerCase().includes(queryLower))
      .slice(0, 5)
      .forEach((result, index) => {
        suggestions.push({
          id: `content_${result.id}`,
          text: result.title,
          type: "query",
          score: 0.7 - index * 0.05,
          metadata: { url: result.url, type: result.type },
        });
      });

    return suggestions.sort((a, b) => b.score - a.score).slice(0, 8);
  };

  const saveSearch = (name: string, query: SearchQuery) => {
    const savedSearch: SavedSearch = {
      id: `saved_${Date.now()}`,
      name,
      query,
      createdAt: new Date(),
      lastUsed: new Date(),
      useCount: 1,
      notifications: false,
    };
    dispatch({ type: "SAVE_SEARCH", payload: savedSearch });
  };

  const generateDiscoveries = () => {
    // Generate content discoveries based on user behavior
    const discoveries: ContentDiscovery[] = [];

    // Based on search history
    const recentSearches = state.history.slice(0, 5);
    recentSearches.forEach((search, index) => {
      const relatedContent = Array.from(state.searchIndex.values())
        .filter((result) =>
          result.tags.some((tag) =>
            search.query.toLowerCase().includes(tag.toLowerCase())
          )
        )
        .slice(0, 2);

      relatedContent.forEach((content) => {
        discoveries.push({
          id: `discovery_${content.id}_${index}`,
          title: content.title,
          description: content.description,
          url: content.url,
          type: content.type,
          reason: `Based on your search for "${search.query}"`,
          confidence: 0.8 - index * 0.1,
          basedOn: [{ type: "search", data: search }],
        });
      });
    });

    discoveries.forEach((discovery) => {
      dispatch({ type: "ADD_DISCOVERY", payload: discovery });
    });
  };

  return (
    <SearchContext.Provider
      value={{
        state,
        dispatch,
        search,
        getSuggestions,
        saveSearch,
        generateDiscoveries,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}

// Helper function to calculate relevance score
function calculateRelevanceScore(result: SearchResult, query: string): number {
  const queryLower = query.toLowerCase();
  let score = 0;

  // Title match (highest weight)
  if (result.title.toLowerCase().includes(queryLower)) {
    score += 0.4;
    if (result.title.toLowerCase().startsWith(queryLower)) {
      score += 0.2;
    }
  }

  // Description match
  if (result.description.toLowerCase().includes(queryLower)) {
    score += 0.3;
  }

  // Content match
  if (result.content.toLowerCase().includes(queryLower)) {
    score += 0.2;
  }

  // Tags match
  const matchingTags = result.tags.filter((tag) =>
    tag.toLowerCase().includes(queryLower)
  );
  score += matchingTags.length * 0.1;

  // Boost based on result type priority
  const typePriority = {
    page: 0.1,
    project: 0.08,
    service: 0.06,
    content: 0.04,
    skill: 0.02,
  };
  score += typePriority[result.type] || 0;

  return Math.min(score, 1.0);
}
