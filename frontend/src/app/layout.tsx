// UI shared between routes
import "./globals.css";
// self-host google font, served from deployment domain, not per request
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import Providers from "./providers";
import { UserProvider } from "@frontend/components/authentication/UserProvider";

// only consider or include the Latin subset of characters
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "rememberry",
  description: "rememberry",
};

// top-most layout, defines globally shared UI

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* children prop refers to the page component that the client sees atm */}
      <body className={`${inter.className}`}>
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>{children}</UserProvider>
        </Providers>
      </body>
      {/* condition needed to check the authentication status */}
    </html>
  );
}
