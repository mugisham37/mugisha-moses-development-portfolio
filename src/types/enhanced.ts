// Enhanced data models and TypeScript interfaces for the enhanced navigation pages

// Base types for enhanced functionality
export type ComplexityLevel = "simple" | "moderate" | "complex" | "enterprise";
export type ProjectStatus =
  | "completed"
  | "in-progress"
  | "maintenance"
  | "archived";
export type Industry =
  | "healthcare"
  | "fintech"
  | "ecommerce"
  | "education"
  | "saas"
  | "nonprofit"
  | "entertainment"
  | "other";
export type ProjectCategory =
  | "react"
  | "vue"
  | "ecommerce"
  | "saas"
  | "mobile"
  | "fullstack"
  | "frontend"
  | "backend";
export type ConsultationType =
  | "discovery"
  | "technical"
  | "strategy"
  | "review"
  | "emergency";
export type ContactChannel =
  | "email"
  | "phone"
  | "video"
  | "messaging"
  | "in-person";

// Enhanced Project interface
export interface EnhancedProject {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: Technology[];
  category: ProjectCategory;
  industry: Industry;
  complexity: ComplexityLevel;
  timeline: ProjectTimeline;
  businessImpact: BusinessMetrics;
  images: ProjectImage[];
  caseStudy: CaseStudyDetails;
  testimonial?: ClientTestimonial;
  relatedProjects: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Technology interface with enhanced details
export interface Technology {
  name: string;
  category:
    | "frontend"
    | "backend"
    | "database"
    | "devops"
    | "mobile"
    | "design"
    | "testing";
  proficiencyLevel: 1 | 2 | 3 | 4 | 5;
  yearsOfExperience: number;
  lastUsed: Date;
  certifications?: string[];
  relatedProjects: string[];
}

// Project timeline interface
export interface ProjectTimeline {
  startDate: Date;
  endDate: Date;
  duration: string;
  phases: ProjectPhase[];
  milestones: Milestone[];
}

// Project phase interface
export interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  deliverables: string[];
  status: "completed" | "in-progress" | "pending";
}

// Milestone interface
export interface Milestone {
  id: string;
  title: string;
  description: string;
  date: Date;
  achieved: boolean;
  impact?: string;
}

// Business metrics interface
export interface BusinessMetrics {
  performanceImprovement?: string;
  conversionIncrease?: string;
  userGrowth?: string;
  revenueImpact?: string;
  costSavings?: string;
  timeToMarket?: string;
  customMetrics?: Record<string, string>;
}

// Project image interface
export interface ProjectImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  type: "thumbnail" | "mockup" | "screenshot" | "diagram" | "before" | "after";
  order: number;
}

// Case study details interface
export interface CaseStudyDetails {
  challenge: string;
  solution: string;
  approach: string[];
  technicalDetails: TechnicalDetail[];
  results: string[];
  lessonsLearned: string[];
  futureEnhancements?: string[];
}

// Technical detail interface
export interface TechnicalDetail {
  title: string;
  description: string;
  codeSnippet?: string;
  diagram?: string;
  challenges?: string[];
  solutions?: string[];
}

// Client testimonial interface
export interface ClientTestimonial {
  id: string;
  clientName: string;
  clientTitle: string;
  company: string;
  companyLogo?: string;
  content: string;
  rating: 1 | 2 | 3 | 4 | 5;
  projectId: string;
  date: Date;
  verified: boolean;
}

// Enhanced Service interface
export interface EnhancedService {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  features: ServiceFeature[];
  pricing: PricingTier[];
  timeline: string;
  deliverables: Deliverable[];
  process: ProcessStep[];
  requirements: string[];
  addOns: AddOnService[];
  testimonials: ServiceTestimonial[];
  relatedProjects: string[];
  faq: FAQ[];
  category: "development" | "consulting" | "maintenance" | "optimization";
  complexity: ComplexityLevel;
  availability: boolean;
}

// Service feature interface
export interface ServiceFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
  optional: boolean;
  additionalCost?: number;
  estimatedHours?: number;
  dependencies?: string[];
}

// Enhanced pricing tier interface
export interface EnhancedPricingTier {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  features: ServiceFeature[];
  popular?: boolean;
  customizable: boolean;
  estimatedTimeline: string;
  supportLevel: "basic" | "standard" | "premium" | "enterprise";
  revisions: number;
  supportDuration: string;
}

// Deliverable interface
export interface Deliverable {
  id: string;
  name: string;
  description: string;
  type: "document" | "code" | "design" | "deployment" | "training";
  estimatedHours: number;
  dependencies?: string[];
  milestone?: string;
}

// Process step interface
export interface ProcessStep {
  id: string;
  name: string;
  description: string;
  duration: string;
  deliverables: string[];
  clientInvolvement: "low" | "medium" | "high";
  order: number;
  optional: boolean;
}

// Add-on service interface
export interface AddOnService {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedHours: number;
  category: "feature" | "integration" | "optimization" | "maintenance";
  compatibility: string[];
}

