"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import BrutalistButton from "./BrutalistButton";
import BrutalistCard from "./BrutalistCard";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface ConsultationBookingProps {
  className?: string;
  onBookingSubmit?: (booking: {
    date: string;
    time: string;
    name: string;
    email: string;
    phone: string;
    projectType: string;
    message: string;
  }) => void;
}

const TIME_SLOTS: TimeSlot[] = [
  { id: "09:00", time: "9:00 AM", available: true },
  { id: "10:00", time: "10:00 AM", available: true },
  { id: "11:00", time: "11:00 AM", available: false },
  { id: "14:00", time: "2:00 PM", available: true },
  { id: "15:00", time: "3:00 PM", available: true },
  { id: "16:00", time: "4:00 PM", available: true },
];

const PROJECT_TYPES = [
  "React Application",
  "E-commerce Platform",
  "SaaS Platform",
  "Mobile App",
  "Website Redesign",
  "Performance Optimization",
  "Other",
];

const ConsultationBooking: React.FC<ConsultationBookingProps> = ({
  className,
  onBookingSubmit,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate next 14 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          value: date.toISOString().split("T")[0],
          label: date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
        });
      }
    }

    return dates;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !formData.name || !formData.email) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      onBookingSubmit?.({
        date: selectedDate,
        time: selectedTime,
        ...formData,
      });

      // Reset form
      setSelectedDate("");
      setSelectedTime("");
      setFormData({
        name: "",
        email: "",
        phone: "",
        projectType: "",
        message: "",
      });
    } catch (error) {
      console.error("Booking submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    selectedDate && selectedTime && formData.name && formData.email;

  return (
    <div className={cn("w-full", className)}>
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
          Schedule a free 30-minute consultation to discuss your project
          requirements and get personalized recommendations.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Left Column - Date & Time Selection */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Date Selection */}
          <div>
            <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-6 border-b-3 border-black pb-2 flex items-center gap-3">
              <Calendar size={20} />
              Select Date
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {getAvailableDates().map((date) => (
                <button
                  key={date.value}
                  onClick={() => setSelectedDate(date.value)}
                  className={cn(
                    "p-3 border-3 border-black font-mono font-bold text-sm transition-all duration-300",
                    "hover:bg-brutalist-yellow hover:transform hover:-translate-y-1",
                    selectedDate === date.value
                      ? "bg-brutalist-yellow border-black"
                      : "bg-brutalist-light-gray hover:bg-gray-50"
                  )}
                >
                  {date.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-6 border-b-3 border-black pb-2 flex items-center gap-3">
              <Clock size={20} />
              Select Time
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => slot.available && setSelectedTime(slot.id)}
                  disabled={!slot.available}
                  className={cn(
                    "p-3 border-3 border-black font-mono font-bold text-sm transition-all duration-300",
                    slot.available
                      ? "hover:bg-brutalist-yellow hover:transform hover:-translate-y-1"
                      : "opacity-50 cursor-not-allowed bg-gray-100",
                    selectedTime === slot.id
                      ? "bg-brutalist-yellow border-black"
                      : slot.available
                      ? "bg-brutalist-light-gray hover:bg-gray-50"
                      : "bg-gray-100"
                  )}
                >
                  {slot.time}
                  {!slot.available && (
                    <div className="text-xs opacity-60 mt-1">Booked</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <BrutalistCard
            title="Your Information"
            description=""
            className="h-fit"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                  <User size={16} />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-2">
                  Project Type
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  className="w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300"
                >
                  <option value="">Select project type</option>
                  {PROJECT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                  <MessageSquare size={16} />
                  Project Details
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300 resize-none"
                  placeholder="Tell me about your project requirements, goals, and timeline..."
                />
              </div>

              {/* Submit Button */}
              <BrutalistButton
                type="submit"
                variant="accent"
                size="lg"
                glow
                disabled={!isFormValid || isSubmitting}
                className="w-full"
                ariaLabel="Book consultation"
              >
                {isSubmitting ? "Booking..." : "Book Free Consultation"}
              </BrutalistButton>
            </form>
          </BrutalistCard>

          {/* Consultation Info */}
          <motion.div
            className="mt-6 p-6 border-3 border-black bg-brutalist-yellow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="font-mono font-black text-lg mb-3 uppercase tracking-wider">
              What to Expect
            </h4>
            <ul className="space-y-2 font-mono text-sm">
              <li className="flex items-start gap-2">
                <span className="text-black">•</span>
                <span>30-minute video call via Google Meet or Zoom</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black">•</span>
                <span>Discussion of your project requirements and goals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black">•</span>
                <span>Technical recommendations and approach overview</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black">•</span>
                <span>Timeline and budget estimation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black">•</span>
                <span>
                  Next steps and project proposal (if we&apos;re a good fit)
                </span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ConsultationBooking;
