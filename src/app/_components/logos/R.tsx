"use client";

import type { SVGProps } from "react";
import type { Theme } from "&/theme";

interface headerProps extends SVGProps<SVGSVGElement> {
  theming: Theme;
}

export default function R({ theming }: headerProps) {
  if (!theming) return;
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 396.875 396.87499"
      xmlns="http://www.w3.org/2000/svg"
      className={"overflow-visible"}
    >
      <defs>
        <radialGradient
          id="shimmer"
          cx="50%"
          cy="50%"
          r="25%"
          fx="100%"
          fy="100%"
          spreadMethod="pad"
        >
          <stop offset="0%" stopColor={`${theming.shimmer}88`} />
          <stop offset="100%" stopColor={`${theming.shimmer}22`} />
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
        </filter>
        <mask id="fade-mask">
          <radialGradient id="mask-gradient">
            <stop offset="60%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <circle cx="156.5" cy="156.5" r="250" fill="url(#mask-gradient)" />
        </mask>
        <linearGradient
          id="outerg"
          x1="315.22955"
          y1="314.33469"
          x2="4.8054199"
          y2="4.4395285"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="transparent" />
          <stop offset="100" stopColor={`${theming.icon}`} />
        </linearGradient>
      </defs>
      <g fill={"url(#outerg)"}>
        <path d="M 48.871896,28.46531 C 36.185471,38.350464 25.036783,50.88005 23.845005,87.115825 l 0.08475,265.407505 31.953605,0.19586 V 87.81804 c -0.09221,-1.10323 0.04955,-4.657766 0.04955,-5.784849 0,-21.893436 18.030605,-37.005698 39.924048,-37.005698 1.188387,0 6.271562,-0.03889 7.437852,-0.03889 l 45.00307,0 V 14.227752 L 95.188405,14.003741 C 76.753404,14.041731 63.641963,16.9566 48.871896,28.46531 Z" />
        <ellipse
          id="path910"
          cx="171.64211"
          cy="29.356369"
          rx="15.730697"
          ry="15.524262"
        />
      </g>
    </svg>
  );
}
