"use client";

import React, { useState, useEffect } from "react";
import { Pause, Play, Maximize, Minimize } from "lucide-react";
import Navbar from "@/components/Navbar"; // Assuming this is used elsewhere
import AuthButton from "@/components/AuthButton";

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

  // Typewriter State
  const [text, setText] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

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
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (isPaused) return; 

    const currentQuote = QUOTES[quoteIndex % QUOTES.length];
    let timeout;

    if (!isDeleting && text === currentQuote) {
      timeout = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setQuoteIndex((prev) => prev + 1);
    } else {
      timeout = setTimeout(() => {
        setText((prev) => {
          if (isDeleting) {
            return currentQuote.substring(0, prev.length - 1);
          } else {
            return currentQuote.substring(0, prev.length + 1);
          }
        });
      }, isDeleting ? 40 : 100); 
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, quoteIndex, isPaused]);

  return (
    <div
      // Added absolute, left-0, and pointer-events-none
      className="fixed top-0 left-0 z-[100] w-full h-10 md:h-12 flex items-center pointer-events-none"
    >
      <div className="w-full max-w-7xl mx-auto px-3 md:px-4 flex items-center justify-between relative h-full">
        {/* LEFT */}
        <div className="flex items-center gap-2 flex-shrink-0 z-20 relative"></div>

        {/* CENTER: Typewriter Ticker */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none px-16">
          <div
            className="text-[10px] md:text-sm font-bold uppercase tracking-wider text-center whitespace-nowrap px-3 py-1 rounded"
            style={{
              fontFamily: "'Krona One', sans-serif",
              color: "#FFFFFF",
              backgroundColor: "#0D0221",
            }}
          >
            {text}
            <span className="typewriter-cursor">|</span>
          </div>
        </div>

        {/* RIGHT */}
        {/* Added pointer-events-auto so the buttons remain clickable! */}
        <div className="flex-shrink-0 flex items-center gap-2 z-20 pointer-events-auto">
          <div className="flex items-center gap-0">
            {/* Auth Button */}
            <AuthButton />

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="group relative w-9 h-9 flex items-center justify-center transition-all duration-300 hover:border-transparent hover:bg-[#FF0055] hover:text-white active:scale-90 rounded-md ml-2"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize size={16} strokeWidth={2.5} /> : <Maximize size={16} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        .typewriter-cursor {
          color: #FF0055;
          margin-left: 2px;
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          from, to {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}