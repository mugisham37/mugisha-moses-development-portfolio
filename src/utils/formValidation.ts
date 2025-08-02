// Enhanced form validation utilities with contextual error messages

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any, formData?: any) => boolean | string;
  message?: string;
  dependencies?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

export interface FormAnalytics {
  formId: string;
  startTime: Date;
  completionTime?: Date;
  stepTimes: Record<string, number>;
  fieldInteractions: Record<string, number>;
  validationErrors: Record<string, number>;
  abandonmentStep?: number;
  completed: boolean;
  userAgent: string;
  sessionId: string;
}

// Common validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  zipCode: /^\d{5}(-\d{4})?$/,
  creditCard: /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphabetic: /^[a-zA-Z\s]+$/,
  numeric: /^\d+$/,
  decimal: /^\d+(\.\d{1,2})?$/,
};

// Contextual error messages
export const ERROR_MESSAGES = {
  required: (fieldName: string) => `${fieldName} is required`,
  minLength: (fieldName: string, min: number) =>
    `${fieldName} must be at least ${min} characters long`,
  maxLength: (fieldName: string, max: number) =>
    `${fieldName} must be no more than ${max} characters long`,
  pattern: (fieldName: string, type: string) =>
    `Please enter a valid ${type} for ${fieldName}`,
  email: (fieldName: string) =>
    `Please enter a valid email address for ${fieldName}`,
  phone: (fieldName: string) =>
    `Please enter a valid phone number for ${fieldName}`,
  url: (fieldName: string) => `Please enter a valid URL for ${fieldName}`,
  password: (fieldName: string) =>
    `${fieldName} must contain at least 8 characters with uppercase, lowercase, number, and special character`,
  match: (fieldName: string, matchField: string) =>
    `${fieldName} must match ${matchField}`,
  custom: (fieldName: string, message?: string) =>
    message || `${fieldName} is invalid`,
};

// Field validation function
export function validateField(
  fieldName: string,
  value: any,
  rules: ValidationRule,
  formData?: any
): { isValid: boolean; error?: string; warning?: string } {
  // Required validation
  if (rules.required && (!value || value.toString().trim() === "")) {
    return {
      isValid: false,
      error: rules.message || ERROR_MESSAGES.required(fieldName),
    };
  }

  // Skip other validations if field is empty and not required
  if (!value || value.toString().trim() === "") {
    return { isValid: true };
  }

  const stringValue = value.toString();

  // Length validations
  if (rules.minLength && stringValue.length < rules.minLength) {
    return {
      isValid: false,
      error:
        rules.message || ERROR_MESSAGES.minLength(fieldName, rules.minLength),
    };
  }

  if (rules.maxLength && stringValue.length > rules.maxLength) {
    return {
      isValid: false,
      error:
        rules.message || ERROR_MESSAGES.maxLength(fieldName, rules.maxLength),
    };
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    return {
      isValid: false,
      error: rules.message || ERROR_MESSAGES.pattern(fieldName, "format"),
    };
  }

  // Custom validation
  if (rules.custom) {
    const result = rules.custom(value, formData);
    if (typeof result === "string") {
      return {
        isValid: false,
        error: result,
      };
    }
    if (!result) {
      return {
        isValid: false,
        error: rules.message || ERROR_MESSAGES.custom(fieldName),
      };
    }
  }

  return { isValid: true };
}

