"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play } from "lucide-react";

function Marquee() {
  const quotes = [
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

  const colors = [
    "#f2ff01ff", "#00ec6eff",
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isFlooding, setIsFlooding] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentBg, setCurrentBg] = useState(colors[0]);

  const typingTimer = useRef(null);
  const nextColor = colors[(quoteIndex + 1) % colors.length];

  // 1. Typewriter Logic
  useEffect(() => {
    if (isPaused || isFlooding) return;

    const quote = quotes[quoteIndex];

    if (charIndex < quote.length) {
      typingTimer.current = setTimeout(() => {
        setDisplayText((p) => p + quote[charIndex]);
        setCharIndex((p) => p + 1);
      }, 60);
    } else {
      // Wait 1 second after typing completes
      typingTimer.current = setTimeout(() => {
        setIsFlooding(true);
      }, 1000); 
    }

    return () => clearTimeout(typingTimer.current);
  }, [charIndex, quoteIndex, isFlooding, isPaused]);

  // 2. Flood & State Reset Logic
  useEffect(() => {
    if (!isFlooding || isPaused) return;

    // After 500ms (duration of the flood animation), 
    // update the background and reset for the next quote
    const resetTimer = setTimeout(() => {
      setCurrentBg(nextColor);
      setDisplayText("");
      setCharIndex(0);
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
      setIsFlooding(false);
    }, 550); 

    return () => clearTimeout(resetTimer);
  }, [isFlooding, isPaused, nextColor]);

  return (
    <div 
      className="sticky top-0 z-50 w-full border-b border-black/10 py-3 relative overflow-hidden"
      style={{ backgroundColor: currentBg }}
    >
      {/* The Sliding Flood */}
      <AnimatePresence>
        {isFlooding && (
          <motion.div
            key={`flood-${quoteIndex}`}
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
            className="absolute inset-0 z-10"
            style={{ backgroundColor: nextColor }}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 flex justify-center items-center h-8 select-none px-12">
        <span className="text-sm md:text-base font-black uppercase tracking-widest text-black">
          {/* Hide text during flood to prevent weird overlapping */}
          {!isFlooding && displayText}
          {!isFlooding && (
            <span className={`ml-1 text-black ${isPaused ? "opacity-100" : "animate-pulse"}`}>
              |
            </span>
          )}
        </span>
      </div>

      <button
        onClick={() => setIsPaused((p) => !p)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-black p-2 rounded-full bg-black/5 hover:bg-black/10 backdrop-blur-sm z-30 transition-all active:scale-90"
      >
        {isPaused ? <Play size={18} fill="black" /> : <Pause size={18} fill="black" />}
      </button>
    </div>
  );
}

export default Marquee;