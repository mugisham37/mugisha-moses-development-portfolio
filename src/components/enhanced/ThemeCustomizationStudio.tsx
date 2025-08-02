"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  Monitor,
  Zap,
  Eye,
  Code,
  RotateCcw,
  Save,
  Check,
  AlertCircle,
  Info,
  Sun,
  Moon,
  Contrast,
  Layout,
  Sparkles,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserSettings } from "@/contexts/EnhancedAppContext";
import { ThemeSettings } from "@/types/enhanced";

interface ThemeOption {
  id: keyof ThemeSettings;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  type: "select" | "toggle" | "color" | "textarea";
  options?: {
    value: string;
    label: string;
    description?: string;
    preview?: string;
  }[];
  placeholder?: string;
  validation?: (value: string) => boolean;
  performanceImpact?: "low" | "medium" | "high";
  accessibilityNote?: string;
}

const themeOptions: ThemeOption[] = [
  {
    id: "colorScheme",
    label: "Color Scheme",
    description:
      "Choose your preferred color scheme with automatic system detection",
    icon: Monitor,
    type: "select",
    options: [
      {
        value: "light",
        label: "Light",
        description: "Clean white background with dark text",
        preview: "bg-white text-black border-black",
      },
      {
        value: "dark",
        label: "Dark",
        description: "Dark background with light text",
        preview: "bg-black text-white border-white",
      },
      {
        value: "auto",
        label: "Auto",
        description: "Follow system preference automatically",
        preview: "bg-gradient-to-r from-white to-black text-gray-600",
      },
      {
        value: "high-contrast",
        label: "High Contrast",
        description: "Maximum contrast for accessibility",
        preview: "bg-black text-yellow-400 border-yellow-400",
      },
    ],
  },
  {
    id: "primaryColor",
    label: "Primary Color",
    description: "Main color used for borders, text, and key elements",
    icon: Palette,
    type: "color",
    accessibilityNote: "Ensure sufficient contrast with background colors",
  },
  {
    id: "accentColor",
    label: "Accent Color",
    description: "Highlight color for buttons, links, and interactive elements",
    icon: Sparkles,
    type: "color",
    accessibilityNote: "Used for focus indicators and call-to-action elements",
  },
  {
    id: "layoutDensity",
    label: "Layout Density",
    description: "Control spacing and information density across the site",
    icon: Layout,
    type: "select",
    options: [
      {
        value: "compact",
        label: "Compact",
        description: "More content, less spacing",
        preview: "p-2 text-sm",
      },
      {
        value: "comfortable",
        label: "Comfortable",
        description: "Balanced spacing and readability",
        preview: "p-4 text-base",
      },
      {
        value: "spacious",
        label: "Spacious",
        description: "Maximum breathing room",
        preview: "p-6 text-lg",
      },
    ],
    performanceImpact: "low",
  },
  {
    id: "animationsEnabled",
    label: "Animations",
    description: "Enable smooth transitions and micro-interactions",
    icon: Zap,
    type: "toggle",
    performanceImpact: "medium",
    accessibilityNote: "Respects user's motion preferences",
  },
  {
    id: "reducedMotion",
    label: "Reduced Motion",
    description: "Minimize animations for users sensitive to motion",
    icon: Eye,
    type: "toggle",
    performanceImpact: "low",
    accessibilityNote: "Overrides animation settings for accessibility",
  },
  {
    id: "customCSS",
    label: "Custom CSS",
    description: "Add your own CSS for advanced customization",
    icon: Code,
    type: "textarea",
    placeholder:
      "/* Add your custom CSS here */\n.custom-class {\n  /* Your styles */\n}",
    validation: (value: string) => {
      // Basic CSS validation - check for balanced braces
      const openBraces = (value.match(/{/g) || []).length;
      const closeBraces = (value.match(/}/g) || []).length;
      return openBraces === closeBraces;
    },
    performanceImpact: "high",
    accessibilityNote: "Ensure custom styles maintain accessibility standards",
  },
];

const colorPresets = [
  { name: "Classic", primary: "#000000", accent: "#ffff00" },
  { name: "Ocean", primary: "#1e40af", accent: "#06b6d4" },
  { name: "Forest", primary: "#166534", accent: "#84cc16" },
  { name: "Sunset", primary: "#dc2626", accent: "#f97316" },
  { name: "Purple", primary: "#7c3aed", accent: "#a855f7" },
  { name: "Monochrome", primary: "#374151", accent: "#9ca3af" },
];

