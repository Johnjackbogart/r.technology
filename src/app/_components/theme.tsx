"use client";

import { useState, useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

//https://github.com/shadcn-ui/ui/issues/5706
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider enableSystem={true} {...props}>
      {children}
    </NextThemesProvider>
  );
}

interface Fill {
  icon: string;
}

interface Fills {
  dark: Fill;
  light: Fill;
  system: Fill;
}

type Themes = "light" | "dark" | "system";

export interface ThemeFill {
  theme: Themes;
  isSystem: boolean;
  icon: string;
  shimmer: string;
}

export interface Shimmers {
  dark: "#000000";
  light: "#ffffff";
  system: "transparent";
}

export type Theme = ThemeFill | undefined | null;

export function useThemeToFill() {
  //theme may be undefined, so need to properly handle both here. The decision is to set the icon to be invisible
  const { resolvedTheme: nextTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  //i don't like this
  if (!mounted) return null;
  const isSystem = nextTheme === "system" ? true : false;
  const theme: Themes = nextTheme as Themes; //can return string | undefined, may  as well typecast
  const fills: Fills = {
    dark: {
      icon: "#ffffff",
    },
    light: {
      icon: "#000000",
    },
    system: {
      icon: "transparent",
    },
  };
  const shimmers: Shimmers = {
    dark: "#000000",
    light: "#ffffff",
    system: "transparent",
  };
  console.log(JSON.stringify(fills[theme]));
  const theming: Theme = {
    theme: theme,
    isSystem: isSystem,
    icon: fills[theme].icon,
    shimmer: shimmers[theme],
  };

  return theming;
}
