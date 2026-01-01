// About.tsx - HTML content for about section
export function AboutContent() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex w-full max-w-5xl flex-col gap-4 md:flex-row">
        <div className="flex-1 overflow-hidden rounded-sm border border-background/90 dark:border-background/40">
          <div className="h-full rounded-[2px] border border-[#1f4733] bg-background/90 p-6 text-left shadow-sm dark:border-[#b6f2c8]">
            <h2 className="text-2xl font-bold text-foreground underline">
              Thesis
            </h2>
            <p className="mt-3 text-foreground/80">
              We believe that if you put good people in the right positions, you
              can make the world an infinitely better place.
            </p>
            <p className="mt-3 text-foreground/80">
              We believe the best place for those types of people are in the
              founder chair
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-hidden rounded-sm border border-background/85 dark:border-background/35">
          <div className="h-full rounded-[2px] border border-[#1f4733] bg-background/85 p-6 text-left shadow-sm dark:border-[#b6f2c8]">
            <h2 className="text-2xl font-bold text-foreground underline">
              Mission
            </h2>
            <p className="mt-2 text-foreground/80">
              We want to help people learn. Whether that&apos;s through
              entrepreneurship, academia, the arts, or elsewhere
            </p>
            <p className="mt-2 text-foreground/80">
              We believe knowledge is the greatest pursuit anyone can take on,
              and we want to help in that pursuit
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-hidden rounded-sm border border-background/85 dark:border-background/35">
          <div className="h-full rounded-[2px] border border-[#1f4733] bg-background/85 p-6 text-left shadow-sm dark:border-[#b6f2c8]">
            <h2 className="text-2xl font-bold text-foreground underline">
              Values
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-foreground/80">
              <li>Kindness</li>
              <li>Honesty</li>
              <li>Intelligence</li>
              <li>Humility</li>
              <li>Ambition</li>
            </ul>
          </div>
        </div>
       /** <div className="flex-1 overflow-hidden rounded-sm border border-background/80 dark:border-background/30">
          <div className="h-full rounded-[2px] border border-[#1f4733] bg-background/80 p-6 text-left shadow-sm dark:border-[#b6f2c8]">
            <h2 className="text-2xl font-bold text-foreground underline">
              More Thoughts
            </h2>
            <p className="mt-3 text-foreground/80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p className="mt-3 text-foreground/80">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
**/
      </div>
    </div>
  );
}

// Backwards compatibility for legacy imports
export function ThesisContent() {
  return <AboutContent />;
}

export function Thesis() {
  return <AboutContent />;
}
