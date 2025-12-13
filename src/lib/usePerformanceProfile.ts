"use client";

import { useEffect, useState } from "react";

type PerformanceLevel = "standard" | "low";

export type PerformanceProfile = {
  level: PerformanceLevel;
  /** Clamp device pixel ratio to keep GPU/CPU work in check. */
  dpr: [number, number];
  /** Skip expensive post-processing when true. */
  disableEffects: boolean;
  /** Scale down particle-heavy visuals. */
  particleMultiplier: number;
};

const defaultDprMax =
  typeof window !== "undefined"
    ? Math.min(2, window.devicePixelRatio || 1.5)
    : 1.5;

const DEFAULT_PROFILE: PerformanceProfile = {
  level: "standard",
  dpr: [1, defaultDprMax],
  disableEffects: false,
  particleMultiplier: 1,
};

/**
 * Derives a coarse performance profile to keep older/low-power devices responsive.
 * Heuristics:
 * - prefers-reduced-motion
 * - narrow/mobile screens
 * - low device memory / core count
 */
export function usePerformanceProfile() {
  const [profile, setProfile] = useState<PerformanceProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    const nav = window.navigator as Navigator & { deviceMemory?: number };
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const deviceMemory = nav.deviceMemory ?? 8; // gigabytes where available
    const cores = nav.hardwareConcurrency ?? 8;
    const isMobile = window.innerWidth <= 768;

    const looksLowPower =
      prefersReducedMotion || isMobile || deviceMemory <= 4 || cores <= 4;

    const maxDpr = looksLowPower
      ? 1
      : Math.min(2, window.devicePixelRatio || defaultDprMax);

    setProfile({
      level: looksLowPower ? "low" : "standard",
      dpr: [1, maxDpr],
      disableEffects: prefersReducedMotion,
      particleMultiplier: looksLowPower ? 0.25 : 0.6,
    });
  }, []);

  return profile;
}
