import { HeroSection } from "@/components/sections";

export default function Home() {
  return (
    <main>
      <HeroSection />

      {/* Placeholder sections for smooth scrolling */}
      <section
        id="portfolio"
        className="min-h-screen bg-brutalist-white flex items-center justify-center"
      >
        <div className="text-center">
          <h2 className="text-4xl font-mono font-black text-brutalist-black mb-4">
            PORTFOLIO SECTION
          </h2>
          <p className="text-brutalist-gray font-mono">Coming soon...</p>
        </div>
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
