"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Type,
  Eye,
  Volume2,
  Keyboard,
  Monitor,
  RotateCcw,
  Save,
  Check,
  AlertCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserSettings } from "@/contexts/EnhancedAppContext";
import { AccessibilitySettings } from "@/types/enhanced";
// import BrutalistButton from "../ui/BrutalistButton";

interface AccessibilityOption {
  id: keyof AccessibilitySettings;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  type: "select" | "toggle" | "range";
  options?: { value: string; label: string; description?: string }[];
  min?: number;
  max?: number;
  step?: number;
}

const accessibilityOptions: AccessibilityOption[] = [
  {
    id: "fontSize",
    label: "Font Size",
    description: "Adjust text size for better readability",
    icon: Type,
    type: "select",
    options: [
      {
        value: "small",
        label: "Small",
        description: "Compact text for more content",
      },
      {
        value: "medium",
        label: "Medium",
        description: "Standard readable size",
      },
      { value: "large", label: "Large", description: "Easier to read text" },
      {
        value: "extra-large",
        label: "Extra Large",
        description: "Maximum readability",
      },
    ],
  },
  {
    id: "fontFamily",
    label: "Font Family",
    description: "Choose fonts optimized for readability",
    icon: Type,
    type: "select",
    options: [
      {
        value: "default",
        label: "Default",
        description: "Standard brutalist mono font",
      },
      {
        value: "dyslexia-friendly",
        label: "Dyslexia Friendly",
        description: "OpenDyslexic font",
      },
      {
        value: "high-readability",
        label: "High Readability",
        description: "Optimized for clarity",
      },
    ],
  },
  {
    id: "contrastRatio",
    label: "Contrast Ratio",
    description: "Adjust color contrast for better visibility",
    icon: Eye,
    type: "select",
    options: [
      {
        value: "normal",
        label: "Normal",
        description: "Standard contrast (4.5:1)",
      },
      { value: "high", label: "High", description: "Enhanced contrast (7:1)" },
      {
        value: "maximum",
        label: "Maximum",
        description: "Highest contrast (21:1)",
      },
    ],
  },
  {
    id: "focusIndicators",
    label: "Focus Indicators",
    description: "Enhanced visual focus indicators for keyboard navigation",
    icon: Keyboard,
    type: "toggle",
  },
  {
    id: "screenReaderOptimized",
    label: "Screen Reader Optimization",
    description: "Optimize content structure and labels for screen readers",
    icon: Volume2,
    type: "toggle",
  },
  {
    id: "keyboardNavigation",
    label: "Enhanced Keyboard Navigation",
    description: "Improved keyboard shortcuts and navigation patterns",
    icon: Keyboard,
    type: "toggle",
  },
  {
    id: "audioDescriptions",
    label: "Audio Descriptions",
    description: "Enable audio descriptions for visual content",
    icon: Volume2,
    type: "toggle",
  },
  {
    id: "captionsEnabled",
    label: "Captions",
    description: "Show captions for video and audio content",
    icon: Monitor,
    type: "toggle",
  },
];

