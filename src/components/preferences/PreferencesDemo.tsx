"use client";

import React from 'react';
import { Settings, RefreshCw, Database, Shield } from 'lucide-react';
import { PreferencesPanel } from '@/components/preferences';
import { usePreferences } from '@/contexts/PreferencesContext';

interface PreferencesDemoProps {
    className?: string;
}

export default function PreferencesDemo({ className = '' }: PreferencesDemoProps) {
    const { state } = usePreferences();

    return (
        <div className={`preferences-demo ${className}`}>
            {/* Demo Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-4">
                    User Preference Synchronization
                </h2>
                <p className="text-lg font-mono font-bold text-foreground/80 max-w-3xl mx-auto">
                    Experience comprehensive preference management with cross-session persistence,
                    conflict resolution, and seamless synchronization across devices.
                </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="p-4 border-3 border-foreground bg-background text-center">
                    <Settings size={32} className="mx-auto text-brutalist-yellow mb-3" />
                    <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-2">
                        Global State
                    </h3>
                    <p className="text-xs font-mono text-foreground/60">
                        Centralized preference management across all components
                    </p>
                </div>

                <div className="p-4 border-3 border-foreground bg-background text-center">
                    <RefreshCw size={32} className="mx-auto text-brutalist-yellow mb-3" />
                    <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-2">
                        Auto Sync
                    </h3>
                    <p className="text-xs font-mono text-foreground/60">
                        Automatic synchronization with conflict resolution
                    </p>
                </div>

                <div className="p-4 border-3 border-foreground bg-background text-center">
                    <Database size={32} className="mx-auto text-brutalist-yellow mb-3" />
                    <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-2">
                        Persistence
                    </h3>
                    <p className="text-xs font-mono text-foreground/60">
                        Local storage with backup and restore capabilities
                    </p>
                </div>

                <div className="p-4 border-3 border-foreground bg-background text-center">
                    <Shield size={32} className="mx-auto text-brutalist-yellow mb-3" />
                    <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-2">
                        Privacy
                    </h3>
                    <p className="text-xs font-mono text-foreground/60">
                        Granular privacy controls and data management
                    </p>
                </div>
            </div>

            {/* Current State Overview */}
            <div className="mb-8 p-6 bg-foreground/5 border-2 border-foreground/20">
                <h3 className="font-mono font-bold text-lg uppercase tracking-wider mb-4">
                    📊 Current Preference State
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-mono font-bold text-brutalist-yellow mb-1">
                            v{state.preferences.version}
                        </div>
                        <div className="text-xs font-mono text-foreground/60 uppercase tracking-wider">
                            Version
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-2xl font-mono font-bold text-brutalist-yellow mb-1">
                            {state.backups.length}
                        </div>
                        <div className="text-xs font-mono text-foreground/60 uppercase tracking-wider">
                            Backups
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-2xl font-mono font-bold text-brutalist-yellow mb-1">
                            {state.syncHistory.length}
                        </div>
                        <div className="text-xs font-mono text-foreground/60 uppercase tracking-wider">
                            Sync Records
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-2xl font-mono font-bold text-brutalist-yellow mb-1">
                            {state.conflicts.length}
                        </div>
                        <div className="text-xs font-mono text-foreground/60 uppercase tracking-wider">
                            Conflicts
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-foreground/20">
                    <div className="text-xs font-mono text-foreground/60 space-y-1">
                        <div>
                            <strong>Last Updated:</strong> {state.preferences.updatedAt.toLocaleString()}
                        </div>
                        <div>
                            <strong>Session ID:</strong> {state.preferences.sessionId.slice(-8)}...
                        </div>
                        <div>
                            <strong>Sync Status:</strong> {state.isSyncing ? 'Syncing...' : 'Ready'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Preferences Panel */}
            <div className="border-3 border-foreground bg-background">
                <PreferencesPanel />
            </div>

            {/* Technical Features */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-brutalist-yellow/5 border border-brutalist-yellow/20">
                    <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-4">
                        🔧 Technical Features
                    </h4>
                    <ul className="text-xs font-mono text-foreground/80 space-y-2">
                        <li>• Real-time preference updates across components</li>
                        <li>• Automatic localStorage persistence</li>
                        <li>• Version control with conflict detection</li>
                        <li>• Import/export functionality with validation</li>
                        <li>• Automatic backup creation and restoration</li>
                        <li>• Cross-session state synchronization</li>
                        <li>• Granular preference categorization</li>
                        <li>• Type-safe preference management</li>
                    </ul>
                </div>

                <div className="p-6 bg-brutalist-yellow/5 border border-brutalist-yellow/20">
                    <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-4">
                        🎯 Use Cases
                    </h4>
                    <ul className="text-xs font-mono text-foreground/80 space-y-2">
                        <li>• Accessibility customization persistence</li>
                        <li>• Theme and display preference sync</li>
                        <li>• Search and navigation behavior settings</li>
                        <li>• Privacy and data collection controls</li>
                        <li>• Cross-device preference synchronization</li>
                        <li>• Team settings and configuration sharing</li>
                        <li>• A/B testing and feature flag management</li>
                        <li>• User onboarding and setup wizards</li>
                    </ul>
                </div>
            </div>

            {/* Demo Actions */}
            <div className="mt-8 p-6 bg-foreground/5 border-2 border-foreground/20">
                <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-4">
                    🎮 Try the Demo
                </h4>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <button
                        onClick={() => {
                            console.log('Demo: Toggle navigation suggestions');
                        }}
                        className="px-3 py-2 border border-foreground/20 bg-background hover:bg-brutalist-yellow hover:text-black transition-colors duration-200 font-mono font-bold text-xs uppercase tracking-wider"
                    >
                        Toggle Navigation
                    </button>

                    <button
                        onClick={() => {
                            console.log('Demo: Change theme');
                        }}
                        className="px-3 py-2 border border-foreground/20 bg-background hover:bg-brutalist-yellow hover:text-black transition-colors duration-200 font-mono font-bold text-xs uppercase tracking-wider"
                    >
                        Change Theme
                    </button>

                    <button
                        onClick={() => {
                            console.log('Demo: Create backup');
                        }}
                        className="px-3 py-2 border border-foreground/20 bg-background hover:bg-brutalist-yellow hover:text-black transition-colors duration-200 font-mono font-bold text-xs uppercase tracking-wider"
                    >
                        Create Backup
                    </button>

                    <button
                        onClick={() => {
                            console.log('Demo: Export preferences');
                        }}
                        className="px-3 py-2 border border-foreground/20 bg-background hover:bg-brutalist-yellow hover:text-black transition-colors duration-200 font-mono font-bold text-xs uppercase tracking-wider"
                    >
                        Export Settings
                    </button>
                </div>
            </div>
        </div>
    );
} 