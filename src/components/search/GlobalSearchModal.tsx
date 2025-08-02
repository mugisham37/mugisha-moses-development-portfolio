"use client";

import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { GlobalSearchBar } from "@/components/search";
import { SearchResults } from "@/components/search";
import { SearchHistory } from "@/components/search";
import { ContentDiscovery } from "@/components/search";
import { useSearch } from "@/contexts/SearchContext";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export default function GlobalSearchModal({
  isOpen,
  onClose,
  className = "",
}: GlobalSearchModalProps) {
  const { state } = useSearch();
  const [activeTab, setActiveTab] = useState<"search" | "history" | "discover">(
    "search"
  );

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Auto-switch to results when search is performed
  useEffect(() => {
    if (state.query && state.results.length > 0) {
      setActiveTab("search");
    }
  }, [state.query, state.results.length]);

  if (!isOpen) return null;

  const tabs = [
    { id: "search" as const, label: "Search", count: state.results.length },
    { id: "history" as const, label: "History", count: state.history.length },
    {
      id: "discover" as const,
      label: "Discover",
      count: state.discoveries.length,
    },
  ];

  return (
    <div className={`global-search-modal ${className}`}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
        <div className="w-full max-w-4xl bg-background border-3 border-foreground shadow-brutalist max-h-[80vh] flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b-2 border-foreground/20">
            <div className="flex items-center space-x-3">
              <Search size={24} className="text-brutalist-yellow" />
              <h2 className="font-mono font-bold text-xl uppercase tracking-wider">
                Global Search
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-foreground/10 transition-colors duration-200"
              aria-label="Close search modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b-2 border-foreground/20">
            <GlobalSearchBar
              placeholder="Search across all content..."
              showSuggestions={true}
              onResultClick={() => {
                // Keep modal open to show results
              }}
            />
          </div>

          {/* Tabs */}
          <div className="flex border-b-2 border-foreground/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-mono font-bold text-sm uppercase tracking-wider transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-brutalist-yellow text-black border-b-3 border-black"
                    : "text-foreground/80 hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.id
                        ? "bg-black text-brutalist-yellow"
                        : "bg-foreground/20 text-foreground/60"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "search" && (
              <div className="p-6">
                {state.query ? (
                  <SearchResults
                    maxResults={20}
                    showCategories={true}
                    onResultClick={(result) => {
                      // Close modal when result is clicked
                      onClose();
                    }}
                  />
                ) : (
                  <div className="text-center py-12">
                    <Search
                      size={64}
                      className="mx-auto text-foreground/40 mb-4"
                    />
                    <h3 className="font-mono font-bold text-lg uppercase tracking-wider mb-2">
                      Start Searching
                    </h3>
                    <p className="text-sm font-mono text-foreground/60 mb-6">
                      Search across projects, services, content, and more.
                    </p>

                    {/* Quick Search Suggestions */}
                    <div className="max-w-md mx-auto">
                      <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">
                        Popular Searches:
                      </h4>
                      <div className="flex flex-wrap justify-center gap-2">
                        {[
                          "React",
                          "Next.js",
                          "Portfolio",
                          "Services",
                          "Contact",
                          "About",
                        ].map((term) => (
                          <button
                            key={term}
                            onClick={() => {
                              // This would trigger a search
                              console.log("Quick search:", term);
                            }}
                            className="px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider border border-foreground/20 bg-foreground/5 hover:bg-brutalist-yellow hover:text-black transition-colors duration-200"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div className="p-6">
                <SearchHistory maxItems={15} showAnalytics={true} />
              </div>
            )}

            {activeTab === "discover" && (
              <div className="p-6">
                <ContentDiscovery maxItems={8} autoGenerate={true} />
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t-2 border-foreground/20 bg-foreground/5">
            <div className="flex items-center justify-between text-xs font-mono text-foreground/60">
              <div className="flex items-center space-x-4">
                <span>Press ESC to close</span>
                <span>•</span>
                <span>Use ↑↓ to navigate suggestions</span>
              </div>

              <div className="flex items-center space-x-2">
                <span>Powered by</span>
                <span className="font-bold text-brutalist-yellow">
                  Global Search
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
