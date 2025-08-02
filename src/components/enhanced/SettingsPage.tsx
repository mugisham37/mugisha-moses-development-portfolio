"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Eye,
  Palette,
  Shield,
  Zap,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserSettings } from "@/contexts/EnhancedAppContext";
import AccessibilityControlCenter from "./AccessibilityControlCenter";
import ThemeCustomizationStudio from "./ThemeCustomizationStudio";
import PrivacyDataManagementCenter from "./PrivacyDataManagementCenter";
import PerformanceDeveloperOptions from "./PerformanceDeveloperOptions";

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  component: React.ComponentType;
}

const settingsSections: SettingsSection[] = [
  {
    id: "accessibility",
    title: "Accessibility Control Center",
    description:
      "Font size, contrast, motion preferences, and screen reader optimization",
    icon: Eye,
    component: AccessibilityControlCenter,
  },
  {
    id: "theme",
    title: "Theme Customization Studio",
    description:
      "Color schemes, layout density, animations, and visual effects",
    icon: Palette,
    component: ThemeCustomizationStudio,
  },
  {
    id: "privacy",
    title: "Privacy & Data Management",
    description:
      "Cookie preferences, analytics, data export, and GDPR compliance",
    icon: Shield,
    component: PrivacyDataManagementCenter,
  },
  {
    id: "performance",
    title: "Performance & Developer Options",
    description: "Performance optimization, debug tools, and advanced features",
    icon: Zap,
    component: PerformanceDeveloperOptions,
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { settings } = useUserSettings();

  const ActiveComponent = activeSection
    ? settingsSections.find((section) => section.id === activeSection)
        ?.component
    : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            {activeSection && (
              <button
                onClick={() => setActiveSection(null)}
                className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors duration-200"
                aria-label="Back to settings overview"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-4xl md:text-5xl font-black font-mono uppercase tracking-wider">
                Settings
              </h1>
              <p className="text-lg font-mono mt-2 text-gray-600">
                {activeSection
                  ? settingsSections.find((s) => s.id === activeSection)?.title
                  : "Customize your browsing experience"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!activeSection ? (
          /* Settings Overview */
          <div className="grid gap-6 md:grid-cols-2">
            {settingsSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "group relative p-6 border-4 border-black bg-white",
                    "hover:bg-black hover:text-white transition-all duration-300",
                    "text-left focus:outline-none focus:ring-4 focus:ring-yellow-400",
                    "transform hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon
                          size={24}
                          className="group-hover:text-white transition-colors"
                        />
                        <h2 className="text-xl font-black font-mono uppercase tracking-wider">
                          {section.title}
                        </h2>
                      </div>
                      <p className="text-sm font-mono leading-relaxed text-gray-600 group-hover:text-gray-300">
                        {section.description}
                      </p>
                    </div>
                    <ChevronRight
                      size={20}
                      className="ml-4 group-hover:text-white transition-colors flex-shrink-0"
                    />
                  </div>

                  {/* Visual indicator for sections with active settings */}
                  <div className="absolute top-4 right-4">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          /* Active Section */
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {ActiveComponent && <ActiveComponent />}
          </motion.div>
        )}
      </div>
    </div>
  );
}
