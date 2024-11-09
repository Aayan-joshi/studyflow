import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeProvider from "@/context/Theme";
import React from 'react';

const inter = localFont({
  src: "fonts/InterVF.ttf",
  variable: "--font-inter",
});
const spaceGrotesk = localFont({
  src: "fonts/SpaceGroteskVF.ttf",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  icons: "/images/site-logo.svg",
  title: "Study Flow",
  description: "Study Flow : Your Personal Study Assistant",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning>
          <body
              className={`${inter.className} ${spaceGrotesk.variable} antialiased`}
          >
            <ThemeProvider attribute={"class"} defaultTheme={`system`} enableSystem disableTransitionOnChange>
                {children}
            </ThemeProvider>
          </body>
      </html>
  );
}