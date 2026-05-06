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
  const lowFpsDurationMs = useRef(0);

  useEffect(() => {
    lowFpsDurationMs.current = 0;
  }, [baseProfile.level]);

  // Lightweight FPS watcher. Auto mode only degrades after sustained low FPS;
  // it does not promote itself back to high while the scene is running.
  useEffect(() => {
    if (manualOverride !== null) {
      lowFpsDurationMs.current = 0;
      return;
    }

    let rafId: number;
    let last = performance.now();
    const lowFpsThresholdMs = 2500;

    const loop = (now: number) => {
      const delta = now - last || 16.7;
      last = now;
      const fps = 1000 / delta;

      lowFpsDurationMs.current =
        fps < 35 ? lowFpsDurationMs.current + delta : 0;

      if (
        baseProfile.level !== "low" &&
        adaptiveLevel !== "low" &&
        lowFpsDurationMs.current >= lowFpsThresholdMs
      ) {
        setAdaptiveLevel("low");
        lowFpsDurationMs.current = 0;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [adaptiveLevel, baseProfile.level, manualOverride]);

  const mergedProfile = useMemo<
    ReturnType<typeof usePerformanceProfile>
  >(() => {
    const effectiveLevel =
      manualOverride ??
      (baseProfile.level === "low"
        ? "low"
        : (adaptiveLevel ?? baseProfile.level));

    if (effectiveLevel === "low") {
      return {
        ...baseProfile,
        level: "low" as const,
        dpr: [1, 1] as [number, number],
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
  const manualModeLabel = manualOverride ?? "auto";

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
        className="h-full w-full"
      >
        <PerformanceMonitor
          onDecline={() => {
            if (manualOverride === null && baseProfile.level !== "low") {
              setAdaptiveLevel("low");
            }
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
        className="pointer-events-auto fixed z-[2000] rounded-md bg-[#fff3bf]/90 px-3 py-1 text-xs font-semibold text-[#5f4300] shadow-sm backdrop-blur transition hover:bg-[#ffe08a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]"
        style={{
          right: "calc(0.75rem + env(safe-area-inset-right, 0px))",
          bottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
        }}
        aria-pressed={manualOverride !== null}
        aria-label={`Performance override: ${manualModeLabel}; effective mode: ${
          isLowPower ? "low" : "high"
        }`}
        title={`Effective performance: ${isLowPower ? "low" : "high"}`}
        onClick={() =>
          setManualOverride((prev) => {
            if (prev === null) return "low";
            if (prev === "low") return "high";
            return null;
          })
        }
      >
        performance: {manualModeLabel}
      </button>
    </div>
  );
}

export { ThreeCanvas };
