import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import Nav from "&/nav";
import ThemeProvider from "&/theme";

export const metadata: Metadata = {
  title: "Hi :)",
  description: "My Personal Website, welcome!",
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
    <html lang="en" className={`${GeistSans.variable}`}>
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
