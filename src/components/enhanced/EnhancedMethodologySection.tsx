"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface EnhancedMethodologySectionProps {
  className?: string;
  enableProgressTracking?: boolean;
  showMetrics?: boolean;
  enablePhaseComparison?: boolean;
}

interface ProcessPhase {
  id: string;
  phase: string;
  title: string;
  description: string;
  timeframe: string;
  icon: string;
  details: string[];
  qualityChecks: QualityCheck[];
  communicationMilestones: CommunicationMilestone[];
  deliverables: string[];
  risks: string[];
  tools: string[];
  metrics?: PhaseMetrics;
  dependencies?: string[];
  keySuccessFactors?: string[];
}

interface QualityCheck {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  critical: boolean;
}

interface CommunicationMilestone {
  id: string;
  name: string;
  description: string;
  frequency: string;
  method: string;
  example?: string;
}

interface PhaseMetrics {
  successRate: number;
  averageDuration: string;
  clientSatisfaction: number;
  commonChallenges: string[];
}

const EnhancedMethodologySection: React.FC<EnhancedMethodologySectionProps> = ({
  className,
  enableProgressTracking = true,
  showMetrics = true,
  enablePhaseComparison = false,
}) => {
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [showProgressOverview, setShowProgressOverview] = useState(false);
  const [comparisonPhases, setComparisonPhases] = useState<string[]>([]);

  const processPhases: ProcessPhase[] = [
    {
      id: "discovery",
      phase: "01",
      title: "DISCOVERY & ANALYSIS",
      description:
        "Deep dive into your business needs, goals, and technical requirements",
      timeframe: "1-2 WEEKS",
      icon: "🔍",
      details: [
        "Comprehensive business analysis and goal alignment",
        "Target audience research and persona development",
        "Technical requirements gathering and feasibility assessment",
        "Competitive landscape analysis and differentiation strategy",
        "Success metrics definition and KPI establishment",
        "Risk assessment and mitigation planning",
      ],
      qualityChecks: [
        {
          id: "req-complete",
          name: "Requirements Completeness",
          description:
            "All functional and non-functional requirements documented",
          completed: true,
          critical: true,
        },
        {
          id: "stakeholder-alignment",
          name: "Stakeholder Alignment",
          description: "All stakeholders agree on project scope and objectives",
          completed: true,
          critical: true,
        },
        {
          id: "technical-feasibility",
          name: "Technical Feasibility",
          description: "Technical approach validated and approved",
          completed: true,
          critical: false,
        },
      ],
      communicationMilestones: [
        {
          id: "kickoff",
          name: "Project Kickoff Meeting",
          description: "Initial project discussion and expectation setting",
          frequency: "Once",
          method: "Video Call",
          example:
            "90-minute session covering project goals, timeline, and success metrics",
        },
        {
          id: "discovery-updates",
          name: "Discovery Progress Updates",
          description: "Regular updates on research findings and insights",
          frequency: "Every 2 days",
          method: "Email + Slack",
          example:
            "Brief email with key findings and next steps, plus Slack availability for questions",
        },
        {
          id: "requirements-review",
          name: "Requirements Review Session",
          description: "Comprehensive review of gathered requirements",
          frequency: "End of phase",
          method: "Video Call + Document",
          example:
            "2-hour session with detailed requirements walkthrough and client approval",
        },
      ],
      deliverables: [
        "Project Requirements Document (PRD)",
        "Technical Specification Document",
        "User Personas and Journey Maps",
        "Competitive Analysis Report",
        "Project Timeline and Milestones",
        "Risk Assessment Matrix",
      ],
      risks: [
        "Incomplete or changing requirements",
        "Stakeholder misalignment",
        "Technical complexity underestimation",
      ],
      tools: ["Notion", "Figma", "Miro", "Google Analytics", "Hotjar"],
      metrics: {
        successRate: 95,
        averageDuration: "1.5 weeks",
        clientSatisfaction: 4.8,
        commonChallenges: [
          "Scope creep",
          "Unclear requirements",
          "Multiple stakeholders",
        ],
      },
      dependencies: [],
      keySuccessFactors: [
        "Clear communication with all stakeholders",
        "Comprehensive requirement documentation",
        "Early identification of technical constraints",
      ],
    },
    {
      id: "strategy",
      phase: "02",
      title: "STRATEGY & ARCHITECTURE",
      description: "Creating the technical roadmap and system architecture",
      timeframe: "1-2 WEEKS",
      icon: "🎯",
      details: [
        "Information architecture design and content strategy",
        "Technology stack selection and justification",
        "System architecture planning and scalability considerations",
        "User experience strategy and interaction design",
        "Performance optimization strategy and benchmarks",
        "Security architecture and compliance planning",
      ],
      qualityChecks: [
        {
          id: "arch-review",
          name: "Architecture Review",
          description: "System architecture reviewed by senior developers",
          completed: true,
          critical: true,
        },
        {
          id: "tech-stack",
          name: "Technology Stack Validation",
          description: "Selected technologies align with project requirements",
          completed: true,
          critical: true,
        },
        {
          id: "scalability",
          name: "Scalability Assessment",
          description: "Architecture supports expected growth and load",
          completed: true,
          critical: false,
        },
      ],
      communicationMilestones: [
        {
          id: "strategy-presentation",
          name: "Strategy Presentation",
          description: "Present technical strategy and architecture decisions",
          frequency: "Once",
          method: "Video Call + Slides",
        },
        {
          id: "architecture-review",
          name: "Architecture Review Meeting",
          description: "Detailed review of system architecture",
          frequency: "Mid-phase",
          method: "Video Call + Diagrams",
        },
        {
          id: "strategy-approval",
          name: "Strategy Approval Session",
          description: "Final approval of technical strategy and approach",
          frequency: "End of phase",
          method: "Video Call + Document",
        },
      ],
      deliverables: [
        "Technical Architecture Document",
        "Technology Stack Recommendation",
        "Database Schema Design",
        "API Specification Document",
        "Security Implementation Plan",
        "Performance Optimization Strategy",
      ],
      risks: [
        "Technology selection misalignment",
        "Architecture complexity issues",
        "Performance bottleneck identification",
      ],
      tools: ["Lucidchart", "Draw.io", "Postman", "Docker", "AWS/Vercel"],
      metrics: {
        successRate: 92,
        averageDuration: "1.8 weeks",
        clientSatisfaction: 4.7,
        commonChallenges: [
          "Complex integrations",
          "Scalability planning",
          "Technology decisions",
        ],
      },
      dependencies: ["discovery"],
      keySuccessFactors: [
        "Thorough technical research",
        "Scalable architecture design",
        "Clear technology justification",
      ],
    },
    {
      id: "development",
      phase: "03",
      title: "DEVELOPMENT & IMPLEMENTATION",
      description:
        "Building your solution with precision, testing, and continuous integration",
      timeframe: "4-8 WEEKS",
      icon: "⚡",
      details: [
        "Agile development with 2-week sprints",
        "Test-driven development (TDD) approach",
        "Continuous integration and deployment setup",
        "Code reviews and pair programming sessions",
        "Performance monitoring and optimization",
        "Security implementation and vulnerability testing",
      ],
      qualityChecks: [
        {
          id: "code-coverage",
          name: "Code Coverage",
          description: "Minimum 80% test coverage maintained",
          completed: true,
          critical: true,
        },
        {
          id: "code-review",
          name: "Code Review Process",
          description: "All code reviewed before merging",
          completed: true,
          critical: true,
        },
        {
          id: "performance-benchmarks",
          name: "Performance Benchmarks",
          description: "All performance targets met",
          completed: false,
          critical: false,
        },
        {
          id: "security-scan",
          name: "Security Vulnerability Scan",
          description: "No critical security vulnerabilities",
          completed: true,
          critical: true,
        },
      ],
      communicationMilestones: [
        {
          id: "sprint-planning",
          name: "Sprint Planning Sessions",
          description: "Plan upcoming sprint goals and tasks",
          frequency: "Every 2 weeks",
          method: "Video Call + Project Board",
        },
        {
          id: "daily-standups",
          name: "Daily Progress Updates",
          description: "Brief daily progress and blocker updates",
          frequency: "Daily",
          method: "Slack + Optional Call",
        },
        {
          id: "sprint-demos",
          name: "Sprint Demo Sessions",
          description: "Demonstrate completed features and gather feedback",
          frequency: "Every 2 weeks",
          method: "Video Call + Screen Share",
        },
      ],
      deliverables: [
        "Working Software Increments",
        "Automated Test Suite",
        "Code Documentation",
        "Deployment Scripts",
        "Performance Reports",
        "Security Audit Results",
      ],
      risks: [
        "Scope creep and feature additions",
        "Technical debt accumulation",
        "Integration complexity issues",
      ],
      tools: [
        "VS Code",
        "Git",
        "GitHub Actions",
        "Jest",
        "Cypress",
        "SonarQube",
      ],
      metrics: {
        successRate: 88,
        averageDuration: "6.2 weeks",
        clientSatisfaction: 4.9,
        commonChallenges: [
          "Feature creep",
          "Integration issues",
          "Performance optimization",
        ],
      },
      dependencies: ["strategy"],
      keySuccessFactors: [
        "Agile development practices",
        "Continuous testing and integration",
        "Regular client communication",
      ],
    },
    {
      id: "testing",
      phase: "04",
      title: "TESTING & QUALITY ASSURANCE",
      description:
        "Comprehensive testing across all devices, browsers, and scenarios",
      timeframe: "1-2 WEEKS",
      icon: "🧪",
      details: [
        "Cross-browser and device compatibility testing",
        "Performance testing and optimization",
        "Accessibility compliance testing (WCAG 2.1)",
        "Security penetration testing",
        "User acceptance testing coordination",
        "Load testing and stress testing",
      ],
      qualityChecks: [
        {
          id: "browser-compat",
          name: "Browser Compatibility",
          description: "Tested on all major browsers and versions",
          completed: true,
          critical: true,
        },
        {
          id: "accessibility",
          name: "Accessibility Compliance",
          description: "WCAG 2.1 AA compliance verified",
          completed: true,
          critical: true,
        },
        {
          id: "performance-audit",
          name: "Performance Audit",
          description: "Lighthouse score above 90 for all metrics",
          completed: false,
          critical: false,
        },
        {
          id: "security-test",
          name: "Security Testing",
          description: "Penetration testing completed successfully",
          completed: true,
          critical: true,
        },
      ],
      communicationMilestones: [
        {
          id: "testing-kickoff",
          name: "Testing Phase Kickoff",
          description: "Review testing strategy and timeline",
          frequency: "Once",
          method: "Video Call + Test Plan",
        },
        {
          id: "bug-triage",
          name: "Bug Triage Sessions",
          description: "Review and prioritize identified issues",
          frequency: "Every 2 days",
          method: "Video Call + Bug Tracker",
        },
        {
          id: "uat-coordination",
          name: "User Acceptance Testing",
          description: "Coordinate client testing and feedback",
          frequency: "End of phase",
          method: "Guided Testing Session",
        },
      ],
      deliverables: [
        "Test Execution Reports",
        "Bug Reports and Resolutions",
        "Performance Audit Results",
        "Accessibility Compliance Report",
        "Security Testing Report",
        "User Acceptance Test Results",
      ],
      risks: [
        "Critical bugs discovered late",
        "Performance issues under load",
        "Accessibility compliance gaps",
      ],
      tools: [
        "BrowserStack",
        "Lighthouse",
        "axe-core",
        "OWASP ZAP",
        "LoadRunner",
      ],
    },
    {
      id: "launch",
      phase: "05",
      title: "LAUNCH & DEPLOYMENT",
      description: "Deploying to production with monitoring and optimization",
      timeframe: "1 WEEK",
      icon: "🚀",
      details: [
        "Production environment setup and configuration",
        "Domain and SSL certificate configuration",
        "Database migration and data seeding",
        "Monitoring and alerting system setup",
        "SEO optimization and search engine submission",
        "Analytics and tracking implementation",
      ],
      qualityChecks: [
        {
          id: "deployment-success",
          name: "Deployment Success",
          description: "Application successfully deployed to production",
          completed: true,
          critical: true,
        },
        {
          id: "ssl-config",
          name: "SSL Configuration",
          description: "SSL certificate properly configured and tested",
          completed: true,
          critical: true,
        },
        {
          id: "monitoring-setup",
          name: "Monitoring Setup",
          description: "All monitoring and alerting systems active",
          completed: true,
          critical: false,
        },
        {
          id: "seo-optimization",
          name: "SEO Optimization",
          description: "Basic SEO optimization completed",
          completed: false,
          critical: false,
        },
      ],
      communicationMilestones: [
        {
          id: "pre-launch",
          name: "Pre-Launch Review",
          description: "Final review before production deployment",
          frequency: "Once",
          method: "Video Call + Checklist",
        },
        {
          id: "launch-monitoring",
          name: "Launch Monitoring",
          description: "Real-time monitoring during launch",
          frequency: "Launch day",
          method: "Slack + Phone",
        },
        {
          id: "post-launch",
          name: "Post-Launch Review",
          description: "Review launch success and initial metrics",
          frequency: "1 week after",
          method: "Video Call + Analytics",
        },
      ],
      deliverables: [
        "Production Deployment",
        "Domain and SSL Setup",
        "Monitoring Dashboard",
        "Analytics Implementation",
        "SEO Optimization Report",
        "Launch Success Report",
      ],
      risks: [
        "Deployment failures or rollbacks",
        "DNS propagation issues",
        "Performance issues under real load",
      ],
      tools: [
        "Vercel/Netlify",
        "Cloudflare",
        "Google Analytics",
        "Sentry",
        "Uptime Robot",
      ],
    },
    {
      id: "support",
      phase: "06",
      title: "SUPPORT & MAINTENANCE",
      description: "Ongoing support, monitoring, and continuous improvement",
      timeframe: "ONGOING",
      icon: "🛠️",
      details: [
        "24/7 monitoring and incident response",
        "Regular security updates and patches",
        "Performance optimization and scaling",
        "Feature enhancements and improvements",
        "Backup and disaster recovery management",
        "Technical consultation and strategic guidance",
      ],
      qualityChecks: [
        {
          id: "uptime-monitoring",
          name: "Uptime Monitoring",
          description: "99.9% uptime maintained",
          completed: true,
          critical: true,
        },
        {
          id: "security-updates",
          name: "Security Updates",
          description: "All security patches applied within 24 hours",
          completed: true,
          critical: true,
        },
        {
          id: "performance-monitoring",
          name: "Performance Monitoring",
          description: "Performance metrics within acceptable ranges",
          completed: true,
          critical: false,
        },
        {
          id: "backup-verification",
          name: "Backup Verification",
          description: "Regular backup testing and verification",
          completed: true,
          critical: false,
        },
      ],
      communicationMilestones: [
        {
          id: "monthly-reports",
          name: "Monthly Performance Reports",
          description: "Comprehensive performance and usage reports",
          frequency: "Monthly",
          method: "Email + Dashboard",
        },
        {
          id: "quarterly-reviews",
          name: "Quarterly Strategy Reviews",
          description: "Review performance and plan improvements",
          frequency: "Quarterly",
          method: "Video Call + Report",
        },
        {
          id: "incident-response",
          name: "Incident Response",
          description: "Immediate response to critical issues",
          frequency: "As needed",
          method: "Phone + Slack",
        },
      ],
      deliverables: [
        "Monthly Performance Reports",
        "Security Update Logs",
        "Backup Verification Reports",
        "Feature Enhancement Proposals",
        "Incident Response Reports",
        "Strategic Recommendations",
      ],
      risks: [
        "Service outages or downtime",
        "Security vulnerabilities",
        "Performance degradation over time",
      ],
      tools: ["New Relic", "DataDog", "PagerDuty", "GitHub", "Slack", "Jira"],
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "quality", label: "Quality Checks", icon: "✅" },
    { id: "communication", label: "Communication", icon: "💬" },
    { id: "deliverables", label: "Deliverables", icon: "📦" },
    { id: "risks", label: "Risk Management", icon: "⚠️" },
    ...(showMetrics
      ? [{ id: "metrics", label: "Performance Metrics", icon: "📊" }]
      : []),
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const phaseVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      className={cn(
        "py-20 bg-brutalist-light-gray border-t-5 border-black",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-6">
              Enhanced Development Methodology
            </h2>
            <p className="text-lg font-mono font-bold opacity-80 max-w-3xl mx-auto">
              An interactive deep-dive into my comprehensive development process
              with detailed quality assurance, communication standards, and
              project management approach.
            </p>
          </motion.div>

          {/* Progress Overview Toggle */}
          {enableProgressTracking && (
            <div className="mb-8 text-center">
              <button
                onClick={() => setShowProgressOverview(!showProgressOverview)}
                className="px-6 py-3 bg-brutalist-yellow border-3 border-black font-mono font-bold text-sm uppercase tracking-wider hover:bg-yellow-400 transition-colors"
              >
                {showProgressOverview ? "Hide" : "Show"} Process Overview
              </button>
            </div>
          )}

          {/* Process Overview */}
          <AnimatePresence>
            {showProgressOverview && (
              <motion.div
                className="mb-16 p-6 border-3 border-black bg-brutalist-light-gray"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-6 text-center">
                  Development Process Overview
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {processPhases.map((phase, index) => (
                    <div
                      key={phase.id}
                      className="p-4 bg-white border-2 border-black"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="text-2xl">{phase.icon}</div>
                        <div>
                          <div className="font-mono font-bold text-xs uppercase">
                            Phase {phase.phase}
                          </div>
                          <div className="font-mono text-xs">{phase.title}</div>
                        </div>
                      </div>
                      <div className="text-xs font-mono text-gray-600 mb-2">
                        {phase.timeframe}
                      </div>
                      {phase.metrics && (
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-green-600">
                            {phase.metrics.successRate}% success
                          </span>
                          <span className="text-blue-600">
                            {phase.metrics.clientSatisfaction}/5 rating
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Process Flow */}
          <div className="mb-16">
            <h3 className="text-2xl font-black font-mono uppercase tracking-wider mb-8 text-center">
              Interactive Process Flow
            </h3>

            {/* Phase Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {processPhases.map((phase, index) => (
                <motion.button
                  key={phase.id}
                  className={cn(
                    "p-4 border-3 font-mono font-bold text-sm uppercase tracking-wider transition-all duration-300",
                    activePhase === phase.id
                      ? "bg-brutalist-yellow border-black text-black"
                      : "bg-white border-black text-black hover:bg-brutalist-yellow"
                  )}
                  onClick={() =>
                    setActivePhase(activePhase === phase.id ? null : phase.id)
                  }
                  variants={phaseVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-2xl mb-2">{phase.icon}</div>
                  <div className="text-xs mb-1">Phase {phase.phase}</div>
                  <div className="text-xs">{phase.title}</div>
                </motion.button>
              ))}
            </div>

            {/* Phase Details Modal */}
            <AnimatePresence>
              {activePhase && (
                <motion.div
                  className="border-5 border-black bg-white p-8"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {(() => {
                    const phase = processPhases.find(
                      (p) => p.id === activePhase
                    );
                    if (!phase) return null;

                    return (
                      <div>
                        {/* Phase Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="text-4xl">{phase.icon}</div>
                            <div>
                              <h4 className="text-2xl font-black font-mono uppercase tracking-wider">
                                {phase.title}
                              </h4>
                              <p className="font-mono text-gray-600">
                                {phase.description}
                              </p>
                              <div className="inline-block mt-2 px-3 py-1 bg-brutalist-yellow border-2 border-black font-mono font-bold text-xs uppercase">
                                {phase.timeframe}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setActivePhase(null)}
                            className="text-2xl font-bold hover:text-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex flex-wrap gap-2 mb-6 border-b-3 border-black pb-4">
                          {tabs.map((tab) => (
                            <button
                              key={tab.id}
                              className={cn(
                                "px-4 py-2 font-mono font-bold text-sm uppercase tracking-wider border-2 transition-all duration-300",
                                activeTab === tab.id
                                  ? "bg-black text-white border-black"
                                  : "bg-white text-black border-black hover:bg-brutalist-yellow"
                              )}
                              onClick={() => setActiveTab(tab.id)}
                            >
                              <span className="mr-2">{tab.icon}</span>
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        {/* Tab Content */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                          >
                            {activeTab === "overview" && (
                              <div className="space-y-4">
                                <h5 className="text-lg font-black font-mono uppercase tracking-wider mb-4">
                                  Phase Activities
                                </h5>
                                <ul className="space-y-3">
                                  {phase.details.map((detail, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start space-x-3"
                                    >
                                      <div className="w-2 h-2 bg-brutalist-yellow mt-2 flex-shrink-0"></div>
                                      <span className="font-mono text-gray-700">
                                        {detail}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                                <div className="mt-6 p-4 bg-brutalist-light-gray border-2 border-black">
                                  <h6 className="font-mono font-bold text-sm uppercase tracking-wider mb-2">
                                    Tools & Technologies
                                  </h6>
                                  <div className="flex flex-wrap gap-2">
                                    {phase.tools.map((tool, index) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-white border border-black font-mono text-xs"
                                      >
                                        {tool}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeTab === "quality" && (
                              <div className="space-y-4">
                                <h5 className="text-lg font-black font-mono uppercase tracking-wider mb-4">
                                  Quality Assurance Checklist
                                </h5>
                                <div className="space-y-3">
                                  {phase.qualityChecks.map((check) => (
                                    <div
                                      key={check.id}
                                      className={cn(
                                        "p-4 border-2 flex items-start space-x-3",
                                        check.completed
                                          ? "bg-green-50 border-green-500"
                                          : "bg-yellow-50 border-yellow-500"
                                      )}
                                    >
                                      <div className="flex-shrink-0 mt-1">
                                        {check.completed ? (
                                          <div className="w-5 h-5 bg-green-500 border-2 border-green-600 flex items-center justify-center">
                                            <span className="text-white text-xs">
                                              ✓
                                            </span>
                                          </div>
                                        ) : (
                                          <div className="w-5 h-5 bg-yellow-500 border-2 border-yellow-600 flex items-center justify-center">
                                            <span className="text-white text-xs">
                                              ⏳
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                          <h6 className="font-mono font-bold text-sm">
                                            {check.name}
                                          </h6>
                                          {check.critical && (
                                            <span className="px-2 py-1 bg-red-500 text-white font-mono text-xs uppercase">
                                              Critical
                                            </span>
                                          )}
                                        </div>
                                        <p className="font-mono text-sm text-gray-600 mt-1">
                                          {check.description}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {activeTab === "communication" && (
                              <div className="space-y-4">
                                <h5 className="text-lg font-black font-mono uppercase tracking-wider mb-4">
                                  Communication Standards
                                </h5>
                                <div className="space-y-4">
                                  {phase.communicationMilestones.map(
                                    (milestone) => (
                                      <div
                                        key={milestone.id}
                                        className="p-4 border-2 border-black bg-white"
                                      >
                                        <div className="flex items-start justify-between mb-2">
                                          <h6 className="font-mono font-bold text-sm uppercase tracking-wider">
                                            {milestone.name}
                                          </h6>
                                          <div className="flex space-x-2">
                                            <span className="px-2 py-1 bg-brutalist-yellow border border-black font-mono text-xs">
                                              {milestone.frequency}
                                            </span>
                                            <span className="px-2 py-1 bg-brutalist-light-gray border border-black font-mono text-xs">
                                              {milestone.method}
                                            </span>
                                          </div>
                                        </div>
                                        <p className="font-mono text-sm text-gray-600 mb-3">
                                          {milestone.description}
                                        </p>
                                        {milestone.example && (
                                          <div className="mt-3 p-3 bg-brutalist-light-gray border border-gray-300">
                                            <div className="font-mono font-bold text-xs uppercase tracking-wider text-gray-700 mb-2">
                                              Example
                                            </div>
                                            <p className="font-mono text-xs text-gray-600">
                                              {milestone.example}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {activeTab === "deliverables" && (
                              <div className="space-y-4">
                                <h5 className="text-lg font-black font-mono uppercase tracking-wider mb-4">
                                  Phase Deliverables
                                </h5>
                                <div className="grid md:grid-cols-2 gap-4">
                                  {phase.deliverables.map(
                                    (deliverable, index) => (
                                      <div
                                        key={index}
                                        className="p-4 border-2 border-black bg-white flex items-center space-x-3"
                                      >
                                        <div className="w-6 h-6 bg-brutalist-yellow border-2 border-black flex items-center justify-center flex-shrink-0">
                                          <span className="font-mono font-bold text-xs">
                                            📄
                                          </span>
                                        </div>
                                        <span className="font-mono text-sm">
                                          {deliverable}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {activeTab === "risks" && (
                              <div className="space-y-4">
                                <h5 className="text-lg font-black font-mono uppercase tracking-wider mb-4">
                                  Risk Management
                                </h5>
                                <div className="space-y-3">
                                  {phase.risks.map((risk, index) => (
                                    <div
                                      key={index}
                                      className="p-4 border-2 border-red-500 bg-red-50 flex items-start space-x-3"
                                    >
                                      <div className="w-6 h-6 bg-red-500 border-2 border-red-600 flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-white text-xs">
                                          ⚠️
                                        </span>
                                      </div>
                                      <div className="flex-1">
                                        <span className="font-mono text-sm text-red-800">
                                          {risk}
                                        </span>
                                        <div className="mt-2 text-xs font-mono text-red-600">
                                          Mitigation strategies are implemented
                                          and monitored throughout the phase.
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {activeTab === "metrics" && phase.metrics && (
                              <div className="space-y-6">
                                <h5 className="text-lg font-black font-mono uppercase tracking-wider mb-4">
                                  Performance Metrics & Success Factors
                                </h5>

                                {/* Key Metrics Grid */}
                                <div className="grid md:grid-cols-3 gap-4 mb-6">
                                  <div className="p-4 border-2 border-black bg-green-50">
                                    <div className="text-center">
                                      <div className="text-2xl font-black font-mono text-green-600 mb-2">
                                        {phase.metrics.successRate}%
                                      </div>
                                      <div className="font-mono text-xs uppercase tracking-wider">
                                        Success Rate
                                      </div>
                                    </div>
                                  </div>
                                  <div className="p-4 border-2 border-black bg-blue-50">
                                    <div className="text-center">
                                      <div className="text-lg font-black font-mono text-blue-600 mb-2">
                                        {phase.metrics.averageDuration}
                                      </div>
                                      <div className="font-mono text-xs uppercase tracking-wider">
                                        Avg Duration
                                      </div>
                                    </div>
                                  </div>
                                  <div className="p-4 border-2 border-black bg-yellow-50">
                                    <div className="text-center">
                                      <div className="text-2xl font-black font-mono text-yellow-600 mb-2">
                                        {phase.metrics.clientSatisfaction}/5
                                      </div>
                                      <div className="font-mono text-xs uppercase tracking-wider">
                                        Client Rating
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Success Factors */}
                                {phase.keySuccessFactors && (
                                  <div className="mb-6">
                                    <h6 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">
                                      Key Success Factors
                                    </h6>
                                    <div className="space-y-2">
                                      {phase.keySuccessFactors.map(
                                        (factor, index) => (
                                          <div
                                            key={index}
                                            className="flex items-start space-x-3"
                                          >
                                            <div className="w-2 h-2 bg-green-500 mt-2 flex-shrink-0"></div>
                                            <span className="font-mono text-sm text-gray-700">
                                              {factor}
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Common Challenges */}
                                <div>
                                  <h6 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">
                                    Common Challenges
                                  </h6>
                                  <div className="space-y-2">
                                    {phase.metrics.commonChallenges.map(
                                      (challenge, index) => (
                                        <div
                                          key={index}
                                          className="flex items-start space-x-3"
                                        >
                                          <div className="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0"></div>
                                          <span className="font-mono text-sm text-gray-700">
                                            {challenge}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Project Management Approach Visualization */}
          <div className="mt-16 p-8 bg-brutalist-black border-3 border-brutalist-yellow">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-black font-mono uppercase tracking-wider text-white mb-4">
                Project Management Approach
              </h3>
              <p className="font-mono text-brutalist-gray">
                How I ensure projects stay on track, on budget, and exceed
                expectations
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Agile Methodology",
                  description:
                    "2-week sprints with continuous feedback and adaptation",
                  icon: "🔄",
                  features: [
                    "Sprint Planning",
                    "Daily Standups",
                    "Sprint Reviews",
                    "Retrospectives",
                  ],
                },
                {
                  title: "Risk Management",
                  description:
                    "Proactive identification and mitigation of project risks",
                  icon: "🛡️",
                  features: [
                    "Risk Assessment",
                    "Mitigation Plans",
                    "Contingency Planning",
                    "Regular Reviews",
                  ],
                },
                {
                  title: "Quality Assurance",
                  description:
                    "Multi-layered testing and quality control processes",
                  icon: "✅",
                  features: [
                    "Code Reviews",
                    "Automated Testing",
                    "Manual Testing",
                    "Performance Audits",
                  ],
                },
                {
                  title: "Communication",
                  description:
                    "Transparent, regular, and structured communication",
                  icon: "💬",
                  features: [
                    "Progress Reports",
                    "Client Meetings",
                    "Documentation",
                    "Issue Tracking",
                  ],
                },
              ].map((approach, index) => (
                <div
                  key={index}
                  className="p-6 bg-white border-2 border-brutalist-yellow"
                >
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">{approach.icon}</div>
                    <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-2">
                      {approach.title}
                    </h4>
                    <p className="font-mono text-xs text-gray-600">
                      {approach.description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {approach.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center space-x-2"
                      >
                        <div className="w-2 h-2 bg-brutalist-yellow"></div>
                        <span className="font-mono text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedMethodologySection;
