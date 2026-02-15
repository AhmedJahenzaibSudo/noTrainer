"use client";

import React, { useState, useEffect, useCallback } from 'react';

const RecallGame = () => {
  const [sequence, setSequence] = useState([]); 
  const [userSequence, setUserSequence] = useState([]); 
  const [isDisplaying, setIsDisplaying] = useState(false); 
  const [activeTile, setActiveTile] = useState(null); 
  const [level, setLevel] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState('idle'); // idle, playing, failed

  // Grid size grows at level 5
  const gridSize = level > 5 ? 4 : 3;
  const tiles = Array.from({ length: gridSize * gridSize }, (_, i) => i);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('recallBestSimple');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Start next round
  const startNextLevel = useCallback((currentSeq = []) => {
    setIsDisplaying(true);
    const nextTile = Math.floor(Math.random() * (gridSize * gridSize));
    const newSeq = [...currentSeq, nextTile];
    setSequence(newSeq);
    setUserSequence([]);
    
    playSequence(newSeq);
  }, [gridSize]);

  const playSequence = async (seq) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 600)); 
      setActiveTile(seq[i]);
      await new Promise(r => setTimeout(r, 400)); 
      setActiveTile(null);
    }
    setIsDisplaying(false);
  };

  const handleTileClick = (tileId) => {
    if (isDisplaying || gameState !== 'playing') return;

    const correctTile = sequence[userSequence.length];
    
    if (tileId === correctTile) {
      const newUserSeq = [...userSequence, tileId];
      setUserSequence(newUserSeq);

      if (newUserSeq.length === sequence.length) {
        setLevel(prev => prev + 1);
        setTimeout(() => startNextLevel(sequence), 1000);
      }
    } else {
      setGameState('failed');
      if (level > highScore) {
        setHighScore(level);
        localStorage.setItem('recallBestSimple', level.toString());
      }
    }
  };

  const startGame = () => {
    setLevel(1);
    setGameState('playing');
    startNextLevel([]);
  };

  return (
    <div className="w-full bg-[#050505] text-white flex flex-col font-sans select-none" style={{ height: '93.5vh' }}>
      
      {/* Top Bar */}
      <div className="p-6 flex justify-between items-center border-b border-white/5 bg-white/[0.02]">
        <div>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Level</p>
          <p className="text-3xl font-black">{level}</p>
        </div>
        <div className="text-center">
          <h1 className="text-xl font-black text-white uppercase tracking-tighter">Recall Game</h1>
          <button onClick={() => setGameState('idle')} className="text-[10px] text-neutral-500 hover:text-white uppercase font-bold tracking-widest">Reset</button>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Best</p>
          <p className="text-3xl font-black">{highScore}</p>
        </div>
      </div>

      {/* Play Area */}
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        
        {/* Progress indicators (Square dots) */}
        <div className="flex gap-2 mb-8">
          {sequence.map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-none border border-blue-500/30 ${i < userSequence.length ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-transparent'}`} />
          ))}
        </div>

        {/* Grid (Sharp edges) */}
        <div 
          className="grid gap-3 p-4 bg-neutral-900/50 rounded-none border border-white/10 shadow-2xl"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            width: 'min(90vw, 350px)'
          }}
        >
          {tiles.map((tile) => (
            <button
              key={tile}
              onClick={() => handleTileClick(tile)}
              disabled={isDisplaying || gameState !== 'playing'}
              className={`aspect-square rounded-none transition-all duration-200
                ${activeTile === tile 
                  ? 'bg-blue-500 shadow-[0_0_30px_#3b82f6] scale-95' 
                  : 'bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600'}
                ${gameState === 'failed' && sequence[userSequence.length] === tile ? 'bg-red-500 animate-pulse' : ''}
              `}
            />
          ))}
        </div>

        {/* Overlay with Ready Button (Sharp edges) */}
        {gameState !== 'playing' && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl">
            {gameState === 'failed' && (
              <div className="text-center mb-10">
                <p className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-2">Final Score</p>
                <h2 className="text-9xl font-black">{level}</h2>
                <p className="text-neutral-500 text-sm mt-4">Nice try! Want to try again?</p>
              </div>
            )}
            
            {gameState === 'idle' && (
              <div className="text-center mb-10">
                <h2 className="text-5xl font-black tracking-tighter uppercase">Memory Test</h2>
                <p className="text-neutral-500 text-[10px] tracking-widest uppercase mt-2 font-bold">Watch and repeat the pattern</p>
              </div>
            )}
            
            <button 
              onClick={startGame}
              className="px-20 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.4em] rounded-none transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(59,130,246,0.3)]"
            >
              Ready
            </button>
          </div>
        )}
      </div>

      {/* Footer Instructions */}
      <div className="p-6 text-center">
        <p className={`text-xs font-bold tracking-widest uppercase transition-colors ${isDisplaying ? 'text-blue-500 animate-pulse' : 'text-neutral-600'}`}>
          {isDisplaying ? 'Watch the Pattern...' : 'Your Turn!'}
        </p>
      </div>
    </div>
  );
};

export default RecallGame;