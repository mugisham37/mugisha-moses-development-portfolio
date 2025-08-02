"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Cookie,
  BarChart3,
  Download,
  Trash2,
  FileText,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Globe,
  Lock,
  Unlock,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserSettings } from "@/contexts/EnhancedAppContext";

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  essential: boolean;
  enabled: boolean;
  cookies: CookieDetail[];
}

interface CookieDetail {
  name: string;
  purpose: string;
  duration: string;
  provider: string;
}

interface DataExportOption {
  id: string;
  name: string;
  description: string;
  format: "json" | "csv" | "pdf";
  size: string;
  lastGenerated?: Date;
}

interface GDPRRight {
  id: string;
  title: string;
  description: string;
  action: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  status: "available" | "pending" | "completed";
}

export default function PrivacyDataManagementCenter() {
  const { settings, updateSettings } = useUserSettings();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [exportInProgress, setExportInProgress] = useState<Set<string>>(
    new Set()
  );

  // Cookie categories with detailed information
  const [cookieCategories, setCookieCategories] = useState<CookieCategory[]>([
    {
      id: "essential",
      name: "Essential Cookies",
      description:
        "Required for basic site functionality and cannot be disabled.",
      essential: true,
      enabled: true,
      cookies: [
        {
          name: "session_id",
          purpose: "Maintains user session state",
          duration: "Session",
          provider: "Portfolio Site",
        },
        {
          name: "csrf_token",
          purpose: "Prevents cross-site request forgery attacks",
          duration: "Session",
          provider: "Portfolio Site",
        },
        {
          name: "user_preferences",
          purpose: "Stores accessibility and theme preferences",
          duration: "1 year",
          provider: "Portfolio Site",
        },
      ],
    },
    {
      id: "analytics",
      name: "Analytics Cookies",
      description: "Help us understand how visitors interact with our website.",
      essential: false,
      enabled: settings.privacy.analyticsEnabled,
      cookies: [
        {
          name: "_ga",
          purpose: "Distinguishes unique users",
          duration: "2 years",
          provider: "Google Analytics",
        },
        {
          name: "_gid",
          purpose: "Distinguishes unique users",
          duration: "24 hours",
          provider: "Google Analytics",
        },
        {
          name: "page_views",
          purpose: "Tracks page view statistics",
          duration: "30 days",
          provider: "Portfolio Site",
        },
      ],
    },
    {
      id: "functional",
      name: "Functional Cookies",
      description:
        "Enable enhanced functionality and personalization features.",
      essential: false,
      enabled: settings.privacy.personalizedContent,
      cookies: [
        {
          name: "theme_preference",
          purpose: "Remembers selected color scheme",
          duration: "1 year",
          provider: "Portfolio Site",
        },
        {
          name: "language_preference",
          purpose: "Stores preferred language setting",
          duration: "1 year",
          provider: "Portfolio Site",
        },
        {
          name: "layout_density",
          purpose: "Remembers layout density preference",
          duration: "1 year",
          provider: "Portfolio Site",
        },
      ],
    },
    {
      id: "marketing",
      name: "Marketing Cookies",
      description:
        "Used to track visitors across websites for marketing purposes.",
      essential: false,
      enabled: settings.notifications.marketingCommunications,
      cookies: [
        {
          name: "marketing_consent",
          purpose: "Tracks marketing communication preferences",
          duration: "2 years",
          provider: "Portfolio Site",
        },
        {
          name: "campaign_source",
          purpose: "Tracks referral sources for marketing analysis",
          duration: "30 days",
          provider: "Portfolio Site",
        },
      ],
    },
  ]);

  // Data export options
  const dataExportOptions: DataExportOption[] = [
    {
      id: "personal_data",
      name: "Personal Data",
      description: "All personal information and preferences",
      format: "json",
      size: "~2KB",
      lastGenerated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: "activity_log",
      name: "Activity Log",
      description: "Page visits, interactions, and usage patterns",
      format: "csv",
      size: "~15KB",
    },
    {
      id: "communication_history",
      name: "Communication History",
      description: "Contact form submissions and inquiries",
      format: "pdf",
      size: "~5KB",
    },
    {
      id: "preferences_backup",
      name: "Settings Backup",
      description: "Complete backup of all your preferences",
      format: "json",
      size: "~1KB",
      lastGenerated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];

  // GDPR rights and actions
  const gdprRights: GDPRRight[] = [
    {
      id: "access",
      title: "Right to Access",
      description: "Request a copy of all personal data we hold about you",
      action: "Request Data Copy",
      icon: Eye,
      status: "available",
    },
    {
      id: "rectification",
      title: "Right to Rectification",
      description: "Request correction of inaccurate personal data",
      action: "Request Correction",
      icon: Settings,
      status: "available",
    },
    {
      id: "erasure",
      title: "Right to Erasure",
      description: "Request deletion of your personal data",
      action: "Request Deletion",
      icon: Trash2,
      status: "available",
    },
    {
      id: "portability",
      title: "Right to Data Portability",
      description: "Receive your data in a structured, machine-readable format",
      action: "Export Data",
      icon: Download,
      status: "available",
    },
    {
      id: "objection",
      title: "Right to Object",
      description: "Object to processing of your personal data",
      action: "File Objection",
      icon: Shield,
      status: "available",
    },
  ];

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleCookieCategoryToggle = (categoryId: string, enabled: boolean) => {
    setCookieCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId ? { ...category, enabled } : category
      )
    );

    // Update privacy settings based on cookie preferences
    if (categoryId === "analytics") {
      updateSettings({
        privacy: { ...settings.privacy, analyticsEnabled: enabled },
      });
    } else if (categoryId === "functional") {
      updateSettings({
        privacy: { ...settings.privacy, personalizedContent: enabled },
      });
    } else if (categoryId === "marketing") {
      updateSettings({
        notifications: {
          ...settings.notifications,
          marketingCommunications: enabled,
        },
      });
    }
  };

  const handleDataExport = async (exportId: string) => {
    setExportInProgress((prev) => new Set([...prev, exportId]));

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create and download the export file
    const exportOption = dataExportOptions.find((opt) => opt.id === exportId);
    if (exportOption) {
      const data = generateExportData(exportId);
      const blob = new Blob([data], {
        type:
          exportOption.format === "json"
            ? "application/json"
            : exportOption.format === "csv"
            ? "text/csv"
            : "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${exportId}_export.${exportOption.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    setExportInProgress((prev) => {
      const newSet = new Set(prev);
      newSet.delete(exportId);
      return newSet;
    });
  };

  const generateExportData = (exportId: string): string => {
    switch (exportId) {
      case "personal_data":
        return JSON.stringify(
          {
            userSettings: settings,
            exportDate: new Date().toISOString(),
            dataTypes: ["preferences", "settings", "profile"],
          },
          null,
          2
        );
      case "activity_log":
        return "Date,Page,Action,Duration\n2024-01-01,/portfolio,view,120s\n2024-01-01,/about,view,90s";
      case "communication_history":
        return "Communication History Export\nGenerated: " + new Date();
      case "preferences_backup":
        return JSON.stringify(settings, null, 2);
      default:
        return "Export data";
    }
  };

  const handleAccountDeletion = () => {
    // This would typically make an API call to initiate account deletion
    console.log("Account deletion requested");
    setShowDeleteConfirmation(false);
    // Show success message or redirect
  };

  const handleGDPRRequest = (rightId: string) => {
    // This would typically make an API call to process the GDPR request
    console.log(`GDPR request initiated: ${rightId}`);
  };

  return (
    <div className="space-y-8">
      {/* Cookie Preferences Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-4 border-black bg-white"
      >
        <div className="p-6 border-b-2 border-black bg-yellow-400">
          <div className="flex items-center gap-3">
            <Cookie size={24} className="text-black" />
            <h2 className="text-2xl font-black font-mono uppercase tracking-wider">
              Cookie Preferences
            </h2>
          </div>
          <p className="font-mono text-sm mt-2 text-black">
            Control which cookies are stored on your device
          </p>
        </div>

        <div className="p-6 space-y-6">
          {cookieCategories.map((category) => (
            <div key={category.id} className="border-2 border-black">
              <div className="p-4 bg-gray-50 border-b-2 border-black">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-black font-mono uppercase">
                        {category.name}
                      </h3>
                      {category.essential && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-mono uppercase">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-mono text-gray-600">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSection(category.id)}
                      className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors"
                      aria-label={`${
                        expandedSections.has(category.id) ? "Hide" : "Show"
                      } cookie details`}
                    >
                      {expandedSections.has(category.id) ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={category.enabled}
                        disabled={category.essential}
                        onChange={(e) =>
                          handleCookieCategoryToggle(
                            category.id,
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 border-2 border-black focus:ring-2 focus:ring-yellow-400"
                      />
                      <span className="font-mono text-sm">
                        {category.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {expandedSections.has(category.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-white"
                >
                  <div className="space-y-3">
                    {category.cookies.map((cookie, index) => (
                      <div
                        key={index}
                        className="p-3 border border-gray-300 bg-gray-50"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm font-mono">
                          <div>
                            <span className="font-bold">Name:</span>
                            <br />
                            {cookie.name}
                          </div>
                          <div>
                            <span className="font-bold">Purpose:</span>
                            <br />
                            {cookie.purpose}
                          </div>
                          <div>
                            <span className="font-bold">Duration:</span>
                            <br />
                            {cookie.duration}
                          </div>
                          <div>
                            <span className="font-bold">Provider:</span>
                            <br />
                            {cookie.provider}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Analytics and Tracking Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border-4 border-black bg-white"
      >
        <div className="p-6 border-b-2 border-black bg-blue-400">
          <div className="flex items-center gap-3">
            <BarChart3 size={24} className="text-black" />
            <h2 className="text-2xl font-black font-mono uppercase tracking-wider">
              Analytics & Tracking
            </h2>
          </div>
          <p className="font-mono text-sm mt-2 text-black">
            Control data collection and analytics preferences
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border-2 border-black">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black font-mono uppercase">
                  Website Analytics
                </h3>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.privacy.analyticsEnabled}
                    onChange={(e) =>
                      updateSettings({
                        privacy: {
                          ...settings.privacy,
                          analyticsEnabled: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 border-2 border-black focus:ring-2 focus:ring-yellow-400"
                  />
                  <span className="font-mono text-sm">
                    {settings.privacy.analyticsEnabled ? "Enabled" : "Disabled"}
                  </span>
                </label>
              </div>
              <p className="text-sm font-mono text-gray-600">
                Collect anonymous usage statistics to improve the website
                experience.
              </p>
            </div>

            <div className="p-4 border-2 border-black">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black font-mono uppercase">
                  Location Tracking
                </h3>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.privacy.locationTracking}
                    onChange={(e) =>
                      updateSettings({
                        privacy: {
                          ...settings.privacy,
                          locationTracking: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 border-2 border-black focus:ring-2 focus:ring-yellow-400"
                  />
                  <span className="font-mono text-sm">
                    {settings.privacy.locationTracking ? "Enabled" : "Disabled"}
                  </span>
                </label>
              </div>
              <p className="text-sm font-mono text-gray-600">
                Use location data for timezone detection and regional content
                customization.
              </p>
            </div>

            <div className="p-4 border-2 border-black">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black font-mono uppercase">
                  Third-Party Integrations
                </h3>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.privacy.thirdPartyIntegrations}
                    onChange={(e) =>
                      updateSettings({
                        privacy: {
                          ...settings.privacy,
                          thirdPartyIntegrations: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 border-2 border-black focus:ring-2 focus:ring-yellow-400"
                  />
                  <span className="font-mono text-sm">
                    {settings.privacy.thirdPartyIntegrations
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </label>
              </div>
              <p className="text-sm font-mono text-gray-600">
                Allow integration with external services like calendars and
                communication tools.
              </p>
            </div>

            <div className="p-4 border-2 border-black">
              <div className="mb-3">
                <h3 className="font-black font-mono uppercase mb-2">
                  Data Collection Level
                </h3>
                <select
                  value={settings.privacy.dataCollection}
                  onChange={(e) =>
                    updateSettings({
                      privacy: {
                        ...settings.privacy,
                        dataCollection: e.target.value as
                          | "minimal"
                          | "standard"
                          | "full",
                      },
                    })
                  }
                  className="w-full p-2 border-2 border-black font-mono text-sm focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="minimal">Minimal - Essential only</option>
                  <option value="standard">Standard - Basic analytics</option>
                  <option value="full">Full - Detailed insights</option>
                </select>
              </div>
              <p className="text-sm font-mono text-gray-600">
                Choose how much data we collect about your interactions.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data Export Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border-4 border-black bg-white"
      >
        <div className="p-6 border-b-2 border-black bg-green-400">
          <div className="flex items-center gap-3">
            <Download size={24} className="text-black" />
            <h2 className="text-2xl font-black font-mono uppercase tracking-wider">
              Data Export
            </h2>
          </div>
          <p className="font-mono text-sm mt-2 text-black">
            Download comprehensive reports of your data
          </p>
        </div>

        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {dataExportOptions.map((option) => (
              <div key={option.id} className="p-4 border-2 border-black">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-black font-mono uppercase mb-1">
                      {option.name}
                    </h3>
                    <p className="text-sm font-mono text-gray-600 mb-2">
                      {option.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                      <span>Format: {option.format.toUpperCase()}</span>
                      <span>Size: {option.size}</span>
                      {option.lastGenerated && (
                        <span>
                          Last: {option.lastGenerated.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDataExport(option.id)}
                  disabled={exportInProgress.has(option.id)}
                  className={cn(
                    "w-full p-2 border-2 border-black font-mono text-sm uppercase transition-colors",
                    exportInProgress.has(option.id)
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-white hover:bg-black hover:text-white"
                  )}
                >
                  {exportInProgress.has(option.id) ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                      Exporting...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Download size={16} />
                      Export {option.format.toUpperCase()}
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* GDPR Rights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="border-4 border-black bg-white"
      >
        <div className="p-6 border-b-2 border-black bg-purple-400">
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-black" />
            <h2 className="text-2xl font-black font-mono uppercase tracking-wider">
              GDPR Rights & Compliance
            </h2>
          </div>
          <p className="font-mono text-sm mt-2 text-black">
            Exercise your data protection rights under GDPR
          </p>
        </div>

        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {gdprRights.map((right) => {
              const Icon = right.icon;
              return (
                <div key={right.id} className="p-4 border-2 border-black">
                  <div className="flex items-start gap-3 mb-3">
                    <Icon size={20} className="text-black mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-black font-mono uppercase text-sm mb-1">
                        {right.title}
                      </h3>
                      <p className="text-xs font-mono text-gray-600 mb-3">
                        {right.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleGDPRRequest(right.id)}
                    className="w-full p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors font-mono text-xs uppercase"
                  >
                    {right.action}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 border-2 border-black bg-gray-50">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-black font-mono uppercase text-sm mb-2">
                  Data Retention Policy
                </h3>
                <div className="space-y-2 text-sm font-mono text-gray-600">
                  <p>
                    Current retention period:{" "}
                    <span className="font-bold">
                      {settings.privacy.dataRetention === "1year"
                        ? "1 Year"
                        : settings.privacy.dataRetention === "2years"
                        ? "2 Years"
                        : settings.privacy.dataRetention === "5years"
                        ? "5 Years"
                        : "Indefinite"}
                    </span>
                  </p>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-mono">
                      Change retention period:
                    </label>
                    <select
                      value={settings.privacy.dataRetention}
                      onChange={(e) =>
                        updateSettings({
                          privacy: {
                            ...settings.privacy,
                            dataRetention: e.target.value as
                              | "1year"
                              | "2years"
                              | "5years"
                              | "indefinite",
                          },
                        })
                      }
                      className="p-1 border border-black font-mono text-xs"
                    >
                      <option value="1year">1 Year</option>
                      <option value="2years">2 Years</option>
                      <option value="5years">5 Years</option>
                      <option value="indefinite">Indefinite</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Account Deletion Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="border-4 border-black bg-white"
      >
        <div className="p-6 border-b-2 border-black bg-red-400">
          <div className="flex items-center gap-3">
            <Trash2 size={24} className="text-black" />
            <h2 className="text-2xl font-black font-mono uppercase tracking-wider">
              Account Deletion
            </h2>
          </div>
          <p className="font-mono text-sm mt-2 text-black">
            Permanently delete your account and all associated data
          </p>
        </div>

        <div className="p-6">
          <div className="p-4 border-2 border-red-500 bg-red-50">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-600 mt-1" />
              <div>
                <h3 className="font-black font-mono uppercase text-sm mb-2 text-red-800">
                  Warning: This Action Cannot Be Undone
                </h3>
                <div className="space-y-2 text-sm font-mono text-red-700">
                  <p>Deleting your account will permanently remove:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>All personal data and preferences</li>
                    <li>Communication history and inquiries</li>
                    <li>Saved settings and customizations</li>
                    <li>Analytics data associated with your visits</li>
                  </ul>
                  <p className="mt-3">
                    This process typically takes 30 days to complete and cannot
                    be reversed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            {!showDeleteConfirmation ? (
              <button
                onClick={() => setShowDeleteConfirmation(true)}
                className="px-6 py-3 border-2 border-red-500 bg-white text-red-600 hover:bg-red-500 hover:text-white transition-colors font-mono text-sm uppercase"
              >
                Request Account Deletion
              </button>
            ) : (
              <div className="w-full max-w-md p-4 border-2 border-black bg-white">
                <h3 className="font-black font-mono uppercase text-center mb-4">
                  Confirm Account Deletion
                </h3>
                <p className="text-sm font-mono text-center text-gray-600 mb-6">
                  Type "DELETE MY ACCOUNT" to confirm:
                </p>
                <input
                  type="text"
                  placeholder="DELETE MY ACCOUNT"
                  className="w-full p-2 border-2 border-black font-mono text-sm mb-4 focus:ring-2 focus:ring-red-400"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="flex-1 p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors font-mono text-sm uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAccountDeletion}
                    className="flex-1 p-2 border-2 border-red-500 bg-red-500 text-white hover:bg-red-600 transition-colors font-mono text-sm uppercase"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