export default function ThemeCustomizationStudio() {
  const { settings, updateSettings } = useUserSettings();
  const [previewSettings, setPreviewSettings] = useState<ThemeSettings>(
    settings.theme
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [cssValidationError, setCssValidationError] = useState<string | null>(
    null
  );

  // Track changes
  useEffect(() => {
    const hasChanges =
      JSON.stringify(previewSettings) !== JSON.stringify(settings.theme);
    setHasChanges(hasChanges);
  }, [previewSettings, settings.theme]);

  // Apply preview changes to document for real-time preview
  useEffect(() => {
    const root = document.documentElement;

    // Apply color scheme
    root.setAttribute("data-color-scheme", previewSettings.colorScheme);

    // Apply primary color
    root.style.setProperty("--theme-primary", previewSettings.primaryColor);

    // Apply accent color
    root.style.setProperty("--theme-accent", previewSettings.accentColor);

    // Apply layout density
    const densityMap = {
      compact: "0.75rem",
      comfortable: "1rem",
      spacious: "1.5rem",
    };
    root.style.setProperty(
      "--theme-spacing",
      densityMap[previewSettings.layoutDensity]
    );

    // Apply animation preferences
    if (!previewSettings.animationsEnabled || previewSettings.reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }

    // Apply custom CSS
    let customStyleElement = document.getElementById("custom-theme-css");
    if (previewSettings.customCSS) {
      if (!customStyleElement) {
        customStyleElement = document.createElement("style");
        customStyleElement.id = "custom-theme-css";
        document.head.appendChild(customStyleElement);
      }
      customStyleElement.textContent = previewSettings.customCSS;
    } else if (customStyleElement) {
      customStyleElement.remove();
    }

    return () => {
      // Cleanup on unmount
      root.style.removeProperty("--theme-primary");
      root.style.removeProperty("--theme-accent");
      root.style.removeProperty("--theme-spacing");
      root.classList.remove("reduce-motion");
      const customElement = document.getElementById("custom-theme-css");
      if (customElement) {
        customElement.remove();
      }
    };
  }, [previewSettings]);

  const handleSettingChange = (
    key: keyof ThemeSettings,
    value: string | boolean
  ) => {
    // Validate custom CSS
    if (key === "customCSS" && typeof value === "string") {
      const option = themeOptions.find((opt) => opt.id === key);
      if (option?.validation && !option.validation(value)) {
        setCssValidationError("Invalid CSS: Unbalanced braces detected");
        return;
      } else {
        setCssValidationError(null);
      }
    }

    setPreviewSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleColorPreset = (preset: (typeof colorPresets)[0]) => {
    setPreviewSettings((prev) => ({
      ...prev,
      primaryColor: preset.primary,
      accentColor: preset.accent,
    }));
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      await updateSettings({
        theme: previewSettings,
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleReset = () => {
    const defaultSettings: ThemeSettings = {
      colorScheme: "auto",
      primaryColor: "#000000",
      accentColor: "#ffff00",
      layoutDensity: "comfortable",
      animationsEnabled: true,
      reducedMotion: false,
    };
    setPreviewSettings(defaultSettings);
    setCssValidationError(null);
  };

  const renderControl = (option: ThemeOption) => {
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
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-black font-mono uppercase tracking-wider">
                {option.label}
              </h3>
              {option.performanceImpact && (
                <span
                  className={cn(
                    "px-2 py-1 text-xs font-mono border",
                    option.performanceImpact === "low" &&
                      "bg-green-100 border-green-400 text-green-800",
                    option.performanceImpact === "medium" &&
                      "bg-yellow-100 border-yellow-400 text-yellow-800",
                    option.performanceImpact === "high" &&
                      "bg-red-100 border-red-400 text-red-800"
                  )}
                >
                  {option.performanceImpact} impact
                </span>
              )}
            </div>
            <p className="text-sm font-mono text-gray-600 mb-4">
              {option.description}
            </p>

            {option.accessibilityNote && (
              <div className="mb-4 p-3 border border-blue-400 bg-blue-50">
                <div className="flex items-center gap-2 text-blue-800">
                  <Eye size={14} />
                  <span className="text-xs font-mono font-bold">
                    Accessibility Note:
                  </span>
                </div>
                <p className="text-xs font-mono text-blue-700 mt-1">
                  {option.accessibilityNote}
                </p>
              </div>
            )}

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
                    {opt.preview && (
                      <div
                        className={cn(
                          "w-8 h-8 border-2 border-current",
                          opt.preview
                        )}
                      />
                    )}
                    {currentValue === opt.value && (
                      <Check size={16} className="flex-shrink-0" />
                    )}
                  </label>
                ))}
              </div>
            )}

            {option.type === "color" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={currentValue as string}
                    onChange={(e) =>
                      handleSettingChange(option.id, e.target.value)
                    }
                    className="w-16 h-16 border-2 border-black cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={currentValue as string}
                      onChange={(e) =>
                        handleSettingChange(option.id, e.target.value)
                      }
                      className="w-full p-2 border-2 border-black font-mono uppercase"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                {option.id === "primaryColor" && (
                  <div>
                    <h4 className="font-mono font-bold mb-2">Color Presets:</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => handleColorPreset(preset)}
                          className="p-2 border-2 border-black bg-white hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 border border-black"
                              style={{ backgroundColor: preset.primary }}
                            />
                            <div
                              className="w-4 h-4 border border-black"
                              style={{ backgroundColor: preset.accent }}
                            />
                            <span className="text-xs font-mono">
                              {preset.name}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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

            {option.type === "textarea" && (
              <div className="space-y-2">
                <textarea
                  value={(currentValue as string) || ""}
                  onChange={(e) =>
                    handleSettingChange(option.id, e.target.value)
                  }
                  placeholder={option.placeholder}
                  className="w-full h-32 p-3 border-2 border-black font-mono text-sm resize-vertical"
                />
                {cssValidationError && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle size={14} />
                    <span className="text-xs font-mono">
                      {cssValidationError}
                    </span>
                  </div>
                )}
                <div className="text-xs font-mono text-gray-500">
                  Custom CSS will be applied globally. Use with caution.
                </div>
              </div>
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
              Theme changes are applied immediately for preview. Save to make
              them permanent.
            </p>
          </div>
        </div>
      </div>

      {/* Theme Preview Panel */}
      <div className="border-2 border-black bg-white p-6">
        <h3 className="text-lg font-black font-mono uppercase tracking-wider mb-4">
          Theme Preview
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div
              className="p-4 border-2"
              style={{
                borderColor: previewSettings.primaryColor,
                backgroundColor:
                  previewSettings.colorScheme === "dark" ? "#000" : "#fff",
                color:
                  previewSettings.colorScheme === "dark"
                    ? "#fff"
                    : previewSettings.primaryColor,
              }}
            >
              <h4 className="font-black font-mono">Sample Content</h4>
              <p className="font-mono text-sm">
                This is how your content will look with the current theme
                settings.
              </p>
              <button
                className="mt-2 px-4 py-2 border-2 font-mono font-bold"
                style={{
                  borderColor: previewSettings.primaryColor,
                  backgroundColor: previewSettings.accentColor,
                  color:
                    previewSettings.colorScheme === "dark" ? "#000" : "#000",
                }}
              >
                Sample Button
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-mono font-bold">Current Settings:</h4>
            <ul className="text-sm font-mono space-y-1">
              <li>• Color Scheme: {previewSettings.colorScheme}</li>
              <li>• Primary Color: {previewSettings.primaryColor}</li>
              <li>• Accent Color: {previewSettings.accentColor}</li>
              <li>• Layout Density: {previewSettings.layoutDensity}</li>
              <li>
                • Animations: {previewSettings.animationsEnabled ? "On" : "Off"}
              </li>
              <li>
                • Reduced Motion: {previewSettings.reducedMotion ? "On" : "Off"}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid gap-6">{themeOptions.map(renderControl)}</div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 pt-6 border-t-2 border-black">
        <button
          onClick={handleSave}
          disabled={
            !hasChanges || saveStatus === "saving" || !!cssValidationError
          }
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

      {/* Performance and Accessibility Info */}
      <div className="border-2 border-black bg-gray-50 p-6">
        <h3 className="text-lg font-black font-mono uppercase tracking-wider mb-4">
          Performance & Accessibility Impact
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-mono font-bold">Performance Notes:</h4>
            <ul className="text-sm font-mono space-y-1">
              <li>• Custom CSS may impact load times</li>
              <li>• Animations use GPU acceleration when possible</li>
              <li>• Color changes have minimal performance impact</li>
              <li>• Layout density affects rendering complexity</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-mono font-bold">Accessibility Features:</h4>
            <ul className="text-sm font-mono space-y-1">
              <li>• High contrast mode available</li>
              <li>• Reduced motion respects user preferences</li>
              <li>• Color combinations tested for contrast</li>
              <li>• Focus indicators maintain visibility</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
