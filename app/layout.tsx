import type { Metadata } from "next";
import { Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: 'swap',
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "B(logN) | Neo-Brutalist Blogging",
  description: "A bold, neo-brutalist blogging platform built with Next.js, MongoDB, and TipTap.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${syne.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-screen bg-[#F4F4F1] text-black dark:bg-[#121212] dark:text-[#F4F4F1] selection:bg-[#FFD700] selection:text-black"
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
