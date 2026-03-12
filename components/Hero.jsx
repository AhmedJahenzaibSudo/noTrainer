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
  ChevronDown,
  Wand2,
  UserCircle,
  Database,
  Columns3,
  Gamepad2,
  ArrowRight,
  X,
} from "lucide-react";

import FrontView from "@/components/anatomy/FrontView";

// ============================================
// CENTRALIZED CONFIGURATION
// ============================================
const config = {
  colors: {
    bgPrimary: "#051061", // Deep Blue
    bgDark: "#020a21", // Darker Blue/Black for contrast sections
    accent: "#1AF0BE", // Mint Green

    textPrimary: "#ffffff",
    textOnAccent: "#051061", // Text color for inside accent cards
    textSecondary: "#cbd5e1",
  },
  heights: {
    fullPage: "93.6dvh",
    sectionContent: "calc(100dvh - 120px)",
  },
  fonts: {
    heading: "'Righteous', cursive",
  },
  animation: {
    marqueeDuration: "45s",
  },
};

// ============================================
// COMPONENT DATA
// ============================================
const features = [
  {
    title: "Workout Wizard",
    description: "Select muscles and generate workouts instantly.",
    icon: Wand2,
  },
  {
    title: "Muscle Map",
    description: "Interactive diagram for intuitive discovery.",
    icon: UserCircle,
  },
  {
    title: "Rich Dataset",
    description: "Categorized exercises for all goals.",
    icon: Database,
  },
  {
    title: "Calculators",
    description: "BMI, calories, and protein formulas.",
    icon: Calculator,
  },
  {
    title: "AI Chatbot",
    description: "24/7 intelligent fitness assistant.",
    icon: MessageSquare,
  },
  {
    title: "Kanban Board",
    description: "Visual tracking for fitness tasks.",
    icon: Columns3,
  },
  {
    title: "Mini Games",
    description: "Boost focus and motivation.",
    icon: Gamepad2,
  },
];

