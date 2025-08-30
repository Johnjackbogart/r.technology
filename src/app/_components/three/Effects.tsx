"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { easing } from "maath";
import isMobile from "ismobilejs";
import { useThemeToFill } from "&/theme";

type EffectsProps = {
  damping: number;
  cameraModifier: CameraModifier;
};
export type CameraModifier = {
  x: number;
  y: number;
  z: number;
};

function Effects({
  damping = 0.5,
  cameraModifier = { x: 1, y: 1, z: 1 },
}: EffectsProps) {
  const theming = useThemeToFill();
  const dark = theming?.theme === "dark" ? true : false;

  const mobileModifier = isMobile(window.navigator) ? 0.01 : 0;
  useFrame((state, delta) => {
    //can I just import this as a prop ?????
    //stolen from https://discourse.threejs.org/t/how-to-create-glass-material-that-refracts-elements-in-dom/53625/3
    easing.damp3(
      state.camera.position,
      [
        mobileModifier *
          cameraModifier.x *
          Math.sin(0.01 * -state.pointer.x) *
          50,
        mobileModifier * cameraModifier.y * 1 * state.pointer.y * 2,
        mobileModifier * cameraModifier.z * 0.5 +
          Math.cos(0.01 * state.pointer.x) * 5,
      ],
      damping,
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
