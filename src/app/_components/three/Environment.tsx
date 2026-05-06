"use client";

import { Environment as DreiEnv, Lightformer } from "@react-three/drei";

type FancyEnvironmentProps = {
  blur?: number;
  intensity?: number;
  performanceLevel?: "standard" | "low";
};

// Colors aligned with the blob palette + neutrals
const GOLD_BASE = "#D4AF37"; // anchor
const GOLD_MID = "#E0B84A"; // warm gold
const GOLD_DEEP = "#B8860B"; // antique gold
const NEUTRAL_DARK = "#222222";
const NEUTRAL_MID = "#555555";
const NEUTRAL_LIGHT = "#B5B5B5";
const WHITE = "#FFFFFF";

export function Environment({
  blur = 0.5,
  intensity = 1,
  performanceLevel = "standard",
}: FancyEnvironmentProps) {
  const resolution = performanceLevel === "low" ? 64 : 256;

  return (
    <DreiEnv resolution={resolution} blur={blur}>
      {/* Large soft rectangles to set overall tone */}
      <Lightformer
        form="rect"
        intensity={1.2 * intensity}
        color={GOLD_MID}
        rotation={[0, Math.PI / 2, 0]}
        position={[8, 2, 0]}
        scale={[10, 5, 1]}
      />
      <Lightformer
        form="rect"
        intensity={0.9 * intensity}
        color={GOLD_DEEP}
        rotation={[0, -Math.PI / 2, 0]}
        position={[-8, -1, 0]}
        scale={[8, 4, 1]}
      />

      {/* Neutral fills */}
      <Lightformer
        form="rect"
        intensity={0.5 * intensity}
        color={NEUTRAL_MID}
        rotation={[0, Math.PI, 0]}
        position={[0, 3, -10]}
        scale={[14, 6, 1]}
      />
      <Lightformer
        form="rect"
        intensity={0.35 * intensity}
        color={NEUTRAL_LIGHT}
        rotation={[0, 0, 0]}
        position={[0, -2, 10]}
        scale={[12, 5, 1]}
      />

      {/* Accent rings for spec highlights */}
      <group position={[0, 0, 0]}>
        <Lightformer
          form="ring"
          intensity={1.0 * intensity}
          color={WHITE}
          scale={2}
          position={[0, 2, -6]}
        />
        <Lightformer
          form="ring"
          intensity={0.7 * intensity}
          color={GOLD_BASE}
          scale={1.6}
          position={[2, -1, -5]}
        />
        <Lightformer
          form="ring"
          intensity={0.6 * intensity}
          color={NEUTRAL_DARK}
          scale={1.4}
          position={[-2, 1, -4]}
        />
      </group>

      {/* Subtle edge kickers */}
      <Lightformer
        form="rect"
        intensity={0.25 * intensity}
        color={GOLD_BASE}
        position={[0, 6, 0]}
        scale={[20, 2, 1]}
      />
      <Lightformer
        form="rect"
        intensity={0.2 * intensity}
        color={NEUTRAL_DARK}
        position={[0, -6, 0]}
        scale={[20, 2, 1]}
      />
    </DreiEnv>
  );
}
