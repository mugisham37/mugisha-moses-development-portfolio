"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Target, Star, Clock, User } from "lucide-react";
import { useNavigation } from "@/components/providers";
import { NextStepRecommendation } from "@/types/navigation";

interface NextStepsRecommendationsProps {
  className?: string;
  maxSteps?: number;
  showPriority?: boolean;
  variant?: "cards" | "list" | "compact";
}

export default function NextStepsRecommendations({
  className = "",
  maxSteps = 3,
  showPriority = true,
  variant = "cards",
}: NextStepsRecommendationsProps) {
  const { state, dispatch } = useNavigation();

  const nextSteps = state.nextSteps
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })
    .slice(0, maxSteps);

  if (nextSteps.length === 0) {
    return null;
  }

  const handleStepClick = (step: NextStepRecommendation) => {
    dispatch({
      type: "TRACK_INTERACTION",
      payload: {
        element: `next-step-${step.id}`,
        section: "next-steps",
      },
    });
  };

  return (
    <div className={`brutalist-next-steps ${className}`}>
      <div className="flex items-center mb-4">
        <Target size={20} className="text-brutalist-yellow mr-2" />
        <h3 className="font-mono font-bold text-lg uppercase tracking-wider">
          Recommended Next Steps
        </h3>
      </div>

      {variant === "list" ? (
        <div className="space-y-2">
          {nextSteps.map((step, index) => (
            <NextStepListItem
              key={step.id}
              step={step}
              index={index}
              showPriority={showPriority}
              onClick={() => handleStepClick(step)}
            />
          ))}
        </div>
      ) : variant === "compact" ? (
        <div className="flex flex-wrap gap-2">
          {nextSteps.map((step) => (
            <NextStepCompactItem
              key={step.id}
              step={step}
              onClick={() => handleStepClick(step)}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {nextSteps.map((step) => (
            <NextStepCard
              key={step.id}
              step={step}
              showPriority={showPriority}
              onClick={() => handleStepClick(step)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface NextStepCardProps {
  step: NextStepRecommendation;
  showPriority: boolean;
  onClick: () => void;
}

function NextStepCard({ step, showPriority, onClick }: NextStepCardProps) {
  const getCategoryIcon = (category: NextStepRecommendation["category"]) => {
    switch (category) {
      case "contact":
        return <User size={20} />;
      case "explore":
        return <Target size={20} />;
      case "learn":
        return <Star size={20} />;
      case "engage":
        return <Clock size={20} />;
      default:
        return <ArrowRight size={20} />;
    }
  };

  const getPriorityColor = (priority: NextStepRecommendation["priority"]) => {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-50 dark:bg-red-950";
      case "medium":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950";
      case "low":
        return "border-green-500 bg-green-50 dark:bg-green-950";
      default:
        return "border-foreground bg-background";
    }
  };

  const cardContent = (
    <>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="text-brutalist-yellow mr-3">
            {getCategoryIcon(step.category)}
          </div>
          {showPriority && (
            <div
              className={`px-2 py-1 text-xs font-mono font-bold uppercase tracking-wider border ${
                step.priority === "high"
                  ? "border-red-500 text-red-700 dark:text-red-300"
                  : step.priority === "medium"
                  ? "border-yellow-500 text-yellow-700 dark:text-yellow-300"
                  : "border-green-500 text-green-700 dark:text-green-300"
              }`}
            >
              {step.priority}
            </div>
          )}
        </div>
        <ArrowRight
          size={16}
          className="group-hover:translate-x-1 transition-transform duration-200"
        />
      </div>

      <h4 className="font-mono font-bold text-base uppercase tracking-wider mb-2">
        {step.title}
      </h4>

      <p className="text-sm text-foreground/80 font-mono mb-3">
        {step.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-foreground/60 uppercase">
          {step.category}
        </span>
        <span className="font-mono font-bold text-sm uppercase tracking-wider text-brutalist-yellow">
          {step.action}
        </span>
      </div>
    </>
  );

  if (step.href) {
    return (
      <Link
        href={step.href}
        onClick={onClick}
        className={`block p-4 border-3 ${getPriorityColor(
          step.priority
        )} hover:shadow-brutalist transition-all duration-200 group text-left w-full`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`block p-4 border-3 ${getPriorityColor(
        step.priority
      )} hover:shadow-brutalist transition-all duration-200 group text-left w-full`}
    >
      {cardContent}
    </button>
  );
}

interface NextStepListItemProps {
  step: NextStepRecommendation;
  index: number;
  showPriority: boolean;
  onClick: () => void;
}

function NextStepListItem({
  step,
  index,
  showPriority,
  onClick,
}: NextStepListItemProps) {
  const listContent = (
    <>
      <div className="flex items-center flex-1">
        <div className="w-8 h-8 border-2 border-foreground bg-brutalist-yellow flex items-center justify-center font-mono font-bold text-sm mr-3">
          {index + 1}
        </div>
        <div className="flex-1">
          <h4 className="font-mono font-bold text-sm uppercase tracking-wider">
            {step.title}
          </h4>
          <p className="text-xs text-foreground/80 font-mono">
            {step.description}
          </p>
        </div>
        {showPriority && (
          <div
            className={`px-2 py-1 text-xs font-mono font-bold uppercase tracking-wider border mr-3 ${
              step.priority === "high"
                ? "border-red-500 text-red-700 dark:text-red-300"
                : step.priority === "medium"
                ? "border-yellow-500 text-yellow-700 dark:text-yellow-300"
                : "border-green-500 text-green-700 dark:text-green-300"
            }`}
          >
            {step.priority}
          </div>
        )}
      </div>
      <ArrowRight
        size={16}
        className="group-hover:translate-x-1 transition-transform duration-200"
      />
    </>
  );

  if (step.href) {
    return (
      <Link
        href={step.href}
        onClick={onClick}
        className="flex items-center justify-between p-3 border-2 border-foreground hover:bg-brutalist-yellow/10 transition-colors duration-200 group w-full text-left"
      >
        {listContent}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between p-3 border-2 border-foreground hover:bg-brutalist-yellow/10 transition-colors duration-200 group w-full text-left"
    >
      {listContent}
    </button>
  );
}

interface NextStepCompactItemProps {
  step: NextStepRecommendation;
  onClick: () => void;
}

function NextStepCompactItem({ step, onClick }: NextStepCompactItemProps) {
  const compactContent = (
    <>
      <span className="font-mono font-bold text-sm uppercase tracking-wider mr-2">
        {step.action}
      </span>
      <ArrowRight
        size={14}
        className="group-hover:translate-x-1 transition-transform duration-200"
      />
    </>
  );

  if (step.href) {
    return (
      <Link
        href={step.href}
        onClick={onClick}
        className="inline-flex items-center px-3 py-2 border-2 border-foreground bg-background hover:bg-brutalist-yellow hover:text-black transition-colors duration-200 group"
      >
        {compactContent}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center px-3 py-2 border-2 border-foreground bg-background hover:bg-brutalist-yellow hover:text-black transition-colors duration-200 group"
    >
      {compactContent}
    </button>
  );
}
