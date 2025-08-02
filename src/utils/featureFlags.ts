// Feature flag management utilities

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: "ui" | "performance" | "experimental" | "analytics";
  impact: "low" | "medium" | "high";
  abTestGroup?: "A" | "B" | "control";
  rolloutPercentage?: number;
  dependencies?: string[];
  expiresAt?: Date;
}

export interface ABTestConfig {
  id: string;
  name: string;
  description: string;
  variants: {
    id: string;
    name: string;
    weight: number;
    config: Record<string, unknown>;
  }[];
  enabled: boolean;
  startDate: Date;
  endDate?: Date;
}

// Feature flag manager
export class FeatureFlagManager {
  private static instance: FeatureFlagManager;
  private flags: Map<string, FeatureFlag> = new Map();
  private abTests: Map<string, ABTestConfig> = new Map();
  private userGroup: string | null = null;

  static getInstance(): FeatureFlagManager {
    if (!FeatureFlagManager.instance) {
      FeatureFlagManager.instance = new FeatureFlagManager();
    }
    return FeatureFlagManager.instance;
  }

  constructor() {
    this.initializeDefaultFlags();
    this.initializeUserGroup();
  }

  private initializeDefaultFlags(): void {
    const defaultFlags: FeatureFlag[] = [
      {
        id: "enhanced-animations",
        name: "Enhanced Animations",
        description: "Enable advanced CSS animations and transitions",
        enabled: false,
        category: "ui",
        impact: "medium",
      },
      {
        id: "lazy-loading",
        name: "Lazy Loading",
        description: "Enable lazy loading for images and components",
        enabled: true,
        category: "performance",
        impact: "high",
      },
      {
        id: "service-worker",
        name: "Service Worker",
        description: "Enable service worker for offline functionality",
        enabled: false,
        category: "performance",
        impact: "high",
      },
      {
        id: "analytics-enhanced",
        name: "Enhanced Analytics",
        description: "Enable detailed user behavior tracking",
        enabled: false,
        category: "analytics",
        impact: "low",
      },
      {
        id: "experimental-ui",
        name: "Experimental UI",
        description: "Enable experimental user interface components",
        enabled: false,
        category: "experimental",
        impact: "medium",
      },
      {
        id: "ab-test-hero",
        name: "A/B Test: Hero Section",
        description: "Test different hero section layouts",
        enabled: false,
        category: "experimental",
        impact: "low",
        abTestGroup: "A",
      },
      {
        id: "performance-monitoring",
        name: "Performance Monitoring",
        description: "Enable real-time performance monitoring",
        enabled: false,
        category: "performance",
        impact: "low",
      },
      {
        id: "debug-mode",
        name: "Debug Mode",
        description: "Enable debug logging and information display",
        enabled: false,
        category: "experimental",
        impact: "low",
      },
      {
        id: "component-inspector",
        name: "Component Inspector",
        description: "Enable component inspection and profiling tools",
        enabled: false,
        category: "experimental",
        impact: "low",
      },
      {
        id: "bundle-analyzer",
        name: "Bundle Analyzer",
        description: "Enable bundle size analysis and optimization suggestions",
        enabled: false,
        category: "performance",
        impact: "low",
      },
    ];

    defaultFlags.forEach((flag) => {
      this.flags.set(flag.id, flag);
    });
  }

  private initializeUserGroup(): void {
    if (typeof window !== "undefined") {
      // Generate or retrieve user group for A/B testing
      let userGroup = localStorage.getItem("ab-test-user-group");
      if (!userGroup) {
        // Assign user to a group based on a hash of their session
        const sessionId = this.getOrCreateSessionId();
        const hash = this.hashString(sessionId);
        userGroup = hash % 2 === 0 ? "A" : "B";
        localStorage.setItem("ab-test-user-group", userGroup);
      }
      this.userGroup = userGroup;
    }
  }

