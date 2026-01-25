"use client";

import React, { useEffect, useState, useRef } from "react";
import { Pause, Play, Flame } from "lucide-react";

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
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const typingTimer = useRef(null);

  useEffect(() => {
    if (isPaused) return;

    const currentQuote = QUOTES[quoteIndex];

    if (charIndex < currentQuote.length) {
      typingTimer.current = setTimeout(() => {
        setDisplayText((prev) => prev + currentQuote[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 40);
    } else {
      typingTimer.current = setTimeout(() => {
        setDisplayText("");
        setCharIndex(0);
        setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
      }, 2400);
    }

    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, [charIndex, quoteIndex, isPaused]);

  return (
    <div className="sticky top-0 z-[60] w-full h-10 md:h-12 overflow-hidden border-b border-yellow-400/20">
      {/* Brighter background */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900" />
      <div className="absolute inset-0 opacity-80 bg-[radial-gradient(900px_200px_at_50%_-10%,rgba(65, 98, 158, 0.89),transparent_60%)]" />
      <div className="absolute inset-0 opacity-60 bg-[radial-gradient(700px_220px_at_15%_120%,rgba(60, 224, 120, 0.9),transparent_60%)]" />
      <div className="absolute inset-0 opacity-55 bg-[radial-gradient(700px_220px_at_85%_120%,rgba(203, 113, 74, 0.91),transparent_60%)]" />
      <div className="absolute inset-0 bg-white/5 backdrop-blur-md" />

      {/* Content */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-3 md:px-5">
        {/* Centered quote */}
        <div className="absolute inset-0 flex items-center justify-center px-12 md:px-20">
          <h2 className="text-[11px] md:text-sm font-extrabold italic uppercase tracking-wider text-center truncate">
            <span className="text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]">
              {displayText}
            </span>
          </h2>
        </div>

        {/* Left + Right controls */}
        <div className="relative h-full flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md px-2 py-0.5 bg-black border border-white/20">
              <Flame size={12} className="text-red-600" />
              <span className="text-[9px] font-black text-white/80 uppercase tracking-[0.18em] hidden sm:block">
                Motivation
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block h-3 w-[1px] bg-white/25" />

            <button
              onClick={() => setIsPaused((p) => !p)}
              className="flex items-center gap-2 group text-white/80 hover:text-yellow-300 transition-colors"
              aria-label={isPaused ? "Play" : "Pause"}
            >
              <span className="text-[9px] font-mono tracking-widest hidden md:block uppercase opacity-90">
                {isPaused ? "Resume" : "Hold"}
              </span>

              <div className="w-7 h-7 md:w-7 md:h-7 flex items-center justify-center rounded-md border border-white/25 bg-black/20 group-hover:border-yellow-300/60 group-hover:bg-yellow-400/15 transition-colors">
                {isPaused ? (
                  <Play size={11} className="fill-current" />
                ) : (
                  <Pause size={11} className="fill-current" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
