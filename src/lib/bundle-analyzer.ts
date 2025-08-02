// Bundle size optimization and analysis utilities

export interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: ChunkInfo[];
  dependencies: DependencyInfo[];
  recommendations: string[];
  score: number;
}

export interface ChunkInfo {
  name: string;
  size: number;
  gzippedSize: number;
  modules: ModuleInfo[];
  loadTime: number;
  isAsync: boolean;
  isEntry: boolean;
}

export interface ModuleInfo {
  name: string;
  size: number;
  reasons: string[];
  isExternal: boolean;
}

export interface DependencyInfo {
  name: string;
  version: string;
  size: number;
  usage: "used" | "unused" | "partial";
  impact: "high" | "medium" | "low";
  alternatives?: string[];
}

// Bundle size thresholds (in bytes)
const BUNDLE_THRESHOLDS = {
  TOTAL_SIZE: {
    good: 250000, // 250KB
    warning: 500000, // 500KB
    critical: 1000000, // 1MB
  },
  CHUNK_SIZE: {
    good: 100000, // 100KB
    warning: 200000, // 200KB
    critical: 500000, // 500KB
  },
  INITIAL_LOAD: {
    good: 150000, // 150KB
    warning: 300000, // 300KB
    critical: 600000, // 600KB
  },
};

export class BundleAnalyzer {
  private static instance: BundleAnalyzer;
  private analysisCache: Map<string, BundleAnalysis> = new Map();

  static getInstance(): BundleAnalyzer {
    if (!BundleAnalyzer.instance) {
      BundleAnalyzer.instance = new BundleAnalyzer();
    }
    return BundleAnalyzer.instance;
  }

  // Analyze current bundle from performance entries
  async analyzeCurrent(): Promise<BundleAnalysis> {
    if (typeof window === "undefined") {
      throw new Error("Bundle analysis only available in browser");
    }

    const cacheKey = window.location.pathname;
    const cached = this.analysisCache.get(cacheKey);

    if (cached && Date.now() - (cached as any).timestamp < 300000) {
      // 5 minutes cache
      return cached;
    }

    const resources = performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[];
    const chunks = this.extractChunkInfo(resources);
    const dependencies = await this.analyzeDependencies(chunks);

    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    const gzippedSize = chunks.reduce(
      (sum, chunk) => sum + chunk.gzippedSize,
      0
    );

    const analysis: BundleAnalysis = {
      totalSize,
      gzippedSize,
      chunks,
      dependencies,
      recommendations: this.generateRecommendations(
        chunks,
        dependencies,
        totalSize
      ),
      score: this.calculateBundleScore(totalSize, chunks),
    };

    // Cache with timestamp
    (analysis as any).timestamp = Date.now();
    this.analysisCache.set(cacheKey, analysis);

    return analysis;
  }

  // Extract chunk information from performance entries
  private extractChunkInfo(
    resources: PerformanceResourceTiming[]
  ): ChunkInfo[] {
    const chunks: ChunkInfo[] = [];

    resources.forEach((resource) => {
      if (this.isJavaScriptChunk(resource.name)) {
        const chunkInfo: ChunkInfo = {
          name: this.extractChunkName(resource.name),
          size: (resource as any).encodedBodySize || 0,
          gzippedSize: (resource as any).transferSize || 0,
          modules: [], // Will be populated if webpack stats are available
          loadTime: resource.responseEnd - resource.startTime,
          isAsync: this.isAsyncChunk(resource.name),
          isEntry: this.isEntryChunk(resource.name),
        };

        chunks.push(chunkInfo);
      }
    });

    return chunks.sort((a, b) => b.size - a.size);
  }

  // Check if resource is a JavaScript chunk
  private isJavaScriptChunk(url: string): boolean {
    return (
      url.includes("/_next/static/chunks/") ||
      url.includes("/_next/static/js/") ||
      (url.endsWith(".js") && !url.includes("node_modules"))
    );
  }

