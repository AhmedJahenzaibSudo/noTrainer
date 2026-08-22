"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

// ─── Timings ────────────────────────────────────────────────

const INHALE_S = 4;
const HOLD_S = 7;
const EXHALE_S = 8;

// Circle sizes (px)

const SIZE_MIN = 120;
const SIZE_MAX = 240;
const SIZE_MD_MIN = 160;
const SIZE_MD_MAX = 320;

// ─── Colors ─────────────────────────────────────────────────

const CYAN = "color(display-p3 0.056 0.958 0.949)";
const DARK = "color(display-p3 0.079 0.201 0.346)";
const YELLOW = "color(display-p3 0.98 0.78 0.12)";
const RED = "color(display-p3 1 0 0)";

// ─── Web Audio helpers ───────────────────────────────────────

function createAudioCtx() {
  if (typeof window === "undefined") return null;

  return new (
    window.AudioContext ||
    window.webkitAudioContext
  )();
}

function playTone(ctx, freq, duration, volume = 0.12) {
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.3);
  gain.gain.linearRampToValueAtTime(
    volume,
    now + duration - 0.3,
  );
  gain.gain.linearRampToValueAtTime(0, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);
}

function startAmbient(ctx) {
  if (!ctx) return () => {};

  const gain = ctx.createGain();

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(
    0.06,
    ctx.currentTime + 2,
  );

  gain.connect(ctx.destination);

  const oscs = [130.81, 164.81, 196.0, 261.63].map(
    (f) => {
      const o = ctx.createOscillator();

      o.type = "sine";
      o.frequency.setValueAtTime(f, ctx.currentTime);
      o.connect(gain);
      o.start();

      return o;
    },
  );

  return () => {
    gain.gain.linearRampToValueAtTime(
      0,
      ctx.currentTime + 1.5,
    );

    setTimeout(() => {
      oscs.forEach((o) => {
        try {
          o.stop();
        } catch {}
      });
    }, 2000);
  };
}

// ─── Component ──────────────────────────────────────────────

