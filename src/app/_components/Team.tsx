// Team.tsx - HTML content for team section
import Image from "next/image";
import Link from "next/link";
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
          className="w-[240px] items-center rounded-sm border border-border/50 bg-background/80 p-4 shadow-sm backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-3 text-center">
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
              <Link
                href="https://www.johnjackbogart.com"
                className="underline"
              >
                my website
              </Link>
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
