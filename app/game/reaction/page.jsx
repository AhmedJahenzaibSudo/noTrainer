"use client";

import React, { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Slackey } from "next/font/google";

const slackey = Slackey({
  subsets: ["latin"],
  weight: "400",
});

// =======================
// Colors
// =======================

const CYAN = "color(display-p3 0.056 0.958 0.949)";
const DARK = "color(display-p3 0.079 0.201 0.346)";
const YELLOW = "color(display-p3 0.98 0.78 0.12)";
const RED = "color(display-p3 1 0 0)";

// =======================
// Ranks
// =======================

const RANKS = [
  { max: 500, label: "Inhuman", color: CYAN },
  { max: 900, label: "Lightning", color: CYAN },
  { max: 1400, label: "Fast", color: YELLOW },
  { max: 2200, label: "Average", color: YELLOW },
  { max: 3000, label: "Slow", color: RED },
  { max: Infinity, label: "Sleepy", color: RED },
];
const getRank = (ms) =>
  RANKS.find((rank) => ms < rank.max) ||
  RANKS[RANKS.length - 1];

// =======================
// Game
// =======================

const ReactionGame = () => {
  const [state, setState] = useState("idle");

  const [time, setTime] = useState(null);
  const [best, setBest] = useState(null);
  const [history, setHistory] = useState([]);

  const [position, setPosition] = useState({
    x: 50,
    y: 50,
  });

  const timerRef = useRef(null);
  const startRef = useRef(0);

  // =======================
  // Load saved data
  // =======================

  useEffect(() => {
    try {
      const savedBest =
        localStorage.getItem("reflex_best");

      if (savedBest) {
        setBest(parseInt(savedBest, 10));
      }

      const savedHistory =
        localStorage.getItem("reflex_history");

      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch {}
  }, []);

  // =======================
  // Cleanup
  // =======================

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  // =======================
  // Start test
  // =======================

  const startTest = () => {
    clearTimeout(timerRef.current);

    setTime(null);
    setState("waiting");

    const delay =
      Math.random() * 3000 + 1500;

    timerRef.current = setTimeout(() => {
      setPosition({
        x: Math.random() * 70 + 15,
        y: Math.random() * 70 + 15,
      });

      setState("go");
      startRef.current = Date.now();
    }, delay);
  };

  // =======================
  // Hit target
  // =======================

  const handleHit = (event) => {
    event.stopPropagation();

    if (state !== "go") return;

    const reactionTime =
      Date.now() - startRef.current;

    setTime(reactionTime);
    setState("result");

    const newHistory = [
      ...history,
      reactionTime,
    ].slice(-5);

    setHistory(newHistory);

    try {
      localStorage.setItem(
        "reflex_history",
        JSON.stringify(newHistory)
      );
    } catch {}

    if (!best || reactionTime < best) {
      setBest(reactionTime);

      try {
        localStorage.setItem(
          "reflex_best",
          reactionTime.toString()
        );
      } catch {}
    }
  };

  // =======================
  // Early click
  // =======================

  const handleAreaClick = () => {
    if (state !== "waiting") return;

    clearTimeout(timerRef.current);

    setState("early");
  };

  // =======================
  // Reset
  // =======================

  const reset = () => {
    clearTimeout(timerRef.current);

    setState("idle");
    setTime(null);
  };

  // =======================
  // Stats
  // =======================

  const average = history.length
    ? Math.round(
        history.reduce(
          (total, value) => total + value,
          0
        ) / history.length
      )
    : null;

  const rank = time
    ? getRank(time)
    : null;

  // =======================
  // Render
  // =======================

  return (
    <main
      className="relative flex min-h-screen w-full flex-col overflow-hidden select-none"
      style={{
        backgroundColor: CYAN,
        color: DARK,
      }}
    >
      {/* =======================
          Top Right Stats
      ======================= */}

      <div className="absolute right-3 top-3 z-30 flex items-center gap-2 sm:right-5 sm:top-5">
        {/* Best */}
        <div
          className="px-3 py-2 text-center sm:px-4 sm:py-3"
          style={{
            backgroundColor: DARK,
            color: CYAN,
          }}
        >
          <p className="text-[8px] font-black uppercase tracking-widest opacity-60 sm:text-[10px]">
            Best
          </p>

          <p
            className={`${slackey.className} text-base sm:text-xl`}
          >
            {best ?? "--"}
            {best && (
              <span className="ml-1 text-[9px]">
                ms
              </span>
            )}
          </p>
        </div>

        {/* Avg */}
        <div
          className="px-3 py-2 text-center sm:px-4 sm:py-3"
          style={{
            backgroundColor: DARK,
            color: CYAN,
          }}
        >
          <p className="text-[8px] font-black uppercase tracking-widest opacity-60 sm:text-[10px]">
            Avg
          </p>

          <p
            className={`${slackey.className} text-base sm:text-xl`}
          >
            {average ?? "--"}
            {average && (
              <span className="ml-1 text-[9px]">
                ms
              </span>
            )}
          </p>
        </div>

        {/* Last */}
        {time && (
          <div
            className="hidden px-3 py-2 text-center sm:block sm:px-4 sm:py-3"
            style={{
              backgroundColor: DARK,
              color: rank?.color || CYAN,
            }}
          >
            <p className="text-[8px] font-black uppercase tracking-widest opacity-60 sm:text-[10px]">
              Last
            </p>

            <p
              className={`${slackey.className} text-base sm:text-xl`}
            >
              {time}
              <span className="ml-1 text-[9px]">
                ms
              </span>
            </p>
          </div>
        )}
      </div>

      {/* =======================
          Game Area
      ======================= */}

      <div
        onClick={handleAreaClick}
        className="relative flex flex-1 items-center justify-center overflow-hidden"
        style={{
          backgroundColor: DARK,
          cursor:
            state === "go"
              ? "crosshair"
              : state === "waiting"
                ? "pointer"
                : "default",
        }}
      >
        {/* =======================
            Idle
        ======================= */}

        {state === "idle" && (
          <div className="px-6 text-center">
            <h1
              className={`${slackey.className} text-5xl uppercase leading-none md:text-7xl`}
              style={{
                color: CYAN,
              }}
            >
              Reflex Pro
            </h1>

            <p
              className="mx-auto mt-5 max-w-md text-sm font-medium md:text-lg"
              style={{
                color: CYAN,
                opacity: 0.7,
              }}
            >
              Wait for the target, then hit it
              as fast as you can.
            </p>

            {best && (
              <p
                className={`${slackey.className} mt-5 text-sm uppercase`}
                style={{
                  color: YELLOW,
                }}
              >
                Best {best}ms
              </p>
            )}

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                startTest();
              }}
              className={`${slackey.className} mt-10 px-10 py-4 text-sm uppercase transition-transform hover:scale-105 active:scale-95`}
              style={{
                backgroundColor: CYAN,
                color: DARK,
              }}
            >
              Start
            </button>
          </div>
        )}

        {/* =======================
            Waiting
        ======================= */}

        {state === "waiting" && (
          <div
            className="px-6 text-center"
            style={{
              color: CYAN,
            }}
          >
            <p
              className={`${slackey.className} text-5xl uppercase md:text-7xl`}
            >
              Wait
            </p>

            <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] opacity-55 md:text-sm">
              Don't click yet
            </p>
          </div>
        )}

        {/* =======================
            Target
        ======================= */}

        {state === "go" && (
          <button
            type="button"
            onClick={handleHit}
            aria-label="Hit target"
            className="absolute flex h-20 w-20 items-center justify-center rounded-full transition-transform active:scale-75 sm:h-24 sm:w-24"
            style={{
              top: `${position.y}%`,
              left: `${position.x}%`,
              transform:
                "translate(-50%, -50%)",
              backgroundColor: CYAN,
            }}
          >
            <span
              className="h-7 w-7 rounded-full sm:h-9 sm:w-9"
              style={{
                backgroundColor: RED,
              }}
            />
          </button>
        )}

        {/* =======================
            Result
        ======================= */}

        {state === "result" && rank && (
          <div className="px-6 text-center">
            <p
              className={`${slackey.className} text-sm uppercase tracking-widest`}
              style={{
                color: rank.color,
              }}
            >
              {rank.label}
            </p>

            <div
              className={`${slackey.className} mt-3 text-7xl leading-none md:text-9xl`}
              style={{
                color: rank.color,
              }}
            >
              {time}

              <span
                className="ml-2 text-xl md:text-3xl"
                style={{
                  color: CYAN,
                }}
              >
                ms
              </span>
            </div>

            {best === time && (
              <p
                className={`${slackey.className} mt-4 text-xs uppercase`}
                style={{
                  color: YELLOW,
                }}
              >
                New Best
              </p>
            )}

            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  startTest();
                }}
                className={`${slackey.className} px-8 py-4 text-xs uppercase transition-transform hover:scale-105 active:scale-95`}
                style={{
                  backgroundColor: CYAN,
                  color: DARK,
                }}
              >
                Try Again
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  reset();
                }}
                className="flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase transition-transform hover:scale-105 active:scale-95"
                style={{
                  color: CYAN,
                  border: `2px solid ${CYAN}`,
                }}
              >
                <RotateCcw size={14} />

                Reset
              </button>
            </div>
          </div>
        )}

        {/* =======================
            Too Early
        ======================= */}

        {state === "early" && (
          <div className="px-6 text-center">
            <p
              className={`${slackey.className} text-5xl uppercase md:text-7xl`}
              style={{
                color: RED,
              }}
            >
              Too Early
            </p>

            <p
              className="mt-4 text-xs font-bold uppercase tracking-[0.25em] md:text-sm"
              style={{
                color: CYAN,
                opacity: 0.65,
              }}
            >
              Wait for the target
            </p>

            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  startTest();
                }}
                className={`${slackey.className} px-8 py-4 text-xs uppercase transition-transform hover:scale-105 active:scale-95`}
                style={{
                  backgroundColor: CYAN,
                  color: DARK,
                }}
              >
                Try Again
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  reset();
                }}
                className="flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase transition-transform hover:scale-105 active:scale-95"
                style={{
                  color: CYAN,
                  border: `2px solid ${CYAN}`,
                }}
              >
                <RotateCcw size={14} />

                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ReactionGame;