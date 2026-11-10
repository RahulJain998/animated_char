import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Animagic Studio",
  description: "Create characters, animated scenes, and cartoon stories.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
