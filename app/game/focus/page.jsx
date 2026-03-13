"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, RotateCcw } from "lucide-react";

const TIMER_OPTIONS = [10, 20, 30, 60];

const FocusGame = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [selectedTime, setSelectedTime] = useState(20);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isActive, setIsActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [position, setPosition] = useState({ top: "50%", left: "50%" });
  const [combo, setCombo] = useState(0);
  const [stats, setStats] = useState({ totalClicks: 0, hits: 0 });
  const [flashMiss, setFlashMiss] = useState(false);
  const [popups, setPopups] = useState([]);
  const arenaRef = useRef(null);
  const popupId = useRef(0);

  const level = Math.floor(score / 100) + 1;
  const targetSize = Math.max(24, 54 - level * 4);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("focusHighScore");
      if (saved) setHighScore(parseInt(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (!isActive && !gameOver) setTimeLeft(selectedTime);
  }, [selectedTime, isActive, gameOver]);

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
        try { localStorage.setItem("focusHighScore", score.toString()); } catch {}
      }
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, score, highScore]);

  const moveTarget = useCallback(() => {
    const top = Math.floor(Math.random() * 65) + 15;
    const left = Math.floor(Math.random() * 75) + 12;
    setPosition({ top: `${top}%`, left: `${left}%` });
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(selectedTime);
    setCombo(0);
    setStats({ totalClicks: 0, hits: 0 });
    setGameOver(false);
    setPopups([]);
    setIsActive(true);
    moveTarget();
  };

  const stopGame = () => {
    setIsActive(false);
    setGameOver(false);
    setScore(0);
    setCombo(0);
    setStats({ totalClicks: 0, hits: 0 });
    setPopups([]);
    setTimeLeft(selectedTime);
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(selectedTime);
    setCombo(0);
    setStats({ totalClicks: 0, hits: 0 });
    setGameOver(false);
    setPopups([]);
    setIsActive(true);
    moveTarget();
  };

  const handleArenaClick = () => {
    if (!isActive) return;
    setStats((prev) => ({ ...prev, totalClicks: prev.totalClicks + 1 }));
    setCombo(0);
    setFlashMiss(true);
    setTimeout(() => setFlashMiss(false), 180);
  };

  const handleTargetClick = (e) => {
    e.stopPropagation();
    if (!isActive) return;
    const newCombo = combo + 1;
    const bonus = Math.floor(newCombo / 5) * 5;
    const points = 10 + bonus;
    setScore((prev) => prev + points);
    setCombo(newCombo);
    setStats((prev) => ({ ...prev, totalClicks: prev.totalClicks + 1, hits: prev.hits + 1 }));
    moveTarget();
    const id = popupId.current++;
    const px = position.left;
    const py = position.top;
    setPopups((prev) => [...prev, { id, points, px, py }]);
    setTimeout(() => setPopups((prev) => prev.filter((p) => p.id !== id)), 700);
  };

  const accuracy = stats.totalClicks > 0 ? Math.round((stats.hits / stats.totalClicks) * 100) : 0;
  const timerPct = (timeLeft / selectedTime) * 100;
  const timerColor = timeLeft <= 5 ? "#ef4444" : timeLeft <= selectedTime * 0.4 ? "#f59e0b" : "#1AF0BE";

  return (
    <main
      className="focus-root relative flex flex-col overflow-hidden select-none text-white"
      style={{ backgroundColor: "#0a1628", height: "calc(100dvh - 40px)", fontFamily: "sans-serif" }}
    >
      <style>{`
        @media (min-width: 768px) {
          .focus-root { height: calc(100dvh - 48px) !important; }
        }
        @keyframes floatUp {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-44px) scale(1.25); }
        }
        @keyframes pulseRing {
          0%   { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
        }
        .popup-float { animation: floatUp 0.7s ease-out forwards; }
        .ring-pulse  { animation: pulseRing 0.65s ease-out infinite; }
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
          <p className="text-[9px] md:text-xs tracking-[0.25em] text-[#1AF0BE] font-black uppercase">Accuracy</p>
          <p className="text-2xl md:text-3xl font-black">{accuracy}%</p>
        </div>

        <div className="text-center">
          <h1
            className="text-xl md:text-3xl font-black uppercase tracking-tight text-white"
            style={{ fontFamily: "'Krona One', sans-serif" }}
          >
            Focus <span className="text-[#1AF0BE]">Strike</span>
          </h1>
        </div>

        <div className="w-24 md:w-36 text-right">
          <p className="text-[9px] md:text-xs tracking-[0.25em] text-[#1AF0BE] font-black uppercase">Combo</p>
          <p
            className="text-2xl md:text-3xl font-black transition-all duration-150"
            style={{ color: combo >= 5 ? "#1AF0BE" : "#ffffff" }}
          >
            ×{combo}
          </p>
        </div>
      </header>

      {/* ── STATS ROW ── */}
      <div className="relative z-10 shrink-0 grid grid-cols-3 items-center px-4 py-2 md:px-8 md:py-3 bg-white/[0.02] border-b border-white/5">
        <div className="text-center">
          <p className="text-[9px] md:text-xs text-white/40 font-bold uppercase tracking-widest">Score</p>
          <p className="text-3xl md:text-5xl font-black">{score}</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-[9px] md:text-xs text-white/40 font-bold uppercase tracking-widest mb-1">Time</p>
          <div className="relative w-12 h-12 md:w-16 md:h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
              <circle
                cx="24" cy="24" r="20" fill="none"
                stroke={timerColor} strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - timerPct / 100)}`}
                style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}
              />
            </svg>
            <span
              className="absolute inset-0 flex items-center justify-center text-sm md:text-lg font-black"
              style={{ color: timerColor }}
            >
              {timeLeft}
            </span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[9px] md:text-xs text-white/40 font-bold uppercase tracking-widest">Best</p>
          <p className="text-3xl md:text-5xl font-black text-white/25">{highScore}</p>
        </div>
      </div>

      {/* ── ARENA ── */}
      <div
        ref={arenaRef}
        onClick={handleArenaClick}
        className="relative z-10 flex-1 min-h-0 mx-4 mb-4 md:mx-6 md:mb-6 mt-3 rounded-2xl overflow-hidden cursor-crosshair"
        style={{
          border: flashMiss ? "1.5px solid rgba(239,68,68,0.7)" : "1.5px solid rgba(255,255,255,0.08)",
          backgroundColor: "#0d1e3a",
          transition: "border-color 0.15s",
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

        {/* In-game controls */}
        {isActive && (
          <div className="absolute top-3 right-3 z-30 flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); restartGame(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/50 hover:text-white font-bold text-xs uppercase tracking-wider transition-all hover:bg-white/10 active:scale-95"
            >
              <RotateCcw size={13} />
              <span className="hidden md:inline">Restart</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); stopGame(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/50 hover:text-red-400 font-bold text-xs uppercase tracking-wider transition-all hover:bg-white/10 active:scale-95"
            >
              <X size={13} />
              <span className="hidden md:inline">Stop</span>
            </button>
          </div>
        )}

        {/* Score popups */}
        {popups.map((p) => (
          <span
            key={p.id}
            className="popup-float pointer-events-none absolute font-black text-sm md:text-lg"
            style={{
              top: p.py, left: p.px,
              color: "#1AF0BE",
              textShadow: "0 0 12px #1AF0BE",
              transform: "translate(-50%, -100%)",
            }}
          >
            +{p.points}
          </span>
        ))}

        {/* Overlay */}
        {!isActive && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#071224]/90 backdrop-blur-md px-4">
            {gameOver ? (
              <div className="text-center mb-6">
                <p
                  className="text-xs md:text-sm tracking-[0.4em] text-[#1AF0BE] font-black uppercase mb-2"
                  style={{ fontFamily: "'Krona One', sans-serif" }}
                >
                  Game Over
                </p>
                <p className="text-7xl md:text-9xl font-black text-white tracking-tighter mb-3">{score}</p>
                <div className="h-px w-20 bg-white/10 mx-auto mb-3" />
                <p className="text-white/40 text-sm md:text-base font-medium tracking-wide">
                  Accuracy {accuracy}% · Hits {stats.hits}
                </p>
                {score > 0 && score >= highScore && (
                  <p className="mt-2 text-xs md:text-sm font-black tracking-[0.3em] uppercase text-[#1AF0BE]">★ New Best!</p>
                )}
              </div>
            ) : (
              <div className="text-center mb-6">
                <h2
                  className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight"
                  style={{ fontFamily: "'Krona One', sans-serif" }}
                >
                  Focus <span className="text-[#1AF0BE]">Strike</span>
                </h2>
                <p className="text-white/30 text-xs md:text-sm tracking-[0.3em] uppercase mt-2 font-bold">
                  Tap the targets as fast as you can
                </p>
                {highScore > 0 && (
                  <p className="mt-3 text-xs md:text-sm text-[#1AF0BE]/60 font-bold tracking-widest uppercase">Best: {highScore}</p>
                )}
              </div>
            )}

            {/* Timer picker */}
            <div className="flex gap-2 mb-6">
              {TIMER_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={(e) => { e.stopPropagation(); setSelectedTime(t); }}
                  className="px-3 py-1.5 md:px-5 md:py-2 rounded-lg font-black text-xs md:text-sm uppercase tracking-wider transition-all active:scale-95"
                  style={{
                    backgroundColor: selectedTime === t ? "#1AF0BE" : "rgba(255,255,255,0.07)",
                    color: selectedTime === t ? "#051061" : "rgba(255,255,255,0.5)",
                    border: selectedTime === t ? "none" : "1px solid rgba(255,255,255,0.1)",
                    boxShadow: selectedTime === t ? "0 0 16px rgba(26,240,190,0.35)" : "none",
                  }}
                >
                  {t}s
                </button>
              ))}
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="group relative px-14 md:px-20 py-4 md:py-5 overflow-hidden rounded-xl font-black uppercase tracking-[0.3em] text-[#051061] transition-all hover:scale-105 active:scale-95 text-sm md:text-base"
              style={{
                backgroundColor: "#1AF0BE",
                boxShadow: "0 0 36px rgba(26,240,190,0.35)",
              }}
            >
              <span className="relative z-10">{gameOver ? "Play Again" : "Start"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        )}

        {/* Target */}
        {isActive && (
          <button
            onClick={handleTargetClick}
            className="absolute active:scale-75 duration-75"
            style={{
              top: position.top,
              left: position.left,
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
                boxShadow: "0 0 20px rgba(26,240,190,0.8)",
              }}
            >
              <div className="rounded-full" style={{ width: "38%", height: "38%", backgroundColor: "#051061" }} />
            </div>
          </button>
        )}
      </div>
    </main>
  );
};

export default FocusGame;