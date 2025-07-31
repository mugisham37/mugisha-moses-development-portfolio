import type { Metadata } from "next";
import ContactSection from "@/components/sections/ContactSection";
import ContactInfo from "@/components/sections/ContactInfo";
import ConsultationBooking from "@/components/ui/ConsultationBooking";
import { Clock, MapPin, CheckCircle, Globe } from "lucide-react";
import {
  generateMetadata as generateSEOMetadata,
  generateFAQStructuredData,
} from "@/lib/seo";

// SEO optimization for contact page
export const metadata: Metadata = generateSEOMetadata({
  title: "Contact | Get Your Free Web Development Consultation",
  description:
    "Get in touch to discuss your project. Multiple contact methods available with guaranteed 4-hour response time during business hours. Free consultation included.",
  keywords:
    "contact web developer, free consultation, project quote, web development inquiry, hire developer, React developer contact",
  path: "/contact",
});

export default function Contact() {
  const contactFAQs = [
    {
      question: "How quickly do you respond to inquiries?",
      answer:
        "I guarantee a response within 4 hours during business hours (Monday-Friday, 9 AM - 6 PM EST). For weekend inquiries, I typically respond by Monday morning.",
    },
    {
      question: "What information should I include in my initial contact?",
      answer:
        "Please include: project type, timeline, budget range, and a brief description of your goals. The more details you provide, the better I can tailor my response to your needs.",
    },
    {
      question: "Do you offer free consultations?",
      answer:
        "Yes! I offer a free 30-minute consultation to discuss your project requirements, provide technical recommendations, and determine if we're a good fit to work together.",
    },
    {
      question: "What's your current availability?",
      answer:
        "I'm currently accepting new projects with start dates from February 15, 2025. However, I can begin discovery and planning phases earlier to ensure a smooth project launch.",
    },
  ];

  return (
    <>
      {/* Structured Data for Contact Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            mainEntity: {
              "@type": "Person",
              name: "Professional Web Developer",
              jobTitle: "Full-Stack Web Developer",
              telephone: "+1-555-0123",
              email: "hello@yourportfolio.com",
              url: "/contact",
              address: {
                "@type": "PostalAddress",
                addressLocality: "San Francisco",
                addressRegion: "CA",
                addressCountry: "US",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-555-0123",
                contactType: "customer service",
                email: "hello@yourportfolio.com",
                availableLanguage: "English",
                hoursAvailable: {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
                  opens: "09:00",
                  closes: "18:00",
                },
              },
            },
          }),
        }}
      />

      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQStructuredData(contactFAQs)),
        }}
      />

      <div className="min-h-screen bg-brutalist-white">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 border-b-5 border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider mb-6 font-mono">
                Let&apos;s Connect
              </h1>
              <p className="text-xl font-mono font-bold opacity-80 max-w-3xl mx-auto leading-relaxed">
                Ready to bring your vision to life? Choose your preferred way to
                get in touch. I respond to all inquiries within 4 hours during
                business hours.
              </p>
            </div>
          </div>
        </section>

        {/* Office Hours & Availability */}
        <section className="py-12 bg-brutalist-yellow border-b-5 border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Office Hours */}
              <div className="bg-white border-3 border-black p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock size={24} className="text-black" />
                  <h3 className="text-lg font-black uppercase tracking-wider font-mono">
                    Office Hours
                  </h3>
                </div>
                <div className="space-y-2 font-mono font-medium">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-black">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-black">10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="opacity-60">Closed</span>
                  </div>
                  <div className="text-xs opacity-80 mt-3">
                    * All times in EST (UTC-5)
                  </div>
                </div>
              </div>

              {/* Current Availability */}
              <div className="bg-white border-3 border-black p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-black uppercase tracking-wider font-mono">
                    Current Status
                  </h3>
                </div>
                <div className="space-y-3 font-mono">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="font-bold text-green-600">
                      Available for New Projects
                    </span>
                  </div>
                  <div className="text-sm opacity-80">
                    <strong>Next Available Start:</strong> February 15, 2025
                  </div>
                  <div className="text-sm opacity-80">
                    <strong>Response Time:</strong> Within 4 hours
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white border-3 border-black p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin size={24} className="text-black" />
                  <h3 className="text-lg font-black uppercase tracking-wider font-mono">
                    Location
                  </h3>
                </div>
                <div className="space-y-2 font-mono font-medium">
                  <div>San Francisco, CA</div>
                  <div className="text-sm opacity-80">
                    Working with clients worldwide
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe size={14} />
                    <span>Remote-first approach</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <ContactInfo className="border-b-5 border-black" />

        {/* Calendar Booking Section */}
        <section className="py-16 lg:py-24 bg-gray-50 border-b-5 border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ConsultationBooking
              onBookingSubmit={(booking) => {
                console.log("Booking submitted:", booking);
                // Handle booking submission
              }}
            />
          </div>
        </section>

        {/* Main Contact Form */}
        <ContactSection />

        {/* FAQ Section */}
        <section className="py-16 lg:py-24 bg-brutalist-yellow border-b-5 border-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black uppercase tracking-wider font-mono text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {contactFAQs.map((faq, index) => (
                <div key={index} className="bg-white border-3 border-black p-6">
                  <h3 className="text-lg font-black font-mono mb-3">
                    {faq.question}
                  </h3>
                  <p className="font-mono">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
