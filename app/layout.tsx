import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import { ThemeSync } from "@/components/theme-toggle";
import { themeScript } from "@/lib/theme";
import "./globals.css";

// "Premium Sans" pairing from the UI/UX Pro Max typography search.
const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Corridor", template: "%s · Corridor" },
  description:
    "A landing page kit that leads with your images: a 3D corridor of your work streaming toward the viewer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Dark is the server default; the head script corrects it before paint,
    // so <html>'s class can differ from this markup on hydration.
    <html
      lang="en"
      className={`dark ${dmSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
