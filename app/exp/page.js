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

// ─── Audio helpers ──────────────────────────────────────────
function createAudioCtx() {
  if (typeof window === "undefined") return null;
  return new (window.AudioContext || window.webkitAudioContext)();
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
  gain.gain.linearRampToValueAtTime(volume, now + duration - 0.3);
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
  gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2);
  gain.connect(ctx.destination);

  const oscs = [130.81, 164.81, 196.0, 261.63].map((f) => {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(f, ctx.currentTime);
    o.connect(gain);
    o.start();
    return o;
  });

  return () => {
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
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
  const [isMd, setIsMd] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : false,
  );

  const intervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const stopAmbientRef = useRef(null);

  // ── Cleanup audio ──────────────────────────────────────────
  const cleanupAudio = () => {
    if (stopAmbientRef.current) {
      stopAmbientRef.current();
      stopAmbientRef.current = null;
    }

    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      try {
        audioCtxRef.current.close();
      } catch {}
    }

    audioCtxRef.current = null;
  };

  // ── Breakpoint detection ───────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e) => setIsMd(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const sizeMin = isMd ? SIZE_MD_MIN : SIZE_MIN;
  const sizeMax = isMd ? SIZE_MD_MAX : SIZE_MAX;

  const phaseTotal =
    phase === "inhale" ? INHALE_S : phase === "hold" ? HOLD_S : EXHALE_S;

  const timeLeft = Math.max(0, phaseTotal - elapsed);

  let circleSize = sizeMin;
  if (phase === "inhale") {
    circleSize = sizeMin + ((sizeMax - sizeMin) * elapsed) / INHALE_S;
  } else if (phase === "hold") {
    circleSize = sizeMax;
  } else if (phase === "exhale") {
    circleSize = sizeMax - ((sizeMax - sizeMin) * elapsed) / EXHALE_S;
  }

  const advancePhase = useCallback((currentPhase, ctx) => {
    if (currentPhase === "inhale") {
      setPhase("hold");
      setElapsed(0);
      playTone(ctx, 220, 0.6);
    } else if (currentPhase === "hold") {
      setPhase("exhale");
      setElapsed(0);
      playTone(ctx, 196, 0.5);
    } else {
      setCycleCount((c) => c + 1);
      setPhase("inhale");
      setElapsed(0);
      playTone(ctx, 261.63, 0.5);
    }
  }, []);

  // ── Timer ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isActive) return;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;

        const total =
          phase === "inhale" ? INHALE_S : phase === "hold" ? HOLD_S : EXHALE_S;

        if (next >= total) {
          advancePhase(phase, audioCtxRef.current);
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isActive, phase, advancePhase]);

  // 🔥 cleanup on page change
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      cleanupAudio();
    };
  }, []);

  // ── Start ──────────────────────────────────────────────────
  const startSession = () => {
    const ctx = createAudioCtx();

    if (ctx?.state === "suspended") {
      ctx.resume();
    }

    audioCtxRef.current = ctx;
    stopAmbientRef.current = startAmbient(ctx);

    playTone(ctx, 261.63, 0.5);

    setCycleCount(0);
    setPhase("inhale");
    setElapsed(0);
    setIsActive(true);
  };

  // ── Stop ───────────────────────────────────────────────────
  const stopSession = () => {
    clearInterval(intervalRef.current);
    cleanupAudio();

    setIsActive(false);
    setPhase("idle");
    setElapsed(0);
    setCycleCount(0);
  };

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
      ? "#1AF0BE"
      : phase === "hold"
        ? "#a5f3e8"
        : phase === "exhale"
          ? "#6ea8d8"
          : "#1AF0BE";

  const glowColor =
    phase === "inhale"
      ? "rgba(26,240,190,0.22)"
      : phase === "hold"
        ? "rgba(26,240,190,0.35)"
        : phase === "exhale"
          ? "rgba(14,80,160,0.25)"
          : "transparent";

  return (
    <main
      className="relative flex flex-col items-center justify-center text-white overflow-hidden"
      style={{
        backgroundColor: "#0a1628",
        height: "100dvh",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <div className="absolute top-4 right-4">
        {isActive && (
          <button onClick={stopSession}>
            <X />
          </button>
        )}
      </div>

      {/* Idle */}
      {!isActive && (
        <button
          onClick={startSession}
          className="px-10 py-4 rounded-xl font-bold"
          style={{ backgroundColor: "#1AF0BE", color: "#000" }}
        >
          Start
        </button>
      )}

      {/* Active */}
      {isActive && (
        <>
          <div
            className="rounded-full flex flex-col items-center justify-center transition-all"
            style={{
              width: circleSize,
              height: circleSize,
              backgroundColor: glowColor,
              border: `2px solid ${phaseColor}`,
              boxShadow: `0 0 40px ${phaseColor}`,
            }}
          >
            <p style={{ color: phaseColor }}>{phaseLabel}</p>
            <p style={{ color: phaseColor, fontSize: 32 }}>{timeLeft}</p>
          </div>

          <p style={{ marginTop: 20, opacity: 0.6 }}>{phaseSub}</p>
        </>
      )}
    </main>
  );
};

export default ZenFlow;
