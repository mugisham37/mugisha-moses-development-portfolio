import type { Metadata } from "next";
import {
  AboutSection,
  ProcessTimeline,
  TestimonialsCarousel,
  CTASection,
} from "@/components/sections";
import {
  InteractiveTimeline,
  SkillsProficiencyMatrix,
  EnhancedMethodologySection,
} from "@/components/enhanced";
import { ContextAwareNavigationDemo } from "@/components/navigation";
import { GlobalSearchDemo } from "@/components/search";
import { PreferencesDemo } from "@/components/preferences";

// SEO optimization for about page
export const metadata: Metadata = {
  title: "About | Professional Web Developer & Problem Solver",
  description:
    "Learn about my journey as a full-stack developer, my passion for problem-solving, and the proven development process that delivers exceptional results for clients.",
  keywords: [
    "about web developer",
    "developer story",
    "web development process",
    "problem solving developer",
    "full-stack developer background",
    "development methodology",
    "client testimonials",
    "developer experience",
  ].join(", "),
  openGraph: {
    title: "About | Professional Web Developer & Problem Solver",
    description:
      "Learn about my journey as a full-stack developer, my passion for problem-solving, and the proven development process that delivers exceptional results.",
    type: "website",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Professional Web Developer & Problem Solver",
    description:
      "Learn about my journey as a full-stack developer, my passion for problem-solving, and the proven development process that delivers exceptional results.",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function About() {
  return (
    <>
      {/* Structured Data for About Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            mainEntity: {
              "@type": "Person",
              name: "Professional Web Developer",
              jobTitle: "Full-Stack Web Developer",
              description:
                "Passionate problem-solver specializing in high-converting web applications and digital experiences.",
              knowsAbout: [
                "React",
                "Next.js",
                "TypeScript",
                "JavaScript",
                "Node.js",
                "Web Development",
                "E-commerce Development",
                "SaaS Development",
                "Performance Optimization",
                "User Experience Design",
              ],
              hasOccupation: {
                "@type": "Occupation",
                name: "Web Developer",
                description:
                  "Creating exceptional digital experiences that drive business results",
              },
            },
          }),
        }}
      />

      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <section className="bg-brutalist-black py-20 border-b-5 border-brutalist-yellow">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black font-mono uppercase tracking-wider text-white mb-6">
              ABOUT ME
            </h1>
            <p className="text-xl md:text-2xl font-mono font-bold text-brutalist-gray max-w-3xl mx-auto leading-relaxed">
              The story behind the code, the passion behind the pixels, and the
              process that delivers results.
            </p>
          </div>
        </section>

        {/* Main About Section */}
        <AboutSection className="border-t-0" />

        {/* Expanded Personal Story Section */}
        <section className="bg-brutalist-light-gray py-20 border-t-5 border-black">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-6">
                  Why I Became a Developer
                </h2>
                <p className="text-lg font-mono font-bold opacity-80">
                  Every great developer has a story. Here&apos;s mine.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                {/* Story Content */}
                <div className="space-y-6">
                  <div className="border-l-5 border-brutalist-yellow pl-6">
                    <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-4">
                      The Problem-Solving Spark
                    </h3>
                    <p className="font-mono leading-relaxed text-gray-700">
                      It started with a simple question: &quot;How can I make
                      this better?&quot; Whether it was optimizing a slow
                      website, creating a more intuitive user interface, or
                      building a solution that didn&apos;t exist yet, I found
                      myself drawn to the challenge of turning complex problems
                      into elegant solutions.
                    </p>
                  </div>

                  <div className="border-l-5 border-black pl-6">
                    <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-4">
                      From Curiosity to Craft
                    </h3>
                    <p className="font-mono leading-relaxed text-gray-700">
                      What began as curiosity about how websites worked evolved
                      into a deep passion for creating digital experiences that
                      not only look great but perform exceptionally. I realized
                      that great code isn&apos;t just about
                      functionality—it&apos;s about creating value for real
                      people and real businesses.
                    </p>
                  </div>

                  <div className="border-l-5 border-brutalist-yellow pl-6">
                    <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-4">
                      The Business Impact Focus
                    </h3>
                    <p className="font-mono leading-relaxed text-gray-700">
                      Early in my career, I learned that the best code is code
                      that drives results. Every line I write, every component I
                      build, and every optimization I make is focused on one
                      thing: helping businesses achieve their goals through
                      exceptional digital experiences.
                    </p>
                  </div>
                </div>

                {/* Visual Element */}
                <div className="relative">
                  <div className="border-5 border-black bg-brutalist-yellow p-8">
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto bg-black border-3 border-white flex items-center justify-center mb-4">
                          <span className="text-2xl font-mono font-black text-brutalist-yellow">
                            &lt;/&gt;
                          </span>
                        </div>
                        <h4 className="text-lg font-black font-mono uppercase">
                          Code with Purpose
                        </h4>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-black"></div>
                          <span className="font-mono font-bold text-sm">
                            Problem-First Approach
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-black"></div>
                          <span className="font-mono font-bold text-sm">
                            Business-Focused Solutions
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-black"></div>
                          <span className="font-mono font-bold text-sm">
                            User-Centered Design
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-black"></div>
                          <span className="font-mono font-bold text-sm">
                            Performance Obsessed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Outside Interests */}
              <div className="bg-brutalist-black border-5 border-brutalist-yellow p-8 md:p-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-black font-mono uppercase tracking-wider text-white mb-4">
                    Beyond the Code
                  </h3>
                  <p className="font-mono text-brutalist-gray">
                    What I do when I&apos;m not building digital experiences
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-brutalist-yellow border-3 border-white flex items-center justify-center mb-4">
                      <span className="text-2xl">🎵</span>
                    </div>
                    <h4 className="font-mono font-black text-white mb-2">
                      Music Production
                    </h4>
                    <p className="font-mono text-sm text-brutalist-gray">
                      Creating beats and melodies helps me think creatively
                      about code architecture
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-brutalist-yellow border-3 border-white flex items-center justify-center mb-4">
                      <span className="text-2xl">📚</span>
                    </div>
                    <h4 className="font-mono font-black text-white mb-2">
                      Continuous Learning
                    </h4>
                    <p className="font-mono text-sm text-brutalist-gray">
                      Always exploring new technologies, frameworks, and
                      methodologies
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-brutalist-yellow border-3 border-white flex items-center justify-center mb-4">
                      <span className="text-2xl">🌍</span>
                    </div>
                    <h4 className="font-mono font-black text-white mb-2">
                      Remote Work Advocate
                    </h4>
                    <p className="font-mono text-sm text-brutalist-gray">
                      Working with clients globally, bringing diverse
                      perspectives to every project
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Timeline Section */}
        <InteractiveTimeline className="border-t-5 border-black" />

        {/* Enhanced Skills Proficiency Matrix */}
        <SkillsProficiencyMatrix
          className="border-t-5 border-black"
          enableFiltering={true}
          enableSearch={true}
          showLearningTrajectory={true}
          showProjectConnections={true}
          displayMode="grid"
        />

        {/* Enhanced Methodology Section */}
        <EnhancedMethodologySection />

        {/* Context-Aware Navigation Demo */}
        <section className="py-20 border-t-5 border-black bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-6">
                Smart Navigation System
              </h2>
              <p className="text-lg font-mono font-bold text-foreground/80 max-w-3xl mx-auto">
                Experience how the navigation system adapts to your behavior and
                provides contextual recommendations based on your journey
                through the site.
              </p>
            </div>
            <ContextAwareNavigationDemo showDebugInfo={false} />
          </div>
        </section>

        {/* Additional Testimonials and Case Studies */}
        <TestimonialsCarousel className="border-t-0" />

        {/* Values and Principles */}
        <section className="bg-brutalist-black py-20 border-t-5 border-brutalist-yellow">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider text-white mb-6">
                Core Values & Principles
              </h2>
              <p className="text-lg font-mono font-bold text-brutalist-gray max-w-3xl mx-auto">
                The principles that guide every decision, every line of code,
                and every client interaction.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Quality First",
                  description:
                    "Never compromise on code quality, user experience, or performance standards.",
                  icon: "⚡",
                },
                {
                  title: "Client Success",
                  description:
                    "Your success is my success. Every project is measured by business impact.",
                  icon: "🎯",
                },
                {
                  title: "Continuous Growth",
                  description:
                    "Always learning, always improving, always pushing boundaries.",
                  icon: "📈",
                },
                {
                  title: "Honest Communication",
                  description:
                    "Transparent, timely, and clear communication throughout every project.",
                  icon: "💬",
                },
              ].map((value, index) => (
                <div
                  key={index}
                  className="border-3 border-brutalist-yellow bg-brutalist-light-gray p-6 text-center hover:bg-brutalist-yellow transition-colors duration-300 group"
                >
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-lg font-black font-mono uppercase tracking-wider mb-3 group-hover:text-black">
                    {value.title}
                  </h3>
                  <p className="font-mono text-sm leading-relaxed group-hover:text-black">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Global Search and Discovery Demo */}
        <section className="py-20 border-t-5 border-black bg-brutalist-light-gray">
          <div className="container mx-auto px-4">
            <GlobalSearchDemo />
          </div>
        </section>

        {/* User Preference Synchronization Demo */}
        <section className="py-20 border-t-5 border-black bg-background">
          <div className="container mx-auto px-4">
            <PreferencesDemo />
          </div>
        </section>

        {/* CTA Section */}
        <CTASection />
      </main>
    </>
  );
}
