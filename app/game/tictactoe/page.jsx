"use client";
import React, { useState, useEffect } from "react";
import { RotateCcw, Zap } from "lucide-react";

const HEIGHT_STYLE = { height: "93.5vh" };

const ICONS = ["⚡", "🔥", "💎", "👾", "🧠", "🎯"];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

const MemoryMatch = () => {
  const [tiles, setTiles] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const deck = shuffle([...ICONS, ...ICONS]).map((icon, i) => ({
      id: i,
      icon,
    }));
    setTiles(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLocked(false);
  };

  const handleFlip = (index) => {
    if (locked || flipped.includes(index) || matched.includes(index)) return;

    const nextFlipped = [...flipped, index];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);

      const [a, b] = nextFlipped;
      if (tiles[a].icon === tiles[b].icon) {
        setTimeout(() => {
          setMatched((m) => [...m, a, b]);
          setFlipped([]);
          setLocked(false);
        }, 400);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 700);
      }
    }
  };

  const isComplete = matched.length === tiles.length;

  return (
    <div
      style={HEIGHT_STYLE}
      className="w-full flex flex-col items-center justify-between py-10 px-6 bg-black border-t border-white/5"
    >
      {/* HEADER */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black italic text-white uppercase">
          Memory <span className="text-cyan-400">Match</span>
        </h2>
        <p className="text-[10px] tracking-widest text-white/40 uppercase">
          Flip • Match • Dominate
        </p>
      </div>

      {/* STATS */}
      <div className="w-full max-w-sm grid grid-cols-2 border border-white/10 bg-[#050505]">
        <div className="py-4 text-center border-r border-white/10">
          <p className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">
            Moves
          </p>
          <p className="text-2xl font-black text-white">{moves}</p>
        </div>
        <div className="py-4 text-center">
          <p className="text-[8px] font-black text-purple-400 uppercase tracking-widest">
            Matches
          </p>
          <p className="text-2xl font-black text-white">
            {matched.length / 2}
          </p>
        </div>
      </div>

      {/* GRID */}
      <div className="w-full max-w-[360px] grid grid-cols-4 gap-3">
        {tiles.map((tile, i) => {
          const isOpen =
            flipped.includes(i) || matched.includes(i);

          return (
            <button
              key={tile.id}
              onClick={() => handleFlip(i)}
              className={`aspect-square flex items-center justify-center border text-3xl font-black transition-all
              ${
                isOpen
                  ? "bg-cyan-400 text-black border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.6)]"
                  : "bg-zinc-900 border-white/10 hover:bg-zinc-800"
              }`}
            >
              {isOpen ? tile.icon : <Zap size={20} />}
            </button>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="w-full max-w-sm space-y-4">
        <div
          className={`py-4 text-center font-black uppercase text-[10px] tracking-[0.4em] border-2 transition-all
          ${
            isComplete
              ? "bg-yellow-400 border-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.5)]"
              : "border-white/20 text-white"
          }`}
        >
          {isComplete ? "ALL PAIRS CLEARED" : "MEMORY ENGAGED"}
        </div>

        <button
          onClick={resetGame}
          className="w-full py-5 bg-white text-black font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-cyan-400 transition-all active:scale-95"
        >
          <RotateCcw size={16} /> RESTART
        </button>
      </div>
    </div>
  );
};

export default MemoryMatch;
