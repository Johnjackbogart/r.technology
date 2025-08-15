"use client";
import { useEffect, useState } from "react";

export type Page = "Hero" | "Team" | "Thesis" | "Portfolio";

const HASH_TO_PAGE: Record<string, Page> = {
  "#hero": "Hero",
  "#team": "Team",
  "#thesis": "Thesis",
  "#portfolio": "Portfolio",
};

export function useHashPage(defaultPage: Page = "Hero"): Page {
  // Read initial value on first render (avoids a flash on mount)
  const initial =
    typeof window !== "undefined"
      ? (HASH_TO_PAGE[window.location.hash.toLowerCase()] ?? defaultPage)
      : defaultPage;

  const [page, setPage] = useState<Page>(initial);

  useEffect(() => {
    const update = () => {
      const p = HASH_TO_PAGE[window.location.hash.toLowerCase()] ?? defaultPage;
      setPage(p);
    };
    // In case something else mutates the hash
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, [defaultPage]);

  return page;
}
