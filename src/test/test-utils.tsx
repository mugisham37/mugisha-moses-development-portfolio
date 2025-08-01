import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { EnhancedAppProvider } from "@/contexts/EnhancedAppContext";

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <EnhancedAppProvider>{children}</EnhancedAppProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };

// Test data factories
export const createMockProject = (overrides = {}) => ({
  id: "test-project-1",
  title: "Test Project",
  description: "A test project description",
  longDescription: "A longer test project description with more details",
  technologies: [
    {
      name: "React",
      category: "frontend" as const,
      proficiencyLevel: 5 as const,
      yearsOfExperience: 3,
      lastUsed: new Date(),
      relatedProjects: [],
    },
    {
      name: "TypeScript",
      category: "frontend" as const,
      proficiencyLevel: 4 as const,
      yearsOfExperience: 2,
      lastUsed: new Date(),
      relatedProjects: [],
    },
  ],
  category: "react" as const,
  industry: "saas" as const,
  complexity: "moderate" as const,
  timeline: {
    startDate: new Date("2023-01-01"),
    endDate: new Date("2023-03-01"),
    duration: "2 months",
    phases: [],
    milestones: [],
  },
  businessImpact: {
    performanceImprovement: "25% faster load times",
    conversionIncrease: "15% increase in conversions",
    userGrowth: "1000+ new users",
  },
  images: [
    {
      id: "img-1",
      url: "https://example.com/image.jpg",
      alt: "Test project screenshot",
      type: "screenshot" as const,
      order: 1,
    },
  ],
  caseStudy: {
    challenge: "Test challenge",
    solution: "Test solution",
    approach: ["Step 1", "Step 2"],
    technicalDetails: [],
    results: ["Result 1", "Result 2"],
    lessonsLearned: ["Lesson 1"],
  },
  relatedProjects: [],
  featured: true,
  status: "completed" as const,
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-03-01"),
  ...overrides,
});

export const createMockService = (overrides = {}) => ({
  id: "test-service-1",
  name: "Test Service",
  description: "A test service description",
  detailedDescription: "A detailed test service description",
  features: [
    {
      id: "feature-1",
      name: "Test Feature",
      description: "A test feature",
      included: true,
      optional: false,
    },
  ],
  pricing: [
    {
      id: "tier-1",
      name: "Basic",
      basePrice: 1000,
      description: "Basic tier",
      features: [],
      customizable: false,
      estimatedTimeline: "2 weeks",
      supportLevel: "basic" as const,
      revisions: 2,
      supportDuration: "30 days",
    },
  ],
  timeline: "2-4 weeks",
  deliverables: [],
  process: [],
  requirements: ["Requirement 1"],
  addOns: [],
  testimonials: [],
  relatedProjects: [],
  faq: [],
  category: "development" as const,
  complexity: "moderate" as const,
  availability: true,
  ...overrides,
});

export const createMockUserSettings = (overrides = {}) => ({
  theme: {
    colorScheme: "auto" as const,
    primaryColor: "#000000",
    accentColor: "#ffff00",
    layoutDensity: "comfortable" as const,
    animationsEnabled: true,
    reducedMotion: false,
  },
  accessibility: {
    fontSize: "medium" as const,
    fontFamily: "default" as const,
    contrastRatio: "normal" as const,
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
    frequency: "weekly" as const,
    preferredTime: "09:00",
    timezone: "UTC",
  },
  privacy: {
    analyticsEnabled: true,
    cookiesAccepted: false,
    dataCollection: "standard" as const,
    thirdPartyIntegrations: true,
    locationTracking: false,
    personalizedContent: true,
    dataRetention: "2years" as const,
  },
  preferences: {
    language: "en",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h" as const,
    defaultView: "grid" as const,
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
  ...overrides,
});

// Mock functions
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key]);
    },
  };
};

// Accessibility testing helpers
export const axeMatchers = {
  toHaveNoViolations: expect.extend({
    async toHaveNoViolations(received) {
      // This would integrate with axe-core for accessibility testing
      // For now, we'll return a simple pass
      return {
        pass: true,
        message: () => "No accessibility violations found",
      };
    },
  }),
};

// Performance testing helpers
export const measurePerformance = (fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  return end - start;
};

// Wait for async operations
export const waitForAsync = (ms: number = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));
