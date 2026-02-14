"use client";

import Link from "next/link";
import { Gamepad, Clock, AlertCircle, Zap, Target, Star } from "lucide-react";

const GAMES = [
  {
    title: "Memory Match",
    href: "/game/memory",
    icon: Gamepad,
    desc: "Test your short-term memory",
    color: "from-yellow-400/20 to-yellow-300/10",
  },
  {
    title: "Reaction Speed",
    href: "/game/reaction",
    icon: Clock,
    desc: "How fast can you click?",
    color: "from-red-400/20 to-red-300/10",
  },
  {
    title: "Number Guess",
    href: "/game/guess",
    icon: Target,
    desc: "Guess the correct number",
    color: "from-green-400/20 to-green-300/10",
  },
  {
    title: "Stroop Challenge",
    href: "/game/stroop",
    icon: Star,
    desc: "Test your focus & attention",
    color: "from-blue-400/20 to-blue-300/10",
  },
  {
    title: "Logic Puzzle",
    href: "/game/puzzle",
    icon: AlertCircle,
    desc: "Solve simple logic puzzles",
    color: "from-purple-400/20 to-purple-300/10",
  },
  {
    title: "Decision Game",
    href: "/game/decision",
    icon: Zap,
    desc: "Make the best choices",
    color: "from-cyan-400/20 to-cyan-300/10",
  },
];

export default function Game() {
  return (
    <main className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-yellow-400/10 blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-[200px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-yellow-400/5 blur-[180px]" />

      <div className="max-w-6xl mx-auto relative z-10 p-8 md:p-16">
        {/* Header */}
        <header className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            Mind <span className="text-yellow-400">Games</span>
          </h1>
          <div className="h-1 w-28 bg-gradient-to-r from-yellow-400/80 to-yellow-300/50 mx-auto mb-6 rounded-full" />
          <p className="text-xl text-white/70 font-medium max-w-2xl mx-auto">
            Fun & challenging games to train your mind and reflexes.
          </p>
        </header>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {GAMES.map((game) => {
            const Icon = game.icon;
            return (
              <Link
                key={game.href}
                href={game.href}
                className={`group relative rounded-2xl min-h-[250px] p-6 flex flex-col justify-between overflow-hidden
                  bg-gradient-to-br ${game.color} 
                  border border-white/10 backdrop-blur-lg
                  hover:scale-105 hover:shadow-2xl hover:shadow-[rgba(255,255,255,0.15)]
                  transition-all duration-300`}
              >
                <div className="flex justify-between items-start">
                  <Icon
                    size={48}
                    className="text-white/80 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] group-hover:scale-110 group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.9)] transition-transform duration-300"
                    strokeWidth={2.2}
                  />
                </div>

                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{game.title}</h3>
                  <p className="text-sm font-medium text-white/70">{game.desc}</p>
                </div>

                <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 bg-white/5 pointer-events-none animate-pulse" />
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 
          0%, 100% { opacity: 0.3; } 
          50% { opacity: 0.1; } 
        }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
      `}</style>
    </main>
  );
}
