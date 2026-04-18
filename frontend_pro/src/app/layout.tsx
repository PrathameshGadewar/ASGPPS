import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ASGPPS Pro | AI Placement Intelligence",
  description: "Adaptive Skill Gap & Placement Prediction System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased selection:bg-neon-blue selection:text-black`}>
        {children}
      </body>
    </html>
  );
}
