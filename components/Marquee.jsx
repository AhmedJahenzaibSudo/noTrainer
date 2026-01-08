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

  const colors = ["#7d98d6", "#77eaac"]; // solid colors, no transparency

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isFlooding, setIsFlooding] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentBg, setCurrentBg] = useState(colors[0]);

  const typingTimer = useRef(null);

  const nextColor = colors[(quoteIndex + 1) % colors.length];

  // --- Typewriter Logic (letter by letter, can switch to word by word if needed) ---
  useEffect(() => {
    if (isPaused || isFlooding) return;

    const quote = quotes[quoteIndex];

    if (charIndex < quote.length) {
      typingTimer.current = setTimeout(() => {
        setDisplayText((p) => p + quote[charIndex]);
        setCharIndex((p) => p + 1);
      }, 60);
    } else {
      // Start flood after typing completes
      typingTimer.current = setTimeout(() => {
        setIsFlooding(true);
      }, 500);
    }

    return () => clearTimeout(typingTimer.current);
  }, [charIndex, quoteIndex, isFlooding, isPaused]);

  // --- Flood Animation & State Reset ---
  useEffect(() => {
    if (!isFlooding || isPaused) return;

    const resetTimer = setTimeout(() => {
      // Update main background permanently
      setCurrentBg(nextColor);

      // Reset for next quote
      setDisplayText("");
      setCharIndex(0);
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
      setIsFlooding(false);
    }, 550); // match flood animation duration

    return () => clearTimeout(resetTimer);
  }, [isFlooding, isPaused, nextColor]);

  return (
    <div
      className="sticky top-0 z-50 w-full border-b border-black/10 py-3 relative overflow-hidden"
      style={{ backgroundColor: currentBg }}
    >
      {/* Optional flood animation overlay for visual effect */}
      <AnimatePresence>
        {isFlooding && (
          <motion.div
            key={`flood-${quoteIndex}`}
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
            className="absolute inset-0 z-10"
            style={{ backgroundColor: nextColor, opacity: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Text Content */}
      <div className="relative z-20 flex justify-center items-center h-8 select-none px-12">
        <span className="text-sm md:text-base font-black uppercase tracking-widest text-black">
          {displayText}
          {!isPaused && <span className="ml-1 animate-pulse">|</span>}
        </span>
      </div>

      {/* Pause / Play Button */}
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
