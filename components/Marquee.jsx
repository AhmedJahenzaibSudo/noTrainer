"use client";

import React, { useState, useEffect } from "react";
import {
  Pause,
  Play,
  Maximize,
  Minimize,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import AuthButton from "@/components/AuthButton";

// ============================================
// CONFIGURATION
// ============================================
const config = {
  colors: {
    bgPrimary: "#051061",
    bgDark: "#020a21",
    accent: "#1AF0BE",
    textPrimary: "#ffffff",
  },
};

const QUOTES = [
  "Shut Up and Lift",
  "Bahane chhor, wazan utha",
  "One More Rep",
  "The Bar Isn’t Heavy, You Are",
  "Excuses Burn Zero Calories",
  "Train Smart, Train Hard",
  "Gym aya hai, shaadi hall nahi",
  "Shakal nahi, strength dikha",
  "Beta excuses Facebook pe chor",
  "Push Limits, Break Barriers",
];

export default function Marquee() {
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen Logic
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen: ${e.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div
      className="sticky top-0 z-[100] w-full h-10 md:h-12 flex items-center border-b shadow-lg"
      style={{
        backgroundColor: config.colors.bgDark,
        borderColor: `${config.colors.accent}30`,
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-3 md:px-4 flex items-center justify-between relative h-full">
        
        {/* LEFT */}
        <div className="flex items-center gap-2 flex-shrink-0 z-20 relative">
          <Navbar />
        </div>

        {/* CENTER: Ticker */}
        <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none">
          <div
            className={`ticker-mask flex gap-8 md:gap-12 whitespace-nowrap ${
              isPaused ? "pause-marquee" : "animate-marquee"
            }`}
            style={{
              fontFamily: "'Krona One', sans-serif",
              color: config.colors.accent,
            }}
          >
            {[...QUOTES, ...QUOTES].map((quote, i) => (
              <span
                key={i}
                className="text-[10px] md:text-sm font-bold uppercase tracking-wider drop-shadow-sm px-2"
              >
                {quote}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-shrink-0 flex items-center gap-2 z-20">

          {/* Auth Button */}
          <AuthButton />

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border text-white transition-all active:scale-90"
            style={{
              backgroundColor: "rgba(54, 73, 218, 0.9)",
              borderColor: "rgba(26, 240, 190, 0.3)",
            }}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>

          {/* Pause Button */}
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border transition-all duration-200 shadow-sm focus:outline-none"
            style={{
              backgroundColor: isPaused ? "#22c55e" : "#2563eb",
              borderColor: isPaused ? "#86efac" : "#60a5fa",
              color: "#ffffff",
              boxShadow: isPaused
                ? "0 0 12px rgba(34,197,94,0.45)"
                : "0 0 12px rgba(37,99,235,0.45)",
            }}
            aria-label={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? (
              <Play size={12} className="fill-current ml-0.5" />
            ) : (
              <Pause size={12} className="fill-current" />
            )}
          </button>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        .animate-marquee {
          animation: ticker 40s linear infinite;
        }

        .pause-marquee {
          animation-play-state: paused;
        }

        @keyframes ticker {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .ticker-mask {
          mask-image: linear-gradient(
            to right,
            transparent,
            black 90px,
            black calc(100% - 90px),
            transparent
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 90px,
            black calc(100% - 90px),
            transparent
          );
        }

        @media (max-width: 767px) {
          .ticker-mask {
            mask-image: linear-gradient(
              to right,
              transparent,
              black 76px,
              black calc(100% - 76px),
              transparent
            );
            -webkit-mask-image: linear-gradient(
              to right,
              transparent,
              black 76px,
              black calc(100% - 76px),
              transparent
            );
          }
        }
      `}</style>
    </div>
  );
}