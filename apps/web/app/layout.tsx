import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import type { CSSProperties, ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "OmniSite AI",
  description: "AI-powered website operations dashboard for agencies."
};

const fontVariables = {
  "--font-sans": '"Space Grotesk", "Aptos", "Segoe UI", sans-serif',
  "--font-display": '"Fraunces", "Georgia", serif'
} as CSSProperties;

export default function RootLayout({ children }: { children: ReactNode }) {
  const document = (
    <html data-scroll-behavior="smooth" lang="en" style={fontVariables}>
      <body>{children}</body>
    </html>
  );

  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return document;
  }

  return <ClerkProvider>{document}</ClerkProvider>;
}
