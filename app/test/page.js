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
  Trophy,
  ArrowRight,
} from "lucide-react";

import FrontView from "@/components/anatomy/FrontView";

// ============================================
// DARKER & SOLID COLOR THEME (NO OPACITY)
// ============================================
const theme = {
  primary: "#0284c7", // Deep Sky Blue
  secondary: "#7c3aed", // Deep Violet
  accent: {
    success: "#059669", // Deep Emerald
    orange: "#ea580c", // Deep Orange
    pink: "#db2777", // Deep Pink
    yellow: "#ca8a04", // Deep Yellow
  },
};

const features = [
  {
    title: "Custom Workout Wizard",
    description:
      "Select body muscles from an interactive diagram and generate relevant workouts instantly.",
    icon: <Wand2 className="w-8 h-8 text-white" />,
    color: theme.primary,
  },
  {
    title: "SVG Muscle Selection",
    description:
      "Interactive human body diagram lets you visually select muscle groups for intuitive discovery.",
    icon: <UserCircle className="w-8 h-8 text-white" />,
    color: theme.secondary,
  },
  {
    title: "Rich Workout Dataset",
    description:
      "A continuously growing collection of exercises categorized by muscle and goals.",
    icon: <Database className="w-8 h-8 text-white" />,
    color: theme.accent.pink,
  },
  {
    title: "Health Calculators",
    description:
      "BMI, calorie needs, and protein intake calculated instantly with modern formulas.",
    icon: <Calculator className="w-8 h-8 text-white" />,
    color: theme.accent.success,
  },
  {
    title: "24/7 Fitness Chatbot",
    description:
      "Ask fitness or nutrition questions anytime with an intelligent assistant.",
    icon: <MessageSquare className="w-8 h-8 text-white" />,
    color: theme.accent.orange,
  },
  {
    title: "Workout Kanban Board",
    description:
      "Organize workouts and fitness tasks using a visual Kanban board.",
    icon: <Columns3 className="w-8 h-8 text-white" />,
    color: theme.primary,
  },
  {
    title: "Mini Games",
    description:
      "Simple games designed to improve focus and keep motivation high between workouts.",
    icon: <Gamepad2 className="w-8 h-8 text-white" />,
    color: theme.secondary,
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

  const anatomyBoxRef = useRef(null);
  const snapContainerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
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
        solution:
          "Train anywhere with bodyweight workouts and home equipment routines.",
        icon: <MapPin size={24} />,
        color: theme.accent.orange,
      },
      {
        id: 2,
        text: "Too expensive",
        solution: "Free workout plans and nutrition calculators.",
        icon: <Calculator size={24} />,
        color: theme.primary,
      },
      {
        id: 3,
        text: "Don't know how",
        solution: "Step-by-step exercise guides with photos.",
        icon: <Info size={24} />,
        color: theme.secondary,
      },
      {
        id: 4,
        text: "Need privacy",
        solution: "AI trainer available 24/7 with no judgment.",
        icon: <MessageSquare size={24} />,
        color: theme.accent.pink,
      },
      {
        id: 5,
        text: "Lack of knowledge",
        solution:
          "800+ exercises with difficulty levels and detailed instructions.",
        icon: <Dumbbell size={24} />,
        color: theme.secondary,
      },
      {
        id: 6,
        text: "Can't go out",
        solution: "Effective home workouts designed for any space.",
        icon: <Zap size={24} />,
        color: theme.accent.yellow,
      },
      {
        id: 7,
        text: "Need structure",
        solution: "Organized workout plans with Kanban Board tracking.",
        icon: <LayoutDashboard size={24} />,
        color: theme.primary,
      },
      {
        id: 8,
        text: "No motivation",
        solution: "Motivation Marquee wont let you rest.",
        icon: <Target size={24} />,
        color: theme.accent.orange,
      },
      {
        id: 9,
        text: "No equipment",
        solution: "Build strength with proven bodyweight training programs.",
        icon: <Package size={24} />,
        color: theme.accent.success,
      },
    ],
    [],
  );

  const selectedProblem = useMemo(
    () => problems.find((p) => p.id === selectedExcuseId) || problems[0],
    [problems, selectedExcuseId],
  );

  const handleMouseMove = (e) => {
    if (!anatomyBoxRef.current) return;
    const rect = anatomyBoxRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  if (!mounted) return null;

  return (
    <div className="relative w-full bg-slate-900 text-white font-sans selection:bg-sky-500 selection:text-white">
      <style>{`
        /* Import a highly unique, bold font for the brand */
        @import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .force-snap {
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }
        .force-snap > section {
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        /* HARDCODED SVG SIZING */
        .anatomy-svg-wrapper svg {
          width: 420px !important;
          height: 520px !important;
          max-width: 100%;
          display: block;
          margin: 0 auto;
          cursor: pointer;
        }
      `}</style>

      {/* SNAP CONTAINER */}
      <div
        ref={snapContainerRef}
        className="force-snap overflow-y-scroll no-scrollbar relative z-10"
        style={{ height: "93.5vh" }}
      >
        {/* SECTION 1: BRAND */}
        <section
          className="w-full flex flex-col justify-center items-center relative px-6 bg-slate-900"
          style={{ height: "93.5vh" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center flex flex-col items-center"
          >
            <h1
              className="text-7xl md:text-9xl text-white drop-shadow-lg"
              style={{ fontFamily: "'Righteous', cursive" }}
            >
              noTrainer
            </h1>
            <div className="h-3 w-40 mx-auto mt-8 bg-sky-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.5)]" />

            {/* Scroll Hint Arrow */}
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="mt-24"
            >
              <ChevronDown
                className="w-12 h-12 text-sky-500"
                strokeWidth={2.5}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* SECTION 2: TEXT ROTATE */}
        <section
          className="w-full flex flex-col justify-center items-center relative px-4 bg-slate-800"
          style={{ height: "93.5vh" }}
        >
          <div className="w-full max-w-5xl rounded-[3rem] p-12 md:p-24 text-center bg-slate-900 border-2 border-slate-700 shadow-2xl hover:border-slate-600 transition-colors duration-300">
            <span className="text-md font-black uppercase tracking-[0.3em] text-violet-400 mb-8 block">
              The Platform
            </span>

            <div className="h-24 md:h-32 flex justify-center items-center overflow-hidden cursor-default">
              <AnimatePresence mode="wait">
                <motion.div
                  key={wordIndex}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white"
                >
                  {words[wordIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* SECTION 3: ANATOMY */}
        <section
          className="w-full flex flex-col justify-center items-center px-6 bg-slate-900"
          style={{ height: "93.5vh" }}
        >
          <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col justify-center">
              {/* Force one line */}
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight tracking-tight whitespace-nowrap">
                Target Every Muscle
              </h2>
              <p className="text-slate-400 text-xl mb-10 font-medium">
                Click or hover the diagram to instantly build routines focused
                on specific muscle groups.
              </p>

              {selectedMuscle ? (
                <div className="rounded-3xl border-4 border-emerald-500 bg-slate-800 p-8 shadow-xl inline-block self-start hover:scale-105 transition-transform cursor-default">
                  <div className="text-sm uppercase tracking-widest text-emerald-400 font-black mb-2">
                    Selected
                  </div>
                  <div className="text-4xl font-black text-white capitalize">
                    {String(selectedMuscle)}
                  </div>
                </div>
              ) : (
                <div className="inline-flex items-center gap-3 rounded-full bg-emerald-600 px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg self-start">
                  <Activity size={20} />
                  Hover to explore
                </div>
              )}
            </div>

            <div
              ref={anatomyBoxRef}
              onMouseMove={handleMouseMove}
              className="relative h-[65vh] w-full flex items-center justify-center"
            >
              <AnimatePresence>
                {highlightedMuscle && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: mousePos.x + 20,
                      y: mousePos.y - 40,
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-0 left-0 z-50 pointer-events-none px-5 py-2.5 rounded-xl bg-sky-500 text-white font-black uppercase tracking-widest text-xs shadow-xl"
                  >
                    {highlightedMuscle}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="anatomy-svg-wrapper h-full w-full flex items-center justify-center hover:scale-105 transition-transform duration-500">
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
        </section>

        {/* SECTION 4: PROBLEM -> SOLUTION */}
        <section
          className="w-full flex flex-col justify-center items-center px-6 bg-slate-800"
          style={{ height: "93.5vh" }}
        >
          <div className="max-w-6xl w-full flex flex-col h-full max-h-[75vh] justify-center pt-8">
            {/* FIXED HEADING */}
            <div className="flex items-center justify-center gap-6 mb-12 shrink-0">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                Problems
              </h2>
              <ArrowRight className="w-10 h-10 text-sky-500" strokeWidth={3} />
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-sky-400">
                Solutions
              </h2>
            </div>

            {/* SCROLLABLE GRID CONTAINER */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column: Strictly Scrolling Problems */}
              <div className="h-full overflow-y-auto no-scrollbar pr-2 pb-4 space-y-3">
                {problems.map((problem) => {
                  const active = problem.id === selectedExcuseId;
                  return (
                    <button
                      key={problem.id}
                      onClick={() => setSelectedExcuseId(problem.id)}
                      className={`w-full flex items-center gap-5 p-5 rounded-2xl transition-all duration-200 text-left active:scale-[0.98] ${
                        active
                          ? "bg-slate-900 shadow-xl border-2"
                          : "bg-slate-700 hover:bg-slate-600 border-2 border-transparent"
                      }`}
                      style={{
                        borderColor: active ? problem.color : "transparent",
                      }}
                    >
                      <div
                        className={`p-3 rounded-xl flex items-center justify-center ${active ? "text-white" : "text-slate-300"}`}
                        style={{
                          backgroundColor: active ? problem.color : "#334155",
                        }}
                      >
                        {React.cloneElement(problem.icon, {
                          size: 24,
                          strokeWidth: active ? 3 : 2,
                        })}
                      </div>
                      <span
                        className={`text-xl font-black uppercase tracking-tight ${active ? "text-white" : "text-slate-300"}`}
                      >
                        {problem.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Fixed Solution */}
              <div className="h-full flex flex-col">
                <div className="flex-1 flex flex-col justify-center p-12 rounded-[2.5rem] bg-slate-900 shadow-2xl border border-slate-700 transition-colors duration-300 relative overflow-hidden cursor-default">
                  <div
                    className="absolute top-0 left-0 right-0 h-4"
                    style={{ backgroundColor: selectedProblem.color }}
                  />
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg transition-colors duration-300"
                    style={{ backgroundColor: selectedProblem.color }}
                  >
                    {React.cloneElement(selectedProblem.icon, {
                      size: 40,
                      strokeWidth: 2.5,
                    })}
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-white uppercase leading-none mb-6 tracking-tight">
                    {selectedProblem.text}
                  </h3>
                  <p className="text-2xl font-medium text-slate-300 leading-relaxed">
                    {selectedProblem.solution}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: FEATURES */}
        <section
          className="w-full flex flex-col overflow-hidden bg-slate-900"
          style={{ height: "93.5vh" }}
        >
          <div className="h-[25%] w-full flex items-end justify-center pb-12">
            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase drop-shadow-lg">
              Features
            </h2>
          </div>

          <div className="h-[75%] w-full relative overflow-hidden flex items-start pt-4">
            <div className="flex animate-scroll-features hover:[animation-play-state:paused]">
              {[...features, ...features].map((feature, idx) => (
                <div
                  key={idx}
                  className="h-[400px] w-[340px] md:w-[400px] mx-6 flex-shrink-0 group cursor-pointer transition-all duration-300 hover:-translate-y-4 hover:shadow-2xl rounded-[2.5rem] p-10 flex flex-col relative overflow-hidden text-white shadow-xl"
                  style={{ backgroundColor: feature.color }}
                >
                  <div className="mb-auto z-10">
                    <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-md transition-transform group-hover:scale-110 group-hover:rotate-3">
                      {feature.icon}
                    </div>
                    <h3 className="text-3xl font-black uppercase leading-tight mb-4 tracking-tight">
                      {feature.title}
                    </h3>
                  </div>

                  <div className="mt-auto z-10">
                    <p className="text-white/90 font-medium text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <span className="absolute -bottom-8 -right-4 text-[180px] font-black text-slate-900/20 leading-none select-none pointer-events-none transition-transform group-hover:scale-110">
                    {(idx % features.length) + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <style jsx>{`
            @keyframes scrollFeatures {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .animate-scroll-features {
              animation: scrollFeatures 45s linear infinite;
              width: max-content;
            }
          `}</style>
        </section>
      </div>
    </div>
  );
};

export default Hero;
