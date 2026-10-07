"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Brain } from "lucide-react";
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
const RED = "color(display-p3 1 0 0)";
const YELLOW = "color(display-p3 0.98 0.78 0.12)";

export default function RecallGame() {
  const [step, setStep] = useState("intro");

  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);

  const [score, setScore] = useState(0);

  const [activeTile, setActiveTile] = useState(null);
  const [wrongTile, setWrongTile] = useState(null);
  const [clickedTile, setClickedTile] = useState(null);

  const [isDisplaying, setIsDisplaying] = useState(false);
  const [success, setSuccess] = useState(false);

  const cancelRef = useRef(false);

  const tiles = Array.from({ length: 9 }, (_, i) => i);

  // =======================
  // Wait
  // =======================

  const wait = (ms) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  // =======================
  // Show sequence
  // =======================

  const playSequence = useCallback(async (seq) => {
    setUserSequence([]);
    setClickedTile(null);
    setSuccess(false);
    setIsDisplaying(true);

    await wait(500);

    for (const tile of seq) {
      if (cancelRef.current) return;

      setActiveTile(tile);

      await wait(450);

      if (cancelRef.current) return;

      setActiveTile(null);

      await wait(250);
    }

    if (!cancelRef.current) {
      setIsDisplaying(false);
    }
  }, []);

  // =======================
  // Next round
  // =======================

  const nextRound = useCallback(
    (currentSequence) => {
      const nextTile = Math.floor(Math.random() * 9);

      const newSequence = [
        ...currentSequence,
        nextTile,
      ];

      setSequence(newSequence);
      setUserSequence([]);

      playSequence(newSequence);
    },
    [playSequence]
  );

  // =======================
  // Start game
  // =======================

  const startGame = () => {
    cancelRef.current = false;

    setScore(0);

    setSequence([]);
    setUserSequence([]);

    setActiveTile(null);
    setWrongTile(null);
    setClickedTile(null);

    setSuccess(false);
    setIsDisplaying(false);

    setStep("game");

    setTimeout(() => {
      nextRound([]);
    }, 400);
  };

  // =======================
  // End game
  // =======================

  const endGame = () => {
    cancelRef.current = true;

    setActiveTile(null);
    setWrongTile(null);
    setClickedTile(null);
    setIsDisplaying(false);
    setSuccess(false);

    setStep("result");
  };

  // =======================
  // Handle click
  // =======================

  const handleTileClick = (tileId) => {
    if (
      step !== "game" ||
      isDisplaying ||
      success
    ) {
      return;
    }

    const correctTile =
      sequence[userSequence.length];

    // =======================
    // Correct click
    // =======================

    if (tileId === correctTile) {
      setClickedTile(tileId);

      setTimeout(() => {
        setClickedTile(null);
      }, 180);

      const newUserSequence = [
        ...userSequence,
        tileId,
      ];

      setUserSequence(newUserSequence);

      // Whole sequence completed
      if (
        newUserSequence.length ===
        sequence.length
      ) {
        const newScore = score + 1;

        setScore(newScore);
        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);

          nextRound(sequence);
        }, 900);
      }

      return;
    }

    // =======================
    // Wrong click
    // =======================

    setWrongTile(tileId);

    setTimeout(() => {
      setStep("result");
    }, 600);
  };

  // =======================
  // Cleanup
  // =======================

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  // =======================
  // Intro
  // =======================

  if (step === "intro") {
    return (
      <main
        className="flex min-h-screen w-full items-center justify-center px-6"
        style={{
          backgroundColor: CYAN,
          color: DARK,
        }}
      >
        <div className="text-center">
          <Brain
            className="mx-auto mb-6 h-20 w-20"
            strokeWidth={1.8}
            style={{
              color: DARK,
            }}
          />

          <h1
            className={`${slackey.className} text-5xl uppercase leading-none md:text-7xl`}
          >
            Neural Recall
          </h1>

          <p className="mx-auto mt-5 max-w-md text-base font-medium md:text-lg">
            Watch the pattern, remember it, then
            repeat it.
          </p>

          <button
            onClick={startGame}
            className={`${slackey.className} mt-10 px-10 py-4 text-lg uppercase transition-transform hover:scale-105`}
            style={{
              backgroundColor: YELLOW,
              color: DARK,
            }}
          >
            Start
          </button>
        </div>
      </main>
    );
  }

  // =======================
  // Game
  // =======================

  if (step === "game") {
  return (
    <main
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4"
      style={{
        backgroundColor: DARK,
      }}
    >
      <style>{`
        @keyframes wrongShake {
          0%, 100% {
            transform: translateX(0);
          }

          25% {
            transform: translateX(-6px);
          }

          75% {
            transform: translateX(6px);
          }
        }

        @keyframes successPop {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }

          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .wrong-tile {
          animation: wrongShake 0.3s ease-in-out;
        }

        .success-text {
          animation: successPop 0.2s ease-out;
        }
      `}</style>

      {/* Right Controls */}
      <div className="absolute right-3 top-3 z-20 flex items-center gap-2 sm:right-5 sm:top-5">
        {/* Score */}
        <div
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3"
          style={{
            backgroundColor: CYAN,
            color: DARK,
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
          onClick={endGame}
          className={`${slackey.className} px-3 py-2 text-[10px] uppercase transition-transform active:scale-95 sm:px-5 sm:py-3 sm:text-xs`}
          style={{
            backgroundColor: YELLOW,
            color: DARK,
          }}
        >
          Stop
        </button>
      </div>

      {/* Game Area */}
      <div className="w-full max-w-[380px]">
        {/* Status */}
        <div className="mb-6 flex h-8 items-center justify-center">
          {success ? (
            <p
              className={`${slackey.className} success-text text-lg uppercase`}
              style={{
                color: YELLOW,
              }}
            >
              Correct!
            </p>
          ) : (
            <p
              className={`${slackey.className} text-sm uppercase md:text-base`}
              style={{
                color: isDisplaying ? YELLOW : CYAN,
              }}
            >
              {isDisplaying ? "Watch" : "Your Turn"}
            </p>
          )}
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-3 gap-2 p-3 md:gap-3 md:p-4"
          style={{
            backgroundColor: CYAN,
          }}
        >
          {tiles.map((tile) => {
            const isActive = activeTile === tile;
            const isWrong = wrongTile === tile;
            const isClicked = clickedTile === tile;

            return (
              <button
                key={tile}
                onClick={() => handleTileClick(tile)}
                disabled={isDisplaying || success}
                className={`
                  aspect-square
                  transition-all
                  duration-150

                  ${
                    !isDisplaying && !success
                      ? "active:scale-95"
                      : ""
                  }

                  ${
                    isWrong
                      ? "wrong-tile"
                      : ""
                  }
                `}
                style={{
                  backgroundColor:
                    isWrong
                      ? RED
                      : isActive
                        ? YELLOW
                        : isClicked
                          ? CYAN
                          : DARK,

                  border:
                    isClicked
                      ? `4px solid ${YELLOW}`
                      : `2px solid ${CYAN}`,

                  opacity:
                    isActive ||
                    isClicked ||
                    isWrong
                      ? 1
                      : 0.75,

                  cursor:
                    isDisplaying || success
                      ? "default"
                      : "pointer",
                }}
              />
            );
          })}
        </div>

        
      </div>
    </main>
  );
}

  // =======================
  // Result
  // =======================

  return (
    <main
      className="flex min-h-screen w-full items-center justify-center px-6"
      style={{
        backgroundColor: CYAN,
        color: DARK,
      }}
    >
      <div className="text-center">
        <p className="mb-4 text-lg font-bold uppercase tracking-wider">
          Your Score
        </p>

        <h1
          className={`${slackey.className} text-8xl md:text-9xl`}
        >
          {score}
        </h1>

        <button
          onClick={startGame}
          className={`${slackey.className} mt-10 px-10 py-4 text-lg uppercase transition-transform hover:scale-105`}
          style={{
            backgroundColor: YELLOW,
            color: DARK,
          }}
        >
          Play Again
        </button>
      </div>
    </main>
  );
}