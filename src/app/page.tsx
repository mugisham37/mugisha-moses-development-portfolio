import {
  HeroSection,
  ServicesGrid,
  SkillsDisplay,
  ProjectShowcase,
  ContactSection,
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

      <section id="contact" className="bg-brutalist-white">
        <ContactSection />
      </section>
    </main>
  );
}
