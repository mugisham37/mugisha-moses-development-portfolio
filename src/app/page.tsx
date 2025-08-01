import type { Metadata } from "next";
import {
  HeroSection,
  ServicesGrid,
  SkillsDisplay,
  ProjectShowcase,
  ProjectGrid,
  SocialProofBar,
  TestimonialsCarousel,
  AboutSection,
  ProcessTimeline,
  ContactSection,
  CTASection,
} from "@/components/sections";

// SEO optimization for home page
export const metadata: Metadata = {
  title: "Developer Portfolio | High-Converting Web Development & React Apps",
  description:
    "Professional full-stack developer specializing in React, Next.js, and high-converting digital experiences. Building exceptional web applications, e-commerce platforms, and SaaS solutions that drive business results.",
  keywords: [
    "web developer",
    "React developer",
    "Next.js developer",
    "frontend developer",
    "full-stack developer",
    "e-commerce development",
    "SaaS development",
    "high-converting websites",
    "digital experiences",
    "web applications",
    "responsive design",
    "performance optimization",
  ].join(", "),
  authors: [{ name: "Professional Web Developer" }],
  openGraph: {
    title: "Developer Portfolio | High-Converting Web Development & React Apps",
    description:
      "Professional full-stack developer specializing in React, Next.js, and high-converting digital experiences. 2+ years experience, 100+ projects, 98% client satisfaction.",
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Developer Portfolio",
    images: [
      {
        url: "/images/og-home.jpg", // Add this image later
        width: 1200,
        height: 630,
        alt: "Developer Portfolio - High-Converting Web Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Portfolio | High-Converting Web Development & React Apps",
    description:
      "Professional full-stack developer specializing in React, Next.js, and high-converting digital experiences. 2+ years experience, 100+ projects, 98% client satisfaction.",
    images: ["/images/twitter-home.jpg"], // Add this image later
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function Home() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Professional Web Developer",
            jobTitle: "Full-Stack Web Developer",
            description:
              "Professional full-stack developer specializing in React, Next.js, and high-converting digital experiences.",
            url: "/",
            sameAs: [
              "https://github.com/developer", // Update with actual links
              "https://linkedin.com/in/developer",
              "https://twitter.com/developer",
            ],
            knowsAbout: [
              "React",
              "Next.js",
              "TypeScript",
              "JavaScript",
              "Node.js",
              "Web Development",
              "Frontend Development",
              "Full-Stack Development",
              "E-commerce Development",
              "SaaS Development",
            ],
            hasOccupation: {
              "@type": "Occupation",
              name: "Web Developer",
              occupationLocation: {
                "@type": "Place",
                name: "Remote", // Update with actual location
              },
              estimatedSalary: {
                "@type": "MonetaryAmountDistribution",
                name: "base",
                currency: "USD",
                duration: "P1Y",
                minValue: 60000,
                maxValue: 120000,
              },
            },
            offers: {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Web Development Services",
                description:
                  "Custom web development, React applications, e-commerce platforms, and SaaS solutions",
              },
            },
          }),
        }}
      />

      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <HeroSection />

        {/* Social Proof Bar */}
        <SocialProofBar className="border-t-0" />

        {/* Services Section */}
        <section
          id="services"
          className="scroll-mt-20 bg-brutalist-light-gray border-t-5 border-black"
        >
          <ServicesGrid />
        </section>

        {/* Skills Section */}
        <section
          id="skills"
          className="scroll-mt-20 bg-brutalist-black border-t-5 border-brutalist-yellow"
        >
          <SkillsDisplay />
        </section>

        {/* Portfolio Section */}
        <section
          id="portfolio"
          className="scroll-mt-20 bg-brutalist-light-gray border-t-5 border-black"
        >
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-4">
                Featured Projects
              </h2>
              <p className="text-lg font-mono font-bold opacity-80 max-w-2xl mx-auto">
                Showcasing exceptional web applications that drive business
                results
              </p>
            </div>
            <ProjectShowcase />
          </div>
        </section>

        {/* All Projects Grid */}
        <section className="bg-brutalist-black border-t-5 border-brutalist-yellow">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-4 text-white">
                All Projects
              </h2>
              <p className="text-lg font-mono font-bold opacity-80 max-w-2xl mx-auto text-brutalist-gray">
                Explore the complete portfolio with filtering options
              </p>
            </div>
            <ProjectGrid />
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="scroll-mt-20 bg-brutalist-light-gray border-t-5 border-black"
        >
          <TestimonialsCarousel />
        </section>

        {/* About Section */}
        <section
          id="about"
          className="scroll-mt-20 bg-brutalist-black border-t-5 border-brutalist-yellow"
        >
          <AboutSection />
        </section>

        {/* Process Section */}
        <section
          id="process"
          className="scroll-mt-20 bg-brutalist-light-gray border-t-5 border-black"
        >
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-4">
                My Development Process
              </h2>
              <p className="text-lg font-mono font-bold opacity-80 max-w-2xl mx-auto">
                A proven methodology that delivers exceptional results every
                time
              </p>
            </div>
            <ProcessTimeline />
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="scroll-mt-20 bg-brutalist-black border-t-5 border-brutalist-yellow"
        >
          <ContactSection />
        </section>

        {/* Final CTA Section */}
        <CTASection />
      </main>
    </>
  );
}
