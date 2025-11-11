import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { env } from "@/config/env";
import { Providers } from "@/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-text`}>
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