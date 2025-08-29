"use client";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import Blob from "./three/Blob";

function Scene() {
  const tk = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .custom-selection::selection {
        background: rgba(.1, .1, .1, .1);
        color: transparent;
      }
      .custom-selection::-moz-selection {
        background: rgba(.1, .1, .1, .1);
        color: transparent;
      }
    `;
    document.head.appendChild(style);

    // Cleanup the style tag on component unmount
    return () => {
      document.head.removeChild(style);
    };
  });

  useFrame((state) => {
    if (!tk.current) return;
    tk.current.rotation.z = 1 * state.clock.getElapsedTime();

    if (!tk.current) return;
    tk.current.rotation.y = state.clock.elapsedTime / 2;
  });

  return (
    <>
      <group position={[0, 0, -3]}>
        <Blob points={50000} flopAmount={"1.0"} />
      </group>
      <group position={[0, 0, -1.2]}>
        <Html
          center
          occlude
          distanceFactor={3} // scales with camera distance
          position={[0, 0, 6]}
          wrapperClass="will-change-transform"
        >
          <div className="w-[240px] items-center rounded-sm border border-border/50 bg-transparent p-4 shadow-sm backdrop-blur">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="mt-3 text-xs text-foreground">
                This is my dream! I'm excited to share what we're building with
                the world For more about me, check out lorem ipsum loreal;kjsdf
                as;dlkjf;alsdsdfj;lasdkjf;als f afs;dlkfja;s afsd;lfkja;slj
                asd;lkfja;lsjdf asd;lfkja;lskdjfas ff;asldkfjalj
              </div>
            </div>
          </div>
        </Html>
      </group>
      <ambientLight intensity={10} />

      <pointLight intensity={10} position={[0, 0, 0]} />
    </>
  );
}

function Thesis() {
  return (
    <>
      <Scene />
      <spotLight position={[0, 0, 0]} penumbra={1} castShadow angle={0.2} />
    </>
  );
}

export { Thesis };
