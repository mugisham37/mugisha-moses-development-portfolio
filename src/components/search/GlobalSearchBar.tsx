"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, Clock, Bookmark, TrendingUp } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import { SearchSuggestion } from "@/types/search";

interface GlobalSearchBarProps {
  className?: string;
  placeholder?: string;
  showSuggestions?: boolean;
  onResultClick?: (resultId: string) => void;
}

export default function GlobalSearchBar({
  className = "",
  placeholder = "Search projects, services, content...",
  showSuggestions = true,
  onResultClick,
}: GlobalSearchBarProps) {
  const { state, search, getSuggestions } = useSearch();
  const [localQuery, setLocalQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update suggestions when query changes
  useEffect(() => {
    if (localQuery.trim() && showSuggestions) {
      const newSuggestions = getSuggestions(localQuery);
      setSuggestions(newSuggestions);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
    setSelectedIndex(-1);
  }, [localQuery, getSuggestions, showSuggestions]);

  // Handle search execution
  const handleSearch = async (query: string = localQuery) => {
    if (!query.trim()) return;

    await search(query);
    setShowDropdown(false);
    setSelectedIndex(-1);

    if (onResultClick && state.results.length > 0) {
      onResultClick(state.results[0].id);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  // Handle key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          const suggestion = suggestions[selectedIndex];
          setLocalQuery(suggestion.text);
          handleSearch(suggestion.text);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setLocalQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  // Handle clear
  const handleClear = () => {
    setLocalQuery("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSuggestionIcon = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "query":
        return <Search size={16} />;
      case "filter":
        return <TrendingUp size={16} />;
      case "category":
        return <Bookmark size={16} />;
      default:
        return <Search size={16} />;
    }
  };

  return (
    <div className={`global-search-bar relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={20} className="text-foreground/60" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => localQuery && setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border-3 border-foreground bg-background text-foreground font-mono text-sm placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-brutalist-yellow focus:border-brutalist-yellow"
          aria-label="Global search"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          role="combobox"
        />

        {localQuery && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-brutalist-yellow transition-colors duration-200"
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}

        {state.isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-background border-3 border-foreground shadow-brutalist z-50 max-h-80 overflow-y-auto"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-brutalist-yellow/10 transition-colors duration-200 font-mono text-sm ${
                index === selectedIndex ? "bg-brutalist-yellow/20" : ""
              }`}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <div className="text-foreground/60">
                {getSuggestionIcon(suggestion.type)}
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground">
                  {suggestion.text}
                </div>
                {suggestion.metadata?.type && (
                  <div className="text-xs text-foreground/60 uppercase tracking-wider">
                    {suggestion.metadata.type}
                  </div>
                )}
              </div>
              <div className="text-xs text-foreground/40">
                {Math.round(suggestion.score * 100)}%
              </div>
            </button>
          ))}

          {/* Recent Searches Footer */}
          {state.recentQueries.length > 0 && (
            <div className="border-t border-foreground/20 p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Clock size={14} className="text-foreground/60" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground/60">
                  Recent Searches
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {state.recentQueries.slice(0, 5).map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(query)}
                    className="px-2 py-1 text-xs font-mono bg-foreground/5 border border-foreground/20 hover:bg-brutalist-yellow/10 transition-colors duration-200"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Results Count */}
      {state.results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-background/90 border border-foreground/20 text-xs font-mono text-foreground/60">
          Found {state.results.length} result
          {state.results.length !== 1 ? "s" : ""}
          {localQuery && ` for "${localQuery}"`}
        </div>
      )}
    </div>
  );
}