export default function AccessibilityControlCenter() {
  const { settings, updateSettings } = useUserSettings();
  const [previewSettings, setPreviewSettings] = useState<AccessibilitySettings>(
    settings.accessibility
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  // Track changes
  useEffect(() => {
    const hasChanges =
      JSON.stringify(previewSettings) !==
      JSON.stringify(settings.accessibility);
    setHasChanges(hasChanges);
  }, [previewSettings, settings.accessibility]);

  // Apply preview changes to document for real-time preview
  useEffect(() => {
    const root = document.documentElement;

    // Apply font size
    const fontSizeMap = {
      small: "14px",
      medium: "16px",
      large: "18px",
      "extra-large": "22px",
    };
    root.style.setProperty(
      "--accessibility-font-size",
      fontSizeMap[previewSettings.fontSize]
    );

    // Apply font family
    const fontFamilyMap = {
      default:
        "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      "dyslexia-friendly": "OpenDyslexic, ui-monospace, monospace",
      "high-readability":
        "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    };
    root.style.setProperty(
      "--accessibility-font-family",
      fontFamilyMap[previewSettings.fontFamily]
    );

    // Apply contrast adjustments
    const contrastMap = {
      normal: "1",
      high: "1.2",
      maximum: "1.5",
    };
    root.style.setProperty(
      "--accessibility-contrast",
      contrastMap[previewSettings.contrastRatio]
    );

    // Apply focus indicators
    if (previewSettings.focusIndicators) {
      root.classList.add("enhanced-focus");
    } else {
      root.classList.remove("enhanced-focus");
    }

    // Apply screen reader optimizations
    if (previewSettings.screenReaderOptimized) {
      root.classList.add("screen-reader-optimized");
    } else {
      root.classList.remove("screen-reader-optimized");
    }

    return () => {
      // Cleanup on unmount
      root.style.removeProperty("--accessibility-font-size");
      root.style.removeProperty("--accessibility-font-family");
      root.style.removeProperty("--accessibility-contrast");
      root.classList.remove("enhanced-focus", "screen-reader-optimized");
    };
  }, [previewSettings]);

  const handleSettingChange = (
    key: keyof AccessibilitySettings,
    value: string | boolean
  ) => {
    setPreviewSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      await updateSettings({
        accessibility: previewSettings,
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleReset = () => {
    const defaultSettings: AccessibilitySettings = {
      fontSize: "medium",
      fontFamily: "default",
      contrastRatio: "normal",
      focusIndicators: true,
      screenReaderOptimized: false,
      keyboardNavigation: true,
      audioDescriptions: false,
      captionsEnabled: false,
    };
    setPreviewSettings(defaultSettings);
  };

  const renderControl = (option: AccessibilityOption) => {
    const Icon = option.icon;
    const currentValue = previewSettings[option.id];

    return (
      <motion.div
        key={option.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-2 border-black bg-white p-6"
      >
        <div className="flex items-start gap-4">
          <div className="p-2 border-2 border-black bg-yellow-400">
            <Icon size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-black font-mono uppercase tracking-wider mb-2">
              {option.label}
            </h3>
            <p className="text-sm font-mono text-gray-600 mb-4">
              {option.description}
            </p>

            {option.type === "select" && option.options && (
              <div className="space-y-2">
                {option.options.map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex items-center gap-3 p-3 border-2 cursor-pointer transition-colors",
                      currentValue === opt.value
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white hover:border-black"
                    )}
                  >
                    <input
                      type="radio"
                      name={option.id}
                      value={opt.value}
                      checked={currentValue === opt.value}
                      onChange={(e) =>
                        handleSettingChange(option.id, e.target.value)
                      }
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-mono font-bold">{opt.label}</div>
                      {opt.description && (
                        <div className="text-sm opacity-75">
                          {opt.description}
                        </div>
                      )}
                    </div>
                    {currentValue === opt.value && (
                      <Check size={16} className="flex-shrink-0" />
                    )}
                  </label>
                ))}
              </div>
            )}

            {option.type === "toggle" && (
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={currentValue as boolean}
                    onChange={(e) =>
                      handleSettingChange(option.id, e.target.checked)
                    }
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "w-12 h-6 border-2 border-black transition-colors",
                      currentValue ? "bg-black" : "bg-white"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 bg-yellow-400 border border-black transition-transform",
                        currentValue ? "translate-x-6" : "translate-x-0"
                      )}
                    />
                  </div>
                </div>
                <span className="font-mono font-bold">
                  {currentValue ? "Enabled" : "Disabled"}
                </span>
              </label>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header with preview notice */}
      <div className="border-2 border-yellow-400 bg-yellow-50 p-4">
        <div className="flex items-center gap-3">
          <Info size={20} className="text-yellow-600" />
          <div>
            <h2 className="font-black font-mono uppercase tracking-wider text-yellow-800">
              Live Preview Active
            </h2>
            <p className="text-sm font-mono text-yellow-700">
              Changes are applied immediately for preview. Save to make them
              permanent.
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid gap-6">
        {accessibilityOptions.map(renderControl)}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 pt-6 border-t-2 border-black">
        <button
          onClick={handleSave}
          disabled={!hasChanges || saveStatus === "saving"}
          className={cn(
            "flex items-center gap-2 px-6 py-3 border-2 border-black bg-white font-mono font-bold uppercase tracking-wider",
            "hover:bg-black hover:text-white transition-colors duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            saveStatus === "saved" && "bg-green-400 border-green-600"
          )}
        >
          {saveStatus === "saving" ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : saveStatus === "saved" ? (
            <>
              <Check size={16} />
              Saved!
            </>
          ) : saveStatus === "error" ? (
            <>
              <AlertCircle size={16} />
              Error Saving
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 border-2 border-black bg-gray-100 font-mono font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-200"
        >
          <RotateCcw size={16} />
          Reset to Defaults
        </button>
      </div>

      {/* Accessibility testing panel */}
      <div className="border-2 border-black bg-gray-50 p-6">
        <h3 className="text-lg font-black font-mono uppercase tracking-wider mb-4">
          Accessibility Testing
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-mono font-bold">Current Settings Impact:</h4>
            <ul className="text-sm font-mono space-y-1">
              <li>• Font Size: {previewSettings.fontSize}</li>
              <li>• Contrast: {previewSettings.contrastRatio}</li>
              <li>
                • Focus Indicators:{" "}
                {previewSettings.focusIndicators ? "On" : "Off"}
              </li>
              <li>
                • Screen Reader:{" "}
                {previewSettings.screenReaderOptimized ? "On" : "Off"}
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-mono font-bold">Keyboard Shortcuts:</h4>
            <ul className="text-sm font-mono space-y-1">
              <li>• Tab: Navigate forward</li>
              <li>• Shift+Tab: Navigate backward</li>
              <li>• Enter/Space: Activate controls</li>
              <li>• Esc: Close modals/menus</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
