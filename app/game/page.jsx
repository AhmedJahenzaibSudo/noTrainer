"use client";

import { Brain, Zap, Target, Wind } from "lucide-react";
import Link from "next/link";

// =======================
// Config
// =======================
const HEADER_HEIGHT = 40;

const config = {
  fontFamily: "'Krona One', sans-serif",
  colorPalettes: [
    {
      bg: "#1E3A8A",
      text: "#FFFFFF",
      accent: "#FDE047",
    },
    {
      bg: "#7C3AED",
      text: "#FFFFFF",
      accent: "#FB7185",
    },
    {
      bg: "#047857",
      text: "#FFFFFF",
      accent: "#BEF264",
    },
    {
      bg: "#DC2626",
      text: "#FFFFFF",
      accent: "#FDE047",
    },
    {
      bg: "#2563EB",
      text: "#FFFFFF",
      accent: "#38BDF8",
    },
  ],
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
const ClipSection = ({ children, bgColor }) => (
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
          backgroundColor: bgColor,
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

const GameCard = ({ game, palette }) => {
  const Icon = game.icon;

  return (
    <ClipSection bgColor={palette.bg}>
      <div className="text-center px-4 relative z-10">
        <div
          className="mb-6 flex items-center justify-center w-20 h-20 mx-auto rounded-full transition-transform hover:scale-110"
          style={{ backgroundColor: `${palette.accent}20` }}
        >
          <Icon size={48} style={{ color: palette.accent }} />
        </div>

        <h2
          className="text-5xl md:text-7xl font-black uppercase mb-4"
          style={{ fontFamily: config.fontFamily, color: palette.text }}
        >
          {game.title}
        </h2>

        <p
          className="text-lg md:text-2xl font-semibold uppercase mb-2"
          style={{ color: `${palette.text}ee` }}
        >
          {game.desc}
        </p>

        <p
          className="text-sm md:text-lg italic mb-6"
          style={{ color: `${palette.text}aa` }}
        >
          {game.why}
        </p>

        <Link
          href={game.href}
          className="inline-block px-10 py-4 text-lg font-bold uppercase rounded-xl transition-all hover:scale-105 hover:shadow-2xl"
          style={{
            backgroundColor: palette.accent,
            color: palette.bg,
            boxShadow: `0 4px 20px ${palette.accent}40`,
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
  const introPalette = config.colorPalettes[0];

  return (
    <main className="snap-y snap-mandatory overflow-y-scroll font-sans">
      <ClipSection bgColor={introPalette.bg}>
        <div className="text-center px-4 relative z-10">
          <h1
            className="text-6xl md:text-8xl font-black uppercase mb-4"
            style={{ fontFamily: config.fontFamily, color: introPalette.text }}
          >
            Mind <span style={{ color: introPalette.accent }}>Games</span>
          </h1>
          <p
            className="text-xl md:text-2xl font-semibold"
            style={{ color: `${introPalette.text}ee` }}
          >
            Workout for your Brain
          </p>
          <p
            className="mt-2 text-sm md:text-lg italic"
            style={{ color: `${introPalette.text}aa` }}
          >
            Scroll down to explore each game and its benefits
          </p>
        </div>
      </ClipSection>

      {GAMES.map((game, idx) => (
        <GameCard
          key={game.title}
          game={game}
          palette={config.colorPalettes[idx + 1]}
        />
      ))}
    </main>
  );
}
