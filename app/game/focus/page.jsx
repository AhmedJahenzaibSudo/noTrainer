"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, RotateCcw } from "lucide-react";

const TIMER_OPTIONS = [10, 20, 30, 60];

/* =========================================================
   COLORS
========================================================= */

const CYAN = "color(display-p3 0.056 0.958 0.949)";
const DARK = "color(display-p3 0.079 0.201 0.346)";
const RED = "color(display-p3 1 0 0)";
const YELLOW = "color(display-p3 0.98 0.78 0.12)";

const FocusGame = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [selectedTime, setSelectedTime] = useState(20);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isActive, setIsActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [position, setPosition] = useState({
    top: "50%",
    left: "50%",
  });
  const [combo, setCombo] = useState(0);
  const [stats, setStats] = useState({
    totalClicks: 0,
    hits: 0,
  });
  const [flashMiss, setFlashMiss] = useState(false);
  const [popups, setPopups] = useState([]);

  const arenaRef = useRef(null);
  const popupId = useRef(0);

  const level = Math.floor(score / 100) + 1;
  const targetSize = Math.max(24, 54 - level * 4);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("focusHighScore");

      if (saved) {
        setHighScore(parseInt(saved));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!isActive && !gameOver) {
      setTimeLeft(selectedTime);
    }
  }, [selectedTime, isActive, gameOver]);

  useEffect(() => {
    let timer;

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setGameOver(true);

      if (score > highScore) {
        setHighScore(score);

        try {
          localStorage.setItem(
            "focusHighScore",
            score.toString()
          );
        } catch {}
      }
    }

    return () => clearInterval(timer);
  }, [isActive, timeLeft, score, highScore]);

  const moveTarget = useCallback(() => {
    const top = Math.floor(Math.random() * 65) + 15;
    const left = Math.floor(Math.random() * 75) + 12;

    setPosition({
      top: `${top}%`,
      left: `${left}%`,
    });
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(selectedTime);
    setCombo(0);
    setStats({
      totalClicks: 0,
      hits: 0,
    });
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
    setStats({
      totalClicks: 0,
      hits: 0,
    });
    setPopups([]);
    setTimeLeft(selectedTime);
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(selectedTime);
    setCombo(0);
    setStats({
      totalClicks: 0,
      hits: 0,
    });
    setGameOver(false);
    setPopups([]);
    setIsActive(true);
    moveTarget();
  };

  const handleArenaClick = () => {
    if (!isActive) return;

    setStats((prev) => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
    }));

    setCombo(0);
    setFlashMiss(true);

    setTimeout(() => {
      setFlashMiss(false);
    }, 180);
  };

  const handleTargetClick = (e) => {
    e.stopPropagation();

    if (!isActive) return;

    const newCombo = combo + 1;
    const bonus = Math.floor(newCombo / 5) * 5;
    const points = 10 + bonus;

    setScore((prev) => prev + points);
    setCombo(newCombo);

    setStats((prev) => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      hits: prev.hits + 1,
    }));

    moveTarget();

    const id = popupId.current++;
    const px = position.left;
    const py = position.top;

    setPopups((prev) => [
      ...prev,
      {
        id,
        points,
        px,
        py,
      },
    ]);

    setTimeout(() => {
      setPopups((prev) =>
        prev.filter((p) => p.id !== id)
      );
    }, 700);
  };

  const accuracy =
    stats.totalClicks > 0
      ? Math.round(
          (stats.hits / stats.totalClicks) * 100
        )
      : 0;

  const timerPct =
    (timeLeft / selectedTime) * 100;

  const timerColor =
    timeLeft <= 5
      ? RED
      : timeLeft <= selectedTime * 0.4
        ? YELLOW
        : CYAN;

  return (
    <main
      className="focus-root relative flex flex-col overflow-hidden select-none"
      style={{
        backgroundColor: CYAN,
        color: DARK,
        height: "calc(100dvh - 40px)",
        fontFamily: "sans-serif",
      }}
    >
      <style>{`
        @media (min-width: 768px) {
          .focus-root {
            height: calc(100dvh - 48px) !important;
          }
        }

        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          100% {
            opacity: 0;
            transform: translateY(-44px) scale(1.25);
          }
        }

        @keyframes pulseRing {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.7;
          }

          100% {
            transform: translate(-50%, -50%) scale(2.4);
            opacity: 0;
          }
        }

        .popup-float {
          animation: floatUp 0.7s ease-out forwards;
        }

        .ring-pulse {
          animation: pulseRing 0.65s ease-out infinite;
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
        {/* Accuracy */}

        <div className="w-24 md:w-36">
          <p
            className="text-[9px] md:text-xs tracking-[0.25em] font-black uppercase"
            style={{ color: CYAN }}
          >
            Accuracy
          </p>

          <p className="text-2xl md:text-3xl font-black">
            {accuracy}%
          </p>
        </div>

        {/* Title */}

        <div className="text-center">
          <h1
            className="text-xl md:text-3xl font-black uppercase tracking-tight"
            style={{
              fontFamily: "'Krona One', sans-serif",
              color: CYAN,
            }}
          >
            Focus{" "}
            <span
              style={{
                color: YELLOW,
              }}
            >
              Strike
            </span>
          </h1>
        </div>

        {/* Combo */}

        <div className="w-24 md:w-36 text-right">
          <p
            className="text-[9px] md:text-xs tracking-[0.25em] font-black uppercase"
            style={{
              color: CYAN,
            }}
          >
            Combo
          </p>

          <p
            className="text-2xl md:text-3xl font-black transition-all duration-150"
            style={{
              color: combo >= 5 ? YELLOW : CYAN,
            }}
          >
            ×{combo}
          </p>
        </div>
      </header>

      {/* =====================================================
          STATS
      ===================================================== */}

      <div
        className="relative z-10 shrink-0 grid grid-cols-3 items-center px-4 py-2 md:px-8 md:py-3 border-b-2"
        style={{
          backgroundColor: CYAN,
          borderColor: DARK,
          color: DARK,
        }}
      >
        {/* Score */}

        <div className="text-center">
          <p className="text-[9px] md:text-xs font-black uppercase tracking-widest opacity-60">
            Score
          </p>

          <p className="text-3xl md:text-5xl font-black">
            {score}
          </p>
        </div>

        {/* Timer */}

        <div className="flex flex-col items-center">
          <p className="text-[9px] md:text-xs font-black uppercase tracking-widest mb-1 opacity-60">
            Time
          </p>

          <div className="relative w-12 h-12 md:w-16 md:h-16">
            <svg
              className="w-full h-full -rotate-90"
              viewBox="0 0 48 48"
            >
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke={DARK}
                strokeOpacity="0.2"
                strokeWidth="4"
              />

              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke={timerColor}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${
                  2 *
                  Math.PI *
                  20 *
                  (1 - timerPct / 100)
                }`}
                style={{
                  transition:
                    "stroke-dashoffset 0.9s linear, stroke 0.3s",
                }}
              />
            </svg>

            <span
              className="absolute inset-0 flex items-center justify-center text-sm md:text-lg font-black"
              style={{
                color:
                  timeLeft <= selectedTime * 0.4
                    ? timerColor
                    : DARK,
              }}
            >
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Best */}

        <div className="text-center">
          <p className="text-[9px] md:text-xs font-black uppercase tracking-widest opacity-60">
            Best
          </p>

          <p className="text-3xl md:text-5xl font-black opacity-50">
            {highScore}
          </p>
        </div>
      </div>

      {/* =====================================================
          ARENA
      ===================================================== */}

      <div
        ref={arenaRef}
        onClick={handleArenaClick}
        className="relative z-10 flex-1 min-h-0 mx-4 mb-4 md:mx-6 md:mb-6 mt-3 overflow-hidden cursor-crosshair border-2"
        style={{
          borderColor: flashMiss ? RED : DARK,
          backgroundColor: DARK,
          transition: "border-color 0.15s",
        }}
      >
        {/* In-game Controls */}

        {isActive && (
          <div className="absolute top-3 right-3 z-30 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                restartGame();
              }}
              className="flex items-center gap-1.5 px-3 py-2 border-2 font-black text-xs uppercase tracking-wider transition-all active:scale-95"
              style={{
                backgroundColor: CYAN,
                borderColor: CYAN,
                color: DARK,
              }}
            >
              <RotateCcw size={13} />

              <span className="hidden md:inline">
                Restart
              </span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                stopGame();
              }}
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
          </div>
        )}

        {/* Score Popups */}

        {popups.map((p) => (
          <span
            key={p.id}
            className="popup-float pointer-events-none absolute font-black text-sm md:text-lg"
            style={{
              top: p.py,
              left: p.px,
              color: YELLOW,
              transform: "translate(-50%, -100%)",
            }}
          >
            +{p.points}
          </span>
        ))}

        {/* =================================================
            START / GAME OVER OVERLAY
        ================================================= */}

        {!isActive && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4"
            style={{
              backgroundColor: DARK,
              color: CYAN,
            }}
          >
            {gameOver ? (
              <div className="text-center mb-6">
                <p
                  className="text-xs md:text-sm tracking-[0.4em] font-black uppercase mb-2"
                  style={{
                    fontFamily:
                      "'Krona One', sans-serif",
                    color: YELLOW,
                  }}
                >
                  Game Over
                </p>

                <p
                  className="text-7xl md:text-9xl font-black tracking-tighter mb-3"
                  style={{
                    color: CYAN,
                  }}
                >
                  {score}
                </p>

                <div
                  className="h-1 w-20 mx-auto mb-3"
                  style={{
                    backgroundColor: CYAN,
                  }}
                />

                <p
                  className="text-sm md:text-base font-bold tracking-wide"
                  style={{
                    color: CYAN,
                    opacity: 0.7,
                  }}
                >
                  Accuracy {accuracy}% · Hits {stats.hits}
                </p>

                {score > 0 && score >= highScore && (
                  <p
                    className="mt-3 text-xs md:text-sm font-black tracking-[0.3em] uppercase"
                    style={{
                      color: YELLOW,
                    }}
                  >
                    ★ New Best!
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center mb-6">
                <h2
                  className="text-4xl md:text-6xl font-black uppercase tracking-tight"
                  style={{
                    fontFamily:
                      "'Krona One', sans-serif",
                    color: CYAN,
                  }}
                >
                  Focus{" "}
                  <span
                    style={{
                      color: YELLOW,
                    }}
                  >
                    Strike
                  </span>
                </h2>

                <p
                  className="text-xs md:text-sm tracking-[0.3em] uppercase mt-3 font-bold"
                  style={{
                    color: CYAN,
                    opacity: 0.65,
                  }}
                >
                  Tap the targets as fast as you can
                </p>

                {highScore > 0 && (
                  <p
                    className="mt-3 text-xs md:text-sm font-black tracking-widest uppercase"
                    style={{
                      color: YELLOW,
                    }}
                  >
                    Best: {highScore}
                  </p>
                )}
              </div>
            )}

            {/* Timer Picker */}

            <div className="flex gap-2 mb-6">
              {TIMER_OPTIONS.map((t) => {
                const selected = selectedTime === t;

                return (
                  <button
                    key={t}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTime(t);
                    }}
                    className="px-3 py-2 md:px-5 md:py-2.5 border-2 font-black text-xs md:text-sm uppercase tracking-wider transition-all active:scale-95"
                    style={{
                      backgroundColor: selected
                        ? YELLOW
                        : DARK,

                      color: selected
                        ? DARK
                        : CYAN,

                      borderColor: selected
                        ? YELLOW
                        : CYAN,
                    }}
                  >
                    {t}s
                  </button>
                );
              })}
            </div>

            {/* Start */}

            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="px-14 md:px-20 py-4 md:py-5 border-2 font-black uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 text-sm md:text-base"
              style={{
                backgroundColor: CYAN,
                borderColor: CYAN,
                color: DARK,
              }}
            >
              {gameOver ? "Play Again" : "Start"}
            </button>
          </div>
        )}

        {/* =================================================
            TARGET
        ================================================= */}

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
                top: "50%",
                left: "50%",
                width: `${targetSize}px`,
                height: `${targetSize}px`,
                border: `2px solid ${CYAN}`,
              }}
            />

            <div
              className="relative w-full h-full rounded-full flex items-center justify-center"
              style={{
                backgroundColor: CYAN,
              }}
            >
              <div
                className="rounded-full"
                style={{
                  width: "38%",
                  height: "38%",
                  backgroundColor: RED,
                }}
              />
            </div>
          </button>
        )}
      </div>
    </main>
  );
};

export default FocusGame;