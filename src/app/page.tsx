import {
  HeroSection,
  ServicesGrid,
  SkillsDisplay,
  ProjectShowcase,
} from "@/components/sections";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ServicesGrid />
      <SkillsDisplay />

      {/* Placeholder sections for smooth scrolling */}
      <section id="portfolio" className="bg-brutalist-white">
        <ProjectShowcase />
      </section>

      <section
        id="contact"
        className="min-h-screen bg-brutalist-black flex items-center justify-center"
      >
        <div className="text-center">
          <h2 className="text-4xl font-mono font-black text-brutalist-yellow mb-4">
            CONTACT SECTION
          </h2>
          <p className="text-brutalist-gray font-mono">Coming soon...</p>
        </div>
      </section>
    </main>
  );
}
