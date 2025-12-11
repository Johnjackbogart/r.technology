"use client";

import { useMemo } from "react";
import { Html } from "@react-three/drei";
import Blob from "./Blob";
import { useScrollSection, SectionName } from "@/lib/useScrollSection";

// Import MaskedScene from Hero (without the Blob and with opacity support)
import { MaskedScene } from "./Hero";

// Import content components
import { TeamContent } from "../Team";
import { AboutContent } from "../About";
import { PortfolioContent } from "../Portfolio";

// Blob parameters for each section
const SECTION_PARAMS: Record<SectionName, { flop: number; eggplant: number }> =
  {
    hero: { flop: 0.1, eggplant: 0.0 },
    team: { flop: -1.0, eggplant: 5.0 },
    about: { flop: 1.0, eggplant: 1.0 },
    portfolio: { flop: -0.5, eggplant: 2.5 },
  };

// Keep hero text fully visible until the word loop finishes
const HERO_FADE_START = 0.9;
const HERO_FADE_RANGE = 0.1;
const HERO_WORD_PROGRESS_SPAN = HERO_FADE_START;

// Linear interpolation helper
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const FADE_IN_START = 0.88;
const FADE_IN_END = 0.98;
const FADE_OUT_START = 0.02;
const FADE_OUT_END = 0.2;
// Team fades handled only within the team section itself

