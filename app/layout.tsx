import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lintang — Creative Developer",
  description: "Interactive portfolio inspired by a cinematic 3D web experience."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
