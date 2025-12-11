"use client";

import { useState, useEffect, useRef } from "react";

export type SectionName = "hero" | "team" | "about" | "portfolio";

export interface ScrollSectionState {
  currentSection: SectionName;
  progress: number; // 0-1, progress through current section
  scrollY: number;
}

export function useScrollSection(): ScrollSectionState {
  const [state, setState] = useState<ScrollSectionState>({
    currentSection: "hero",
    progress: 0,
    scrollY: 0,
  });

  const lastHashRef = useRef<string>("");

  useEffect(() => {
    const sections = ["hero", "team", "about", "portfolio"];
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: [0, 0.25, 0.5, 0.75, 1.0],
    };

    const observers: IntersectionObserver[] = [];
    const visibilityMap = new Map<string, number>();

    const updateState = () => {
      // Find the most visible section
      let maxVisibility = 0;
      let mostVisibleSection: SectionName = "hero";

      visibilityMap.forEach((visibility, id) => {
        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          mostVisibleSection = id as SectionName;
        }
      });

      // Calculate progress through the current section
      const sectionElement = document.getElementById(mostVisibleSection);
      let progress = 0;
      const scrollY = window.scrollY;

      if (sectionElement) {
        const rect = sectionElement.getBoundingClientRect();
        const sectionHeight = sectionElement.offsetHeight;
        const viewportHeight = window.innerHeight;

        // Calculate how far through the section we are
        // When section top is at viewport top, progress = 0
        // When section bottom is at viewport bottom, progress = 1
        const scrolledIntoSection = -rect.top;
        const denominator = Math.max(1, sectionHeight - viewportHeight); // Prevent division by zero
        progress = Math.max(0, Math.min(1, scrolledIntoSection / denominator));
      }

      setState({
        currentSection: mostVisibleSection,
        progress,
        scrollY,
      });

      // Update URL hash if section changed
      const newHash = `#${mostVisibleSection}`;
      if (lastHashRef.current !== newHash && mostVisibleSection !== "hero") {
        lastHashRef.current = newHash;
        history.replaceState(null, "", newHash);
      } else if (mostVisibleSection === "hero" && lastHashRef.current !== "") {
        lastHashRef.current = "";
        history.replaceState(null, "", window.location.pathname);
      }
    };

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          visibilityMap.set(id, entry.intersectionRatio);
          updateState();
        });
      }, observerOptions);

      observer.observe(element);
      observers.push(observer);
    });

    // Also listen to scroll events for smooth progress updates
    const handleScroll = () => {
      updateState();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observers.forEach((observer) => observer.disconnect());
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return state;
}
