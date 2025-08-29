// Team.tsx (inside your Canvas scene)
import Image from "next/image";
import { Html, Float } from "@react-three/drei";
import { useMemo } from "react";
import Blob from "./three/Blob";

const team = [{ name: "John Bogart", title: "Founder", x: 0, y: 0.2, z: -1.2 }];

export function Team() {
  const members = useMemo(() => team, []);

  return (
    <>
      <Blob points={10000} />
      <group>
        {members.map((m) => (
          <Float
            key={m.name}
            speed={1}
            rotationIntensity={0.15}
            floatIntensity={0.3}
          >
            <group position={[m.x, m.y, m.z]}>
              {/* Real DOM card anchored in 3D */}
              <Html
                transform
                occlude
                distanceFactor={1} // scales with camera distance
                position={[0, 0, 6]}
                wrapperClass="will-change-transform"
              >
                <div className="w-[240px] rounded-2xl border border-border/50 bg-background/70 p-4 shadow-sm backdrop-blur">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Image
                      src="/images/me.jpg" // put your file in /public/me.jpg
                      alt="John Bogart"
                      width={64} // fixed size -> no layout shift
                      height={64}
                      priority // only for your card (first fold)
                      className="h-16 w-16 select-none rounded-full object-cover ring-1 ring-border/50"
                      draggable={false}
                    />
                    <div className="text-sm font-semibold text-muted-foreground">
                      {m.name}
                    </div>
                    <div className="text-xs text-muted">{m.title}</div>
                    <div className="mt-3 text-xs text-foreground">
                      This is my dream! I'm excited to share what we're building
                      with the world
                    </div>
                  </div>
                </div>
              </Html>
            </group>
          </Float>
        ))}
      </group>
    </>
  );
}
