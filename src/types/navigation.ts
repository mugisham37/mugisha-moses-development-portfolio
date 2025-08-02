// Navigation and context-aware types
export interface NavigationContext {
  currentPage: string;
  previousPage?: string;
  pageHistory: string[];
  userBehavior: UserBehaviorData;
  contentSuggestions: ContentSuggestion[];
  nextSteps: NextStepRecommendation[];
}

export interface UserBehaviorData {
  timeOnPage: number;
  scrollDepth: number;
  interactionsCount: number;
  clickedElements: string[];
  viewedSections: string[];
  searchQueries: string[];
  lastActivity: Date;
}

export interface ContentSuggestion {
  id: string;
  type: "project" | "service" | "content" | "action";
  title: string;
  description: string;
  href: string;
  relevanceScore: number;
  reason: string;
  metadata?: Record<string, any>;
}

export interface NextStepRecommendation {
  id: string;
  title: string;
  description: string;
  action: string;
  href?: string;
  priority: "high" | "medium" | "low";
  category: "contact" | "explore" | "learn" | "engage";
  metadata?: Record<string, any>;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  isActive: boolean;
  context?: string;
}

export interface PageContext {
  title: string;
  category: string;
  tags: string[];
  relatedPages: string[];
  suggestedActions: string[];
  userJourneyStage: "discovery" | "consideration" | "decision" | "action";
}

export interface UserJourney {
  sessionId: string;
  startTime: Date;
  currentStage: "discovery" | "consideration" | "decision" | "action";
  visitedPages: Array<{
    path: string;
    timestamp: Date;
    timeSpent: number;
    interactions: string[];
  }>;
  interests: string[];
  intent: "browsing" | "researching" | "hiring" | "learning";
  conversionGoals: string[];
}
