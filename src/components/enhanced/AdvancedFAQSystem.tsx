"use client";

import React, { useState, useMemo, useEffect } from "react";
import { FAQ } from "@/types/enhanced";
import { EnhancedInput } from "./EnhancedInput";
import { EnhancedButton } from "./EnhancedButton";

// FAQ data with comprehensive categories and content
const faqData: FAQ[] = [
  // General Questions
  {
    id: "general-1",
    question: "What technologies do you specialize in?",
    answer:
      "I specialize in modern web technologies including React, Next.js, TypeScript, Node.js, and various databases. I stay current with the latest frameworks and best practices to deliver cutting-edge solutions. My expertise spans frontend frameworks like React and Vue.js, backend technologies including Node.js and Python, cloud platforms like AWS and Vercel, and modern development tools and practices.",
    category: "General",
    helpful: 45,
    tags: ["technologies", "expertise", "skills"],
    relatedQuestions: ["general-2", "technical-1", "services-1"],
  },
  {
    id: "general-2",
    question: "How long does a typical project take?",
    answer:
      "Project timelines vary based on complexity and scope. Simple React applications typically take 2-4 weeks, e-commerce platforms require 4-8 weeks, and complex SaaS solutions need 8-16 weeks. During our initial consultation, I provide detailed timelines with milestones and deliverables. I always build in buffer time for revisions and unexpected challenges to ensure quality delivery.",
    category: "General",
    helpful: 38,
    tags: ["timeline", "duration", "planning"],
    relatedQuestions: ["pricing-2", "process-1", "services-2"],
  },
  {
    id: "general-3",
    question: "Do you work with clients worldwide?",
    answer:
      "Yes, I work with clients globally across different time zones. I have experience collaborating with teams in North America, Europe, Asia, and Australia. I use modern communication tools like Slack, Zoom, and project management platforms to ensure smooth collaboration regardless of location. I'm flexible with meeting times and maintain clear communication throughout the project.",
    category: "General",
    helpful: 32,
    tags: ["global", "remote", "timezone"],
    relatedQuestions: ["communication-1", "process-2"],
  },

  // Pricing Questions
  {
    id: "pricing-1",
    question: "What is your payment structure?",
    answer:
      "I typically work with a 50% upfront payment and 50% upon completion for smaller projects under $5,000. Larger projects are broken into milestones with payments tied to specific deliverables (usually 3-4 payments). All pricing is transparent with detailed quotes and no hidden fees. I accept payments via bank transfer, PayPal, or Stripe, and provide detailed invoices for all transactions.",
    category: "Pricing",
    helpful: 52,
    tags: ["payment", "structure", "invoicing"],
    relatedQuestions: ["pricing-2", "pricing-3", "general-2"],
  },
  {
    id: "pricing-2",
    question: "How do you calculate project costs?",
    answer:
      "Project costs are calculated based on several factors: project complexity, required features, timeline, technology stack, and ongoing support needs. I provide fixed-price quotes for most projects after a thorough discovery phase. For ongoing work or projects with evolving requirements, I offer hourly rates with detailed time tracking. I always provide a detailed breakdown of costs and explain the value behind each component.",
    category: "Pricing",
    helpful: 41,
    tags: ["cost", "calculation", "quote"],
    relatedQuestions: ["pricing-1", "services-3", "process-1"],
  },
  {
    id: "pricing-3",
    question: "Do you offer payment plans or financing?",
    answer:
      "Yes, I offer flexible payment plans for larger projects. We can structure payments around project milestones, monthly installments, or custom schedules that work for your cash flow. For established businesses, I also offer net-30 payment terms. I'm always willing to discuss payment options that make sense for both parties while ensuring project momentum.",
    category: "Pricing",
    helpful: 28,
    tags: ["payment plans", "financing", "flexibility"],
    relatedQuestions: ["pricing-1", "pricing-2"],
  },

  // Technical Questions
  {
    id: "technical-1",
    question: "Can you work with existing codebases?",
    answer:
      "Absolutely! I frequently work with existing applications for bug fixes, feature additions, performance optimization, and modernization. I start with a comprehensive code audit to understand the architecture, identify potential issues, and recommend improvements. Whether it's legacy jQuery code that needs React migration or a modern app requiring new features, I can work with your existing codebase effectively.",
    category: "Technical",
    helpful: 36,
    tags: ["existing code", "legacy", "migration"],
    relatedQuestions: ["technical-2", "services-4", "general-1"],
  },
  {
    id: "technical-2",
    question: "How do you ensure code quality and security?",
    answer:
      "Code quality and security are paramount in my development process. I follow industry best practices including comprehensive testing (unit, integration, and end-to-end), code reviews, security audits, and performance optimization. I use tools like ESLint, Prettier, SonarQube for code quality, and implement security measures like input validation, authentication, authorization, and data encryption. All code is version-controlled with Git and includes comprehensive documentation.",
    category: "Technical",
    helpful: 44,
    tags: ["quality", "security", "testing"],
    relatedQuestions: ["technical-3", "process-3", "support-2"],
  },
  {
    id: "technical-3",
    question: "What hosting and deployment options do you recommend?",
    answer:
      "I recommend hosting solutions based on your specific needs and budget. For static sites and React apps, Vercel and Netlify offer excellent performance and ease of use. For full-stack applications, I often use AWS, Google Cloud, or DigitalOcean. I handle the complete deployment process including domain setup, SSL certificates, CI/CD pipelines, and monitoring. I also provide guidance on scaling and maintenance post-launch.",
    category: "Technical",
    helpful: 33,
    tags: ["hosting", "deployment", "infrastructure"],
    relatedQuestions: ["technical-4", "support-1", "pricing-4"],
  },
  {
    id: "technical-4",
    question: "Do you provide API development and integration services?",
    answer:
      "Yes, I provide comprehensive API development and integration services. This includes building RESTful APIs, GraphQL endpoints, third-party API integrations (payment gateways, social media, analytics), and microservices architecture. I ensure proper documentation, authentication, rate limiting, and error handling. I also help with API migration, optimization, and maintenance.",
    category: "Technical",
    helpful: 29,
    tags: ["API", "integration", "microservices"],
    relatedQuestions: ["technical-1", "services-5", "technical-2"],
  },

  // Services Questions
  {
    id: "services-1",
    question: "What types of projects do you take on?",
    answer:
      "I take on a wide variety of web development projects including React applications, e-commerce platforms, SaaS solutions, portfolio websites, business websites, web applications, and mobile-responsive sites. I specialize in projects that require modern JavaScript frameworks, complex user interfaces, and high-performance requirements. I also offer consulting services for technical architecture and code reviews.",
    category: "Services",
    helpful: 47,
    tags: ["project types", "specialization", "consulting"],
    relatedQuestions: ["services-2", "general-1", "technical-1"],
  },
  {
    id: "services-2",
    question: "Do you provide ongoing support and maintenance?",
    answer:
      "Yes, I offer comprehensive post-launch support including bug fixes, security updates, performance monitoring, feature enhancements, and content updates. I provide different support tiers: basic (emergency fixes), standard (monthly maintenance), and premium (ongoing development). Support packages include regular backups, security monitoring, performance optimization, and priority response times.",
    category: "Services",
    helpful: 51,
    tags: ["support", "maintenance", "ongoing"],
    relatedQuestions: ["support-1", "pricing-4", "technical-2"],
  },
  {
    id: "services-3",
    question: "Can you help with SEO and digital marketing?",
    answer:
      "Yes, all my projects include technical SEO optimization, structured data implementation, performance optimization, and accessibility compliance. For advanced digital marketing, I collaborate with trusted marketing partners or provide consultation on technical SEO aspects. I ensure your site is optimized for search engines with proper meta tags, sitemaps, schema markup, and Core Web Vitals optimization.",
    category: "Services",
    helpful: 35,
    tags: ["SEO", "marketing", "optimization"],
    relatedQuestions: ["technical-3", "services-4", "performance-1"],
  },
  {
    id: "services-4",
    question: "Do you offer design services or work with designers?",
    answer:
      "While I focus primarily on development, I can work with your existing designs or collaborate with your design team. I also offer basic UI/UX improvements and can recommend trusted design partners for comprehensive design work. I'm experienced in translating Figma, Sketch, and Adobe XD designs into pixel-perfect, responsive code.",
    category: "Services",
    helpful: 26,
    tags: ["design", "UI/UX", "collaboration"],
    relatedQuestions: ["services-1", "process-4", "technical-1"],
  },
  {
    id: "services-5",
    question: "What industries do you have experience with?",
    answer:
      "I have experience across multiple industries including healthcare, fintech, e-commerce, education, SaaS, non-profit, and entertainment. Each industry has unique requirements for compliance, user experience, and functionality. I understand industry-specific needs like HIPAA compliance for healthcare, PCI DSS for e-commerce, and accessibility requirements for education and government sectors.",
    category: "Services",
    helpful: 31,
    tags: ["industries", "experience", "compliance"],
    relatedQuestions: ["technical-2", "services-1", "general-3"],
  },

  // Process Questions
  {
    id: "process-1",
    question: "What is your development process?",
    answer:
      "My development process follows a proven 5-phase methodology: Discovery (requirements gathering, planning), Design & Architecture (technical planning, wireframes), Development (iterative coding with regular check-ins), Testing & Quality Assurance (comprehensive testing, performance optimization), and Launch & Support (deployment, training, ongoing support). Each phase includes client collaboration and approval before moving forward.",
    category: "Process",
    helpful: 43,
    tags: ["process", "methodology", "phases"],
    relatedQuestions: ["process-2", "general-2", "communication-1"],
  },
  {
    id: "process-2",
    question: "How do you handle project communication?",
    answer:
      "Clear communication is essential for project success. I provide regular updates through your preferred channels (email, Slack, project management tools). I schedule weekly check-ins for larger projects and provide access to project dashboards where you can track progress in real-time. I'm responsive to questions and maintain transparency about challenges and solutions throughout the project.",
    category: "Process",
    helpful: 39,
    tags: ["communication", "updates", "transparency"],
    relatedQuestions: ["process-1", "communication-1", "general-3"],
  },
  {
    id: "process-3",
    question: "How do you handle changes and revisions?",
    answer:
      "I understand that requirements can evolve during development. Minor changes and refinements are included in the project scope. For significant changes that affect timeline or budget, I provide clear change requests with impact analysis. I use version control and maintain detailed documentation to track all changes. My goal is to be flexible while maintaining project quality and timeline.",
    category: "Process",
    helpful: 34,
    tags: ["changes", "revisions", "scope"],
    relatedQuestions: ["process-1", "pricing-2", "communication-2"],
  },
  {
    id: "process-4",
    question: "What information do you need to start a project?",
    answer:
      "To start a project, I need: project goals and objectives, target audience information, functional requirements, design preferences or existing brand guidelines, content and assets, technical requirements, budget range, and timeline expectations. During our discovery call, we'll discuss these details and I'll provide a comprehensive project proposal with timeline and pricing.",
    category: "Process",
    helpful: 37,
    tags: ["requirements", "discovery", "planning"],
    relatedQuestions: ["process-1", "communication-1", "pricing-1"],
  },

  // Support Questions
  {
    id: "support-1",
    question: "What kind of post-launch support do you provide?",
    answer:
      "Post-launch support includes bug fixes, security updates, performance monitoring, content updates, feature enhancements, and technical support. I offer different support levels from basic emergency support to comprehensive ongoing development. All support includes regular backups, security monitoring, and performance optimization. Response times vary by support tier, with premium support offering same-day response.",
    category: "Support",
    helpful: 48,
    tags: ["post-launch", "support", "maintenance"],
    relatedQuestions: ["support-2", "services-2", "pricing-4"],
  },
  {
    id: "support-2",
    question: "How quickly do you respond to support requests?",
    answer:
      "Response times depend on the support tier and issue severity. For emergency issues (site down, security breaches), I respond within 2-4 hours. Standard support requests receive responses within 24 hours on business days. Premium support clients get priority response within 4-8 hours. All response times are clearly defined in the support agreement, and I provide status updates for complex issues.",
    category: "Support",
    helpful: 42,
    tags: ["response time", "emergency", "priority"],
    relatedQuestions: ["support-1", "support-3", "communication-2"],
  },
  {
    id: "support-3",
    question: "Do you provide training for content management?",
    answer:
      "Yes, I provide comprehensive training for content management systems and admin interfaces. This includes video tutorials, written documentation, and live training sessions. I ensure you're comfortable managing your site's content, understanding the admin interface, and performing basic maintenance tasks. Training is included in most projects, with additional training available as needed.",
    category: "Support",
    helpful: 30,
    tags: ["training", "CMS", "documentation"],
    relatedQuestions: ["support-1", "process-4", "services-2"],
  },

  // Communication Questions
  {
    id: "communication-1",
    question: "What are your preferred communication methods?",
    answer:
      "I'm flexible with communication methods based on your preferences. For project updates and documentation, I use email and project management tools like Notion or Trello. For quick questions and real-time communication, I use Slack or similar messaging platforms. For detailed discussions and reviews, I prefer video calls via Zoom or Google Meet. I always maintain professional communication and respond promptly during business hours.",
    category: "Communication",
    helpful: 33,
    tags: ["communication methods", "tools", "preferences"],
    relatedQuestions: ["communication-2", "process-2", "general-3"],
  },
  {
    id: "communication-2",
    question: "How do you handle different time zones?",
    answer:
      "I'm experienced working across different time zones and am flexible with scheduling. I typically maintain core hours that overlap with major time zones and am available for urgent matters outside normal hours when needed. I use scheduling tools to coordinate meetings and always confirm times in your local timezone. For ongoing projects, we establish regular communication schedules that work for both parties.",
    category: "Communication",
    helpful: 27,
    tags: ["timezone", "scheduling", "flexibility"],
    relatedQuestions: ["communication-1", "general-3", "support-2"],
  },

  // Performance Questions
  {
    id: "performance-1",
    question: "How do you ensure website performance and speed?",
    answer:
      "Website performance is a top priority in all my projects. I implement performance best practices including image optimization, code splitting, lazy loading, caching strategies, CDN usage, and bundle optimization. I use tools like Lighthouse, WebPageTest, and Core Web Vitals to measure and optimize performance. All sites are tested across different devices and network conditions to ensure fast loading times.",
    category: "Performance",
    helpful: 46,
    tags: ["performance", "speed", "optimization"],
    relatedQuestions: ["technical-2", "technical-3", "services-3"],
  },
];

