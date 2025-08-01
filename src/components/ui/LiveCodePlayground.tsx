"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Play,
  Copy,
  RotateCcw,
  Monitor,
  Smartphone,
  Tablet,
  Zap,
} from "lucide-react";
import { BrutalistButton } from "@/components/ui";

interface CodeExample {
  id: string;
  title: string;
  description: string;
  language: "html" | "css" | "javascript" | "react";
  code: string;
  preview?: string;
  category: "animation" | "interaction" | "layout" | "component";
}

interface PerformanceMetrics {
  renderTime: number;
  bundleSize: number;
  lighthouse: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
}

interface LiveCodePlaygroundProps {
  examples?: CodeExample[];
  showPerformanceMetrics?: boolean;
  allowEditing?: boolean;
  className?: string;
}

const defaultExamples: CodeExample[] = [
  {
    id: "brutalist-button",
    title: "Brutalist Button Animation",
    description: "Interactive button with hover effects and shadow animations",
    language: "react",
    category: "component",
    code: `function BrutalistButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        px-6 py-3 
        bg-yellow-400 
        border-4 border-black 
        font-mono font-bold 
        uppercase tracking-wider
        shadow-[4px_4px_0px_#000000]
        hover:shadow-[6px_6px_0px_#000000]
        hover:translate-y-[-2px]
        transition-all duration-200
        active:scale-95
      "
    >
      {children}
    </button>
  );
}`,
    preview: `<BrutalistButton onClick={() => alert('Clicked!')}>
  Click Me
</BrutalistButton>`,
  },
  {
    id: "css-animation",
    title: "CSS Glitch Effect",
    description: "Pure CSS glitch animation for text elements",
    language: "css",
    category: "animation",
    code: `.glitch-text {
  font-family: 'Space Mono', monospace;
  font-weight: 900;
  font-size: 2rem;
  color: #000;
  position: relative;
  animation: glitch 2s infinite;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  animation: glitch-1 0.5s infinite;
  color: #ff0000;
  z-index: -1;
}

.glitch-text::after {
  animation: glitch-2 0.5s infinite;
  color: #00ff00;
  z-index: -2;
}

@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
}

@keyframes glitch-1 {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(2px, -2px); }
  40% { transform: translate(-2px, 2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(-2px, -2px); }
}

@keyframes glitch-2 {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(2px, -2px); }
  60% { transform: translate(-2px, -2px); }
  80% { transform: translate(2px, 2px); }
}`,
    preview: `<div class="glitch-text" data-text="GLITCH">
  GLITCH
</div>`,
  },
  {
    id: "interactive-card",
    title: "Interactive Hover Card",
    description: "Card component with multiple hover states and transitions",
    language: "html",
    category: "interaction",
    code: `<div class="brutalist-card group cursor-pointer">
  <div class="card-content">
    <h3 class="card-title">Interactive Card</h3>
    <p class="card-description">
      Hover to see the magic happen
    </p>
    <div class="card-stats">
      <div class="stat">
        <span class="stat-value">98%</span>
        <span class="stat-label">Performance</span>
      </div>
      <div class="stat">
        <span class="stat-value">2.1s</span>
        <span class="stat-label">Load Time</span>
      </div>
    </div>
  </div>
  
  <div class="card-overlay">
    <div class="overlay-content">
      <button class="overlay-button">
        View Details
      </button>
    </div>
  </div>
</div>

<style>
.brutalist-card {
  position: relative;
  background: #f5f5f5;
  border: 4px solid black;
  padding: 1.5rem;
  box-shadow: 4px 4px 0px black;
  transition: all 0.3s ease;
  overflow: hidden;
}

.brutalist-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px black;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.3s ease;
}

.brutalist-card:hover .card-overlay {
  opacity: 1;
  transform: translateY(0);
}
</style>`,
  },
];

