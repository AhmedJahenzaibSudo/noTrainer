"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Dumbbell,
  LayoutDashboard,
  Calculator,
  MessageSquare,
  Target,
  Info,
  MapPin,
  Package,
  ChevronRight,
  Activity,
  Check,
} from "lucide-react";

import FrontView from "@/components/anatomy/FrontView";
import { TextRotate } from "@/components/text-rotate";

// ============================================
// 🎨 NEW COLOR SCHEME - CYAN/BLUE THEME
// ============================================
const theme = {
  primary: {
    main: "#06b6d4",      // Cyan 500
    light: "#22d3ee",     // Cyan 400
    dark: "#0891b2",      // Cyan 600
    glow: "rgba(6, 182, 212, 0.5)",
  },
  secondary: {
    main: "#3b82f6",      // Blue 500
    light: "#60a5fa",     // Blue 400
    dark: "#2563eb",      // Blue 600
    glow: "rgba(59, 130, 246, 0.5)",
  },
  accent: {
    success: "#10b981",   // Emerald 500
    orange: "#f97316",    // Orange 500
    purple: "#a855f7",    // Purple 500
  },
  bg: {
    primary: "#000000",
    card: "#0f172a",      // Slate 900
    cardLight: "#1e293b", // Slate 800
    darkBlue: "#0c4a6e",  // Sky 900
  },
  text: {
    primary: "#ffffff",
    secondary: "#94a3b8",  // Slate 400
  },
  border: {
    default: "rgba(6, 182, 212, 0.2)",
  },
};

