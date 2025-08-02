"use client";

import React from "react";
import {
  InteractiveChart,
  ProgressIndicators,
  DataDrillDown,
  VisualizationExporter,
  DataVisualizationDashboard,
} from "@/components/enhanced";
import type { ChartSeries } from "@/components/enhanced/InteractiveChart";
import type { ProgressStep } from "@/components/enhanced/ProgressIndicators";
import type {
  DataPoint,
  FilterOption,
} from "@/components/enhanced/DataDrillDown";

const DataVisualizationDemo = () => {
  // Sample data for charts
  const chartData: ChartSeries[] = [
    {
      name: "Projects Completed",
      data: [
        { label: "Q1 2023", value: 12 },
        { label: "Q2 2023", value: 18 },
        { label: "Q3 2023", value: 15 },
        { label: "Q4 2023", value: 22 },
        { label: "Q1 2024", value: 28 },
      ],
      color: "#3B82F6",
    },
    {
      name: "Client Satisfaction",
      data: [
        { label: "Q1 2023", value: 85 },
        { label: "Q2 2023", value: 92 },
        { label: "Q3 2023", value: 88 },
        { label: "Q4 2023", value: 95 },
        { label: "Q1 2024", value: 97 },
      ],
      color: "#10B981",
    },
  ];

  // Sample progress data
  const progressSteps: ProgressStep[] = [
    {
      id: "planning",
      label: "Project Planning",
      description: "Initial project setup and requirements gathering",
      status: "completed",
      progress: 100,
      metadata: { duration: "2 weeks", team: "3 members" },
    },
    {
      id: "development",
      label: "Development Phase",
      description: "Core feature implementation and testing",
      status: "in-progress",
      progress: 75,
      metadata: { duration: "6 weeks", team: "5 members" },
    },
    {
      id: "testing",
      label: "Quality Assurance",
      description: "Comprehensive testing and bug fixes",
      status: "pending",
      progress: 0,
      metadata: { duration: "2 weeks", team: "2 members" },
    },
    {
      id: "deployment",
      label: "Deployment",
      description: "Production deployment and monitoring",
      status: "pending",
      progress: 0,
      metadata: { duration: "1 week", team: "2 members" },
    },
  ];

  // Sample drill-down data
  const drillDownData: DataPoint[] = [
    {
      id: "frontend",
      label: "Frontend Technologies",
      value: 45,
      category: "technology",
      children: [
        {
          id: "react",
          label: "React",
          value: 25,
          category: "framework",
          metadata: { projects: 15, experience: "5 years" },
        },
        {
          id: "vue",
          label: "Vue.js",
          value: 12,
          category: "framework",
          metadata: { projects: 8, experience: "3 years" },
        },
        {
          id: "angular",
          label: "Angular",
          value: 8,
          category: "framework",
          metadata: { projects: 5, experience: "2 years" },
        },
      ],
    },
    {
      id: "backend",
      label: "Backend Technologies",
      value: 35,
      category: "technology",
      children: [
        {
          id: "nodejs",
          label: "Node.js",
          value: 20,
          category: "runtime",
          metadata: { projects: 12, experience: "4 years" },
        },
        {
          id: "python",
          label: "Python",
          value: 10,
          category: "language",
          metadata: { projects: 6, experience: "3 years" },
        },
        {
          id: "java",
          label: "Java",
          value: 5,
          category: "language",
          metadata: { projects: 3, experience: "2 years" },
        },
      ],
    },
  ];

  const filters: FilterOption[] = [
    {
      id: "category",
      label: "Category",
      type: "select",
      options: [
        { value: "technology", label: "Technology" },
        { value: "framework", label: "Framework" },
        { value: "language", label: "Language" },
        { value: "runtime", label: "Runtime" },
      ],
    },
    {
      id: "experience",
      label: "Experience Range",
      type: "range",
      min: 0,
      max: 10,
    },
  ];

  return (
    <div className="min-h-screen bg-brutalist-light-gray py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-4">
            Interactive Data Visualization Demo
          </h1>
          <p className="text-lg font-mono text-gray-600 max-w-3xl mx-auto">
            Demonstration of advanced data visualization components including
            charts, progress indicators, drill-down interfaces, and export
            functionality.
          </p>
        </div>

        {/* Individual Component Demos */}
        <div className="space-y-16">
          {/* Interactive Chart Demo */}
          <section className="bg-white border-5 border-black p-8">
            <h2 className="text-2xl font-black font-mono uppercase tracking-wider mb-6">
              Interactive Charts
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-mono font-bold mb-4">Bar Chart</h3>
                <InteractiveChart
                  type="bar"
                  data={chartData}
                  title="Project Performance"
                  showLegend={true}
                  animated={true}
                  exportable={true}
                />
              </div>
              <div>
                <h3 className="text-lg font-mono font-bold mb-4">Line Chart</h3>
                <InteractiveChart
                  type="line"
                  data={chartData}
                  title="Trend Analysis"
                  showLegend={true}
                  animated={true}
                  exportable={true}
                />
              </div>
            </div>
          </section>

          {/* Progress Indicators Demo */}
          <section className="bg-white border-5 border-black p-8">
            <h2 className="text-2xl font-black font-mono uppercase tracking-wider mb-6">
              Progress Indicators
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-mono font-bold mb-4">
                  Linear Progress
                </h3>
                <ProgressIndicators
                  steps={progressSteps}
                  type="linear"
                  orientation="vertical"
                  showProgress={true}
                  showMetadata={true}
                  animated={true}
                />
              </div>
              <div>
                <h3 className="text-lg font-mono font-bold mb-4">
                  Timeline Progress
                </h3>
                <ProgressIndicators
                  steps={progressSteps}
                  type="timeline"
                  showProgress={true}
                  showMetadata={true}
                  animated={true}
                />
              </div>
            </div>
          </section>

          {/* Data Drill-Down Demo */}
          <section className="bg-white border-5 border-black p-8">
            <h2 className="text-2xl font-black font-mono uppercase tracking-wider mb-6">
              Data Drill-Down Interface
            </h2>
            <DataDrillDown
              data={drillDownData}
              title="Technology Stack Analysis"
              subtitle="Explore technologies by category and experience level"
              filters={filters}
              enableSearch={true}
              enableSorting={true}
              enableGrouping={true}
              enableExport={true}
              maxDepth={3}
            />
          </section>

          {/* Circular Progress Demo */}
          <section className="bg-white border-5 border-black p-8">
            <h2 className="text-2xl font-black font-mono uppercase tracking-wider mb-6">
              Alternative Progress Views
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-mono font-bold mb-4 text-center">
                  Circular
                </h3>
                <ProgressIndicators
                  steps={progressSteps}
                  type="circular"
                  showLabels={true}
                  animated={true}
                />
              </div>
              <div>
                <h3 className="text-lg font-mono font-bold mb-4 text-center">
                  Kanban
                </h3>
                <ProgressIndicators
                  steps={progressSteps}
                  type="kanban"
                  showProgress={true}
                  animated={true}
                />
              </div>
              <div>
                <h3 className="text-lg font-mono font-bold mb-4 text-center">
                  Radial
                </h3>
                <ProgressIndicators
                  steps={progressSteps}
                  type="radial"
                  showProgress={true}
                  animated={true}
                />
              </div>
            </div>
          </section>

          {/* Dashboard Demo */}
          <section className="bg-white border-5 border-black p-8">
            <h2 className="text-2xl font-black font-mono uppercase tracking-wider mb-6">
              Complete Dashboard
            </h2>
            <p className="font-mono text-gray-600 mb-6">
              The dashboard below combines all components into a unified
              interface with customization options.
            </p>
            <DataVisualizationDashboard
              title="Portfolio Analytics Dashboard"
              subtitle="Comprehensive view of project metrics and progress"
              enableCustomization={true}
              enableExport={true}
              enableFullscreen={true}
              widgets={[]}
            />
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 p-8 bg-brutalist-black border-5 border-brutalist-yellow">
          <h3 className="text-xl font-black font-mono uppercase tracking-wider text-white mb-4">
            Task 8.3 Complete
          </h3>
          <p className="font-mono text-brutalist-gray">
            Interactive Data Visualization components successfully implemented
            with:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-mono font-black text-brutalist-yellow">
                5
              </div>
              <div className="text-sm font-mono text-brutalist-gray uppercase tracking-wider">
                Components
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono font-black text-brutalist-yellow">
                ✓
              </div>
              <div className="text-sm font-mono text-brutalist-gray uppercase tracking-wider">
                Charts & Graphs
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono font-black text-brutalist-yellow">
                ✓
              </div>
              <div className="text-sm font-mono text-brutalist-gray uppercase tracking-wider">
                Progress Indicators
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono font-black text-brutalist-yellow">
                ✓
              </div>
              <div className="text-sm font-mono text-brutalist-gray uppercase tracking-wider">
                Export Features
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualizationDemo;