const words = ["Home Gym", "Workout Guide", "AI Trainer", "Fitness Hub"];

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [highlightedMuscle, setHighlightedMuscle] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedExcuseId, setSelectedExcuseId] = useState(1);
  const [wordIndex, setWordIndex] = useState(0);
  const [mobilePopupProblem, setMobilePopupProblem] = useState(null);
  const anatomyBoxRef = useRef(null);
  const [activeProblem, setActiveProblem] = useState(null);

  const titles = [
    { text: "noTrainer", font: "var(--font-space)" },
    { text: "AI Trainer", font: "var(--font-orbitron)" },
    { text: "Train Anywhere", font: "var(--font-sora)" },
  ];

  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMounted(true);
    const textInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobilePopupProblem ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobilePopupProblem]);

  const problems = useMemo(
    () => [
      {
        id: 1,
        text: "No gym access",
        solution: "Bodyweight & home equipment routines.",
        icon: MapPin,
      },
      {
        id: 2,
        text: "Too expensive",
        solution: "Free workout plans & calculators.",
        icon: Calculator,
      },
      {
        id: 3,
        text: "Don't know how",
        solution: "Step-by-step exercise guides.",
        icon: Info,
      },
      {
        id: 4,
        text: "Need privacy",
        solution: "24/7 AI trainer, no judgment.",
        icon: MessageSquare,
      },
      {
        id: 5,
        text: "Lack of knowledge",
        solution: "800+ exercises with instructions.",
        icon: Dumbbell,
      },
      {
        id: 6,
        text: "Can't go out",
        solution: "Effective home workout programs.",
        icon: Zap,
      },
      {
        id: 7,
        text: "Need structure",
        solution: "Visual Kanban Board tracking.",
        icon: LayoutDashboard,
      },
      {
        id: 8,
        text: "No motivation",
        solution: "Motivation Marquee & reminders.",
        icon: Target,
      },
      {
        id: 9,
        text: "No equipment",
        solution: "Proven bodyweight training.",
        icon: Package,
      },
    ],
    [],
  );

  const handleMouseMove = (e) => {
    if (!anatomyBoxRef.current) return;
    const rect = anatomyBoxRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  if (!mounted) return null;

  return (
    <>
      {/* CSS Variables and Global Styles */}
      <style>{`
        :root {
          --font-heading: ${config.fonts.heading};
          --height-full-page: ${config.heights.fullPage};
          --height-section-content: ${config.heights.sectionContent};
          --color-accent: ${config.colors.accent};
          --color-bg-primary: ${config.colors.bgPrimary};
        }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .snap-container {
          height: 93.6dvh;
          overflow-y: auto;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }
        .snap-section {
          scroll-snap-align: start;
          min-height: var(--height-full-page);
        }

        .anatomy-svg-wrapper svg {
          width: var(--svg-width, 420px) !important;
          height: var(--svg-height, 520px) !important;
          max-width: 100%;
          display: block;
          margin: 0 auto;
          cursor: pointer;
        }

        @keyframes scrollFeatures {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-features {
          animation: scrollFeatures ${config.animation.marqueeDuration} linear infinite;
        }

        @media (max-width: 767px) {
          .anatomy-svg-wrapper svg {
            --svg-width: 300px;
            --svg-height: 380px;
          }
        }
        
        /* Alternating Card Style: Accent Background with Blue Text */
        .accent-card {
          background: ${config.colors.accent};
          border: 1px solid rgba(5, 16, 97, 0.2);
          color: ${config.colors.textOnAccent};
        }
        
        .accent-card h3, 
        .accent-card span {
           color: ${config.colors.textOnAccent};
        }
        
        .accent-card p {
           color: ${config.colors.bgPrimary}; /* Dark blue for body text on bright bg */
           opacity: 0.9;
        }
        
        .accent-card .icon-box {
           background: ${config.colors.bgPrimary};
        }
        
        .accent-card .icon-box svg {
           color: ${config.colors.accent};
        }
      `}</style>

      {/* Main Container */}
      <div className="snap-container no-scrollbar relative w-full bg-[#020a21] text-white font-sans selection:bg-[#1AF0BE] selection:text-[#051061]">
        {/* ==========================================
            HERO SECTION (Level 1: Blue BG)
        ========================================== */}
        <section className="snap-section relative flex h-screen w-full flex-col items-center justify-center overflow-hidden px-6">
          {/* Background Glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Primary Blue Glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] bg-[#051061] blur-[140px]"
            />
            {/* Accent Mint Glow */}
            <motion.div
              animate={{
                x: [0, 40, 0],
                y: [0, -20, 0],
              }}
              transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
              className="absolute bottom-[-10%] right-[-10%] h-[550px] w-[550px] bg-[#1AF0BE] blur-[130px] opacity-40"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center"
          >
            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative text-6xl font-normal md:text-9xl"
              style={{ fontFamily: "'Krona One', sans-serif" }}
            >
              {/* The "Echo" Layer - Creates a ghosting effect behind the text */}
              <motion.span
                animate={{
                  opacity: [0, 0.4, 0],
                  x: [0, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 z-0 text-cyan-500/30 blur-md"
                aria-hidden="true"
              >
                noTrainer AI
              </motion.span>

              {/* Main Text: Chrome to Ocean Gradient */}
              <span className="relative z-10 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                noTrainer
              </span>

              {/* AI: The "Lively" Core with a Liquid Flare effect */}
              <motion.span
                className="relative z-10 ml-4 bg-gradient-to-tr from-[#00ffcc] via-[#3399ff] to-[#00ffcc] bg-[length:200%_auto] bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                AI
                {/* A soft glowing "aura" that follows the letters */}
                <span className="absolute -inset-2 -z-10 animate-pulse bg-cyan-400/20 blur-2xl" />
              </motion.span>
            </motion.h1>

            {/* Accent Line */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="mt-4 h-1.5 bg-[#1AF0BE] shadow-[0_0_20px_rgba(26,240,190,0.8)]"
            />

            {/* Tagline */}
            <p className="mt-5 max-w-md text-lg font-semibold text-slate-200 md:text-xl">
              Train Anywhere.{" "}
              <span className="font-semibold text-[#1AF0BE]">
                No Trainer Needed.
              </span>
            </p>

            {/* Platform Card (Level 2: Accent Card -> Level 3: Blue Text) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative mt-12 w-full max-w-3xl overflow-hidden accent-card p-8 shadow-xl"
            >
              {/* Top Border Accent */}
              <div className="absolute inset-x-0 top-0 h-1 bg-[#051061]" />

              <span className="mb-2 block text-left text-xs font-bold uppercase tracking-[0.2em] text-[#051061]">
                The Platform
              </span>

              <div className="flex h-20 items-center justify-center overflow-hidden md:h-24">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={wordIndex}
                    initial={{ y: 50, opacity: 0, rotateX: -40 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    exit={{ y: -50, opacity: 0, rotateX: 40 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="text-4xl font-black uppercase tracking-tight text-[#051061] md:text-6xl"
                  >
                    {words[wordIndex]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
              className="mt-12"
            >
              <ChevronDown className="h-8 w-8 text-[#1AF0BE] opacity-70" />
            </motion.div>
          </motion.div>
        </section>

        {/* ==========================================
            SECTION: MUSCLE SELECTION (Level 1: Dark BG)
        ========================================== */}
        <section
          className="snap-section relative flex w-full flex-col items-center justify-center overflow-hidden px-6 py-16"
          style={{ backgroundColor: config.colors.bgDark }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-[#051061]" />
          <div className="absolute top-1/2 left-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 bg-[#1AF0BE] opacity-10 blur-[140px]" />

          <div
            className="relative flex w-full max-w-5xl flex-col items-center justify-center"
            style={{ minHeight: "var(--height-section-content)" }}
          >
            {/* Heading */}
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                Target Every <span className="text-[#1AF0BE]">Muscle</span>
              </h2>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/70 md:text-base">
                Click the anatomy to explore muscle groups
              </p>
            </div>

            {/* Selected Muscle */}
            <div className="mb-6 flex w-full max-w-md items-center justify-center bg-[#1AF0BE] px-5 py-4">
              {selectedMuscle ? (
                <div className="flex items-center gap-3 text-center">
                  <Activity
                    size={24}
                    strokeWidth={2.6}
                    className="text-[#051061]"
                  />
                  <span className="text-xl font-black capitalize tracking-tight text-[#051061] md:text-2xl">
                    {String(selectedMuscle)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-center">
                  <Activity
                    size={24}
                    strokeWidth={2.6}
                    className="text-[#051061]"
                  />
                  <span className="text-sm font-black uppercase tracking-[0.14em] text-[#051061] md:text-base">
                    No muscle selected
                  </span>
                </div>
              )}
            </div>

            {/* Anatomy */}
            <div
              ref={anatomyBoxRef}
              onMouseMove={handleMouseMove}
              className="relative flex h-[420px] w-full items-center justify-center md:h-[62vh]"
            >
              <AnimatePresence>
                {highlightedMuscle && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: mousePos.x + 18,
                      y: mousePos.y - 34,
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="pointer-events-none absolute left-0 top-0 z-50 bg-[#1AF0BE] px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#051061]"
                  >
                    {highlightedMuscle}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="anatomy-svg-wrapper flex h-full w-full items-center justify-center overflow-hidden">
                <div className="scale-[0.82] md:scale-[0.88] origin-center">
                  <FrontView
                    onHover={setHighlightedMuscle}
                    onLeave={() => setHighlightedMuscle(null)}
                    onSelect={setSelectedMuscle}
                    selectedMuscle={selectedMuscle}
                    highlightedMuscle={highlightedMuscle}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION: PROBLEMS & SOLUTIONS (Level 1: Blue BG)
        ========================================== */}
        <section
          className="snap-section relative flex w-full flex-col items-center justify-center overflow-hidden px-6 py-16"
          style={{ backgroundColor: config.colors.bgPrimary }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-[#051061]" />
          <div className="absolute top-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 bg-[#1AF0BE] opacity-10 blur-[150px]" />

          <div
            className="relative flex w-full max-w-6xl flex-col justify-center"
            style={{ minHeight: "var(--height-section-content)" }}
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-center gap-3 py-2 md:gap-5">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white sm:text-3xl md:text-4xl">
                Problems
              </h2>

              <ArrowRight
                className="h-5 w-5 text-[#1AF0BE] md:h-8 md:w-8"
                strokeWidth={3}
              />

              <h2 className="text-2xl font-black uppercase tracking-tighter text-[#1AF0BE] sm:text-3xl md:text-4xl">
                Solutions
              </h2>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {problems.map((problem) => {
                const isActive = activeProblem?.id === problem.id;

                return (
                  <button
                    key={problem.id}
                    onClick={() => setActiveProblem(isActive ? null : problem)}
                    className={`flex min-h-[92px] items-center gap-3 p-4 text-left transition-all duration-300
              ${
                isActive
                  ? "bg-[#1AF0BE] text-[#051061] shadow-[0_0_24px_rgba(26,240,190,0.22)]"
                  : "bg-[#112B8A] text-white hover:bg-[#1837A4]"
              }`}
                  >
                    <problem.icon
                      size={24}
                      strokeWidth={2.6}
                      className={`shrink-0 transition-all duration-300 ${
                        isActive ? "text-[#051061]" : "text-[#1AF0BE]"
                      }`}
                    />

                    <span
                      className={`text-[11px] font-black uppercase leading-snug tracking-tight md:text-xs ${
                        isActive ? "text-[#051061]" : "text-white"
                      }`}
                    >
                      {problem.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Instruction */}
            <div className="mt-4 text-center text-[10px] uppercase tracking-[0.22em] text-white/60 md:text-xs">
              Click a problem to reveal the solution
            </div>

            {/* SOLUTION PANEL */}
            <div
              className={`mt-4 overflow-hidden transition-all duration-500 ${
                activeProblem
                  ? "max-h-[170px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {activeProblem && (
                <div className="flex min-h-[120px] items-center justify-center bg-[#19E6B6] px-5 py-4 md:px-6 md:py-5">
                  <div className="flex max-w-4xl items-center justify-center gap-4 text-center">
                    <activeProblem.icon
                      size={28}
                      strokeWidth={2.7}
                      className="shrink-0 text-[#051061]"
                    />

                    <div className="flex flex-col items-center justify-center">
                      <p className="text-sm font-extrabold leading-relaxed text-[#051061] md:text-base">
                        {activeProblem.solution}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION: FEATURES (Level 1: Dark BG)
        ========================================== */}
        <section
          className="snap-section relative flex w-full flex-col overflow-hidden px-6 py-20"
          style={{ backgroundColor: config.colors.bgDark }}
        >
          <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-[#1AF0BE] opacity-10 blur-[150px]" />

          <div
            className="relative flex w-full items-end justify-center pb-10 md:pb-12"
            style={{ height: "25%" }}
          >
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white drop-shadow-lg sm:text-5xl md:text-8xl">
              Features
            </h2>
          </div>

          {/* MOBILE TOUCH SCROLL (Level 2: Accent Cards) */}
          <div
            className="px-4 md:hidden relative z-10"
            style={{ height: "75%" }}
          >
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory touch-pan-x no-scrollbar">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="snap-start relative flex h-[340px] w-[280px] flex-shrink-0 flex-col overflow-hidden accent-card p-7 border-t-4 border-[#051061]"
                >
                  <div className="z-10 mb-auto">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center icon-box">
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="mb-4 text-2xl font-black uppercase leading-tight tracking-tight">
                      {feature.title}
                    </h3>
                  </div>

                  <div className="z-10 mt-auto">
                    <p className="text-base font-medium leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <span className="pointer-events-none absolute -bottom-8 -right-4 select-none text-[140px] font-black leading-none opacity-10">
                    {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* DESKTOP MARQUEE (Level 2: Accent Cards) */}
          <div
            className="relative hidden w-full overflow-hidden md:flex"
            style={{
              height: "75%",
              alignItems: "flex-start",
              paddingTop: "1rem",
            }}
          >
            <div className="flex w-max animate-scroll-features hover:[animation-play-state:paused]">
              {[...features, ...features].map((feature, idx) => (
                <div
                  key={idx}
                  className="group relative mx-6 flex h-[350px] w-[400px] flex-shrink-0 cursor-pointer flex-col overflow-hidden accent-card p-10 transition-all duration-300 hover:-translate-y-4 hover:bg-opacity-95 border-t-4 border-[#051061]"
                >
                  <div className="z-10 mb-auto">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 icon-box">
                      <feature.icon className="w-8 h-8" />
                    </div>

                    <h3 className="mb-4 text-3xl font-black uppercase leading-tight tracking-tight">
                      {feature.title}
                    </h3>
                  </div>

                  <div className="z-10 mt-auto">
                    <p className="text-lg font-medium leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <span className="pointer-events-none absolute -bottom-8 -right-4 select-none text-[180px] font-black leading-none opacity-10 transition-transform group-hover:scale-110">
                    {(idx % features.length) + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Hero;
