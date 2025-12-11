// Portfolio.tsx - HTML content for portfolio section
export function PortfolioContent() {
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-4xl rounded-sm border border-border/50 bg-background/80 p-8 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold text-center text-foreground">Portfolio</h2>
          <div className="text-foreground text-center">
            <p className="text-lg">
              Coming soon - showcasing our projects and work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Keep old Portfolio export for compatibility during migration
export function Portfolio() {
  return <PortfolioContent />;
}