  // Extract chunk name from URL
  private extractChunkName(url: string): string {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    return filename.replace(/\.[a-f0-9]+\.js$/, ".js"); // Remove hash
  }

  // Check if chunk is loaded asynchronously
  private isAsyncChunk(url: string): boolean {
    return !url.includes("/_next/static/js/") || url.includes("lazy");
  }

  // Check if chunk is an entry point
  private isEntryChunk(url: string): boolean {
    return (
      url.includes("/_next/static/js/") &&
      (url.includes("main") || url.includes("_app") || url.includes("pages"))
    );
  }

  // Analyze dependencies (simplified version)
  private async analyzeDependencies(
    chunks: ChunkInfo[]
  ): Promise<DependencyInfo[]> {
    const dependencies: DependencyInfo[] = [];

    // This would ideally parse webpack stats or use build-time analysis
    // For now, we'll provide common dependency analysis
    const commonDependencies = [
      {
        name: "react",
        estimatedSize: 45000,
        usage: "used" as const,
        impact: "high" as const,
        alternatives: ["preact", "solid-js"],
      },
      {
        name: "react-dom",
        estimatedSize: 130000,
        usage: "used" as const,
        impact: "high" as const,
        alternatives: ["preact/compat"],
      },
      {
        name: "framer-motion",
        estimatedSize: 180000,
        usage: "partial" as const,
        impact: "medium" as const,
        alternatives: ["react-spring", "react-transition-group"],
      },
      {
        name: "lucide-react",
        estimatedSize: 50000,
        usage: "partial" as const,
        impact: "low" as const,
        alternatives: ["heroicons", "react-icons"],
      },
      {
        name: "three",
        estimatedSize: 600000,
        usage: "partial" as const,
        impact: "high" as const,
        alternatives: ["babylon.js", "a-frame"],
      },
    ];

    // Estimate which dependencies are present based on chunk sizes
    const totalChunkSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);

    commonDependencies.forEach((dep) => {
      if (totalChunkSize > dep.estimatedSize) {
        dependencies.push({
          name: dep.name,
          version: "unknown",
          size: dep.estimatedSize,
          usage: dep.usage,
          impact: dep.impact,
          alternatives: dep.alternatives,
        });
      }
    });

