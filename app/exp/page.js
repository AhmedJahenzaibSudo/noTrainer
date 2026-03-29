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
  ChevronDown,
  Wand2,
  UserCircle,
  Database,
  Columns3,
  Gamepad2,
  ArrowRight,
} from "lucide-react";

import FrontView from "@/components/anatomy/FrontView";

// ============================================
// CENTRALIZED CONFIGURATION
// ============================================
const config = {
  // Per-section color themes
  sections: {
    hero: {
      bg: "#020a21",
      accent: "#1AF0BE", // Brand mint — kept here only
      glow: "#1AF0BE",
      textAccent: "#1AF0BE",
      cardBg: "#1AF0BE",
      cardText: "#020a21",
    },
    muscle: {
      bg: "#1a0010",
      accent: "#FF2D78", // Electric magenta
      glow: "#FF2D78",
      textAccent: "#FF2D78",
      cardBg: "#FF2D78",
      cardText: "#1a0010",
    },
    problems: {
      bg: "#021a0e",
      accent: "#AAFF00", // Toxic lime
      glow: "#AAFF00",
      textAccent: "#AAFF00",
      cardBg: "#AAFF00",
      cardText: "#021a0e",
      buttonBg: "#0a3d1f",
      buttonHover: "#0f5229",
    },
    features: {
      bg: "#08001f",
      accent: "#BF00FF", // Hot violet
      glow: "#BF00FF",
      textAccent: "#BF00FF",
      cardBg: "#BF00FF",
      cardText: "#08001f",
    },
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

// ============================================
// CLIP SECTION WRAPPER
// Each section clips its fixed-position content so it only
// shows while that section is in the viewport.
// HEADER_HEIGHT offsets everything below the sticky marquee.
// ============================================
const HEADER_HEIGHT = 40;

const ClipSection = ({ children, bgColor }) => (
  <div
    className="snap-start"
    style={{
      position: "relative",
      width: "100%",
      height: `calc(100vh - ${HEADER_HEIGHT}px)`,
    }}
  >
    <div
      style={{
        position: "absolute",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        clip: "rect(0, auto, auto, 0)",
        WebkitClipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: HEADER_HEIGHT,
          left: 0,
          width: "100%",
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          backgroundColor: bgColor,
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: HEADER_HEIGHT,
          left: 0,
          width: "100%",
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  </div>
);

const Hero = () => {
  const [mounted, setMounted] = useState(true);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [highlightedMuscle, setHighlightedMuscle] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [wordIndex, setWordIndex] = useState(0);
  const [activeProblem, setActiveProblem] = useState(null);
  const anatomyBoxRef = useRef(null);

  const { hero, muscle, problems: prob, features: feat } = config.sections;

  useEffect(() => {
    const textInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(textInterval);
  }, []);

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
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .anatomy-svg-wrapper svg {
          width: 420px !important;
          height: 520px !important;
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
            width: 300px !important;
            height: 380px !important;
          }
        }
      `}</style>

      <div className="relative w-full snap-y snap-proximity text-white font-sans">
        {/* ==========================================
            HERO SECTION — Mint / #020a21
        ========================================== */}
        <ClipSection
          bgColor={hero.bg}
          className="relative min-h-screen w-full overflow-hidden font-sans"
        >
          {/* Refined colored background: Deeper, richer gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, #09090b 0%, #17172b 50%, #1e1b4b 100%)",
            }}
          />

          {/* Subtle texture lines: Slightly cleaner sizing */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `
        linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
      `,
              backgroundSize: "64px 64px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
              {/* Title: Simplified gradient, cleaner typography */}
              <motion.h1
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl font-extrabold tracking-tight md:text-7xl xl:text-[7rem]"
              >
                <span className="block bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent drop-shadow-sm">
                  noTrainer AI
                </span>
              </motion.h1>

              {/* Subtitle: Punchier, simpler phrasing with a modern font weight */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7 }}
                className="mt-6 max-w-lg text-base font-medium leading-relaxed text-zinc-300 md:text-lg"
              >
                Discover exercises, build smart routines, and achieve your
                goals. All the results, zero personal trainers required.
              </motion.p>

              {/* Rotating concept: Same structure, cohesive neon theme */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="relative mt-16 flex h-[100px] items-center justify-center"
              >
                {/* Sleek fading gradient lines instead of solid red/green/yellow */}
                <div className="absolute top-0 h-[1px] w-48 bg-gradient-to-r from-transparent via-indigo-400 to-transparent md:w-64" />
                <div className="absolute bottom-0 h-[1px] w-48 bg-gradient-to-r from-transparent via-indigo-400 to-transparent md:w-64" />
                <div className="absolute left-1/2 top-1/2 h-10 w-[1px] -translate-x-[150px] -translate-y-1/2 bg-gradient-to-b from-transparent via-cyan-400 to-transparent md:-translate-x-[200px]" />
                <div className="absolute left-1/2 top-1/2 h-10 w-[1px] translate-x-[150px] -translate-y-1/2 bg-gradient-to-b from-transparent via-cyan-400 to-transparent md:translate-x-[200px]" />

                <div className="relative overflow-hidden px-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={wordIndex}
                      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                      transition={{ duration: 0.4 }}
                      className="text-2xl font-black uppercase tracking-[0.15em] text-cyan-300 md:text-4xl"
                    >
                      {words[wordIndex]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Arrow cue */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex items-center justify-center"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-60 transition-opacity hover:opacity-100"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </ClipSection>

        {/* ==========================================
            MUSCLE SELECTION SECTION — Magenta / #1a0010
        ========================================== */}
        <ClipSection bgColor={muscle.bg}>
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute top-1/2 left-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 blur-[140px] opacity-20"
              style={{ backgroundColor: muscle.glow }}
            />
            <div
              className="absolute top-[-10%] right-[-5%] h-[300px] w-[300px] blur-[100px] opacity-15"
              style={{ backgroundColor: muscle.glow }}
            />
          </div>

          <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-6 mt-6">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                Learn about{" "}
                <span style={{ color: muscle.accent }}>Muscles</span>
              </h2>
            </div>

            <div
              className="mb-6 flex w-full max-w-md items-center justify-center px-5 py-3 md:py-4"
              style={{ backgroundColor: muscle.cardBg }}
            >
              {selectedMuscle ? (
                <span
                  className="text-lg md:text-xl font-black capitalize tracking-tight"
                  style={{ color: muscle.cardText }}
                >
                  {String(selectedMuscle)}
                </span>
              ) : (
                <span
                  className="text-xs md:text-sm font-black uppercase tracking-[0.14em]"
                  style={{ color: muscle.cardText }}
                >
                  Select a Muscle
                </span>
              )}
            </div>

            <div
              ref={anatomyBoxRef}
              onMouseMove={handleMouseMove}
              className="relative flex w-full items-center justify-center"
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
                    className="pointer-events-none absolute left-0 top-0 z-50 px-3 py-2 text-xs font-black uppercase tracking-[0.16em]"
                    style={{
                      backgroundColor: muscle.cardBg,
                      color: muscle.cardText,
                    }}
                  >
                    {highlightedMuscle}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="anatomy-svg-wrapper flex w-full items-center justify-center">
                <div className="scale-[0.82] md:scale-[0.88] origin-center flex items-center justify-center">
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
        </ClipSection>

        {/* ==========================================
            PROBLEMS & SOLUTIONS SECTION — Lime / #021a0e
        ========================================== */}
        <ClipSection bgColor={prob.bg}>
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute top-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 blur-[150px] opacity-15"
              style={{ backgroundColor: prob.glow }}
            />
          </div>

          <div className="relative z-10 flex w-full max-w-6xl flex-col px-6 overflow-y-auto no-scrollbar max-h-screen py-16">
            <div className="mb-8 flex items-center justify-center gap-3 md:gap-5">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white sm:text-3xl md:text-4xl">
                Problems
              </h2>
              <ArrowRight
                className="h-5 w-5 md:h-8 md:w-8"
                strokeWidth={3}
                style={{ color: prob.accent }}
              />
              <h2
                className="text-2xl font-black uppercase tracking-tighter sm:text-3xl md:text-4xl"
                style={{ color: prob.accent }}
              >
                Solutions
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {problems.map((problem) => {
                const isActive = activeProblem?.id === problem.id;
                return (
                  <button
                    key={problem.id}
                    onClick={() => setActiveProblem(isActive ? null : problem)}
                    className="flex min-h-[80px] items-center gap-3 p-3 text-left transition-all duration-300"
                    style={{
                      backgroundColor: isActive ? prob.cardBg : prob.buttonBg,
                      color: isActive ? prob.cardText : "#ffffff",
                      boxShadow: isActive
                        ? `0 0 24px ${prob.accent}44`
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        e.currentTarget.style.backgroundColor =
                          prob.buttonHover;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        e.currentTarget.style.backgroundColor = prob.buttonBg;
                    }}
                  >
                    <problem.icon
                      size={22}
                      strokeWidth={2.6}
                      className="shrink-0 transition-all duration-300"
                      style={{ color: isActive ? prob.cardText : prob.accent }}
                    />
                    <span
                      className="text-[10px] font-black uppercase leading-snug tracking-tight md:text-xs"
                      style={{ color: isActive ? prob.cardText : "#ffffff" }}
                    >
                      {problem.text}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              className="mt-3 text-center text-[10px] uppercase tracking-[0.22em] md:text-xs"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Tap a problem to reveal the solution
            </div>

            <div
              className={`mt-3 overflow-hidden transition-all duration-500 ${
                activeProblem ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{
                maxHeight: activeProblem ? "200px" : "0px",
                transition: "max-height 0.4s ease, opacity 0.3s ease",
              }}
            >
              {activeProblem && (
                <div
                  className="flex items-center justify-center px-5 py-4 md:px-6 md:py-5 rounded-sm"
                  style={{ backgroundColor: prob.cardBg }}
                >
                  <div className="flex max-w-4xl items-center justify-center gap-4 text-center">
                    <activeProblem.icon
                      size={26}
                      strokeWidth={2.7}
                      className="shrink-0"
                      style={{ color: prob.cardText }}
                    />
                    <p
                      className="text-sm font-extrabold leading-relaxed md:text-base"
                      style={{ color: prob.cardText }}
                    >
                      {activeProblem.solution}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ClipSection>

        {/* ==========================================
            FEATURES SECTION — Staggered 3D Stack
        ========================================== */}
        <div
          className="relative w-full snap-start"
          style={{
            backgroundColor: feat.bg,
            minHeight: `${features.length * 62}vh`,
          }}
        >
          <style
            dangerouslySetInnerHTML={{
              __html: `
        .features-stack-shell {
          width: 100%;
          min-height: 100%;
          color: #fff;
          font-family: "Space Grotesk", sans-serif;
        }

        .features-stack-header {
          position: sticky;
          top: 48px;
          z-index: 30;
          height: 16vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 1rem 1.5rem 0 1.5rem;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            ${feat.bg} 0%,
            ${feat.bg} 62%,
            rgba(0, 0, 0, 0) 100%
          );
        }

        .features-stack-title {
          margin-top: 20px;
          font-size: clamp(1.9rem, 4.2vw, 3.8rem);
          line-height: 0.86;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: 900;
          -webkit-text-stroke: 1.2px rgba(255, 255, 255, 0.45);
          color: transparent;
          background: linear-gradient(to bottom, #ffffff 0%, transparent 100%);
          background-clip: text;
          -webkit-background-clip: text;
          transform-origin: center top;
          will-change: transform, opacity;
          animation:
            fill-text linear both,
            features-title-shrink linear both;
          animation-timeline: scroll(), scroll();
          animation-range: 0 18vh, 0 20vh;
        }

        @keyframes fill-text {
          to {
            -webkit-text-stroke: 0;
            color: #fff;
          }
        }

        @keyframes features-title-shrink {
          from {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          to {
            transform: translateY(-2.8vh) scale(0.78);
            opacity: 0.95;
          }
        }

        .features-stack-list {
          list-style: none;
          padding: 1vh 1rem 18vh 1rem;
          margin: 0 auto;
          width: 100%;
          max-width: 92vw;
          display: grid;
          grid-template-columns: 1fr;
          gap: 4vw;
        }

        .features-stack-item {
          position: sticky;
          top: calc(48px + 7vh);
          height: clamp(320px, 40vw, 560px);
          perspective: 1000px;
          padding-top: calc(var(--index) * 1em);
        }

        .features-stack-card {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          padding: clamp(1.5rem, 3vw, 3rem);
          border-radius: 42px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.12);
          transform-origin: 50% 0%;
          transform-style: preserve-3d;
          will-change: transform, filter;
          animation: scale-card linear forwards;
          animation-timeline: view();
          animation-range: exit-crossing 0% exit-crossing 100%;
        }

        @keyframes scale-card {
          to {
            transform: scale(0.8) translateY(-10vh) rotateX(-20deg);
            filter: brightness(0.6);
            border-radius: 20px;
            box-shadow: 0 50px 80px -10px var(--shadow-color);
          }
        }

        .features-stack-icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          margin-bottom: 1.25rem;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(8px);
          position: relative;
          z-index: 2;
        }

        .features-stack-heading {
          font-size: clamp(2rem, 5vw, 4rem);
          line-height: 0.95;
          margin: 0 0 1rem 0;
          font-weight: 900;
          position: relative;
          z-index: 2;
          max-width: 75%;
        }

        .features-stack-text {
          font-size: clamp(1rem, 1.6vw, 1.4rem);
          line-height: 1.4;
          max-width: 680px;
          margin: 0;
          position: relative;
          z-index: 2;
          opacity: 0.88;
        }

        .features-stack-number {
          font-size: clamp(5rem, 12vw, 10rem);
          position: absolute;
          right: 1.5rem;
          top: -1rem;
          opacity: 0.28;
          font-weight: 900;
          line-height: 1;
          pointer-events: none;
          user-select: none;
        }

        @media (max-width: 768px) {
          .features-stack-header {
            height: 13vh;
            padding: 0.85rem 1rem 0 1rem;
          }

          .features-stack-title {
            font-size: clamp(1.55rem, 8vw, 2.5rem);
            animation-range: 0 14vh, 0 16vh;
          }

          .features-stack-list {
            max-width: 100%;
            padding: 1vh 1rem 14vh 1rem;
          }

          .features-stack-item {
            top: calc(48px + 5.5vh);
            height: 52vh;
          }

          .features-stack-card {
            border-radius: 26px;
            padding: 1.35rem;
          }

          .features-stack-heading {
            max-width: 100%;
          }

          .features-stack-number {
            right: 1rem;
            top: 0;
          }

          @keyframes features-title-shrink {
            from {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
            to {
              transform: translateY(-1.6vh) scale(0.84);
              opacity: 0.96;
            }
          }
        }
      `,
            }}
          />

          <div className="features-stack-shell">
            <div className="features-stack-header">
              <h2 className="features-stack-title">Features</h2>
            </div>

            <ul className="features-stack-list">
              {features.map((feature, idx) => {
                const cardStyles = [
                  {
                    bg: "#ff2a6d",
                    text: "#ffffff",
                    shadow: "rgba(255, 42, 109, 0.8)",
                  },
                  {
                    bg: "#05d9e8",
                    text: "#000000",
                    shadow: "rgba(5, 217, 232, 0.8)",
                  },
                  {
                    bg: "#ffe600",
                    text: "#000000",
                    shadow: "rgba(255, 230, 0, 0.8)",
                  },
                  {
                    bg: "#fafac6",
                    text: "#000000",
                    shadow: "rgba(250, 250, 198, 0.8)",
                  },
                  {
                    bg: "#7c3aed",
                    text: "#ffffff",
                    shadow: "rgba(124, 58, 237, 0.8)",
                  },
                ];

                const style = cardStyles[idx % cardStyles.length];

                return (
                  <li
                    key={idx}
                    className="features-stack-item"
                    style={{
                      zIndex: features.length + idx,
                      ["--index"]: idx + 1,
                    }}
                  >
                    <div
                      className="features-stack-card"
                      style={{
                        background: style.bg,
                        color: style.text,
                        ["--shadow-color"]: style.shadow,
                      }}
                    >
                      <span className="features-stack-number">
                        {String(idx + 1).padStart(2, "0")}
                      </span>

                      <div className="features-stack-icon">
                        <feature.icon className="h-7 w-7" />
                      </div>

                      <h3 className="features-stack-heading">
                        {feature.title}
                      </h3>

                      <p
                        className="features-stack-text"
                        style={{
                          color:
                            style.text === "#000000"
                              ? "rgba(0,0,0,0.78)"
                              : "rgba(255,255,255,0.88)",
                        }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
