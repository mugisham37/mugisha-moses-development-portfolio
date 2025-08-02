"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  Globe,
  Video,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  X,
  Plus,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ConsultationType,
  TimeSlot,
  ConsultationBooking,
} from "@/types/enhanced";
import BrutalistButton from "../ui/BrutalistButton";

export interface IntegratedCalendarBookingProps {
  className?: string;
  onBookingComplete?: (booking: ConsultationBooking) => void;
  onReschedule?: (bookingId: string, newTimeSlot: TimeSlot) => void;
  onCancel?: (bookingId: string) => void;
  availableTimeSlots?: TimeSlot[];
  existingBookings?: ConsultationBooking[];
}

interface BookingFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  consultationType: ConsultationType;
  agenda: string;
  requirements: string;
  budget: string;
  timeline: string;
  timezone: string;
  questionnaire: Record<string, string>;
}

const CONSULTATION_TYPES: Array<{
  id: ConsultationType;
  title: string;
  duration: number;
  price: number;
  description: string;
  questionnaire: Array<{
    id: string;
    question: string;
    type: "text" | "select" | "textarea";
    options?: string[];
  }>;
}> = [
  {
    id: "discovery",
    title: "Discovery Call",
    duration: 30,
    price: 0,
    description:
      "Free consultation to discuss your project requirements and goals",
    questionnaire: [
      {
        id: "project_type",
        question: "What type of project are you considering?",
        type: "select",
        options: ["Website", "Web App", "E-commerce", "SaaS", "Other"],
      },
      {
        id: "timeline",
        question: "What's your ideal timeline?",
        type: "select",
        options: ["ASAP", "1-2 months", "3-6 months", "Flexible"],
      },
      {
        id: "budget_range",
        question: "What's your budget range?",
        type: "select",
        options: [
          "$2,500-$5,000",
          "$5,000-$10,000",
          "$10,000+",
          "Not sure yet",
        ],
      },
    ],
  },
  {
    id: "technical",
    title: "Technical Consultation",
    duration: 60,
    price: 150,
    description:
      "In-depth technical discussion about architecture, implementation, and best practices",
    questionnaire: [
      {
        id: "technical_challenge",
        question: "What technical challenge are you facing?",
        type: "textarea",
      },
      {
        id: "current_stack",
        question: "What's your current technology stack?",
        type: "text",
      },
      {
        id: "team_size",
        question: "How many developers are on your team?",
        type: "select",
        options: ["Just me", "2-5", "6-10", "10+"],
      },
    ],
  },
  {
    id: "strategy",
    title: "Strategy Session",
    duration: 90,
    price: 200,
    description:
      "Comprehensive strategy planning for your digital presence and business goals",
    questionnaire: [
      {
        id: "business_goals",
        question: "What are your primary business goals?",
        type: "textarea",
      },
      {
        id: "target_audience",
        question: "Who is your target audience?",
        type: "text",
      },
      {
        id: "competitors",
        question: "Who are your main competitors?",
        type: "text",
      },
    ],
  },
  {
    id: "review",
    title: "Code/Design Review",
    duration: 45,
    price: 125,
    description:
      "Professional review of your existing code, design, or project structure",
    questionnaire: [
      {
        id: "review_type",
        question: "What would you like reviewed?",
        type: "select",
        options: ["Code", "Design", "Architecture", "Performance", "Security"],
      },
      {
        id: "project_url",
        question: "Project URL or repository (if available)",
        type: "text",
      },
      {
        id: "specific_concerns",
        question: "Any specific concerns or areas to focus on?",
        type: "textarea",
      },
    ],
  },
];

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEDT)" },
];