    return dependencies;
  }

  // Generate optimization recommendations
  private generateRecommendations(
    chunks: ChunkInfo[],
    dependencies: DependencyInfo[],
    totalSize: number
  ): string[] {
    const recommendations: string[] = [];

    // Size-based recommendations
    if (totalSize > BUNDLE_THRESHOLDS.TOTAL_SIZE.critical) {
      recommendations.push(
        "🚨 Bundle size is critically large - consider major refactoring"
      );
      recommendations.push("Split large components into separate chunks");
      recommendations.push("Remove unused dependencies");
    } else if (totalSize > BUNDLE_THRESHOLDS.TOTAL_SIZE.warning) {
      recommendations.push("⚠️ Bundle size is larger than recommended");
      recommendations.push("Enable code splitting for non-critical features");
    }

    // Chunk-specific recommendations
    const largeChunks = chunks.filter(
      (chunk) => chunk.size > BUNDLE_THRESHOLDS.CHUNK_SIZE.warning
    );
    if (largeChunks.length > 0) {
      recommendations.push(
        `Split large chunks: ${largeChunks.map((c) => c.name).join(", ")}`
      );
    }

    // Entry chunk recommendations
    const entryChunks = chunks.filter((chunk) => chunk.isEntry);
    const entrySize = entryChunks.reduce((sum, chunk) => sum + chunk.size, 0);
    if (entrySize > BUNDLE_THRESHOLDS.INITIAL_LOAD.warning) {
      recommendations.push(
        "Reduce initial bundle size by lazy loading non-critical components"
      );
    }

    // Dependency-specific recommendations
    dependencies.forEach((dep) => {
      if (dep.impact === "high" && dep.usage === "partial") {
        recommendations.push(
          `Consider tree-shaking or alternatives for ${dep.name}`
        );
      }
      if (dep.alternatives && dep.size > 100000) {
        recommendations.push(
          `Consider lighter alternative to ${dep.name}: ${dep.alternatives.join(
            ", "
          )}`
        );
      }
    });

    // Async chunk recommendations
    const syncChunks = chunks.filter(
      (chunk) => !chunk.isAsync && !chunk.isEntry
    );
    if (syncChunks.length > 0) {
      recommendations.push(
        "Convert synchronous chunks to async loading where possible"
      );
    }

    // Performance recommendations
    const slowChunks = chunks.filter((chunk) => chunk.loadTime > 1000);
    if (slowChunks.length > 0) {
      recommendations.push("Optimize slow-loading chunks or preload them");
    }

    return recommendations;
  }

  // Calculate bundle score (0-100)
  private calculateBundleScore(totalSize: number, chunks: ChunkInfo[]): number {
    let score = 100;

    // Penalize total size
    if (totalSize > BUNDLE_THRESHOLDS.TOTAL_SIZE.critical) {
      score -= 40;
    } else if (totalSize > BUNDLE_THRESHOLDS.TOTAL_SIZE.warning) {
      score -= 20;
    } else if (totalSize > BUNDLE_THRESHOLDS.TOTAL_SIZE.good) {
      score -= 10;
    }

    // Penalize large chunks
    const largeChunks = chunks.filter(
      (chunk) => chunk.size > BUNDLE_THRESHOLDS.CHUNK_SIZE.warning
    );
    score -= largeChunks.length * 10;

    // Penalize large initial load
    const entryChunks = chunks.filter((chunk) => chunk.isEntry);
    const entrySize = entryChunks.reduce((sum, chunk) => sum + chunk.size, 0);
    if (entrySize > BUNDLE_THRESHOLDS.INITIAL_LOAD.critical) {
      score -= 30;
    } else if (entrySize > BUNDLE_THRESHOLDS.INITIAL_LOAD.warning) {
      score -= 15;
    }

    // Bonus for async chunks
    const asyncChunks = chunks.filter((chunk) => chunk.isAsync);
    score += Math.min(asyncChunks.length * 2, 10);

    return Math.max(0, Math.min(100, score));
  }

  // Get bundle optimization suggestions
  getBundleOptimizationSuggestions(): string[] {
    return [
      // Code splitting suggestions
      "Implement route-based code splitting",
      "Use dynamic imports for heavy components",
      "Split vendor libraries into separate chunks",
      "Lazy load non-critical features",

      // Dependency optimization
      "Remove unused dependencies",
      "Use tree-shaking to eliminate dead code",
      "Replace heavy libraries with lighter alternatives",
      "Use CDN for common libraries",

      // Build optimization
      "Enable compression (gzip/brotli)",
      "Minify JavaScript and CSS",
      "Use webpack bundle analyzer",
      "Optimize images and assets",

      // Loading optimization
      "Preload critical resources",
      "Use resource hints (prefetch, preconnect)",
      "Implement service worker caching",
      "Use HTTP/2 server push",

      // Performance monitoring
      "Monitor bundle size in CI/CD",
      "Set up performance budgets",
      "Track Core Web Vitals",
      "Use performance profiling tools",
    ];
  }

  // Export analysis data
  exportAnalysis(analysis: BundleAnalysis): string {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalSize: this.formatBytes(analysis.totalSize),
        gzippedSize: this.formatBytes(analysis.gzippedSize),
        compressionRatio:
          ((1 - analysis.gzippedSize / analysis.totalSize) * 100).toFixed(1) +
          "%",
        score: analysis.score,
        chunksCount: analysis.chunks.length,
      },
      chunks: analysis.chunks.map((chunk) => ({
        name: chunk.name,
        size: this.formatBytes(chunk.size),
        gzippedSize: this.formatBytes(chunk.gzippedSize),
        loadTime: chunk.loadTime.toFixed(2) + "ms",
        type: chunk.isEntry ? "entry" : chunk.isAsync ? "async" : "sync",
      })),
      dependencies: analysis.dependencies.map((dep) => ({
        name: dep.name,
        size: this.formatBytes(dep.size),
        usage: dep.usage,
        impact: dep.impact,
        alternatives: dep.alternatives?.join(", ") || "none",
      })),
      recommendations: analysis.recommendations,
    };

    return JSON.stringify(report, null, 2);
  }

  // Format bytes for display
  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Clear analysis cache
  clearCache(): void {
    this.analysisCache.clear();
  }

  // Get cached analyses
  getCachedAnalyses(): Array<{ path: string; analysis: BundleAnalysis }> {
    return Array.from(this.analysisCache.entries()).map(([path, analysis]) => ({
      path,
      analysis,
    }));
  }
}

