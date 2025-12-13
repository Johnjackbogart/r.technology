"use client";

import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { easing } from "maath";
import isMobile from "ismobilejs";
import { useThemeToFill } from "&/theme";

type EffectsProps = {
  damping: number;
  cameraModifier: CameraModifier;
  disabled?: boolean;
  performanceLevel?: "standard" | "low";
};
export type CameraModifier = {
  x: number;
  y: number;
  z: number;
};

function Effects({
  damping = 0.5,
  cameraModifier = { x: 1, y: 1, z: 1 },
  disabled = false,
  performanceLevel = "standard",
}: EffectsProps) {
  const theming = useThemeToFill();
  const dark = theming?.theme === "dark" ? true : false;

  const mobileModifier = isMobile(window.navigator).any
    ? { x: 0.25, y: 0.1, z: 2 }
    : { x: 1, y: 1, z: 1 };
  useFrame((state, delta) => {
    if (disabled) {
      state.camera.position.set(0, 0, 10);
      state.camera.lookAt(0, 0, 0);
      return;
    }

    // stolen from https://discourse.threejs.org/t/how-to-create-glass-material-that-refracts-elements-in-dom/53625/3
    easing.damp3(
      state.camera.position,
      [
        mobileModifier.x *
          cameraModifier.x *
          Math.sin(0.01 * -state.pointer.x) *
          50,
        mobileModifier.y * cameraModifier.y * 1 * state.pointer.y * 2,
        mobileModifier.z * cameraModifier.z * 0.5 +
          Math.cos(0.01 * state.pointer.x) * 5,
      ],
      performanceLevel === "low" ? Math.max(damping, 0.8) : damping,
      delta,
    );
    state.camera.lookAt(0, 0, 0);
  });

  if (disabled || performanceLevel === "low") {
    return null;
  }

  return (
    <EffectComposer enableNormalPass={true}>
      <Bloom
        mipmapBlur
        luminanceThreshold={0}
        intensity={dark ? 0.1 : 1}
        levels={8}
      />
    </EffectComposer>
  );
}

export { Effects };
