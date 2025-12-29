import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AggressiveMarquee from "@/components/AggressiveMarquee";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "noTrainer",
  description: "Train smart. Build strong. No Trainer needed.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AggressiveMarquee />
        <Navbar />
        <SmoothCursor />

        <main>{children}</main>

        <Script
          src="https://cdn.botpress.cloud/webchat/v3.3/inject.js"
          strategy="afterInteractive"
        />

        <Script
          src="https://files.bpcontent.cloud/2025/10/26/10/20251026104956-H0EYYHP6.js"
          strategy="afterInteractive"
          defer
        />

        <Footer />
      </body>
    </html>
  );
}
