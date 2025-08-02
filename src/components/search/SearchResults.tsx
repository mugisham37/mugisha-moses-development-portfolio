"use client";

import React from "react";
import Link from "next/link";
import {
  ExternalLink,
  FileText,
  Folder,
  Code,
  Briefcase,
  User,
} from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import { SearchResult } from "@/types/search";

interface SearchResultsProps {
  className?: string;
  maxResults?: number;
  showCategories?: boolean;
  onResultClick?: (result: SearchResult, position: number) => void;
}

export default function SearchResults({
  className = "",
  maxResults = 20,
  showCategories = true,
  onResultClick,
}: SearchResultsProps) {
  const { state, dispatch } = useSearch();

  if (!state.query || state.results.length === 0) {
    return null;
  }

  const handleResultClick = (result: SearchResult, position: number) => {
    // Track the click
    dispatch({
      type: "TRACK_RESULT_CLICK",
      payload: { resultId: result.id, position },
    });

    if (onResultClick) {
      onResultClick(result, position);
    }
  };

  const getResultIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "page":
        return <FileText size={20} />;
      case "project":
        return <Code size={20} />;
      case "service":
        return <Briefcase size={20} />;
      case "content":
        return <Folder size={20} />;
      case "skill":
        return <User size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  const getTypeColor = (type: SearchResult["type"]) => {
    switch (type) {
      case "page":
        return "border-blue-500 bg-blue-50 dark:bg-blue-950";
      case "project":
        return "border-green-500 bg-green-50 dark:bg-green-950";
      case "service":
        return "border-purple-500 bg-purple-50 dark:bg-purple-950";
      case "content":
        return "border-orange-500 bg-orange-50 dark:bg-orange-950";
      case "skill":
        return "border-pink-500 bg-pink-50 dark:bg-pink-950";
      default:
        return "border-foreground bg-background";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const highlightQuery = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-brutalist-yellow text-black px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Group results by category if enabled
  const groupedResults = showCategories
    ? state.results.slice(0, maxResults).reduce((groups, result) => {
        const category = result.category || "Other";
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(result);
        return groups;
      }, {} as Record<string, SearchResult[]>)
    : { "All Results": state.results.slice(0, maxResults) };

  return (
    <div className={`search-results ${className}`}>
      <div className="mb-6">
        <h2 className="font-mono font-bold text-lg uppercase tracking-wider mb-2">
          Search Results
        </h2>
        <div className="text-sm font-mono text-foreground/60">
          {state.results.length} result{state.results.length !== 1 ? "s" : ""}
          {state.query && ` for "${state.query}"`}
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedResults).map(([category, results]) => (
          <div key={category} className="category-group">
            {showCategories && Object.keys(groupedResults).length > 1 && (
              <h3 className="font-mono font-bold text-base uppercase tracking-wider mb-4 text-foreground/80">
                {category} ({results.length})
              </h3>
            )}

            <div className="space-y-4">
              {results.map((result, index) => (
                <Link
                  key={result.id}
                  href={result.url}
                  onClick={() => handleResultClick(result, index)}
                  className={`block p-4 border-2 ${getTypeColor(
                    result.type
                  )} hover:shadow-brutalist transition-all duration-200 group`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Result Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="text-foreground/60 group-hover:text-brutalist-yellow transition-colors duration-200">
                        {getResultIcon(result.type)}
                      </div>
                    </div>

                    {/* Result Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-mono font-bold text-base uppercase tracking-wider text-foreground group-hover:text-brutalist-yellow transition-colors duration-200">
                          {highlightQuery(result.title, state.query)}
                        </h4>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className="text-xs font-mono px-2 py-1 border border-foreground/20 bg-foreground/5 uppercase tracking-wider">
                            {result.type}
                          </span>
                          <ExternalLink
                            size={14}
                            className="text-foreground/40"
                          />
                        </div>
                      </div>

                      <p className="text-sm font-mono text-foreground/80 mb-3 leading-relaxed">
                        {highlightQuery(result.description, state.query)}
                      </p>

                      {/* Result Metadata */}
                      <div className="flex items-center justify-between text-xs font-mono text-foreground/60">
                        <div className="flex items-center space-x-4">
                          <span>Updated: {formatDate(result.lastUpdated)}</span>
                          <span>
                            Relevance: {Math.round(result.relevanceScore * 100)}
                            %
                          </span>
                        </div>

                        {/* Tags */}
                        {result.tags.length > 0 && (
                          <div className="flex items-center space-x-1">
                            {result.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 bg-foreground/10 border border-foreground/20 text-xs uppercase tracking-wider"
                              >
                                {tag}
                              </span>
                            ))}
                            {result.tags.length > 3 && (
                              <span className="text-foreground/40">
                                +{result.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Additional Metadata */}
                      {result.metadata &&
                        Object.keys(result.metadata).length > 0 && (
                          <div className="mt-3 pt-3 border-t border-foreground/10">
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(result.metadata)
                                .slice(0, 4)
                                .map(([key, value]) => (
                                  <div
                                    key={key}
                                    className="text-xs font-mono text-foreground/60"
                                  >
                                    <span className="font-bold uppercase">
                                      {key}:
                                    </span>{" "}
                                    {Array.isArray(value)
                                      ? value.join(", ")
                                      : String(value)}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Load More Results */}
      {state.results.length > maxResults && (
        <div className="mt-8 text-center">
          <div className="text-sm font-mono text-foreground/60 mb-4">
            Showing {maxResults} of {state.results.length} results
          </div>
          <button
            onClick={() => {
              // This would typically load more results
              console.log("Load more results");
            }}
            className="px-6 py-3 border-2 border-foreground bg-background hover:bg-brutalist-yellow hover:text-black transition-colors duration-200 font-mono font-bold text-sm uppercase tracking-wider"
          >
            Load More Results
          </button>
        </div>
      )}

      {/* No Results State */}
      {state.results.length === 0 && state.query && !state.isSearching && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-mono font-bold text-lg uppercase tracking-wider mb-2">
            No Results Found
          </h3>
          <p className="text-sm font-mono text-foreground/60 mb-6">
            No results found for "{state.query}". Try different keywords or
            check your spelling.
          </p>

          {/* Search Suggestions */}
          <div className="text-left max-w-md mx-auto">
            <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">
              Try searching for:
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                "projects",
                "services",
                "react",
                "nextjs",
                "portfolio",
                "contact",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    // This would trigger a new search
                    console.log("Search for:", suggestion);
                  }}
                  className="px-3 py-1 text-xs font-mono border border-foreground/20 bg-foreground/5 hover:bg-brutalist-yellow/10 transition-colors duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
