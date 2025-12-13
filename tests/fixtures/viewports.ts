export const VIEWPORTS = {
  // Desktop
  desktopLarge: { width: 1920, height: 1080 },
  desktop: { width: 1440, height: 900 },
  desktopSmall: { width: 1280, height: 720 },

  // Tablet
  tabletLandscape: { width: 1024, height: 768 },
  tabletPortrait: { width: 768, height: 1024 },

  // Mobile
  mobileIPhone14: { width: 390, height: 844 },
  mobileIPhoneSE: { width: 375, height: 667 },
  mobileAndroid: { width: 360, height: 800 },
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type ViewportName = keyof typeof VIEWPORTS;
export type BreakpointName = keyof typeof BREAKPOINTS;
