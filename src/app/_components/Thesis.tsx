// Thesis.tsx - HTML content for thesis section
export function ThesisContent() {
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-2xl rounded-sm border border-border/50 bg-background/80 p-6 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-2xl font-bold text-foreground">Our Thesis</h2>
          <div className="text-foreground">
            This is my dream! I&apos;m excited to share what we&apos;re building with
            the world.
          </div>
        </div>
      </div>
    </div>
  );
}

// Keep old Thesis export for compatibility during migration
export function Thesis() {
  return <ThesisContent />;
}