const Hero = () => {
  const [glitchIds, setGlitchIds] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [highlightedMuscle, setHighlightedMuscle] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [selectedExcuseId, setSelectedExcuseId] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const problems = [
    {
      id: 1,
      text: "No gym access",
      solution: "Train anywhere with bodyweight workouts and home equipment routines designed for maximum results.",
      icon: <MapPin size={22} />,
      color: theme.accent.orange,
    },
    {
      id: 2,
      text: "Too expensive",
      solution: "Free workout plans, progress tracking, and nutrition calculators - everything you need at zero cost.",
      icon: <Calculator size={22} />,
      color: theme.primary.main,
    },
    {
      id: 3,
      text: "Don't know how",
      solution: "Step-by-step exercise guides with photos, videos, and form tips for proper technique every time.",
      icon: <Info size={22} />,
      color: theme.secondary.main,
    },
    {
      id: 4,
      text: "Need privacy",
      solution: "AI trainer available 24/7 with no judgment or awkwardness - train on your own terms in your own space.",
      icon: <MessageSquare size={22} />,
      color: theme.accent.success,
    },
    {
      id: 5,
      text: "Lack of knowledge",
      solution: "500+ exercises with difficulty levels, muscle targeting, and detailed instructions to educate and empower you.",
      icon: <Dumbbell size={22} />,
      color: theme.accent.purple,
    },
    {
      id: 6,
      text: "Can't go out",
      solution: "Effective home workouts designed for any space - bedroom, living room, or backyard.",
      icon: <Zap size={22} />,
      color: theme.accent.orange,
    },
    {
      id: 7,
      text: "Need structure",
      solution: "Organized workout plans with progress tracking, goals, and accountability to keep you on track.",
      icon: <LayoutDashboard size={22} />,
      color: theme.primary.main,
    },
    {
      id: 8,
      text: "No motivation",
      solution: "Daily challenges, streaks, and achievement rewards that make fitness fun and keep you coming back.",
      icon: <Target size={22} />,
      color: theme.secondary.main,
    },
    {
      id: 9,
      text: "No equipment",
      solution: "Build strength with proven bodyweight training programs that require nothing but your commitment.",
      icon: <Package size={22} />,
      color: theme.accent.success,
    },
  ];

  const selectedProblem = useMemo(
    () => problems.find((p) => p.id === selectedExcuseId) || problems[0],
    [selectedExcuseId]
  );

  const muscleIds = useMemo(
    () => ["face", "traps", "shoulders", "chest", "neck", "biceps", "forearms", "lats", "abdominals", "quadriceps", "calves", "triceps", "hands"],
    []
  );

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      const count = Math.floor(Math.random() * 2) + 1;
      const shuffled = [...muscleIds].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);
      setGlitchIds(selected);
      setTimeout(() => setGlitchIds([]), 80);
    }, 400);
    return () => clearInterval(interval);
  }, [mounted, muscleIds]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const glitchStyles = useMemo(() => {
    if (!glitchIds.length) return "";
    return glitchIds
      .map(
        (id) => `
        #${id.replace(/\s+/g, "\\ ")} {
          fill: ${theme.accent.success} !important;
          filter: drop-shadow(0 0 12px ${theme.accent.success});
          opacity: 1 !important;
        }
      `
      )
      .join("");
  }, [glitchIds]);

  if (!mounted) return null;

  return (
    <section
      className="min-h-screen text-white overflow-hidden relative"
      style={{ backgroundColor: theme.bg.primary, fontFamily: "'Inter', sans-serif" }}
    >
      {/* Ambient Background Glow */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse at top, ${theme.primary.glow}, transparent 60%)`,
        }}
      />

      <style>{glitchStyles}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16">
        
        {/* 1. METALLIC GLOWING BRAND NAME */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1
            className="text-8xl md:text-9xl lg:text-[12rem] font-black tracking-tight leading-none"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: `linear-gradient(180deg, ${theme.text.primary} 0%, ${theme.primary.light} 50%, ${theme.secondary.light} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: `drop-shadow(0 0 40px ${theme.primary.glow}) drop-shadow(0 0 80px ${theme.secondary.glow})`,
            }}
          >
            noTrainer
          </h1>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1 mx-auto mt-6 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${theme.primary.main}, ${theme.secondary.main})`,
              boxShadow: `0 0 20px ${theme.primary.glow}, 0 0 40px ${theme.secondary.glow}`,
            }}
          />
        </motion.div>

        {/* 2. CLEAN ELITE BLUE TEXT ROTATION */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  className="max-w-5xl mx-auto mb-20 px-6"
>
  <div
    className="relative rounded-3xl px-6 py-16 text-center border border-white/5"
    style={{ backgroundColor: "#174cbf7c" }}
  >
    <div className="flex flex-col items-center justify-center">
      
      {/* Problem → Solution Indicator */}
      <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-500 mb-6">
        The Platform
      </span>

      {/* SINGLE LINE CENTERING CONTAINER */}
      <div className="w-full flex justify-center items-center overflow-hidden">
        <div className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white whitespace-nowrap">
          <TextRotate
            texts={["Home Gym", "Workout Guide", "AI Trainer", "AI Help", "Fitness Hub"]}
            className="text-white"
            mainClassName="flex justify-center w-full"
            staggerDuration={0.02}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2500}
            style={{ 
              fontFamily: "sans-serif",
              display: "inline-flex"
            }}
          />
        </div>
      </div>
      
      {/* Clean Subtext */}
      <p className="mt-8 text-sm md:text-base font-bold tracking-wider text-slate-400">
        Your complete fitness platform <span className="text-cyan-500">powered by AI</span>
      </p>
    </div>
  </div>
</motion.div>

        {/* 3. BRIGHTER SVG ANATOMY VIEWER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-lg mx-auto mb-24"
        >
          <div className="text-center mb-8">
            <h2
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Target Every Muscle
            </h2>
            <p style={{ color: theme.text.secondary }}>
              Interactive 3D muscle mapping
            </p>
          </div>

          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative h-[600px] rounded-3xl flex items-center justify-center overflow-hidden group"
            style={{
              backgroundColor: theme.bg.cardLight,
              boxShadow: `0 0 60px ${theme.primary.glow}`,
            }}
          >
            {/* Futuristic Corner Accents */}
            <div className="absolute top-0 left-0 w-20 h-20 opacity-60">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <path d="M0 0 L80 0 L80 3 L3 3 L3 80 L0 80 Z" fill={theme.primary.main} />
              </svg>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 opacity-60">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <path d="M80 0 L0 0 L0 3 L77 3 L77 80 L80 80 Z" fill={theme.primary.main} />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-20 h-20 opacity-60">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <path d="M0 80 L0 0 L3 0 L3 77 L80 77 L80 80 Z" fill={theme.secondary.main} />
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 w-20 h-20 opacity-60">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <path d="M80 80 L80 0 L77 0 L77 77 L0 77 L0 80 Z" fill={theme.secondary.main} />
              </svg>
            </div>

            {/* Holographic Scan Lines */}
            <motion.div
              animate={{ top: ["-5%", "105%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[2px] z-20 pointer-events-none"
              style={{
                background: `linear-gradient(90deg, transparent, ${theme.accent.success}, transparent)`,
                boxShadow: `0 0 30px ${theme.accent.success}`,
              }}
            />

            {/* Status HUD */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-30 pointer-events-none">
              <Activity
                size={16}
                style={{ color: theme.accent.success }}
                className="animate-pulse"
              />
              <span
                className="text-xs uppercase tracking-wider font-semibold"
                style={{ color: theme.accent.success }}
              >
                Scanning
              </span>
            </div>

            {/* Muscle Label Tooltip */}
            <AnimatePresence>
              {highlightedMuscle && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: mousePos.x - 60,
                    y: mousePos.y - 50,
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="absolute top-0 left-0 z-50 pointer-events-none px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: theme.primary.main,
                    boxShadow: `0 0 20px ${theme.primary.glow}`,
                  }}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    {highlightedMuscle}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 3D Anatomy Model */}
            <div className="relative w-full h-full flex items-center justify-center p-16 z-10 pointer-events-none">
              <div className="w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-110 pointer-events-auto">
                <FrontView
                  onHover={setHighlightedMuscle}
                  onLeave={() => setHighlightedMuscle(null)}
                  onSelect={setSelectedMuscle}
                  selectedMuscle={selectedMuscle}
                  highlightedMuscle={highlightedMuscle}
                  className="max-h-full w-auto opacity-90 object-contain"
                  style={{ 
                    filter: `drop-shadow(0 0 20px ${theme.primary.glow})`,
                    overflow: 'visible'
                  }}
                />
              </div>
            </div>

            {/* Holographic Grid Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(0deg, transparent 49%, ${theme.primary.main} 50%, transparent 51%),
                  linear-gradient(90deg, transparent 49%, ${theme.primary.main} 50%, transparent 51%)
                `,
                backgroundSize: "40px 40px",
              }}
            />
          </div>
        </motion.div>

        {/* 4. IMPROVED PROBLEM → SOLUTION SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2
              className="text-5xl md:text-6xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Your Problem{" "}
              <span style={{ color: theme.primary.main }}>→</span>{" "}
              Our Solution
            </h2>
            <p className="text-xl" style={{ color: theme.text.secondary }}>
              Select your challenge and see how we solve it
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* PROBLEMS GRID - SOLID BACKGROUNDS */}
            <div
              className="rounded-2xl overflow-hidden p-6"
              style={{
                backgroundColor: theme.bg.card,
              }}
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b"
                style={{ borderColor: theme.border.default }}
              >
                <h3 className="text-lg font-bold uppercase tracking-wide" style={{ color: theme.primary.main }}>
                  Common Problems
                </h3>
                <span className="text-sm" style={{ color: theme.text.secondary }}>
                  {problems.length} issues
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {problems.map((problem) => {
                  const active = problem.id === selectedExcuseId;
                  return (
                    <motion.button
                      key={problem.id}
                      onClick={() => setSelectedExcuseId(problem.id)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="rounded-xl p-4 min-h-[120px] flex flex-col justify-between text-left transition-all"
                      style={{
                        backgroundColor: active ? problem.color : theme.bg.cardLight,
                        color: theme.text.primary,
                        boxShadow: active ? `0 8px 24px ${problem.color}40` : 'none',
                      }}
                    >
                      <div
                        className="w-fit p-2.5 rounded-lg mb-3"
                        style={{
                          backgroundColor: active ? 'rgba(255, 255, 255, 0.2)' : `${problem.color}20`,
                          color: active ? theme.text.primary : problem.color,
                        }}
                      >
                        {problem.icon}
                      </div>
                      <p className="text-xs font-bold uppercase tracking-wide leading-tight">
                        {problem.text}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* SOLUTION PANEL - BETTER DESIGN */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.bg.card,
              }}
            >
              <div 
                className="px-6 py-4 flex items-center justify-between"
                style={{ 
                  backgroundColor: selectedProblem.color,
                }}
              >
                <h3 className="text-lg font-bold uppercase tracking-wide text-white">
                  Solution
                </h3>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-white">
                    Available
                  </span>
                </div>
              </div>

              <div className="p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedProblem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Icon Header */}
                    <div className="flex items-center gap-4">
                      <div
                        className="p-4 rounded-2xl"
                        style={{
                          backgroundColor: selectedProblem.color,
                          boxShadow: `0 8px 24px ${selectedProblem.color}40`,
                        }}
                      >
                        <div style={{ color: theme.text.primary }}>
                          {selectedProblem.icon}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider font-bold mb-1" style={{ color: theme.text.secondary }}>
                          Problem
                        </p>
                        <h3 className="text-2xl font-bold" style={{ color: theme.text.primary }}>
                          {selectedProblem.text}
                        </h3>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1" style={{ backgroundColor: selectedProblem.color }} />
                      <span className="text-xs uppercase tracking-wider font-bold" style={{ color: selectedProblem.color }}>
                        How we solve it
                      </span>
                      <div className="h-px flex-1" style={{ backgroundColor: selectedProblem.color }} />
                    </div>

                    {/* Solution Text */}
                    <p className="text-lg leading-relaxed" style={{ color: theme.text.secondary }}>
                      {selectedProblem.solution}
                    </p>

                    {/* CTA Button */}
                    <button
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold uppercase text-sm transition-all hover:scale-105"
                      style={{
                        backgroundColor: selectedProblem.color,
                        color: theme.text.primary,
                        boxShadow: `0 4px 20px ${selectedProblem.color}60`,
                      }}
                    >
                      Start Now
                      <ChevronRight size={18} />
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;