// Webpack bundle analyzer integration
export const webpackBundleAnalyzer = {
  // Generate webpack bundle analyzer report
  generateReport: async (): Promise<void> => {
    if (process.env.NODE_ENV !== "development") {
      console.warn("Bundle analyzer only available in development mode");
      return;
    }

    try {
      // This would trigger webpack bundle analyzer
      const response = await fetch("/api/bundle-analysis");
      const data = await response.json();

      console.log("Bundle analysis report generated:", data);
    } catch (error) {
      console.error("Failed to generate bundle analysis report:", error);
    }
  },

  // Get webpack stats
  getWebpackStats: async (): Promise<any> => {
    try {
      const response = await fetch("/api/webpack-stats");
      return await response.json();
    } catch (error) {
      console.error("Failed to get webpack stats:", error);
      return null;
    }
  },
};

// Bundle size monitoring
export const bundleSizeMonitor = {
  // Monitor bundle size changes
  monitor: (callback: (analysis: BundleAnalysis) => void): (() => void) => {
    const analyzer = BundleAnalyzer.getInstance();
    let isMonitoring = true;

    const checkBundleSize = async () => {
      if (!isMonitoring) return;

      try {
        const analysis = await analyzer.analyzeCurrent();
        callback(analysis);
      } catch (error) {
        console.error("Bundle size monitoring error:", error);
      }

      // Check again in 30 seconds
      setTimeout(checkBundleSize, 30000);
    };

    // Start monitoring
    checkBundleSize();

    // Return stop function
    return () => {
      isMonitoring = false;
    };
  },

  // Set bundle size budget
  setBudget: (budget: { maxSize: number; maxChunkSize: number }): void => {
    BUNDLE_THRESHOLDS.TOTAL_SIZE.warning = budget.maxSize;
    BUNDLE_THRESHOLDS.CHUNK_SIZE.warning = budget.maxChunkSize;
  },

  // Check if bundle exceeds budget
  checkBudget: async (): Promise<{ passed: boolean; violations: string[] }> => {
    const analyzer = BundleAnalyzer.getInstance();
    const analysis = await analyzer.analyzeCurrent();
    const violations: string[] = [];

    if (analysis.totalSize > BUNDLE_THRESHOLDS.TOTAL_SIZE.warning) {
      violations.push(
        `Total bundle size exceeds budget: ${analysis.totalSize} > ${BUNDLE_THRESHOLDS.TOTAL_SIZE.warning}`
      );
    }

    analysis.chunks.forEach((chunk) => {
      if (chunk.size > BUNDLE_THRESHOLDS.CHUNK_SIZE.warning) {
        violations.push(
          `Chunk ${chunk.name} exceeds budget: ${chunk.size} > ${BUNDLE_THRESHOLDS.CHUNK_SIZE.warning}`
        );
      }
    });

    return {
      passed: violations.length === 0,
      violations,
    };
  },
};

// Export singleton instance
export const bundleAnalyzer = BundleAnalyzer.getInstance();
