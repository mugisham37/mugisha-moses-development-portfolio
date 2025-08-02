"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProcessStep } from "@/types/enhanced";

interface ProcessVisualizationTimelineProps {
  className?: string;
}

interface QualityCheckpoint {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  status: "pending" | "in-progress" | "completed" | "failed";
}

interface CommunicationMilestone {
  id: string;
  title: string;
  description: string;
  type: "kickoff" | "review" | "approval" | "delivery" | "feedback";
  participants: string[];
  deliverables: string[];
  example?: string;
}

interface RiskAssessment {
  id: string;
  risk: string;
  probability: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  mitigation: string;
  contingency: string;
}

interface EnhancedProcessStep extends ProcessStep {
  qualityCheckpoints: QualityCheckpoint[];
  communicationMilestones: CommunicationMilestone[];
  riskAssessments: RiskAssessment[];
  keyMetrics: string[];
  tools: string[];
  expanded?: boolean;
}

const ProcessVisualizationTimeline: React.FC<
  ProcessVisualizationTimelineProps
> = ({ className }) => {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "quality" | "communication" | "risks"
  >("overview");

  const processSteps: EnhancedProcessStep[] = [
    {
      id: "discovery",
      name: "Discovery & Planning",
      description:
        "Deep dive into project requirements, goals, and technical specifications",
      duration: "1-2 weeks",
      deliverables: [
        "Project Requirements Document",
        "Technical Specification",
        "Project Timeline",
        "Risk Assessment Report",
        "Stakeholder Analysis",
      ],
      clientInvolvement: "high",
      order: 1,
      optional: false,
      qualityCheckpoints: [
        {
          id: "req-validation",
          name: "Requirements Validation",
          description:
            "Ensure all requirements are clear, complete, and testable",
          criteria: [
            "All functional requirements documented",
            "Non-functional requirements specified",
            "Acceptance criteria defined",
            "Stakeholder sign-off obtained",
          ],
          status: "completed",
        },
        {
          id: "tech-feasibility",
          name: "Technical Feasibility Review",
          description:
            "Validate technical approach and identify potential challenges",
          criteria: [
            "Technology stack validated",
            "Architecture reviewed",
            "Performance requirements assessed",
            "Integration points identified",
          ],
          status: "completed",
        },
      ],
      communicationMilestones: [
        {
          id: "project-kickoff",
          title: "Project Kickoff Meeting",
          description:
            "Initial meeting to align on project vision and expectations",
          type: "kickoff",
          participants: ["Client", "Project Manager", "Technical Lead"],
          deliverables: ["Meeting Minutes", "Project Charter"],
          example:
            "90-minute session covering project goals, timeline, and communication protocols",
        },
        {
          id: "requirements-review",
          title: "Requirements Review Session",
          description: "Detailed walkthrough of documented requirements",
          type: "review",
          participants: ["Client", "Business Analyst", "Technical Lead"],
          deliverables: [
            "Approved Requirements Document",
            "Change Request Process",
          ],
          example: "Interactive session using wireframes and user stories",
        },
      ],
      riskAssessments: [
        {
          id: "scope-creep",
          risk: "Scope creep during discovery phase",
          probability: "medium",
          impact: "medium",
          mitigation:
            "Clear change request process and regular stakeholder communication",
          contingency: "Time-boxed discovery phase with defined deliverables",
        },
        {
          id: "unclear-requirements",
          risk: "Ambiguous or incomplete requirements",
          probability: "medium",
          impact: "high",
          mitigation:
            "Structured requirements gathering with prototypes and examples",
          contingency:
            "Iterative requirement refinement with client feedback loops",
        },
      ],
      keyMetrics: [
        "Requirements completeness score",
        "Stakeholder satisfaction rating",
        "Technical feasibility confidence level",
      ],
      tools: ["Figma", "Notion", "Miro", "Slack"],
    },
    {
      id: "design-architecture",
      name: "Design & Architecture",
      description:
        "Create detailed system architecture and user experience design",
      duration: "1-3 weeks",
      deliverables: [
        "System Architecture Document",
        "Database Design",
        "API Specifications",
        "UI/UX Wireframes",
        "Technical Design Review",
      ],
      clientInvolvement: "medium",
      order: 2,
      optional: false,
      qualityCheckpoints: [
        {
          id: "architecture-review",
          name: "Architecture Review",
          description:
            "Comprehensive review of system architecture and design decisions",
          criteria: [
            "Scalability requirements addressed",
            "Security considerations documented",
            "Performance optimization planned",
            "Technology choices justified",
          ],
          status: "in-progress",
        },
        {
          id: "design-approval",
          name: "Design Approval",
          description: "Client approval of UI/UX designs and user flows",
          criteria: [
            "All user journeys mapped",
            "Responsive design confirmed",
            "Accessibility standards met",
            "Brand guidelines followed",
          ],
          status: "pending",
        },
      ],
      communicationMilestones: [
        {
          id: "architecture-presentation",
          title: "Architecture Presentation",
          description:
            "Present system architecture and technical decisions to stakeholders",
          type: "review",
          participants: ["Client", "Technical Team", "Stakeholders"],
          deliverables: ["Architecture Diagrams", "Technical Decision Log"],
          example:
            "Technical presentation with interactive diagrams and Q&A session",
        },
        {
          id: "design-walkthrough",
          title: "Design Walkthrough",
          description: "Interactive review of UI/UX designs and user flows",
          type: "review",
          participants: ["Client", "Design Team", "Product Owner"],
          deliverables: ["Approved Designs", "Design System Guidelines"],
          example:
            "Clickable prototype demonstration with user journey mapping",
        },
      ],
      riskAssessments: [
        {
          id: "design-changes",
          risk: "Major design changes after approval",
          probability: "low",
          impact: "high",
          mitigation:
            "Thorough design review process with multiple stakeholder touchpoints",
          contingency:
            "Design change impact assessment and timeline adjustment",
        },
        {
          id: "technical-complexity",
          risk: "Underestimated technical complexity",
          probability: "medium",
          impact: "medium",
          mitigation: "Proof of concept development for complex features",
          contingency: "Alternative technical approaches and timeline buffer",
        },
      ],
      keyMetrics: [
        "Design approval rate",
        "Architecture review score",
        "Technical debt assessment",
      ],
      tools: ["Figma", "Lucidchart", "Postman", "Draw.io"],
    },
    {
      id: "development",
      name: "Development & Implementation",
      description:
        "Agile development with regular testing and quality assurance",
      duration: "4-12 weeks",
      deliverables: [
        "Working Software Increments",
        "Test Coverage Reports",
        "Code Documentation",
        "Performance Benchmarks",
        "Security Audit Results",
      ],
      clientInvolvement: "medium",
      order: 3,
      optional: false,
      qualityCheckpoints: [
        {
          id: "code-quality",
          name: "Code Quality Review",
          description: "Automated and manual code quality assessments",
          criteria: [
            "Code coverage > 80%",
            "No critical security vulnerabilities",
            "Performance benchmarks met",
            "Code style guidelines followed",
          ],
          status: "in-progress",
        },
        {
          id: "feature-testing",
          name: "Feature Testing",
          description: "Comprehensive testing of implemented features",
          criteria: [
            "All acceptance criteria met",
            "Cross-browser compatibility verified",
            "Mobile responsiveness confirmed",
            "Accessibility standards validated",
          ],
          status: "pending",
        },
      ],
      communicationMilestones: [
        {
          id: "sprint-reviews",
          title: "Sprint Review Meetings",
          description:
            "Regular demonstrations of completed features and progress updates",
          type: "review",
          participants: ["Client", "Development Team", "Product Owner"],
          deliverables: ["Demo Recordings", "Sprint Reports", "Feedback Log"],
          example:
            "Bi-weekly 60-minute sessions with live feature demonstrations",
        },
        {
          id: "milestone-delivery",
          title: "Milestone Delivery",
          description: "Formal delivery of major project milestones",
          type: "delivery",
          participants: ["Client", "Project Manager", "QA Team"],
          deliverables: [
            "Release Notes",
            "Testing Reports",
            "Deployment Guide",
          ],
          example:
            "Staged deployment with comprehensive testing and rollback procedures",
        },
      ],
      riskAssessments: [
        {
          id: "technical-blockers",
          risk: "Technical blockers or integration issues",
          probability: "medium",
          impact: "medium",
          mitigation:
            "Early integration testing and proof of concept development",
          contingency:
            "Alternative implementation approaches and expert consultation",
        },
        {
          id: "performance-issues",
          risk: "Performance degradation under load",
          probability: "low",
          impact: "high",
          mitigation:
            "Regular performance testing and optimization throughout development",
          contingency:
            "Performance optimization sprint and infrastructure scaling",
        },
      ],
      keyMetrics: [
        "Code coverage percentage",
        "Bug detection rate",
        "Feature completion velocity",
        "Performance benchmark scores",
      ],
      tools: ["VS Code", "Git", "Jest", "Cypress", "Lighthouse"],
    },
    {
      id: "testing-qa",
      name: "Testing & Quality Assurance",
      description: "Comprehensive testing across all devices and scenarios",
      duration: "1-2 weeks",
      deliverables: [
        "Test Plan Document",
        "Automated Test Suite",
        "Bug Reports & Fixes",
        "Performance Test Results",
        "User Acceptance Testing",
      ],
      clientInvolvement: "high",
      order: 4,
      optional: false,
      qualityCheckpoints: [
        {
          id: "comprehensive-testing",
          name: "Comprehensive Testing",
          description: "Full system testing across all scenarios and devices",
          criteria: [
            "All test cases executed",
            "Critical bugs resolved",
            "Performance requirements met",
            "Security vulnerabilities addressed",
          ],
          status: "pending",
        },
        {
          id: "user-acceptance",
          name: "User Acceptance Testing",
          description:
            "Client validation of system functionality and usability",
          criteria: [
            "All user stories validated",
            "Business requirements confirmed",
            "Usability standards met",
            "Client sign-off obtained",
          ],
          status: "pending",
        },
      ],
      communicationMilestones: [
        {
          id: "testing-kickoff",
          title: "Testing Phase Kickoff",
          description:
            "Initiate comprehensive testing phase with client involvement",
          type: "kickoff",
          participants: ["Client", "QA Team", "Development Team"],
          deliverables: [
            "Testing Schedule",
            "UAT Guidelines",
            "Bug Reporting Process",
          ],
          example:
            "Testing environment setup and client training on UAT procedures",
        },
        {
          id: "uat-review",
          title: "User Acceptance Testing Review",
          description: "Review UAT results and address any identified issues",
          type: "review",
          participants: ["Client", "QA Team", "Project Manager"],
          deliverables: [
            "UAT Report",
            "Issue Resolution Plan",
            "Go-Live Approval",
          ],
          example:
            "Detailed review of testing results with issue prioritization",
        },
      ],
      riskAssessments: [
        {
          id: "critical-bugs",
          risk: "Discovery of critical bugs during final testing",
          probability: "low",
          impact: "high",
          mitigation: "Continuous testing throughout development and early UAT",
          contingency: "Emergency bug fix procedures and timeline adjustment",
        },
        {
          id: "client-rejection",
          risk: "Client rejection during user acceptance testing",
          probability: "low",
          impact: "high",
          mitigation:
            "Regular client involvement and incremental approval process",
          contingency: "Rapid iteration and requirement clarification process",
        },
      ],
      keyMetrics: [
        "Test coverage percentage",
        "Bug resolution rate",
        "Client satisfaction score",
        "Performance test results",
      ],
      tools: ["Selenium", "Jest", "Cypress", "BrowserStack", "Postman"],
    },
    {
      id: "deployment-launch",
      name: "Deployment & Launch",
      description: "Production deployment with monitoring and optimization",
      duration: "1 week",
      deliverables: [
        "Production Deployment",
        "Monitoring Setup",
        "Documentation Package",
        "Training Materials",
        "Support Handover",
      ],
      clientInvolvement: "medium",
      order: 5,
      optional: false,
      qualityCheckpoints: [
        {
          id: "deployment-verification",
          name: "Deployment Verification",
          description:
            "Verify successful production deployment and functionality",
          criteria: [
            "All services running correctly",
            "Database migrations successful",
            "SSL certificates configured",
            "Monitoring systems active",
          ],
          status: "pending",
        },
        {
          id: "performance-validation",
          name: "Performance Validation",
          description: "Validate production performance meets requirements",
          criteria: [
            "Load testing completed",
            "Response times within limits",
            "Error rates acceptable",
            "Scalability confirmed",
          ],
          status: "pending",
        },
      ],
      communicationMilestones: [
        {
          id: "go-live-meeting",
          title: "Go-Live Meeting",
          description: "Final coordination meeting before production launch",
          type: "approval",
          participants: ["Client", "DevOps Team", "Project Manager"],
          deliverables: [
            "Go-Live Checklist",
            "Rollback Plan",
            "Support Contacts",
          ],
          example:
            "Pre-launch checklist review and emergency contact procedures",
        },
        {
          id: "launch-announcement",
          title: "Launch Announcement",
          description: "Official project launch and handover to client",
          type: "delivery",
          participants: ["Client", "Project Team", "Stakeholders"],
          deliverables: [
            "Launch Report",
            "Documentation Package",
            "Training Schedule",
          ],
          example:
            "Celebration meeting with project retrospective and future planning",
        },
      ],
      riskAssessments: [
        {
          id: "deployment-failure",
          risk: "Production deployment failure or rollback",
          probability: "low",
          impact: "high",
          mitigation:
            "Comprehensive deployment testing and rollback procedures",
          contingency:
            "Immediate rollback capability and emergency support team",
        },
        {
          id: "performance-degradation",
          risk: "Production performance issues under real load",
          probability: "medium",
          impact: "medium",
          mitigation: "Load testing and performance monitoring setup",
          contingency:
            "Performance optimization team and infrastructure scaling",
        },
      ],
      keyMetrics: [
        "Deployment success rate",
        "System uptime percentage",
        "Performance benchmark scores",
        "Client satisfaction rating",
      ],
      tools: ["Docker", "AWS/Vercel", "New Relic", "Sentry", "GitHub Actions"],
    },
  ];

  const handlePhaseToggle = useCallback(
    (phaseId: string) => {
      setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
      setActiveTab("overview");
    },
    [expandedPhase]
  );

  const getRiskColor = (probability: string, impact: string) => {
    const riskLevel =
      probability === "high" || impact === "high"
        ? "high"
        : probability === "medium" || impact === "medium"
        ? "medium"
        : "low";

    switch (riskLevel) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "in-progress":
        return "text-blue-600 bg-blue-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <section className={cn("py-20 bg-brutalist-light-gray", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-6">
            Interactive Process Timeline
          </h2>
          <p className="text-lg font-mono font-bold opacity-80 max-w-3xl mx-auto">
            Explore our comprehensive development process with detailed phase
            breakdowns, quality checkpoints, and risk assessments.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Timeline Container */}
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-brutalist-yellow transform -translate-x-1/2" />

            {/* Process Steps */}
            <div className="space-y-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className="relative"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                    <motion.button
                      className="w-16 h-16 bg-brutalist-yellow border-4 border-brutalist-black flex items-center justify-center font-mono font-black text-lg hover:scale-110 transition-transform"
                      onClick={() => handlePhaseToggle(step.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {step.order}
                    </motion.button>
                  </div>

                  {/* Content Card */}
                  <div
                    className={cn(
                      "ml-20 md:ml-0",
                      index % 2 === 0
                        ? "md:mr-auto md:w-5/12 md:pr-12"
                        : "md:ml-auto md:w-5/12 md:pl-12"
                    )}
                  >
                    <div
                      className="border-5 border-brutalist-black bg-white p-6 hover:bg-brutalist-yellow transition-colors duration-300 cursor-pointer"
                      onClick={() => handlePhaseToggle(step.id)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-black font-mono uppercase tracking-wider">
                          {step.name}
                        </h3>
                        <div className="text-sm font-mono font-bold bg-brutalist-black text-white px-2 py-1">
                          {step.duration}
                        </div>
                      </div>

                      <p className="font-mono text-sm mb-4 leading-relaxed">
                        {step.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="text-xs font-mono bg-brutalist-light-gray px-2 py-1 border border-brutalist-black">
                          {step.deliverables.length} Deliverables
                        </div>
                        <div className="text-xs font-mono bg-brutalist-light-gray px-2 py-1 border border-brutalist-black">
                          {step.qualityCheckpoints.length} Quality Checks
                        </div>
                        <div className="text-xs font-mono bg-brutalist-light-gray px-2 py-1 border border-brutalist-black">
                          {step.riskAssessments.length} Risk Factors
                        </div>
                      </div>

                      <div className="text-xs font-mono text-brutalist-black opacity-70">
                        Click to expand details →
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {expandedPhase === step.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-5 border-t-0 border-brutalist-black bg-brutalist-black text-white overflow-hidden"
                        >
                          {/* Tab Navigation */}
                          <div className="flex border-b-2 border-brutalist-yellow">
                            {[
                              { id: "overview", label: "Overview" },
                              { id: "quality", label: "Quality Checks" },
                              { id: "communication", label: "Communication" },
                              { id: "risks", label: "Risk Assessment" },
                            ].map((tab) => (
                              <button
                                key={tab.id}
                                className={cn(
                                  "px-4 py-3 font-mono font-bold text-sm uppercase tracking-wider transition-colors",
                                  activeTab === tab.id
                                    ? "bg-brutalist-yellow text-brutalist-black"
                                    : "text-brutalist-gray hover:text-white"
                                )}
                                onClick={() =>
                                  setActiveTab(
                                    tab.id as
                                      | "overview"
                                      | "quality"
                                      | "communication"
                                      | "risks"
                                  )
                                }
                              >
                                {tab.label}
                              </button>
                            ))}
                          </div>

                          <div className="p-6">
                            {/* Overview Tab */}
                            {activeTab === "overview" && (
                              <div className="space-y-6">
                                <div>
                                  <h4 className="font-mono font-bold text-brutalist-yellow mb-3 uppercase tracking-wider">
                                    Key Deliverables
                                  </h4>
                                  <ul className="space-y-2">
                                    {step.deliverables.map(
                                      (deliverable, idx) => (
                                        <li
                                          key={idx}
                                          className="font-mono text-sm flex items-start"
                                        >
                                          <span className="text-brutalist-yellow mr-3">
                                            •
                                          </span>
                                          {deliverable}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>

                                <div>
                                  <h4 className="font-mono font-bold text-brutalist-yellow mb-3 uppercase tracking-wider">
                                    Key Metrics
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {step.keyMetrics.map((metric, idx) => (
                                      <div
                                        key={idx}
                                        className="bg-brutalist-light-gray text-brutalist-black p-3 border-2 border-brutalist-yellow"
                                      >
                                        <span className="font-mono text-sm">
                                          {metric}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-mono font-bold text-brutalist-yellow mb-3 uppercase tracking-wider">
                                    Tools & Technologies
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {step.tools.map((tool, idx) => (
                                      <span
                                        key={idx}
                                        className="bg-brutalist-yellow text-brutalist-black px-3 py-1 font-mono text-sm font-bold"
                                      >
                                        {tool}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Quality Checks Tab */}
                            {activeTab === "quality" && (
                              <div className="space-y-6">
                                {step.qualityCheckpoints.map((checkpoint) => (
                                  <div
                                    key={checkpoint.id}
                                    className="border-2 border-brutalist-yellow p-4"
                                  >
                                    <div className="flex justify-between items-start mb-3">
                                      <h4 className="font-mono font-bold text-brutalist-yellow uppercase tracking-wider">
                                        {checkpoint.name}
                                      </h4>
                                      <span
                                        className={cn(
                                          "px-2 py-1 text-xs font-mono font-bold uppercase tracking-wider",
                                          getStatusColor(checkpoint.status)
                                        )}
                                      >
                                        {checkpoint.status}
                                      </span>
                                    </div>
                                    <p className="font-mono text-sm text-brutalist-gray mb-4">
                                      {checkpoint.description}
                                    </p>
                                    <div>
                                      <h5 className="font-mono font-bold text-white mb-2 text-sm uppercase">
                                        Success Criteria:
                                      </h5>
                                      <ul className="space-y-1">
                                        {checkpoint.criteria.map(
                                          (criterion, idx) => (
                                            <li
                                              key={idx}
                                              className="font-mono text-sm text-brutalist-gray flex items-start"
                                            >
                                              <span className="text-brutalist-yellow mr-3">
                                                ✓
                                              </span>
                                              {criterion}
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Communication Tab */}
                            {activeTab === "communication" && (
                              <div className="space-y-6">
                                {step.communicationMilestones.map(
                                  (milestone) => (
                                    <div
                                      key={milestone.id}
                                      className="border-2 border-brutalist-yellow p-4"
                                    >
                                      <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-mono font-bold text-brutalist-yellow uppercase tracking-wider">
                                          {milestone.title}
                                        </h4>
                                        <span className="bg-brutalist-yellow text-brutalist-black px-2 py-1 text-xs font-mono font-bold uppercase">
                                          {milestone.type}
                                        </span>
                                      </div>
                                      <p className="font-mono text-sm text-brutalist-gray mb-4">
                                        {milestone.description}
                                      </p>

                                      <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                          <h5 className="font-mono font-bold text-white mb-2 text-sm uppercase">
                                            Participants:
                                          </h5>
                                          <ul className="space-y-1">
                                            {milestone.participants.map(
                                              (participant, idx) => (
                                                <li
                                                  key={idx}
                                                  className="font-mono text-sm text-brutalist-gray"
                                                >
                                                  • {participant}
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        </div>

                                        <div>
                                          <h5 className="font-mono font-bold text-white mb-2 text-sm uppercase">
                                            Deliverables:
                                          </h5>
                                          <ul className="space-y-1">
                                            {milestone.deliverables.map(
                                              (deliverable, idx) => (
                                                <li
                                                  key={idx}
                                                  className="font-mono text-sm text-brutalist-gray"
                                                >
                                                  • {deliverable}
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        </div>
                                      </div>

                                      {milestone.example && (
                                        <div className="mt-4 p-3 bg-brutalist-light-gray text-brutalist-black border-l-4 border-brutalist-yellow">
                                          <h5 className="font-mono font-bold text-sm uppercase mb-2">
                                            Example:
                                          </h5>
                                          <p className="font-mono text-sm">
                                            {milestone.example}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            )}

                            {/* Risk Assessment Tab */}
                            {activeTab === "risks" && (
                              <div className="space-y-6">
                                {step.riskAssessments.map((risk) => (
                                  <div
                                    key={risk.id}
                                    className="border-2 border-brutalist-yellow p-4"
                                  >
                                    <div className="flex justify-between items-start mb-3">
                                      <h4 className="font-mono font-bold text-brutalist-yellow uppercase tracking-wider">
                                        {risk.risk}
                                      </h4>
                                      <div className="flex gap-2">
                                        <span
                                          className={cn(
                                            "px-2 py-1 text-xs font-mono font-bold uppercase border",
                                            getRiskColor(risk.probability, "")
                                          )}
                                        >
                                          {risk.probability} probability
                                        </span>
                                        <span
                                          className={cn(
                                            "px-2 py-1 text-xs font-mono font-bold uppercase border",
                                            getRiskColor("", risk.impact)
                                          )}
                                        >
                                          {risk.impact} impact
                                        </span>
                                      </div>
                                    </div>

                                    <div className="space-y-4">
                                      <div>
                                        <h5 className="font-mono font-bold text-white mb-2 text-sm uppercase">
                                          Mitigation Strategy:
                                        </h5>
                                        <p className="font-mono text-sm text-brutalist-gray">
                                          {risk.mitigation}
                                        </p>
                                      </div>

                                      <div>
                                        <h5 className="font-mono font-bold text-white mb-2 text-sm uppercase">
                                          Contingency Plan:
                                        </h5>
                                        <p className="font-mono text-sm text-brutalist-gray">
                                          {risk.contingency}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Process Summary */}
        <motion.div
          className="mt-20 text-center border-t-5 border-brutalist-black pt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-mono font-black text-2xl md:text-3xl uppercase tracking-tight mb-6">
            Process Highlights
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-mono font-black text-brutalist-yellow mb-2">
                {processSteps.reduce(
                  (acc, step) => acc + step.qualityCheckpoints.length,
                  0
                )}
              </div>
              <div className="text-sm font-mono uppercase tracking-wider">
                Quality Checkpoints
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-mono font-black text-brutalist-yellow mb-2">
                {processSteps.reduce(
                  (acc, step) => acc + step.communicationMilestones.length,
                  0
                )}
              </div>
              <div className="text-sm font-mono uppercase tracking-wider">
                Communication Points
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-mono font-black text-brutalist-yellow mb-2">
                {processSteps.reduce(
                  (acc, step) => acc + step.riskAssessments.length,
                  0
                )}
              </div>
              <div className="text-sm font-mono uppercase tracking-wider">
                Risk Assessments
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-mono font-black text-brutalist-yellow mb-2">
                {processSteps.reduce(
                  (acc, step) => acc + step.deliverables.length,
                  0
                )}
              </div>
              <div className="text-sm font-mono uppercase tracking-wider">
                Total Deliverables
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessVisualizationTimeline;
