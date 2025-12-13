import "@/styles/globals.css";
import { GeistMono } from "geist/font/mono";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import ThemeProvider from "&/theme";
import { cookies, headers } from "next/headers";

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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const headerList = await headers();

  const themeCookie = cookieStore.get("theme")?.value;
  const prefers = headerList.get("sec-ch-prefers-color-scheme");

  const resolvedPref = prefers === "dark" || prefers === "light" ? prefers : "light";
  const initialTheme: "dark" | "light" =
    themeCookie === "dark" || themeCookie === "light"
      ? themeCookie
      : themeCookie === "system"
        ? resolvedPref
        : resolvedPref;
  const clientDefaultTheme =
    themeCookie === "dark" || themeCookie === "light" || themeCookie === "system"
      ? themeCookie
      : "system";

  return (
    <html
      lang="en"
      className={`${GeistMono.className} min-h-screen ${initialTheme === "dark" ? "dark" : "light"}`}
      style={{ colorScheme: initialTheme === "dark" ? "dark" : "light" }}
    >
      <body className="min-h-screen bg-gradient-to-b from-[#333] via-[#f5f5f5] to-[#999] bg-fixed dark:from-[#0b0b0b] dark:via-[#050505] dark:to-[#000]">
        <div className="flex min-h-screen flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme={clientDefaultTheme}
            storageKey="r-theme"
            enableSystem
          >
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
