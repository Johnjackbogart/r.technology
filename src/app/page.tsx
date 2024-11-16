import { ThreeCanvas as Canvas } from "&/three/Canvas";
import Nav from "&/nav";

import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex flex-grow flex-col items-center justify-center bg-gradient-to-b from-[#333] via-[#000] to-[#000] text-white">
        <div className="w-full flex-grow">
          <Canvas />
        </div>
      </main>
    </HydrateClient>
  );
}
