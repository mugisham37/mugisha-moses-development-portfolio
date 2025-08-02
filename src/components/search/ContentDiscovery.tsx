"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Lightbulb, ArrowRight, TrendingUp, Eye, Star } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';
import { ContentDiscovery as ContentDiscoveryType } from '@/types/search';

interface ContentDiscoveryProps {
  className?: string;
  maxItems?: number;
  autoGenerate?: boolean;
}

export default function ContentDiscovery({
  className = '',
  maxItems = 5,
  autoGenerate = true,
}: ContentDiscoveryProps) {
  const { state, generateDiscoveries } = useSearch();

  // Auto-generate discoveries when component mounts or search history changes
  useEffect(() => {
    if (autoGenerate && state.history.length > 0) {
      generateDiscoveries();
    }
  }, [autoGenerate, state.history.length, generateDiscoveries]);

  const discoveries = state.discoveries.slice(0, maxItems);

  if (discoveries.length === 0) {
    return (
      <div className={`content-discovery ${className}`}>
        <div className="text-center py-8">
          <Lightbulb size={48} className="mx-auto text-foreground/40 mb-4" />
          <h3 className="font-mono font-bold text-lg uppercase tracking-wider mb-2">
            No Discoveries Yet
          </h3>
          <p className="text-sm font-mono text-foreground/60">
            Explore the site to get personalized content recommendations.
          </p>
        </div>
      </div>
    );
  }

  const getDiscoveryIcon = (type: ContentDiscoveryType['type']) => {
    switch (type) {
      case 'project':
        return '🚀';
      case 'service':
        return '⚡';
      case 'page':
        return '📄';
      case 'content':
        return '📖';
      case 'skill':
        return '🛠️';
      default:
        return '💡';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 border-green-500';
    if (confidence >= 0.6) return 'text-yellow-600 border-yellow-500';
    return 'text-orange-600 border-orange-500';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <div className={`content-discovery ${className}`}>
      <div className="flex items-center mb-6">
        <Lightbulb size={20} className="text-brutalist-yellow mr-2" />
        <h3 className="font-mono font-bold text-lg uppercase tracking-wider">
          Recommended for You
        </h3>
      </div>

      <div className="space-y-4">
        {discoveries.map((discovery, index) => (
          <Link
            key={discovery.id}
            href={discovery.url}
            className="block p-4 border-2 border-foreground/20 bg-background hover:border-brutalist-yellow hover:bg-brutalist-yellow/5 transition-all duration-200 group"
          >
            <div className="flex items-start space-x-4">
              {/* Discovery Icon */}
              <div className="flex-shrink-0 mt-1">
                <div className="text-2xl">
                  {getDiscoveryIcon(discovery.type)}
                </div>
              </div>

              {/* Discovery Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-mono font-bold text-base uppercase tracking-wider text-foreground group-hover:text-brutalist-yellow transition-colors duration-200">
                    {discovery.title}
                  </h4>
                  <div className="flex items-center space-x-2 ml-4">
                    <div className={`px-2 py-1 text-xs font-mono font-bold uppercase tracking-wider border ${getConfidenceColor(discovery.confidence)}`}>
                      {getConfidenceLabel(discovery.confidence)}
                    </div>
                    <ArrowRight size={16} className="text-foreground/40 group-hover:text-brutalist-yellow group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </div>

                <p className="text-sm font-mono text-foreground/80 mb-3 leading-relaxed">
                  {discovery.description}
                </p>

                {/* Discovery Reason */}
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp size={14} className="text-brutalist-yellow" />
                  <span className="text-xs font-mono text-foreground/60 italic">
                    {discovery.reason}
                  </span>
                </div>

                {/* Discovery Metadata */}
                <div className="flex items-center justify-between text-xs font-mono text-foreground/60">
                  <div className="flex items-center space-x-4">
                    <span className="px-2 py-1 border border-foreground/20 bg-foreground/5 uppercase tracking-wider">
                      {discovery.type}
                    </span>
                    <span>
                      Confidence: {Math.round(discovery.confidence * 100)}%
                    </span>
                  </div>

                  {/* Based On Indicators */}
                  <div className="flex items-center space-x-2">
                    {discovery.basedOn.map((basis, basisIndex) => (
                      <div
                        key={basisIndex}
                        className="flex items-center space-x-1"
                        title={`Based on ${basis.type}`}
                      >
                        {basis.type === 'search' && <Eye size={12} />}
                        {basis.type === 'view' && <Star size={12} />}
                        {basis.type === 'interaction' && <TrendingUp size={12} />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Discovery Actions */}
      <div className="mt-6 pt-4 border-t border-foreground/20">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-foreground/60">
            Recommendations based on your activity
          </div>
          
          <button
            onClick={generateDiscoveries}
            className="px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider border border-foreground/20 bg-foreground/5 hover:bg-brutalist-yellow hover:text-black transition-colors duration-200"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Discovery Insights */}
      {state.history.length > 0 && (
        <div className="mt-4 p-3 bg-brutalist-yellow/5 border border-brutalist-yellow/20">
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb size={14} className="text-brutalist-yellow" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground/80">
              Discovery Insights
            </span>
          </div>
          
          <div className="text-xs font-mono text-foreground/60 space-y-1">
            <div>
              • Based on {state.history.length} recent search{state.history.length !== 1 ? 'es' : ''}
            </div>
            <div>
              • {discoveries.length} personalized recommendation{discoveries.length !== 1 ? 's' : ''}
            </div>
            <div>
              • Updated automatically as you explore
            </div>
          </div>
        </div>
      )}

      {/* Empty State Actions */}
      {discoveries.length === 0 && state.history.length === 0 && (
        <div className="mt-6 text-center"></div>         <div className="text-sm font-mono text-foreground/60 mb-4">
            Start exploring to get personalized recommendations
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'View Projects', href: '/portfolio' },
              { label: 'Explore Services', href: '/services' },
              { label: 'Learn About Me', href: '/about' },
              { label: 'Get in Touch', href: '/contact' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider border border-foreground/20 bg-foreground/5 hover:bg-brutalist-yellow hover:text-black transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}