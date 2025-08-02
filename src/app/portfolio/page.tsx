import type { Metadata } from "next";
import { ProjectShowcase } from "@/components/sections";
import { CTASection } from "@/components/sections";
import { SimpleInteractiveProjectGrid } from "@/components/enhanced/SimpleInteractiveProjectGrid";

// SEO optimization for portfolio page
export const metadata: Metadata = {
  title: "Portfolio | Web Development Projects & Case Studies",
  description:
    "Explore my portfolio of high-converting web applications, e-commerce platforms, and SaaS solutions. See detailed case studies with business impact metrics and technical implementations.",
  keywords: [
    "web development portfolio",
    "React projects",
    "Next.js applications",
    "e-commerce development",
    "SaaS platforms",
    "case studies",
    "project showcase",
    "web app examples",
    "frontend projects",
    "full-stack applications",
  ].join(", "),
  openGraph: {
    title: "Portfolio | Web Development Projects & Case Studies",
    description:
      "Explore my portfolio of high-converting web applications with detailed case studies showing business impact and technical excellence.",
    type: "website",
    url: "/portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Web Development Projects & Case Studies",
    description:
      "Explore my portfolio of high-converting web applications with detailed case studies showing business impact and technical excellence.",
  },
  alternates: {
    canonical: "/portfolio",
  },
};

