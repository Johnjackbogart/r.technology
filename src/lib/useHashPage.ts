//GPT special
"use client";
import { useMemo, useSyncExternalStore } from "react";

export type Page = "Hero" | "Team" | "Thesis" | "Portfolio";

const HASH_TO_PAGE: Record<string, Page> = {
  "#hero": "Hero",
  "#team": "Team",
  "#thesis": "Thesis",
  "#portfolio": "Portfolio",
};

function getHash() {
  return typeof window === "undefined"
    ? ""
    : window.location.hash.toLowerCase();
}

export function useHashPage(defaultPage: Page = "Hero"): Page {
  const hash = useSyncExternalStore(subscribeToHash, getHash, () => "");

  return useMemo(() => {
    return HASH_TO_PAGE[hash] ?? defaultPage;
  }, [hash, defaultPage]);
}

// Subscribe to ALL ways the URL can change: hashchange, back/forward, pushState/replaceState.
function subscribeToHash(onChange: () => void) {
  if (typeof window === "undefined") return () => null;

  const notify = () => onChange();

  window.addEventListener("hashchange", notify);
  window.addEventListener("popstate", notify);

  //binding fixes issue:
  //37:23  Error: Avoid referencing unbound methods which may cause unintentional scoping of `this`.
  const origPush = history.pushState.bind(history);
  const origReplace = history.replaceState.bind(history);

  history.pushState = function (...args: Parameters<typeof history.pushState>) {
    // @ts-expect-error – TS isn’t great with the variadic type here
    origPush.apply(this, args);
    notify();
  } as typeof history.pushState;

  history.replaceState = function (
    ...args: Parameters<typeof history.pushState>
  ) {
    // @ts-expect-error – same as above
    origReplace.apply(this, args);
    notify();
  } as typeof history.replaceState;

  return () => {
    window.removeEventListener("hashchange", notify);
    window.removeEventListener("popstate", notify);
    history.pushState = origPush;
    history.replaceState = origReplace;
  };
}
