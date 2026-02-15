"use client";

import Link from "next/link";
import { Brain, Zap, Target, Wind, ChevronRight } from "lucide-react";

const GAMES = [
  {
    title: "Focus Strike",
    href: "/game/focus",
    icon: Target,
    desc: "Target Acquisition",
    color: "from-blue-600/20 to-blue-400/10",
    glow: "bg-blue-500/10",
  },
  {
    title: "Neural Recall",
    href: "/game/recall",
    icon: Brain,
    desc: "Pattern Memory",
    color: "from-cyan-600/20 to-cyan-400/10",
    glow: "bg-cyan-500/10",
  },
  {
    title: "Reflex Pro",
    href: "/game/reaction",
    icon: Zap,
    desc: "Reaction Speed",
    color: "from-indigo-600/20 to-indigo-400/10",
    glow: "bg-indigo-500/10",  
  },
  {
    title: "Zen Flow",
    href: "/game/zenflow",
    icon: Wind,
    desc: "Mental Reset",
    color: "from-emerald-600/20 to-emerald-400/10",
    glow: "bg-emerald-500/10",
  },
];

export default function Dashboard() {
  return (
    <main 
      className="bg-[#020205] text-white font-sans relative overflow-hidden flex flex-col items-center justify-between" 
      style={{ height: '93.5vh' }}
    >
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-cyan-600/5 blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <header className="pt-12 text-center flex-none">
        <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">
          Games
        </h1>
        <div className="h-1.5 w-24 bg-blue-600 mt-4 mx-auto rounded-none shadow-[0_0_15px_#2563eb]" />
      </header>

      {/* 2x2 Games Grid */}
      <div className="flex-grow w-full max-w-4xl px-6 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-5 w-full h-[65%] max-h-[480px]">
          {GAMES.map((game) => {
            const Icon = game.icon;
            return (
              <Link
                key={game.href}
                href={game.href}
                className={`group relative rounded-none p-6 flex flex-col justify-between overflow-hidden
                  bg-gradient-to-br ${game.color} 
                  border border-white/5 backdrop-blur-3xl
                  hover:border-blue-500/40 hover:scale-[1.02]
                  transition-all duration-500 active:scale-95 shadow-2xl`}
              >
                {/* Decorative Internal Glow */}
                <div className={`absolute -right-5 -top-5 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-60 transition-opacity ${game.glow}`} />

                <div className="relative z-10">
                  {/* ICON + NAME ROW */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-none bg-white/5 flex items-center justify-center group-hover:bg-blue-600/20 transition-all duration-300">
                      <Icon size={24} className="text-blue-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-tight">
                      {game.title}
                    </h3>
                  </div>
                  
                  {/* DESCRIPTION */}
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] ml-16 group-hover:text-blue-300 transition-colors">
                    {game.desc}
                  </p>
                </div>

                {/* BOTTOM INTERACTION BAR */}
                <div className="relative z-10 flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <span className="h-[2px] w-8 bg-blue-600 group-hover:w-16 transition-all duration-500" />
                      <span className="text-[8px] font-black uppercase text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">Launch Game</span>
                    </div>
                    <ChevronRight size={18} className="text-white/20 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" />
                </div>

                {/* Hover Shine Effect */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none transition-opacity" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full pb-10 flex flex-col items-center gap-4 flex-none opacity-20">
        <div className="flex gap-8 text-[9px] font-mono tracking-[0.3em] text-neutral-500 uppercase font-bold">
          <span>System Active</span>
          <span>v3.0.4</span>
        </div>
      </footer>
    </main>
  );
}