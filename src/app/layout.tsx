import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { env } from "@/config/env";
import { Providers } from "@/app/providers";

import { Inter, Outfit, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Task Genie - AI Based tasked management system",
  description: "An AI based task management system to boost productivity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{ variables: { fontFamily: "'Inter', sans-serif" } }}
      publishableKey={env.auth.CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${outfit.variable} ${mono.variable} font-sans bg-background text-text`}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

// TODO - onboarding screens with react hook forms
// TODO - add dashboard
// TODO - configure project themes with the app color schemes
// TODO - create components