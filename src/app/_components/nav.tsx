"use client";
import * as React from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { Button } from "#/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/dropdown-menu";
import { Github } from "^/Github";
import R from "^/R";
import { useThemeToFill } from "&/theme";
import pkg from "!/package.json";
import { useLenis } from "@/lib/useLenis";
import { useScrollSection } from "@/lib/useScrollSection";

export const Nav = () => {
  const { setTheme } = useTheme();
  const theming = useThemeToFill();
  const lenis = useLenis();
  const { currentSection } = useScrollSection();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    target: string,
  ) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.2 });
    }
  };

  const linkClass = (name: string) =>
    clsx(
      "transition-colors cursor-pointer",
      currentSection === name
        ? "font-semibold !underline"
        : "opacity-80 hover:opacity-100",
    );

  return (
    <div
      className={
        "w-m pointer-events-auto z-50 flex h-14 items-center overflow-visible border-b border-border bg-transparent"
      }
    >
      <div className={"h-full w-max gap-1 overflow-visible"}>
        <Link href="/" onClick={(e) => handleNavClick(e, "#hero")}>
          <R theming={theming} />
        </Link>
      </div>
      <div className={"ml-auto flex items-center gap-1"}>
        <div className="flex basis-2 gap-3 text-lg text-black dark:text-white">
          <Link
            href="#team"
            className={linkClass("team")}
            onClick={(e) => handleNavClick(e, "#team")}
          >
            Team
          </Link>
          <Link
            href="#about"
            className={linkClass("about")}
            onClick={(e) => handleNavClick(e, "#about")}
          >
            About
          </Link>
          <Link
            href="#portfolio"
            className={linkClass("portfolio")}
            onClick={(e) => handleNavClick(e, "#portfolio")}
          >
            Portolio
          </Link>
        </div>
        <Button
          onClick={() => {
            window.open(pkg.homepage, "_blank", "noopener noreferrer");
          }}
          variant={"ghost"}
          className={"ml-auto flex items-center gap-1.5"}
        >
          <span>
            <Github className={"size-4 text-black dark:text-white"} />
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 fill-black transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Nav;
