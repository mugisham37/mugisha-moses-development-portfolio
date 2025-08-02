"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Circle,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

export interface ProgressStep {
  id: string;
  label: string;
  description?: string;
  status: "completed" | "in-progress" | "pending" | "error" | "skipped";
  progress?: number; // 0-100
  metadata?: Record<string, any>;
  estimatedTime?: string;
  actualTime?: string;
}

export interface ProgressIndicatorProps {
  steps: ProgressStep[];
  type?: "linear" | "circular" | "radial" | "timeline" | "kanban";
  orientation?: "horizontal" | "vertical";
  showLabels?: boolean;
  showProgress?: boolean;
  showMetadata?: boolean;
  animated?: boolean;
  interactive?: boolean;
  className?: string;
  onStepClick?: (step: ProgressStep) => void;
  onProgressUpdate?: (stepId: string, progress: number) => void;
}

const ProgressIndicators: React.FC<ProgressIndicatorProps> = ({
  steps,
  type = "linear",
  orientation = "horizontal",
  showLabels = true,
  showProgress = true,
  showMetadata = false,
  animated = true,
  interactive = false,
  className,
  onStepClick,
  onProgressUpdate,
}) => {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  const getStatusIcon = (status: ProgressStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "in-progress":
        return <Play className="w-5 h-5 text-blue-600" />;
      case "pending":
        return <Circle className="w-5 h-5 text-gray-400" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "skipped":
        return <Minus className="w-5 h-5 text-yellow-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ProgressStep["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "pending":
        return "bg-gray-300";
      case "error":
        return "bg-red-500";
      case "skipped":
        return "bg-yellow-500";
      default:
        return "bg-gray-300";
    }
  };

  const renderLinearProgress = () => {
    const isVertical = orientation === "vertical";

    return (
      <div
        className={cn(
          "flex",
          isVertical ? "flex-col space-y-4" : "items-center space-x-4",
          className
        )}
      >
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center",
              isVertical ? "w-full" : "flex-col",
              interactive && "cursor-pointer"
            )}
            onClick={() => interactive && onStepClick?.(step)}
            onMouseEnter={() => setHoveredStep(step.id)}
            onMouseLeave={() => setHoveredStep(null)}
          >
            {/* Step Indicator */}
            <motion.div
              className={cn(
                "relative flex items-center justify-center w-12 h-12 border-3 border-black",
                getStatusColor(step.status),
                hoveredStep === step.id && "scale-110"
              )}
              whileHover={animated ? { scale: 1.1 } : {}}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {getStatusIcon(step.status)}

              {/* Progress Ring for In-Progress Steps */}
              {step.status === "in-progress" && step.progress !== undefined && (
                <motion.div
                  className="absolute inset-0 border-3 border-transparent"
                  style={{
                    background: `conic-gradient(from 0deg, #3B82F6 ${
                      (step.progress / 100) * 360
                    }deg, transparent ${(step.progress / 100) * 360}deg)`,
                    borderRadius: "0",
                    mask: "radial-gradient(circle at center, transparent 60%, black 60%)",
                  }}
                  initial={animated ? { rotate: 0 } : {}}
                  animate={animated ? { rotate: 360 } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.div>

            {/* Step Content */}
            {showLabels && (
              <div
                className={cn(
                  "ml-4",
                  isVertical ? "flex-1" : "mt-2 text-center"
                )}
              >
                <div className="font-mono font-bold text-sm uppercase tracking-wider">
                  {step.label}
                </div>
                {step.description && (
                  <div className="font-mono text-xs text-gray-600 mt-1">
                    {step.description}
                  </div>
                )}
                {showProgress && step.progress !== undefined && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span>Progress</span>
                      <span>{step.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 border border-black h-2">
                      <motion.div
                        className={cn("h-full", getStatusColor(step.status))}
                        initial={
                          animated
                            ? { width: 0 }
                            : { width: `${step.progress}%` }
                        }
                        animate={{ width: `${step.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                )}
                {showMetadata && step.metadata && (
                  <div className="mt-2 space-y-1">
                    {Object.entries(step.metadata).map(([key, value]) => (
                      <div
                        key={key}
                        className="text-xs font-mono text-gray-500"
                      >
                        <span className="font-bold">{key}:</span>{" "}
                        {String(value)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "border-black border-dashed",
                  isVertical
                    ? "w-0.5 h-8 border-l-2 ml-6"
                    : "h-0.5 w-8 border-t-2 mt-6"
                )}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderCircularProgress = () => {
    const completedSteps = steps.filter(
      (step) => step.status === "completed"
    ).length;
    const totalSteps = steps.length;
    const progressPercentage = (completedSteps / totalSteps) * 100;
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDasharray = circumference;
    const strokeDashoffset =
      circumference - (progressPercentage / 100) * circumference;

    return (
      <div
        className={cn("relative flex items-center justify-center", className)}
      >
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={animated ? circumference : strokeDashoffset}
            className="text-blue-500"
            animate={animated ? { strokeDashoffset } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-mono font-black">
            {Math.round(progressPercentage)}%
          </div>
          <div className="text-xs font-mono text-gray-600 uppercase tracking-wider">
            {completedSteps}/{totalSteps} Complete
          </div>
        </div>

        {/* Step Details */}
        {showLabels && (
          <div className="absolute top-full mt-4 w-full">
            <div className="space-y-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center justify-between text-sm font-mono"
                >
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(step.status)}
                    <span>{step.label}</span>
                  </div>
                  {step.progress !== undefined && (
                    <span className="text-gray-600">{step.progress}%</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTimelineProgress = () => {
    return (
      <div className={cn("relative", className)}>
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300" />

        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="relative flex items-start"
              initial={animated ? { opacity: 0, x: -20 } : {}}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Timeline Node */}
              <div
                className={cn(
                  "relative z-10 flex items-center justify-center w-12 h-12 border-3 border-black",
                  getStatusColor(step.status),
                  interactive && "cursor-pointer"
                )}
                onClick={() => interactive && onStepClick?.(step)}
              >
                {getStatusIcon(step.status)}
              </div>

              {/* Content */}
              <div className="ml-6 flex-1">
                <div className="bg-white border-3 border-black p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-mono font-bold text-lg uppercase tracking-wider">
                      {step.label}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm font-mono">
                      {step.estimatedTime && (
                        <span className="text-gray-600">
                          Est: {step.estimatedTime}
                        </span>
                      )}
                      {step.actualTime && (
                        <span className="text-green-600">
                          Actual: {step.actualTime}
                        </span>
                      )}
                    </div>
                  </div>

                  {step.description && (
                    <p className="font-mono text-gray-700 mb-3">
                      {step.description}
                    </p>
                  )}

                  {showProgress && step.progress !== undefined && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span>Progress</span>
                        <span>{step.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 border border-black h-2">
                        <motion.div
                          className={cn("h-full", getStatusColor(step.status))}
                          initial={
                            animated
                              ? { width: 0 }
                              : { width: `${step.progress}%` }
                          }
                          animate={{ width: `${step.progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  )}

                  {showMetadata && step.metadata && (
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      {Object.entries(step.metadata).map(([key, value]) => (
                        <div key={key} className="text-gray-600">
                          <span className="font-bold">{key}:</span>{" "}
                          {String(value)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderKanbanProgress = () => {
    const statusGroups = {
      pending: steps.filter((step) => step.status === "pending"),
      "in-progress": steps.filter((step) => step.status === "in-progress"),
      completed: steps.filter((step) => step.status === "completed"),
      error: steps.filter((step) => step.status === "error"),
      skipped: steps.filter((step) => step.status === "skipped"),
    };

    return (
      <div className={cn("grid grid-cols-5 gap-4", className)}>
        {Object.entries(statusGroups).map(([status, statusSteps]) => (
          <div key={status} className="space-y-3">
            <div className="text-center">
              <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-2">
                {status.replace("-", " ")}
              </h3>
              <div className="text-2xl font-mono font-black">
                {statusSteps.length}
              </div>
            </div>

            <div className="space-y-2">
              {statusSteps.map((step) => (
                <motion.div
                  key={step.id}
                  className={cn(
                    "p-3 border-2 border-black bg-white",
                    interactive && "cursor-pointer hover:bg-gray-50"
                  )}
                  onClick={() => interactive && onStepClick?.(step)}
                  whileHover={animated ? { y: -2 } : {}}
                  layout
                >
                  <div className="flex items-center justify-between mb-2">
                    {getStatusIcon(step.status)}
                    {step.progress !== undefined && (
                      <span className="text-xs font-mono">
                        {step.progress}%
                      </span>
                    )}
                  </div>
                  <div className="font-mono font-bold text-xs uppercase tracking-wider">
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="font-mono text-xs text-gray-600 mt-1">
                      {step.description}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderRadialProgress = () => {
    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-6", className)}>
        {steps.map((step, index) => {
          const progress = step.progress || 0;
          const circumference = 2 * Math.PI * 30; // radius = 30
          const strokeDasharray = circumference;
          const strokeDashoffset =
            circumference - (progress / 100) * circumference;

          return (
            <motion.div
              key={step.id}
              className={cn(
                "relative flex flex-col items-center p-4 border-2 border-black bg-white",
                interactive && "cursor-pointer hover:bg-gray-50"
              )}
              onClick={() => interactive && onStepClick?.(step)}
              initial={animated ? { opacity: 0, scale: 0.8 } : {}}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={animated ? { y: -5 } : {}}
            >
              <svg
                className="w-20 h-20 transform -rotate-90 mb-3"
                viewBox="0 0 70 70"
              >
                {/* Background Circle */}
                <circle
                  cx="35"
                  cy="35"
                  r="30"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  className="text-gray-200"
                />
                {/* Progress Circle */}
                <motion.circle
                  cx="35"
                  cy="35"
                  r="30"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={animated ? circumference : strokeDashoffset}
                  className={cn(
                    step.status === "completed" && "text-green-500",
                    step.status === "in-progress" && "text-blue-500",
                    step.status === "error" && "text-red-500",
                    step.status === "pending" && "text-gray-400",
                    step.status === "skipped" && "text-yellow-500"
                  )}
                  animate={animated ? { strokeDashoffset } : {}}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>

              {/* Center Icon */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                {getStatusIcon(step.status)}
              </div>

              {/* Progress Percentage */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-xs font-mono font-bold">
                {progress}%
              </div>

              {/* Step Label */}
              <div className="text-center">
                <div className="font-mono font-bold text-sm uppercase tracking-wider">
                  {step.label}
                </div>
                {step.description && (
                  <div className="font-mono text-xs text-gray-600 mt-1">
                    {step.description}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  switch (type) {
    case "circular":
      return renderCircularProgress();
    case "timeline":
      return renderTimelineProgress();
    case "kanban":
      return renderKanbanProgress();
    case "radial":
      return renderRadialProgress();
    default:
      return renderLinearProgress();
  }
};

export default ProgressIndicators;
