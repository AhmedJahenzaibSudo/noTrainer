"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

// ─── Timings ────────────────────────────────────────────────
const INHALE_S  = 4;
const HOLD_S    = 7;
const EXHALE_S  = 8;

// Circle sizes (px)
const SIZE_MIN  = 120;   // start of inhale / end of exhale
const SIZE_MAX  = 240;   // peak at hold
const SIZE_MD_MIN = 160;
const SIZE_MD_MAX = 320;

// ─── Web Audio helpers ───────────────────────────────────────
function createAudioCtx() {
  if (typeof window === "undefined") return null;
  return new (window.AudioContext || window.webkitAudioContext)();
}

// Soft sine-wave tone with smooth fade in/out
function playTone(ctx, freq, duration, volume = 0.12) {
  if (!ctx) return;
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  const now  = ctx.currentTime;
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.3);
  gain.gain.linearRampToValueAtTime(volume, now + duration - 0.3);
  gain.gain.linearRampToValueAtTime(0, now + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration);
}

// Ambient pad — two detuned oscillators looped
function startAmbient(ctx) {
  if (!ctx) return () => {};
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2);
  gain.connect(ctx.destination);

  const oscs = [130.81, 164.81, 196.00, 261.63].map((f) => {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(f, ctx.currentTime);
    o.connect(gain);
    o.start();
    return o;
  });

  return () => {
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    setTimeout(() => oscs.forEach((o) => { try { o.stop(); } catch {} }), 2000);
  };
}

