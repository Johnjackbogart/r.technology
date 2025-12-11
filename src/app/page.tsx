import { ThreeCanvas as Canvas } from "&/three/Canvas";
import Nav from "&/nav";
import { LenisProvider } from "@/lib/useLenis";

import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <LenisProvider>
        <div className="relative min-h-screen bg-gradient-to-b from-[#333] via-[#fff] to-[#999] dark:from-[#333] dark:via-[#000] dark:to-[#000]">
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
              <section id="hero" className="pointer-events-none h-[200vh]" />

              {/* Team Section - content rendered in 3D scene */}
              <section
                id="team"
                className="pointer-events-none min-h-screen"
              />

              {/* Thesis Section - content rendered in 3D scene */}
              <section
                id="thesis"
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
