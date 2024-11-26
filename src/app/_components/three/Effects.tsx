"use client";

import { useRef, RefObject } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { easing } from "maath";
import { useThemeToFill } from "&/theme";

function Effects() {
  const theming = useThemeToFill();
  const dark = theming?.theme === "dark" ? true : false;

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
  });
  return (
    <EffectComposer enableNormalPass={true}>
      <Bloom
        mipmapBlur
        luminanceThreshold={0}
        intensity={dark ? 0.1 : -8}
        levels={8}
      />
    </EffectComposer>
  );
}

export { Effects };
