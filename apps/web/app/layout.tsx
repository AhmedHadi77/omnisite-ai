import type { Metadata } from "next";
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
  return (
    <html data-scroll-behavior="smooth" lang="en" style={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
