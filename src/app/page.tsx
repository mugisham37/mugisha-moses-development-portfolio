export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="brutalist-container brutalist-section">
        <div className="text-center">
          <h1 className="brutalist-heading text-4xl md:text-6xl lg:text-8xl mb-8">
            DEVELOPER PORTFOLIO
          </h1>
          <p className="brutalist-text text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            Project setup complete! Brutalist theme configured with Next.js 14,
            TypeScript, and Tailwind CSS.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="brutalist-btn">VIEW MY WORK</button>
            <button className="brutalist-btn-accent">GET IN TOUCH</button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="brutalist-card p-6">
              <h3 className="font-bold text-xl mb-4">NEXT.JS 14</h3>
              <p className="brutalist-text">
                App Router configured with TypeScript support
              </p>
            </div>
            <div className="brutalist-card p-6">
              <h3 className="font-bold text-xl mb-4">BRUTALIST THEME</h3>
              <p className="brutalist-text">
                Custom Tailwind configuration with bold styling
              </p>
            </div>
            <div className="brutalist-card p-6">
              <h3 className="font-bold text-xl mb-4">DEPENDENCIES</h3>
              <p className="brutalist-text">
                Framer Motion, Three.js, Vanta.js, Lucide React
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
