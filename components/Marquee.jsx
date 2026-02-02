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
  const [showCursor, setShowCursor] = useState(true);

  const typingTimer = useRef(null);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typing Logic
  useEffect(() => {
    if (isPaused) return;

    const currentQuote = QUOTES[quoteIndex];

    if (charIndex < currentQuote.length) {
      typingTimer.current = setTimeout(() => {
        setDisplayText((prev) => prev + currentQuote[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 50); 
    } else {
      typingTimer.current = setTimeout(() => {
        setDisplayText("");
        setCharIndex(0);
        setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
      }, 3000);
    }

    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, [charIndex, quoteIndex, isPaused]);

  return (
    // UPDATED: Visible Background Color + Yellow Accent Border
    <div className="sticky top-0 z-[100] w-full h-10 md:h-12 bg-neutral-900 border-b border-yellow-500/30 flex items-center justify-center shadow-lg">
      
      <div className="w-full max-w-7xl mx-auto px-4 flex items-center justify-between relative h-full">
        
        {/* LEFT: Badge */}
        <div className="flex-shrink-0 flex items-center gap-2 z-20">
          <div className="flex items-center gap-2 bg-red-600 px-2.5 py-1 rounded shadow-sm">
            <Flame size={12} className="text-white fill-white" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest hidden sm:block">
              MODE
            </span>
          </div>
        </div>

        {/* CENTER: Text (Yellow) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h2 className="text-xs md:text-sm font-mono font-bold uppercase tracking-wider text-yellow-400 truncate max-w-[60%] md:max-w-[70%] text-center drop-shadow-sm">
            {displayText}
            <span 
              className={`inline-block w-2 md:w-2.5 h-4 md:h-5 ml-1 align-middle bg-yellow-400 ${showCursor ? 'opacity-100' : 'opacity-0'}`} 
            />
          </h2>
        </div>

        {/* RIGHT: Controls */}
        <div className="flex-shrink-0 flex items-center gap-3 z-20">
            
          {/* Divider */}
          <div className="hidden md:block h-5 w-[1px] bg-white/20" />

          <button
            onClick={() => setIsPaused((p) => !p)}
            className="group flex items-center gap-3 focus:outline-none"
            aria-label={isPaused ? "Play" : "Pause"}
          >
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest hidden md:block group-hover:text-white transition-colors">
              {isPaused ? "RESUME" : "PAUSE"}
            </span>

            {/* UPDATED BUTTON: Solid Background, Brighter, Pop Effect */}
            <div className={`
              w-8 h-8 flex items-center justify-center rounded border transition-all duration-200 shadow-sm
              ${isPaused 
                ? 'bg-yellow-500 border-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.4)]' // Active State
                : 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:border-zinc-500'} // Default State (Solid & Bright)
            `}>
              {isPaused ? (
                <Play size={12} className="fill-current ml-0.5" />
              ) : (
                <Pause size={12} className="fill-current" />
              )}
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}