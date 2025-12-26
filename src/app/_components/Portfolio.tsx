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
            <div className="flex flex-col gap-4 text-foreground">
              <a
                href="https://through.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md border border-foreground/20 p-4 transition-colors hover:border-foreground/40 hover:bg-foreground/5"
              >
                <p className="text-lg font-semibold">through.tech</p>
                <p className="text-sm text-foreground/70">
                  need to keep the lights on
                </p>
              </a>
              <a
                href="https://braign.io"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md border border-foreground/20 p-4 transition-colors hover:border-foreground/40 hover:bg-foreground/5"
              >
                <p className="text-lg font-semibold">braign.io</p>
                <p className="text-sm text-foreground/70">
                  tools for the technical marketer
                </p>
              </a>
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
