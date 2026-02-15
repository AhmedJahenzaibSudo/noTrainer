"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';

const FocusGame = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ top: '50%', left: '50%' });
  const [combo, setCombo] = useState(0);
  const [stats, setStats] = useState({ totalClicks: 0, hits: 0 });
  const arenaRef = useRef(null);

  const level = Math.floor(score / 100) + 1;
  // Size starts at 50px and reduces by 4px per level, minimum 20px
  const targetSize = Math.max(20, 50 - (level * 4));

  useEffect(() => {
    const saved = localStorage.getItem('focusHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const moveTarget = useCallback(() => {
    const top = Math.floor(Math.random() * 70) + 15;
    const left = Math.floor(Math.random() * 80) + 10;
    setPosition({ top: `${top}%`, left: `${left}%` });
  }, []);

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('focusHighScore', score.toString());
      }
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, score, highScore]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(20);
    setCombo(0);
    setStats({ totalClicks: 0, hits: 0 });
    setIsActive(true);
    moveTarget();
  };

  const handleArenaClick = () => {
    if (!isActive) return;
    setStats(prev => ({ ...prev, totalClicks: prev.totalClicks + 1 }));
    setCombo(0); 
    if (arenaRef.current) {
      arenaRef.current.style.borderColor = 'rgba(239, 68, 68, 0.5)';
      setTimeout(() => arenaRef.current.style.borderColor = 'rgba(255, 255, 255, 0.1)', 200);
    }
  };

  const handleTargetClick = (e) => {
    e.stopPropagation();
    if (!isActive) return;

    const newCombo = combo + 1;
    const bonus = Math.floor(newCombo / 5) * 5;
    const points = 10 + bonus;
    
    setScore(prev => prev + points);
    setCombo(newCombo);
    setStats(prev => ({ ...prev, totalClicks: prev.totalClicks + 1, hits: prev.hits + 1 }));
    moveTarget();
  };

  const accuracy = stats.totalClicks > 0 ? Math.round((stats.hits / stats.totalClicks) * 100) : 0;

  return (
    <div className="w-full bg-[#020205] text-white flex flex-col overflow-hidden font-sans select-none" style={{ height: '93.5vh' }}>
      
      {/* 1. TOP HEADER */}
      <div className="flex-none p-6 flex justify-between items-center border-b border-white/5 bg-white/[0.02] backdrop-blur-2xl">
        <div className="w-32">
          <p className="text-[10px] tracking-[0.3em] text-blue-500 font-black uppercase">Accuracy</p>
          <p className="text-2xl font-black">{accuracy}%</p>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-black tracking-tighter uppercase text-white">Focus Strike</h1>
          <div className="flex justify-center gap-1 mt-1">
              {[...Array(3)].map((_, i) => (
               <div key={i} className={`h-1 w-4 rounded-none ${level > i ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-white/10'}`} />
              ))}
          </div>
        </div>

        <div className="w-32 text-right">
          <p className="text-[10px] tracking-[0.3em] text-blue-500 font-black uppercase">Combo</p>
          <p className="text-2xl font-black text-cyan-400">x{combo}</p>
        </div>
      </div>

      {/* 2. STATS BAR */}
      <div className="flex-none grid grid-cols-3 py-6 px-12 bg-white/[0.01]">
         <div className="text-center">
            <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Points</p>
            <p className="text-4xl font-black text-white">{score}</p>
         </div>
         <div className="text-center border-x border-white/5">
            <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Remaining</p>
            <p className={`text-4xl font-black transition-colors ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}>
               {timeLeft}s
            </p>
         </div>
         <div className="text-center">
            <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Best</p>
            <p className="text-4xl font-black text-neutral-600">{highScore}</p>
         </div>
      </div>

      {/* 3. PLAY ARENA */}
      <div 
        ref={arenaRef}
        onClick={handleArenaClick}
        className="flex-grow relative mx-6 mb-6 rounded-none border border-white/10 bg-[#050508] overflow-hidden transition-colors duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-transparent pointer-events-none" />

        {!isActive && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
            {timeLeft === 0 ? (
                <div className="text-center mb-12">
                    <p className="text-blue-500 font-black tracking-[0.5em] uppercase text-xs mb-2">Results</p>
                    <h2 className="text-9xl font-black text-white tracking-tighter mb-4">{score}</h2>
                    <div className="h-px w-24 bg-white/10 mx-auto mb-4" />
                    <p className="text-neutral-400 text-sm font-medium tracking-wide">Accuracy: {accuracy}% • Hits: {stats.hits}</p>
                </div>
            ) : (
                <div className="text-center mb-12">
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Ready?</h2>
                    <p className="text-neutral-500 text-[10px] tracking-[0.4em] uppercase mt-2 font-bold">Improve your focus</p>
                </div>
            )}
            
            <button 
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="group relative px-20 py-5 overflow-hidden rounded-none bg-blue-600 transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
            >
              <span className="relative z-10 text-white font-black uppercase tracking-[0.5em]">Ready</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        )}

        {/* Small Circle Target */}
        {isActive && (
          <button
            onClick={handleTargetClick}
            className="absolute flex items-center justify-center transition-transform active:scale-75 duration-75"
            style={{ 
              top: position.top, 
              left: position.left,
              width: `${targetSize}px`,
              height: `${targetSize}px`,
              transform: 'translate(-50%, -50%)' 
            }}
          >
            <div className="absolute inset-0 border-2 border-blue-500 rounded-full animate-ping opacity-40"></div>
            <div className="relative w-full h-full bg-white rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] flex items-center justify-center p-[20%]">
                <div className="w-full h-full bg-blue-600 rounded-full"></div>
            </div>
            
            {combo > 1 && (
                <span className="absolute -top-8 text-blue-400 font-black text-sm whitespace-nowrap animate-bounce">
                    +{10 + Math.floor(combo/5)*5}
                </span>
            )}
          </button>
        )}
      </div>

      <footer className="flex-none pb-6 text-center opacity-20">
          <p className="text-[9px] font-bold uppercase tracking-[0.5em]">Training Active</p>
      </footer>

    </div>
  );
};

export default FocusGame;