// ─── Component ──────────────────────────────────────────────
const ZenFlow = () => {
  const [phase, setPhase]       = useState("idle");   // idle | inhale | hold | exhale
  const [elapsed, setElapsed]   = useState(0);        // seconds elapsed in current phase
  const [cycleCount, setCycleCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isMd, setIsMd]         = useState(false);

  const intervalRef  = useRef(null);
  const audioCtxRef  = useRef(null);
  const stopAmbient  = useRef(null);
  const oscillatorsRef = useRef([]); // Track all oscillators

  // Detect md breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsMd(mq.matches);
    const handler = (e) => setIsMd(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Cleanup function to stop all audio
  const cleanupAudio = useCallback(() => {
    clearInterval(intervalRef.current);
    
    // Stop ambient sound
    if (stopAmbient.current) {
      stopAmbient.current();
      stopAmbient.current = null;
    }
    
    // Stop all tracked oscillators
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    oscillatorsRef.current = [];
    
    // Close audio context
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {
        // Context might already be closed
      }
      audioCtxRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  // Cleanup on page visibility change (when user switches tabs)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        cleanupAudio();
        setIsActive(false);
        setPhase("idle");
        setElapsed(0);
        setCycleCount(0);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive, cleanupAudio]);

  const sizeMin = isMd ? SIZE_MD_MIN : SIZE_MIN;
  const sizeMax = isMd ? SIZE_MD_MAX : SIZE_MAX;

  // Current phase total seconds
  const phaseTotal = phase === "inhale" ? INHALE_S : phase === "hold" ? HOLD_S : EXHALE_S;
  const timeLeft   = Math.max(0, phaseTotal - elapsed);

  // Circle size calculation
  let circleSize = sizeMin;
  if (phase === "inhale") {
    circleSize = sizeMin + ((sizeMax - sizeMin) * (elapsed / INHALE_S));
  } else if (phase === "hold") {
    circleSize = sizeMax;
  } else if (phase === "exhale") {
    circleSize = sizeMax - ((sizeMax - sizeMin) * (elapsed / EXHALE_S));
  }

  // Hold flicker: oscillate opacity slightly
  const holdFlicker = phase === "hold";

  // ── Advance phase ──────────────────────────────────────────
  const advancePhase = useCallback((currentPhase, ctx) => {
    if (currentPhase === "inhale") {
      setPhase("hold");
      setElapsed(0);
      playTone(ctx, 220, 0.6, 0.1);   // soft low chime for hold
    } else if (currentPhase === "hold") {
      setPhase("exhale");
      setElapsed(0);
      playTone(ctx, 196, 0.5, 0.08);
    } else {
      // exhale done → new cycle
      setCycleCount((c) => c + 1);
      setPhase("inhale");
      setElapsed(0);
      playTone(ctx, 261.63, 0.5, 0.1); // soft high chime for inhale
    }
  }, []);

  // ── Timer tick ─────────────────────────────────────────────
  useEffect(() => {
    if (!isActive) return;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        const total = phase === "inhale" ? INHALE_S : phase === "hold" ? HOLD_S : EXHALE_S;
        if (next >= total) {
          advancePhase(phase, audioCtxRef.current);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isActive, phase, advancePhase]);

  // ── Start ──────────────────────────────────────────────────
  const startSession = () => {
    const ctx = createAudioCtx();
    audioCtxRef.current = ctx;
    stopAmbient.current = startAmbient(ctx);
    playTone(ctx, 261.63, 0.5, 0.1);
    setCycleCount(0);
    setPhase("inhale");
    setElapsed(0);
    setIsActive(true);
  };

  // ── Stop ───────────────────────────────────────────────────
  const stopSession = () => {
    cleanupAudio();
    setIsActive(false);
    setPhase("idle");
    setElapsed(0);
    setCycleCount(0);
  };

  // ── Phase display ──────────────────────────────────────────
  const phaseLabel = { inhale: "Inhale", hold: "Hold", exhale: "Exhale" }[phase] ?? "";
  const phaseSub   = {
    inhale: "Breathe in slowly",
    hold:   "Hold still",
    exhale: "Release slowly",
  }[phase] ?? "";

  const phaseColor =
    phase === "inhale" ? "#1AF0BE" :
    phase === "hold"   ? "#a5f3e8" :
    phase === "exhale" ? "#6ea8d8" : "#1AF0BE";

  // Glow color
  const glowColor =
    phase === "inhale" ? "rgba(26,240,190,0.22)" :
    phase === "hold"   ? "rgba(26,240,190,0.35)" :
    phase === "exhale" ? "rgba(14,80,160,0.25)"  : "transparent";

  return (
    <main
      className="zen-root relative flex flex-col overflow-hidden select-none text-white"
      style={{ backgroundColor: "#0a1628", height: "calc(100dvh - 40px)", fontFamily: "sans-serif" }}
    >
      <style>{`
        @media (min-width: 768px) {
          .zen-root { height: calc(100dvh - 48px) !important; }
        }
        @keyframes holdFlicker {
          0%,100% { opacity: 1; }
          40%      { opacity: 0.75; }
          70%      { opacity: 0.88; }
        }
        @keyframes softPulse {
          0%,100% { opacity: 0.45; }
          50%      { opacity: 0.85; }
        }
        .hold-flicker { animation: holdFlicker 2.8s ease-in-out infinite; }
        .soft-pulse   { animation: softPulse 3s ease-in-out infinite; }
        .circle-grow  {
          transition: width 1s ease-in-out, height 1s ease-in-out,
                      box-shadow 1.5s ease, background-color 2s ease;
        }
      `}</style>

      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-[-15%] left-[-10%] h-[600px] w-[600px] rounded-full blur-[130px] opacity-70 transition-all duration-[4000ms]"
          style={{ backgroundColor: phase === "exhale" ? "#030d2e" : "#0d2a6e" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full blur-[120px] transition-all duration-[4000ms]"
          style={{
            backgroundColor: "#1AF0BE",
            opacity: phase === "hold" ? 0.16 : phase === "exhale" ? 0.04 : 0.10,
          }}
        />
      </div>

      {/* ── HEADER ── */}
      <header className="relative z-10 shrink-0 flex items-center justify-between px-4 py-3 md:px-8 md:py-4 border-b border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <div className="w-24 md:w-36">
          {isActive && (
            <>
              <p className="text-[9px] md:text-xs tracking-[0.25em] text-[#1AF0BE] font-black uppercase">Cycles</p>
              <p className="text-2xl md:text-3xl font-black">{cycleCount}</p>
            </>
          )}
        </div>

        <h1
          className="text-xl md:text-3xl font-black uppercase tracking-tight text-white"
          style={{ fontFamily: "'Krona One', sans-serif" }}
        >
          Zen <span className="text-[#1AF0BE]">Flow</span>
        </h1>

        <div className="w-24 md:w-36 flex justify-end">
          {isActive && (
            <button
              onClick={stopSession}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/40 hover:text-red-400 font-bold text-xs uppercase tracking-wider transition-all hover:bg-white/10 active:scale-95"
            >
              <X size={13} />
              <span className="hidden md:inline">Stop</span>
            </button>
          )}
        </div>
      </header>

      {/* ── MAIN AREA ── */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center gap-8 md:gap-10 px-4 pb-4 md:pb-6">

        {/* ── IDLE SCREEN ── */}
        {!isActive && (
          <div className="flex flex-col items-center text-center gap-6">
            <div>
              <h2
                className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight"
                style={{ fontFamily: "'Krona One', sans-serif" }}
              >
                Zen <span className="text-[#1AF0BE]">Flow</span>
              </h2>
              <p className="text-white/30 text-xs md:text-sm tracking-[0.3em] uppercase mt-3 font-bold">
                Inhale · Hold · Exhale
              </p>
              <p className="text-white/20 text-xs mt-1 font-bold tracking-widest">
                4s &nbsp;·&nbsp; 7s &nbsp;·&nbsp; 8s
              </p>
            </div>

            {/* Idle preview circle */}
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: `${sizeMin}px`,
                height: `${sizeMin}px`,
                border: "1.5px solid rgba(26,240,190,0.2)",
                backgroundColor: "rgba(26,240,190,0.05)",
              }}
            />

            <button
              onClick={startSession}
              className="group relative px-14 md:px-20 py-4 md:py-5 overflow-hidden rounded-xl font-black uppercase tracking-[0.3em] text-[#051061] transition-all hover:scale-105 active:scale-95 text-sm md:text-base"
              style={{ backgroundColor: "#1AF0BE", boxShadow: "0 0 36px rgba(26,240,190,0.35)" }}
            >
              <span className="relative z-10">Begin</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        )}

        {/* ── ACTIVE SESSION ── */}
        {isActive && (
          <>
            {/* Breathing circle */}
            <div className="relative flex items-center justify-center">
              {/* Outer ring — always visible */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: `${sizeMax + 40}px`,
                  height: `${sizeMax + 40}px`,
                  border: "1px solid rgba(26,240,190,0.07)",
                }}
              />

              {/* Main circle */}
              <div
                className={`circle-grow rounded-full flex flex-col items-center justify-center ${holdFlicker ? "hold-flicker" : ""}`}
                style={{
                  width: `${circleSize}px`,
                  height: `${circleSize}px`,
                  backgroundColor: glowColor,
                  boxShadow: `0 0 ${phase === "hold" ? 70 : 30}px ${phaseColor}44`,
                  border: `1.5px solid ${phaseColor}33`,
                }}
              >
                {/* Phase label */}
                <p
                  className="font-black uppercase tracking-widest text-lg md:text-2xl transition-all duration-500"
                  style={{
                    fontFamily: "'Krona One', sans-serif",
                    color: phaseColor,
                    opacity: circleSize > sizeMin + 20 ? 1 : 0,
                  }}
                >
                  {phaseLabel}
                </p>

                {/* Countdown */}
                <p
                  className="text-4xl md:text-6xl font-black mt-1 transition-all duration-500"
                  style={{
                    color: phaseColor,
                    opacity: circleSize > sizeMin + 20 ? 0.85 : 0,
                  }}
                >
                  {timeLeft}
                </p>
              </div>
            </div>

            {/* Sub label */}
            <p
              className="soft-pulse text-xs md:text-sm font-bold uppercase tracking-[0.35em] transition-colors duration-1000"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {phaseSub}
            </p>
          </>
        )}
      </div>
    </main>
  );
};

export default ZenFlow;