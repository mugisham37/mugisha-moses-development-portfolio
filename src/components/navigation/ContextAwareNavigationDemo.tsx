"use client";

import React from "react";
import {
  SmartBreadcrumbs,
  ContentSuggestions,
  NextStepsRecommendations,
  UserJourneyTracker,
} from "@/components/navigation";
import { useNavigation } from "@/components/providers";

interface ContextAwareNavigationDemoProps {
  className?: string;
  showDebugInfo?: boolean;
}

export default function ContextAwareNavigationDemo({
  className = "",
  showDebugInfo = false,
}: ContextAwareNavigationDemoProps) {
  const { state, dispatch } = useNavigation();

  const handleInteraction = (elementId: string, section?: string) => {
    dispatch({
      type: "TRACK_INTERACTION",
      payload: {
        element: elementId,
        section: section,
      },
    });
  };

  return (
    <div className={`context-aware-navigation-demo ${className}`}>
      {/* Smart Breadcrumbs */}
      <div className="mb-8">
        <SmartBreadcrumbs
          showContext={true}
          maxItems={4}
          className="bg-background/90 p-4 border-2 border-foreground"
        />
      </div>

      {/* Main Content Area with Navigation Components */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Primary Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Content Suggestions */}
          <ContentSuggestions
            maxSuggestions={3}
            showReasons={true}
            variant="detailed"
            className="bg-background border-3 border-foreground p-6"
          />

          {/* Interactive Demo Section */}
          <div className="bg-brutalist-yellow/10 border-3 border-foreground p-6">
            <h3 className="font-mono font-bold text-lg uppercase tracking-wider mb-4">
              🎯 Context-Aware Navigation Demo
            </h3>

            <div className="space-y-4">
              <p className="font-mono text-sm">
                Interact with the elements below to see how the navigation
                system adapts to your behavior and provides contextual
                recommendations.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() =>
                    handleInteraction(
                      "demo-project-interest",
                      "demo-interactions"
                    )
                  }
                  className="p-3 border-2 border-foreground bg-background hover:bg-brutalist-yellow transition-colors duration-200 font-mono font-bold text-sm uppercase"
                >
                  🚀 Show Interest in Projects
                </button>

                <button
                  onClick={() =>
                    handleInteraction(
                      "demo-service-inquiry",
                      "demo-interactions"
                    )
                  }
                  className="p-3 border-2 border-foreground bg-background hover:bg-brutalist-yellow transition-colors duration-200 font-mono font-bold text-sm uppercase"
                >
                  ⚡ Inquire About Services
                </button>

                <button
                  onClick={() =>
                    handleInteraction(
                      "demo-skill-exploration",
                      "demo-interactions"
                    )
                  }
                  className="p-3 border-2 border-foreground bg-background hover:bg-brutalist-yellow transition-colors duration-200 font-mono font-bold text-sm uppercase"
                >
                  🛠️ Explore Technical Skills
                </button>

                <button
                  onClick={() =>
                    handleInteraction(
                      "demo-contact-intent",
                      "demo-interactions"
                    )
                  }
                  className="p-3 border-2 border-foreground bg-background hover:bg-brutalist-yellow transition-colors duration-200 font-mono font-bold text-sm uppercase"
                >
                  📞 Show Contact Intent
                </button>
              </div>

              <div className="mt-6 p-4 bg-foreground/5 border border-foreground/20">
                <h4 className="font-mono font-bold text-sm uppercase mb-2">
                  Current Context:
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <strong>Page:</strong> {state.currentPage}
                  </div>
                  <div>
                    <strong>Journey Stage:</strong>{" "}
                    {state.userJourney.currentStage}
                  </div>
                  <div>
                    <strong>Time on Page:</strong>{" "}
                    {state.userBehavior.timeOnPage}s
                  </div>
                  <div>
                    <strong>Interactions:</strong>{" "}
                    {state.userBehavior.interactionsCount}
                  </div>
                  <div>
                    <strong>Scroll Depth:</strong>{" "}
                    {state.userBehavior.scrollDepth}%
                  </div>
                  <div>
                    <strong>Intent:</strong> {state.userJourney.intent}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar with Next Steps */}
        <div className="space-y-6">
          <NextStepsRecommendations
            maxSteps={4}
            showPriority={true}
            variant="cards"
            className="bg-background border-3 border-foreground p-6"
          />

          {/* User Journey Visualization */}
          <div className="bg-background border-3 border-foreground p-6">
            <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-4">
              📊 Your Journey
            </h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span>Pages Visited:</span>
                <span className="font-bold">{state.pageHistory.length}</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span>Current Stage:</span>
                <span className="font-bold capitalize">
                  {state.userJourney.currentStage}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span>Interests:</span>
                <span className="font-bold">
                  {state.userJourney.interests.length}
                </span>
              </div>

              <div className="mt-4">
                <div className="text-xs font-mono mb-2">Journey Path:</div>
                <div className="flex flex-wrap gap-1">
                  {state.pageHistory.slice(-5).map((page, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs font-mono border ${
                        index === state.pageHistory.length - 1
                          ? "border-brutalist-yellow bg-brutalist-yellow/20"
                          : "border-foreground/20 bg-foreground/5"
                      }`}
                    >
                      {page === "/" ? "Home" : page.replace("/", "")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions Summary */}
          <div className="bg-background border-3 border-foreground p-6">
            <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-4">
              💡 Smart Suggestions
            </h4>

            <div className="space-y-2">
              {state.contentSuggestions.slice(0, 3).map((suggestion) => (
                <div key={suggestion.id} className="text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{suggestion.title}</span>
                    <span className="text-brutalist-yellow ml-2">
                      {Math.round(suggestion.relevanceScore * 100)}%
                    </span>
                  </div>
                </div>
              ))}

              {state.contentSuggestions.length === 0 && (
                <div className="text-xs font-mono text-foreground/60">
                  Interact with the demo to see suggestions
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Debug Information */}
      {showDebugInfo && (
        <div className="mt-8">
          <UserJourneyTracker showDebugInfo={true} />
        </div>
      )}
    </div>
  );
}
