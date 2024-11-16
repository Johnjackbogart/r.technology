import Link from "next/link";
import { ThreeCanvas as Canvas } from "&/three/Canvas";

import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#333] via-[#000] to-[#000] text-white">
        <div className="h-svh w-full">
          <Canvas />
        </div>
      </main>
    </HydrateClient>
  );
}
