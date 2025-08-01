"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import {
  UserSettings,
  EnhancedProject,
  EnhancedService,
  ProjectFilter,
  SearchConfig,
  SearchResult,
  ConsultationBooking,
  ProjectInquiry,
} from "@/types/enhanced";

// Action types for the reducer
export type AppAction =
  | { type: "SET_USER_SETTINGS"; payload: Partial<UserSettings> }
  | { type: "SET_PROJECTS"; payload: EnhancedProject[] }
  | { type: "SET_SERVICES"; payload: EnhancedService[] }
  | { type: "SET_PROJECT_FILTER"; payload: ProjectFilter }
  | { type: "SET_SEARCH_CONFIG"; payload: SearchConfig }
  | { type: "SET_SEARCH_RESULTS"; payload: SearchResult<EnhancedProject> }
  | { type: "SET_LOADING"; payload: { key: string; loading: boolean } }
  | { type: "SET_ERROR"; payload: { key: string; error: string | null } }
  | { type: "ADD_BOOKING"; payload: ConsultationBooking }
  | { type: "ADD_INQUIRY"; payload: ProjectInquiry }
  | {
      type: "SET_MODAL_STATE";
      payload: { modalId: string; isOpen: boolean; data?: any };
    }
  | { type: "RESET_FILTERS" }
  | { type: "TOGGLE_FAVORITE_PROJECT"; payload: string }
  | { type: "SET_VIEW_MODE"; payload: "grid" | "list" | "masonry" };

// Application state interface
export interface AppState {
  userSettings: UserSettings;
  projects: EnhancedProject[];
  services: EnhancedService[];
  projectFilter: ProjectFilter;
  searchConfig: SearchConfig;
  searchResults: SearchResult<EnhancedProject> | null;
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  bookings: ConsultationBooking[];
  inquiries: ProjectInquiry[];
  modals: Record<string, { isOpen: boolean; data?: any }>;
  favoriteProjects: string[];
  viewMode: "grid" | "list" | "masonry";
}

// Default user settings
const defaultUserSettings: UserSettings = {
  theme: {
    colorScheme: "auto",
    primaryColor: "#000000",
    accentColor: "#ffff00",
    layoutDensity: "comfortable",
    animationsEnabled: true,
    reducedMotion: false,
  },
  accessibility: {
    fontSize: "medium",
    fontFamily: "default",
    contrastRatio: "normal",
    focusIndicators: true,
    screenReaderOptimized: false,
    keyboardNavigation: true,
    audioDescriptions: false,
    captionsEnabled: false,
  },
  notifications: {
    emailUpdates: true,
    projectStatusNotifications: true,
    marketingCommunications: false,
    newsletterSubscription: false,
    emergencyContacts: true,
    frequency: "weekly",
    preferredTime: "09:00",
    timezone: "UTC",
  },
  privacy: {
    analyticsEnabled: true,
    cookiesAccepted: false,
    dataCollection: "standard",
    thirdPartyIntegrations: true,
    locationTracking: false,
    personalizedContent: true,
    dataRetention: "2years",
  },
  preferences: {
    language: "en",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    defaultView: "grid",
    itemsPerPage: 12,
    autoSave: true,
    confirmActions: true,
  },
  advanced: {
    developerMode: false,
    debugMode: false,
    performanceMonitoring: false,
    featureFlags: {},
    experimentalFeatures: false,
  },
};

// Default search configuration
const defaultSearchConfig: SearchConfig = {
  query: "",
  filters: {},
  sortBy: "relevance",
  sortOrder: "desc",
  page: 1,
  limit: 12,
};

// Initial state
const initialState: AppState = {
  userSettings: defaultUserSettings,
  projects: [],
  services: [],
  projectFilter: {},
  searchConfig: defaultSearchConfig,
  searchResults: null,
  loading: {},
  errors: {},
  bookings: [],
  inquiries: [],
  modals: {},
  favoriteProjects: [],
  viewMode: "grid",
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER_SETTINGS":
      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          ...action.payload,
        },
      };

    case "SET_PROJECTS":
      return {
        ...state,
        projects: action.payload,
      };

    case "SET_SERVICES":
      return {
        ...state,
        services: action.payload,
      };

    case "SET_PROJECT_FILTER":
      return {
        ...state,
        projectFilter: action.payload,
      };

    case "SET_SEARCH_CONFIG":
      return {
        ...state,
        searchConfig: action.payload,
      };

    case "SET_SEARCH_RESULTS":
      return {
        ...state,
        searchResults: action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.loading,
        },
      };

    case "SET_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.error,
        },
      };

    case "ADD_BOOKING":
      return {
        ...state,
        bookings: [...state.bookings, action.payload],
      };

    case "ADD_INQUIRY":
      return {
        ...state,
        inquiries: [...state.inquiries, action.payload],
      };

    case "SET_MODAL_STATE":
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload.modalId]: {
            isOpen: action.payload.isOpen,
            data: action.payload.data,
          },
        },
      };

    case "RESET_FILTERS":
      return {
        ...state,
        projectFilter: {},
        searchConfig: defaultSearchConfig,
        searchResults: null,
      };

    case "TOGGLE_FAVORITE_PROJECT":
      const projectId = action.payload;
      const isFavorite = state.favoriteProjects.includes(projectId);
      return {
        ...state,
        favoriteProjects: isFavorite
          ? state.favoriteProjects.filter((id) => id !== projectId)
          : [...state.favoriteProjects, projectId],
      };

    case "SET_VIEW_MODE":
      return {
        ...state,
        viewMode: action.payload,
      };

    default:
      return state;
  }
}

