"use client";
import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Effects } from "./Effects";
import { Loader } from "./Loader";
import { Scene } from "./Scene";

function ThreeCanvas() {
  //well we figured out how to break the vertexShader
  const [render, setRender] = useState(true);
  const handleMouseEnter = () => {
    setRender(true);
  };
  const handleMouseLeave = () => {
    setRender(false);
  };

  return (
    <div
      className={"flex-grow"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
    </div>
  );
}

export { ThreeCanvas };