export default function ScrollResponsiveScene() {
  const { currentSection, progress, scrollY } = useScrollSection();

  // Calculate interpolated Blob parameters
  const blobParams = useMemo(() => {
    // Ensure we have a valid section, default to hero
    const section = currentSection || "hero";
    const current = SECTION_PARAMS[section];

    // Wait until hero words finish cycling before morphing the blob
    const heroWordsComplete =
      section !== "hero" || progress >= HERO_WORD_PROGRESS_SPAN;

    // Determine next section for interpolation
    let next = current;
    if (section === "hero" && heroWordsComplete) {
      next = SECTION_PARAMS.team;
    } else if (section === "team" && progress > 0.7) {
      next = SECTION_PARAMS.about;
    } else if (section === "about" && progress > 0.7) {
      next = SECTION_PARAMS.portfolio;
    }

    // Smooth interpolation when transitioning between sections
    const t =
      section === "hero"
        ? Math.max(
            0,
            Math.min(
              1,
              (progress - HERO_WORD_PROGRESS_SPAN) /
                (1 - HERO_WORD_PROGRESS_SPAN),
            ),
          )
        : Math.max(0, Math.min(1, (progress - 0.7) / 0.3)); // Clamp t between 0 and 1

    const params = {
      flop: lerp(current.flop, next.flop, t),
      eggplant: lerp(current.eggplant, next.eggplant, t),
    };

    // Safeguard against NaN or invalid values
    if (isNaN(params.flop) || isNaN(params.eggplant)) {
      console.error("Invalid blob params detected:", {
        section,
        progress,
        t,
        params,
      });
      return { flop: 1.0, eggplant: 1.0 }; // Fallback to default
    }

    return params;
  }, [currentSection, progress]);

  // Calculate opacity for Hero text (fade out at end of hero section)
  const heroOpacity = useMemo(() => {
    const section = currentSection || "hero";
    if (section === "hero") {
      // Fade out in the last 10% of the hero section
      if (progress > HERO_FADE_START) {
        return Math.max(0, 1 - (progress - HERO_FADE_START) / HERO_FADE_RANGE);
      }
      return 1;
    }
    return 0;
  }, [currentSection, progress]);

  // Ensure all hero words advance before the fade begins
  const heroWordProgress = useMemo(() => {
    if (currentSection !== "hero") return 1;
    return Math.min(progress / HERO_WORD_PROGRESS_SPAN, 1);
  }, [currentSection, progress]);

  // Keep hero fixed vertically; push it forward in Z once words finish
  const heroYOffset = useMemo(() => 0, []);
  const heroZOffset = useMemo(() => {
    if (currentSection !== "hero") return 8; // keep it out of view after hero

    const slideProgress =
      progress <= HERO_WORD_PROGRESS_SPAN
        ? 0
        : (progress - HERO_WORD_PROGRESS_SPAN) / (1 - HERO_WORD_PROGRESS_SPAN);

    const maxForwardTravel = 8; // tune for camera distance (camera z = 10)
    return slideProgress * maxForwardTravel;
  }, [currentSection, progress]);

  // Smoothly bring 2D sections into view instead of snapping
  const getSectionVisibility = useMemo(() => {
    return (section: SectionName) => {
      switch (section) {
        case "team": {
          return currentSection === "team" ? 1 : 0;
        }
        case "about": {
          if (currentSection === "team") {
            return clamp01(
              (progress - FADE_IN_START) / (FADE_IN_END - FADE_IN_START),
            );
          }
          if (currentSection === "about") return 1;
          return 0; // hide when in hero/portfolio
        }
        case "portfolio": {
          if (currentSection === "about") {
            return clamp01(
              (progress - FADE_IN_START) / (FADE_IN_END - FADE_IN_START),
            );
          }
          if (currentSection === "portfolio") return 1;
          return 0;
        }
        default:
          return 0;
      }
    };
  }, [currentSection, progress]);

  return (
    <group>
      {/* Blob with interpolated parameters - always visible */}
      <Blob
        points={100000}
        flopAmount={blobParams.flop}
        eggplantAmount={blobParams.eggplant}
        speed={0.5}
      />

      {/* Lighting for the scene */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 4, 3]} intensity={1.2} />
      <directionalLight position={[-3, 2, 2]} intensity={0.6} />
      <directionalLight position={[0, 1, -6]} intensity={0.4} color="#b6f2c8" />

      {/* Hero 3D Text with fade-out and scroll offset */}
      {heroOpacity > 0.01 && (
        <group position={[0, heroYOffset, heroZOffset]}>
          <MaskedScene scrollProgress={heroWordProgress} />
        </group>
      )}

      {/* Team Section - positioned in 3D space */}
      <Html
        position={[0, 0, -5]}
        transform
        occlude
        style={{
          width: "min(700px, 75vw)",
          pointerEvents: getSectionVisibility("team") > 0.15 ? "auto" : "none",
          opacity: getSectionVisibility("team"),
          transform: `translate3d(0, ${30 * (1 - getSectionVisibility("team"))}px, 0)`,
          transition: "opacity 200ms linear, transform 200ms linear",
        }}
      >
        <div className="flex items-center justify-center">
          <TeamContent />
        </div>
      </Html>

      {/* About Section - positioned in 3D space */}
      <Html
        position={[0, 0, -5]}
        transform
        occlude
        style={{
          width: "min(1000px, 75vw)",
          pointerEvents: getSectionVisibility("about") > 0.15 ? "auto" : "none",
          opacity: getSectionVisibility("about"),
          transform: `translate3d(0, ${30 * (1 - getSectionVisibility("about"))}px, 0)`,
          transition: "opacity 200ms linear, transform 200ms linear",
        }}
      >
        <div className="flex items-center justify-center">
          <AboutContent />
        </div>
      </Html>

      {/* Portfolio Section - positioned in 3D space */}
      <Html
        position={[0, 0, -5]}
        transform
        occlude
        style={{
          width: "min(700px, 75vw)",
          pointerEvents:
            getSectionVisibility("portfolio") > 0.15 ? "auto" : "none",
          opacity: getSectionVisibility("portfolio"),
          transform: `translate3d(0, ${30 * (1 - getSectionVisibility("portfolio"))}px, 0)`,
          transition: "opacity 200ms linear, transform 200ms linear",
        }}
      >
        <div className="flex items-center justify-center">
          <PortfolioContent />
        </div>
      </Html>
    </group>
  );
}