// Form validation function
export function validateForm(
  formData: any,
  validationRules: Record<string, ValidationRule>
): ValidationResult {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  Object.entries(validationRules).forEach(([fieldName, rules]) => {
    const fieldValue = getNestedValue(formData, fieldName);
    const result = validateField(fieldName, fieldValue, rules, formData);

    if (!result.isValid && result.error) {
      errors[fieldName] = result.error;
    }

    if (result.warning) {
      warnings[fieldName] = result.warning;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

// Helper function to get nested object values
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((current, key) => current?.[key], obj);
}

// Auto-save functionality
export class FormAutoSave {
  private formId: string;
  private interval: number;
  private timeoutId?: NodeJS.Timeout;
  private onSave: (data: any) => Promise<void> | void;

  constructor(
    formId: string,
    onSave: (data: any) => Promise<void> | void,
    interval: number = 30000
  ) {
    this.formId = formId;
    this.onSave = onSave;
    this.interval = interval;
  }

  start(formData: any) {
    this.stop();
    this.timeoutId = setTimeout(async () => {
      try {
        await this.onSave(formData);
        this.saveToLocalStorage(formData);
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, this.interval);
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  private saveToLocalStorage(data: any) {
    try {
      localStorage.setItem(
        `form-autosave-${this.formId}`,
        JSON.stringify({
          data,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }

  loadFromLocalStorage(): any | null {
    try {
      const saved = localStorage.getItem(`form-autosave-${this.formId}`);
      if (saved) {
        const { data, timestamp } = JSON.parse(saved);
        // Check if data is not too old (24 hours)
        const savedTime = new Date(timestamp);
        const now = new Date();
        const hoursDiff =
          (now.getTime() - savedTime.getTime()) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
          return data;
        }
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
    }
    return null;
  }

  clearLocalStorage() {
    try {
      localStorage.removeItem(`form-autosave-${this.formId}`);
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  }
}

// Form analytics tracker
export class FormAnalyticsTracker {
  private analytics: FormAnalytics;
  private stepStartTime: Date;

  constructor(formId: string) {
    this.analytics = {
      formId,
      startTime: new Date(),
      stepTimes: {},
      fieldInteractions: {},
      validationErrors: {},
      completed: false,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      sessionId: this.generateSessionId(),
    };
    this.stepStartTime = new Date();
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  trackFieldInteraction(fieldName: string) {
    this.analytics.fieldInteractions[fieldName] =
      (this.analytics.fieldInteractions[fieldName] || 0) + 1;
  }

  trackValidationError(fieldName: string) {
    this.analytics.validationErrors[fieldName] =
      (this.analytics.validationErrors[fieldName] || 0) + 1;
  }

  trackStepChange(stepId: string) {
    const timeSpent = Date.now() - this.stepStartTime.getTime();
    this.analytics.stepTimes[stepId] = timeSpent;
    this.stepStartTime = new Date();
  }

  trackAbandonment(stepIndex: number) {
    this.analytics.abandonmentStep = stepIndex;
  }

  trackCompletion() {
    this.analytics.completed = true;
    this.analytics.completionTime = new Date();
  }

  getAnalytics(): FormAnalytics {
    return { ...this.analytics };
  }

  exportAnalytics(): string {
    return JSON.stringify(this.analytics, null, 2);
  }
}

// Conditional field logic
export interface ConditionalRule {
  field: string;
  operator:
    | "equals"
    | "not-equals"
    | "contains"
    | "not-contains"
    | "greater"
    | "less"
    | "exists"
    | "not-exists";
  value?: any;
}

export function evaluateConditionalRule(
  rule: ConditionalRule,
  formData: any
): boolean {
  const fieldValue = getNestedValue(formData, rule.field);

  switch (rule.operator) {
    case "equals":
      return fieldValue === rule.value;
    case "not-equals":
      return fieldValue !== rule.value;
    case "contains":
      return Array.isArray(fieldValue) && fieldValue.includes(rule.value);
    case "not-contains":
      return Array.isArray(fieldValue) && !fieldValue.includes(rule.value);
    case "greater":
      return Number(fieldValue) > Number(rule.value);
    case "less":
      return Number(fieldValue) < Number(rule.value);
    case "exists":
      return (
        fieldValue !== undefined && fieldValue !== null && fieldValue !== ""
      );
    case "not-exists":
      return (
        fieldValue === undefined || fieldValue === null || fieldValue === ""
      );
    default:
      return false;
  }
}

// Multi-step form progress tracking
export class FormProgressTracker {
  private totalSteps: number;
  private currentStep: number;
  private completedSteps: Set<number>;

  constructor(totalSteps: number) {
    this.totalSteps = totalSteps;
    this.currentStep = 0;
    this.completedSteps = new Set();
  }

  setCurrentStep(step: number) {
    if (step >= 0 && step < this.totalSteps) {
      this.currentStep = step;
    }
  }

  markStepCompleted(step: number) {
    if (step >= 0 && step < this.totalSteps) {
      this.completedSteps.add(step);
    }
  }

  isStepCompleted(step: number): boolean {
    return this.completedSteps.has(step);
  }

  getProgress(): number {
    return (this.completedSteps.size / this.totalSteps) * 100;
  }

  getCurrentStep(): number {
    return this.currentStep;
  }

  canNavigateToStep(step: number): boolean {
    // Can navigate to current step, completed steps, or next step if current is completed
    return (
      step === this.currentStep ||
      this.completedSteps.has(step) ||
      (step === this.currentStep + 1 &&
        this.completedSteps.has(this.currentStep))
    );
  }
}

// Form field dependency resolver
export class FormDependencyResolver {
  private dependencies: Map<string, string[]>;

  constructor() {
    this.dependencies = new Map();
  }

  addDependency(field: string, dependsOn: string[]) {
    this.dependencies.set(field, dependsOn);
  }

  getDependencies(field: string): string[] {
    return this.dependencies.get(field) || [];
  }

  shouldValidateField(field: string, formData: any): boolean {
    const deps = this.getDependencies(field);
    if (deps.length === 0) return true;

    // Check if all dependencies are satisfied
    return deps.every((dep) => {
      const value = getNestedValue(formData, dep);
      return value !== undefined && value !== null && value !== "";
    });
  }

  getValidationOrder(fields: string[]): string[] {
    const visited = new Set<string>();
    const result: string[] = [];

    const visit = (field: string) => {
      if (visited.has(field)) return;
      visited.add(field);

      const deps = this.getDependencies(field);
      deps.forEach((dep) => {
        if (fields.includes(dep)) {
          visit(dep);
        }
      });

      result.push(field);
    };

    fields.forEach((field) => visit(field));
    return result;
  }
}

// All exports are already declared above with their implementations
