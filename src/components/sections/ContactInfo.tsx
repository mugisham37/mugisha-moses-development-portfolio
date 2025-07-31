"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContactInfoProps {
  className?: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ className }) => {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      subtitle: "Best for detailed inquiries",
      value: "hello@yourname.dev",
      description: "Response within 4 hours",
      href: "mailto:hello@yourname.dev",
      color: "text-blue-600",
    },
    {
      icon: Phone,
      title: "Phone",
      subtitle: "For urgent matters",
      value: "+1 (555) 123-4567",
      description: "Available during office hours",
      href: "tel:+15551234567",
      color: "text-green-600",
    },
    {
      icon: Calendar,
      title: "Schedule Call",
      subtitle: "Book a free consultation",
      value: "Free 30-min consultation",
      description: "Available slots updated daily",
      href: "https://calendly.com/yourname",
      color: "text-purple-600",
    },
  ];

  const businessInfo = [
    {
      icon: Clock,
      title: "Office Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 10:00 AM - 2:00 PM",
        "Sunday: Closed",
        "* All times in EST (UTC-5)",
      ],
    },
    {
      icon: CheckCircle,
      title: "Current Status",
      details: [
        "✅ Available for New Projects",
        "📅 Next Available Start: February 15, 2025",
        "⚡ Response Time: Within 4 hours",
        "🌍 Working with clients worldwide",
      ],
    },
    {
      icon: MapPin,
      title: "Location",
      details: [
        "📍 San Francisco, CA",
        "🌐 Remote-first approach",
        "✈️ Available for travel (select projects)",
        "🕐 Multiple timezone experience",
      ],
    },
  ];

  return (
    <section className={cn("py-16 lg:py-24", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quick Contact Methods */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-black uppercase tracking-wider font-mono text-center mb-12">
            Quick Contact Options
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <motion.a
                  key={method.title}
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    method.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group bg-white border-3 border-black p-6 hover:bg-black hover:text-white transition-all duration-300 block"
                  whileHover={{
                    x: 4,
                    y: -4,
                    boxShadow: "4px 4px 0px #ffff00",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <IconComponent
                      size={32}
                      className="group-hover:text-brutalist-yellow transition-colors"
                    />
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-wider font-mono">
                        {method.title}
                      </h3>
                      <p className="font-mono text-sm opacity-80">
                        {method.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="font-mono font-bold mb-2">{method.value}</div>
                  <div className="text-sm font-mono opacity-60">
                    {method.description}
                  </div>
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Business Information */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {businessInfo.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <motion.div
                key={info.title}
                className="bg-white border-3 border-black p-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <IconComponent size={24} className="text-black" />
                  <h3 className="text-lg font-black uppercase tracking-wider font-mono">
                    {info.title}
                  </h3>
                </div>
                <div className="space-y-2 font-mono font-medium text-sm">
                  {info.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="opacity-80">
                      {detail}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Response Guarantee */}
        <motion.div
          className="mt-12 bg-brutalist-yellow border-5 border-black p-8 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Zap size={32} className="text-black" />
            <h3 className="text-2xl font-black uppercase tracking-wider font-mono">
              Response Guarantee
            </h3>
          </div>
          <p className="font-mono font-bold text-lg max-w-3xl mx-auto">
            I respond to all inquiries within{" "}
            <span className="bg-black text-white px-2 py-1">4 hours</span>{" "}
            during business hours. Your project deserves immediate attention,
            and I&apos;m committed to providing quick, thoughtful responses to
            help you move forward.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactInfo;
