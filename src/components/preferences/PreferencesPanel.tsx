"use client";

import React, { useState } from 'react';
import { Settings, Eye, Search, Palette, Shield, Zap } from 'lucide-react';
import { usePreferences } from '@/contexts/PreferencesContext';
import { PreferencesSync } from '@/components/preferences';

interface PreferencesPanelProps {
  className?: string;
}

export default function PreferencesPanel({ className = '' }: PreferencesPanelProps) {
  const { state, updatePreference } = usePreferences();
  const [activeTab, setActiveTab] = useState<'navigation' | 'search' | 'display' | 'accessibility' | 'privacy' | 'sync'>('navigation');

  const tabs = [
    { id: 'navigation' as const, label: 'Navigation', icon: <Eye size={16} /> },
    { id: 'search' as const, label: 'Search', icon: <Search size={16} /> },
    { id: 'display' as const, label: 'Display', icon: <Palette size={16} /> },
    { id: 'accessibility' as const, label: 'Accessibility', icon: <Zap size={16} /> },
    { id: 'privacy' as const, label: 'Privacy', icon: <Shield size={16} /> },
    { id: 'sync' as const, label: 'Sync', icon: <Settings size={16} /> },
  ];

  const handleToggle = (key: string) => {
    const currentValue = getNestedValue(state.preferences, key);
    updatePreference(key, !currentValue);
  };

  const handleSelect = (key: string, value: any) => {
    updatePreference(key, value);
  };

  const handleSlider = (key: string, value: number) => {
    updatePreference(key, value);
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  return (
    <div className={`preferences-panel ${className}`}>
      <div className="flex items-center mb-6">
        <Settings size={20} className="text-brutalist-yellow mr-2" />
        <h2 className="font-mono font-bold text-xl uppercase tracking-wider">
          User Preferences
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b-2 border-foreground/20 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 font-mono font-bold text-sm uppercase tracking-wider transition-colors duration-200 ${
              activeTab === tab.id
                ? 'bg-brutalist-yellow text-black border-b-3 border-black'
                : 'text-foreground/80 hover:text-foreground hover:bg-foreground/5'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {/* Navigation Preferences */}
        {activeTab === 'navigation' && (
          <div className="space-y-6">
            <h3 className="font-mono font-bold text-lg uppercase tracking-wider mb-4">
              🧭 Navigation Settings
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-foreground/20 bg-foreground/5">
                  <div>
                    <div className="font-mono font-bold text-sm">Show Breadcrumbs</div>
                    <div className="text-xs font-mono text-foreground/60">Display navigation breadcrumbs</div>
                  </div>
                  <button
                    onClick={() => handleToggle('navigation.showBreadcrumbs')}
                    className={`w-12 h-6 border-2 border-foreground relative transition-colors duration-200 ${
                      state.preferences.navigation.showBreadcrumbs ? 'bg-brutalist-yellow' : 'bg-background'
                    }`}
                  >
                    <div className={`absolute top-0 w-4 h-4 bg-foreground transition-transform duration-200 ${
                      state.preferences.navigation.showBreadcrumbs ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-foreground/20 bg-foreground/5">
                  <div>
                    <div className="font-mono font-bold text-sm">Show Suggestions</div>
                    <div className="text-xs font-mono text-foreground/60">Display content suggestions</div>
                  </div>
                  <button
                    onClick={() => handleToggle('navigation.showSuggestions')}
                    className={`w-12 h-6 border-2 border-foreground relative transition-colors duration-200 ${
                      state.preferences.navigation.showSuggestions ? 'bg-brutalist-yellow' : 'bg-background'
                    }`}
                  >
                    <div className={`absolute top-0 w-4 h-4 bg-foreground transition-transform duration-200 ${
                      state.preferences.navigation.showSuggestions ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-foreground/20 bg-foreground/5">
                  <div></div>             <div className="font-mono font-bold text-sm">Show Next Steps</div>
                    <div className="text-xs font-mono text-foreground/60">Display recommended actions</div>
                  </div>
                  <button
                    onClick={() => handleToggle('navigation.showNextSteps')}
                    className={`w-12 h-6 border-2 border-foreground relative transition-colors duration-200 ${
                      state.preferences.navigation.showNextSteps ? 'bg-brutalist-yellow' : 'bg-background'
                    }`}
                  >
                    <div className={`absolute top-0 w-4 h-4 bg-foreground transition-transform duration-200 ${
                      state.preferences.navigation.showNextSteps ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 border border-foreground/20 bg-foreground/5">
                  <div className="mb-3">
                    <div className="font-mono font-bold text-sm">Max Suggestions</div>
                    <div className="text-xs font-mono text-foreground/60">Number of suggestions to show</div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={state.preferences.navigation.maxSuggestions}
                    onChange={(e) => handleSlider('navigation.maxSuggestions', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-sm font-mono font-bold mt-2">
                    {state.preferences.navigation.maxSuggestions}
                  </div>
                </div>

                <div className="p-4 border border-foreground/20 bg-foreground/5">
                  <div className="mb-3">
                    <div className="font-mono font-bold text-sm">Context Awareness</div>
                    <div className="text-xs font-mono text-foreground/60">Level of behavioral tracking</div>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {['off', 'low', 'medium', 'high'].map((level) => (
                      <button
                        key={level}
                        onClick={() => handleSelect('navigation.contextAwareness', level)}
                        className={`px-2 py-1 text-xs font-mono font-bold uppercase tracking-wider border transition-colors duration-200 ${
                          state.preferences.navigation.contextAwareness === level
                            ? 'border-brutalist-yellow bg-brutalist-yellow text-black'
                            : 'border-foreground/20 bg-background hover:bg-foreground/10'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Preferences */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <h3 className="font-mono font-bold text-lg uppercase tracking-wider mb-4">
              🔍 Search Settings
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-foreground/20 bg-foreground/5">
                  <div>
                    <div className="font-mono font-bold text-sm">Save History</div>
                    <div className="text-xs font-mono text-foreground/60">Keep search history</div>
                  </div>
                  <button
                    onClick={() => handleToggle('search.saveHistory')}
                    className={`w-12 h-6 border-2 border-foreground relative transition-colors duration-200 ${
                      state.preferences.search.saveHistory ? 'bg-brutalist-yellow' : 'bg-background'
                    }`}
                  >
                    <div className={`absolute top-0 w-4 h-4 bg-foreground transition-transform duration-200 ${
                      state.preferences.search.saveHistory ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-foreground/20 bg-foreground/5">
                  <div>
                    <div className="font-mono font-bold text-sm">Show Suggestions</div>
                    <div className="text-xs font-mono text-foreground/60">Display search suggestions</div>
                  </div>
                  <button
                    onClick={() => handleToggle('search.showSuggestions')}
                    className={`w-12 h-6 border-2 border-foreground relative transition-colors duration-200 ${
                      state.preferences.search.showSuggestions ? 'bg-brutalist-yellow' : 'bg-background'
                    }`}
                  >
                    <div className={`absolute top-0 w-4 h-4 bg-foreground transition-transform duration-200 ${
                      state.preferences.search.showSuggestions ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-foreground/20 bg-foreground/5">
                  <div>
                    <div className="font-mono font-bold text-sm">Enable Discovery</div>
                    <div className="text-xs font-mono text-foreground/60">Show content recommendations</div>
                  </div>
                  <button
                    onClick={() => handleToggle('search.enableDiscovery')}
                    className={`w-12 h-6 border-2 border-foreground relative transition-colors duration-200 ${
                      state.preferences.search.enableDiscovery ? 'bg-brutalist-yellow' : 'bg-background'
                    }`}
                  >
                    <div className={`absolute top-0 w-4 h-4 bg-foreground transition-transform duration-200 ${
                      state.preferences.search.enableDiscovery ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 border border-foreground/20 bg-foreground/5">
                  <div className="mb-3">
                    <div className="font-mono font-bold text-sm">Default Sort</div>
                    <div className="text-xs font-mono text-foreground/60">Default search result sorting</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['relevance', 'date', 'title', 'type'].map((sort) => (
                      <button
                        key={sort}
                        onClick={() => handleSelect('search.defaultSortBy', sort)}
                        className={`px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider border transition-colors duration-200 ${
                          state.preferences.search.defaultSortBy === sort
                            ? 'border-brutalist-yellow bg-brutalist-yellow text-black'
                            : 'border-foreground/20 bg-background hover:bg-foreground/10'
                        }`}
                      >
                        {sort}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 border border-foreground/20 bg-foreground/5">
                  <div className="mb-3">
                    <div className="font-mono font-bold text-sm">Discovery Frequency</div>
                    <div className="text-xs font-mono text-foreground/60">How often to update recommendations</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {['low', 'medium', 'high'].map((freq) => (
                      <button
                        key={freq}
                        onClick={() => handleSelect('search.discoveryFrequency', freq)}
                        className={`px-2 py-1 text-xs font-mono font-bold uppercase tracking-wider border transition-colors duration-200 ${
                          state.preferences.search.discoveryFrequency === freq
                            ? 'border-brutalist-yellow bg-brutalist-yellow text-black'
                            : 'border-foreground/20 bg-background hover:bg-foreground/10'
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Display Preferences */}
        {activeTab === 'display' && (
          <div className="space-y-6">
            <h3 className="font-mono font-bold text-lg uppercase tracking-wider mb-4">
              🎨 Display Settings
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 border border-foreground/20 bg-foreground/5">
                  <div className="mb-3">
                    <div className="font-mono font-bold text-sm">Theme</div>
                    <div className="text-xs font-mono text-foreground/60">Color scheme preference</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['light', 'dark', 'auto', 'high-contrast'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => handleSelect('display.theme', theme)}
                        className={`px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider border transition-colors duration-200 ${
                          state.preferences.display.theme === theme
                            ? 'border-brutalist-yellow bg-brutalist-yellow text-black'
                            : 'border-foreground/20 bg-background hover:bg-foreground/10'
                        }`}
                      >
                        {theme.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 border border-foreground/20 bg-foreground/5">
                  <div className="mb-3">
                    <div className="font-mono font-bold text-sm">Font Size</div>
                    <div className="text-xs font-mono text-foreground/60">Text size preference</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['small', 'medium', 'large', 'extra-large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSelect('display.fontSize', size)}
                        className={`px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider border transition-colors duration-200 ${
                          state.preferences.display.fontSize === size
                            ? 'border-brutalist-yellow bg-brutalist-yellow text-black'
                            : 'border-foreground/20 bg-background hover:bg-foreground/10'
                        }`}
                      >
                        {size.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-foreground/20 bg-foreground/5">
                  <div>
                    <div className="font-mono font-bold text-sm">Animations</div>
                    <div className="text-xs font-mono text-foreground/60">Enable UI animations</div>
                  </div>
                  <button
                    onClick={() => handleToggle('display.animationsEnabled')}
                    className={`w-12 h-6 border-2 border-foreground relative transition-colors duration-200 ${
                      state.preferences.display.animationsEnabled ? 'bg-brutalist-yellow' : 'bg-background'
                    }`}
                  >
                    <div className={`absolute top-0 w-4 h-4 bg-foreground transition-transform duration-200 ${
                      state.preferences.display.animationsEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-foreground/20 bg-foreground/5">
                  <div>
                    <div className="font-mono font-bold text-sm">Reduced Motion</div>
                    <div className="text-xs font-mono text-foreground/60">Minimize motion effects</div>
                  </div>
                  <button
                    onClick={() => handleToggle('display.reducedMotion')}
                    className={`w-12 h-6 border-2 border-foreground relative transition-colors duration-200 ${
                      state.preferences.display.reducedMotion ? 'bg-brutalist-yellow' : 'bg-background'
                    }`}
                  >
                    <div className={`absolute top-0 w-4 h-4 bg-foreground transition-transform duration-200 ${
                      state.preferences.display.reducedMotion ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accessibility Preferences */}
        {activeTab === 'accessibility' && (
          <div className="space-y-6">
            <h3 className="font-mono font-bold text-lg uppercase tracking-wider mb-4">
              ♿ Accessibility Settings
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-foreground/20 bg-foreground/5">
                  <div>
                    <div className="font-mono font-bold text-sm">Screen Reader Optimized</div>
                    <div className="text-xs font-mono text-foreground/60">Optimize for screen readers</div>
                  </div>
                  <button
                    onClick={() => handleToggle('accessibility.screenReaderOptimized')}
                    className={`w-12 h-6 border-2 border-foreground relative transition-colors duration-200 ${
                      state.preferences.accessibility.screenReaderOptimized ? 'bg-brutalist-yellow' : 'bg-background'
                    }`}
                  >
                    <div className={`absolute top-0 w-4 h-4 bg-foreground transition-transform duration-200 ${
                      state.preferences.accessibility.screenReaderOptimized ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-foreground/20 bg-foreground/5">
                  <div>
                    <div className="font-mono font-bold text-sm">Enhanced Keyboard Navigation</div>
                    <div className="text-xs font-mono text-foreground/60">Improve keyboard navigation</div>
                  </div>
                  <button
                    onClick={() => handleToggle('accessibility.keyboardNavigationEnhanced')}
                    className={`w-12 h-6 border-2 border-foreground relative transition-colors duration-200 ${
                      state.preferences.accessibility.keyboardNavigationEnhanced ? 'bg-brutalist-yellow' : 'bg-background'
                    }`}
                  >
                    <div className={`absolute top-0 w-4 h-4 bg-foreground transition-transform duration-200 ${
                      state.preferences.accessibility.keyboardNavigationEnhanced ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 border border-foreground/20 bg-foreground/5">
                  <div className="mb-3">
                    <div className="font-mono font-bold text-sm">Contrast Ratio</div>
                    <div className="text-xs font-mono text-foreground/60">Text contrast level</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {['normal', 'high', 'maximum'].map((contrast) => (
                      <button
                        key={contrast}
                        onClick={() => handleSelect('accessibility.contrastRatio', contrast)}
                        className={`px-2 py-1 text-xs font-mono font-bold uppercase tracking-wider border transition-colors duration-200 ${
                          state.preferences.accessibility.contrastRatio === contrast
                            ? 'border-brutalist-yellow bg-brutalist-yellow text-black'
                            : 'border-foreground/20 bg-background hover:bg-foreground/10'
                        }`}
                      >
                        {contrast}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Preferences */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <h3 className="font-mono font-bold text-lg uppercase tracking-wider mb-4">
              🔒 Privacy Settings
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-foreground/20 bg-foreground/5">
                  <div>
                    <div className="font-mono font-bold text-sm">Tracking Enabled</div>
                    <div className="text-xs font-mono text-foreground/60">Allow usage tracking</div>
                  </div>
                  <button
                    onClick={() => handleToggle('privacy.trackingEnabled')}
                    className={`w-12 h-6 border-2 border-foreground relative transition-colors duration-200 ${
                      state.preferences.privacy.trackingEnabled ? 'bg-brutalist-yellow' : 'bg-background'
                    }`}
                  >
                    <div className={`absolute top-0 w-4 h-4 bg-foreground transition-transform duration-200 ${
                      state.preferences.privacy.trackingEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-foreground/20 bg-foreground/5">
                  <div>
                    <div className="font-mono font-bold text-sm">Analytics Enabled</div>
                    <div className="text-xs font-mono text-foreground/60">Allow analytics collection</div>
                  </div>
                  <button
                    onClick={() => handleToggle('privacy.analyticsEnabled')}
                    className={`w-12 h-6 border-2 border-foreground relative transition-colors duration-200 ${
                      state.preferences.privacy.analyticsEnabled ? 'bg-brutalist-yellow' : 'bg-background'
                    }`}
                  >
                    <div className={`absolute top-0 w-4 h-4 bg-foreground transition-transform duration-200 ${
                      state.preferences.privacy.analyticsEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 border border-foreground/20 bg-foreground/5">
                  <div className="mb-3">
                    <div className="font-mono font-bold text-sm">Data Collection</div>
                    <div className="text-xs font-mono text-foreground/60">Level of data collection</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {['none', 'essential', 'all'].map((level) => (
                      <button
                        key={level}
                        onClick={() => handleSelect('privacy.dataCollection', level)}
                        className={`px-2 py-1 text-xs font-mono font-bold uppercase tracking-wider border transition-colors duration-200 ${
                          state.preferences.privacy.dataCollection === level
                            ? 'border-brutalist-yellow bg-brutalist-yellow text-black'
                            : 'border-foreground/20 bg-background hover:bg-foreground/10'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sync Preferences */}
        {activeTab === 'sync' && (
          <PreferencesSync />
        )}
      </div>
    </div>
  );
}