// Service testimonial interface
export interface ServiceTestimonial {
  id: string;
  clientName: string;
  clientTitle: string;
  company: string;
  serviceId: string;
  content: string;
  rating: 1 | 2 | 3 | 4 | 5;
  results?: string;
  date: Date;
}

// FAQ interface
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  tags: string[];
  relatedQuestions?: string[];
}

// User Settings interfaces
export interface UserSettings {
  theme: ThemeSettings;
  accessibility: AccessibilitySettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  preferences: UserPreferences;
  advanced: AdvancedSettings;
}

// Theme settings interface
export interface ThemeSettings {
  colorScheme: "light" | "dark" | "auto" | "high-contrast";
  primaryColor: string;
  accentColor: string;
  layoutDensity: "compact" | "comfortable" | "spacious";
  animationsEnabled: boolean;
  reducedMotion: boolean;
  customCSS?: string;
}

// Accessibility settings interface
export interface AccessibilitySettings {
  fontSize: "small" | "medium" | "large" | "extra-large";
  fontFamily: "default" | "dyslexia-friendly" | "high-readability";
  contrastRatio: "normal" | "high" | "maximum";
  focusIndicators: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
  audioDescriptions: boolean;
  captionsEnabled: boolean;
}

// Notification settings interface
export interface NotificationSettings {
  emailUpdates: boolean;
  projectStatusNotifications: boolean;
  marketingCommunications: boolean;
  newsletterSubscription: boolean;
  emergencyContacts: boolean;
  frequency: "immediate" | "daily" | "weekly" | "monthly";
  preferredTime: string;
  timezone: string;
}

// Privacy settings interface
export interface PrivacySettings {
  analyticsEnabled: boolean;
  cookiesAccepted: boolean;
  dataCollection: "minimal" | "standard" | "full";
  thirdPartyIntegrations: boolean;
  locationTracking: boolean;
  personalizedContent: boolean;
  dataRetention: "1year" | "2years" | "5years" | "indefinite";
}

// User preferences interface
export interface UserPreferences {
  language: string;
  currency: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  defaultView: "grid" | "list" | "cards";
  itemsPerPage: number;
  autoSave: boolean;
  confirmActions: boolean;
}

// Advanced settings interface
export interface AdvancedSettings {
  developerMode: boolean;
  debugMode: boolean;
  performanceMonitoring: boolean;
  featureFlags: Record<string, boolean>;
  experimentalFeatures: boolean;
  apiEndpoint?: string;
  customHeaders?: Record<string, string>;
}

// Contact and booking interfaces
export interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  available: boolean;
  consultationType: ConsultationType;
  timezone: string;
  price?: number;
}

// Consultation booking interface
export interface ConsultationBooking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  consultationType: ConsultationType;
  timeSlot: TimeSlot;
  agenda: string;
  requirements?: string;
  budget?: string;
  timeline?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  meetingLink?: string;
  notes?: string;
  followUpRequired: boolean;
}

// Contact preference interface
export interface ContactPreference {
  channel: ContactChannel;
  preferred: boolean;
  responseTime: string;
  availability: string;
  useCase: string;
  emergencyOnly: boolean;
}

// Project inquiry interface
export interface ProjectInquiry {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  company?: string;
  projectType: ProjectCategory;
  projectDescription: string;
  requirements: string[];
  budget: string;
  timeline: string;
  preferredTechnologies?: string[];
  additionalNotes?: string;
  attachments?: File[];
  status: "new" | "reviewing" | "quoted" | "accepted" | "declined";
  createdAt: Date;
  updatedAt: Date;
}

// Filter and search interfaces
export interface ProjectFilter {
  technologies?: string[];
  categories?: ProjectCategory[];
  industries?: Industry[];
  complexity?: ComplexityLevel[];
  status?: ProjectStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  featured?: boolean;
}

// Search configuration interface
export interface SearchConfig {
  query: string;
  filters: ProjectFilter;
  sortBy: "relevance" | "date" | "title" | "complexity";
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
}

// Search result interface
export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  facets?: Record<string, number>;
}

// Analytics and metrics interfaces
export interface PageAnalytics {
  pageViews: number;
  uniqueVisitors: number;
  averageTimeOnPage: number;
  bounceRate: number;
  conversionRate: number;
  topReferrers: string[];
  deviceBreakdown: Record<string, number>;
  geographicData: Record<string, number>;
}

// Performance metrics interface
export interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  bundleSize: number;
  memoryUsage: number;
}

// Error tracking interface
export interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  component?: string;
  userId?: string;
  timestamp: Date;
  severity: "low" | "medium" | "high" | "critical";
  resolved: boolean;
  metadata?: Record<string, any>;
}

// Form validation interfaces
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
  message?: string;
}

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "file"
    | "date"
    | "number";
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: ValidationRule;
  conditional?: {
    field: string;
    value: any;
  };
  helpText?: string;
}

export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  submitText: string;
  multiStep?: boolean;
  autoSave?: boolean;
  analytics?: boolean;
}
