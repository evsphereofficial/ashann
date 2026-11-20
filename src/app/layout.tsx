import type { Metadata, Viewport } from "next";
import { Anton, Caveat, Fraunces, Inter } from "next/font/google";
import "./globals.css";

/* Four roles, four families — editorial serif for romance, clean sans for
   labels and body, handwritten for notes, condensed display for the JoJo
   magazine chapter. Each is bound to a CSS variable consumed in globals.css. */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Six Months, One Little Universe — an anniversary scrapbook",
  description:
    "A cinematic, interactive scrapbook made for a six-month anniversary: photographs, letters, paper keepsakes and a JoJo-inspired fan magazine that assemble themselves as you explore.",
  // No index, no follow: this is a private gift, not a public page.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#efe4d6",
  width: "device-width",
  initialScale: 1,
  // Prevent iOS from rubber-banding the whole page during drag interactions.
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${caveat.variable} ${anton.variable} h-full`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
