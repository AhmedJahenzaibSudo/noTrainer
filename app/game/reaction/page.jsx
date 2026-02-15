"use client";

import React, { useState, useEffect, useRef } from 'react';

const ReactionGame = () => {
  const [state, setState] = useState('idle'); // idle, waiting, go, result, early
  const [time, setTime] = useState(0);
  const [best, setBest] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  
  const timer = useRef(null);
  const start = useRef(0);

  // Load best time
  useEffect(() => {
    const saved = localStorage.getItem('reflex_best');
    if (saved) setBest(parseInt(saved));
  }, []);

  const startTest = () => {
    setState('waiting');
    const delay = Math.random() * 3000 + 1500; 

    timer.current = setTimeout(() => {
      setPos({ 
        x: Math.random() * 60 + 20, 
        y: Math.random() * 60 + 20 
      });
      setState('go');
      start.current = Date.now();
    }, delay);
  };

  const handleHit = (e) => {
    e.stopPropagation();
    if (state !== 'go') return;

    const diff = Date.now() - start.current;
    setTime(diff);
    setState('result');

    if (!best || diff < best) {
      setBest(diff);
      localStorage.setItem('reflex_best', diff.toString());
    }
  };

  const handleMiss = () => {
    if (state === 'waiting') {
      clearTimeout(timer.current);
      setState('early');
    }
  };

  const getRank = (ms) => {
    if (ms < 200) return { txt: "Fastest", col: "text-cyan-400" };
    if (ms < 250) return { txt: "Great", col: "text-blue-400" };
    return { txt: "Good", col: "text-neutral-500" };
  };

  return (
    <div 
      onClick={handleMiss}
      className="w-full bg-[#020205] text-white flex flex-col overflow-hidden font-sans select-none relative transition-colors duration-300" 
      style={{ height: '93.5vh' }}
    >
      
      {/* Top Header */}
      <div className="p-6 flex justify-between items-center border-b border-white/5 bg-white/[0.02] backdrop-blur-md z-20">
        <div>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Best Time</p>
          <p className="text-2xl font-black">{best || '--'}<span className="text-xs ml-1 font-normal opacity-40">ms</span></p>
        </div>
        <h1 className="text-xl font-black tracking-tighter text-white uppercase">Reflex Pro</h1>
        <button onClick={() => setState('idle')} className="text-[10px] text-neutral-500 hover:text-white uppercase font-bold tracking-widest">Reset</button>
      </div>

      {/* Main Game Screen */}
      <div className="flex-grow relative overflow-hidden flex items-center justify-center">
        
        {/* Target (Kept circle for gameplay feel) */}
        {state === 'go' && (
          <div
            onClick={handleHit}
            style={{ top: `${pos.y}%`, left: `${pos.x}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-crosshair z-30"
          >
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-60" />
              <div className="w-16 h-16 border-4 border-white rounded-full flex items-center justify-center bg-blue-600 shadow-[0_0_40px_rgba(59,130,246,0.8)]">
                <p className="font-black text-xs relative z-10 uppercase">Hit</p>
              </div>
            </div>
          </div>
        )}

        {/* Waiting State */}
        {state === 'waiting' && (
          <div className="text-center">
            <p className="text-red-500 font-black tracking-[0.5em] text-sm animate-pulse uppercase">Wait for it...</p>
            <div className="mt-4 w-40 h-1 bg-white/5 mx-auto rounded-none overflow-hidden">
               <div className="h-full bg-red-600 animate-loading-bar" />
            </div>
          </div>
        )}

        {/* Overlays (Sharp corners) */}
        {(state === 'idle' || state === 'result' || state === 'early') && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl">
            
            {state === 'result' && (
              <div className="text-center mb-10">
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.4em] mb-2">Your Time</p>
                <h2 className={`text-9xl font-black leading-none mb-4 ${getRank(time).col}`}>{time}ms</h2>
                <p className="text-neutral-500 uppercase text-xs font-bold tracking-widest">Rank: {getRank(time).txt}</p>
              </div>
            )}

            {state === 'early' && (
              <div className="text-center mb-10 text-orange-500">
                <h2 className="text-5xl font-black tracking-tighter uppercase">Too Fast!</h2>
                <p className="text-xs font-bold tracking-widest opacity-60 mt-2 text-white uppercase">Wait for the circle to appear</p>
              </div>
            )}

            {state === 'idle' && (
              <div className="text-center mb-10">
                <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-tight">Reflex Test</h2>
                <p className="text-neutral-600 text-[10px] font-bold tracking-[0.4em] mt-2 uppercase">Test your speed</p>
              </div>
            )}

            {/* Ready Button - Sharp edges */}
            <button 
              onClick={(e) => { e.stopPropagation(); startTest(); }}
              className="px-20 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.4em] rounded-none transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(59,130,246,0.3)]"
            >
              Ready
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar { animation: loading-bar 1.5s infinite linear; }
      `}</style>
    </div>
  );
};

export default ReactionGame;