// Context creation
const EnhancedAppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
export function EnhancedAppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("userSettings");
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        dispatch({ type: "SET_USER_SETTINGS", payload: parsedSettings });
      }

      const savedFavorites = localStorage.getItem("favoriteProjects");
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        // We need to handle this in the reducer, but for now we'll set it directly
        // This is a limitation of the current approach - we should improve this
      }

      const savedViewMode = localStorage.getItem("viewMode") as
        | "grid"
        | "list"
        | "masonry";
      if (savedViewMode) {
        dispatch({ type: "SET_VIEW_MODE", payload: savedViewMode });
      }
    } catch (error) {
      console.error("Error loading saved settings:", error);
    }
  }, []);

  // Save user settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("userSettings", JSON.stringify(state.userSettings));
    } catch (error) {
      console.error("Error saving user settings:", error);
    }
  }, [state.userSettings]);

  // Save favorite projects to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(
        "favoriteProjects",
        JSON.stringify(state.favoriteProjects)
      );
    } catch (error) {
      console.error("Error saving favorite projects:", error);
    }
  }, [state.favoriteProjects]);

  // Save view mode to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("viewMode", state.viewMode);
    } catch (error) {
      console.error("Error saving view mode:", error);
    }
  }, [state.viewMode]);

  return (
    <EnhancedAppContext.Provider value={{ state, dispatch }}>
      {children}
    </EnhancedAppContext.Provider>
  );
}

// Custom hook to use the context
export function useEnhancedApp() {
  const context = useContext(EnhancedAppContext);
  if (!context) {
    throw new Error(
      "useEnhancedApp must be used within an EnhancedAppProvider"
    );
  }
  return context;
}

// Selector hooks for specific parts of the state
export function useUserSettings() {
  const { state, dispatch } = useEnhancedApp();

  const updateSettings = (settings: Partial<UserSettings>) => {
    dispatch({ type: "SET_USER_SETTINGS", payload: settings });
  };

  return {
    settings: state.userSettings,
    updateSettings,
  };
}

export function useProjects() {
  const { state, dispatch } = useEnhancedApp();

  const setProjects = (projects: EnhancedProject[]) => {
    dispatch({ type: "SET_PROJECTS", payload: projects });
  };

  const toggleFavorite = (projectId: string) => {
    dispatch({ type: "TOGGLE_FAVORITE_PROJECT", payload: projectId });
  };

  return {
    projects: state.projects,
    favoriteProjects: state.favoriteProjects,
    setProjects,
    toggleFavorite,
  };
}

export function useProjectFilter() {
  const { state, dispatch } = useEnhancedApp();

  const setFilter = (filter: ProjectFilter) => {
    dispatch({ type: "SET_PROJECT_FILTER", payload: filter });
  };

  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" });
  };

  return {
    filter: state.projectFilter,
    setFilter,
    resetFilters,
  };
}

export function useSearch() {
  const { state, dispatch } = useEnhancedApp();

  const setSearchConfig = (config: SearchConfig) => {
    dispatch({ type: "SET_SEARCH_CONFIG", payload: config });
  };

  const setSearchResults = (results: SearchResult<EnhancedProject>) => {
    dispatch({ type: "SET_SEARCH_RESULTS", payload: results });
  };

  return {
    searchConfig: state.searchConfig,
    searchResults: state.searchResults,
    setSearchConfig,
    setSearchResults,
  };
}

export function useModals() {
  const { state, dispatch } = useEnhancedApp();

  const openModal = (modalId: string, data?: any) => {
    dispatch({
      type: "SET_MODAL_STATE",
      payload: { modalId, isOpen: true, data },
    });
  };

  const closeModal = (modalId: string) => {
    dispatch({
      type: "SET_MODAL_STATE",
      payload: { modalId, isOpen: false },
    });
  };

  const getModalState = (modalId: string) => {
    return state.modals[modalId] || { isOpen: false, data: null };
  };

  return {
    openModal,
    closeModal,
    getModalState,
  };
}

export function useLoadingAndErrors() {
  const { state, dispatch } = useEnhancedApp();

  const setLoading = (key: string, loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: { key, loading } });
  };

  const setError = (key: string, error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: { key, error } });
  };

  const isLoading = (key: string) => state.loading[key] || false;
  const getError = (key: string) => state.errors[key] || null;

  return {
    setLoading,
    setError,
    isLoading,
    getError,
  };
}

export function useViewMode() {
  const { state, dispatch } = useEnhancedApp();

  const setViewMode = (mode: "grid" | "list" | "masonry") => {
    dispatch({ type: "SET_VIEW_MODE", payload: mode });
  };

  return {
    viewMode: state.viewMode,
    setViewMode,
  };
}
