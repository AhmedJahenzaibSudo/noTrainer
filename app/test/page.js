"use client";

import Link from "next/link";
import { Brain, Zap, Target, Wind } from "lucide-react";

// ============================================
// CONFIGURATION
// ============================================
const config = {
  colors: {
    bgPrimary: "#051061",
    bgDark: "#020a21",
    accent: "#1AF0BE",
    textPrimary: "#ffffff",
  },
};

const GAMES = [
  {
    title: "Focus Strike",
    href: "/game/focus",
    icon: Target,
    desc: "Improve target acquisition",
    color: "bg-[#1AF0BE]", // Accent Color
    textColor: "text-[#051061]",
    subtextColor: "text-[#051061]/80",
    iconColor: "text-[#051061]",
    hoverRing: "hover:ring-4 hover:ring-white/20",
  },
  {
    title: "Neural Recall",
    href: "/game/recall",
    icon: Brain,
    desc: "Enhance memory retention",
    color: "bg-[#1AF0BE]",
    textColor: "text-[#051061]",
    subtextColor: "text-[#051061]/80",
    iconColor: "text-[#051061]",
    hoverRing: "hover:ring-4 hover:ring-white/20",
  },
  {
    title: "Reflex Pro",
    href: "/game/reaction",
    icon: Zap,
    desc: "Boost reaction speed",
    color: "bg-[#1AF0BE]",
    textColor: "text-[#051061]",
    subtextColor: "text-[#051061]/80",
    iconColor: "text-[#051061]",
    hoverRing: "hover:ring-4 hover:ring-white/20",
  },
  {
    title: "Zen Flow",
    href: "/game/zenflow",
    icon: Wind,
    desc: "Relax and clear your mind",
    color: "bg-[#1AF0BE]",
    textColor: "text-[#051061]",
    subtextColor: "text-[#051061]/80",
    iconColor: "text-[#051061]",
    hoverRing: "hover:ring-4 hover:ring-white/20",
  },
];

export default function Dashboard() {
  return (
    <main
      className="relative flex flex-col items-center overflow-hidden font-sans selection:bg-[#1AF0BE] selection:text-[#051061]"
      style={{
        backgroundColor: config.colors.bgDark,
        height: "calc(100dvh - 40px)",
      }}
    >
      {/* Responsive Height Override for MD+ */}
      <style jsx>{`
        @media (min-width: 768px) {
          main {
            height: calc(100dvh - 48px);
          }
        }
      `}</style>

      {/* Background Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] bg-[#051061] blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] bg-[#1AF0BE] opacity-10 blur-[120px]" />
      </div>

      {/* Header Section */}
      <header className="relative z-10 w-full max-w-5xl px-6 pt-6 pb-4 text-center shrink-0 md:pt-8 md:pb-6">
        <h1
          className="text-3xl font-black uppercase tracking-tight text-white md:text-5xl"
          style={{ fontFamily: "'Krona One', sans-serif" }}
        >
          Mind <span className="text-[#1AF0BE]">Games</span>
        </h1>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 md:text-xs">
          Workout for the Brain
        </p>
      </header>

      {/* Games Grid Container */}
      <div className="relative z-10 w-full max-w-5xl flex-1 px-4 pb-4 min-h-0 md:px-6 md:pb-6">
        <div className="grid h-full grid-cols-2 grid-rows-2 gap-4 md:gap-6">
          {GAMES.map((game) => {
            const Icon = game.icon;

            return (
              <Link
                key={game.href}
                href={game.href}
                className={`group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl p-6 md:p-8 transition-all duration-300 active:scale-95 hover:scale-[1.02] ${game.color} ${game.hoverRing}`}
              >
                {/* Icon */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-16">
                  <Icon
                    size={34}
                    className={`${game.iconColor}`}
                    strokeWidth={2.5}
                  />
                </div>

                {/* Text Content */}
                <h3
                  className={`text-center text-lg font-black uppercase tracking-tight md:text-2xl ${game.textColor}`}
                >
                  {game.title}
                </h3>

                <p
                  className={`mt-2 text-center text-xs font-semibold uppercase tracking-wider md:text-sm ${game.subtextColor}`}
                >
                  {game.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
