"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Effects } from "./Effects";
import { Loader } from "./Loader";
import { Scene } from "./Scene";

function ThreeCanvas() {
  return (
    <Canvas
      gl={{ alpha: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color(), 0.1);
        //eslint-disable-next-line
        gl.setTransparentSort((a, b) => a.z - b.z);
      }}
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