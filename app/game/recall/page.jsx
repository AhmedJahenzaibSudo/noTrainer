"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

const TIMER_OPTIONS = [10, 20, 30, 60];

/* =========================================================
   COLORS
========================================================= */

const CYAN = "color(display-p3 0.056 0.958 0.949)";
const DARK = "color(display-p3 0.079 0.201 0.346)";
const RED = "color(display-p3 1 0 0)";
const YELLOW = "color(display-p3 0.98 0.78 0.12)";

const RecallGame = () => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [activeTile, setActiveTile] = useState(null);
  const [wrongTile, setWrongTile] = useState(null);
  const [level, setLevel] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState("idle");
  const cancelRef = useRef(false);

  const gridSize = level > 5 ? 4 : 3;
  const tiles = Array.from(
    { length: gridSize * gridSize },
    (_, i) => i,
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem("recallBestSimple");

      if (saved) {
        setHighScore(parseInt(saved));
      }
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
    [playSequence],
  );

  const handleTileClick = (tileId) => {
    if (isDisplaying || gameState !== "playing") return;

    const correctTile = sequence[userSequence.length];

    if (tileId === correctTile) {
      const newUserSeq = [...userSequence, tileId];

      setUserSequence(newUserSeq);

      if (newUserSeq.length === sequence.length) {
        setLevel((prev) => prev + 1);

        setTimeout(() => {
          startNextLevel(sequence);
        }, 900);
      }
    } else {
      setWrongTile(tileId);

      setTimeout(() => {
        setWrongTile(null);
      }, 500);

      setTimeout(() => {
        setGameState("failed");

        if (level > highScore) {
          setHighScore(level);

          try {
            localStorage.setItem(
              "recallBestSimple",
              level.toString(),
            );
          } catch {}
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

  const progress =
    sequence.length > 0
      ? (userSequence.length / sequence.length) * 100
      : 0;

  return (
    <main
      className="recall-root relative flex flex-col overflow-hidden select-none"
      style={{
        backgroundColor: CYAN,
        color: DARK,
        height: "calc(100dvh - 40px)",
        fontFamily: "sans-serif",
      }}
    >
      <style>{`
        @media (min-width: 768px) {
          .recall-root {
            height: calc(100dvh - 48px) !important;
          }
        }

        @keyframes tileGlow {
          0% {
            box-shadow: 0 0 0px ${CYAN};
          }

          50% {
            box-shadow: 0 0 28px ${CYAN};
          }

          100% {
            box-shadow: 0 0 0px ${CYAN};
          }
        }

        @keyframes wrongShake {
          0%, 100% {
            transform: translateX(0);
          }

          25% {
            transform: translateX(-4px);
          }

          75% {
            transform: translateX(4px);
          }
        }

        .tile-active {
          animation: tileGlow 0.45s ease-in-out;
        }

        .tile-wrong {
          animation: wrongShake 0.35s ease-in-out;
          background-color: ${RED} !important;
          border-color: ${RED} !important;
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
        <div className="w-24 md:w-36">
          <p
            className="text-[9px] md:text-xs tracking-[0.25em] font-black uppercase"
            style={{
              color: CYAN,
            }}
          >
            Level
          </p>

          <p
            className="text-2xl md:text-3xl font-black"
            style={{
              color: CYAN,
            }}
          >
            {level}
          </p>
        </div>

        <h1
          className="text-xl md:text-3xl font-black uppercase tracking-tight"
          style={{
            fontFamily: "'Krona One', sans-serif",
            color: CYAN,
          }}
        >
          Neural{" "}
          <span
            style={{
              color: YELLOW,
            }}
          >
            Recall
          </span>
        </h1>

        <div className="w-24 md:w-36 text-right">
          <p
            className="text-[9px] md:text-xs tracking-[0.25em] font-black uppercase"
            style={{
              color: CYAN,
            }}
          >
            Best
          </p>

          <p
            className="text-2xl md:text-3xl font-black"
            style={{
              color: CYAN,
            }}
          >
            {highScore}
          </p>
        </div>
      </header>

      {/* =====================================================
          STATUS BAR
      ===================================================== */}

      <div
        className="relative z-10 shrink-0 px-4 py-2 md:px-8 md:py-3 border-b-2 flex items-center justify-between gap-4"
        style={{
          backgroundColor: CYAN,
          borderColor: DARK,
        }}
      >
        {/* Progress */}

        <div className="flex gap-1.5 flex-wrap">
          {sequence.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 md:w-2.5 md:h-2.5 transition-all duration-200"
              style={{
                backgroundColor:
                  i < userSequence.length
                    ? YELLOW
                    : DARK,

                opacity:
                  i < userSequence.length
                    ? 1
                    : 0.2,
              }}
            />
          ))}
        </div>

        {/* Status */}

        <p
          className="text-[9px] md:text-xs font-black uppercase tracking-[0.25em] shrink-0 transition-colors duration-300"
          style={{
            color: isDisplaying ? RED : DARK,
            opacity: isDisplaying ? 1 : 0.55,
          }}
        >
          {isDisplaying
            ? "Watch..."
            : gameState === "playing"
              ? "Your turn"
              : ""}
        </p>
      </div>

      {/* =====================================================
          PLAY AREA
      ===================================================== */}

      <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center px-4 pb-4 md:px-8 md:pb-6">
        {/* Grid */}

        <div
          className="grid gap-2 md:gap-3 p-3 md:p-4 border-2"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            width: "min(88vw, 360px)",
            backgroundColor: DARK,
            borderColor: DARK,
          }}
        >
          {tiles.map((tile) => {
            const isActive = activeTile === tile;
            const isWrong = wrongTile === tile;
            const isCompleted =
              userSequence.includes(tile) && !isDisplaying;

            return (
              <button
                key={tile}
                onClick={() => handleTileClick(tile)}
                disabled={
                  isDisplaying || gameState !== "playing"
                }
                className={`
                  aspect-square
                  transition-all
                  duration-150
                  ${isActive ? "tile-active scale-95" : ""}
                  ${isWrong ? "tile-wrong" : ""}
                `}
                style={{
                  backgroundColor: isActive
                    ? YELLOW
                    : isCompleted
                      ? CYAN
                      : DARK,

                  border: isActive
                    ? `2px solid ${YELLOW}`
                    : isCompleted
                      ? `2px solid ${CYAN}`
                      : `2px solid ${CYAN}`,

                  opacity:
                    !isActive && !isCompleted
                      ? 0.45
                      : 1,

                  cursor:
                    isDisplaying ||
                    gameState !== "playing"
                      ? "default"
                      : "pointer",
                }}
              />
            );
          })}
        </div>

        {/* =================================================
            IDLE / FAILED OVERLAY
        ================================================= */}

        {gameState !== "playing" && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4"
            style={{
              backgroundColor: DARK,
              color: CYAN,
            }}
          >
            {gameState === "failed" && (
              <div className="text-center mb-8">
                <p
                  className="text-xs md:text-sm tracking-[0.4em] font-black uppercase mb-2"
                  style={{
                    fontFamily:
                      "'Krona One', sans-serif",

                    color: RED,
                  }}
                >
                  Game Over
                </p>

                <p
                  className="text-7xl md:text-9xl font-black tracking-tighter mb-2"
                  style={{
                    color: CYAN,
                  }}
                >
                  {level}
                </p>

                <div
                  className="h-1 w-20 mx-auto mb-3"
                  style={{
                    backgroundColor: CYAN,
                  }}
                />

                <p
                  className="text-sm md:text-base font-medium tracking-wide"
                  style={{
                    color: CYAN,
                    opacity: 0.65,
                  }}
                >
                  You reached level {level}
                </p>

                {level >= highScore && level > 0 && (
                  <p
                    className="mt-2 text-xs md:text-sm font-black tracking-[0.3em] uppercase"
                    style={{
                      color: YELLOW,
                    }}
                  >
                    ★ New Best!
                  </p>
                )}
              </div>
            )}

            {gameState === "idle" && (
              <div className="text-center mb-8">
                <h2
                  className="text-4xl md:text-6xl font-black uppercase tracking-tight"
                  style={{
                    fontFamily:
                      "'Krona One', sans-serif",

                    color: CYAN,
                  }}
                >
                  Neural{" "}
                  <span
                    style={{
                      color: YELLOW,
                    }}
                  >
                    Recall
                  </span>
                </h2>

                <p
                  className="text-xs md:text-sm tracking-[0.3em] uppercase mt-2 font-bold"
                  style={{
                    color: CYAN,
                    opacity: 0.6,
                  }}
                >
                  Watch the pattern, then repeat it
                </p>

                {highScore > 0 && (
                  <p
                    className="mt-3 text-xs md:text-sm font-bold tracking-widest uppercase"
                    style={{
                      color: YELLOW,
                    }}
                  >
                    Best: Level {highScore}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3">
              {/* Start */}

              <button
                onClick={startGame}
                className="px-12 md:px-20 py-4 md:py-5 border-2 font-black uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 text-sm md:text-base"
                style={{
                  backgroundColor: CYAN,
                  color: DARK,
                  borderColor: CYAN,
                }}
              >
                {gameState === "failed"
                  ? "Play Again"
                  : "Start"}
              </button>

              {/* Reset */}

              {gameState === "failed" && (
                <button
                  onClick={resetGame}
                  className="px-6 md:px-8 py-4 md:py-5 border-2 font-black uppercase tracking-[0.2em] text-sm md:text-base transition-all active:scale-95"
                  style={{
                    backgroundColor: DARK,
                    color: CYAN,
                    borderColor: CYAN,
                  }}
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