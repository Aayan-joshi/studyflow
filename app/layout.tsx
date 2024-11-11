import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeProvider from "@/context/Theme";
import React from 'react';
import {Toaster} from "@/components/ui/toaster";
import {SessionProvider} from "next-auth/react";
import {auth} from "@/auth";

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

const RootLayout= async ({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) => {
    const session = await auth()

  return (
      <html lang="en" suppressHydrationWarning>
        <SessionProvider session={session}>
          <body
              className={`${inter.className} ${spaceGrotesk.variable} antialiased`}
          >
            <ThemeProvider
                attribute={"class"}
                defaultTheme={`system`}
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
           <Toaster />
          </body>
        </SessionProvider>

      </html>
  );
}

export default RootLayout;