"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  NavigationContext as NavigationContextType,
  UserBehaviorData,
  ContentSuggestion,
  NextStepRecommendation,
  UserJourney,
  PageContext,
} from "@/types/navigation";

interface NavigationState extends NavigationContextType {
  userJourney: UserJourney;
  pageContext: PageContext;
}

type NavigationAction =
  | { type: "SET_CURRENT_PAGE"; payload: string }
  | { type: "UPDATE_USER_BEHAVIOR"; payload: Partial<UserBehaviorData> }
  | { type: "ADD_CONTENT_SUGGESTION"; payload: ContentSuggestion }
  | { type: "UPDATE_NEXT_STEPS"; payload: NextStepRecommendation[] }
  | {
      type: "TRACK_INTERACTION";
      payload: { element: string; section?: string };
    }
  | { type: "UPDATE_PAGE_CONTEXT"; payload: PageContext }
  | { type: "UPDATE_USER_JOURNEY"; payload: Partial<UserJourney> };

const initialState: NavigationState = {
  currentPage: "/",
  previousPage: undefined,
  pageHistory: ["/"],
  userBehavior: {
    timeOnPage: 0,
    scrollDepth: 0,
    interactionsCount: 0,
    clickedElements: [],
    viewedSections: [],
    searchQueries: [],
    lastActivity: new Date(),
  },
  contentSuggestions: [],
  nextSteps: [],
  userJourney: {
    sessionId: "",
    startTime: new Date(),
    currentStage: "discovery",
    visitedPages: [],
    interests: [],
    intent: "browsing",
    conversionGoals: [],
  },
  pageContext: {
    title: "Home",
    category: "landing",
    tags: [],
    relatedPages: [],
    suggestedActions: [],
    userJourneyStage: "discovery",
  },
};

function navigationReducer(
  state: NavigationState,
  action: NavigationAction
): NavigationState {
  switch (action.type) {
    case "SET_CURRENT_PAGE":
      const newHistory = [...state.pageHistory];
      if (newHistory[newHistory.length - 1] !== action.payload) {
        newHistory.push(action.payload);
      }

      return {
        ...state,
        previousPage: state.currentPage,
        currentPage: action.payload,
        pageHistory: newHistory.slice(-10), // Keep last 10 pages
        userBehavior: {
          ...state.userBehavior,
          timeOnPage: 0,
          scrollDepth: 0,
          interactionsCount: 0,
          viewedSections: [],
          lastActivity: new Date(),
        },
      };

    case "UPDATE_USER_BEHAVIOR":
      return {
        ...state,
        userBehavior: {
          ...state.userBehavior,
          ...action.payload,
          lastActivity: new Date(),
        },
      };

    case "ADD_CONTENT_SUGGESTION":
      const existingSuggestions = state.contentSuggestions.filter(
        (s) => s.id !== action.payload.id
      );
      return {
        ...state,
        contentSuggestions: [...existingSuggestions, action.payload]
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .slice(0, 5), // Keep top 5 suggestions
      };

    case "UPDATE_NEXT_STEPS":
      return {
        ...state,
        nextSteps: action.payload,
      };

    case "TRACK_INTERACTION":
      const updatedClickedElements = [
        ...state.userBehavior.clickedElements,
        action.payload.element,
      ];
      const updatedViewedSections = action.payload.section
        ? [
            ...new Set([
              ...state.userBehavior.viewedSections,
              action.payload.section,
            ]),
          ]
        : state.userBehavior.viewedSections;

      return {
        ...state,
        userBehavior: {
          ...state.userBehavior,
          interactionsCount: state.userBehavior.interactionsCount + 1,
          clickedElements: updatedClickedElements.slice(-20), // Keep last 20 interactions
          viewedSections: updatedViewedSections,
          lastActivity: new Date(),
        },
      };

    case "UPDATE_PAGE_CONTEXT":
      return {
        ...state,
        pageContext: action.payload,
      };

    case "UPDATE_USER_JOURNEY":
      return {
        ...state,
        userJourney: {
          ...state.userJourney,
          ...action.payload,
        },
      };

    default:
      return state;
  }
}

