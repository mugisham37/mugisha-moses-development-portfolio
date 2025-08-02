// User preference synchronization types
export interface UserPreferences {
  id: string;
  userId?: string;
  sessionId: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;

  // Navigation preferences
  navigation: NavigationPreferences;

  // Search preferences
  search: SearchPreferences;

  // Display preferences
  display: DisplayPreferences;

  // Accessibility preferences
  accessibility: AccessibilityPreferences;

  // Privacy preferences
  privacy: PrivacyPreferences;

  // Custom preferences
  custom: Record<string, any>;
}

export interface NavigationPreferences {
  showBreadcrumbs: boolean;
  showSuggestions: boolean;
  showNextSteps: boolean;
  maxSuggestions: number;
  contextAwareness: "high" | "medium" | "low" | "off";
  trackUserJourney: boolean;
  rememberLastPage: boolean;
}

export interface SearchPreferences {
  saveHistory: boolean;
  maxHistoryItems: number;
  showSuggestions: boolean;
  enableAutoComplete: boolean;
  defaultSortBy: "relevance" | "date" | "title" | "type";
  defaultFilters: {
    types: string[];
    categories: string[];
  };
  enableDiscovery: boolean;
  discoveryFrequency: "high" | "medium" | "low";
}

export interface DisplayPreferences {
  theme: "light" | "dark" | "auto" | "high-contrast";
  fontSize: "small" | "medium" | "large" | "extra-large";
  fontFamily: "default" | "dyslexia-friendly" | "high-readability";
  layoutDensity: "compact" | "comfortable" | "spacious";
  animationsEnabled: boolean;
  reducedMotion: boolean;
  colorScheme: string;
}

export interface AccessibilityPreferences {
  screenReaderOptimized: boolean;
  keyboardNavigationEnhanced: boolean;
  focusIndicatorsEnhanced: boolean;
  contrastRatio: "normal" | "high" | "maximum";
  textToSpeech: boolean;
  captionsEnabled: boolean;
  audioDescriptions: boolean;
}

export interface PrivacyPreferences {
  trackingEnabled: boolean;
  analyticsEnabled: boolean;
  cookiesAccepted: boolean;
  dataCollection: "all" | "essential" | "none";
  shareUsageData: boolean;
  personalizedContent: boolean;
}

export interface PreferenceSync {
  id: string;
  timestamp: Date;
  action: "create" | "update" | "delete" | "merge";
  preferences: Partial<UserPreferences>;
  source: "local" | "remote" | "import";
  conflicts?: PreferenceConflict[];
}

export interface PreferenceConflict {
  key: string;
  localValue: any;
  remoteValue: any;
  resolution: "local" | "remote" | "merge" | "manual";
  timestamp: Date;
}

export interface PreferenceBackup {
  id: string;
  preferences: UserPreferences;
  timestamp: Date;
  description: string;
  automatic: boolean;
}

export interface PreferenceImportExport {
  version: string;
  timestamp: Date;
  preferences: UserPreferences;
  metadata: {
    source: string;
    userAgent: string;
    platform: string;
  };
}