const IntegratedCalendarBooking: React.FC<IntegratedCalendarBookingProps> = ({
  className,
  onBookingComplete,
  onReschedule,
  onCancel,
  availableTimeSlots = [],
  existingBookings = [],
}) => {
  const [currentStep, setCurrentStep] = useState<
    "type" | "calendar" | "form" | "confirmation"
  >("type");
  const [selectedConsultationType, setSelectedConsultationType] =
    useState<ConsultationType | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [selectedTimezone, setSelectedTimezone] = useState("America/New_York");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] =
    useState<ConsultationBooking | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    consultationType: "discovery",
    agenda: "",
    requirements: "",
    budget: "",
    timeline: "",
    timezone: "America/New_York",
    questionnaire: {},
  });

  // Generate mock time slots for demonstration
  const generateTimeSlots = useMemo(() => {
    const slots: TimeSlot[] = [];
    const today = new Date();

    for (let day = 1; day <= 14; day++) {
      const date = new Date(today);
      date.setDate(today.getDate() + day);

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      // Generate time slots for business hours (9 AM - 5 PM)
      for (let hour = 9; hour < 17; hour++) {
        const startTime = new Date(date);
        startTime.setHours(hour, 0, 0, 0);

        const endTime = new Date(startTime);
        endTime.setMinutes(
          selectedConsultationType
            ? CONSULTATION_TYPES.find((t) => t.id === selectedConsultationType)
                ?.duration || 30
            : 30
        );

        // Randomly make some slots unavailable for realism
        const available = Math.random() > 0.3;

        slots.push({
          id: `${date.toISOString().split("T")[0]}-${hour}:00`,
          startTime,
          endTime,
          available,
          consultationType: selectedConsultationType || "discovery",
          timezone: selectedTimezone,
          price: selectedConsultationType
            ? CONSULTATION_TYPES.find((t) => t.id === selectedConsultationType)
                ?.price
            : 0,
        });
      }
    }

    return slots;
  }, [selectedConsultationType, selectedTimezone]);

  const filteredTimeSlots = useMemo(() => {
    return generateTimeSlots.filter((slot) => {
      const slotDate = new Date(slot.startTime);
      return (
        slotDate.getMonth() === currentDate.getMonth() &&
        slotDate.getFullYear() === currentDate.getFullYear()
      );
    });
  }, [generateTimeSlots, currentDate]);

  const handleConsultationTypeSelect = (type: ConsultationType) => {
    setSelectedConsultationType(type);
    setFormData((prev) => ({ ...prev, consultationType: type }));
    setCurrentStep("calendar");
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (!slot.available) return;
    setSelectedTimeSlot(slot);
    setCurrentStep("form");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTimeSlot || !selectedConsultationType) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const booking: ConsultationBooking = {
        id: `booking-${Date.now()}`,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        consultationType: selectedConsultationType,
        timeSlot: selectedTimeSlot,
        agenda: formData.agenda,
        requirements: formData.requirements,
        budget: formData.budget,
        timeline: formData.timeline,
        status: "confirmed",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        notes: "",
        followUpRequired: true,
      };

      setBookingResult(booking);
      setCurrentStep("confirmation");
      onBookingComplete?.(booking);
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionnaireChange = (questionId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      questionnaire: { ...prev.questionnaire, [questionId]: value },
    }));
  };

  const resetBooking = () => {
    setCurrentStep("type");
    setSelectedConsultationType(null);
    setSelectedTimeSlot(null);
    setBookingResult(null);
    setFormData({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      consultationType: "discovery",
      agenda: "",
      requirements: "",
      budget: "",
      timeline: "",
      timezone: "America/New_York",
      questionnaire: {},
    });
  };

  const formatTimeSlot = (slot: TimeSlot) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(slot.startTime);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  return (
    <div className={cn("w-full max-w-6xl mx-auto", className)}>
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <Calendar size={32} className="text-brutalist-yellow" />
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider font-mono">
            Book Consultation
          </h2>
        </div>
        <p className="text-lg font-mono font-bold opacity-80 max-w-3xl mx-auto">
          Schedule your consultation with real-time availability and automated
          confirmation
        </p>
      </motion.div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-4">
          {["type", "calendar", "form", "confirmation"].map((step, index) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-3 border-black flex items-center justify-center font-mono font-black text-sm",
                  currentStep === step
                    ? "bg-brutalist-yellow"
                    : ["type", "calendar", "form", "confirmation"].indexOf(
                        currentStep
                      ) > index
                    ? "bg-green-500 text-white"
                    : "bg-white"
                )}
              >
                {["type", "calendar", "form", "confirmation"].indexOf(
                  currentStep
                ) > index ? (
                  <CheckCircle size={16} />
                ) : (
                  index + 1
                )}
              </div>
              {index < 3 && (
                <div
                  className={cn(
                    "w-8 h-1 border-t-3",
                    ["type", "calendar", "form", "confirmation"].indexOf(
                      currentStep
                    ) > index
                      ? "border-green-500"
                      : "border-black"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Consultation Type Selection */}
        {currentStep === "type" && (
          <motion.div
            key="type"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-black uppercase tracking-wider font-mono text-center mb-8">
              Choose Consultation Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CONSULTATION_TYPES.map((type) => (
                <motion.div
                  key={type.id}
                  className={cn(
                    "bg-white border-3 border-black p-6 cursor-pointer transition-all duration-300",
                    "hover:bg-brutalist-yellow hover:transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000000]"
                  )}
                  whileHover={{ y: -4, boxShadow: "4px 4px 0px #000000" }}
                  onClick={() => handleConsultationTypeSelect(type.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-xl font-black uppercase tracking-wider font-mono">
                      {type.title}
                    </h4>
                    <div className="text-right">
                      <div className="font-mono font-black text-lg">
                        {type.price === 0 ? "FREE" : `$${type.price}`}
                      </div>
                      <div className="font-mono text-sm opacity-80">
                        {type.duration} min
                      </div>
                    </div>
                  </div>
                  <p className="font-mono text-sm mb-4 opacity-90">
                    {type.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-mono">
                    <Video size={16} />
                    <span>Video call included</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Calendar Selection */}
        {currentStep === "calendar" && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setCurrentStep("type")}
                className="flex items-center gap-2 px-4 py-2 border-3 border-black bg-white hover:bg-brutalist-yellow font-mono font-bold"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <h3 className="text-2xl font-black uppercase tracking-wider font-mono">
                Select Date & Time
              </h3>
              <div className="flex items-center gap-2">
                <select
                  value={selectedTimezone}
                  onChange={(e) => setSelectedTimezone(e.target.value)}
                  className="px-3 py-2 border-3 border-black font-mono text-sm"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-6 p-4 border-3 border-black bg-brutalist-yellow">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-2 hover:bg-black hover:text-brutalist-yellow transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h4 className="text-xl font-black uppercase tracking-wider font-mono">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h4>
              <button
                onClick={() => navigateMonth("next")}
                className="p-2 hover:bg-black hover:text-brutalist-yellow transition-colors"
              >
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Time Slots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTimeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleTimeSlotSelect(slot)}
                  disabled={!slot.available}
                  className={cn(
                    "p-4 border-3 border-black font-mono font-bold text-sm transition-all duration-300",
                    slot.available
                      ? "bg-white hover:bg-brutalist-yellow hover:transform hover:-translate-y-1"
                      : "bg-gray-100 opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="text-center">
                    <div className="font-black">
                      {slot.startTime.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-lg">
                      {slot.startTime.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                    {!slot.available && (
                      <div className="text-xs text-red-600 mt-1">Booked</div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {filteredTimeSlots.length === 0 && (
              <div className="text-center py-12">
                <p className="font-mono text-lg opacity-80">
                  No available slots for this month. Please select a different
                  month.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Booking Form */}
        {currentStep === "form" &&
          selectedConsultationType &&
          selectedTimeSlot && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => setCurrentStep("calendar")}
                  className="flex items-center gap-2 px-4 py-2 border-3 border-black bg-white hover:bg-brutalist-yellow font-mono font-bold"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <h3 className="text-2xl font-black uppercase tracking-wider font-mono">
                  Booking Details
                </h3>
                <div />
              </div>

              {/* Selected Consultation Summary */}
              <div className="mb-8 p-6 border-3 border-black bg-brutalist-yellow">
                <h4 className="font-mono font-black text-lg mb-4 uppercase tracking-wider">
                  Selected Consultation
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                  <div>
                    <div className="font-bold">Type:</div>
                    <div>
                      {
                        CONSULTATION_TYPES.find(
                          (t) => t.id === selectedConsultationType
                        )?.title
                      }
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">Date & Time:</div>
                    <div>{formatTimeSlot(selectedTimeSlot)}</div>
                  </div>
                  <div>
                    <div className="font-bold">Duration & Price:</div>
                    <div>
                      {
                        CONSULTATION_TYPES.find(
                          (t) => t.id === selectedConsultationType
                        )?.duration
                      }{" "}
                      min -
                      {selectedTimeSlot.price === 0
                        ? " FREE"
                        : ` $${selectedTimeSlot.price}`}
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-2">
                      <User size={16} className="inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) =>
                        handleInputChange("clientName", e.target.value)
                      }
                      required
                      className="w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-2">
                      <Mail size={16} className="inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) =>
                        handleInputChange("clientEmail", e.target.value)
                      }
                      required
                      className="w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) =>
                      handleInputChange("clientPhone", e.target.value)
                    }
                    className="w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Pre-meeting Questionnaire */}
                <div className="border-3 border-black p-6 bg-gray-50">
                  <h4 className="font-mono font-black text-lg mb-4 uppercase tracking-wider">
                    Pre-Meeting Questionnaire
                  </h4>
                  <div className="space-y-4">
                    {CONSULTATION_TYPES.find(
                      (t) => t.id === selectedConsultationType
                    )?.questionnaire.map((question) => (
                      <div key={question.id}>
                        <label className="block font-mono font-bold text-sm mb-2">
                          {question.question}
                        </label>
                        {question.type === "select" ? (
                          <select
                            value={formData.questionnaire[question.id] || ""}
                            onChange={(e) =>
                              handleQuestionnaireChange(
                                question.id,
                                e.target.value
                              )
                            }
                            className="w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300"
                          >
                            <option value="">Select an option</option>
                            {question.options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : question.type === "textarea" ? (
                          <textarea
                            value={formData.questionnaire[question.id] || ""}
                            onChange={(e) =>
                              handleQuestionnaireChange(
                                question.id,
                                e.target.value
                              )
                            }
                            rows={3}
                            className="w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300 resize-none"
                            placeholder="Please provide details..."
                          />
                        ) : (
                          <input
                            type="text"
                            value={formData.questionnaire[question.id] || ""}
                            onChange={(e) =>
                              handleQuestionnaireChange(
                                question.id,
                                e.target.value
                              )
                            }
                            className="w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300"
                            placeholder="Enter your answer"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-2">
                    <MessageSquare size={16} className="inline mr-2" />
                    Meeting Agenda (Optional)
                  </label>
                  <textarea
                    value={formData.agenda}
                    onChange={(e) =>
                      handleInputChange("agenda", e.target.value)
                    }
                    rows={4}
                    className="w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300 resize-none"
                    placeholder="What would you like to discuss during our meeting?"
                  />
                </div>

                {/* Submit Button */}
                <BrutalistButton
                  type="submit"
                  variant="accent"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full"
                  glow={!isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw size={20} className="animate-spin" />
                      Confirming Booking...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle size={20} />
                      Confirm Booking
                    </span>
                  )}
                </BrutalistButton>
              </form>
            </motion.div>
          )}

        {/* Step 4: Confirmation */}
        {currentStep === "confirmation" && bookingResult && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-wider font-mono mb-4">
                Booking Confirmed!
              </h3>
              <p className="font-mono text-lg opacity-80">
                Your consultation has been successfully scheduled
              </p>
            </div>

            {/* Booking Details */}
            <div className="bg-brutalist-yellow border-3 border-black p-6 mb-8">
              <h4 className="font-mono font-black text-lg mb-4 uppercase tracking-wider">
                Booking Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
                <div>
                  <div className="font-bold mb-2">Consultation Type:</div>
                  <div>
                    {
                      CONSULTATION_TYPES.find(
                        (t) => t.id === bookingResult.consultationType
                      )?.title
                    }
                  </div>
                </div>
                <div>
                  <div className="font-bold mb-2">Date & Time:</div>
                  <div>{formatTimeSlot(bookingResult.timeSlot)}</div>
                </div>
                <div>
                  <div className="font-bold mb-2">Meeting Link:</div>
                  <a
                    href={bookingResult.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {bookingResult.meetingLink}
                  </a>
                </div>
                <div>
                  <div className="font-bold mb-2">Booking ID:</div>
                  <div className="font-mono text-sm">{bookingResult.id}</div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white border-3 border-black p-6 mb-8">
              <h4 className="font-mono font-black text-lg mb-4 uppercase tracking-wider">
                What's Next?
              </h4>
              <ul className="space-y-2 font-mono">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>
                    Confirmation email sent to {bookingResult.clientEmail}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Calendar invite with meeting link included</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>
                    You'll receive a reminder 24 hours before the meeting
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Meeting materials will be shared 1 hour before</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BrutalistButton
                onClick={resetBooking}
                variant="secondary"
                size="lg"
              >
                <Plus size={20} className="mr-2" />
                Book Another
              </BrutalistButton>
              <BrutalistButton
                onClick={() => window.open(bookingResult.meetingLink, "_blank")}
                variant="accent"
                size="lg"
              >
                <Video size={20} className="mr-2" />
                Test Meeting Link
              </BrutalistButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntegratedCalendarBooking;
