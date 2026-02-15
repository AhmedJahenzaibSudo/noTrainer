"use client";

import React, { useState, useEffect } from 'react';

const ZenFlow = () => {
  const [phase, setPhase] = useState('Inhale'); 
  const [timer, setTimer] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [holdDuration, setHoldDuration] = useState(30); 

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (phase === 'Inhale') {
              setPhase('Hold');
              return holdDuration; 
            } else if (phase === 'Hold') {
              setPhase('Exhale');
              return 6; 
            } else {
              // Exhale finished -> Reset to Ready screen
              setIsActive(false);
              setPhase('Inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [phase, isActive, holdDuration]);

  const formatDisplayTime = (seconds) => {
    if (seconds <= 0) return "0";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs < 10 ? '0' : ''}${secs}` : seconds;
  };

  return (
    <div className="w-full bg-[#02040a] flex flex-col items-center justify-center overflow-hidden font-sans select-none relative" style={{ height: '93.5vh' }}>
      
      {/* Dynamic Background Glow */}
      <div className={`absolute transition-all duration-[3000ms] blur-[120px] rounded-full 
        ${phase === 'Inhale' ? 'bg-blue-600/20 w-96 h-96' : ''}
        ${phase === 'Hold' ? 'bg-cyan-500/20 w-[500px] h-[500px]' : ''}
        ${phase === 'Exhale' ? 'bg-blue-900/20 w-64 h-64' : ''}`} 
      />

      {!isActive ? (
        <div className="z-50 text-center p-8 bg-black/40 backdrop-blur-xl rounded-none border border-white/5 shadow-2xl w-[90%] max-w-md">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Select Level</h2>
          <p className="text-neutral-500 text-[10px] tracking-[0.3em] uppercase mb-10">Choose your hold duration</p>
          
          <div className="grid grid-cols-2 gap-4 mb-10">
            <button 
              onClick={() => setHoldDuration(30)}
              className={`py-6 rounded-none border-2 transition-all flex flex-col items-center gap-2 
                ${holdDuration === 30 ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-white/5 bg-white/5 text-neutral-500'}`}
            >
              <span className="text-sm font-black uppercase tracking-widest">Beginner</span>
              <span className="text-xl font-light opacity-60">30 Sec</span>
            </button>

            <button 
              onClick={() => setHoldDuration(90)}
              className={`py-6 rounded-none border-2 transition-all flex flex-col items-center gap-2 
                ${holdDuration === 90 ? 'bg-cyan-600/20 border-cyan-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'border-white/5 bg-white/5 text-neutral-500'}`}
            >
              <span className="text-sm font-black uppercase tracking-widest">Advanced</span>
              <span className="text-xl font-light opacity-60">1.5 Min</span>
            </button>
          </div>

          <button 
            onClick={() => setIsActive(true)}
            className="w-full py-5 bg-blue-600 text-white rounded-none font-black uppercase tracking-[0.5em] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(59,130,246,0.3)]"
          >
            Ready
          </button>
        </div>
      ) : (
        <div className="z-10 text-center">
          <div className="relative flex items-center justify-center">
            <div className={`rounded-full flex items-center justify-center transition-all ease-in-out backdrop-blur-md border border-white/10 shadow-2xl
                ${phase === 'Inhale' ? 'w-72 h-72 bg-blue-500/10 scale-110 duration-[4000ms]' : ''}
                ${phase === 'Hold' ? 'w-80 h-80 bg-cyan-400/20 scale-125 shadow-[0_0_100px_rgba(34,211,238,0.3)] duration-[1000ms]' : ''}
                ${phase === 'Exhale' ? 'w-56 h-56 bg-blue-900/30 scale-100 duration-[6000ms]' : ''}
              `}
            >
              <div className="text-center">
                <h2 className={`font-black tracking-widest text-white uppercase transition-all
                  ${phase === 'Hold' ? 'text-6xl' : 'text-4xl'}`}>
                  {phase}
                </h2>
                <div className="mt-4 text-3xl font-mono font-light text-blue-400 opacity-80">
                  {formatDisplayTime(timer)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20">
             <p className="text-neutral-500 text-[10px] tracking-[0.5em] uppercase font-bold animate-pulse">
               {phase === 'Inhale' && "Deep Breath In"}
               {phase === 'Hold' && "Keep Still"}
               {phase === 'Exhale' && "Slow Release"}
             </p>
          </div>
        </div>
      )}

      {/* Manual Finish Button (Just in case) */}
      <button 
        onClick={() => setIsActive(false)} 
        className="absolute bottom-10 px-8 py-2 rounded-none border border-white/5 text-[9px] font-black tracking-[0.4em] uppercase text-neutral-600 hover:text-white hover:bg-white/5 transition-all"
      >
        Exit Session
      </button>
    </div>
  );
};

export default ZenFlow;