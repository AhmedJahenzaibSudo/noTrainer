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
            HERO SECTION
        ========================================== */}
        <ClipSection bgColor={hero.bg}>
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.5, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] blur-[140px]"
              style={{ backgroundColor: hero.glow }}
            />
            <motion.div
              animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
              className="absolute bottom-[-10%] right-[-10%] h-[550px] w-[550px] blur-[130px] opacity-30"
              style={{ backgroundColor: hero.glow }}
            />
          </div>

          <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center px-6">
            <motion.h1
              initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative text-6xl font-normal md:text-9xl"
              style={{ fontFamily: "'Krona One', sans-serif" }}
            >
              <motion.span
                animate={{
                  opacity: [0, 0.4, 0],
                  x: [0, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 z-0 blur-md"
                style={{ color: `${hero.accent}55` }}
                aria-hidden="true"
              >
                noTrainer AI
              </motion.span>

              <span className="relative z-10 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                noTrainer
              </span>

              <motion.span
                className="relative z-10 ml-4 bg-[length:200%_auto] bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to top right, ${hero.accent}, #3399ff, ${hero.accent})`,
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                AI
                <span
                  className="absolute -inset-2 -z-10 animate-pulse blur-2xl"
                  style={{ backgroundColor: `${hero.accent}33` }}
                />
              </motion.span>
            </motion.h1>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "6rem" }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="mt-4 h-1.5"
              style={{
                backgroundColor: hero.accent,
                boxShadow: `0 0 20px ${hero.accent}cc`,
              }}
            />

            <p className="mt-5 max-w-md text-lg font-semibold text-slate-200 md:text-xl">
              Train Anywhere.{" "}
              <span className="font-semibold" style={{ color: hero.accent }}>
                No Trainer Needed.
              </span>
            </p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative mt-12 w-full max-w-3xl overflow-hidden p-8 shadow-xl"
              style={{ backgroundColor: hero.cardBg, color: hero.cardText }}
            >
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: hero.cardText }}
              />
              <span
                className="mb-2 block text-left text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: hero.cardText }}
              >
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
                    className="text-4xl font-black uppercase tracking-tight md:text-6xl"
                    style={{ color: hero.cardText }}
                  >
                    {words[wordIndex]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
              className="mt-12"
            >
              <ChevronDown
                className="h-8 w-8 opacity-70"
                style={{ color: hero.accent }}
              />
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
                Target Every{" "}
                <span style={{ color: muscle.accent }}>Muscle</span>
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
          className="snap-start"
          style={{
            position: "relative",
            width: "100%",
            // Enough scroll space for all cards to stack
            minHeight: `${features.length * 80}vh`,
            backgroundColor: feat.bg,
          }}
        >
          {/* PINNED HEADER: Stays fixed at the top */}
          <div
            style={{
              position: "sticky",
              top: HEADER_HEIGHT,
              height: "20vh",
              width: "100%",
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(to bottom, ${feat.bg} 60%, transparent)`,
            }}
          >
            <h2
              className="text-5xl font-black uppercase tracking-widest text-white md:text-7xl"
              style={{
                fontFamily: "'Krona One', sans-serif",
                textShadow: `0 10px 30px ${feat.accent}40`,
              }}
            >
              Features
            </h2>
          </div>

          {/* SCROLLING CARDS CONTAINER */}
          <div className="relative z-10 flex w-full flex-col items-center px-4 md:px-8">
            <style
              dangerouslySetInnerHTML={{
                __html: `
      .stack-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 1000px;
        padding: 0;
        list-style: none;
      }
      .stack-item {
        position: sticky;
        height: 50vh;
        min-height: 400px;
        perspective: 1000px;
        margin-bottom: 12vh;
      }
      .stack-item-inner {
        width: 100%;
        height: 100%;
        border-radius: 24px;
        transform-origin: 50% 0%;
        animation: card-stack linear forwards;
        animation-timeline: view();
        animation-range: exit-crossing 0% exit-crossing 100%;
        overflow: hidden;
      }
      @keyframes card-stack {
        to {
          transform: scale(0.9) translateY(-20px);
          filter: brightness(0.4);
        }
      }
    `,
              }}
            />

            <ul className="stack-container">
              {features.map((feature, idx) => {
                // Premium modern gradients instead of flat neons
                const cardStyles = [
                  { bg: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }, // Indigo to Violet
                  { bg: "linear-gradient(135deg, #059669 0%, #10B981 100%)" }, // Emerald
                  { bg: "linear-gradient(135deg, #E11D48 0%, #F43F5E 100%)" }, // Rose
                  { bg: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)" }, // Amber
                  { bg: "linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)" }, // Sky Blue
                ];
                const style = cardStyles[idx % cardStyles.length];

                return (
                  <li
                    key={idx}
                    className="stack-item"
                    style={{
                      zIndex: idx + 1,
                      // Stagger: each card stops slightly lower
                      top: `calc(25vh + ${idx * 20}px)`,
                    }}
                  >
                    <div
                      className="stack-item-inner flex flex-col justify-between p-8 shadow-2xl md:p-12 relative"
                      style={{
                        background: style.bg,
                        color: "#ffffff",
                        boxShadow:
                          "0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      <div className="z-10 relative">
                        {/* Glassmorphic Icon Container */}
                        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-inner">
                          <feature.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-sm">
                          {feature.title}
                        </h3>
                      </div>

                      <div className="z-10 relative">
                        <p className="text-lg md:text-xl font-medium leading-relaxed text-white/90 max-w-2xl drop-shadow-sm">
                          {feature.description}
                        </p>
                      </div>

                      {/* Repositioned subtle background number */}
                      <span className="pointer-events-none absolute -bottom-6 -right-2 select-none text-[140px] md:text-[200px] font-black leading-none text-white/10">
                        0{idx + 1}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* BOTTOM SECTION */}
          <div
            className="flex w-full flex-col items-center justify-center pt-32 pb-40"
            style={{ perspective: "1000px" }}
          >
            <h2
              className="text-center text-[10vw] md:text-[8vw] font-[200] uppercase leading-[0.9] tracking-tighter text-white"
              style={{
                fontFamily: "'Krona One', sans-serif",
                textShadow: `0 0 60px ${feat.accent}66`,
                transform: "rotateX(10deg)",
              }}
            >
              No Excuses.
              <br />
              <span style={{ color: feat.accent, fontWeight: "800" }}>
                Just Results.
              </span>
            </h2>

            <div
              className="mt-12 h-1 w-24 md:w-48 rounded-full"
              style={{
                backgroundColor: feat.accent,
                boxShadow: `0 0 30px 2px ${feat.accent}`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
