"use client";

import { lazy, Suspense } from "react";
import LazyWrapper from "@/components/ui/LazyWrapper";

// Lazy load heavy components
const ProjectShowcase = lazy(() => import("./ProjectShowcase"));
const ProjectGrid = lazy(() => import("./ProjectGrid"));
const TestimonialsCarousel = lazy(() => import("./TestimonialsCarousel"));
const ProcessTimeline = lazy(() => import("./ProcessTimeline"));
const SkillsDisplay = lazy(() => import("./SkillsDisplay"));

// Loading fallbacks
const ProjectShowcaseFallback = () => (
  <div className="container mx-auto px-4 py-16">
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 h-48 border-5 border-black mb-4"></div>
          <div className="bg-gray-200 h-4 mb-2"></div>
          <div className="bg-gray-200 h-4 w-3/4"></div>
        </div>
      ))}
    </div>
  </div>
);

const ProjectGridFallback = () => (
  <div className="container mx-auto px-4 py-16">
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-300 h-32 border-3 border-brutalist-yellow mb-3"></div>
          <div className="bg-gray-300 h-3 mb-2"></div>
          <div className="bg-gray-300 h-3 w-2/3"></div>
        </div>
      ))}
    </div>
  </div>
);

const TestimonialsFallback = () => (
  <div className="container mx-auto px-4 py-16">
    <div className="grid md:grid-cols-2 gap-8">
      {[1, 2].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 border-5 border-black p-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <div className="bg-gray-300 h-4 w-24 mb-2"></div>
                <div className="bg-gray-300 h-3 w-32"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-300 h-3 w-full"></div>
              <div className="bg-gray-300 h-3 w-full"></div>
              <div className="bg-gray-300 h-3 w-3/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProcessTimelineFallback = () => (
  <div className="container mx-auto px-4 py-16">
    <div className="grid md:grid-cols-5 gap-8">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="animate-pulse text-center">
          <div className="w-16 h-16 mx-auto bg-gray-200 border-5 border-black mb-4"></div>
          <div className="bg-gray-200 h-4 mb-2"></div>
          <div className="bg-gray-200 h-3"></div>
        </div>
      ))}
    </div>
  </div>
);

const SkillsDisplayFallback = () => (
  <div className="container mx-auto px-4 py-16">
    <div className="grid md:grid-cols-2 gap-12">
      <div className="animate-pulse">
        <div className="bg-gray-300 h-6 w-48 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <div className="bg-gray-300 h-4 w-32 mb-2"></div>
              <div className="bg-gray-200 h-3 w-full"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="animate-pulse">
        <div className="bg-gray-300 h-6 w-48 mb-6"></div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-gray-300 h-16 border-3 border-gray-400"
            ></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Lazy section components
export const LazyProjectShowcase = () => (
  <LazyWrapper fallback={<ProjectShowcaseFallback />}>
    <Suspense fallback={<ProjectShowcaseFallback />}>
      <ProjectShowcase />
    </Suspense>
  </LazyWrapper>
);

export const LazyProjectGrid = () => (
  <LazyWrapper fallback={<ProjectGridFallback />}>
    <Suspense fallback={<ProjectGridFallback />}>
      <ProjectGrid />
    </Suspense>
  </LazyWrapper>
);

export const LazyTestimonialsCarousel = ({
  className,
}: {
  className?: string;
}) => (
  <LazyWrapper fallback={<TestimonialsFallback />}>
    <Suspense fallback={<TestimonialsFallback />}>
      <TestimonialsCarousel className={className} />
    </Suspense>
  </LazyWrapper>
);

export const LazyProcessTimeline = () => (
  <LazyWrapper fallback={<ProcessTimelineFallback />}>
    <Suspense fallback={<ProcessTimelineFallback />}>
      <ProcessTimeline />
    </Suspense>
  </LazyWrapper>
);

export const LazySkillsDisplay = () => (
  <LazyWrapper fallback={<SkillsDisplayFallback />}>
    <Suspense fallback={<SkillsDisplayFallback />}>
      <SkillsDisplay />
    </Suspense>
  </LazyWrapper>
);
