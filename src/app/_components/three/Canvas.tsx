"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Effects } from "./Effects";
import { Loader } from "./Loader";
import ScrollResponsiveScene from "./ScrollResponsiveScene";
import { Environment } from "./Environment";
import { usePerformanceProfile } from "@/lib/usePerformanceProfile";

function ThreeCanvas() {
  const baseProfile = usePerformanceProfile();
  const [adaptiveLevel, setAdaptiveLevel] = useState(baseProfile.level);
  const [manualOverride, setManualOverride] = useState<"low" | "high" | null>(
    null,
  );
  const fpsBelowThresholdFrames = useRef(0);
  const fpsAboveThresholdFrames = useRef(0);

  useEffect(() => {
    // If heuristics say "low", force low and reset.
    if (baseProfile.level === "low") {
      setAdaptiveLevel("low");
      fpsAboveThresholdFrames.current = 0;
      fpsBelowThresholdFrames.current = 0;
    }
  }, [baseProfile.level]);

  // Lightweight FPS watcher using rAF; hysteresis keeps it from flapping.
  useEffect(() => {
    let rafId: number;
    let last = performance.now();
    const maxBelow = 45; // ~0.75s at 60fps
    const maxAbove = 120; // ~2s at 60fps

    const loop = (now: number) => {
      const delta = now - last || 16.7;
      last = now;
      const fps = 1000 / delta;

      if (fps < 40) {
        fpsBelowThresholdFrames.current += 1;
        fpsAboveThresholdFrames.current = 0;
      } else if (fps > 55) {
        fpsAboveThresholdFrames.current += 1;
        fpsBelowThresholdFrames.current = 0;
      } else {
        fpsAboveThresholdFrames.current = 0;
        fpsBelowThresholdFrames.current = 0;
      }

      if (
        baseProfile.level !== "low" &&
        adaptiveLevel !== "low" &&
        fpsBelowThresholdFrames.current > maxBelow
      ) {
        setAdaptiveLevel("low");
      }

      if (
        baseProfile.level === "standard" &&
        adaptiveLevel === "low" &&
        fpsAboveThresholdFrames.current > maxAbove
      ) {
        setAdaptiveLevel("standard");
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [adaptiveLevel, baseProfile.level]);

  const mergedProfile = useMemo(() => {
    const effectiveLevel =
      manualOverride ??
      (baseProfile.level === "low" ? "low" : adaptiveLevel ?? baseProfile.level);

    if (effectiveLevel === "low") {
      return {
        ...baseProfile,
        level: "low" as const,
        dpr: [1, 1],
        disableEffects: true,
        particleMultiplier: Math.min(baseProfile.particleMultiplier, 0.25),
      };
    }

    return {
      ...baseProfile,
      level: "standard" as const,
      disableEffects: baseProfile.disableEffects,
    };
  }, [adaptiveLevel, baseProfile, manualOverride]);

  const isLowPower = mergedProfile.level === "low";

  return (
    <div className="relative h-full w-full">
      <Canvas
        dpr={mergedProfile.dpr}
        gl={{
          alpha: true,
          antialias: !isLowPower,
          powerPreference: isLowPower ? "low-power" : "high-performance",
        }}
        eventPrefix="client"
        camera={{ position: [0, 0, 10], fov: 100 }}
        className="w-full h-full"
      >
        <PerformanceMonitor
          onDecline={() => {
            if (baseProfile.level !== "low") setAdaptiveLevel("low");
          }}
          onIncline={() => {
            if (baseProfile.level === "standard") setAdaptiveLevel("standard");
          }}
        />
        <Suspense fallback={<Loader />}>
          <Effects
            damping={isLowPower ? 0.75 : 0.5}
            cameraModifier={{ x: 1, y: 1, z: 1 }}
            disabled={mergedProfile.disableEffects || isLowPower}
            performanceLevel={mergedProfile.level}
          />
          <Environment
            blur={isLowPower ? 0.2 : 0.6}
            intensity={isLowPower ? 0.6 : 1}
            performanceLevel={mergedProfile.level}
          />
          <ScrollResponsiveScene performanceProfile={mergedProfile} />
        </Suspense>
      </Canvas>
      <button
        type="button"
        aria-label="Toggle performance mode"
        className="pointer-events-auto fixed z-[2000] rounded-md bg-emerald-100/90 px-3 py-1 text-xs font-semibold text-emerald-900 shadow-sm backdrop-blur transition hover:bg-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        style={{
          right: "calc(0.75rem + env(safe-area-inset-right, 0px))",
          bottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
        }}
        onClick={() =>
          setManualOverride((prev) => (prev === "low" ? "high" : "low"))
        }
        onTouchStart={() =>
          setManualOverride((prev) => (prev === "low" ? "high" : "low"))
        }
      >
        performance: {mergedProfile.level === "low" ? "low" : "high"} (
        {manualOverride ? "manual" : "auto"})
      </button>
    </div>
  );
}

export { ThreeCanvas };