// FAQ categories for organization
const faqCategories = [
  "All",
  "General",
  "Pricing",
  "Technical",
  "Services",
  "Process",
  "Support",
  "Communication",
  "Performance",
];

interface AdvancedFAQSystemProps {
  className?: string;
}

export const AdvancedFAQSystem: React.FC<AdvancedFAQSystemProps> = ({
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set());
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [votedFAQs, setVotedFAQs] = useState<Set<string>>(new Set());

  // Initialize helpful votes from FAQ data
  useEffect(() => {
    const initialVotes: Record<string, number> = {};
    faqData.forEach((faq) => {
      initialVotes[faq.id] = faq.helpful;
    });
    setHelpfulVotes(initialVotes);
  }, []);

  // Filter and search FAQs
  const filteredFAQs = useMemo(() => {
    let filtered = faqData;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((faq) => faq.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query) ||
          faq.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort by helpfulness
    return filtered.sort((a, b) => {
      const aVotes = helpfulVotes[a.id] || a.helpful;
      const bVotes = helpfulVotes[b.id] || b.helpful;
      return bVotes - aVotes;
    });
  }, [searchQuery, selectedCategory, helpfulVotes]);

  // Get related FAQs
  const getRelatedFAQs = (faqId: string): FAQ[] => {
    const faq = faqData.find((f) => f.id === faqId);
    if (!faq?.relatedQuestions) return [];

    return faqData.filter((f) => faq.relatedQuestions?.includes(f.id));
  };

  // Toggle FAQ expansion
  const toggleFAQ = (faqId: string) => {
    const newExpanded = new Set(expandedFAQs);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    setExpandedFAQs(newExpanded);
  };

  // Handle helpful vote
  const handleHelpfulVote = (faqId: string) => {
    if (votedFAQs.has(faqId)) return;

    setHelpfulVotes((prev) => ({
      ...prev,
      [faqId]: (prev[faqId] || 0) + 1,
    }));
    setVotedFAQs((prev) => new Set([...prev, faqId]));

    // In a real app, this would send analytics data to the server
    console.log(`FAQ ${faqId} marked as helpful`);
  };

  // Get category counts
  const getCategoryCount = (category: string): number => {
    if (category === "All") return faqData.length;
    return faqData.filter((faq) => faq.category === category).length;
  };

  return (
    <section
      className={`bg-brutalist-light-gray py-20 border-b-5 border-black ${className}`}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg font-mono font-bold opacity-80 max-w-3xl mx-auto">
            Find answers to common questions about our web development services,
            process, and support. Can&apos;t find what you&apos;re looking for?
            Contact us directly.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="max-w-4xl mx-auto mb-12">
          {/* Search Bar */}
          <div className="mb-8">
            <EnhancedInput
              type="text"
              placeholder="Search FAQs by question, answer, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-lg"
              rightIcon={<span>🔍</span>}
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center">
            {faqCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 font-mono font-bold border-3 transition-all duration-200 ${selectedCategory === category
                    ? "bg-brutalist-yellow border-black text-black"
                    : "bg-white border-brutalist-gray text-black hover:bg-brutalist-yellow hover:border-black"
                  }`}
              >
                {category} ({getCategoryCount(category)})
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Results */}
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤔</div>
              <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-4">
                No FAQs Found
              </h3>
              <p className="font-mono opacity-80 mb-6">
                We couldn&apos;t find any FAQs matching your search criteria.
              </p>
              <EnhancedButton
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                variant="primary"
              >
                Clear Filters
              </EnhancedButton>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredFAQs.map((faq) => {
                const isExpanded = expandedFAQs.has(faq.id);
                const relatedFAQs = getRelatedFAQs(faq.id);
                const hasVoted = votedFAQs.has(faq.id);

                return (
                  <div
                    key={faq.id}
                    className="border-5 border-black bg-white hover:bg-brutalist-light-gray transition-colors duration-200"
                  >
                    {/* Question Header */}
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-brutalist-yellow transition-colors duration-200 group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 bg-brutalist-black text-white text-xs font-mono font-bold uppercase">
                            {faq.category}
                          </span>
                          <div className="flex items-center gap-2 text-sm font-mono opacity-60">
                            <span>
                              👍 {helpfulVotes[faq.id] || faq.helpful}
                            </span>
                            <span>•</span>
                            <span>{faq.tags.join(", ")}</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-black font-mono uppercase tracking-wider group-hover:text-black">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="ml-4 text-2xl font-mono font-black group-hover:text-black">
                        {isExpanded ? "−" : "+"}
                      </div>
                    </button>

                    {/* Answer Content */}
                    {isExpanded && (
                      <div className="px-6 pb-6 border-t-3 border-brutalist-gray">
                        <div className="pt-6">
                          {/* Answer Text */}
                          <div className="font-mono leading-relaxed mb-6 text-gray-800">
                            {faq.answer}
                          </div>

                          {/* Video Explanation Placeholder */}
                          {faq.category === "Technical" && (
                            <div className="mb-6 p-4 border-3 border-brutalist-yellow bg-brutalist-yellow/10">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">🎥</span>
                                <span className="font-mono font-bold">
                                  Video Explanation Available
                                </span>
                              </div>
                              <p className="font-mono text-sm opacity-80 mb-3">
                                Watch a detailed video explanation of this topic
                                for better understanding.
                              </p>
                              <EnhancedButton
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  // In a real app, this would open a video modal
                                  console.log(
                                    `Opening video for FAQ: ${faq.id}`
                                  );
                                }}
                              >
                                Watch Video
                              </EnhancedButton>
                            </div>
                          )}

                          {/* Related Questions */}
                          {relatedFAQs.length > 0 && (
                            <div className="mb-6 p-4 border-3 border-brutalist-gray bg-gray-50">
                              <h4 className="font-mono font-bold mb-3 flex items-center gap-2">
                                <span>🔗</span>
                                Related Questions
                              </h4>
                              <div className="space-y-2">
                                {relatedFAQs.slice(0, 3).map((relatedFAQ) => (
                                  <button
                                    key={relatedFAQ.id}
                                    onClick={() => {
                                      toggleFAQ(relatedFAQ.id);
                                      // Scroll to the related FAQ
                                      setTimeout(() => {
                                        const element = document.getElementById(
                                          `faq-${relatedFAQ.id}`
                                        );
                                        element?.scrollIntoView({
                                          behavior: "smooth",
                                          block: "center",
                                        });
                                      }, 100);
                                    }}
                                    className="block w-full text-left font-mono text-sm hover:text-brutalist-yellow transition-colors duration-200"
                                  >
                                    → {relatedFAQ.question}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Helpful Vote */}
                          <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                            <div className="flex items-center gap-4">
                              <span className="font-mono text-sm opacity-80">
                                Was this helpful?
                              </span>
                              <button
                                onClick={() => handleHelpfulVote(faq.id)}
                                disabled={hasVoted}
                                className={`px-3 py-1 font-mono text-sm border-2 transition-all duration-200 ${hasVoted
                                    ? "bg-green-100 border-green-500 text-green-700 cursor-not-allowed"
                                    : "border-brutalist-gray hover:bg-brutalist-yellow hover:border-black"
                                  }`}
                              >
                                {hasVoted ? "✓ Thanks!" : "👍 Yes"}
                              </button>
                            </div>
                            <div className="font-mono text-xs opacity-60">
                              {helpfulVotes[faq.id] || faq.helpful} people found
                              this helpful
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="border-5 border-brutalist-yellow bg-brutalist-yellow p-8">
            <h3 className="text-2xl font-black font-mono uppercase tracking-wider mb-4">
              Still Have Questions?
            </h3>
            <p className="font-mono font-bold mb-6">
              Can&apos;t find the answer you&apos;re looking for? Get in touch
              and I&apos;ll be happy to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <EnhancedButton
                variant="primary"
                onClick={() => {
                  // In a real app, this would navigate to contact page
                  window.location.href = "/contact";
                }}
              >
                Contact Me
              </EnhancedButton>
              <EnhancedButton
                variant="secondary"
                onClick={() => {
                  // In a real app, this would open a chat widget
                  console.log("Opening chat widget");
                }}
              >
                Live Chat
              </EnhancedButton>
            </div>
          </div>
        </div>

        {/* FAQ Analytics Summary */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-3 border-black bg-white p-6 text-center">
              <div className="text-3xl font-black font-mono mb-2">
                {faqData.length}
              </div>
              <div className="font-mono font-bold text-sm uppercase tracking-wider opacity-80">
                Total FAQs
              </div>
            </div>
            <div className="border-3 border-black bg-white p-6 text-center">
              <div className="text-3xl font-black font-mono mb-2">
                {faqCategories.length - 1}
              </div>
              <div className="font-mono font-bold text-sm uppercase tracking-wider opacity-80">
                Categories
              </div>
            </div>
            <div className="border-3 border-black bg-white p-6 text-center">
              <div className="text-3xl font-black font-mono mb-2">
                {Object.values(helpfulVotes).reduce(
                  (sum, votes) => sum + votes,
                  0
                )}
              </div>
              <div className="font-mono font-bold text-sm uppercase tracking-wider opacity-80">
                Helpful Votes
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvancedFAQSystem;
