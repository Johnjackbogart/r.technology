// Team.tsx - HTML content for team section
import Image from "next/image";
import { useMemo } from "react";

const team = [
  {
    name: "John Bogart",
    title: "Founder",
    img: "/images/me.jpg",
  },
];

export function TeamContent() {
  const members = useMemo(() => team, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      {members.map((m) => (
        <div
          key={m.name}
          className="w-[240px] items-center overflow-hidden rounded-sm border border-background/90 shadow-sm dark:border-background/40"
        >
          <div className="flex h-full flex-col items-center gap-3 rounded-[2px] border border-[#1f4733] bg-background/90 p-4 text-center dark:border-[#b6f2c8]">
            <Image
              src={m.img}
              alt={m.name}
              width={256}
              height={256}
              priority
              className="h-16 w-16 select-none rounded-full object-cover ring-1 ring-border/50"
              draggable={false}
            />
            <div className="text-md font-semibold text-foreground">
              {m.name}
            </div>
            <div className="text-sm text-muted-foreground">{m.title}</div>
            <div className="mt-3 text-foreground">
              {
                "This is my dream! I'm excited to share what we're building with the world For more about me, check out "
              }
              <a
                href="https://www.johnjackbogart.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                my website
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Keep old Team export for compatibility during migration
export function Team() {
  return <TeamContent />;
}
