import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupportAI — Resolve 90% of support tickets automatically",
  description:
    "SupportAI learns from your documentation and instantly answers customer support tickets using RAG. High-confidence tickets auto-resolve — others go to your agents with the AI response pre-filled.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
