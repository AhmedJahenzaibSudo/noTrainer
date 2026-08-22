"use client";

import { Brain, Zap, Target, Wind } from "lucide-react";
import Link from "next/link";

// =======================
// Config
// =======================

const HEADER_HEIGHT = 40;

const config = {
  fontFamily: "'Krona One', sans-serif",

  cyan: "color(display-p3 0.056 0.958 0.949)",
  dark: "color(display-p3 0.079 0.201 0.346)",
  accent: "color(display-p3 0.98 0.78 0.12)",
};

const GAMES = [
  {
    title: "Focus Strike",
    icon: Target,
    desc: "Improve target acquisition",
    why: "Precision is key in daily brain challenges",
    href: "/game/focus",
  },
  {
    title: "Neural Recall",
    icon: Brain,
    desc: "Enhance memory retention",
    why: "Strong memory = better focus & performance",
    href: "/game/recall",
  },
  {
    title: "Reflex Pro",
    icon: Zap,
    desc: "Boost reaction speed",
    why: "Quick thinking & reflexes help in everything",
    href: "/game/reaction",
  },
  {
    title: "Zen Flow",
    icon: Wind,
    desc: "Relax and clear your mind",
    why: "Calm mind = better learning and stress relief",
    href: "/game/zenflow",
  },
];

// =======================
// Components
// =======================

const ClipSection = ({ children, background }) => (
  <div
    className="snap-start"
    style={{
      position: "relative",
      width: "100%",
      height: `calc(100vh - ${HEADER_HEIGHT}px)`,
    }}
  >
    <div
      style={{
        position: "absolute",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        clip: "rect(0, auto, auto, 0)",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: HEADER_HEIGHT,
          left: 0,
          width: "100%",
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          backgroundColor: background,
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "fixed",
          top: HEADER_HEIGHT,
          left: 0,
          width: "100%",
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "0 1rem",
        }}
      >
        {children}
      </div>
    </div>
  </div>
);

const GameCard = ({ game, index }) => {
  const Icon = game.icon;

  const isDark = index % 2 === 1;

  const background = isDark
    ? config.dark
    : config.cyan;

  const textColor = isDark
    ? config.cyan
    : config.dark;

  return (
    <ClipSection background={background}>
      <div className="relative z-10 px-4 text-center">
        {/* Icon */}

        <div
          className="mx-auto mb-7 flex h-20 w-20 items-center justify-center border-2 transition-transform hover:scale-105"
          style={{
            backgroundColor: textColor,
            color: background,
            borderColor: textColor,
          }}
        >
          <Icon size={44} strokeWidth={1.8} />
        </div>

        {/* Title */}

        <h2
          className="mb-5 text-5xl font-black uppercase leading-none tracking-tight md:text-7xl"
          style={{
            fontFamily: config.fontFamily,
            color: textColor,
          }}
        >
          {game.title}
        </h2>

        {/* Description */}

        <p
          className="mb-3 text-lg font-bold uppercase tracking-wide md:text-2xl"
          style={{
            color: textColor,
          }}
        >
          {game.desc}
        </p>

        {/* Why */}

        <p
          className="mx-auto mb-8 max-w-xl text-sm font-medium md:text-lg"
          style={{
            color: textColor,
            opacity: 0.7,
          }}
        >
          {game.why}
        </p>

        {/* Play */}

        <Link
          href={game.href}
          className="inline-flex min-w-[150px] items-center justify-center border-2 px-10 py-4 text-lg font-black uppercase tracking-widest transition-transform hover:scale-105"
          style={{
            backgroundColor: config.accent,
            color: config.dark,
            borderColor: textColor,
          }}
        >
          Play
        </Link>
      </div>
    </ClipSection>
  );
};

// =======================
// Main Page
// =======================

export default function GameDashboard() {
  return (
    <main className="snap-y snap-mandatory overflow-y-scroll font-sans">
      {/* Intro - Cyan */}

      <ClipSection background={config.cyan}>
        <div className="relative z-10 px-4 text-center">
          <h1
            className="mb-5 text-6xl font-black uppercase leading-none tracking-tight md:text-8xl"
            style={{
              fontFamily: config.fontFamily,
              color: config.dark,
            }}
          >
            Mind{" "}
            <span
              className="inline-block px-3 py-1"
              style={{
                backgroundColor: config.dark,
                color: config.cyan,
              }}
            >
              Games
            </span>
          </h1>

          <p
            className="text-xl font-bold uppercase tracking-wide md:text-2xl"
            style={{
              color: config.dark,
            }}
          >
            Workout for your Brain
          </p>

          <p
            className="mt-3 text-sm font-medium md:text-lg"
            style={{
              color: config.dark,
              opacity: 0.65,
            }}
          >
            Scroll down to explore each game and its benefits
          </p>

          <div
            className="mx-auto mt-10 h-1 w-20"
            style={{
              backgroundColor: config.accent,
            }}
          />
        </div>
      </ClipSection>

      {/* Alternating Game Sections */}

      {GAMES.map((game, index) => (
        <GameCard
          key={game.title}
          game={game}
          index={index + 1}
        />
      ))}
    </main>
  );
}