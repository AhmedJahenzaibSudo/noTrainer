"use client";

import { Brain, Zap, Target, Wind } from "lucide-react";
import Link from "next/link";
import { Slackey } from "next/font/google";

const slackey = Slackey({
  subsets: ["latin"],
  weight: "400",
});

// =======================
// Config
// =======================

const HEADER_HEIGHT = 40;

const config = {
  cyan: "color(display-p3 0.056 0.958 0.949)",
  dark: "color(display-p3 0.079 0.201 0.346)",
  accent: "color(display-p3 0.98 0.78 0.12)",
};

// =======================
// Games
// =======================

const GAMES = [
  {
    title: "Focus Strike",
    icon: Target,
    desc: "Improve target acquisition",
    href: "/game/focus",
  },
  {
    title: "Neural Recall",
    icon: Brain,
    desc: "Enhance memory retention",
    href: "/game/recall",
  },
  {
    title: "Reflex Pro",
    icon: Zap,
    desc: "Boost reaction speed",
    href: "/game/reaction",
  },
  {
    title: "Zen Flow",
    icon: Wind,
    desc: "Relax and clear your mind",
    href: "/game/zenflow",
  },
];

// =======================
// Clipping Section
// =======================

const ClipSection = ({ children, background }) => (
  <section
    className="relative h-screen w-full snap-start"
    style={{
      backgroundColor: background,
    }}
  >
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        clipPath: "inset(0)",
      }}
    >
      {/* Fixed background */}
      <div
        className="fixed inset-0"
        style={{
          backgroundColor: background,
          zIndex: 0,
        }}
      />

      {/* Fixed content */}
      <div
        className="fixed left-0 flex w-full items-center justify-center px-4"
        style={{
          top: `${HEADER_HEIGHT}px`,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  </section>
);

// =======================
// Game Section
// =======================

const GameCard = ({ game, index }) => {
  const Icon = game.icon;

  // Alternate backgrounds
  const isDark = index % 2 === 1;

  const background = isDark ? config.dark : config.cyan;

  // Use cyan on dark backgrounds,
  // and dark on cyan backgrounds.
  const textColor = isDark ? config.cyan : config.dark;

  return (
    <ClipSection background={background}>
      <div className="relative z-10 w-full max-w-5xl text-center">
        {/* Icon */}
        <div className="mb-7 flex justify-center">
          <Icon
            size={72}
            strokeWidth={1.8}
            style={{
              color: textColor,
            }}
          />
        </div>

        {/* Title */}
        <h2
          className={`${slackey.className} mb-5 text-5xl uppercase leading-none tracking-tight md:text-7xl`}
          style={{
            color: textColor,
          }}
        >
          {game.title}
        </h2>

        {/* Description */}
        <p
          className="mb-8 text-lg font-bold uppercase tracking-wide md:text-2xl"
          style={{
            color: textColor,
          }}
        >
          {game.desc}
        </p>

        {/* Play */}
        <Link
          href={game.href}
          className="inline-flex min-w-[150px] items-center justify-center border-2 px-10 py-4 text-lg font-black uppercase tracking-widest transition-transform duration-200 hover:scale-105"
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
    <main
      className="w-full snap-y snap-mandatory"
      style={{
        backgroundColor: config.cyan,
      }}
    >
      {/* =======================
          Intro
      ======================= */}

      <ClipSection background={config.cyan}>
        <div className="relative z-10 w-full max-w-5xl text-center">
          <h1
            className={`${slackey.className} mb-5 text-6xl uppercase leading-none tracking-tight md:text-8xl`}
            style={{
              color: config.dark,
            }}
          >
            Brain Games
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
            Scroll to explore games
          </p>

          
        </div>
      </ClipSection>

      {/* =======================
          Games
      ======================= */}

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