  private getOrCreateSessionId(): string {
    if (typeof window === "undefined") return "default";

    let sessionId = sessionStorage.getItem("session-id");
    if (!sessionId) {
      sessionId =
        Date.now().toString(36) + Math.random().toString(36).substr(2);
      sessionStorage.setItem("session-id", sessionId);
    }
    return sessionId;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Flag management methods
  isEnabled(flagId: string): boolean {
    const flag = this.flags.get(flagId);
    if (!flag) return false;

    // Check if flag is expired
    if (flag.expiresAt && new Date() > flag.expiresAt) {
      return false;
    }

    // Check dependencies
    if (flag.dependencies) {
      const dependenciesMet = flag.dependencies.every((depId) =>
        this.isEnabled(depId)
      );
      if (!dependenciesMet) return false;
    }

    // Check rollout percentage
    if (flag.rolloutPercentage !== undefined) {
      const sessionId = this.getOrCreateSessionId();
      const hash = this.hashString(sessionId + flagId);
      const userPercentile = (hash % 100) + 1;
      if (userPercentile > flag.rolloutPercentage) return false;
    }

    // Check A/B test group
    if (flag.abTestGroup && this.userGroup !== flag.abTestGroup) {
      return false;
    }

    return flag.enabled;
  }

  enableFlag(flagId: string): void {
    const flag = this.flags.get(flagId);
    if (flag) {
      flag.enabled = true;
      this.saveFlags();
    }
  }

  disableFlag(flagId: string): void {
    const flag = this.flags.get(flagId);
    if (flag) {
      flag.enabled = false;
      this.saveFlags();
    }
  }

  toggleFlag(flagId: string): boolean {
    const flag = this.flags.get(flagId);
    if (flag) {
      flag.enabled = !flag.enabled;
      this.saveFlags();
      return flag.enabled;
    }
    return false;
  }

  getFlag(flagId: string): FeatureFlag | undefined {
    return this.flags.get(flagId);
  }

  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  getFlagsByCategory(category: FeatureFlag["category"]): FeatureFlag[] {
    return Array.from(this.flags.values()).filter(
      (flag) => flag.category === category
    );
  }

  // A/B Testing methods
  getABTestVariant(testId: string): string | null {
    const test = this.abTests.get(testId);
    if (!test || !test.enabled) return null;

    // Check if test is active
    const now = new Date();
    if (now < test.startDate || (test.endDate && now > test.endDate)) {
      return null;
    }

    // Determine variant based on user group and weights
    const sessionId = this.getOrCreateSessionId();
    const hash = this.hashString(sessionId + testId);
    const randomValue = hash % 100;

    let cumulativeWeight = 0;
    for (const variant of test.variants) {
      cumulativeWeight += variant.weight;
      if (randomValue < cumulativeWeight) {
        return variant.id;
      }
    }

    return test.variants[0]?.id || null;
  }

  getABTestConfig(
    testId: string,
    variantId: string
  ): Record<string, unknown> | null {
    const test = this.abTests.get(testId);
    if (!test) return null;

    const variant = test.variants.find((v) => v.id === variantId);
    return variant?.config || null;
  }

  // Persistence methods
  private saveFlags(): void {
    if (typeof window !== "undefined") {
      const flagsData = Array.from(this.flags.entries()).map(([id, flag]) => ({
        id,
        enabled: flag.enabled,
      }));
      localStorage.setItem("feature-flags", JSON.stringify(flagsData));
    }
  }

  loadFlags(): void {
    if (typeof window !== "undefined") {
      try {
        const savedFlags = localStorage.getItem("feature-flags");
        if (savedFlags) {
          const flagsData = JSON.parse(savedFlags);
          flagsData.forEach(
            ({ id, enabled }: { id: string; enabled: boolean }) => {
              const flag = this.flags.get(id);
              if (flag) {
                flag.enabled = enabled;
              }
            }
          );
        }
      } catch (error) {
        console.error("Error loading feature flags:", error);
      }
    }
  }

  // Analytics and reporting
  getFlagUsageStats(): Record<
    string,
    { enabled: boolean; lastToggled?: Date }
  > {
    const stats: Record<string, { enabled: boolean; lastToggled?: Date }> = {};

    this.flags.forEach((flag, id) => {
      stats[id] = {
        enabled: flag.enabled,
        // In a real implementation, you'd track when flags were last toggled
      };
    });

    return stats;
  }

  // Export/Import functionality
  exportFlags(): string {
    const exportData = {
      timestamp: new Date().toISOString(),
      flags: Array.from(this.flags.entries()),
      userGroup: this.userGroup,
    };
    return JSON.stringify(exportData, null, 2);
  }

  importFlags(data: string): boolean {
    try {
      const importData = JSON.parse(data);
      if (importData.flags && Array.isArray(importData.flags)) {
        importData.flags.forEach(([id, flag]: [string, FeatureFlag]) => {
          this.flags.set(id, flag);
        });
        this.saveFlags();
        return true;
      }
    } catch (error) {
      console.error("Error importing feature flags:", error);
    }
    return false;
  }

  // Reset to defaults
  resetToDefaults(): void {
    this.flags.clear();
    this.initializeDefaultFlags();
    this.saveFlags();
  }
}

// Export singleton instance
export const featureFlagManager = FeatureFlagManager.getInstance();

// Utility functions
export const useFeatureFlag = (flagId: string): boolean => {
  return featureFlagManager.isEnabled(flagId);
};

export const withFeatureFlag = <
  T extends React.ComponentType<Record<string, unknown>>
>(
  flagId: string,
  Component: T,
  FallbackComponent?: React.ComponentType<Record<string, unknown>>
): React.ComponentType<React.ComponentProps<T>> => {
  const FeatureFlagWrapper = (props: React.ComponentProps<T>) => {
    const isEnabled = useFeatureFlag(flagId);

    if (isEnabled) {
      return React.createElement(Component, props);
    }

    if (FallbackComponent) {
      return React.createElement(FallbackComponent, props);
    }

    return null;
  };

  FeatureFlagWrapper.displayName = `withFeatureFlag(${
    Component.displayName || Component.name || "Component"
  })`;
  return FeatureFlagWrapper;
};

// React import for JSX
import React from "react";
