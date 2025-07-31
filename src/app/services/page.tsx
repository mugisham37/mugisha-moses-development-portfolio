import type { Metadata } from "next";
import {
  ServicesGrid,
  ProcessTimeline,
  TestimonialsCarousel,
  CTASection,
} from "@/components/sections";
import { PricingCards } from "@/components/ui";
import ServicesInteractive from "@/components/sections/ServicesInteractive";

// SEO optimization for services page
export const metadata: Metadata = {
  title: "Web Development Services | React, Next.js & E-commerce Solutions",
  description:
    "Professional web development services including React applications, e-commerce platforms, SaaS solutions, and custom web development. Get a free consultation and project quote.",
  keywords: [
    "web development services",
    "React development",
    "Next.js development",
    "e-commerce development",
    "SaaS development",
    "custom web development",
    "frontend development",
    "full-stack development",
    "web application development",
    "consultation",
    "project quote",
  ].join(", "),
  openGraph: {
    title: "Web Development Services | React, Next.js & E-commerce Solutions",
    description:
      "Professional web development services with transparent pricing and proven results. Specializing in React, Next.js, and high-converting digital experiences.",
    type: "website",
    url: "/services",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Development Services | React, Next.js & E-commerce Solutions",
    description:
      "Professional web development services with transparent pricing and proven results. Specializing in React, Next.js, and high-converting digital experiences.",
  },
  alternates: {
    canonical: "/services",
  },
};

