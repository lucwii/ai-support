import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kleo — Resolve 90% of support tickets automatically",
  description:
    "Kleo learns from your documentation and instantly answers customer support tickets using RAG. High-confidence tickets auto-resolve — others go to your agents with the AI response pre-filled.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ backgroundColor: '#080C18' }}>
      <body className="antialiased" style={{ backgroundColor: '#080C18', color: '#FFFFFF', minHeight: '100vh' }}>{children}</body>
    </html>
  );
}
