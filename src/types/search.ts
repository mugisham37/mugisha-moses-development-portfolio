// Global search and discovery types
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  type: "page" | "project" | "service" | "content" | "skill";
  category: string;
  relevanceScore: number;
  metadata: Record<string, any>;
  lastUpdated: Date;
  tags: string[];
}

export interface SearchQuery {
  query: string;
  filters: SearchFilters;
  sortBy: "relevance" | "date" | "title" | "type";
  sortOrder: "asc" | "desc";
  limit: number;
  offset: number;
}

export interface SearchFilters {
  types: SearchResult["type"][];
  categories: string[];
  tags: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  minRelevanceScore?: number;
}

export interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
  resultsCount: number;
  clickedResults: string[];
}

export interface SavedSearch {
  id: string;
  name: string;
  query: SearchQuery;
  createdAt: Date;
  lastUsed: Date;
  useCount: number;
  notifications: boolean;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: "query" | "filter" | "category";
  score: number;
  metadata?: Record<string, any>;
}

export interface SearchAnalytics {
  totalSearches: number;
  popularQueries: Array<{
    query: string;
    count: number;
    avgRelevance: number;
  }>;
  popularResults: Array<{
    resultId: string;
    title: string;
    clickCount: number;
    avgPosition: number;
  }>;
  searchTrends: Array<{
    date: Date;
    searchCount: number;
    avgResultsCount: number;
  }>;
  userBehavior: {
    avgQueryLength: number;
    avgResultsViewed: number;
    avgClickPosition: number;
    refinementRate: number;
  };
}

export interface ContentDiscovery {
  id: string;
  title: string;
  description: string;
  url: string;
  type: SearchResult["type"];
  reason: string;
  confidence: number;
  basedOn: Array<{
    type: "search" | "view" | "interaction";
    data: any;
  }>;
}