export default function Portfolio() {
  return (
    <>
      {/* Structured Data for Portfolio Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Web Development Portfolio",
            description:
              "A comprehensive showcase of web development projects including React applications, e-commerce platforms, and SaaS solutions.",
            url: "/portfolio",
            mainEntity: {
              "@type": "ItemList",
              name: "Web Development Projects",
              description:
                "Portfolio of high-converting web applications and digital experiences",
              numberOfItems: 12, // Update based on actual project count
              itemListElement: [
                {
                  "@type": "CreativeWork",
                  name: "E-commerce Platform",
                  description:
                    "High-converting e-commerce solution with advanced features",
                  creator: {
                    "@type": "Person",
                    name: "Professional Web Developer",
                  },
                },
                {
                  "@type": "CreativeWork",
                  name: "SaaS Dashboard",
                  description:
                    "Modern SaaS platform with real-time analytics and user management",
                  creator: {
                    "@type": "Person",
                    name: "Professional Web Developer",
                  },
                },
                {
                  "@type": "CreativeWork",
                  name: "React Web Application",
                  description:
                    "Interactive web application built with React and modern technologies",
                  creator: {
                    "@type": "Person",
                    name: "Professional Web Developer",
                  },
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
              PORTFOLIO
            </h1>
            <p className="text-xl md:text-2xl font-mono font-bold text-brutalist-gray max-w-4xl mx-auto leading-relaxed mb-8">
              A showcase of high-converting web applications, e-commerce
              platforms, and SaaS solutions that drive real business results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-brutalist-yellow border-3 border-white px-6 py-3 font-mono font-bold text-black">
                100+ Projects Completed
              </div>
              <div className="bg-brutalist-light-gray border-3 border-brutalist-yellow px-6 py-3 font-mono font-bold text-black">
                98% Client Satisfaction
              </div>
              <div className="bg-brutalist-yellow border-3 border-white px-6 py-3 font-mono font-bold text-black">
                2+ Years Experience
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="bg-brutalist-light-gray py-20 border-b-5 border-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-6">
                Featured Projects
              </h2>
              <p className="text-lg font-mono font-bold opacity-80 max-w-3xl mx-auto">
                Highlighting the most impactful projects that demonstrate
                technical excellence and business results.
              </p>
            </div>
            <ProjectShowcase />
          </div>
        </section>

        {/* All Projects Grid with Enhanced Filtering */}
        <section className="bg-brutalist-black py-20 border-b-5 border-brutalist-yellow">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider text-white mb-6">
                All Projects
              </h2>
              <p className="text-lg font-mono font-bold text-brutalist-gray max-w-3xl mx-auto">
                Explore the complete portfolio with advanced filtering, search
                capabilities, and multiple view modes.
              </p>
            </div>
            <SimpleInteractiveProjectGrid />
          </div>
        </section>

        {/* Project Categories Overview */}
        <section className="bg-brutalist-light-gray py-20 border-b-5 border-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-6">
                Project Categories
              </h2>
              <p className="text-lg font-mono font-bold opacity-80 max-w-3xl mx-auto">
                Specialized expertise across different types of web development
                projects.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  category: "React Applications",
                  count: "25+",
                  description:
                    "Modern, interactive web applications built with React and Next.js",
                  icon: "⚛️",
                  color: "bg-blue-500",
                  borderColor: "border-blue-500",
                },
                {
                  category: "E-commerce Platforms",
                  count: "15+",
                  description:
                    "High-converting online stores with advanced features and integrations",
                  icon: "🛒",
                  color: "bg-green-500",
                  borderColor: "border-green-500",
                },
                {
                  category: "SaaS Solutions",
                  count: "12+",
                  description:
                    "Scalable software-as-a-service platforms with complex functionality",
                  icon: "☁️",
                  color: "bg-purple-500",
                  borderColor: "border-purple-500",
                },
                {
                  category: "Landing Pages",
                  count: "30+",
                  description:
                    "High-converting landing pages optimized for lead generation",
                  icon: "🎯",
                  color: "bg-orange-500",
                  borderColor: "border-orange-500",
                },
              ].map((category, index) => (
                <div
                  key={index}
                  className="border-5 border-black bg-white p-6 hover:bg-brutalist-yellow transition-colors duration-300 group"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="text-lg font-black font-mono uppercase tracking-wider mb-2 group-hover:text-black">
                      {category.category}
                    </h3>
                    <div
                      className={`inline-block px-3 py-1 ${category.color} text-white font-mono font-bold text-sm mb-4`}
                    >
                      {category.count} Projects
                    </div>
                    <p className="font-mono text-sm leading-relaxed group-hover:text-black">
                      {category.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies Used */}
        <section className="bg-brutalist-black py-20 border-b-5 border-brutalist-yellow">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider text-white mb-6">
                Technologies & Tools
              </h2>
              <p className="text-lg font-mono font-bold text-brutalist-gray max-w-3xl mx-auto">
                The modern tech stack powering exceptional digital experiences.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { name: "React", icon: "⚛️" },
                { name: "Next.js", icon: "▲" },
                { name: "TypeScript", icon: "TS" },
                { name: "Node.js", icon: "📗" },
                { name: "PostgreSQL", icon: "🐘" },
                { name: "MongoDB", icon: "🍃" },
                { name: "AWS", icon: "☁️" },
                { name: "Docker", icon: "🐳" },
                { name: "Tailwind", icon: "🎨" },
                { name: "GraphQL", icon: "◉" },
                { name: "Stripe", icon: "💳" },
                { name: "Vercel", icon: "▲" },
              ].map((tech, index) => (
                <div
                  key={index}
                  className="border-3 border-brutalist-yellow bg-white p-4 text-center hover:bg-brutalist-yellow transition-colors duration-300 group"
                >
                  <div className="text-2xl mb-2">{tech.icon}</div>
                  <div className="font-mono font-bold text-sm group-hover:text-black">
                    {tech.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Overview */}
        <section className="bg-white py-20 border-b-5 border-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-6">
                Development Process
              </h2>
              <p className="text-lg font-mono font-bold opacity-80 max-w-3xl mx-auto">
                Every project follows a proven methodology that ensures quality,
                performance, and client satisfaction.
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
              {[
                {
                  step: "01",
                  title: "Discovery",
                  description: "Understanding requirements and goals",
                },
                {
                  step: "02",
                  title: "Strategy",
                  description: "Planning architecture and approach",
                },
                {
                  step: "03",
                  title: "Development",
                  description: "Building with modern best practices",
                },
                {
                  step: "04",
                  title: "Testing",
                  description: "Comprehensive quality assurance",
                },
                {
                  step: "05",
                  title: "Launch",
                  description: "Deployment and ongoing support",
                },
              ].map((phase, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto bg-brutalist-yellow border-5 border-black flex items-center justify-center mb-4">
                    <span className="font-mono font-black text-lg">
                      {phase.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-black font-mono uppercase tracking-wider mb-2">
                    {phase.title}
                  </h3>
                  <p className="font-mono text-sm opacity-80">
                    {phase.description}
                  </p>
                  {index < 4 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-1 bg-brutalist-yellow transform -translate-y-1/2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client Results */}
        <section className="bg-brutalist-black py-20 border-b-5 border-brutalist-yellow">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider text-white mb-6">
                Proven Results
              </h2>
              <p className="text-lg font-mono font-bold text-brutalist-gray max-w-3xl mx-auto">
                Real metrics from real projects that demonstrate the business
                impact of exceptional web development.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  metric: "300%",
                  label: "Average Conversion Increase",
                  description: "Across e-commerce projects",
                },
                {
                  metric: "50%",
                  label: "Faster Load Times",
                  description: "Through performance optimization",
                },
                {
                  metric: "95%",
                  label: "Lighthouse Performance Score",
                  description: "Average across all projects",
                },
                {
                  metric: "100%",
                  label: "Mobile Responsive",
                  description: "All projects optimized for mobile",
                },
              ].map((result, index) => (
                <div
                  key={index}
                  className="border-3 border-brutalist-yellow bg-brutalist-yellow/10 p-6 text-center"
                >
                  <div className="text-4xl font-black font-mono text-brutalist-yellow mb-2">
                    {result.metric}
                  </div>
                  <h3 className="font-mono font-bold text-white mb-2">
                    {result.label}
                  </h3>
                  <p className="font-mono text-sm text-brutalist-gray">
                    {result.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection />
      </main>
    </>
  );
}
