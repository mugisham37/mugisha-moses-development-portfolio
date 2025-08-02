"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import {
  UserPreferences,
  PreferenceSync,
  PreferenceConflict,
  PreferenceBackup,
  PreferenceImportExport,
} from "@/types/preferences";

interface PreferencesState {
  preferences: UserPreferences;
  isLoading: boolean;
  isSyncing: boolean;
  lastSync: Date | null;
  conflicts: PreferenceConflict[];
  backups: PreferenceBackup[];
  syncHistory: PreferenceSync[];
}

type PreferencesAction =
  | { type: "SET_PREFERENCES"; payload: UserPreferences }
  | { type: "UPDATE_PREFERENCE"; payload: { key: string; value: any } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SYNCING"; payload: boolean }
  | { type: "ADD_CONFLICT"; payload: PreferenceConflict }
  | {
      type: "RESOLVE_CONFLICT";
      payload: { conflictId: string; resolution: any };
    }
  | { type: "ADD_BACKUP"; payload: PreferenceBackup }
  | { type: "ADD_SYNC_RECORD"; payload: PreferenceSync }
  | { type: "RESET_PREFERENCES" };

const defaultPreferences: UserPreferences = {
  id: "",
  sessionId: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  version: 1,
  navigation: {
    showBreadcrumbs: true,
    showSuggestions: true,
    showNextSteps: true,
    maxSuggestions: 5,
    contextAwareness: "medium",
    trackUserJourney: true,
    rememberLastPage: true,
  },
  search: {
    saveHistory: true,
    maxHistoryItems: 50,
    showSuggestions: true,
    enableAutoComplete: true,
    defaultSortBy: "relevance",
    defaultFilters: {
      types: [],
      categories: [],
    },
    enableDiscovery: true,
    discoveryFrequency: "medium",
  },
  display: {
    theme: "auto",
    fontSize: "medium",
    fontFamily: "default",
    layoutDensity: "comfortable",
    animationsEnabled: true,
    reducedMotion: false,
    colorScheme: "default",
  },
  accessibility: {
    screenReaderOptimized: false,
    keyboardNavigationEnhanced: false,
    focusIndicatorsEnhanced: false,
    contrastRatio: "normal",
    textToSpeech: false,
    captionsEnabled: false,
    audioDescriptions: false,
  },
  privacy: {
    trackingEnabled: true,
    analyticsEnabled: true,
    cookiesAccepted: false,
    dataCollection: "essential",
    shareUsageData: false,
    personalizedContent: true,
  },
  custom: {},
};

const initialState: PreferencesState = {
  preferences: defaultPreferences,
  isLoading: false,
  isSyncing: false,
  lastSync: null,
  conflicts: [],
  backups: [],
  syncHistory: [],
};

function preferencesReducer(
  state: PreferencesState,
  action: PreferencesAction
): PreferencesState {
  switch (action.type) {
    case "SET_PREFERENCES":
      return {
        ...state,
        preferences: {
          ...action.payload,
          updatedAt: new Date(),
          version: action.payload.version + 1,
        },
      };

    case "UPDATE_PREFERENCE":
      const updatedPreferences = { ...state.preferences };
      const keys = action.payload.key.split(".");
      let current: any = updatedPreferences;

      // Navigate to the nested property
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      // Set the value
      current[keys[keys.length - 1]] = action.payload.value;

      return {
        ...state,
        preferences: {
          ...updatedPreferences,
          updatedAt: new Date(),
          version: updatedPreferences.version + 1,
        },
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_SYNCING":
      return {
        ...state,
        isSyncing: action.payload,
        lastSync: action.payload ? state.lastSync : new Date(),
      };

    case "ADD_CONFLICT":
      return {
        ...state,
        conflicts: [...state.conflicts, action.payload],
      };

    case "RESOLVE_CONFLICT":
      return {
        ...state,
        conflicts: state.conflicts.filter(
          (c) => c.key !== action.payload.conflictId
        ),
      };

    case "ADD_BACKUP":
      return {
        ...state,
        backups: [action.payload, ...state.backups.slice(0, 9)], // Keep last 10 backups
      };

    case "ADD_SYNC_RECORD":
      return {
        ...state,
        syncHistory: [action.payload, ...state.syncHistory.slice(0, 19)], // Keep last 20 sync records
      };

    case "RESET_PREFERENCES":
      return {
        ...state,
        preferences: {
          ...defaultPreferences,
          id: state.preferences.id,
          sessionId: state.preferences.sessionId,
          createdAt: state.preferences.createdAt,
          updatedAt: new Date(),
          version: state.preferences.version + 1,
        },
      };

    default:
      return state;
  }
}

const PreferencesContext = createContext<{
  state: PreferencesState;
  dispatch: React.Dispatch<PreferencesAction>;
  updatePreference: (key: string, value: any) => void;
  syncPreferences: () => Promise<void>;
  exportPreferences: () => PreferenceImportExport;
  importPreferences: (data: PreferenceImportExport) => Promise<void>;
  createBackup: (description?: string) => void;
  restoreBackup: (backupId: string) => void;
  resetPreferences: () => void;
} | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(preferencesReducer, {
    ...initialState,
    preferences: {
      ...defaultPreferences,
      id:
        typeof window !== "undefined"
          ? `pref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          : "pref_default",
      sessionId:
        typeof window !== "undefined"
          ? `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          : "session_default",
    },
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    const loadPreferences = async () => {
      dispatch({ type: "SET_LOADING", payload: true });

      try {
        const stored = localStorage.getItem("userPreferences");
        if (stored) {
          const parsed = JSON.parse(stored);
          dispatch({ type: "SET_PREFERENCES", payload: parsed });
        }
      } catch (error) {
        console.error("Failed to load preferences:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    if (typeof window !== "undefined") {
      loadPreferences();
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined" && !state.isLoading) {
      try {
        localStorage.setItem(
          "userPreferences",
          JSON.stringify(state.preferences)
        );
      } catch (error) {
        console.error("Failed to save preferences:", error);
      }
    }
  }, [state.preferences, state.isLoading]);

  // Auto-backup preferences periodically
  useEffect(() => {
    const interval = setInterval(() => {
      createBackup("Automatic backup");
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const updatePreference = (key: string, value: any) => {
    dispatch({ type: "UPDATE_PREFERENCE", payload: { key, value } });
  };

  const syncPreferences = async () => {
    dispatch({ type: "SET_SYNCING", payload: true });

    try {
      // Simulate sync with remote server
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const syncRecord: PreferenceSync = {
        id: `sync_${Date.now()}`,
        timestamp: new Date(),
        action: "update",
        preferences: state.preferences,
        source: "local",
      };

      dispatch({ type: "ADD_SYNC_RECORD", payload: syncRecord });
    } catch (error) {
      console.error("Failed to sync preferences:", error);
    } finally {
      dispatch({ type: "SET_SYNCING", payload: false });
    }
  };

  const exportPreferences = (): PreferenceImportExport => {
    return {
      version: "1.0.0",
      timestamp: new Date(),
      preferences: state.preferences,
      metadata: {
        source: "user-export",
        userAgent: navigator.userAgent,
        platform: navigator.platform,
      },
    };
  };

  const importPreferences = async (data: PreferenceImportExport) => {
    try {
      // Create backup before import
      createBackup("Before import");

      // Validate and merge preferences
      const mergedPreferences = {
        ...state.preferences,
        ...data.preferences,
        id: state.preferences.id,
        sessionId: state.preferences.sessionId,
        updatedAt: new Date(),
        version: state.preferences.version + 1,
      };

      dispatch({ type: "SET_PREFERENCES", payload: mergedPreferences });

      const syncRecord: PreferenceSync = {
        id: `import_${Date.now()}`,
        timestamp: new Date(),
        action: "update",
        preferences: mergedPreferences,
        source: "import",
      };

      dispatch({ type: "ADD_SYNC_RECORD", payload: syncRecord });
    } catch (error) {
      console.error("Failed to import preferences:", error);
      throw error;
    }
  };

  const createBackup = (description = "Manual backup") => {
    const backup: PreferenceBackup = {
      id: `backup_${Date.now()}`,
      preferences: { ...state.preferences },
      timestamp: new Date(),
      description,
      automatic: description.includes("Automatic"),
    };

    dispatch({ type: "ADD_BACKUP", payload: backup });
  };

  const restoreBackup = (backupId: string) => {
    const backup = state.backups.find((b) => b.id === backupId);
    if (backup) {
      dispatch({ type: "SET_PREFERENCES", payload: backup.preferences });

      const syncRecord: PreferenceSync = {
        id: `restore_${Date.now()}`,
        timestamp: new Date(),
        action: "update",
        preferences: backup.preferences,
        source: "local",
      };

      dispatch({ type: "ADD_SYNC_RECORD", payload: syncRecord });
    }
  };

  const resetPreferences = () => {
    createBackup("Before reset");
    dispatch({ type: "RESET_PREFERENCES" });
  };

  return (
    <PreferencesContext.Provider
      value={{
        state,
        dispatch,
        updatePreference,
        syncPreferences,
        exportPreferences,
        importPreferences,
        createBackup,
        restoreBackup,
        resetPreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
