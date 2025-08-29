import "@/styles/globals.css";
import { GeistMono } from "geist/font/mono";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import Nav from "&/nav";
import ThemeProvider from "&/theme";

export const metadata: Metadata = {
  title: "Hi :)",
  description: "r.tech",
  icons: [
    {
      media: "(prefers-color-scheme: light)",
      url: "/images/favicon-light.ico",
      href: "/images/favicon-light.ico",
    },
    {
      media: "(prefers-color-scheme: dark)",
      url: "/images/favicon-dark.ico",
      href: "/images/favicon-dark.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistMono.className}`}>
      <body>
        <div className="flex h-dvh flex-col">
          <ThemeProvider attribute="class" defaultTheme="system">
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
