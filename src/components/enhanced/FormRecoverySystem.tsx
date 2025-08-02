"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  Save,
  X,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import BrutalistButton from "../ui/BrutalistButton";

export interface SavedFormData {
  formId: string;
  data: any;
  timestamp: string;
  step?: number;
  version: string;
  userAgent: string;
  sessionId: string;
}

export interface FormRecoverySystemProps {
  formId: string;
  currentData: any;
  currentStep?: number;
  onRestore: (data: any, step?: number) => void;
  onClear: () => void;
  className?: string;
  autoSaveInterval?: number;
  maxSavedVersions?: number;
}

const FormRecoverySystem: React.FC<FormRecoverySystemProps> = ({
  formId,
  currentData,
  currentStep = 0,
  onRestore,
  onClear,
  className,
  autoSaveInterval = 30000,
  maxSavedVersions = 5,
}) => {
  const [savedVersions, setSavedVersions] = useState<SavedFormData[]>([]);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<SavedFormData | null>(
    null
  );
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);

  // Load saved versions on mount
  useEffect(() => {
    loadSavedVersions();
  }, [formId]);

  // Auto-save functionality
  useEffect(() => {
    if (!currentData || Object.keys(currentData).length === 0) return;

    const autoSaveTimer = setTimeout(() => {
      performAutoSave();
    }, autoSaveInterval);

    return () => clearTimeout(autoSaveTimer);
  }, [currentData, currentStep, autoSaveInterval]);

  const loadSavedVersions = () => {
    try {
      const saved = localStorage.getItem(`form-recovery-${formId}`);
      if (saved) {
        const versions: SavedFormData[] = JSON.parse(saved);
        // Filter out old versions (older than 7 days)
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 7);

        const validVersions = versions.filter(
          (version) => new Date(version.timestamp) > cutoff
        );

        setSavedVersions(validVersions);

        // Update localStorage with filtered versions
        if (validVersions.length !== versions.length) {
          localStorage.setItem(
            `form-recovery-${formId}`,
            JSON.stringify(validVersions)
          );
        }
      }
    } catch (error) {
      console.error("Failed to load saved versions:", error);
    }
  };

  const performAutoSave = async () => {
    if (!currentData || Object.keys(currentData).length === 0) return;

    setAutoSaveStatus("saving");

    try {
      const newVersion: SavedFormData = {
        formId,
        data: currentData,
        timestamp: new Date().toISOString(),
        step: currentStep,
        version: generateVersionId(),
        userAgent: navigator.userAgent,
        sessionId: getSessionId(),
      };

      // Add to saved versions
      const updatedVersions = [newVersion, ...savedVersions].slice(
        0,
        maxSavedVersions
      ); // Keep only the latest versions

      setSavedVersions(updatedVersions);
      setLastSaveTime(new Date());

      // Save to localStorage
      localStorage.setItem(
        `form-recovery-${formId}`,
        JSON.stringify(updatedVersions)
      );

      setAutoSaveStatus("saved");

      // Reset status after 2 seconds
      setTimeout(() => {
        setAutoSaveStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Auto-save failed:", error);
      setAutoSaveStatus("error");

      setTimeout(() => {
        setAutoSaveStatus("idle");
      }, 3000);
    }
  };

  const generateVersionId = (): string => {
    return `v${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const getSessionId = (): string => {
    let sessionId = sessionStorage.getItem("form-session-id");
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      sessionStorage.setItem("form-session-id", sessionId);
    }
    return sessionId;
  };

  const handleRestore = (version: SavedFormData) => {
    onRestore(version.data, version.step);
    setShowRecoveryModal(false);
    setSelectedVersion(null);
  };

  const handleDeleteVersion = (versionToDelete: SavedFormData) => {
    const updatedVersions = savedVersions.filter(
      (v) => v.version !== versionToDelete.version
    );
    setSavedVersions(updatedVersions);
    localStorage.setItem(
      `form-recovery-${formId}`,
      JSON.stringify(updatedVersions)
    );
  };

  const handleClearAll = () => {
    setSavedVersions([]);
    localStorage.removeItem(`form-recovery-${formId}`);
    onClear();
    setShowRecoveryModal(false);
  };

  const handleExportData = (version: SavedFormData) => {
    const dataStr = JSON.stringify(version, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formId}-backup-${version.version}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (importedData.formId === formId && importedData.data) {
          onRestore(importedData.data, importedData.step);
        } else {
          alert("Invalid backup file format or form ID mismatch.");
        }
      } catch (error) {
        console.error("Failed to import data:", error);
        alert("Failed to import backup file.");
      }
    };
    reader.readAsText(file);
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const getDataSummary = (data: any): string => {
    const keys = Object.keys(data);
    const filledFields = keys.filter((key) => {
      const value = data[key];
      return value !== null && value !== undefined && value !== "";
    });
    return `${filledFields.length}/${keys.length} fields completed`;
  };

  return (
    <div className={cn("relative", className)}>
      {/* Auto-save Status Indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-mono">
          {autoSaveStatus === "saving" && (
            <>
              <RefreshCw size={16} className="animate-spin text-blue-600" />
              <span className="text-blue-600">Saving...</span>
            </>
          )}
          {autoSaveStatus === "saved" && (
            <>
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-green-600">Auto-saved</span>
              {lastSaveTime && (
                <span className="text-gray-500">
                  at {lastSaveTime.toLocaleTimeString()}
                </span>
              )}
            </>
          )}
          {autoSaveStatus === "error" && (
            <>
              <AlertCircle size={16} className="text-red-600" />
              <span className="text-red-600">Save failed</span>
            </>
          )}
          {autoSaveStatus === "idle" && savedVersions.length > 0 && (
            <>
              <Save size={16} className="text-gray-600" />
              <span className="text-gray-600">
                {savedVersions.length} saved version
                {savedVersions.length !== 1 ? "s" : ""}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {savedVersions.length > 0 && (
            <BrutalistButton
              onClick={() => setShowRecoveryModal(true)}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
            >
              <Clock size={16} />
              Recovery
            </BrutalistButton>
          )}

          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <BrutalistButton
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
            >
              <Upload size={16} />
              Import
            </BrutalistButton>
          </div>
        </div>
      </div>

      {/* Recovery Modal */}
      <AnimatePresence>
        {showRecoveryModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white border-3 border-black max-w-4xl w-full max-h-[80vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Modal Header */}
              <div className="border-b-3 border-black p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black uppercase tracking-wider font-mono">
                    Form Recovery
                  </h3>
                  <button
                    onClick={() => setShowRecoveryModal(false)}
                    className="p-2 hover:bg-gray-100 transition-colors duration-300"
                  >
                    <X size={24} />
                  </button>
                </div>
                <p className="font-mono opacity-80 mt-2">
                  Restore your form data from a previous save point
                </p>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-96 overflow-y-auto">
                {savedVersions.length === 0 ? (
                  <div className="text-center py-8">
                    <Info size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="font-mono font-bold text-lg mb-2">
                      No Saved Versions
                    </p>
                    <p className="font-mono opacity-80">
                      Your form data will be automatically saved as you fill it
                      out.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedVersions.map((version, index) => (
                      <motion.div
                        key={version.version}
                        className="border-2 border-black p-4 hover:bg-gray-50 transition-colors duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center gap-2">
                                <Clock size={16} className="text-gray-600" />
                                <span className="font-mono font-bold text-sm">
                                  {formatTimestamp(version.timestamp)}
                                </span>
                              </div>
                              {index === 0 && (
                                <span className="bg-brutalist-yellow px-2 py-1 text-xs font-mono font-bold">
                                  LATEST
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <span className="font-mono font-bold text-xs uppercase tracking-wider text-gray-600">
                                  Progress
                                </span>
                                <p className="font-mono text-sm">
                                  {getDataSummary(version.data)}
                                </p>
                              </div>
                              {version.step !== undefined && (
                                <div>
                                  <span className="font-mono font-bold text-xs uppercase tracking-wider text-gray-600">
                                    Step
                                  </span>
                                  <p className="font-mono text-sm">
                                    Step {version.step + 1}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="text-xs font-mono opacity-60">
                              Version: {version.version} | Session:{" "}
                              {version.sessionId.slice(-8)}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleExportData(version)}
                              className="p-2 border-2 border-black hover:bg-gray-100 transition-colors duration-300"
                              title="Export this version"
                            >
                              <Download size={16} />
                            </button>

                            <button
                              onClick={() => handleDeleteVersion(version)}
                              className="p-2 border-2 border-black hover:bg-red-50 transition-colors duration-300"
                              title="Delete this version"
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </button>

                            <BrutalistButton
                              onClick={() => handleRestore(version)}
                              size="sm"
                              className="ml-2"
                            >
                              Restore
                            </BrutalistButton>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t-3 border-black p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-mono opacity-80">
                    Saved versions are automatically cleaned up after 7 days
                  </div>

                  <div className="flex items-center gap-3">
                    {savedVersions.length > 0 && (
                      <BrutalistButton
                        onClick={handleClearAll}
                        variant="secondary"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Clear All
                      </BrutalistButton>
                    )}

                    <BrutalistButton
                      onClick={() => setShowRecoveryModal(false)}
                      variant="secondary"
                    >
                      Close
                    </BrutalistButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormRecoverySystem;
