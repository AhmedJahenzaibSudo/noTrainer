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
  Activity,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import FrontView from "@/components/anatomy/FrontView";
import { TextRotate } from "@/components/text-rotate";

// ============================================
// THEME
// ============================================
const theme = {
  primary: {
    main: "#06b6d4",
    light: "#22d3ee",
    dark: "#0891b2",
    glow: "rgba(6, 182, 212, 0.5)",
  },
  secondary: {
    main: "#3b82f6",
    light: "#60a5fa",
    dark: "#2563eb",
    glow: "rgba(59, 130, 246, 0.5)",
  },
  accent: {
    success: "#10b981",
    orange: "#f97316",
    purple: "#a855f7",
  },
  bg: {
    primary: "#000000",
    card: "#0f172a",
    cardLight: "#1e293b",
  },
  text: {
    primary: "#ffffff",
    secondary: "#94a3b8",
  },
  border: {
    default: "rgba(6, 182, 212, 0.2)",
  },
};

const Hero = () => {
  // ======================
  // STATE
  // ======================
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  const [glitchIds, setGlitchIds] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [highlightedMuscle, setHighlightedMuscle] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [selectedExcuseId, setSelectedExcuseId] = useState(1);

  // ======================
  // REFS
  // ======================
  const scrollContainerRef = useRef(null);
  const anatomyBoxRef = useRef(null);

  // ======================
  // LOCK BODY SCROLL (remove extra scrollbar)
  // ======================
  useEffect(() => {
    setMounted(true);

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  // ======================
  // SECTIONS (for indicators + labels + bg animation)
  // ======================
  const sections = useMemo(
    () => [
      { key: "home", label: "Home", color: theme.primary.main },
      { key: "value", label: "Value", color: theme.secondary.main },
      { key: "anatomy", label: "Anatomy", color: theme.accent.success },
      { key: "solutions", label: "Solutions", color: theme.primary.light },
    ],
    [],
  );

  // ======================
  // BACKGROUND ANIMATION PER SECTION
  // ======================
  const bgColor = sections[activeSection]?.color ?? theme.primary.main;

  // ======================
  // SCROLL HANDLER (update active indicator)
  // ======================
  const handleScroll = (e) => {
    const scrollTop = e.currentTarget.scrollTop;
    const height = e.currentTarget.clientHeight;
    const index = Math.round(scrollTop / height);
    if (index !== activeSection) setActiveSection(index);
  };

  const scrollToSection = (index) => {
    if (!scrollContainerRef.current) return;
    if (index < 0 || index >= sections.length) return;

    // FIX: Use container height instead of window height for consistency
    const containerHeight = scrollContainerRef.current.clientHeight;

    scrollContainerRef.current.scrollTo({
      top: index * containerHeight,
      behavior: "smooth",
    });
  };

  // ======================
  // PROBLEMS (full original info)
  // ======================
  const problems = useMemo(
    () => [
      {
        id: 1,
        text: "No gym access",
        solution:
          "Train anywhere with bodyweight workouts and home equipment routines designed for maximum results.",
        icon: <MapPin size={22} />,
        color: theme.accent.orange,
      },
      {
        id: 2,
        text: "Too expensive",
        solution:
          "Free workout plans, progress tracking, and nutrition calculators - everything you need at zero cost.",
        icon: <Calculator size={22} />,
        color: theme.primary.main,
      },
      {
        id: 3,
        text: "Don't know how",
        solution:
          "Step-by-step exercise guides with photos, videos, and form tips for proper technique every time.",
        icon: <Info size={22} />,
        color: theme.secondary.main,
      },
      {
        id: 4,
        text: "Need privacy",
        solution:
          "AI trainer available 24/7 with no judgment or awkwardness - train on your own terms in your own space.",
        icon: <MessageSquare size={22} />,
        color: theme.accent.success,
      },
      {
        id: 5,
        text: "Lack of knowledge",
        solution:
          "500+ exercises with difficulty levels, muscle targeting, and detailed instructions to educate and empower you.",
        icon: <Dumbbell size={22} />,
        color: theme.accent.purple,
      },
      {
        id: 6,
        text: "Can't go out",
        solution:
          "Effective home workouts designed for any space - bedroom, living room, or backyard.",
        icon: <Zap size={22} />,
        color: theme.accent.orange,
      },
      {
        id: 7,
        text: "Need structure",
        solution:
          "Organized workout plans with progress tracking, goals, and accountability to keep you on track.",
        icon: <LayoutDashboard size={22} />,
        color: theme.primary.main,
      },
      {
        id: 8,
        text: "No motivation",
        solution:
          "Daily challenges, streaks, and achievement rewards that make fitness fun and keep you coming back.",
        icon: <Target size={22} />,
        color: theme.secondary.main,
      },
      {
        id: 9,
        text: "No equipment",
        solution:
          "Build strength with proven bodyweight training programs that require nothing but your commitment.",
        icon: <Package size={22} />,
        color: theme.accent.success,
      },
    ],
    [],
  );

  const selectedProblem = useMemo(
    () => problems.find((p) => p.id === selectedExcuseId) || problems[0],
    [problems, selectedExcuseId],
  );

  // ======================
  // GLITCH HIGHLIGHTS (full original behavior)
  // ======================
  const muscleIds = useMemo(
    () => [
      "face",
      "traps",
      "shoulders",
      "chest",
      "neck",
      "biceps",
      "forearms",
      "lats",
      "abdominals",
      "quadriceps",
      "calves",
      "triceps",
      "hands",
    ],
    [],
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
      `,
      )
      .join("");
  }, [glitchIds]);

  // ======================
  // ANATOMY TOOLTIP POSITION
  // ======================
  const handleMouseMove = (e) => {
    if (!anatomyBoxRef.current) return;
    const rect = anatomyBoxRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  if (!mounted) return null;

  return (
    <div
      className="relative h-screen w-full overflow-hidden text-white"
      style={{
        backgroundColor: theme.bg.primary,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* PERFORMANCE FIX: Static global style injection at the top level */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <style>{glitchStyles}</style>

      {/* ======================================
          FULL PAGE COLOR TRANSITION ANIMATION
         ====================================== */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.18 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle at center, ${bgColor}, transparent 70%)`,
          }}
        />
      </AnimatePresence>

      {/* Ambient dual glow for depth */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.10]"
        style={{
          background: `radial-gradient(circle at 15% 15%, ${theme.primary.glow}, transparent 55%),
                       radial-gradient(circle at 85% 70%, ${theme.secondary.glow}, transparent 55%)`,
        }}
      />

      {/* ======================================
          SIDE NAVIGATION (UP/DOWN + DOTS)
         ====================================== */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-6">
        <button
          onClick={() => scrollToSection(activeSection - 1)}
          disabled={activeSection === 0}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Go to previous section"
        >
          <ChevronUp size={20} />
        </button>

        <div className="flex flex-col gap-3 px-2 py-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
          {sections.map((s, i) => (
            <button
              key={s.key}
              onClick={() => scrollToSection(i)}
              className="group relative flex items-center justify-center"
              aria-label={`Go to ${s.label}`}
            >
              <motion.div
                animate={{
                  scale: activeSection === i ? 1.6 : 1,
                  backgroundColor:
                    activeSection === i
                      ? theme.primary.main
                      : "rgba(255,255,255,0.28)",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-2 h-2 rounded-full"
                style={{
                  boxShadow:
                    activeSection === i
                      ? `0 0 18px ${theme.primary.glow}`
                      : "none",
                }}
              />
              <span className="absolute right-8 px-2 py-1 rounded bg-black/80 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                {s.label}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollToSection(activeSection + 1)}
          disabled={activeSection === sections.length - 1}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Go to next section"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      {/* ======================================
          MAIN SCROLL SNAP CONTAINER (single scroll)
         ====================================== */}
      <main
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative z-10 h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
      >
        {/* ======================================
            SECTION 1: BRAND (full original vibe)
           ====================================== */}
        <section className="h-screen w-full flex flex-col justify-start items-center snap-start relative px-6 overflow-hidden bg-black pt-44">
          {/* Cinematic Ambient Glows */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] rounded-full blur-[120px] opacity-30"
              style={{
                background: `radial-gradient(circle, ${theme.primary.main} 0%, transparent 70%)`,
              }}
            />
          </div>

          {/* Main Brand Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center z-10"
          >
            {/* noTrainer: Clean, Static, Bold */}
            <h1
              className="text-6xl md:text-8xl lg:text-[8rem] font-extrabold tracking-tight leading-none"
              style={{
                fontFamily: "Inter, sans-serif", // Using a cleaner, more standard tech font
                background: `linear-gradient(180deg, #ffffff 40%, ${theme.text.secondary} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              noTrainer
            </h1>

            {/* Thin, precise accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-[1px] w-32 mx-auto mt-8 bg-cyan-500 shadow-[0_0_15px_#06b6d4]"
            />
          </motion.div>

          {/* Scroll Down Hint - Simplified and High Contrast */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-28 flex flex-col items-center gap-6 z-20"
          >
            <span className="text-[12px] uppercase tracking-[0.8em] text-white font-bold drop-shadow-lg">
              Explore
            </span>

            <motion.div
              animate={{
                y: [0, 12, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ChevronDown size={32} className="text-cyan-400 stroke-[3px]" />
            </motion.div>
          </motion.div>
        </section>

        {/* ======================================
            SECTION 2: PLATFORM / TEXT ROTATE (full original info)
           ====================================== */}
        <section className="h-screen w-full flex flex-col justify-center items-center snap-start px-4 relative overflow-hidden bg-black">
          {/* High-Intensity Background Glow */}
          <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
            <div
              className="w-[800px] h-[600px] rounded-full opacity-30 blur-[150px]"
              style={{
                background: `radial-gradient(circle, ${theme.primary.main} 0%, ${theme.secondary.main} 100%)`,
              }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-5xl z-10"
          >
            {/* Dark Glass Card */}
            <div
              className="relative rounded-[3.5rem] px-4 py-24 text-center border border-white/10 overflow-hidden"
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(50px) saturate(200%)",
                boxShadow: "inset 0 0 40px rgba(255,255,255,0.02)",
              }}
            >
              <div className="flex flex-col items-center justify-center relative z-10">
                <span className="text-[12px] font-black uppercase tracking-[0.8em] text-cyan-400 mb-14 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
                  The Platform
                </span>

                {/* 3D Vertical Roll - Adjusted for Width and Visibility */}
                <div className="w-full flex justify-center items-center">
                  <div className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                    <TextRotate
                      texts={[
                        "Home Gym",
                        "Workout Guide",
                        "AI Trainer",
                        "AI Help",
                        "Fitness Hub",
                      ]}
                      // whitespace-nowrap prevents the 2-line break
                      className="whitespace-nowrap py-2"
                      mainClassName="flex flex-col items-center justify-center overflow-visible"
                      staggerDuration={0.02}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 200,
                      }}
                      rotationInterval={3000}
                    />
                  </div>
                </div>

                {/* Glowing Divider */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "160px" }}
                  className="h-[3px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-16 rounded-full shadow-[0_0_30px_#06b6d4]"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* ======================================
            SECTION 3: ANATOMY (REVERTED SVG STYLES)
           ====================================== */}
        <section className="h-screen w-full flex flex-col justify-center items-center snap-start px-6 bg-black/20">
          {/* REVERTED: Force SVG to scale via CSS injection */}
          <style>{`
    .anatomy-svg-wrapper svg {
      width: 100% !important;
      height: 100% !important;
      max-height: 100%;
    }
  `}</style>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.7 }}
            className="max-w-6xl w-full grid md:grid-cols-2 gap-10 md:gap-12 items-center"
          >
            <div className="flex flex-col justify-center">
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Target Every Muscle
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                Interactive muscle mapping
              </p>

              {selectedMuscle ? (
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-6">
                  <div className="text-[10px] uppercase tracking-[0.4em] text-cyan-400 font-bold mb-1">
                    Active Selection
                  </div>
                  <div className="text-2xl font-black text-white">
                    {String(selectedMuscle)}
                  </div>
                </div>
              ) : (
                <div className="inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-6 py-3 text-xs font-bold uppercase tracking-widest text-cyan-300">
                  <Activity size={14} className="animate-pulse" />
                  Hover the body to explore
                </div>
              )}
            </div>

            {/* SVG CONTAINER */}
            <div
              ref={anatomyBoxRef}
              onMouseMove={handleMouseMove}
              className="relative h-[50vh] md:h-[60vh] w-full flex items-center justify-center bg-slate-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl"
            >
              {/* Scan Line */}
              <motion.div
                animate={{ top: ["-10%", "110%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[1px] z-20 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${theme.accent.success}, transparent)`,
                  boxShadow: `0 0 15px ${theme.accent.success}`,
                }}
              />

              {/* Tooltip */}
              <AnimatePresence>
                {highlightedMuscle && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: mousePos.x + 30,
                      y: mousePos.y - 50,
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-0 left-0 z-50 pointer-events-none px-4 py-2 rounded-lg backdrop-blur-md border border-white/10"
                    style={{
                      backgroundColor: `${theme.primary.main}cc`,
                      boxShadow: `0 0 15px ${theme.primary.glow}`,
                    }}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                      {highlightedMuscle}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SVG WRAPPER */}
              <div className="anatomy-svg-wrapper h-full w-full flex items-center justify-center p-12 transition-transform duration-700 hover:scale-105">
                <FrontView
                  onHover={setHighlightedMuscle}
                  onLeave={() => setHighlightedMuscle(null)}
                  onSelect={setSelectedMuscle}
                  selectedMuscle={selectedMuscle}
                  highlightedMuscle={highlightedMuscle}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    width: "auto",
                    height: "auto",
                    filter: `drop-shadow(0 0 25px ${theme.primary.glow})`,
                    display: "block",
                    margin: "auto",
                  }}
                />
              </div>

              {/* Holographic grid */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                  backgroundImage: `linear-gradient(0deg, transparent 49%, white 50%, transparent 51%), linear-gradient(90deg, transparent 49%, white 50%, transparent 51%)`,
                  backgroundSize: "32px 32px",
                }}
              />
            </div>
          </motion.div>
        </section>

        {/* ======================================
            SECTION 4: PROBLEM -> SOLUTION
           ====================================== */}
        <section className="h-screen w-full flex flex-col justify-center items-center snap-start px-6 relative overflow-hidden bg-[#050505]">
          {/* RADIANT BACKGROUND */}
          <div
            className="absolute inset-0 opacity-40 blur-[140px] pointer-events-none transition-colors duration-1000"
            style={{
              background: `radial-gradient(circle at 80% 50%, ${selectedProblem.color}, transparent 65%),
                   radial-gradient(circle at 10% 10%, #3b82f6, transparent 55%)`,
            }}
          />

          <div className="max-w-6xl w-full z-10 flex flex-col h-full max-h-[80vh] justify-center font-sans">
            {/* --- SEQUENTIAL HEADING --- */}
            <div className="flex items-center justify-center gap-8 mb-12">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.4, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl md:text-3xl font-black tracking-tighter text-white uppercase italic"
              >
                Your Problems
              </motion.h2>

              {/* REVERTED ARROW: Long CSS Line with Sharp Tip */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "140px", opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="h-[1px] bg-white/20 relative" // Darker, clean signal line
              >
                <div className="absolute right-0 -top-[3px] border-y-[4px] border-y-transparent border-l-[7px] border-l-white/20" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.4, 1] }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="text-xl md:text-3xl font-black tracking-tighter uppercase italic"
                style={{
                  color: selectedProblem.color,
                  textShadow: `0 0 25px ${selectedProblem.color}`,
                }}
              >
                Our Solutions
              </motion.h2>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch h-full max-h-[50vh]">
              {/* 1. TIGHT LIST (SHARP & READABLE) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col overflow-y-auto no-scrollbar border-l border-white/20"
              >
                {problems.map((problem) => {
                  const active = problem.id === selectedExcuseId;
                  return (
                    <button
                      key={problem.id}
                      onClick={() => setSelectedExcuseId(problem.id)}
                      className={`group flex items-center gap-6 p-3 transition-all duration-200 border-b border-white/10 ${
                        active
                          ? "bg-white/10"
                          : "bg-transparent hover:bg-white/[0.04]"
                      }`}
                      style={{ borderRadius: "0px" }}
                    >
                      <div
                        className="transition-all duration-500 pl-2"
                        style={{
                          color: active
                            ? problem.color
                            : "rgba(255,255,255,0.45)",
                          filter: active
                            ? `drop-shadow(0 0 12px ${problem.color})`
                            : "none",
                        }}
                      >
                        {React.cloneElement(problem.icon, {
                          size: 24,
                          strokeWidth: active ? 3 : 2,
                        })}
                      </div>

                      <span
                        className={`text-base font-bold tracking-tight uppercase italic transition-colors ${
                          active ? "text-white" : "text-white/45"
                        }`}
                      >
                        {problem.text}
                      </span>
                    </button>
                  );
                })}
              </motion.div>

              {/* 2. SIMPLE SOLUTION CARD (SHRINKED HEADER) */}
              <motion.div
                key={selectedProblem.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="relative flex flex-col justify-center p-10 bg-white/[0.04] border border-white/10"
                style={{ borderRadius: "0px", backdropFilter: "blur(40px)" }}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{
                    backgroundColor: selectedProblem.color,
                    boxShadow: `0 0 30px ${selectedProblem.color}`,
                  }}
                />

                <div className="space-y-4">
                  <div
                    style={{
                      color: selectedProblem.color,
                      filter: `drop-shadow(0 0 20px ${selectedProblem.color})`,
                    }}
                  >
                    {React.cloneElement(selectedProblem.icon, {
                      size: 48,
                      strokeWidth: 2.5,
                    })}
                  </div>

                  {/* REDUCED SIZE HEADING */}
                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic leading-none">
                    {selectedProblem.text}
                  </h3>

                  <div
                    className="h-[2px] w-16"
                    style={{ backgroundColor: `${selectedProblem.color}44` }}
                  />

                  {/* FIX: Use data source directly */}
                  <p className="text-xl md:text-2xl font-bold text-white leading-tight tracking-tight">
                    {selectedProblem.solution}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Hero;