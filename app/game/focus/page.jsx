"use client";

import { useEffect, useState } from "react";
import { Target } from "lucide-react";
import { Slackey } from "next/font/google";

const slackey = Slackey({
  subsets: ["latin"],
  weight: "400",
});

const config = {
  cyan: "color(display-p3 0.056 0.958 0.949)",
  dark: "color(display-p3 0.079 0.201 0.346)",
  accent: "color(display-p3 0.98 0.78 0.12)",
};

export default function FocusGame() {
  const [step, setStep] = useState("intro");

  const [duration, setDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);

  const [score, setScore] = useState(0);

  const [targetPosition, setTargetPosition] = useState({
    x: 50,
    y: 50,
  });

  // =========================
  // Target position
  // =========================

  const moveTarget = () => {
    const x = 10 + Math.random() * 80;
    const y = 10 + Math.random() * 80;

    setTargetPosition({
      x,
      y,
    });
  };

  // =========================
  // Start game
  // =========================

  const startGame = () => {
    setScore(0);
    setTimeLeft(duration);
    moveTarget();
    setStep("game");
  };

  // =========================
  // Target click
  // =========================

  const hitTarget = () => {
    setScore((prev) => prev + 1);
    moveTarget();
  };

  // =========================
  // Restart
  // =========================

  const restartGame = () => {
    setScore(0);
    setTimeLeft(duration);
    setStep("intro");
  };

  // =========================
  // Timer
  // =========================

  useEffect(() => {
    if (step !== "game") return;

    if (timeLeft <= 0) {
      setStep("result");
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, step]);

  // =========================
  // Intro
  // =========================

  if (step === "intro") {
    return (
      <main
        className="flex min-h-screen w-full items-center justify-center px-6"
        style={{
          backgroundColor: config.cyan,
        }}
      >
        <div className="text-center">
          <Target
            className="mx-auto mb-6 h-20 w-20"
            strokeWidth={1.8}
            style={{
              color: config.dark,
            }}
          />

          <h1
            className={`${slackey.className} text-5xl uppercase leading-none md:text-7xl`}
            style={{
              color: config.dark,
            }}
          >
            Focus Strike
          </h1>

          <p
            className="mx-auto mt-5 max-w-md text-base font-medium md:text-lg"
            style={{
              color: config.dark,
            }}
          >
            Hit as many targets as you can before the time runs out.
          </p>

          <button
            onClick={() => setStep("time")}
            className={`${slackey.className} mt-10 px-10 py-4 text-lg uppercase transition-transform hover:scale-105`}
            style={{
              backgroundColor: config.accent,
              color: config.dark,
            }}
          >
            Start
          </button>
        </div>
      </main>
    );
  }

  // =========================
  // Time selection
  // =========================

  if (step === "time") {
    return (
      <main
        className="flex min-h-screen w-full items-center justify-center px-6"
        style={{
          backgroundColor: config.cyan,
        }}
      >
        <div className="w-full max-w-xl text-center">
          <h1
            className={`${slackey.className} text-4xl uppercase md:text-6xl`}
            style={{
              color: config.dark,
            }}
          >
            Choose Time
          </h1>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {[30, 60, 90].map((time) => (
              <button
                key={time}
                onClick={() => setDuration(time)}
                className={`${slackey.className} py-5 text-lg transition-transform hover:scale-105 md:text-xl`}
                style={{
                  backgroundColor:
                    duration === time ? config.dark : "transparent",

                  color:
                    duration === time ? config.cyan : config.dark,

                  border: `2px solid ${config.dark}`,
                }}
              >
                {time}s
              </button>
            ))}
          </div>

          <button
            onClick={startGame}
            className={`${slackey.className} mt-10 px-10 py-4 text-lg uppercase transition-transform hover:scale-105`}
            style={{
              backgroundColor: config.accent,
              color: config.dark,
            }}
          >
            Start Game
          </button>
        </div>
      </main>
    );
  }

  // =========================
  // Game
  // =========================

if (step === "game") {
  return (
    <main
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{
        backgroundColor: config.dark,
      }}
    >
      {/* Right Controls */}
      <div className="absolute right-3 top-3 z-20 flex items-center gap-2 sm:right-5 sm:top-5">
        {/* Time */}
        <div
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3"
          style={{
            backgroundColor: config.cyan,
            color: config.dark,
          }}
        >
          <span className="text-[9px] font-black uppercase tracking-widest sm:text-xs">
            Time
          </span>

          <span
            className={`${slackey.className} text-lg sm:text-2xl`}
          >
            {timeLeft}s
          </span>
        </div>

        {/* Score */}
        <div
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3"
          style={{
            backgroundColor: config.cyan,
            color: config.dark,
          }}
        >
          <span className="text-[9px] font-black uppercase tracking-widest sm:text-xs">
            Score
          </span>

          <span
            className={`${slackey.className} text-lg sm:text-2xl`}
          >
            {score}
          </span>
        </div>

        {/* Stop */}
        <button
          onClick={() => setStep("result")}
          className={`${slackey.className} px-3 py-2 text-[10px] uppercase transition-transform active:scale-95 sm:px-5 sm:py-3 sm:text-xs`}
          style={{
            backgroundColor: config.accent,
            color: config.dark,
          }}
        >
          Stop
        </button>
      </div>

      {/* Game Area */}
      <div className="relative h-full w-full">
        <button
          onClick={hitTarget}
          aria-label="Hit target"
          className="absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform active:scale-90 sm:h-20 sm:w-20 md:h-24 md:w-24"
          style={{
            left: `${targetPosition.x}%`,
            top: `${targetPosition.y}%`,
            backgroundColor: config.accent,
          }}
        >
          <Target
            className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
            strokeWidth={2}
            style={{
              color: config.dark,
            }}
          />
        </button>
      </div>
    </main>
  );
}
  // =========================
  // Result
  // =========================

  return (
    <main
      className="flex min-h-screen w-full items-center justify-center px-6"
      style={{
        backgroundColor: config.cyan,
      }}
    >
      <div className="text-center">
        <p
          className="mb-4 text-lg font-bold uppercase tracking-wider"
          style={{
            color: config.dark,
          }}
        >
          Your Score
        </p>

        <h1
          className={`${slackey.className} text-8xl md:text-9xl`}
          style={{
            color: config.dark,
          }}
        >
          {score}
        </h1>

        <button
          onClick={restartGame}
          className={`${slackey.className} mt-10 px-10 py-4 text-lg uppercase transition-transform hover:scale-105`}
          style={{
            backgroundColor: config.accent,
            color: config.dark,
          }}
        >
          Play Again
        </button>
      </div>
    </main>
  );
}