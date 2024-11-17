"use client";

import { useRef, RefObject } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, TiltShift2 } from "@react-three/postprocessing";
import { ChromaticAberrationEffect } from "postprocessing";
import { easing } from "maath";

function Effects() {
  const chromaRef = useRef<ChromaticAberrationEffect>(null);
  let offset = new THREE.Vector2(0.1, 0.1);

  useFrame((state, delta) => {
    //can I just import this as a prop ?????
    //stolen from https://discourse.threejs.org/t/how-to-create-glass-material-that-refracts-elements-in-dom/53625/3
    easing.damp3(
      state.camera.position,
      [
        Math.sin(0.01 * -state.pointer.x) * 5,
        0.1 * state.pointer.y * 2,
        0.5 + Math.cos(0.01 * state.pointer.x) * 5,
      ],
      0.05,
      delta,
    );
    state.camera.lookAt(0, 0, 0);

    if (!chromaRef.current) return;
    const x = Math.sin(-state.pointer.x) / 10;
    const y = state.pointer.y / 10;
    offset = new THREE.Vector2(x, y);
    chromaRef.current.offset = offset;
  });
  return (
    <EffectComposer enableNormalPass={true}>
      <Bloom mipmapBlur luminanceThreshold={-0.8} intensity={-2} levels={8} />
    </EffectComposer>
  );
}

export { Effects };
