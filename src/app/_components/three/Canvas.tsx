"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useHashPage } from "@/lib/useHashPage";
import { Effects } from "./Effects";
import { Loader } from "./Loader";
import { Hero } from "./Hero";
import { Portfolio } from "./Portfolio";
import { Team } from "./Team";
import { Thesis } from "./Thesis";

type Page = "Hero" | "Team" | "Thesis" | "Portfolio";
//gippity
const PAGE_MAP: Record<Page, React.ComponentType> = {
  Hero,
  Portfolio,
  Team,
  Thesis,
};

function ThreeCanvas() {
  const page = useHashPage("Hero");
  const Current = useMemo(() => PAGE_MAP[page], [page]);
  return (
    <Canvas
      gl={{ alpha: true }}
      eventPrefix="client"
      camera={{ position: [0, 0, 0], fov: 100 }}
    >
      <Suspense fallback={<Loader />}>
        <Effects />
        <Current />
      </Suspense>
    </Canvas>
  );
}

export { ThreeCanvas };
