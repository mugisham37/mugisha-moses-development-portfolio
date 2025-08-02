"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MessageSquare,
  Video,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Star,
  Zap,
  Globe,
  Shield,
  Users,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ContactChannel, ContactPreference } from "@/types/enhanced";

export interface MultiChannelContactHubProps {
  className?: string;
  onChannelSelect?: (channel: ContactChannel) => void;
  onEmergencyContact?: () => void;
}

interface ContactMethod {
  id: ContactChannel;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  responseTime: string;
  availability: "available" | "busy" | "offline";
  useCases: string[];
  preferred: boolean;
  emergencyAvailable: boolean;
  contactInfo: string;
  action: () => void;
}

const MultiChannelContactHub: React.FC<MultiChannelContactHubProps> = ({
  className,
  onChannelSelect,
  onEmergencyContact,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<ContactChannel | null>(
    null
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  // Update current time every minute for real-time availability
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Determine availability based on current time
  const getAvailabilityStatus = (): "available" | "busy" | "offline" => {
    const hour = currentTime.getHours();
    const day = currentTime.getDay();

    // Weekend check
    if (day === 0) return "offline"; // Sunday
    if (day === 6 && hour > 14) return "offline"; // Saturday after 2 PM

    // Business hours: 9 AM - 6 PM weekdays, 10 AM - 2 PM Saturday
    if (day >= 1 && day <= 5) {
      if (hour >= 9 && hour < 18) return "available";
      if (hour >= 18 && hour < 20) return "busy"; // Extended hours
    } else if (day === 6) {
      if (hour >= 10 && hour < 14) return "available";
    }

    return "offline";
  };

  const currentAvailability = getAvailabilityStatus();

  const contactMethods: ContactMethod[] = [
    {
      id: "email",
      icon: Mail,
      title: "Email",
      subtitle: "Best for detailed inquiries",
      description:
        "Perfect for project details, requirements, and formal communication",
      responseTime:
        currentAvailability === "available"
          ? "Within 2 hours"
          : "Within 4 hours",
      availability: "available", // Email is always available
      useCases: [
        "Project inquiries and detailed requirements",
        "Technical questions and documentation",
        "Contract discussions and proposals",
        "File sharing and attachments",
      ],
      preferred: true,
      emergencyAvailable: false,
      contactInfo: "hello@yourname.dev",
      action: () => window.open("mailto:hello@yourname.dev", "_blank"),
    },
    {
      id: "phone",
      icon: Phone,
      title: "Phone Call",
      subtitle: "For urgent matters",
      description: "Direct voice communication for immediate discussion",
      responseTime:
        currentAvailability === "available"
          ? "Immediate"
          : "Call back within 1 hour",
      availability: currentAvailability,
      useCases: [
        "Urgent project issues or blockers",
        "Quick clarifications and decisions",
        "Emergency support requests",
        "Real-time problem solving",
      ],
      preferred: false,
      emergencyAvailable: true,
      contactInfo: "+1 (555) 123-4567",
      action: () => window.open("tel:+15551234567", "_blank"),
    },
    {
      id: "video",
      icon: Video,
      title: "Video Call",
      subtitle: "Face-to-face consultation",
      description:
        "Screen sharing and visual collaboration for complex discussions",
      responseTime: "Schedule within 24 hours",
      availability: currentAvailability === "offline" ? "offline" : "available",
      useCases: [
        "Project kickoff meetings",
        "Design reviews and feedback",
        "Technical architecture discussions",
        "Progress updates and demos",
      ],
      preferred: true,
      emergencyAvailable: false,
      contactInfo: "Schedule via calendar",
      action: () => window.open("https://calendly.com/yourname", "_blank"),
    },
    {
      id: "chat",
      icon: MessageSquare,
      title: "Live Chat",
      subtitle: "Quick questions",
      description: "Real-time messaging for immediate responses",
      responseTime:
        currentAvailability === "available" ? "Immediate" : "Next business day",
      availability: currentAvailability,
      useCases: [
        "Quick questions and clarifications",
        "Status updates and check-ins",
        "Scheduling and coordination",
        "General inquiries",
      ],
      preferred: false,
      emergencyAvailable: false,
      contactInfo: "Available during business hours",
      action: () => {
        // In a real implementation, this would open a chat widget
        alert("Live chat feature coming soon!");
      },
    },
  ];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "text-green-600 bg-green-100";
      case "busy":
        return "text-yellow-600 bg-yellow-100";
      case "offline":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case "available":
        return <CheckCircle size={16} />;
      case "busy":
        return <Clock size={16} />;
      case "offline":
        return <AlertTriangle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const handleChannelSelect = (method: ContactMethod) => {
    setSelectedChannel(method.id);
    onChannelSelect?.(method.id);
    method.action();
  };

  const handleEmergencyContact = () => {
    setIsEmergencyMode(true);
    onEmergencyContact?.();
    // Show emergency contact options
    window.open("tel:+15551234567", "_blank");
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider font-mono mb-4">
          Contact Hub
        </h2>
        <p className="text-lg font-mono font-bold opacity-80 max-w-3xl mx-auto">
          Choose your preferred communication method. All channels monitored
          with guaranteed response times.
        </p>
      </motion.div>

      {/* Current Status Banner */}
      <motion.div
        className={cn(
          "mb-8 p-4 border-3 border-black font-mono text-center",
          getAvailabilityColor(currentAvailability)
        )}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          {getAvailabilityIcon(currentAvailability)}
          <span className="font-black uppercase tracking-wider">
            Current Status:{" "}
            {currentAvailability.charAt(0).toUpperCase() +
              currentAvailability.slice(1)}
          </span>
        </div>
        <div className="text-sm opacity-80">
          {currentAvailability === "available" &&
            "Ready to help! Fastest response times right now."}
          {currentAvailability === "busy" &&
            "Currently in meetings. Will respond as soon as possible."}
          {currentAvailability === "offline" &&
            "Outside business hours. Will respond first thing tomorrow."}
        </div>
      </motion.div>

      {/* Contact Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {contactMethods.map((method, index) => {
          const IconComponent = method.icon;
          const isSelected = selectedChannel === method.id;

          return (
            <motion.div
              key={method.id}
              className={cn(
                "bg-white border-3 border-black p-6 cursor-pointer transition-all duration-300",
                "hover:bg-brutalist-yellow hover:transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000000]",
                isSelected &&
                  "bg-brutalist-yellow transform -translate-y-1 shadow-[4px_4px_0px_#000000]"
              )}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => handleChannelSelect(method)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <IconComponent size={24} className="text-black" />
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-wider font-mono">
                      {method.title}
                    </h3>
                    <p className="font-mono text-sm opacity-80">
                      {method.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {method.preferred && (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Star size={16} fill="currentColor" />
                      <span className="text-xs font-mono font-bold">
                        PREFERRED
                      </span>
                    </div>
                  )}
                  {method.emergencyAvailable && (
                    <div className="flex items-center gap-1 text-red-600">
                      <Zap size={16} />
                      <span className="text-xs font-mono font-bold">
                        EMERGENCY
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Availability Status */}
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1 rounded-none border-2 border-black text-sm font-mono font-bold mb-4",
                  getAvailabilityColor(method.availability)
                )}
              >
                {getAvailabilityIcon(method.availability)}
                <span className="uppercase">{method.availability}</span>
              </div>

              {/* Description */}
              <p className="font-mono text-sm mb-4 opacity-90">
                {method.description}
              </p>

              {/* Response Time */}
              <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 border-2 border-black">
                <Clock size={16} className="text-black" />
                <span className="font-mono font-bold text-sm">
                  Response Time: {method.responseTime}
                </span>
              </div>

              {/* Contact Info */}
              <div className="font-mono font-bold text-sm mb-4 text-center p-2 bg-black text-white">
                {method.contactInfo}
              </div>

              {/* Use Cases */}
              <div>
                <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-2">
                  Best For:
                </h4>
                <ul className="space-y-1">
                  {method.useCases.slice(0, 2).map((useCase, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm font-mono"
                    >
                      <span className="text-black mt-1">•</span>
                      <span className="opacity-80">{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Emergency Contact Section */}
      <motion.div
        className="bg-red-50 border-3 border-red-500 p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={24} className="text-red-600" />
          <h3 className="text-xl font-black uppercase tracking-wider font-mono text-red-600">
            Emergency Contact
          </h3>
        </div>
        <p className="font-mono text-sm mb-4 text-red-800">
          For critical issues affecting live production systems or urgent
          project blockers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleEmergencyContact}
            className={cn(
              "flex items-center gap-2 px-6 py-3 border-3 border-red-600 bg-red-600 text-white",
              "font-mono font-black uppercase text-sm tracking-wider",
              "hover:bg-red-700 hover:border-red-700 transition-colors duration-300"
            )}
          >
            <Phone size={16} />
            Emergency Call
          </button>
          <div className="flex items-center gap-2 text-sm font-mono text-red-700">
            <Shield size={16} />
            <span>Available 24/7 for critical issues</span>
          </div>
        </div>
      </motion.div>

      {/* Channel Details Modal */}
      <AnimatePresence>
        {selectedChannel && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedChannel(null)}
          >
            <motion.div
              className="bg-white border-5 border-black p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const method = contactMethods.find(
                  (m) => m.id === selectedChannel
                );
                if (!method) return null;
                const IconComponent = method.icon;

                return (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <IconComponent size={32} className="text-black" />
                      <h3 className="text-2xl font-black uppercase tracking-wider font-mono">
                        {method.title} Details
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-mono font-bold text-lg mb-3 uppercase tracking-wider">
                          All Use Cases:
                        </h4>
                        <ul className="space-y-2">
                          {method.useCases.map((useCase, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 font-mono"
                            >
                              <span className="text-black mt-1">•</span>
                              <span>{useCase}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border-2 border-black bg-gray-50">
                          <h5 className="font-mono font-bold mb-2 uppercase tracking-wider">
                            Response Time
                          </h5>
                          <p className="font-mono text-sm">
                            {method.responseTime}
                          </p>
                        </div>
                        <div className="p-4 border-2 border-black bg-gray-50">
                          <h5 className="font-mono font-bold mb-2 uppercase tracking-wider">
                            Availability
                          </h5>
                          <div
                            className={cn(
                              "inline-flex items-center gap-2 px-2 py-1 text-sm font-mono font-bold",
                              getAvailabilityColor(method.availability)
                            )}
                          >
                            {getAvailabilityIcon(method.availability)}
                            <span className="uppercase">
                              {method.availability}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedChannel(null)}
                        className={cn(
                          "w-full px-6 py-3 border-3 border-black bg-brutalist-yellow",
                          "font-mono font-black uppercase text-sm tracking-wider",
                          "hover:bg-black hover:text-brutalist-yellow transition-colors duration-300"
                        )}
                      >
                        Close Details
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultiChannelContactHub;
