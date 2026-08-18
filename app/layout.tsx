import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Last Dance — Karaoke Party",
  description: "Premium real-time karaoke event management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