export default function Services() {
  return (
    <>
      {/* Structured Data for Services Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Web Development Services",
            description:
              "Professional web development services including React applications, e-commerce platforms, and SaaS solutions.",
            provider: {
              "@type": "Person",
              name: "Professional Web Developer",
              jobTitle: "Full-Stack Web Developer",
            },
            serviceType: "Web Development",
            areaServed: "Worldwide",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Web Development Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "React Application Development",
                    description:
                      "Custom React applications with modern features and optimal performance",
                  },
                  priceRange: "$2,500 - $15,000",
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "E-commerce Platform Development",
                    description:
                      "High-converting online stores with payment integration and inventory management",
                  },
                  priceRange: "$5,000 - $25,000",
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "SaaS Platform Development",
                    description:
                      "Scalable software-as-a-service platforms with user management and analytics",
                  },
                  priceRange: "$10,000 - $50,000",
                },
              ],
            },
          }),
        }}
      />

      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <section className="bg-brutalist-black py-20 border-b-5 border-brutalist-yellow">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black font-mono uppercase tracking-wider text-white mb-6">
              SERVICES
            </h1>
            <p className="text-xl md:text-2xl font-mono font-bold text-brutalist-gray max-w-4xl mx-auto leading-relaxed mb-8">
              Professional web development services that transform your ideas
              into high-converting digital experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-brutalist-yellow border-3 border-white px-6 py-3 font-mono font-bold text-black">
                Free Consultation
              </div>
              <div className="bg-white border-3 border-brutalist-yellow px-6 py-3 font-mono font-bold text-black">
                4-Hour Response Time
              </div>
              <div className="bg-brutalist-yellow border-3 border-white px-6 py-3 font-mono font-bold text-black">
                100% Satisfaction Guarantee
              </div>
            </div>
          </div>
        </section>

        {/* Main Services Grid */}
        <section className="bg-white py-20 border-b-5 border-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-6">
                Core Services
              </h2>
              <p className="text-lg font-mono font-bold opacity-80 max-w-3xl mx-auto">
                Specialized web development services designed to drive business
                growth and deliver exceptional user experiences.
              </p>
            </div>
            <ServicesGrid />
          </div>
        </section>

        {/* Detailed Service Offerings */}
        <section className="bg-brutalist-black py-20 border-b-5 border-brutalist-yellow">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider text-white mb-6">
                Detailed Offerings
              </h2>
              <p className="text-lg font-mono font-bold text-brutalist-gray max-w-3xl mx-auto">
                Comprehensive breakdown of what&apos;s included in each service
                package.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* React Development */}
              <div className="border-5 border-brutalist-yellow bg-white p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto bg-brutalist-yellow border-3 border-black flex items-center justify-center mb-4">
                    <span className="text-2xl">⚛️</span>
                  </div>
                  <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-2">
                    React Development
                  </h3>
                  <p className="font-mono text-sm opacity-80">
                    Modern, interactive web applications
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-mono font-bold text-sm uppercase tracking-wider border-b-2 border-black pb-2">
                    What&apos;s Included:
                  </h4>
                  <ul className="space-y-2 font-mono text-sm">
                    <li className="flex items-start space-x-2">
                      <span className="text-brutalist-yellow">•</span>
                      <span>Custom React component development</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-brutalist-yellow">•</span>
                      <span>State management (Redux/Zustand)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-brutalist-yellow">•</span>
                      <span>API integration and data fetching</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-brutalist-yellow">•</span>
                      <span>Responsive design implementation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-brutalist-yellow">•</span>
                      <span>Performance optimization</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-brutalist-yellow">•</span>
                      <span>Testing and quality assurance</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-brutalist-yellow">•</span>
                      <span>Deployment and hosting setup</span>
                    </li>
                  </ul>

                  <div className="pt-4 border-t-2 border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono font-bold text-sm">
                        Starting at:
                      </span>
                      <span className="font-mono font-black text-lg">
                        $2,500
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs opacity-80">
                        Timeline:
                      </span>
                      <span className="font-mono font-bold text-sm">
                        2-4 weeks
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* E-commerce Development */}
              <div className="border-5 border-brutalist-yellow bg-brutalist-yellow p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto bg-black border-3 border-white flex items-center justify-center mb-4">
                    <span className="text-2xl text-brutalist-yellow">🛒</span>
                  </div>
                  <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-2">
                    E-commerce Platforms
                  </h3>
                  <p className="font-mono text-sm opacity-80">
                    High-converting online stores
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-mono font-bold text-sm uppercase tracking-wider border-b-2 border-black pb-2">
                    What&apos;s Included:
                  </h4>
                  <ul className="space-y-2 font-mono text-sm">
                    <li className="flex items-start space-x-2">
                      <span className="text-black">•</span>
                      <span>Custom e-commerce platform</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-black">•</span>
                      <span>Payment gateway integration</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-black">•</span>
                      <span>Inventory management system</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-black">•</span>
                      <span>Order processing and tracking</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-black">•</span>
                      <span>Customer account management</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-black">•</span>
                      <span>Admin dashboard and analytics</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-black">•</span>
                      <span>SEO optimization and marketing tools</span>
                    </li>
                  </ul>

                  <div className="pt-4 border-t-2 border-black">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono font-bold text-sm">
                        Starting at:
                      </span>
                      <span className="font-mono font-black text-lg">
                        $5,000
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs opacity-80">
                        Timeline:
                      </span>
                      <span className="font-mono font-bold text-sm">
                        4-8 weeks
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SaaS Development */}
              <div className="border-5 border-brutalist-yellow bg-white p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto bg-brutalist-yellow border-3 border-black flex items-center justify-center mb-4">
                    <span className="text-2xl">☁️</span>
                  </div>
                  <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-2">
                    SaaS Platforms
                  </h3>
                  <p className="font-mono text-sm opacity-80">
                    Scalable software solutions
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-mono font-bold text-sm uppercase tracking-wider border-b-2 border-black pb-2">
                    What&apos;s Included:
                  </h4>
                  <ul className="space-y-2 font-mono text-sm">
                    <li className="flex items-start space-x-2">
                      <span className="text-brutalist-yellow">•</span>
                      <span>Multi-tenant architecture</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-brutalist-yellow">•</span>
                      <span>User authentication and authorization</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-brutalist-yellow">•</span>
                      <span>Subscription and billing system</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-brutalist-yellow">•</span>
                      <span>Real-time analytics dashboard</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-brutalist-yellow">•</span>
                      <span>API development and documentation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-brutalist-yellow">•</span>
                      <span>Scalable cloud infrastructure</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-brutalist-yellow">•</span>
                      <span>Security and compliance features</span>
                    </li>
                  </ul>

                  <div className="pt-4 border-t-2 border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono font-bold text-sm">
                        Starting at:
                      </span>
                      <span className="font-mono font-black text-lg">
                        $10,000
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs opacity-80">
                        Timeline:
                      </span>
                      <span className="font-mono font-bold text-sm">
                        8-16 weeks
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Packages */}
        <section className="bg-white py-20 border-b-5 border-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-6">
                Service Packages
              </h2>
              <p className="text-lg font-mono font-bold opacity-80 max-w-3xl mx-auto">
                Transparent pricing with no hidden fees. Choose the package that
                fits your project needs and budget.
              </p>
            </div>
            <PricingCards />
          </div>
        </section>

        {/* Interactive Services Components */}
        <ServicesInteractive />

        {/* Development Process */}
        <section className="bg-brutalist-black py-20 border-b-5 border-brutalist-yellow">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider text-white mb-6">
                Development Process
              </h2>
              <p className="text-lg font-mono font-bold text-brutalist-gray max-w-3xl mx-auto">
                A proven 5-phase methodology that ensures quality, performance,
                and client satisfaction on every project.
              </p>
            </div>
            <ProcessTimeline />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white py-20 border-b-5 border-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-lg font-mono font-bold opacity-80 max-w-3xl mx-auto">
                Common questions about our web development services and process.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {[
                {
                  question: "What technologies do you specialize in?",
                  answer:
                    "I specialize in modern web technologies including React, Next.js, TypeScript, Node.js, and various databases. I stay current with the latest frameworks and best practices to deliver cutting-edge solutions.",
                },
                {
                  question: "How long does a typical project take?",
                  answer:
                    "Project timelines vary based on complexity. Simple React applications take 2-4 weeks, e-commerce platforms take 4-8 weeks, and complex SaaS solutions take 8-16 weeks. I provide detailed timelines during the discovery phase.",
                },
                {
                  question: "Do you provide ongoing support and maintenance?",
                  answer:
                    "Yes, I offer comprehensive post-launch support including bug fixes, security updates, performance monitoring, and feature enhancements. Support packages are available monthly or annually.",
                },
                {
                  question: "Can you work with existing codebases?",
                  answer:
                    "Absolutely. I can audit, optimize, and extend existing applications. Whether you need bug fixes, new features, or performance improvements, I can work with your current codebase.",
                },
                {
                  question: "What is your payment structure?",
                  answer:
                    "I typically work with a 50% upfront payment and 50% upon completion for smaller projects. Larger projects are broken into milestones with payments tied to deliverables. All pricing is transparent with no hidden fees.",
                },
                {
                  question: "Do you provide hosting and deployment services?",
                  answer:
                    "Yes, I handle the complete deployment process including hosting setup, domain configuration, SSL certificates, and ongoing monitoring. I work with platforms like Vercel, AWS, and other cloud providers.",
                },
                {
                  question: "How do you ensure project quality?",
                  answer:
                    "Quality is ensured through comprehensive testing, code reviews, performance optimization, and adherence to best practices. Every project includes automated testing, cross-browser compatibility checks, and performance audits.",
                },
                {
                  question: "Can you help with SEO and digital marketing?",
                  answer:
                    "Yes, all projects include basic SEO optimization, structured data, and performance optimization. For advanced digital marketing, I can recommend trusted partners or provide consultation on technical SEO aspects.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="border-5 border-black bg-white p-6 hover:bg-brutalist-yellow transition-colors duration-300 group"
                >
                  <h3 className="text-lg font-black font-mono uppercase tracking-wider mb-4 group-hover:text-black">
                    {faq.question}
                  </h3>
                  <p className="font-mono leading-relaxed group-hover:text-black">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Comparisons */}
        <section className="bg-brutalist-black py-20 border-b-5 border-brutalist-yellow">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider text-white mb-6">
                Why Choose My Services
              </h2>
              <p className="text-lg font-mono font-bold text-brutalist-gray max-w-3xl mx-auto">
                Comparing my approach with typical web development services.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-5 border-brutalist-yellow bg-white">
                <thead>
                  <tr className="bg-brutalist-yellow">
                    <th className="border-3 border-black p-4 font-mono font-black text-left">
                      Feature
                    </th>
                    <th className="border-3 border-black p-4 font-mono font-black text-center">
                      My Service
                    </th>
                    <th className="border-3 border-black p-4 font-mono font-black text-center">
                      Typical Agency
                    </th>
                    <th className="border-3 border-black p-4 font-mono font-black text-center">
                      Freelancer
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      feature: "Response Time",
                      myService: "4 hours",
                      agency: "24-48 hours",
                      freelancer: "Variable",
                    },
                    {
                      feature: "Direct Communication",
                      myService: "✓ Always",
                      agency: "✗ Through PM",
                      freelancer: "✓ Usually",
                    },
                    {
                      feature: "Custom Solutions",
                      myService: "✓ 100% Custom",
                      agency: "~ Template-based",
                      freelancer: "~ Mixed",
                    },
                    {
                      feature: "Performance Focus",
                      myService: "✓ Guaranteed",
                      agency: "~ Sometimes",
                      freelancer: "~ Variable",
                    },
                    {
                      feature: "Post-Launch Support",
                      myService: "✓ Included",
                      agency: "$ Extra Cost",
                      freelancer: "~ Limited",
                    },
                    {
                      feature: "Transparent Pricing",
                      myService: "✓ Fixed Quotes",
                      agency: "~ Estimates",
                      freelancer: "~ Hourly",
                    },
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border-3 border-black p-4 font-mono font-bold">
                        {row.feature}
                      </td>
                      <td className="border-3 border-black p-4 font-mono text-center text-green-600 font-bold">
                        {row.myService}
                      </td>
                      <td className="border-3 border-black p-4 font-mono text-center">
                        {row.agency}
                      </td>
                      <td className="border-3 border-black p-4 font-mono text-center">
                        {row.freelancer}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Client Testimonials */}
        <TestimonialsCarousel className="border-t-0" />

        {/* CTA Section */}
        <CTASection />
      </main>
    </>
  );
}
