"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Clock,
  Globe,
  Volume2,
  Eye,
  Smartphone,
  Mail,
  MessageSquare,
  Settings,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationSettings, ContactChannel } from "@/types/enhanced";
import BrutalistButton from "../ui/BrutalistButton";

export interface CommunicationPreferencesCenterProps {
  className?: string;
  onPreferencesUpdate?: (preferences: CommunicationPreferences) => void;
  initialPreferences?: CommunicationPreferences;
}

interface CommunicationPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    projectUpdates: boolean;
    marketingCommunications: boolean;
    newsletterSubscription: boolean;
    emergencyContacts: boolean;
    frequency: "immediate" | "daily" | "weekly" | "monthly";
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  contactTimes: {
    preferredDays: string[];
    preferredHours: {
      start: string;
      end: string;
    };
    timezone: string;
    urgentContactOk: boolean;
  };
  communicationChannels: {
    preferred: ContactChannel[];
    blocked: ContactChannel[];
    channelSpecificSettings: Record<
      ContactChannel,
      {
        enabled: boolean;
        priority: number;
        responseExpectation: string;
      }
    >;
  };
  language: {
    primary: string;
    secondary?: string;
    dateFormat: string;
    timeFormat: "12h" | "24h";
  };
  accessibility: {
    screenReader: boolean;
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    keyboardNavigation: boolean;
    audioDescriptions: boolean;
  };
  privacy: {
    dataCollection: boolean;
    analytics: boolean;
    thirdPartySharing: boolean;
    cookieConsent: boolean;
  };
}

const DEFAULT_PREFERENCES: CommunicationPreferences = {
  notifications: {
    email: true,
    sms: false,
    push: true,
    projectUpdates: true,
    marketingCommunications: false,
    newsletterSubscription: false,
    emergencyContacts: true,
    frequency: "weekly",
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00",
    },
  },
  contactTimes: {
    preferredDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    preferredHours: {
      start: "09:00",
      end: "17:00",
    },
    timezone: "America/New_York",
    urgentContactOk: true,
  },
  communicationChannels: {
    preferred: ["email", "phone"],
    blocked: [],
    channelSpecificSettings: {
      email: {
        enabled: true,
        priority: 1,
        responseExpectation: "Within 4 hours",
      },
      phone: { enabled: true, priority: 2, responseExpectation: "Immediate" },
      video: { enabled: true, priority: 3, responseExpectation: "Scheduled" },
      chat: { enabled: false, priority: 4, responseExpectation: "Real-time" },
      messaging: {
        enabled: false,
        priority: 5,
        responseExpectation: "Within 1 hour",
      },
      "in-person": {
        enabled: false,
        priority: 6,
        responseExpectation: "Scheduled",
      },
    },
  },
  language: {
    primary: "en",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
  },
  accessibility: {
    screenReader: false,
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    keyboardNavigation: false,
    audioDescriptions: false,
  },
  privacy: {
    dataCollection: true,
    analytics: true,
    thirdPartySharing: false,
    cookieConsent: true,
  },
};

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
];

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEDT)" },
];

const DAYS_OF_WEEK = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

const CommunicationPreferencesCenter: React.FC<
  CommunicationPreferencesCenterProps
