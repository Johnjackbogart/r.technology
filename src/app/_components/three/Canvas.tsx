"use client";
import { useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useHashPage } from "@/lib/useHashPage";
import { Effects, type CameraModifier } from "./Effects";
import { Loader } from "./Loader";
import { Hero } from "./Hero";
import { Portfolio } from "../Portfolio";
import { Team } from "../Team";
import { Thesis } from "../Thesis";
import { Environment } from "./Environment";

type Page = "Hero" | "Team" | "Thesis" | "Portfolio";
//gippity
const PAGE_MAP: Record<Page, React.ComponentType> = {
  Hero,
  Portfolio,
  Team,
  Thesis,
};
const DAMPING_BY_PAGE: Record<Page, number> = {
  Hero: 0.5,
  Team: 0.25,
  Thesis: 0.8,
  Portfolio: 0.6,
};
const CAM_MODIFIER_BY_PAGE: Record<Page, CameraModifier> = {
  Hero: { x: 1, y: 1, z: 1 },
  Team: { x: 2, y: 0.25, z: 1 },
  Thesis: { x: 0.5, y: 0.05, z: 1 },
  Portfolio: { x: 1, y: 1, z: 1 },
};

function ThreeCanvas() {
  const page = useHashPage("Hero");
  const Current = useMemo(() => PAGE_MAP[page], [page]);
  const damping = DAMPING_BY_PAGE[page];
  const cameraModifier: CameraModifier = CAM_MODIFIER_BY_PAGE[page];

  return (
    <Canvas
      gl={{ alpha: true }}
      eventPrefix="client"
      camera={{ position: [0, 0, 10], fov: 100 }}
    >
      <Suspense fallback={<Loader />}>
        <Effects damping={damping} cameraModifier={cameraModifier} />
        <Environment blur={0.6} intensity={1} />
        <Current key={`page-${page}`} />
      </Suspense>
    </Canvas>
  );
}

export { ThreeCanvas };
