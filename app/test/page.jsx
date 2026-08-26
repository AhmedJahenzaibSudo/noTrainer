"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
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
  Wand2,
  Database,
  Columns3,
  Gamepad2,
  ArrowRight,
} from "lucide-react";

import FrontView from "@/components/anatomy/FrontView";

/* =========================================================
   DESIGN CONFIG
========================================================= */

const CONFIG = {
  colors: {
    bg: "color(display-p3 0.056 0.958 0.949)",
    element: "color(display-p3 0.079 0.201 0.346)",
  },
  radius: {
    panel: "2rem",
    pill: "999px",
  },
};

const BG = CONFIG.colors.bg;
const ELEMENT = CONFIG.colors.element;

/* =========================================================
   DATA
========================================================= */

const heroTags = ["Home Gym", "Workout Guide", "AI Trainer", "Fitness Hub"];

const featureList = [
  { title: "Workout Wizard", description: "Select muscles and generate workouts.", icon: Wand2 },
  { title: "Rich Dataset", description: "Categorized exercises for all goals.", icon: Database },
  { title: "Calculators", description: "BMI, calories, and protein formulas.", icon: Calculator },
  { title: "AI Chatbot", description: "24/7 intelligent fitness assistant.", icon: MessageSquare },
  { title: "Kanban Board", description: "Visual tracking for fitness tasks.", icon: Columns3 },
  { title: "Mini Games", description: "Boost focus and motivation.", icon: Gamepad2 },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Hero = () => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [highlightedMuscle, setHighlightedMuscle] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const anatomyBoxRef = useRef(null);

  const problemList = useMemo(
    () => [
      { id: 1, text: "No gym access", solution: "Bodyweight & home equipment routines.", icon: MapPin },
      { id: 2, text: "Too expensive", solution: "Free workout plans & calculators.", icon: Calculator },
      { id: 3, text: "Don't know how", solution: "Step-by-step exercise guides.", icon: Info },
      { id: 4, text: "Need privacy", solution: "24/7 AI trainer, no judgment.", icon: MessageSquare },
      { id: 5, text: "Lack of knowledge", solution: "800+ exercises with instructions.", icon: Dumbbell },
      { id: 6, text: "Can't go out", solution: "Effective home workout programs.", icon: Zap },
      { id: 7, text: "Need structure", solution: "Visual Kanban Board tracking.", icon: LayoutDashboard },
      { id: 8, text: "No motivation", solution: "Motivation Marquee always on top.", icon: Target },
      { id: 9, text: "No equipment", solution: "Trainings with just your body weights.", icon: Package },
    ],
    []
  );

  const handlePointerMove = useCallback((e) => {
    if (!anatomyBoxRef.current) return;
    const rect = anatomyBoxRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setMousePos({ x: clientX - rect.left, y: clientY - rect.top });
  }, []);

  // Shared animation variants for staggered loading
  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: custom * 0.15 },
    }),
  };

  const sharedPanelClasses = "mx-auto w-full max-w-4xl overflow-hidden px-6 py-12 sm:px-12 sm:py-16";

  return (
    <main
      className="min-h-screen w-full flex flex-col gap-6 px-4 py-8 sm:px-6 md:py-12 lg:px-8 font-light antialiased"
      style={{ backgroundColor: BG, color: ELEMENT }}
    >
      {/* === PANEL 1: HEADER AREA === */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={panelVariants}
        className={`${sharedPanelClasses} flex flex-col items-center justify-center text-center`}
        style={{ backgroundColor: ELEMENT, color: BG, borderRadius: CONFIG.radius.panel }}
      >
        <h1 className="flex flex-wrap items-center justify-center text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight leading-none">
          <span>noTrainer</span>
          <span className="ml-2 md:ml-4 font-normal opacity-90">AI</span>
        </h1>

        <p className="mt-6 max-w-lg text-base sm:text-xl font-normal leading-relaxed opacity-90">
          Train Anywhere. <span className="font-semibold block sm:inline">No Trainer Needed.</span>
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {heroTags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 text-[10px] sm:text-xs font-medium uppercase tracking-wider border border-white/20"
              style={{ borderRadius: CONFIG.radius.pill }}
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* === PANEL 2: MUSCLE ANATOMY AREA === */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={panelVariants}
        className={`${sharedPanelClasses} flex flex-col items-center`}
        style={{ backgroundColor: BG, color: ELEMENT, borderRadius: CONFIG.radius.panel }}
      >
        <h2 className="mb-8 text-2xl sm:text-4xl font-light tracking-tight text-center">
           <span className="font-semibold">Target Every Muscle</span>
        </h2>

        <div className="mb-10 w-full max-w-xs rounded-full border border-white/20 bg-white/5 py-3 text-center backdrop-blur-sm">
          {selectedMuscle ? (
            <span className="text-sm sm:text-base font-medium capitalize tracking-wide">
              {String(selectedMuscle)}
            </span>
          ) : (
            <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] opacity-80">
              Select a Muscle
            </span>
          )}
        </div>

        <div
          ref={anatomyBoxRef}
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          className="
            relative flex w-full justify-center
            [&_svg]:block [&_svg]:h-auto
            [&_svg]:w-[250px] sm:[&_svg]:w-[320px] md:[&_svg]:w-[400px]
            [&_svg]:cursor-pointer
          "
        >
          <AnimatePresence>
            {highlightedMuscle && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, x: mousePos.x + 16, y: mousePos.y - 32 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="pointer-events-none absolute left-0 top-0 z-50 rounded-md bg-white px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-900 shadow-xl"
              >
                {highlightedMuscle}
              </motion.div>
            )}
          </AnimatePresence>

          <FrontView
            onHover={setHighlightedMuscle}
            onLeave={() => setHighlightedMuscle(null)}
            onSelect={setSelectedMuscle}
            selectedMuscle={selectedMuscle}
            highlightedMuscle={highlightedMuscle}
          />
        </div>
      </motion.div>

      {/* === PANEL 3: PROBLEMS TO SOLUTIONS LIST === */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={panelVariants}
        className={`${sharedPanelClasses} flex flex-col`}
        style={{ backgroundColor: ELEMENT, color: BG, borderRadius: CONFIG.radius.panel }}
      >
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl sm:text-4xl font-light uppercase tracking-widest">
            Solutions
          </h2>
        </div>

        <div className="flex flex-col">
          {problemList.map((problem) => {
            const Icon = problem.icon;
            return (
              <div
                key={problem.id}
                className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-5 border-b border-white/10 last:border-0"
              >
                <div className="flex items-center gap-3 sm:w-1/2">
                  <Icon size={20} className="opacity-70" />
                  <span className="font-semibold uppercase tracking-wider text-sm sm:text-base">
                    {problem.text}
                  </span>
                </div>

                <div className="hidden sm:flex items-center justify-center w-8">
                  <ArrowRight size={16} className="opacity-40" />
                </div>

                <div className="pl-8 sm:pl-0 sm:w-1/2">
                  <span className="text-sm sm:text-base font-medium opacity-90 leading-relaxed">
                    {problem.solution}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* === PANEL 4: FEATURES LIST === */}
      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={panelVariants}
        className={`${sharedPanelClasses} flex flex-col`}
        style={{ backgroundColor: ELEMENT, color: BG, borderRadius: CONFIG.radius.panel }}
      >
        <div className="mb-10">
          <h2 className="text-2xl sm:text-4xl font-light uppercase tracking-widest">
            Features
          </h2>
          <p className="mt-2 text-sm sm:text-base font-medium opacity-80">
            Everything you need to succeed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
          {featureList.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex items-start gap-4 py-5 border-b border-white/10 md:[&:nth-last-child(-n+2)]:border-0 last:border-0"
              >
                <div className="mt-1 flex-shrink-0 bg-white/10 p-2 rounded-lg">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg tracking-wide mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm font-semibold sm:text-base opacity-80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </main>
  );
};

export default Hero;