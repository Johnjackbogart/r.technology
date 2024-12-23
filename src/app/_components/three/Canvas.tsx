"use client";
import { useState, useEffect, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Effects } from "./Effects";
import { Loader } from "./Loader";
import { Scene } from "./Scene";

function ThreeCanvas() {
  return (
    <Canvas
      gl={{ alpha: true }}
      eventPrefix="client"
      camera={{ position: [0, 0, 0], fov: 100 }}
    >
      <Suspense fallback={<Loader />}>
        <Effects />
        <Scene />
      </Suspense>
    </Canvas>
  );
}

export { ThreeCanvas };
