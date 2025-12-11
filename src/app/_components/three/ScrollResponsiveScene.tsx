"use client";

import { useMemo } from "react";
import { Html } from "@react-three/drei";
import Blob from "./Blob";
import { useScrollSection, SectionName } from "@/lib/useScrollSection";

// Import MaskedScene from Hero (without the Blob and with opacity support)
import { MaskedScene } from "./Hero";

// Import content components
import { TeamContent } from "../Team";
import { ThesisContent } from "../Thesis";
import { PortfolioContent } from "../Portfolio";

// Blob parameters for each section
const SECTION_PARAMS: Record<SectionName, { flop: number; eggplant: number }> =
  {
    hero: { flop: 0.1, eggplant: 0.0 },
    team: { flop: -1.0, eggplant: 5.0 },
    thesis: { flop: 1.0, eggplant: 1.0 },
    portfolio: { flop: -0.5, eggplant: 2.5 },
  };

// Linear interpolation helper
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export default function ScrollResponsiveScene() {
  const { currentSection, progress, scrollY } = useScrollSection();

  // Calculate interpolated Blob parameters
  const blobParams = useMemo(() => {
    // Ensure we have a valid section, default to hero
    const section = currentSection || "hero";
    const current = SECTION_PARAMS[section];

    // Determine next section for interpolation
    let next = current;
    if (section === "hero" && progress > 0.7) {
      next = SECTION_PARAMS.team;
    } else if (section === "team" && progress > 0.7) {
      next = SECTION_PARAMS.thesis;
    } else if (section === "thesis" && progress > 0.7) {
      next = SECTION_PARAMS.portfolio;
    }

    // Smooth interpolation when transitioning between sections
    const t = Math.max(0, Math.min(1, (progress - 0.7) / 0.3)); // Clamp t between 0 and 1

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
      if (progress > 0.9) {
        return Math.max(0, 1 - (progress - 0.9) / 0.1);
      }
      return 1;
    }
    return 0;
  }, [currentSection, progress]);

  // Calculate vertical offset for hero text based on scroll
  // This makes the hero section "scroll up" naturally
  const heroYOffset = useMemo(() => {
    // Only apply offset during hero section
    if (currentSection === "hero") {
      // Move the text up as we scroll through the hero section
      // Scale factor adjusted for 300vh hero section
      const scrollFactor = 0.003; // Adjust this to control scroll speed
      return -(scrollY * scrollFactor);
    }
    // Keep at final position after hero section
    return -(scrollY * 0.003);
  }, [scrollY, currentSection]);

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
        <group position={[0, heroYOffset, 0]}>
          <MaskedScene scrollProgress={progress} />
        </group>
      )}

      {/* Team Section - positioned in 3D space */}
      {currentSection === "team" && (
        <Html
          position={[0, 0, -5]}
          transform
          occlude
          style={{
            width: "800px",
            pointerEvents: "auto",
          }}
        >
          <div className="flex items-center justify-center">
            <TeamContent />
          </div>
        </Html>
      )}

      {/* Thesis Section - positioned in 3D space */}
      {currentSection === "thesis" && (
        <Html
          position={[0, 0, -5]}
          transform
          occlude
          style={{
            width: "800px",
            pointerEvents: "auto",
          }}
        >
          <div className="flex items-center justify-center">
            <ThesisContent />
          </div>
        </Html>
      )}

      {/* Portfolio Section - positioned in 3D space */}
      {currentSection === "portfolio" && (
        <Html
          position={[0, 0, -5]}
          transform
          occlude
          style={{
            width: "800px",
            pointerEvents: "auto",
          }}
        >
          <div className="flex items-center justify-center">
            <PortfolioContent />
          </div>
        </Html>
      )}
    </group>
  );
}