export default function LiveCodePlayground({
  examples = defaultExamples,
  showPerformanceMetrics = true,
  allowEditing = true,
  className = "",
}: LiveCodePlaygroundProps) {
  const [selectedExample, setSelectedExample] = useState(examples[0]);
  const [editableCode, setEditableCode] = useState(selectedExample.code);
  const [isRunning, setIsRunning] = useState(false);
  const [viewportSize, setViewportSize] = useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");
  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetrics | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Update editable code when example changes
  useEffect(() => {
    setEditableCode(selectedExample.code);
  }, [selectedExample]);

  // Simulate performance metrics calculation
  const calculatePerformanceMetrics = useCallback(() => {
    setIsRunning(true);

    // Simulate performance calculation
    setTimeout(() => {
      const metrics: PerformanceMetrics = {
        renderTime: Math.random() * 50 + 10, // 10-60ms
        bundleSize: Math.random() * 20 + 5, // 5-25kb
        lighthouse: {
          performance: Math.floor(Math.random() * 20 + 80), // 80-100
          accessibility: Math.floor(Math.random() * 15 + 85), // 85-100
          bestPractices: Math.floor(Math.random() * 10 + 90), // 90-100
          seo: Math.floor(Math.random() * 25 + 75), // 75-100
        },
      };
      setPerformanceMetrics(metrics);
      setIsRunning(false);
    }, 1500);
  }, []);

  // Run code and calculate metrics
  const handleRunCode = useCallback(() => {
    if (showPerformanceMetrics) {
      calculatePerformanceMetrics();
    }
  }, [showPerformanceMetrics, calculatePerformanceMetrics]);

  // Copy code to clipboard
  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(editableCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  }, [editableCode]);

  // Reset code to original
  const handleResetCode = useCallback(() => {
    setEditableCode(selectedExample.code);
  }, [selectedExample.code]);

  // Filter examples by category
  const categorizedExamples = useMemo(() => {
    const categories = [
      "animation",
      "interaction",
      "layout",
      "component",
    ] as const;
    return categories.reduce((acc, category) => {
      acc[category] = examples.filter(
        (example) => example.category === category
      );
      return acc;
    }, {} as Record<string, CodeExample[]>);
  }, [examples]);

  // Get viewport size classes
  const getViewportClasses = () => {
    switch (viewportSize) {
      case "mobile":
        return "max-w-sm";
      case "tablet":
        return "max-w-md";
      default:
        return "max-w-full";
    }
  };

  return (
    <div className={`live-code-playground ${className}`}>
      {/* Header */}
      <div className="playground-header">
        <h3 className="playground-title">Live Code Playground</h3>
        <p className="playground-subtitle">
          Interactive examples showcasing modern web development techniques
        </p>
      </div>

      {/* Example Categories */}
      <div className="playground-categories">
        {Object.entries(categorizedExamples).map(
          ([category, categoryExamples]) => (
            <div key={category} className="category-section">
              <h4 className="category-title">{category}</h4>
              <div className="category-examples">
                {categoryExamples.map((example) => (
                  <button
                    key={example.id}
                    onClick={() => setSelectedExample(example)}
                    className={`example-button ${
                      selectedExample.id === example.id
                        ? "example-button-active"
                        : ""
                    }`}
                  >
                    <span className="example-title">{example.title}</span>
                    <span className="example-language">{example.language}</span>
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {/* Main Playground */}
      <div className="playground-main">
        {/* Code Editor */}
        <div className="code-editor-section">
          <div className="editor-header">
            <div className="editor-title">
              <span className="editor-filename">
                {selectedExample.title}.{selectedExample.language}
              </span>
              <span className="editor-description">
                {selectedExample.description}
              </span>
            </div>

            <div className="editor-actions">
              <button
                onClick={handleCopyCode}
                className="editor-action-btn"
                title="Copy code"
              >
                <Copy size={16} />
                {copySuccess && <span className="copy-success">Copied!</span>}
              </button>

              {allowEditing && (
                <button
                  onClick={handleResetCode}
                  className="editor-action-btn"
                  title="Reset to original"
                >
                  <RotateCcw size={16} />
                </button>
              )}

              <BrutalistButton
                variant="accent"
                size="sm"
                onClick={handleRunCode}
                className="run-button"
              >
                <Play size={16} />
                Run
              </BrutalistButton>
            </div>
          </div>

          <div className="code-editor">
            {allowEditing ? (
              <textarea
                value={editableCode}
                onChange={(e) => setEditableCode(e.target.value)}
                className="code-textarea"
                spellCheck={false}
              />
            ) : (
              <pre className="code-display">
                <code>{editableCode}</code>
              </pre>
            )}
          </div>
        </div>

        {/* Preview Section */}
        <div className="preview-section">
          <div className="preview-header">
            <span className="preview-title">Live Preview</span>

            <div className="viewport-controls">
              <button
                onClick={() => setViewportSize("mobile")}
                className={`viewport-btn ${
                  viewportSize === "mobile" ? "viewport-btn-active" : ""
                }`}
                title="Mobile view"
              >
                <Smartphone size={16} />
              </button>
              <button
                onClick={() => setViewportSize("tablet")}
                className={`viewport-btn ${
                  viewportSize === "tablet" ? "viewport-btn-active" : ""
                }`}
                title="Tablet view"
              >
                <Tablet size={16} />
              </button>
              <button
                onClick={() => setViewportSize("desktop")}
                className={`viewport-btn ${
                  viewportSize === "desktop" ? "viewport-btn-active" : ""
                }`}
                title="Desktop view"
              >
                <Monitor size={16} />
              </button>
            </div>
          </div>

          <div className={`preview-container ${getViewportClasses()}`}>
            <div className="preview-frame">
              {selectedExample.preview ? (
                <div
                  className="preview-content"
                  dangerouslySetInnerHTML={{ __html: selectedExample.preview }}
                />
              ) : (
                <div className="preview-placeholder">
                  <p>Preview not available for this example</p>
                  <p className="text-sm opacity-60">
                    Copy the code to test it in your own environment
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {showPerformanceMetrics && (
        <div className="performance-metrics">
          <div className="metrics-header">
            <h4 className="metrics-title">
              <Zap size={20} />
              Performance Metrics
            </h4>
            {isRunning && <div className="metrics-loading">Analyzing...</div>}
          </div>

          {performanceMetrics && !isRunning && (
            <div className="metrics-grid">
              <div className="metric-card">
                <span className="metric-label">Render Time</span>
                <span className="metric-value">
                  {performanceMetrics.renderTime.toFixed(1)}ms
                </span>
              </div>

              <div className="metric-card">
                <span className="metric-label">Bundle Size</span>
                <span className="metric-value">
                  {performanceMetrics.bundleSize.toFixed(1)}kb
                </span>
              </div>

              <div className="metric-card">
                <span className="metric-label">Performance</span>
                <span className="metric-value metric-score">
                  {performanceMetrics.lighthouse.performance}
                </span>
              </div>

              <div className="metric-card">
                <span className="metric-label">Accessibility</span>
                <span className="metric-value metric-score">
                  {performanceMetrics.lighthouse.accessibility}
                </span>
              </div>

              <div className="metric-card">
                <span className="metric-label">Best Practices</span>
                <span className="metric-value metric-score">
                  {performanceMetrics.lighthouse.bestPractices}
                </span>
              </div>

              <div className="metric-card">
                <span className="metric-label">SEO</span>
                <span className="metric-value metric-score">
                  {performanceMetrics.lighthouse.seo}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
