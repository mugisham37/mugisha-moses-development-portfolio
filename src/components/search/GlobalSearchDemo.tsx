"use client";

import React, { useState } from "react";
import { Search, History, Lightbulb, BarChart3 } from "lucide-react";
import {
  GlobalSearchBar,
  SearchResults,
  SearchHistory,
  ContentDiscovery,
  GlobalSearchModal,
} from "@/components/search";
import { useSearch } from "@/contexts/SearchContext";

interface GlobalSearchDemoProps {
  className?: string;
}

export default function GlobalSearchDemo({
  className = "",
}: GlobalSearchDemoProps) {
  const { state } = useSearch();
  const [showModal, setShowModal] = useState(false);
  const [activeDemo, setActiveDemo] = useState<
    "search" | "history" | "discovery" | "analytics"
  >("search");

  const demoSections = [
    {
      id: "search" as const,
      title: "Global Search",
      icon: <Search size={20} />,
      description:
        "Cross-page search with intelligent suggestions and categorized results",
    },
    {
      id: "history" as const,
      title: "Search History",
      icon: <History size={20} />,
      description:
        "Track search patterns and provide quick access to previous queries",
    },
    {
      id: "discovery" as const,
      title: "Content Discovery",
      icon: <Lightbulb size={20} />,
      description:
        "AI-powered recommendations based on user behavior and interests",
    },
    {
      id: "analytics" as const,
      title: "Search Analytics",
      icon: <BarChart3 size={20} />,
      description: "Insights into search patterns and content performance",
    },
  ];

  return (
    <div className={`global-search-demo ${className}`}>
      {/* Demo Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-4">
          Global Search & Discovery
        </h2>
        <p className="text-lg font-mono font-bold text-foreground/80 max-w-3xl mx-auto">
          Experience intelligent search with cross-page functionality,
          personalized recommendations, and comprehensive analytics.
        </p>
      </div>

      {/* Demo Navigation */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {demoSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveDemo(section.id)}
            className={`p-4 border-3 transition-all duration-200 text-left ${
              activeDemo === section.id
                ? "border-brutalist-yellow bg-brutalist-yellow/10"
                : "border-foreground hover:border-brutalist-yellow/50 hover:bg-brutalist-yellow/5"
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div
                className={`${
                  activeDemo === section.id
                    ? "text-brutalist-yellow"
                    : "text-foreground/60"
                }`}
              >
                {section.icon}
              </div>
              <h3 className="font-mono font-bold text-sm uppercase tracking-wider">
                {section.title}
              </h3>
            </div>
            <p className="text-xs font-mono text-foreground/60 leading-relaxed">
              {section.description}
            </p>
          </button>
        ))}
      </div>

      {/* Demo Content */}
      <div className="border-3 border-foreground bg-background">
        {/* Global Search Demo */}
        {activeDemo === "search" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-mono font-bold text-lg uppercase tracking-wider">
                🔍 Global Search System
              </h3>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 border-2 border-foreground bg-background hover:bg-brutalist-yellow hover:text-black transition-colors duration-200 font-mono font-bold text-sm uppercase tracking-wider"
              >
                Open Full Search
              </button>
            </div>

            <div className="space-y-6">
              {/* Search Bar Demo */}
              <div>
                <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">
                  Intelligent Search Bar
                </h4>
                <GlobalSearchBar
                  placeholder="Try searching for 'React', 'portfolio', or 'services'..."
                  showSuggestions={true}
                />
              </div>

              {/* Search Results */}
              {state.results.length > 0 && (
                <div>
                  <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">
                    Search Results
                  </h4>
                  <SearchResults maxResults={5} showCategories={true} />
                </div>
              )}

              {/* Search Features */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-foreground/5 border border-foreground/20">
                  <h5 className="font-mono font-bold text-xs uppercase tracking-wider mb-2">
                    ✨ Smart Features
                  </h5>
                  <ul className="text-xs font-mono text-foreground/80 space-y-1">
                    <li>• Real-time search suggestions</li>
                    <li>• Autocomplete with context</li>
                    <li>• Keyboard navigation support</li>
                    <li>• Recent searches integration</li>
                  </ul>
                </div>

                <div className="p-4 bg-foreground/5 border border-foreground/20">
                  <h5 className="font-mono font-bold text-xs uppercase tracking-wider mb-2">
                    🎯 Search Scope
                  </h5>
                  <ul className="text-xs font-mono text-foreground/80 space-y-1">
                    <li>• All pages and content</li>
                    <li>• Project portfolios</li>
                    <li>• Service descriptions</li>
                    <li>• Skills and technologies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search History Demo */}
        {activeDemo === "history" && (
          <div className="p-6">
            <h3 className="font-mono font-bold text-lg uppercase tracking-wider mb-6">
              📚 Search History & Analytics
            </h3>
            <SearchHistory maxItems={8} showAnalytics={true} />
          </div>
        )}

        {/* Content Discovery Demo */}
        {activeDemo === "discovery" && (
          <div className="p-6">
            <h3 className="font-mono font-bold text-lg uppercase tracking-wider mb-6">
              💡 Intelligent Content Discovery
            </h3>
            <ContentDiscovery maxItems={6} autoGenerate={true} />
          </div>
        )}

        {/* Analytics Demo */}
        {activeDemo === "analytics" && (
          <div className="p-6">
            <h3 className="font-mono font-bold text-lg uppercase tracking-wider mb-6">
              📊 Search Analytics Dashboard
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="p-4 border-2 border-foreground bg-background text-center">
                <div className="text-2xl font-mono font-bold text-brutalist-yellow mb-2">
                  {state.analytics.totalSearches}
                </div>
                <div className="text-xs font-mono text-foreground/60 uppercase tracking-wider">
                  Total Searches
                </div>
              </div>

              <div className="p-4 border-2 border-foreground bg-background text-center">
                <div className="text-2xl font-mono font-bold text-brutalist-yellow mb-2">
                  {state.history.length}
                </div>
                <div className="text-xs font-mono text-foreground/60 uppercase tracking-wider">
                  Search History
                </div>
              </div>

              <div className="p-4 border-2 border-foreground bg-background text-center">
                <div className="text-2xl font-mono font-bold text-brutalist-yellow mb-2">
                  {state.discoveries.length}
                </div>
                <div className="text-xs font-mono text-foreground/60 uppercase tracking-wider">
                  Discoveries
                </div>
              </div>

              <div className="p-4 border-2 border-foreground bg-background text-center">
                <div className="text-2xl font-mono font-bold text-brutalist-yellow mb-2">
                  {state.savedSearches.length}
                </div>
                <div className="text-xs font-mono text-foreground/60 uppercase tracking-wider">
                  Saved Searches
                </div>
              </div>
            </div>

            {/* Popular Results */}
            {state.analytics.popularResults.length > 0 && (
              <div className="mb-6">
                <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">
                  Most Clicked Results
                </h4>
                <div className="space-y-2">
                  {state.analytics.popularResults
                    .slice(0, 5)
                    .map((result, index) => (
                      <div
                        key={result.resultId}
                        className="flex items-center justify-between p-3 border border-foreground/20 bg-foreground/5"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 border border-foreground bg-brutalist-yellow flex items-center justify-center font-mono font-bold text-xs text-black">
                            {index + 1}
                          </div>
                          <span className="font-mono text-sm">
                            {result.title}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-foreground/60">
                          {result.clickCount} clicks
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Analytics Features */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-brutalist-yellow/5 border border-brutalist-yellow/20">
                <h5 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">
                  📈 Analytics Features
                </h5>
                <ul className="text-xs font-mono text-foreground/80 space-y-1">
                  <li>• Search query tracking</li>
                  <li>• Result click analytics</li>
                  <li>• User behavior patterns</li>
                  <li>• Content performance metrics</li>
                  <li>• Search trend analysis</li>
                </ul>
              </div>

              <div className="p-4 bg-brutalist-yellow/5 border border-brutalist-yellow/20">
                <h5 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">
                  🎯 Optimization Insights
                </h5>
                <ul className="text-xs font-mono text-foreground/80 space-y-1">
                  <li>• Popular search terms</li>
                  <li>• Content gap identification</li>
                  <li>• User journey optimization</li>
                  <li>• Search result relevance</li>
                  <li>• Conversion tracking</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Demo Actions */}
      <div className="mt-8 p-6 bg-foreground/5 border-2 border-foreground/20">
        <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-4">
          🎮 Try the Demo
        </h4>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => {
              // This would trigger a sample search
              console.log("Demo search: React");
            }}
            className="px-3 py-2 border border-foreground/20 bg-background hover:bg-brutalist-yellow hover:text-black transition-colors duration-200 font-mono font-bold text-xs uppercase tracking-wider"
          >
            Search "React"
          </button>

          <button
            onClick={() => {
              // This would trigger a sample search
              console.log("Demo search: Portfolio");
            }}
            className="px-3 py-2 border border-foreground/20 bg-background hover:bg-brutalist-yellow hover:text-black transition-colors duration-200 font-mono font-bold text-xs uppercase tracking-wider"
          >
            Search "Portfolio"
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-2 border border-foreground/20 bg-background hover:bg-brutalist-yellow hover:text-black transition-colors duration-200 font-mono font-bold text-xs uppercase tracking-wider"
          >
            Open Full Modal
          </button>

          <button
            onClick={() => {
              // This would generate new discoveries
              console.log("Generate discoveries");
            }}
            className="px-3 py-2 border border-foreground/20 bg-background hover:bg-brutalist-yellow hover:text-black transition-colors duration-200 font-mono font-bold text-xs uppercase tracking-wider"
          >
            Generate Discoveries
          </button>
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
