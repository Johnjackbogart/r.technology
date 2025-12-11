import { ThreeCanvas as Canvas } from "&/three/Canvas";
import Nav from "&/nav";
import { LenisProvider } from "@/lib/useLenis";

import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <LenisProvider>
        <div className="relative min-h-screen">
          {/* Fixed background canvas - always visible */}
          <div className="fixed inset-0 z-0 h-screen w-screen">
            <Canvas />
          </div>

          {/* Scrollable content */}
          <div className="pointer-events-none relative z-10">
            <div className="pointer-events-none sticky top-0 z-20 flex w-full flex-col p-4 text-center">
              <Nav />
            </div>

            <main className="pointer-events-none relative">
              {/* Hero Section - Extended to show all word animations */}
              <section id="hero" className="pointer-events-none h-[500vh]" />

              {/* Team Section - content rendered in 3D scene */}
              <section
                id="team"
                className="pointer-events-none min-h-screen"
              />

              {/* About Section - content rendered in 3D scene */}
              <section
                id="about"
                className="pointer-events-none min-h-screen"
              />

              {/* Portfolio Section - content rendered in 3D scene */}
              <section
                id="portfolio"
                className="pointer-events-none min-h-screen"
              />
            </main>
          </div>
        </div>
      </LenisProvider>
    </HydrateClient>
  );
}
