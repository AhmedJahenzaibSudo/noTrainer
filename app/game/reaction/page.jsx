"use client";

import React, { useState, useEffect, useRef } from "react";

const RANKS = [
  { max: 150, label: "Inhuman",   color: "#1AF0BE" },
  { max: 200, label: "Lightning", color: "#1AF0BE" },
  { max: 250, label: "Fast",      color: "#a3e635" },
  { max: 300, label: "Average",   color: "#facc15" },
  { max: 400, label: "Slow",      color: "#fb923c" },
  { max: Infinity, label: "Sleepy", color: "#f87171" },
];

const getRank = (ms) => RANKS.find((r) => ms < r.max) || RANKS[RANKS.length - 1];

const ReactionGame = () => {
  const [state, setState] = useState("idle"); // idle | waiting | go | result | early
  const [time, setTime] = useState(0);
  const [best, setBest] = useState(null);
  const [history, setHistory] = useState([]);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [targetSize] = useState(72);

  const timerRef = useRef(null);
  const startRef = useRef(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("reflex_best");
      if (saved) setBest(parseInt(saved));
      const hist = localStorage.getItem("reflex_history");
      if (hist) setHistory(JSON.parse(hist));
    } catch {}
  }, []);

  const startTest = () => {
    setState("waiting");
    const delay = Math.random() * 3000 + 1500;
    timerRef.current = setTimeout(() => {
      setPos({
        x: Math.random() * 60 + 20,
        y: Math.random() * 60 + 20,
      });
      setState("go");
      startRef.current = Date.now();
    }, delay);
  };

  const handleHit = (e) => {
    e.stopPropagation();
    if (state !== "go") return;
    const diff = Date.now() - startRef.current;
    setTime(diff);
    setState("result");

    const newHistory = [...history, diff].slice(-5);
    setHistory(newHistory);
    try { localStorage.setItem("reflex_history", JSON.stringify(newHistory)); } catch {}

    if (!best || diff < best) {
      setBest(diff);
      try { localStorage.setItem("reflex_best", diff.toString()); } catch {}
    }
  };

  const handleAreaClick = () => {
    if (state === "waiting") {
      clearTimeout(timerRef.current);
      setState("early");
    }
  };

  const reset = (e) => {
    e?.stopPropagation();
    clearTimeout(timerRef.current);
    setState("idle");
  };

  const avg = history.length
    ? Math.round(history.reduce((a, b) => a + b, 0) / history.length)
    : null;

  const rank = time ? getRank(time) : null;

  return (
    <main
      className="reflex-root relative flex flex-col overflow-hidden select-none text-white"
      style={{ backgroundColor: "#0a1628", height: "calc(100dvh - 40px)", fontFamily: "sans-serif" }}
    >
      <style>{`
        @media (min-width: 768px) {
          .reflex-root { height: calc(100dvh - 48px) !important; }
        }
        @keyframes pulseRing {
          0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.7; }
          100% { transform: translate(-50%,-50%) scale(2.6); opacity: 0; }
        }
        @keyframes waitPulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
        @keyframes popIn {
          0%   { transform: translate(-50%,-50%) scale(0.5); opacity: 0; }
          70%  { transform: translate(-50%,-50%) scale(1.1); }
          100% { transform: translate(-50%,-50%) scale(1); opacity: 1; }
        }
        .ring-pulse { animation: pulseRing 0.7s ease-out infinite; }
        .wait-pulse { animation: waitPulse 1s ease-in-out infinite; }
        .pop-in     { animation: popIn 0.18s ease-out forwards; }
      `}</style>

      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[#0d2a6e] blur-[130px] opacity-80" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[450px] w-[450px] rounded-full bg-[#1AF0BE] opacity-[0.12] blur-[110px]" />
        <div className="absolute top-[30%] left-[40%] h-[300px] w-[300px] rounded-full bg-[#1a3080] blur-[100px] opacity-40" />
      </div>

      {/* ── HEADER ── */}
      <header className="relative z-10 shrink-0 flex items-center justify-between px-4 py-3 md:px-8 md:py-4 border-b border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <div className="w-24 md:w-36">
          <p className="text-[9px] md:text-xs tracking-[0.25em] text-[#1AF0BE] font-black uppercase">Best</p>
          <p className="text-2xl md:text-3xl font-black">
            {best ?? "--"}
            <span className="text-xs md:text-sm font-normal text-white/30 ml-1">ms</span>
          </p>
        </div>

        <h1
          className="text-xl md:text-3xl font-black uppercase tracking-tight text-white"
          style={{ fontFamily: "'Krona One', sans-serif" }}
        >
          Reflex <span className="text-[#1AF0BE]">Pro</span>
        </h1>

        <div className="w-24 md:w-36 text-right">
          <p className="text-[9px] md:text-xs tracking-[0.25em] text-[#1AF0BE] font-black uppercase">Avg</p>
          <p className="text-2xl md:text-3xl font-black">
            {avg ?? "--"}
            <span className="text-xs md:text-sm font-normal text-white/30 ml-1">ms</span>
          </p>
        </div>
      </header>

      {/* ── LAST 5 HISTORY BAR ── */}
      {history.length > 0 && (
        <div className="relative z-10 shrink-0 flex items-center justify-center gap-2 px-4 py-2 md:py-3 bg-white/[0.02] border-b border-white/5">
          <p className="text-[9px] md:text-xs text-white/30 font-bold uppercase tracking-widest mr-2">Last 5</p>
          {history.map((ms, i) => {
            const r = getRank(ms);
            return (
              <div key={i} className="flex flex-col items-center">
                <span className="text-xs md:text-sm font-black" style={{ color: r.color }}>{ms}</span>
                <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider" style={{ color: r.color, opacity: 0.6 }}>{r.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── ARENA ── */}
      <div
        onClick={handleAreaClick}
        className="relative z-10 flex-1 min-h-0 mx-4 mb-4 md:mx-6 md:mb-6 mt-3 rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#0d1e3a",
          border: "1.5px solid rgba(255,255,255,0.08)",
          cursor: state === "waiting" ? "default" : state === "go" ? "crosshair" : "default",
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(26,240,190,0.1) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* WAITING state */}
        {state === "waiting" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p
              className="wait-pulse text-white/50 font-black uppercase tracking-[0.4em] text-sm md:text-base"
              style={{ fontFamily: "'Krona One', sans-serif" }}
            >
              Wait...
            </p>
            <p className="mt-3 text-white/20 text-xs font-bold uppercase tracking-widest">
              Don't click yet
            </p>
          </div>
        )}

        {/* GO target */}
        {state === "go" && (
          <button
            onClick={handleHit}
            className="pop-in absolute"
            style={{
              top: `${pos.y}%`,
              left: `${pos.x}%`,
              width: `${targetSize}px`,
              height: `${targetSize}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="ring-pulse absolute rounded-full pointer-events-none"
              style={{
                top: "50%", left: "50%",
                width: `${targetSize}px`, height: `${targetSize}px`,
                border: "2px solid #1AF0BE",
              }}
            />
            <div
              className="relative w-full h-full rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "#1AF0BE",
                boxShadow: "0 0 28px rgba(26,240,190,0.9)",
              }}
            >
              <div className="rounded-full" style={{ width: "36%", height: "36%", backgroundColor: "#051061" }} />
            </div>
          </button>
        )}

        {/* OVERLAY: idle / result / early */}
        {(state === "idle" || state === "result" || state === "early") && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#071224]/90 backdrop-blur-md px-4">

            {state === "result" && rank && (
              <div className="text-center mb-8">
                <p
                  className="text-xs md:text-sm tracking-[0.4em] font-black uppercase mb-2"
                  style={{ color: rank.color, fontFamily: "'Krona One', sans-serif" }}
                >
                  {rank.label}
                </p>
                <p
                  className="text-7xl md:text-9xl font-black tracking-tighter mb-2"
                  style={{ color: rank.color }}
                >
                  {time}
                  <span className="text-2xl md:text-4xl font-black text-white/30 ml-2">ms</span>
                </p>
                {best === time && (
                  <p className="text-xs md:text-sm font-black tracking-[0.3em] uppercase text-[#1AF0BE]">★ New Best!</p>
                )}
              </div>
            )}

            {state === "early" && (
              <div className="text-center mb-8">
                <p
                  className="text-4xl md:text-6xl font-black uppercase tracking-tight text-[#fb923c] mb-2"
                  style={{ fontFamily: "'Krona One', sans-serif" }}
                >
                  Too Early!
                </p>
                <p className="text-white/30 text-xs md:text-sm font-bold tracking-[0.3em] uppercase mt-2">
                  Wait for the target to appear
                </p>
              </div>
            )}

            {state === "idle" && (
              <div className="text-center mb-8">
                <h2
                  className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight"
                  style={{ fontFamily: "'Krona One', sans-serif" }}
                >
                  Reflex <span className="text-[#1AF0BE]">Pro</span>
                </h2>
                <p className="text-white/30 text-xs md:text-sm tracking-[0.3em] uppercase mt-2 font-bold">
                  Hit the target the moment it appears
                </p>
                {best && (
                  <p className="mt-3 text-xs md:text-sm text-[#1AF0BE]/60 font-bold tracking-widest uppercase">
                    Best: {best}ms
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); startTest(); }}
                className="group relative px-12 md:px-20 py-4 md:py-5 overflow-hidden rounded-xl font-black uppercase tracking-[0.3em] text-[#051061] transition-all hover:scale-105 active:scale-95 text-sm md:text-base"
                style={{
                  backgroundColor: "#1AF0BE",
                  boxShadow: "0 0 36px rgba(26,240,190,0.35)",
                }}
              >
                <span className="relative z-10">
                  {state === "result" || state === "early" ? "Try Again" : "Start"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>

              {(state === "result" || state === "early") && (
                <button
                  onClick={reset}
                  className="px-6 md:px-8 py-4 md:py-5 rounded-xl font-black uppercase tracking-[0.2em] text-white/40 hover:text-white/70 text-sm md:text-base transition-all hover:bg-white/10 active:scale-95"
                  style={{ border: "1.5px solid rgba(255,255,255,0.1)" }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ReactionGame;