const ZenFlow = () => {
  const [phase, setPhase] = useState("idle");
  const [elapsed, setElapsed] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isMd, setIsMd] = useState(false);

  const intervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const stopAmbient = useRef(null);
  const oscillatorsRef = useRef([]);

  // Detect md breakpoint

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");

    setIsMd(mq.matches);

    const handler = (e) => setIsMd(e.matches);

    mq.addEventListener("change", handler);

    return () =>
      mq.removeEventListener("change", handler);
  }, []);

  // Cleanup audio

  const cleanupAudio = useCallback(() => {
    clearInterval(intervalRef.current);

    if (stopAmbient.current) {
      stopAmbient.current();
      stopAmbient.current = null;
    }

    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });

    oscillatorsRef.current = [];

    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}

      audioCtxRef.current = null;
    }
  }, []);

  // Cleanup on unmount

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  // Cleanup when tab hidden

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

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () =>
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
  }, [isActive, cleanupAudio]);

  const sizeMin = isMd ? SIZE_MD_MIN : SIZE_MIN;
  const sizeMax = isMd ? SIZE_MD_MAX : SIZE_MAX;

  // Current phase total seconds

  const phaseTotal =
    phase === "inhale"
      ? INHALE_S
      : phase === "hold"
        ? HOLD_S
        : EXHALE_S;

  const timeLeft = Math.max(
    0,
    phaseTotal - elapsed,
  );

  // Circle size calculation

  let circleSize = sizeMin;

  if (phase === "inhale") {
    circleSize =
      sizeMin +
      (sizeMax - sizeMin) *
        (elapsed / INHALE_S);
  } else if (phase === "hold") {
    circleSize = sizeMax;
  } else if (phase === "exhale") {
    circleSize =
      sizeMax -
      (sizeMax - sizeMin) *
        (elapsed / EXHALE_S);
  }

  const holdFlicker = phase === "hold";

  // ── Advance phase ──────────────────────────────────────────

  const advancePhase = useCallback(
    (currentPhase, ctx) => {
      if (currentPhase === "inhale") {
        setPhase("hold");
        setElapsed(0);

        playTone(ctx, 220, 0.6, 0.1);
      } else if (currentPhase === "hold") {
        setPhase("exhale");
        setElapsed(0);

        playTone(ctx, 196, 0.5, 0.08);
      } else {
        setCycleCount((c) => c + 1);
        setPhase("inhale");
        setElapsed(0);

        playTone(ctx, 261.63, 0.5, 0.1);
      }
    },
    [],
  );

  // ── Timer tick ─────────────────────────────────────────────

  useEffect(() => {
    if (!isActive) return;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;

        const total =
          phase === "inhale"
            ? INHALE_S
            : phase === "hold"
              ? HOLD_S
              : EXHALE_S;

        if (next >= total) {
          advancePhase(
            phase,
            audioCtxRef.current,
          );

          return 0;
        }

        return next;
      });
    }, 1000);

    return () =>
      clearInterval(intervalRef.current);
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

  const phaseLabel =
    {
      inhale: "Inhale",
      hold: "Hold",
      exhale: "Exhale",
    }[phase] ?? "";

  const phaseSub =
    {
      inhale: "Breathe in slowly",
      hold: "Hold still",
      exhale: "Release slowly",
    }[phase] ?? "";

  const phaseColor =
    phase === "inhale"
      ? CYAN
      : phase === "hold"
        ? YELLOW
        : phase === "exhale"
          ? RED
          : CYAN;

  const circleBackground =
    phase === "inhale"
      ? CYAN
      : phase === "hold"
        ? YELLOW
        : phase === "exhale"
          ? RED
          : CYAN;

  return (
    <main
      className="zen-root relative flex flex-col overflow-hidden select-none"
      style={{
        backgroundColor: CYAN,
        color: DARK,
        height: "calc(100dvh - 40px)",
        fontFamily: "sans-serif",
      }}
    >
      <style>{`
        @media (min-width: 768px) {
          .zen-root {
            height: calc(100dvh - 48px) !important;
          }
        }

        @keyframes holdFlicker {
          0%, 100% {
            opacity: 1;
          }

          40% {
            opacity: 0.75;
          }

          70% {
            opacity: 0.88;
          }
        }

        @keyframes softPulse {
          0%, 100% {
            opacity: 0.55;
          }

          50% {
            opacity: 1;
          }
        }

        .hold-flicker {
          animation: holdFlicker 2.8s ease-in-out infinite;
        }

        .soft-pulse {
          animation: softPulse 3s ease-in-out infinite;
        }

        .circle-grow {
          transition:
            width 1s ease-in-out,
            height 1s ease-in-out,
            background-color 0.8s ease,
            border-color 0.8s ease;
        }
      `}</style>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="relative z-10 shrink-0 flex items-center justify-between px-4 py-3 md:px-8 md:py-4 border-b-2"
        style={{
          backgroundColor: DARK,
          borderColor: DARK,
          color: CYAN,
        }}
      >
        {/* Cycles */}

        <div className="w-24 md:w-36">
          {isActive && (
            <>
              <p
                className="text-[9px] md:text-xs tracking-[0.25em] font-black uppercase"
                style={{
                  color: CYAN,
                }}
              >
                Cycles
              </p>

              <p
                className="text-2xl md:text-3xl font-black"
                style={{
                  color: CYAN,
                }}
              >
                {cycleCount}
              </p>
            </>
          )}
        </div>

        {/* Title */}

        <h1
          className="text-xl md:text-3xl font-black uppercase tracking-tight"
          style={{
            fontFamily:
              "'Krona One', sans-serif",

            color: CYAN,
          }}
        >
          Zen{" "}
          <span
            style={{
              color: YELLOW,
            }}
          >
            Flow
          </span>
        </h1>

        {/* Stop */}

        <div className="w-24 md:w-36 flex justify-end">
          {isActive && (
            <button
              onClick={stopSession}
              className="flex items-center gap-1.5 px-3 py-2 border-2 font-black text-xs uppercase tracking-wider transition-all active:scale-95"
              style={{
                backgroundColor: RED,
                borderColor: RED,
                color: DARK,
              }}
            >
              <X size={13} />

              <span className="hidden md:inline">
                Stop
              </span>
            </button>
          )}
        </div>
      </header>

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center gap-8 md:gap-10 px-4 pb-4 md:pb-6">
        {/* =================================================
            IDLE
        ================================================= */}

        {!isActive && (
          <div className="flex flex-col items-center text-center gap-7">
            <div>
              <h2
                className="text-4xl md:text-6xl font-black uppercase tracking-tight"
                style={{
                  fontFamily:
                    "'Krona One', sans-serif",

                  color: DARK,
                }}
              >
                Zen{" "}
                <span
                  className="inline-block px-2 py-1"
                  style={{
                    backgroundColor: DARK,
                    color: CYAN,
                  }}
                >
                  Flow
                </span>
              </h2>

              <p
                className="text-xs md:text-sm tracking-[0.3em] uppercase mt-4 font-black"
                style={{
                  color: DARK,
                  opacity: 0.7,
                }}
              >
                Inhale · Hold · Exhale
              </p>

              <p
                className="text-xs mt-2 font-bold tracking-widest"
                style={{
                  color: DARK,
                  opacity: 0.5,
                }}
              >
                4s &nbsp;·&nbsp; 7s &nbsp;·&nbsp; 8s
              </p>
            </div>

            {/* Idle Preview Circle */}

            <div
              className="rounded-full flex items-center justify-center border-2"
              style={{
                width: `${sizeMin}px`,
                height: `${sizeMin}px`,
                borderColor: DARK,
                backgroundColor: DARK,
              }}
            >
              <div
                className="rounded-full"
                style={{
                  width: "24%",
                  height: "24%",
                  backgroundColor: YELLOW,
                }}
              />
            </div>

            {/* Begin */}

            <button
              onClick={startSession}
              className="px-14 md:px-20 py-4 md:py-5 border-2 font-black uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 text-sm md:text-base"
              style={{
                backgroundColor: YELLOW,
                color: DARK,
                borderColor: DARK,
              }}
            >
              Begin
            </button>
          </div>
        )}

        {/* =================================================
            ACTIVE SESSION
        ================================================= */}

        {isActive && (
          <>
            {/* Breathing Circle */}

            <div className="relative flex items-center justify-center">
             
          

              {/* Main Circle */}

              <div
                className={`circle-grow rounded-full flex flex-col items-center justify-center ${
                  holdFlicker
                    ? "hold-flicker"
                    : ""
                }`}
                style={{
                  width: `${circleSize}px`,
                  height: `${circleSize}px`,

                  backgroundColor:
                    circleBackground,

                  border: `3px solid ${DARK}`,

                  color: DARK,
                }}
              >
                {/* Phase */}

                <p
                  className="font-black uppercase tracking-widest text-lg md:text-2xl transition-all duration-500"
                  style={{
                    fontFamily:
                      "'Krona One', sans-serif",

                    color: DARK,

                    opacity:
                      circleSize >
                      sizeMin + 20
                        ? 1
                        : 0,
                  }}
                >
                  {phaseLabel}
                </p>

                {/* Countdown */}

                <p
                  className="text-4xl md:text-6xl font-black mt-1 transition-all duration-500"
                  style={{
                    color: DARK,

                    opacity:
                      circleSize >
                      sizeMin + 20
                        ? 0.9
                        : 0,
                  }}
                >
                  {timeLeft}
                </p>
              </div>
            </div>

            {/* Sub Label */}

            <p
              className="soft-pulse text-xs md:text-sm font-black uppercase tracking-[0.35em] transition-colors duration-1000"
              style={{
                color:
                  phaseColor === RED
                    ? RED
                    : DARK,
              }}
            >
              {phaseSub}
            </p>

            {/* Phase Guide */}

            <div className="flex items-center gap-2">
              <div
                className="px-3 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest border-2"
                style={{
                  backgroundColor:
                    phase === "inhale"
                      ? DARK
                      : CYAN,

                  color:
                    phase === "inhale"
                      ? CYAN
                      : DARK,

                  borderColor: DARK,
                }}
              >
                Inhale 4
              </div>

              <div
                className="px-3 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest border-2"
                style={{
                  backgroundColor:
                    phase === "hold"
                      ? YELLOW
                      : CYAN,

                  color: DARK,
                  borderColor: DARK,
                }}
              >
                Hold 7
              </div>

              <div
                className="px-3 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest border-2"
                style={{
                  backgroundColor:
                    phase === "exhale"
                      ? RED
                      : CYAN,

                  color: DARK,
                  borderColor: DARK,
                }}
              >
                Exhale 8
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default ZenFlow;