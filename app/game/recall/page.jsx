"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

const RecallGame = () => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [activeTile, setActiveTile] = useState(null);
  const [wrongTile, setWrongTile] = useState(null);
  const [level, setLevel] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState("idle"); // idle | playing | failed
  const cancelRef = useRef(false);

  const gridSize = level > 5 ? 4 : 3;
  const tiles = Array.from({ length: gridSize * gridSize }, (_, i) => i);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("recallBestSimple");
      if (saved) setHighScore(parseInt(saved));
    } catch {}
  }, []);

  const playSequence = useCallback(async (seq) => {
    cancelRef.current = false;
    setIsDisplaying(true);
    await new Promise((r) => setTimeout(r, 400));
    for (let i = 0; i < seq.length; i++) {
      if (cancelRef.current) return;
      setActiveTile(seq[i]);
      await new Promise((r) => setTimeout(r, 450));
      if (cancelRef.current) return;
      setActiveTile(null);
      await new Promise((r) => setTimeout(r, 250));
    }
    setIsDisplaying(false);
  }, []);

  const startNextLevel = useCallback(
    (currentSeq = []) => {
      const size = currentSeq.length > 5 ? 4 : 3;
      const nextTile = Math.floor(Math.random() * size * size);
      const newSeq = [...currentSeq, nextTile];
      setSequence(newSeq);
      setUserSequence([]);
      playSequence(newSeq);
    },
    [playSequence]
  );

  const handleTileClick = (tileId) => {
    if (isDisplaying || gameState !== "playing") return;
    const correctTile = sequence[userSequence.length];

    if (tileId === correctTile) {
      const newUserSeq = [...userSequence, tileId];
      setUserSequence(newUserSeq);
      if (newUserSeq.length === sequence.length) {
        setLevel((prev) => prev + 1);
        setTimeout(() => startNextLevel(sequence), 900);
      }
    } else {
      setWrongTile(tileId);
      setTimeout(() => setWrongTile(null), 500);
      setTimeout(() => {
        setGameState("failed");
        if (level > highScore) {
          setHighScore(level);
          try { localStorage.setItem("recallBestSimple", level.toString()); } catch {}
        }
      }, 400);
    }
  };

  const startGame = () => {
    cancelRef.current = true;
    setLevel(1);
    setSequence([]);
    setUserSequence([]);
    setActiveTile(null);
    setWrongTile(null);
    setGameState("playing");
    setTimeout(() => {
      const nextTile = Math.floor(Math.random() * 9);
      const newSeq = [nextTile];
      setSequence(newSeq);
      setUserSequence([]);
      playSequence(newSeq);
    }, 100);
  };

  const resetGame = () => {
    cancelRef.current = true;
    setGameState("idle");
    setLevel(0);
    setSequence([]);
    setUserSequence([]);
    setActiveTile(null);
  };

  const progress = sequence.length > 0 ? (userSequence.length / sequence.length) * 100 : 0;

  return (
    <main
      className="recall-root relative flex flex-col overflow-hidden select-none text-white"
      style={{ backgroundColor: "#0a1628", height: "calc(100dvh - 40px)", fontFamily: "sans-serif" }}
    >
      <style>{`
        @media (min-width: 768px) {
          .recall-root { height: calc(100dvh - 48px) !important; }
        }
        @keyframes tileGlow {
          0%   { box-shadow: 0 0 0px rgba(26,240,190,0); }
          50%  { box-shadow: 0 0 28px rgba(26,240,190,0.9); }
          100% { box-shadow: 0 0 0px rgba(26,240,190,0); }
        }
        @keyframes wrongShake {
          0%,100% { transform: translateX(0); }
          25%      { transform: translateX(-4px); }
          75%      { transform: translateX(4px); }
        }
        .tile-active { animation: tileGlow 0.45s ease-in-out; }
        .tile-wrong  { animation: wrongShake 0.35s ease-in-out; background-color: #ef4444 !important; }
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
          <p className="text-[9px] md:text-xs tracking-[0.25em] text-[#1AF0BE] font-black uppercase">Level</p>
          <p className="text-2xl md:text-3xl font-black">{level}</p>
        </div>

        <h1
          className="text-xl md:text-3xl font-black uppercase tracking-tight text-white"
          style={{ fontFamily: "'Krona One', sans-serif" }}
        >
          Neural <span className="text-[#1AF0BE]">Recall</span>
        </h1>

        <div className="w-24 md:w-36 text-right">
          <p className="text-[9px] md:text-xs tracking-[0.25em] text-[#1AF0BE] font-black uppercase">Best</p>
          <p className="text-2xl md:text-3xl font-black">{highScore}</p>
        </div>
      </header>

      {/* ── STATUS BAR ── */}
      <div className="relative z-10 shrink-0 px-4 py-2 md:px-8 md:py-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between gap-4">
        {/* Progress dots */}
        <div className="flex gap-1.5 flex-wrap">
          {sequence.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-sm transition-all duration-200"
              style={{
                backgroundColor: i < userSequence.length ? "#1AF0BE" : "rgba(255,255,255,0.1)",
                boxShadow: i < userSequence.length ? "0 0 6px #1AF0BE" : "none",
              }}
            />
          ))}
        </div>

        {/* Status text */}
        <p
          className="text-[9px] md:text-xs font-black uppercase tracking-[0.25em] shrink-0 transition-colors duration-300"
          style={{ color: isDisplaying ? "#1AF0BE" : "rgba(255,255,255,0.3)" }}
        >
          {isDisplaying ? "Watch..." : gameState === "playing" ? "Your turn" : ""}
        </p>
      </div>

      {/* ── PLAY AREA ── */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center px-4 pb-4 md:px-8 md:pb-6">

        {/* Grid */}
        <div
          className="grid gap-2 md:gap-3 p-3 md:p-4 rounded-2xl"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            width: "min(88vw, 360px)",
            backgroundColor: "rgba(13,30,58,0.8)",
            border: "1.5px solid rgba(255,255,255,0.08)",
          }}
        >
          {tiles.map((tile) => {
            const isActive = activeTile === tile;
            const isWrong = wrongTile === tile;
            const isCompleted = userSequence.includes(tile) && !isDisplaying;

            return (
              <button
                key={tile}
                onClick={() => handleTileClick(tile)}
                disabled={isDisplaying || gameState !== "playing"}
                className={`aspect-square rounded-xl transition-all duration-150
                  ${isActive ? "tile-active scale-95" : ""}
                  ${isWrong ? "tile-wrong" : ""}
                `}
                style={{
                  backgroundColor: isActive
                    ? "#1AF0BE"
                    : isCompleted
                    ? "rgba(26,240,190,0.15)"
                    : "rgba(255,255,255,0.05)",
                  border: isActive
                    ? "none"
                    : isCompleted
                    ? "1.5px solid rgba(26,240,190,0.3)"
                    : "1.5px solid rgba(255,255,255,0.07)",
                  cursor: isDisplaying || gameState !== "playing" ? "default" : "pointer",
                }}
              />
            );
          })}
        </div>

        {/* Overlay: idle / failed */}
        {gameState !== "playing" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#071224]/90 backdrop-blur-md px-4">
            {gameState === "failed" && (
              <div className="text-center mb-8">
                <p
                  className="text-xs md:text-sm tracking-[0.4em] text-[#1AF0BE] font-black uppercase mb-2"
                  style={{ fontFamily: "'Krona One', sans-serif" }}
                >
                  Game Over
                </p>
                <p className="text-7xl md:text-9xl font-black text-white tracking-tighter mb-2">{level}</p>
                <div className="h-px w-20 bg-white/10 mx-auto mb-3" />
                <p className="text-white/40 text-sm md:text-base font-medium tracking-wide">
                  You reached level {level}
                </p>
                {level >= highScore && level > 0 && (
                  <p className="mt-2 text-xs md:text-sm font-black tracking-[0.3em] uppercase text-[#1AF0BE]">★ New Best!</p>
                )}
              </div>
            )}

            {gameState === "idle" && (
              <div className="text-center mb-8">
                <h2
                  className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight"
                  style={{ fontFamily: "'Krona One', sans-serif" }}
                >
                  Neural <span className="text-[#1AF0BE]">Recall</span>
                </h2>
                <p className="text-white/30 text-xs md:text-sm tracking-[0.3em] uppercase mt-2 font-bold">
                  Watch the pattern, then repeat it
                </p>
                {highScore > 0 && (
                  <p className="mt-3 text-xs md:text-sm text-[#1AF0BE]/60 font-bold tracking-widest uppercase">
                    Best: Level {highScore}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="group relative px-12 md:px-20 py-4 md:py-5 overflow-hidden rounded-xl font-black uppercase tracking-[0.3em] text-[#051061] transition-all hover:scale-105 active:scale-95 text-sm md:text-base"
                style={{
                  backgroundColor: "#1AF0BE",
                  boxShadow: "0 0 36px rgba(26,240,190,0.35)",
                }}
              >
                <span className="relative z-10">{gameState === "failed" ? "Play Again" : "Start"}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>

              {gameState === "failed" && (
                <button
                  onClick={resetGame}
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

export default RecallGame;