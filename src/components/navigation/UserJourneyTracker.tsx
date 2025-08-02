"use client";

import React, { useEffect } from "react";
import { useNavigation } from "@/components/providers";
import { UserJourney } from "@/types/navigation";

interface UserJourneyTrackerProps {
  className?: string;
  showDebugInfo?: boolean;
}

export default function UserJourneyTracker({
  className = "",
  showDebugInfo = false,
}: UserJourneyTrackerProps) {
  const { state, dispatch } = useNavigation();

  // Track user journey progression
  useEffect(() => {
    const currentStage = determineUserJourneyStage(
      state.currentPage,
      state.pageHistory,
      state.userBehavior
    );

    const interests = extractUserInterests(
      state.userBehavior,
      state.pageHistory
    );

    const intent = determineUserIntent(
      state.pageHistory,
      state.userBehavior,
      state.currentPage
    );

    dispatch({
      type: "UPDATE_USER_JOURNEY",
      payload: {
        currentStage,
        interests,
        intent,
        visitedPages: state.pageHistory.map((path, index) => ({
          path,
          timestamp: new Date(
            Date.now() - (state.pageHistory.length - index) * 30000
          ), // Approximate timestamps
          timeSpent:
            index === state.pageHistory.length - 1
              ? state.userBehavior.timeOnPage
              : 45, // Current page or average
          interactions: state.userBehavior.clickedElements.filter(
            (el) =>
              el.includes(path.replace("/", "")) || el.includes("navigation")
          ),
        })),
      },
    });
  }, [state.currentPage, state.pageHistory, state.userBehavior, dispatch]);

  // Optimize user experience based on journey stage
  useEffect(() => {
    optimizeExperienceForStage(state.userJourney.currentStage, dispatch);
  }, [state.userJourney.currentStage, dispatch]);

  if (!showDebugInfo) {
    return null; // This component primarily works in the background
  }

  return (
    <div className={`user-journey-debug ${className}`}>
      <div className="p-4 border-2 border-foreground bg-background/90 font-mono text-xs">
        <h4 className="font-bold mb-2 uppercase">User Journey Debug</h4>

        <div className="space-y-2">
          <div>
            <strong>Stage:</strong> {state.userJourney.currentStage}
          </div>
          <div>
            <strong>Intent:</strong> {state.userJourney.intent}
          </div>
          <div>
            <strong>Session:</strong> {state.userJourney.sessionId.slice(-8)}
          </div>
          <div>
            <strong>Pages Visited:</strong>{" "}
            {state.userJourney.visitedPages.length}
          </div>
          <div>
            <strong>Interests:</strong>{" "}
            {state.userJourney.interests.join(", ") || "None detected"}
          </div>
          <div>
            <strong>Time on Current:</strong> {state.userBehavior.timeOnPage}s
          </div>
          <div>
            <strong>Scroll Depth:</strong> {state.userBehavior.scrollDepth}%
          </div>
          <div>
            <strong>Interactions:</strong>{" "}
            {state.userBehavior.interactionsCount}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-foreground/20">
          <strong>Journey Path:</strong>
          <div className="text-xs mt-1">
            {state.pageHistory.map((page, index) => (
              <span key={index}>
                {page}
                {index < state.pageHistory.length - 1 && " → "}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function determineUserJourneyStage(
  currentPage: string,
  pageHistory: string[],
  userBehavior: any
): UserJourney["currentStage"] {
  // High engagement indicators
  const highEngagement =
    userBehavior.timeOnPage > 60 ||
    userBehavior.scrollDepth > 70 ||
    userBehavior.interactionsCount > 5;

  // Page-based stage determination
  if (currentPage === "/contact" || pageHistory.includes("/contact")) {
    return "action";
  }

  if (currentPage === "/services" && highEngagement) {
    return "decision";
  }

  if (pageHistory.includes("/portfolio") && pageHistory.includes("/about")) {
    return "consideration";
  }

  if (pageHistory.length > 2 || highEngagement) {
    return "consideration";
  }

  return "discovery";
}

function extractUserInterests(
  userBehavior: any,
  pageHistory: string[]
): string[] {
  const interests: string[] = [];

  // Extract interests from page visits
  if (pageHistory.includes("/portfolio")) interests.push("projects");
  if (pageHistory.includes("/about")) interests.push("background");
  if (pageHistory.includes("/services")) interests.push("services");
  if (pageHistory.includes("/contact")) interests.push("hiring");

  // Extract interests from interactions
  const clickedElements = userBehavior.clickedElements || [];

  if (clickedElements.some((el: string) => el.includes("project"))) {
    interests.push("project-details");
  }
  if (clickedElements.some((el: string) => el.includes("skill"))) {
    interests.push("technical-skills");
  }
  if (clickedElements.some((el: string) => el.includes("pricing"))) {
    interests.push("pricing");
  }
  if (clickedElements.some((el: string) => el.includes("contact"))) {
    interests.push("communication");
  }

  // Extract interests from viewed sections
  const viewedSections = userBehavior.viewedSections || [];
  viewedSections.forEach((section: string) => {
    if (!interests.includes(section)) {
      interests.push(section);
    }
  });

  return [...new Set(interests)]; // Remove duplicates
}

function determineUserIntent(
  pageHistory: string[],
  userBehavior: any,
  currentPage: string
): UserJourney["intent"] {
  // Strong hiring signals
  if (
    pageHistory.includes("/contact") ||
    pageHistory.includes("/services") ||
    userBehavior.clickedElements?.some(
      (el: string) =>
        el.includes("contact") || el.includes("quote") || el.includes("hire")
    )
  ) {
    return "hiring";
  }

  // Research signals
  if (
    pageHistory.length > 3 ||
    (pageHistory.includes("/about") && pageHistory.includes("/portfolio")) ||
    userBehavior.timeOnPage > 120
  ) {
    return "researching";
  }

  // Learning signals
  if (
    pageHistory.includes("/about") ||
    userBehavior.viewedSections?.includes("methodology") ||
    userBehavior.viewedSections?.includes("skills")
  ) {
    return "learning";
  }

  return "browsing";
}

function optimizeExperienceForStage(
  stage: UserJourney["currentStage"],
  dispatch: any
) {
  // This function can trigger UI optimizations based on user journey stage
  // For now, it's a placeholder for future enhancements

  switch (stage) {
    case "discovery":
      // Could trigger more prominent navigation hints
      break;
    case "consideration":
      // Could highlight comparison features or detailed information
      break;
    case "decision":
      // Could emphasize CTAs and contact options
      break;
    case "action":
      // Could streamline forms and reduce friction
      break;
  }
}