const NavigationContext = createContext<{
  state: NavigationState;
  dispatch: React.Dispatch<NavigationAction>;
} | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(navigationReducer, {
    ...initialState,
    userJourney: {
      ...initialState.userJourney,
      sessionId:
        typeof window !== "undefined"
          ? `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          : "session_default",
    },
  });

  const pathname = usePathname();

  // Update current page when pathname changes
  useEffect(() => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: pathname });

    // Update page context based on pathname
    const pageContext = getPageContext(pathname);
    dispatch({ type: "UPDATE_PAGE_CONTEXT", payload: pageContext });

    // Generate content suggestions and next steps
    generateContentSuggestions(pathname, state, dispatch);
    generateNextSteps(pathname, state, dispatch);
  }, [pathname]);

  // Track time on page
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const timeOnPage = Math.floor((Date.now() - startTime) / 1000);
      dispatch({
        type: "UPDATE_USER_BEHAVIOR",
        payload: { timeOnPage },
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pathname]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = Math.round((scrollTop / docHeight) * 100);

      dispatch({
        type: "UPDATE_USER_BEHAVIOR",
        payload: {
          scrollDepth: Math.max(state.userBehavior.scrollDepth, scrollDepth),
        },
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [state.userBehavior.scrollDepth]);

  return (
    <NavigationContext.Provider value={{ state, dispatch }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}

// Helper functions
function getPageContext(pathname: string): PageContext {
  const pageContextMap: Record<string, PageContext> = {
    "/": {
      title: "Home",
      category: "landing",
      tags: ["introduction", "overview", "hero"],
      relatedPages: ["/about", "/portfolio", "/services"],
      suggestedActions: ["explore-portfolio", "learn-about", "view-services"],
      userJourneyStage: "discovery",
    },
    "/about": {
      title: "About",
      category: "information",
      tags: ["background", "skills", "experience", "methodology"],
      relatedPages: ["/portfolio", "/services", "/contact"],
      suggestedActions: ["view-portfolio", "explore-services", "get-in-touch"],
      userJourneyStage: "consideration",
    },
    "/portfolio": {
      title: "Portfolio",
      category: "showcase",
      tags: ["projects", "work", "examples", "case-studies"],
      relatedPages: ["/about", "/services", "/contact"],
      suggestedActions: ["learn-process", "request-quote", "view-similar"],
      userJourneyStage: "consideration",
    },
    "/services": {
      title: "Services",
      category: "offering",
      tags: ["pricing", "packages", "process", "solutions"],
      relatedPages: ["/portfolio", "/about", "/contact"],
      suggestedActions: ["view-examples", "calculate-cost", "start-project"],
      userJourneyStage: "decision",
    },
    "/contact": {
      title: "Contact",
      category: "conversion",
      tags: ["inquiry", "consultation", "booking", "communication"],
      relatedPages: ["/services", "/portfolio", "/about"],
      suggestedActions: ["schedule-call", "send-message", "view-availability"],
      userJourneyStage: "action",
    },
    "/settings": {
      title: "Settings",
      category: "utility",
      tags: ["preferences", "accessibility", "customization"],
      relatedPages: ["/"],
      suggestedActions: ["customize-experience", "save-preferences"],
      userJourneyStage: "discovery",
    },
  };

  return pageContextMap[pathname] || pageContextMap["/"];
}

function generateContentSuggestions(
  pathname: string,
  state: NavigationState,
  dispatch: React.Dispatch<NavigationAction>
) {
  const suggestions: ContentSuggestion[] = [];

  // Generate suggestions based on current page and user behavior
  switch (pathname) {
    case "/":
      suggestions.push(
        {
          id: "home-to-about",
          type: "content",
          title: "Learn About My Background",
          description:
            "Discover my experience, skills, and development methodology",
          href: "/about",
          relevanceScore: 0.9,
          reason: "Natural next step from homepage",
        },
        {
          id: "home-to-portfolio",
          type: "project",
          title: "View My Work",
          description: "Explore detailed case studies and project examples",
          href: "/portfolio",
          relevanceScore: 0.85,
          reason: "Popular choice for new visitors",
        }
      );
      break;

    case "/about":
      suggestions.push(
        {
          id: "about-to-portfolio",
          type: "project",
          title: "See My Work in Action",
          description:
            "View projects that demonstrate the skills and methodology discussed",
          href: "/portfolio",
          relevanceScore: 0.95,
          reason: "Logical progression from learning about skills",
        },
        {
          id: "about-to-services",
          type: "service",
          title: "Explore Service Offerings",
          description:
            "Learn how my skills translate into services for your project",
          href: "/services",
          relevanceScore: 0.8,
          reason: "Interest in capabilities suggests service interest",
        }
      );
      break;

    case "/portfolio":
      suggestions.push(
        {
          id: "portfolio-to-services",
          type: "service",
          title: "Get Similar Results",
          description:
            "Learn how I can deliver similar outcomes for your project",
          href: "/services",
          relevanceScore: 0.9,
          reason: "Viewing work often leads to service inquiry",
        },
        {
          id: "portfolio-to-contact",
          type: "action",
          title: "Discuss Your Project",
          description: "Start a conversation about your specific needs",
          href: "/contact",
          relevanceScore: 0.85,
          reason: "High-intent action after viewing work",
        }
      );
      break;

    case "/services":
      suggestions.push(
        {
          id: "services-to-contact",
          type: "action",
          title: "Start Your Project",
          description: "Get a personalized quote and timeline for your needs",
          href: "/contact",
          relevanceScore: 0.95,
          reason: "Natural next step after reviewing services",
        },
        {
          id: "services-to-portfolio",
          type: "project",
          title: "See Service Examples",
          description: "View real projects that showcase these services",
          href: "/portfolio",
          relevanceScore: 0.8,
          reason: "Validation through examples",
        }
      );
      break;

    case "/contact":
      suggestions.push({
        id: "contact-to-services",
        type: "service",
        title: "Review Service Details",
        description: "Get more information before reaching out",
        href: "/services",
        relevanceScore: 0.7,
        reason: "Last-minute research before contact",
      });
      break;
  }

  // Add suggestions based on user behavior
  if (state.userBehavior.timeOnPage > 30) {
    suggestions.forEach((suggestion) => {
      suggestion.relevanceScore += 0.1; // Boost for engaged users
    });
  }

  suggestions.forEach((suggestion) => {
    dispatch({ type: "ADD_CONTENT_SUGGESTION", payload: suggestion });
  });
}

function generateNextSteps(
  pathname: string,
  state: NavigationState,
  dispatch: React.Dispatch<NavigationAction>
) {
  const nextSteps: NextStepRecommendation[] = [];

  switch (pathname) {
    case "/":
      nextSteps.push(
        {
          id: "explore-work",
          title: "Explore My Work",
          description: "Browse through detailed project case studies",
          action: "View Portfolio",
          href: "/portfolio",
          priority: "high",
          category: "explore",
        },
        {
          id: "learn-about",
          title: "Learn About Me",
          description: "Discover my background, skills, and approach",
          action: "Read About",
          href: "/about",
          priority: "medium",
          category: "learn",
        }
      );
      break;

    case "/about":
      nextSteps.push(
        {
          id: "view-examples",
          title: "See Examples",
          description: "View projects that showcase the skills mentioned",
          action: "Browse Portfolio",
          href: "/portfolio",
          priority: "high",
          category: "explore",
        },
        {
          id: "explore-services",
          title: "Explore Services",
          description: "Learn how these skills translate to your project",
          action: "View Services",
          href: "/services",
          priority: "medium",
          category: "learn",
        }
      );
      break;

    case "/portfolio":
      nextSteps.push(
        {
          id: "get-quote",
          title: "Get a Quote",
          description: "Discuss your project and get a personalized estimate",
          action: "Contact Me",
          href: "/contact",
          priority: "high",
          category: "contact",
        },
        {
          id: "learn-process",
          title: "Learn My Process",
          description: "Understand how I deliver results like these",
          action: "View Services",
          href: "/services",
          priority: "medium",
          category: "learn",
        }
      );
      break;

    case "/services":
      nextSteps.push(
        {
          id: "start-project",
          title: "Start Your Project",
          description: "Schedule a consultation to discuss your needs",
          action: "Get Started",
          href: "/contact",
          priority: "high",
          category: "contact",
        },
        {
          id: "see-examples",
          title: "See Examples",
          description: "View projects that demonstrate these services",
          action: "View Portfolio",
          href: "/portfolio",
          priority: "medium",
          category: "explore",
        }
      );
      break;

    case "/contact":
      nextSteps.push({
        id: "review-services",
        title: "Review Services",
        description: "Get more details before reaching out",
        action: "View Services",
        href: "/services",
        priority: "medium",
        category: "learn",
      });
      break;
  }

  dispatch({ type: "UPDATE_NEXT_STEPS", payload: nextSteps });
}
