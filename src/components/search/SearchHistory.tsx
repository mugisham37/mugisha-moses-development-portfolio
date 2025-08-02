"use client";

import React from "react";
import { Clock, Search, TrendingUp, Bookmark, X } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";

interface SearchHistoryProps {
  className?: string;
  maxItems?: number;
  showAnalytics?: boolean;
}

export default function SearchHistory({
  className = "",
  maxItems = 10,
  showAnalytics = true,
}: SearchHistoryProps) {
  const { state, search } = useSearch();

  const handleSearchAgain = (query: string) => {
    search(query);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const recentHistory = state.history.slice(0, maxItems);
  const popularQueries = state.analytics.popularQueries.slice(0, 5);

  if (recentHistory.length === 0) {
    return (
      <div className={`search-history ${className}`}>
        <div className="text-center py-8">
          <Clock size={48} className="mx-auto text-foreground/40 mb-4" />
          <h3 className="font-mono font-bold text-lg uppercase tracking-wider mb-2">
            No Search History
          </h3>
          <p className="text-sm font-mono text-foreground/60">
            Your search history will appear here as you explore the site.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`search-history ${className}`}>
      {/* Recent Searches */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Clock size={20} className="text-brutalist-yellow mr-2" />
          <h3 className="font-mono font-bold text-lg uppercase tracking-wider">
            Recent Searches
          </h3>
        </div>

        <div className="space-y-3">
          {recentHistory.map((historyItem) => (
            <div
              key={historyItem.id}
              className="flex items-center justify-between p-3 border-2 border-foreground/20 bg-background hover:border-foreground/40 transition-colors duration-200 group"
            >
              <div className="flex items-center space-x-3 flex-1">
                <Search size={16} className="text-foreground/60" />
                <div className="flex-1">
                  <button
                    onClick={() => handleSearchAgain(historyItem.query)}
                    className="font-mono font-medium text-sm text-foreground hover:text-brutalist-yellow transition-colors duration-200 text-left"
                  >
                    {historyItem.query}
                  </button>
                  <div className="flex items-center space-x-4 mt-1 text-xs font-mono text-foreground/60">
                    <span>{formatDate(historyItem.timestamp)}</span>
                    <span>{historyItem.resultsCount} results</span>
                    {historyItem.clickedResults.length > 0 && (
                      <span>{historyItem.clickedResults.length} clicked</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSearchAgain(historyItem.query)}
                className="px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider border border-foreground/20 bg-foreground/5 hover:bg-brutalist-yellow hover:text-black transition-colors duration-200 opacity-0 group-hover:opacity-100"
              >
                Search Again
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Queries */}
      {showAnalytics && popularQueries.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <TrendingUp size={20} className="text-brutalist-yellow mr-2" />
            <h3 className="font-mono font-bold text-lg uppercase tracking-wider">
              Popular Searches
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {popularQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => handleSearchAgain(query.query)}
                className="flex items-center justify-between p-3 border-2 border-foreground/20 bg-background hover:border-brutalist-yellow hover:bg-brutalist-yellow/10 transition-all duration-200 group text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border border-foreground bg-brutalist-yellow flex items-center justify-center font-mono font-bold text-xs text-black">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-mono font-medium text-sm text-foreground group-hover:text-brutalist-yellow">
                      {query.query}
                    </div>
                    <div className="text-xs font-mono text-foreground/60">
                      {query.count} searches •{" "}
                      {Math.round(query.avgRelevance * 100)}% avg relevance
                    </div>
                  </div>
                </div>
                <Search
                  size={16}
                  className="text-foreground/40 group-hover:text-brutalist-yellow"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Saved Searches */}
      {state.savedSearches.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Bookmark size={20} className="text-brutalist-yellow mr-2" />
            <h3 className="font-mono font-bold text-lg uppercase tracking-wider">
              Saved Searches
            </h3>
          </div>

          <div className="space-y-3">
            {state.savedSearches.slice(0, 5).map((savedSearch) => (
              <div
                key={savedSearch.id}
                className="flex items-center justify-between p-3 border-2 border-brutalist-yellow/50 bg-brutalist-yellow/5 hover:bg-brutalist-yellow/10 transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <Bookmark size={16} className="text-brutalist-yellow" />
                  <div className="flex-1">
                    <button
                      onClick={() => handleSearchAgain(savedSearch.query.query)}
                      className="font-mono font-medium text-sm text-foreground hover:text-brutalist-yellow transition-colors duration-200 text-left"
                    >
                      {savedSearch.name}
                    </button>
                    <div className="flex items-center space-x-4 mt-1 text-xs font-mono text-foreground/60">
                      <span>"{savedSearch.query.query}"</span>
                      <span>Used {savedSearch.useCount} times</span>
                      <span>Last used {formatDate(savedSearch.lastUsed)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleSearchAgain(savedSearch.query.query)}
                    className="px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider border border-brutalist-yellow bg-brutalist-yellow/20 hover:bg-brutalist-yellow hover:text-black transition-colors duration-200"
                  >
                    Use
                  </button>
                  <button
                    onClick={() => {
                      // This would remove the saved search
                      console.log("Remove saved search:", savedSearch.id);
                    }}
                    className="p-1 text-foreground/60 hover:text-red-500 transition-colors duration-200"
                    aria-label="Remove saved search"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Analytics Summary */}
      {showAnalytics && state.analytics.totalSearches > 0 && (
        <div className="border-t-2 border-foreground/20 pt-6">
          <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-4 text-foreground/80">
            Search Statistics
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border border-foreground/20 bg-foreground/5">
              <div className="font-mono font-bold text-lg text-brutalist-yellow">
                {state.analytics.totalSearches}
              </div>
              <div className="text-xs font-mono text-foreground/60 uppercase tracking-wider">
                Total Searches
              </div>
            </div>

            <div className="text-center p-3 border border-foreground/20 bg-foreground/5">
              <div className="font-mono font-bold text-lg text-brutalist-yellow">
                {Math.round(state.analytics.userBehavior.avgQueryLength)}
              </div>
              <div className="text-xs font-mono text-foreground/60 uppercase tracking-wider">
                Avg Query Length
              </div>
            </div>

            <div className="text-center p-3 border border-foreground/20 bg-foreground/5">
              <div className="font-mono font-bold text-lg text-brutalist-yellow">
                {Math.round(state.analytics.userBehavior.avgResultsViewed)}
              </div>
              <div className="text-xs font-mono text-foreground/60 uppercase tracking-wider">
                Avg Results Viewed
              </div>
            </div>

            <div className="text-center p-3 border border-foreground/20 bg-foreground/5">
              <div className="font-mono font-bold text-lg text-brutalist-yellow">
                {Math.round(state.analytics.userBehavior.avgClickPosition)}
              </div>
              <div className="text-xs font-mono text-foreground/60 uppercase tracking-wider">
                Avg Click Position
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
