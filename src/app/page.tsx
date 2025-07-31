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
            TypeScript, and Tailwind CSS. Core UI Components Library
            implemented.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="brutalist-btn">VIEW MY WORK</button>
            <button className="brutalist-btn-accent">GET IN TOUCH</button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="brutalist-card p-6">
              <h3 className="font-bold text-xl mb-4">BRUTALIST CARD</h3>
              <p className="brutalist-text">
                ✓ Hover effects (lift, glow, invert)
              </p>
            </div>
            <div className="brutalist-card p-6">
              <h3 className="font-bold text-xl mb-4">BRUTALIST BUTTON</h3>
              <p className="brutalist-text">
                ✓ Multiple variants and animations
              </p>
            </div>
            <div className="brutalist-card p-6">
              <h3 className="font-bold text-xl mb-4">ANIMATED TEXT</h3>
              <p className="brutalist-text">
                ✓ Typing, reveal, and glitch effects
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
