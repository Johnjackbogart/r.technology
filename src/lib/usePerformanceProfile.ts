"use client";

import { useSyncExternalStore } from "react";

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

const SERVER_DEFAULT_PROFILE: PerformanceProfile = {
  level: "standard",
  dpr: [1, 1.5],
  disableEffects: false,
  particleMultiplier: 1,
};

// Cache for the snapshot to avoid infinite loops
let cachedProfile: PerformanceProfile | null = null;
let cachedKey: string | null = null;

function computeProfile(): PerformanceProfile {
  const nav = window.navigator as Navigator & { deviceMemory?: number };
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const deviceMemory = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  const isMobile = window.innerWidth <= 768;
  const dpr = window.devicePixelRatio || 1.5;

  // Create a cache key from the inputs
  const key = `${prefersReducedMotion}-${isMobile}-${deviceMemory}-${cores}-${dpr}`;

  // Return cached profile if inputs haven't changed
  if (cachedKey === key && cachedProfile) {
    return cachedProfile;
  }

  const looksLowPower =
    prefersReducedMotion || isMobile || deviceMemory <= 4 || cores <= 4;

  const defaultDprMax = Math.min(2, dpr);
  const maxDpr = looksLowPower ? 1 : defaultDprMax;

  cachedProfile = {
    level: looksLowPower ? "low" : "standard",
    dpr: [1, maxDpr],
    disableEffects: prefersReducedMotion,
    particleMultiplier: looksLowPower ? 0.25 : 0.6,
  };
  cachedKey = key;

  return cachedProfile;
}

function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  window.addEventListener("resize", callback);

  return () => {
    mediaQuery.removeEventListener("change", callback);
    window.removeEventListener("resize", callback);
  };
}

/**
 * Derives a coarse performance profile to keep older/low-power devices responsive.
 * Heuristics:
 * - prefers-reduced-motion
 * - narrow/mobile screens
 * - low device memory / core count
 */
export function usePerformanceProfile() {
  return useSyncExternalStore(
    subscribe,
    computeProfile,
    () => SERVER_DEFAULT_PROFILE,
  );
}
