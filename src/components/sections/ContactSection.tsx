"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  Phone,
  Calendar,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  User,
  MessageSquare,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import BrutalistButton from "../ui/BrutalistButton";

// Zod validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  projectType: z.string().min(1, "Please select a project type"),
  budget: z.string().min(1, "Please select a budget range"),
  timeline: z.string().min(1, "Please select a timeline"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export interface ContactSectionProps {
  className?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ className }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simulate API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Form submitted:", data);
      setSubmitStatus("success");
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectTypes = [
    { value: "website", label: "Business Website" },
    { value: "ecommerce", label: "E-commerce Store" },
    { value: "saas", label: "SaaS Platform" },
    { value: "mobile", label: "Mobile App" },
    { value: "other", label: "Other" },
  ];

  const budgetRanges = [
    { value: "2500-5000", label: "$2,500 - $5,000" },
    { value: "5000-10000", label: "$5,000 - $10,000" },
    { value: "10000+", label: "$10,000+" },
    { value: "not-sure", label: "Not Sure Yet" },
  ];

  const timelines = [
    { value: "asap", label: "ASAP" },
    { value: "1-month", label: "Within 1 Month" },
    { value: "2-3-months", label: "2-3 Months" },
    { value: "flexible", label: "Flexible" },
  ];

  return (
    <section className={cn("py-16 lg:py-24", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-wider mb-6 font-mono">
            Let&apos;s Work Together
          </h2>
          <p className="text-lg font-medium opacity-80 max-w-2xl mx-auto font-mono leading-relaxed">
            Ready to bring your vision to life? Get in touch and let&apos;s
            discuss your project.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Response Time Guarantee */}
            <div className="bg-brutalist-yellow border-5 border-black p-6">
              <div className="flex items-center gap-4 mb-4">
                <Clock size={24} className="text-black" />
                <h3 className="text-xl font-black uppercase tracking-wider font-mono">
                  Response Guarantee
                </h3>
              </div>
              <p className="font-mono font-medium">
                I respond to all inquiries within <strong>4 hours</strong>{" "}
                during business hours. Your project deserves immediate
                attention.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase tracking-wider font-mono mb-6">
                Get In Touch
              </h3>

              {/* Email */}
              <motion.div
                className="flex items-center gap-4 p-4 border-3 border-black bg-white hover:bg-black hover:text-white transition-all duration-300"
                whileHover={{ x: 4, y: -4, boxShadow: "4px 4px 0px #000000" }}
              >
                <Mail size={24} />
                <div>
                  <div className="font-black uppercase text-sm tracking-wider">
                    Email
                  </div>
                  <div className="font-mono">hello@yourname.dev</div>
                </div>
              </motion.div>

              {/* Calendar Booking */}
              <motion.div
                className="flex items-center gap-4 p-4 border-3 border-black bg-white hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
                whileHover={{ x: 4, y: -4, boxShadow: "4px 4px 0px #000000" }}
                onClick={() =>
                  window.open("https://calendly.com/yourname", "_blank")
                }
              >
                <Calendar size={24} />
                <div>
                  <div className="font-black uppercase text-sm tracking-wider">
                    Book a Call
                  </div>
                  <div className="font-mono">Schedule a free consultation</div>
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div
                className="flex items-center gap-4 p-4 border-3 border-black bg-white hover:bg-black hover:text-white transition-all duration-300"
                whileHover={{ x: 4, y: -4, boxShadow: "4px 4px 0px #000000" }}
              >
                <Phone size={24} />
                <div>
                  <div className="font-black uppercase text-sm tracking-wider">
                    Phone
                  </div>
                  <div className="font-mono">+1 (555) 123-4567</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black uppercase tracking-wider mb-2 font-mono">
                    <User size={16} className="inline mr-2" />
                    Name *
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    className={cn(
                      "w-full p-4 border-3 border-black font-mono font-medium",
                      "focus:outline-none focus:ring-4 focus:ring-brutalist-yellow focus:ring-opacity-50",
                      "transition-all duration-300",
                      errors.name && "border-red-500 bg-red-50"
                    )}
                    placeholder="Your Name"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 font-mono flex items-center gap-2">
                      <AlertCircle size={16} />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-black uppercase tracking-wider mb-2 font-mono">
                    <Mail size={16} className="inline mr-2" />
                    Email *
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className={cn(
                      "w-full p-4 border-3 border-black font-mono font-medium",
                      "focus:outline-none focus:ring-4 focus:ring-brutalist-yellow focus:ring-opacity-50",
                      "transition-all duration-300",
                      errors.email && "border-red-500 bg-red-50"
                    )}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 font-mono flex items-center gap-2">
                      <AlertCircle size={16} />
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-black uppercase tracking-wider mb-2 font-mono">
                  <Briefcase size={16} className="inline mr-2" />
                  Company (Optional)
                </label>
                <input
                  {...register("company")}
                  type="text"
                  className="w-full p-4 border-3 border-black font-mono font-medium focus:outline-none focus:ring-4 focus:ring-brutalist-yellow focus:ring-opacity-50 transition-all duration-300"
                  placeholder="Your Company"
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-sm font-black uppercase tracking-wider mb-2 font-mono">
                  Project Type *
                </label>
                <select
                  {...register("projectType")}
                  className={cn(
                    "w-full p-4 border-3 border-black font-mono font-medium",
                    "focus:outline-none focus:ring-4 focus:ring-brutalist-yellow focus:ring-opacity-50",
                    "transition-all duration-300",
                    errors.projectType && "border-red-500 bg-red-50"
                  )}
                >
                  <option value="">Select Project Type</option>
                  {projectTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.projectType && (
                  <p className="mt-2 text-sm text-red-600 font-mono flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.projectType.message}
                  </p>
                )}
              </div>

              {/* Budget and Timeline Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black uppercase tracking-wider mb-2 font-mono">
                    Budget Range *
                  </label>
                  <select
                    {...register("budget")}
                    className={cn(
                      "w-full p-4 border-3 border-black font-mono font-medium",
                      "focus:outline-none focus:ring-4 focus:ring-brutalist-yellow focus:ring-opacity-50",
                      "transition-all duration-300",
                      errors.budget && "border-red-500 bg-red-50"
                    )}
                  >
                    <option value="">Select Budget</option>
                    {budgetRanges.map((budget) => (
                      <option key={budget.value} value={budget.value}>
                        {budget.label}
                      </option>
                    ))}
                  </select>
                  {errors.budget && (
                    <p className="mt-2 text-sm text-red-600 font-mono flex items-center gap-2">
                      <AlertCircle size={16} />
                      {errors.budget.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-black uppercase tracking-wider mb-2 font-mono">
                    Timeline *
                  </label>
                  <select
                    {...register("timeline")}
                    className={cn(
                      "w-full p-4 border-3 border-black font-mono font-medium",
                      "focus:outline-none focus:ring-4 focus:ring-brutalist-yellow focus:ring-opacity-50",
                      "transition-all duration-300",
                      errors.timeline && "border-red-500 bg-red-50"
                    )}
                  >
                    <option value="">Select Timeline</option>
                    {timelines.map((timeline) => (
                      <option key={timeline.value} value={timeline.value}>
                        {timeline.label}
                      </option>
                    ))}
                  </select>
                  {errors.timeline && (
                    <p className="mt-2 text-sm text-red-600 font-mono flex items-center gap-2">
                      <AlertCircle size={16} />
                      {errors.timeline.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-black uppercase tracking-wider mb-2 font-mono">
                  <MessageSquare size={16} className="inline mr-2" />
                  Project Details *
                </label>
                <textarea
                  {...register("message")}
                  rows={6}
                  className={cn(
                    "w-full p-4 border-3 border-black font-mono font-medium resize-none",
                    "focus:outline-none focus:ring-4 focus:ring-brutalist-yellow focus:ring-opacity-50",
                    "transition-all duration-300",
                    errors.message && "border-red-500 bg-red-50"
                  )}
                  placeholder="Tell me about your project, goals, and any specific requirements..."
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-red-600 font-mono flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
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
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={20} />
                      Send Message
                    </span>
                  )}
                </BrutalistButton>
              </div>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <motion.div
                  className="p-4 bg-green-100 border-3 border-green-500 text-green-800 font-mono flex items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CheckCircle size={20} />
                  <span className="font-medium">
                    Message sent successfully! I&apos;ll get back to you within
                    4 hours.
                  </span>
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  className="p-4 bg-red-100 border-3 border-red-500 text-red-800 font-mono flex items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle size={20} />
                  <span className="font-medium">
                    Something went wrong. Please try again or email me directly.
                  </span>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
