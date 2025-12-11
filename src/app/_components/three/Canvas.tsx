"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Effects } from "./Effects";
import { Loader } from "./Loader";
import ScrollResponsiveScene from "./ScrollResponsiveScene";
import { Environment } from "./Environment";

function ThreeCanvas() {
  return (
    <Canvas
      gl={{ alpha: true }}
      eventPrefix="client"
      camera={{ position: [0, 0, 10], fov: 100 }}
      className="w-full h-full"
    >
      <Suspense fallback={<Loader />}>
        <Effects damping={0.5} cameraModifier={{ x: 1, y: 1, z: 1 }} />
        <Environment blur={0.6} intensity={1} />
        <ScrollResponsiveScene />
      </Suspense>
    </Canvas>
  );
}

export { ThreeCanvas };
