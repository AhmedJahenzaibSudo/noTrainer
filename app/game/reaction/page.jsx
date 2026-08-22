"use client";

import React, { useState, useEffect, useRef } from "react";

const RANKS = [
  { max: 150, label: "Inhuman", color: "color(display-p3 0.056 0.958 0.949)" },
  { max: 200, label: "Lightning", color: "color(display-p3 0.056 0.958 0.949)" },
  { max: 250, label: "Fast", color: "color(display-p3 0.98 0.78 0.12)" },
  { max: 300, label: "Average", color: "color(display-p3 0.98 0.78 0.12)" },
  { max: 400, label: "Slow", color: "color(display-p3 1 0 0)" },
  { max: Infinity, label: "Sleepy", color: "color(display-p3 1 0 0)" },
];

const getRank = (ms) =>
  RANKS.find((r) => ms < r.max) || RANKS[RANKS.length - 1];

const CYAN = "color(display-p3 0.056 0.958 0.949)";
const DARK = "color(display-p3 0.079 0.201 0.346)";
const YELLOW = "color(display-p3 0.98 0.78 0.12)";
const RED = "color(display-p3 1 0 0)";

const ReactionGame = () => {
  const [state, setState] = useState("idle");
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

    try {
      localStorage.setItem(
        "reflex_history",
        JSON.stringify(newHistory),
      );
    } catch {}

    if (!best || diff < best) {
      setBest(diff);

      try {
        localStorage.setItem("reflex_best", diff.toString());
      } catch {}
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
    ? Math.round(
        history.reduce((a, b) => a + b, 0) / history.length,
      )
    : null;

  const rank = time ? getRank(time) : null;

  return (
    <main
      className="reflex-root relative flex flex-col overflow-hidden select-none"
      style={{
        backgroundColor: CYAN,
        color: DARK,
        height: "calc(100dvh - 40px)",
        fontFamily: "sans-serif",
      }}
    >
      <style>{`
        @media (min-width: 768px) {
          .reflex-root {
            height: calc(100dvh - 48px) !important;
          }
        }

        @keyframes pulseRing {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.7;
          }

          100% {
            transform: translate(-50%, -50%) scale(2.6);
            opacity: 0;
          }
        }

        @keyframes waitPulse {
          0%, 100% {
            opacity: 0.4;
          }

          50% {
            opacity: 1;
          }
        }

        @keyframes popIn {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
          }

          70% {
            transform: translate(-50%, -50%) scale(1.1);
          }

          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        .ring-pulse {
          animation: pulseRing 0.7s ease-out infinite;
        }

        .wait-pulse {
          animation: waitPulse 1s ease-in-out infinite;
        }

        .pop-in {
          animation: popIn 0.18s ease-out forwards;
        }
      `}</style>

      {/* HEADER */}
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
            style={{ color: CYAN }}
          >
            Best
          </p>

          <p
            className="text-2xl md:text-3xl font-black"
            style={{ color: CYAN }}
          >
            {best ?? "--"}
            <span
              className="text-xs md:text-sm font-normal ml-1"
              style={{
                color: CYAN,
                opacity: 0.55,
              }}
            >
              ms
            </span>
          </p>
        </div>

        <h1
          className="text-xl md:text-3xl font-black uppercase tracking-tight"
          style={{
            fontFamily: "'Krona One', sans-serif",
            color: CYAN,
          }}
        >
          Reflex{" "}
          <span style={{ color: YELLOW }}>
            Pro
          </span>
        </h1>

        <div className="w-24 md:w-36 text-right">
          <p
            className="text-[9px] md:text-xs tracking-[0.25em] font-black uppercase"
            style={{ color: CYAN }}
          >
            Avg
          </p>

          <p
            className="text-2xl md:text-3xl font-black"
            style={{ color: CYAN }}
          >
            {avg ?? "--"}
            <span
              className="text-xs md:text-sm font-normal ml-1"
              style={{
                color: CYAN,
                opacity: 0.55,
              }}
            >
              ms
            </span>
          </p>
        </div>
      </header>

      {/* LAST 5 */}
      {history.length > 0 && (
        <div
          className="relative z-10 shrink-0 flex items-center justify-center gap-2 px-4 py-2 md:py-3 border-b-2"
          style={{
            backgroundColor: CYAN,
            borderColor: DARK,
          }}
        >
          <p
            className="text-[9px] md:text-xs font-bold uppercase tracking-widest mr-2"
            style={{
              color: DARK,
              opacity: 0.55,
            }}
          >
            Last 5
          </p>

          {history.map((ms, i) => {
            const r = getRank(ms);

            return (
              <div
                key={i}
                className="flex flex-col items-center"
              >
                <span
                  className="text-xs md:text-sm font-black"
                  style={{
                    color: r.color,
                  }}
                >
                  {ms}
                </span>

                <span
                  className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider"
                  style={{
                    color: r.color,
                    opacity: 0.7,
                  }}
                >
                  {r.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ARENA */}
      <div
        onClick={handleAreaClick}
        className="relative z-10 flex-1 min-h-0 mx-4 mb-4 md:mx-6 md:mb-6 mt-3 overflow-hidden border-2"
        style={{
          backgroundColor: DARK,
          borderColor: DARK,
          cursor:
            state === "waiting"
              ? "default"
              : state === "go"
                ? "crosshair"
                : "default",
        }}
      >
        {/* WAITING */}
        {state === "waiting" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p
              className="wait-pulse font-black uppercase tracking-[0.4em] text-sm md:text-base"
              style={{
                fontFamily: "'Krona One', sans-serif",
                color: CYAN,
              }}
            >
              Wait...
            </p>

            <p
              className="mt-3 text-xs font-bold uppercase tracking-widest"
              style={{
                color: CYAN,
                opacity: 0.45,
              }}
            >
              Don't click yet
            </p>
          </div>
        )}

        {/* GO TARGET */}
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
                  width: "36%",
                  height: "36%",
                  backgroundColor: RED,
                }}
              />
            </div>
          </button>
        )}

        {/* OVERLAY */}
        {(state === "idle" ||
          state === "result" ||
          state === "early") && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4"
            style={{
              backgroundColor: DARK,
              color: CYAN,
            }}
          >
            {state === "result" && rank && (
              <div className="text-center mb-8">
                <p
                  className="text-xs md:text-sm tracking-[0.4em] font-black uppercase mb-2"
                  style={{
                    color: rank.color,
                    fontFamily: "'Krona One', sans-serif",
                  }}
                >
                  {rank.label}
                </p>

                <p
                  className="text-7xl md:text-9xl font-black tracking-tighter mb-2"
                  style={{
                    color: rank.color,
                  }}
                >
                  {time}

                  <span
                    className="text-2xl md:text-4xl font-black ml-2"
                    style={{
                      color: CYAN,
                      opacity: 0.5,
                    }}
                  >
                    ms
                  </span>
                </p>

                {best === time && (
                  <p
                    className="text-xs md:text-sm font-black tracking-[0.3em] uppercase"
                    style={{
                      color: YELLOW,
                    }}
                  >
                    ★ New Best!
                  </p>
                )}
              </div>
            )}

            {state === "early" && (
              <div className="text-center mb-8">
                <p
                  className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-2"
                  style={{
                    fontFamily: "'Krona One', sans-serif",
                    color: RED,
                  }}
                >
                  Too Early!
                </p>

                <p
                  className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase mt-2"
                  style={{
                    color: CYAN,
                    opacity: 0.55,
                  }}
                >
                  Wait for the target to appear
                </p>
              </div>
            )}

            {state === "idle" && (
              <div className="text-center mb-8">
                <h2
                  className="text-4xl md:text-6xl font-black uppercase tracking-tight"
                  style={{
                    fontFamily: "'Krona One', sans-serif",
                    color: CYAN,
                  }}
                >
                  Reflex{" "}
                  <span style={{ color: YELLOW }}>
                    Pro
                  </span>
                </h2>

                <p
                  className="text-xs md:text-sm tracking-[0.3em] uppercase mt-2 font-bold"
                  style={{
                    color: CYAN,
                    opacity: 0.55,
                  }}
                >
                  Hit the target the moment it appears
                </p>

                {best && (
                  <p
                    className="mt-3 text-xs md:text-sm font-bold tracking-widest uppercase"
                    style={{
                      color: YELLOW,
                    }}
                  >
                    Best: {best}ms
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startTest();
                }}
                className="px-12 md:px-20 py-4 md:py-5 border-2 font-black uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 text-sm md:text-base"
                style={{
                  backgroundColor: CYAN,
                  color: DARK,
                  borderColor: CYAN,
                }}
              >
                {state === "result" || state === "early"
                  ? "Try Again"
                  : "Start"}
              </button>

              {(state === "result" ||
                state === "early") && (
                <button
                  onClick={reset}
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

export default ReactionGame;