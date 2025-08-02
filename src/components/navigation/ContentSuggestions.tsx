"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Lightbulb, ExternalLink } from "lucide-react";
import { useNavigation } from "@/components/providers";
import { ContentSuggestion } from "@/types/navigation";

interface ContentSuggestionsProps {
  className?: string;
  maxSuggestions?: number;
  showReasons?: boolean;
  variant?: "compact" | "detailed" | "minimal";
}

export default function ContentSuggestions({
  className = "",
  maxSuggestions = 3,
  showReasons = false,
  variant = "detailed",
}: ContentSuggestionsProps) {
  const { state, dispatch } = useNavigation();

  const suggestions = state.contentSuggestions.slice(0, maxSuggestions);

  if (suggestions.length === 0) {
    return null;
  }

  const handleSuggestionClick = (suggestion: ContentSuggestion) => {
    dispatch({
      type: "TRACK_INTERACTION",
      payload: {
        element: `suggestion-${suggestion.id}`,
        section: "content-suggestions",
      },
    });
  };

  return (
    <div className={`brutalist-suggestions ${className}`}>
      <div className="flex items-center mb-4">
        <Lightbulb size={20} className="text-brutalist-yellow mr-2" />
        <h3 className="font-mono font-bold text-lg uppercase tracking-wider">
          Suggested for You
        </h3>
      </div>

      <div className={`space-y-3 ${variant === "compact" ? "space-y-2" : ""}`}>
        {suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            variant={variant}
            showReason={showReasons}
            onClick={() => handleSuggestionClick(suggestion)}
          />
        ))}
      </div>

      {state.contentSuggestions.length > maxSuggestions && (
        <div className="text-xs text-foreground/60 mt-3 font-mono">
          {state.contentSuggestions.length - maxSuggestions} more suggestions
          available
        </div>
      )}
    </div>
  );
}

interface SuggestionCardProps {
  suggestion: ContentSuggestion;
  variant: "compact" | "detailed" | "minimal";
  showReason: boolean;
  onClick: () => void;
}

function SuggestionCard({
  suggestion,
  variant,
  showReason,
  onClick,
}: SuggestionCardProps) {
  const getTypeIcon = (type: ContentSuggestion["type"]) => {
    switch (type) {
      case "project":
        return "🚀";
      case "service":
        return "⚡";
      case "content":
        return "📖";
      case "action":
        return "🎯";
      default:
        return "💡";
    }
  };

  const getTypeColor = (type: ContentSuggestion["type"]) => {
    switch (type) {
      case "project":
        return "border-blue-500 bg-blue-50 dark:bg-blue-950";
      case "service":
        return "border-green-500 bg-green-50 dark:bg-green-950";
      case "content":
        return "border-purple-500 bg-purple-50 dark:bg-purple-950";
      case "action":
        return "border-brutalist-yellow bg-yellow-50 dark:bg-yellow-950";
      default:
        return "border-foreground bg-background";
    }
  };

  if (variant === "minimal") {
    return (
      <Link
        href={suggestion.href}
        onClick={onClick}
        className="flex items-center justify-between p-2 border-2 border-foreground hover:bg-brutalist-yellow/10 transition-colors duration-200 group"
      >
        <span className="font-mono text-sm uppercase tracking-wider">
          {getTypeIcon(suggestion.type)} {suggestion.title}
        </span>
        <ArrowRight
          size={16}
          className="group-hover:translate-x-1 transition-transform duration-200"
        />
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={suggestion.href}
        onClick={onClick}
        className={`block p-3 border-2 ${getTypeColor(
          suggestion.type
        )} hover:shadow-brutalist transition-all duration-200 group`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <span className="text-lg mr-2">
                {getTypeIcon(suggestion.type)}
              </span>
              <h4 className="font-mono font-bold text-sm uppercase tracking-wider">
                {suggestion.title}
              </h4>
            </div>
            <p className="text-xs text-foreground/80 font-mono">
              {suggestion.description}
            </p>
          </div>
          <ArrowRight
            size={16}
            className="mt-1 group-hover:translate-x-1 transition-transform duration-200"
          />
        </div>
      </Link>
    );
  }

  // Detailed variant
  return (
    <Link
      href={suggestion.href}
      onClick={onClick}
      className={`block p-4 border-3 ${getTypeColor(
        suggestion.type
      )} hover:shadow-brutalist transition-all duration-200 group`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          <span className="text-xl mr-3">{getTypeIcon(suggestion.type)}</span>
          <div>
            <h4 className="font-mono font-bold text-base uppercase tracking-wider">
              {suggestion.title}
            </h4>
            <div className="flex items-center mt-1">
              <span className="text-xs font-mono text-foreground/60 uppercase">
                {suggestion.type}
              </span>
              <div className="flex items-center ml-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-1 rounded-full mr-1 ${
                      i < Math.round(suggestion.relevanceScore * 5)
                        ? "bg-brutalist-yellow"
                        : "bg-foreground/20"
                    }`}
                  />
                ))}
                <span className="text-xs text-foreground/60 ml-1">
                  {Math.round(suggestion.relevanceScore * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform duration-200"
          />
          <ExternalLink size={14} className="ml-1 text-foreground/40" />
        </div>
      </div>

      <p className="text-sm text-foreground/80 font-mono mb-2">
        {suggestion.description}
      </p>

      {showReason && (
        <div className="text-xs text-foreground/60 font-mono italic border-t border-foreground/20 pt-2">
          💡 {suggestion.reason}
        </div>
      )}

      {suggestion.metadata && Object.keys(suggestion.metadata).length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {Object.entries(suggestion.metadata)
            .slice(0, 3)
            .map(([key, value]) => (
              <span
                key={key}
                className="text-xs px-2 py-1 bg-foreground/10 border border-foreground/20 font-mono"
              >
                {key}: {String(value)}
              </span>
            ))}
        </div>
      )}
    </Link>
  );
}