> = ({ className, onPreferencesUpdate, initialPreferences }) => {
  const [preferences, setPreferences] = useState<CommunicationPreferences>(
    initialPreferences || DEFAULT_PREFERENCES
  );
  const [activeTab, setActiveTab] = useState<
    | "notifications"
    | "contact"
    | "channels"
    | "language"
    | "accessibility"
    | "privacy"
  >("notifications");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem("communicationPreferences");
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      } catch (error) {
        console.error("Failed to parse saved preferences:", error);
      }
    }
  }, []);

  // Track changes
  useEffect(() => {
    const initialString = JSON.stringify(
      initialPreferences || DEFAULT_PREFERENCES
    );
    const currentString = JSON.stringify(preferences);
    setHasUnsavedChanges(initialString !== currentString);
  }, [preferences, initialPreferences]);

  const updatePreference = (
    section: keyof CommunicationPreferences,
    field: string,
    value: any
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateNestedPreference = (
    section: keyof CommunicationPreferences,
    subsection: string,
    field: string,
    value: any
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [field]: value,
        },
      },
    }));
  };

  const toggleArrayValue = (
    section: keyof CommunicationPreferences,
    field: string,
    value: string
  ) => {
    setPreferences((prev) => {
      const currentArray = (prev[section] as any)[field] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item: string) => item !== value)
        : [...currentArray, value];

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray,
        },
      };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      // Save to localStorage
      localStorage.setItem(
        "communicationPreferences",
        JSON.stringify(preferences)
      );

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onPreferencesUpdate?.(preferences);
      setSaveStatus("success");
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to save preferences:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPreferences(DEFAULT_PREFERENCES);
    setSaveStatus("idle");
  };

  const exportPreferences = () => {
    const dataStr = JSON.stringify(preferences, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "communication-preferences.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importPreferences = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setPreferences({ ...DEFAULT_PREFERENCES, ...imported });
        setSaveStatus("idle");
      } catch (error) {
        console.error("Failed to import preferences:", error);
        setSaveStatus("error");
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "contact", label: "Contact Times", icon: Clock },
    { id: "channels", label: "Channels", icon: MessageSquare },
    { id: "language", label: "Language", icon: Globe },
    { id: "accessibility", label: "Accessibility", icon: Eye },
    { id: "privacy", label: "Privacy", icon: Settings },
  ] as const;

  return (
    <div className={cn("w-full max-w-6xl mx-auto", className)}>
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider font-mono mb-4">
          Communication Preferences
        </h2>
        <p className="text-lg font-mono font-bold opacity-80 max-w-3xl mx-auto">
          Customize how and when you want to be contacted. Your preferences are
          saved automatically.
        </p>
      </motion.div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <motion.div
          className="mb-6 p-4 border-3 border-yellow-500 bg-yellow-100 text-yellow-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 font-mono font-bold">
            <AlertCircle size={20} />
            <span>You have unsaved changes</span>
          </div>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 border-3 border-black font-mono font-bold text-sm uppercase tracking-wider transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-brutalist-yellow"
                    : "bg-white hover:bg-gray-50"
                )}
              >
                <IconComponent size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white border-3 border-black p-8 mb-8">
        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-8">
            <h3 className="text-2xl font-black uppercase tracking-wider font-mono mb-6">
              Notification Settings
            </h3>

            {/* Notification Types */}
            <div className="space-y-4">
              <h4 className="font-mono font-bold text-lg uppercase tracking-wider">
                Notification Types
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    key: "email",
                    label: "Email Notifications",
                    description: "Receive notifications via email",
                  },
                  {
                    key: "sms",
                    label: "SMS Notifications",
                    description: "Receive text message notifications",
                  },
                  {
                    key: "push",
                    label: "Push Notifications",
                    description: "Browser push notifications",
                  },
                  {
                    key: "projectUpdates",
                    label: "Project Updates",
                    description: "Updates about your projects",
                  },
                  {
                    key: "marketingCommunications",
                    label: "Marketing",
                    description: "Promotional content and offers",
                  },
                  {
                    key: "newsletterSubscription",
                    label: "Newsletter",
                    description: "Monthly newsletter subscription",
                  },
                  {
                    key: "emergencyContacts",
                    label: "Emergency Contacts",
                    description: "Critical issues and urgent matters",
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-start gap-3 p-4 border-2 border-black cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={(preferences.notifications as any)[item.key]}
                      onChange={(e) =>
                        updatePreference(
                          "notifications",
                          item.key,
                          e.target.checked
                        )
                      }
                      className="mt-1 w-4 h-4"
                    />
                    <div>
                      <div className="font-mono font-bold text-sm">
                        {item.label}
                      </div>
                      <div className="font-mono text-xs opacity-80">
                        {item.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div className="space-y-4">
              <h4 className="font-mono font-bold text-lg uppercase tracking-wider">
                Notification Frequency
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { value: "immediate", label: "Immediate" },
                  { value: "daily", label: "Daily Digest" },
                  { value: "weekly", label: "Weekly Summary" },
                  { value: "monthly", label: "Monthly Report" },
                ].map((freq) => (
                  <button
                    key={freq.value}
                    onClick={() =>
                      updatePreference("notifications", "frequency", freq.value)
                    }
                    className={cn(
                      "p-4 border-3 border-black font-mono font-bold text-sm transition-all duration-300",
                      preferences.notifications.frequency === freq.value
                        ? "bg-brutalist-yellow"
                        : "bg-white hover:bg-gray-50"
                    )}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quiet Hours */}
            <div className="space-y-4">
              <h4 className="font-mono font-bold text-lg uppercase tracking-wider">
                Quiet Hours
              </h4>
              <label className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={preferences.notifications.quietHours.enabled}
                  onChange={(e) =>
                    updateNestedPreference(
                      "notifications",
                      "quietHours",
                      "enabled",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4"
                />
                <span className="font-mono font-bold">Enable quiet hours</span>
              </label>
              {preferences.notifications.quietHours.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono font-bold text-sm mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={preferences.notifications.quietHours.start}
                      onChange={(e) =>
                        updateNestedPreference(
                          "notifications",
                          "quietHours",
                          "start",
                          e.target.value
                        )
                      }
                      className="w-full p-3 border-3 border-black font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono font-bold text-sm mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={preferences.notifications.quietHours.end}
                      onChange={(e) =>
                        updateNestedPreference(
                          "notifications",
                          "quietHours",
                          "end",
                          e.target.value
                        )
                      }
                      className="w-full p-3 border-3 border-black font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Times Tab */}
        {activeTab === "contact" && (
          <div className="space-y-8">
            <h3 className="text-2xl font-black uppercase tracking-wider font-mono mb-6">
              Preferred Contact Times
            </h3>

            {/* Preferred Days */}
            <div className="space-y-4">
              <h4 className="font-mono font-bold text-lg uppercase tracking-wider">
                Preferred Days
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day.id}
                    onClick={() =>
                      toggleArrayValue("contactTimes", "preferredDays", day.id)
                    }
                    className={cn(
                      "p-3 border-3 border-black font-mono font-bold text-sm transition-all duration-300",
                      preferences.contactTimes.preferredDays.includes(day.id)
                        ? "bg-brutalist-yellow"
                        : "bg-white hover:bg-gray-50"
                    )}
                  >
                    {day.label.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Hours */}
            <div className="space-y-4">
              <h4 className="font-mono font-bold text-lg uppercase tracking-wider">
                Preferred Hours
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono font-bold text-sm mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={preferences.contactTimes.preferredHours.start}
                    onChange={(e) =>
                      updateNestedPreference(
                        "contactTimes",
                        "preferredHours",
                        "start",
                        e.target.value
                      )
                    }
                    className="w-full p-3 border-3 border-black font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold text-sm mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={preferences.contactTimes.preferredHours.end}
                    onChange={(e) =>
                      updateNestedPreference(
                        "contactTimes",
                        "preferredHours",
                        "end",
                        e.target.value
                      )
                    }
                    className="w-full p-3 border-3 border-black font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Timezone */}
            <div className="space-y-4">
              <h4 className="font-mono font-bold text-lg uppercase tracking-wider">
                Timezone
              </h4>
              <select
                value={preferences.contactTimes.timezone}
                onChange={(e) =>
                  updatePreference("contactTimes", "timezone", e.target.value)
                }
                className="w-full p-3 border-3 border-black font-mono"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Urgent Contact */}
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={preferences.contactTimes.urgentContactOk}
                  onChange={(e) =>
                    updatePreference(
                      "contactTimes",
                      "urgentContactOk",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4"
                />
                <span className="font-mono font-bold">
                  Allow urgent contact outside preferred hours
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Communication Channels Tab */}
        {activeTab === "channels" && (
          <div className="space-y-8">
            <h3 className="text-2xl font-black uppercase tracking-wider font-mono mb-6">
              Communication Channels
            </h3>

            {/* Channel Settings */}
            <div className="space-y-6">
              {Object.entries(
                preferences.communicationChannels.channelSpecificSettings
              ).map(([channel, settings]) => (
                <div
                  key={channel}
                  className="p-6 border-2 border-black bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-mono font-bold text-lg uppercase tracking-wider">
                      {channel.charAt(0).toUpperCase() + channel.slice(1)}
                    </h4>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.enabled}
                        onChange={(e) => {
                          const newSettings = {
                            ...preferences.communicationChannels
                              .channelSpecificSettings,
                            [channel]: {
                              ...settings,
                              enabled: e.target.checked,
                            },
                          };
                          updatePreference(
                            "communicationChannels",
                            "channelSpecificSettings",
                            newSettings
                          );
                        }}
                        className="w-4 h-4"
                      />
                      <span className="font-mono font-bold text-sm">
                        Enabled
                      </span>
                    </label>
                  </div>

                  {settings.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono font-bold text-sm mb-2">
                          Priority (1-6)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="6"
                          value={settings.priority}
                          onChange={(e) => {
                            const newSettings = {
                              ...preferences.communicationChannels
                                .channelSpecificSettings,
                              [channel]: {
                                ...settings,
                                priority: parseInt(e.target.value),
                              },
                            };
                            updatePreference(
                              "communicationChannels",
                              "channelSpecificSettings",
                              newSettings
                            );
                          }}
                          className="w-full p-3 border-3 border-black font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-mono font-bold text-sm mb-2">
                          Response Expectation
                        </label>
                        <input
                          type="text"
                          value={settings.responseExpectation}
                          onChange={(e) => {
                            const newSettings = {
                              ...preferences.communicationChannels
                                .channelSpecificSettings,
                              [channel]: {
                                ...settings,
                                responseExpectation: e.target.value,
                              },
                            };
                            updatePreference(
                              "communicationChannels",
                              "channelSpecificSettings",
                              newSettings
                            );
                          }}
                          className="w-full p-3 border-3 border-black font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Language Tab */}
        {activeTab === "language" && (
          <div className="space-y-8">
            <h3 className="text-2xl font-black uppercase tracking-wider font-mono mb-6">
              Language & Localization
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Primary Language */}
              <div className="space-y-4">
                <h4 className="font-mono font-bold text-lg uppercase tracking-wider">
                  Primary Language
                </h4>
                <select
                  value={preferences.language.primary}
                  onChange={(e) =>
                    updatePreference("language", "primary", e.target.value)
                  }
                  className="w-full p-3 border-3 border-black font-mono"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Secondary Language */}
              <div className="space-y-4">
                <h4 className="font-mono font-bold text-lg uppercase tracking-wider">
                  Secondary Language (Optional)
                </h4>
                <select
                  value={preferences.language.secondary || ""}
                  onChange={(e) =>
                    updatePreference(
                      "language",
                      "secondary",
                      e.target.value || undefined
                    )
                  }
                  className="w-full p-3 border-3 border-black font-mono"
                >
                  <option value="">None</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Format */}
              <div className="space-y-4">
                <h4 className="font-mono font-bold text-lg uppercase tracking-wider">
                  Date Format
                </h4>
                <select
                  value={preferences.language.dateFormat}
                  onChange={(e) =>
                    updatePreference("language", "dateFormat", e.target.value)
                  }
                  className="w-full p-3 border-3 border-black font-mono"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (EU)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                </select>
              </div>

              {/* Time Format */}
              <div className="space-y-4">
                <h4 className="font-mono font-bold text-lg uppercase tracking-wider">
                  Time Format
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() =>
                      updatePreference("language", "timeFormat", "12h")
                    }
                    className={cn(
                      "p-4 border-3 border-black font-mono font-bold text-sm transition-all duration-300",
                      preferences.language.timeFormat === "12h"
                        ? "bg-brutalist-yellow"
                        : "bg-white hover:bg-gray-50"
                    )}
                  >
                    12 Hour
                  </button>
                  <button
                    onClick={() =>
                      updatePreference("language", "timeFormat", "24h")
                    }
                    className={cn(
                      "p-4 border-3 border-black font-mono font-bold text-sm transition-all duration-300",
                      preferences.language.timeFormat === "24h"
                        ? "bg-brutalist-yellow"
                        : "bg-white hover:bg-gray-50"
                    )}
                  >
                    24 Hour
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accessibility Tab */}
        {activeTab === "accessibility" && (
          <div className="space-y-8">
            <h3 className="text-2xl font-black uppercase tracking-wider font-mono mb-6">
              Accessibility Options
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  key: "screenReader",
                  label: "Screen Reader Support",
                  description: "Optimize for screen readers",
                },
                {
                  key: "highContrast",
                  label: "High Contrast Mode",
                  description: "Increase color contrast",
                },
                {
                  key: "largeText",
                  label: "Large Text",
                  description: "Increase font sizes",
                },
                {
                  key: "reducedMotion",
                  label: "Reduced Motion",
                  description: "Minimize animations",
                },
                {
                  key: "keyboardNavigation",
                  label: "Keyboard Navigation",
                  description: "Enhanced keyboard support",
                },
                {
                  key: "audioDescriptions",
                  label: "Audio Descriptions",
                  description: "Audio descriptions for media",
                },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-start gap-3 p-4 border-2 border-black cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={(preferences.accessibility as any)[item.key]}
                    onChange={(e) =>
                      updatePreference(
                        "accessibility",
                        item.key,
                        e.target.checked
                      )
                    }
                    className="mt-1 w-4 h-4"
                  />
                  <div>
                    <div className="font-mono font-bold text-sm">
                      {item.label}
                    </div>
                    <div className="font-mono text-xs opacity-80">
                      {item.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === "privacy" && (
          <div className="space-y-8">
            <h3 className="text-2xl font-black uppercase tracking-wider font-mono mb-6">
              Privacy Settings
            </h3>

            <div className="space-y-6">
              {[
                {
                  key: "dataCollection",
                  label: "Data Collection",
                  description: "Allow collection of usage data for improvement",
                },
                {
                  key: "analytics",
                  label: "Analytics",
                  description: "Enable analytics tracking",
                },
                {
                  key: "thirdPartySharing",
                  label: "Third-Party Sharing",
                  description: "Allow sharing data with trusted partners",
                },
                {
                  key: "cookieConsent",
                  label: "Cookie Consent",
                  description: "Accept cookies for enhanced functionality",
                },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-start gap-3 p-4 border-2 border-black cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={(preferences.privacy as any)[item.key]}
                    onChange={(e) =>
                      updatePreference("privacy", item.key, e.target.checked)
                    }
                    className="mt-1 w-4 h-4"
                  />
                  <div>
                    <div className="font-mono font-bold text-sm">
                      {item.label}
                    </div>
                    <div className="font-mono text-xs opacity-80">
                      {item.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          <BrutalistButton
            onClick={handleSave}
            variant="accent"
            size="lg"
            disabled={isSaving || !hasUnsavedChanges}
            glow={hasUnsavedChanges}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save size={20} />
                Save Preferences
              </span>
            )}
          </BrutalistButton>

          <BrutalistButton onClick={handleReset} variant="secondary" size="lg">
            <RotateCcw size={20} className="mr-2" />
            Reset to Defaults
          </BrutalistButton>
        </div>

        <div className="flex gap-4">
          <BrutalistButton
            onClick={exportPreferences}
            variant="secondary"
            size="md"
          >
            <Download size={16} className="mr-2" />
            Export
          </BrutalistButton>

          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={importPreferences}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <BrutalistButton variant="secondary" size="md">
              <Upload size={16} className="mr-2" />
              Import
            </BrutalistButton>
          </div>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus !== "idle" && (
        <motion.div
          className={cn(
            "mt-4 p-4 border-3 font-mono flex items-center gap-2",
            saveStatus === "success"
              ? "border-green-500 bg-green-100 text-green-800"
              : "border-red-500 bg-red-100 text-red-800"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {saveStatus === "success" ? (
            <>
              <CheckCircle size={20} />
              <span className="font-bold">Preferences saved successfully!</span>
            </>
          ) : (
            <>
              <AlertCircle size={20} />
              <span className="font-bold">
                Failed to save preferences. Please try again.
              </span>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CommunicationPreferencesCenter;
