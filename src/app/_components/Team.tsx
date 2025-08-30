// Team.tsx (inside your Canvas scene)
import Image from "next/image";
import Link from "next/link";
import { Html } from "@react-three/drei";
import { useMemo } from "react";
import Blob from "./three/Blob";

const team = [
  {
    name: "John Bogart",
    title: "Founder",
    x: 0,
    y: 0,
    z: -1.2,
    img: "/images/me.jpg",
  },
];

export function Team() {
  const members = useMemo(() => team, []);

  return (
    <>
      <Blob points={100000} flopAmount={"-1.0"} eggplantAmount={"5.0"} />
      <group>
        {members.map((m) => (
          <group key={m.name} position={[m.x, m.y, m.z]}>
            {/* Real DOM card anchored in 3D */}
            <Html
              center
              transform
              occlude
              distanceFactor={3} // scales with camera distance
              position={[0, 0, 5]}
              wrapperClass="will-change-transform"
            >
              <div className="w-[240px] items-center rounded-sm border border-border/50 bg-transparent p-4 shadow-sm backdrop-blur">
                <div className="flex flex-col items-center gap-3 text-center">
                  <Image
                    src={m.img}
                    alt={m.name}
                    width={64} // fixed size -> no layout shift
                    height={64}
                    priority // only for your card (first fold)
                    className="h-16 w-16 select-none rounded-full object-cover ring-1 ring-border/50"
                    draggable={false}
                  />
                  <div className="text-md font-semibold text-foreground">
                    {m.name}
                  </div>
                  <div className="text-sm text-muted-foreground">{m.title}</div>
                  <div className="mt-3 text-xs text-foreground">
                    {
                      // eslint-disable-next-line react/no-unescaped-entities
                      `This is my dream! I'm excited to share what we're building with
                    the world For more about me, check out`
                    }
                    <Link href="https://www.johnjackbogart.com">
                      {" "}
                      my website
                    </Link>
                  </div>
                </div>
              </div>
            </Html>
          </group>
        ))}
      </group>
    </>
  );
}
