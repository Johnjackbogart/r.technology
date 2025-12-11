// Portfolio.tsx - HTML content for portfolio section
export function PortfolioContent() {
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-4xl overflow-hidden rounded-sm border border-background/90 shadow-sm dark:border-background/40">
        <div className="rounded-[2px] border border-[#1f4733] bg-background/90 p-8 dark:border-[#b6f2c8]">
          <div className="flex flex-col gap-6">
            <h2 className="text-center text-3xl font-bold text-foreground">
              Portfolio
            </h2>
            <div className="text-center text-foreground">
              <p className="text-lg">
                Coming soon! We&apos;re excited to share what we&apos;re working
                on
              </p>
            </div>
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
