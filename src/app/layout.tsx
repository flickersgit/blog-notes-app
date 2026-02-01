import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from "@/lib/contexts/SettingsContext";

export const metadata: Metadata = {
  title: "Notes",
  description: "A simple notes app with Apple Notes style",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}
