import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RaphaelAI - Free AI Image Generator",
  description: "Generate stunning images with AI - Free, unlimited, no sign-up required",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
