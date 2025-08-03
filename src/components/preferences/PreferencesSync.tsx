"use client";

import React, { useState } from "react";
import {
  RefreshCw,
  Download,
  Upload,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
} from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { PreferenceImportExport } from "@/types/preferences";

interface PreferencesSyncProps {
  className?: string;
}

export default function PreferencesSync({
  className = "",
}: PreferencesSyncProps) {
  const {
    state,
    syncPreferences,
    exportPreferences,
    importPreferences,
    createBackup,
    restoreBackup,
    resetPreferences,
  } = usePreferences();

  const [importData, setImportData] = useState("");
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showBackups, setShowBackups] = useState(false);

  const handleExport = () => {
    const data = exportPreferences();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `preferences-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    try {
      const data: PreferenceImportExport = JSON.parse(importData);
      await importPreferences(data);
      setImportData("");
      setShowImportDialog(false);
    } catch (error) {
      console.error("Import failed:", error);
      alert("Failed to import preferences. Please check the file format.");
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className={`preferences-sync ${className}`}>
      <div className="flex items-center mb-6">
        <Settings size={20} className="text-brutalist-yellow mr-2" />
        <h3 className="font-mono font-bold text-lg uppercase tracking-wider">
          Preference Management
        </h3>
      </div>

      {/* Sync Status */}
      <div className="mb-6 p-4 border-2 border-foreground/20 bg-foreground/5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-mono font-bold text-sm uppercase tracking-wider">
            Sync Status
          </h4>
          <div className="flex items-center space-x-2">
            {state.isSyncing ? (
              <>
                <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono text-foreground/60">
                  Syncing...
                </span>
              </>
            ) : (
              <>
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-xs font-mono text-foreground/60">
                  {state.lastSync
                    ? `Last sync: ${formatDate(state.lastSync)}`
                    : "Never synced"}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <span className="text-foreground/60">Version:</span>
            <span className="ml-2 font-bold">{state.preferences.version}</span>
          </div>
          <div>
            <span className="text-foreground/60">Updated:</span>
            <span className="ml-2 font-bold">
              {formatDate(state.preferences.updatedAt)}
            </span>
          </div>
          <div>
            <span className="text-foreground/60">Conflicts:</span>
            <span className="ml-2 font-bold">{state.conflicts.length}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button
          onClick={syncPreferences}
          disabled={state.isSyncing}
          className="flex items-center justify-center space-x-2 p-3 border-2 border-foreground bg-background hover:bg-brutalist-yellow hover:text-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={16} />
          <span className="font-mono font-bold text-sm uppercase tracking-wider">
            Sync Now
          </span>
        </button>

        <button
          onClick={handleExport}
          className="flex items-center justify-center space-x-2 p-3 border-2 border-foreground bg-background hover:bg-brutalist-yellow hover:text-black transition-colors duration-200"
        >
          <Download size={16} />
          <span className="font-mono font-bold text-sm uppercase tracking-wider">
            Export
          </span>
        </button>

        <button
          onClick={() => setShowImportDialog(true)}
          className="flex items-center justify-center space-x-2 p-3 border-2 border-foreground bg-background hover:bg-brutalist-yellow hover:text-black transition-colors duration-200"
        >
          <Upload size={16} />
          <span className="font-mono font-bold text-sm uppercase tracking-wider">
            Import
          </span>
        </button>

        <button
          onClick={() => createBackup("Manual backup")}
          className="flex items-center justify-center space-x-2 p-3 border-2 border-foreground bg-background hover:bg-brutalist-yellow hover:text-black transition-colors duration-200"
        >
          <Save size={16} />
          <span className="font-mono font-bold text-sm uppercase tracking-wider">
            Backup
          </span>
        </button>
      </div>

      {/* Conflicts */}
      {state.conflicts.length > 0 && (
        <div className="mb-6 p-4 border-2 border-red-500 bg-red-50 dark:bg-red-950">
          <div className="flex items-center mb-3">
            <AlertTriangle size={16} className="text-red-600 mr-2" />
            <h4 className="font-mono font-bold text-sm uppercase tracking-wider text-red-700 dark:text-red-300">
              Sync Conflicts ({state.conflicts.length})
            </h4>
          </div>

          <div className="space-y-2">
            {state.conflicts.map((conflict) => (
              <div
                key={conflict.key}
                className="p-3 bg-red-100 dark:bg-red-900 border border-red-300"
              >
                <div className="font-mono text-sm font-bold mb-2">
                  {conflict.key}
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-red-600">Local:</span>
                    <span className="ml-2">
                      {JSON.stringify(conflict.localValue)}
                    </span>
                  </div>
                  <div>
                    <span className="text-red-600">Remote:</span>
                    <span className="ml-2">
                      {JSON.stringify(conflict.remoteValue)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Backups */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-mono font-bold text-sm uppercase tracking-wider">
            Backups ({state.backups.length})
          </h4>
          <button
            onClick={() => setShowBackups(!showBackups)}
            className="text-xs font-mono text-foreground/60 hover:text-brutalist-yellow transition-colors duration-200"
          >
            {showBackups ? "Hide" : "Show"} Backups
          </button>
        </div>

        {showBackups && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {state.backups.map((backup) => (
              <div
                key={backup.id}
                className="flex items-center justify-between p-3 border border-foreground/20 bg-foreground/5"
              >
                <div className="flex-1">
                  <div className="font-mono text-sm font-bold">
                    {backup.description}
                  </div>
                  <div className="text-xs font-mono text-foreground/60">
                    {formatDate(backup.timestamp)} •{" "}
                    {backup.automatic ? "Auto" : "Manual"}
                  </div>
                </div>
                <button
                  onClick={() => restoreBackup(backup.id)}
                  className="px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider border border-foreground/20 bg-background hover:bg-brutalist-yellow hover:text-black transition-colors duration-200"
                >
                  Restore
                </button>
              </div>
            ))}

            {state.backups.length === 0 && (
              <div className="text-center py-8 text-foreground/60">
                <Clock size={32} className="mx-auto mb-2" />
                <div className="text-sm font-mono">No backups available</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sync History */}
      <div className="mb-6">
        <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-4">
          Recent Activity ({state.syncHistory.length})
        </h4>

        <div className="space-y-2 max-h-40 overflow-y-auto">
          {state.syncHistory.slice(0, 5).map((sync) => (
            <div
              key={sync.id}
              className="flex items-center justify-between p-2 border border-foreground/10 bg-foreground/5"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    sync.action === "create"
                      ? "bg-green-500"
                      : sync.action === "update"
                      ? "bg-blue-500"
                      : sync.action === "delete"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                />
                <span className="text-xs font-mono font-bold uppercase">
                  {sync.action}
                </span>
                <span className="text-xs font-mono text-foreground/60">
                  from {sync.source}
                </span>
              </div>
              <span className="text-xs font-mono text-foreground/60">
                {formatDate(sync.timestamp)}
              </span>
            </div>
          ))}

          {state.syncHistory.length === 0 && (
            <div className="text-center py-4 text-foreground/60">
              <div className="text-xs font-mono">No sync history</div>
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-4 border-2 border-red-500 bg-red-50 dark:bg-red-950">
        <div className="flex items-center mb-3">
          <AlertTriangle size={16} className="text-red-600 mr-2" />
          <h4 className="font-mono font-bold text-sm uppercase tracking-wider text-red-700 dark:text-red-300">
            Danger Zone
          </h4>
        </div>

        <p className="text-xs font-mono text-red-600 dark:text-red-400 mb-4">
          This action will reset all preferences to their default values. This
          cannot be undone.
        </p>

        <button
          onClick={() => {
            if (
              confirm(
                "Are you sure you want to reset all preferences? This cannot be undone."
              )
            ) {
              resetPreferences();
            }
          }}
          className="flex items-center space-x-2 px-4 py-2 border-2 border-red-600 bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
        >
          <RotateCcw size={16} />
          <span className="font-mono font-bold text-sm uppercase tracking-wider">
            Reset All Preferences
          </span>
        </button>
      </div>

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-background border-3 border-foreground max-w-md w-full p-6">
            <h3 className="font-mono font-bold text-lg uppercase tracking-wider mb-4">
              Import Preferences
            </h3>

            <p className="text-sm font-mono text-foreground/80 mb-4">
              Paste your exported preferences JSON data below:
            </p>

            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste JSON data here..."
              className="w-full h-32 p-3 border-2 border-foreground bg-background text-foreground font-mono text-sm resize-none"
            />

            <div className="flex items-center justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowImportDialog(false);
                  setImportData("");
                }}
                className="px-4 py-2 border-2 border-foreground/20 bg-foreground/5 hover:bg-foreground/10 transition-colors duration-200 font-mono font-bold text-sm uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!importData.trim()}
                className="px-4 py-2 border-2 border-foreground bg-brutalist-yellow text-black hover:bg-yellow-400 transition-colors duration-200 font-mono font-bold text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
