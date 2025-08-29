import { ThreeCanvas as Canvas } from "&/three/Canvas";
import Nav from "&/nav";

import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="to:from-[#fff] flex flex-grow flex-col items-center justify-center bg-gradient-to-t from-[#333] via-[#fff] to-[#fff] text-white dark:bg-gradient-to-b dark:from-[#333] dark:via-[#000] dark:to-[#000]">
        <div className="absolute inset-0 z-10 flex w-full flex-col p-4 text-center">
          <Nav />
        </div>
        <div className="flex w-full flex-grow">
          <Canvas />
        </div>
      </main>
    </HydrateClient>
  );
}
