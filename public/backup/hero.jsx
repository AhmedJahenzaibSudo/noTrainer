"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Zap,
  Dumbbell,
  LayoutDashboard,
  Calculator,
  MessageSquare,
  Target,
  Info,
  ChevronRight,
  MapPin,
  RotateCcw,
  Package,
} from "lucide-react";

import FrontView from "@/components/anatomy/FrontView";
import { TextRotate } from "@/components/text-rotate";

const Hero = () => {
  const [glitchIds, setGlitchIds] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [highlightedMuscle, setHighlightedMuscle] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [selectedExcuse, setSelectedExcuse] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  /* ---------- Mount guard ---------- */
  useEffect(() => {
    setMounted(true);
  }, []);

  const excuses = [
    { 
      id: 1,
      text: "Gym too far / Cold outside", 
      solution: "Transform your home into the perfect gym space with our AI-powered workout wizard. No weather, no travel, just results.",
      icon: <MapPin size={20} />,
      features: ["Custom home workouts", "No equipment needed", "Any weather ready"]
    },
    { 
      id: 2,
      text: "Expensive gym fees", 
      solution: "Get everything you need for free. Premium calculators, tracking tools, and personalized workouts without the subscription.",
      icon: <Calculator size={20} />,
      features: ["Free health calculators", "No hidden fees", "Premium features free"]
    },
    { 
      id: 3,
      text: "Wrong workouts don't help", 
      solution: "Every exercise comes with detailed photo references and posture guides. Get it right the first time, every time.",
      icon: <Info size={20} />,
      features: ["Photo references", "Posture guides", "Step-by-step instructions"]
    },
    { 
      id: 4,
      text: "Too introverted for help", 
      solution: "Your 24/7 AI trainer never judges. Ask anything, anytime. Get personalized help without the social pressure.",
      icon: <MessageSquare size={20} />,
      features: ["24/7 AI support", "No judgment zone", "Instant answers"]
    },
    { 
      id: 5,
      text: "No information available", 
      solution: "Access our rich database of 500+ exercises with detailed instructions, muscle targets, and difficulty levels.",
      icon: <Dumbbell size={20} />,
      features: ["500+ exercises", "Muscle targeting", "Difficulty levels"]
    },
    { 
      id: 6,
      text: "Women who can't go out", 
      solution: "Private, safe, and effective workouts designed for your space. Your home is your sanctuary and gym.",
      icon: <Zap size={20} />,
      features: ["Privacy focused", "Home-based", "Women-specific programs"]
    },
    { 
      id: 7,
      text: "Need organization", 
      solution: "Built-in Kanban board to track workouts, set goals, and stay motivated. Organize your fitness journey like a pro.",
      icon: <LayoutDashboard size={20} />,
      features: ["Kanban tracking", "Goal setting", "Progress visualization"]
    },
    { 
      id: 8,
      text: "Low motivation", 
      solution: "Gamify your fitness with challenges, mini-games, and rewards. Stay engaged and motivated every day.",
      icon: <Target size={20} />,
      features: ["Daily challenges", "Motivation games", "Reward system"]
    },
    { 
      id: 9,
      text: "No equipment available", 
      solution: "Discover effective bodyweight workouts that require zero equipment. Build strength, flexibility, and endurance using just your body.",
      icon: <Package size={20} />,
      features: ["Bodyweight exercises", "Zero equipment needed", "Full-body workouts"]
    },
  ];

  const muscleIds = useMemo(
    () => [
      "face", "traps", "shoulders", "chest", "neck", 
      "biceps", "forearms", "lats", "abdominals", 
      "quadriceps", "calves", "triceps", "hands",
    ],
    []
  );

  /* ---------- Glitch logic ---------- */
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      const count = Math.floor(Math.random() * 3) + 1;
      const shuffled = [...muscleIds].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);

      setGlitchIds(selected);
      setTimeout(() => setGlitchIds([]), 100);
    }, 350);

    return () => clearInterval(interval);
  }, [mounted, muscleIds]);

  /* ---------- Handle excuse selection ---------- */
  const handleExcuseClick = (excuse) => {
    if (selectedExcuse?.id === excuse.id && isExpanded) {
      // If clicking the same expanded card, close it
      handleClose();
    } else {
      // Open new card
      setSelectedExcuse(excuse);
      setIsExpanded(false);
      setTimeout(() => setIsExpanded(true), 100);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setTimeout(() => setSelectedExcuse(null), 300);
  };

  /* ---------- Injected CSS ---------- */
  const glitchStyles = useMemo(() => {
    if (glitchIds.length === 0) return "";
    return glitchIds
      .map(
        (id) => `
        #${id.replace(/\s+/g, "\\ ")} {
          fill: #a3e635 !important;
          filter: drop-shadow(0 0 15px #a3e635) brightness(1.5);
          transform: translate(${Math.random() * 6 - 3}px, ${Math.random() * 4 - 2}px)
            skewX(${Math.random() * 8 - 4}deg);
          opacity: 1 !important;
          transition: none !important;
        }
      `
      )
      .join("");
  }, [glitchIds]);

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <section className="min-h-screen bg-[#050505] text-white pt-6 pb-10 px-6 md:px-20 flex flex-col overflow-hidden">
      <style>{glitchStyles}</style>

      {/* ---------- HEADLINE ---------- */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 w-fit"
      >
        <div className="flex items-center gap-x-3 text-4xl md:text-5xl font-black tracking-tighter uppercase">
          <h1 className="text-white">noTrainer</h1>
          <span className="text-lime-400">/</span>
          <div className="text-slate-950 bg-lime-400 px-3 py-0.5">
            <TextRotate
              texts={["Home Gym", "Workout Reference", "Calculators", "Health AI"]}
              staggerDuration={0.02}
              rotation={0}
              mainClassName="rotate-0"
            />
          </div>
        </div>
        <div className="h-1 w-20 bg-lime-400 mt-2" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">
        
        {/* ---------- INTERACTIVE EXCUSES SECTION ---------- */}
        <div className="lg:col-span-8 space-y-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {isExpanded ? "Here's Your Solution" : "What's Stopping You?"}
            </h2>
            <p className="text-zinc-400 text-sm">
              {!isExpanded 
                ? "Select your excuse and we'll solve it for you" 
                : "noTrainer AI has the perfect solution for your challenge"}
            </p>
          </div>

          {/* Excuses Grid */}
          <div className="relative">
            <AnimatePresence>
              {!selectedExcuse ? (
                <motion.div
                  key="excuses-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-3 gap-4"
                >
                  {excuses.map((excuse, i) => (
                    <motion.div
                      key={excuse.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleExcuseClick(excuse)}
                      className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/40 backdrop-blur-sm rounded-xl border border-red-500/20 p-6 cursor-pointer hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 group min-h-[140px]"
                    >
                      <div className="flex flex-col items-center text-center gap-3 h-full justify-center">
                        <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                          <div className="text-red-400">
                            {excuse.icon}
                          </div>
                        </div>
                        <p className="text-sm font-medium text-zinc-300 leading-tight">
                          {excuse.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="expanded-card"
                  layoutId={`excuse-${selectedExcuse.id}`}
                  className="space-y-4"
                >
                  {/* Expanded Excuse Card */}
                  <motion.div
                    layout
                    className="bg-gradient-to-br from-zinc-900/60 to-zinc-800/40 backdrop-blur-sm rounded-xl border border-red-500/20 p-6 shadow-lg shadow-red-500/5 relative overflow-hidden"
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-transparent" />
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                            <div className="text-red-400">
                              {selectedExcuse.icon}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-red-400 mb-1">Your Challenge</h3>
                            <p className="text-zinc-300 text-lg">{selectedExcuse.text}</p>
                          </div>
                        </div>
                        <button
                          onClick={handleClose}
                          className="p-2 rounded-lg hover:bg-zinc-800 transition-colors group"
                        >
                          <X size={24} className="text-zinc-400 group-hover:text-red-400 transition-colors" />
                        </button>
                      </div>

                      {/* Solution Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-zinc-700/50 pt-6 mt-6"
                          >
                            <div className="bg-gradient-to-br from-lime-500/10 to-lime-500/5 backdrop-blur-sm rounded-xl border border-lime-500/20 p-6">
                              <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-full bg-lime-500/20 flex items-center justify-center flex-shrink-0">
                                  <Check size={24} className="text-lime-400" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-lime-400 mb-3">noTrainer Solution</h3>
                                  <p className="text-white text-base mb-4 leading-relaxed">
                                    {selectedExcuse.solution}
                                  </p>
                                  
                                  <div className="flex flex-wrap gap-2 mb-6">
                                    {selectedExcuse.features.map((feature, idx) => (
                                      <span
                                        key={idx}
                                        className="px-4 py-2 bg-lime-500/10 border border-lime-500/20 rounded-full text-sm font-medium text-lime-300"
                                      >
                                        {feature}
                                      </span>
                                    ))}
                                  </div>

                                  <button className="bg-lime-400 text-slate-950 font-bold py-3 px-8 rounded-xl flex items-center gap-2 hover:bg-lime-300 transition-all active:scale-[0.98] shadow-lg shadow-lime-500/20">
                                    Try This Solution <ChevronRight size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {/* Other Excuses (Minimized) */}
                  <div className="grid grid-cols-3 gap-3 opacity-50">
                    {excuses.filter(e => e.id !== selectedExcuse.id).map((excuse) => (
                      <div
                        key={excuse.id}
                        onClick={() => handleExcuseClick(excuse)}
                        className="bg-zinc-900/40 rounded-lg border border-zinc-800 p-3 cursor-pointer hover:border-zinc-700 hover:opacity-75 transition-all"
                      >
                        <div className="flex flex-col items-center text-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                            <div className="text-zinc-500 text-sm">
                              {excuse.icon}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ---------- SVG PANEL ---------- */}
        <div className="lg:col-span-4 flex flex-col h-full max-w-sm mx-auto lg:mx-0">
          <div className="bg-zinc-900/20 border border-white/10 rounded-sm relative h-[380px] flex items-center justify-center overflow-hidden p-4 group">
            
            {/* Scan Line Overlay */}
            <motion.div
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[2px] bg-lime-400/20 z-10 pointer-events-none"
            />

            {/* SVG Content */}
            <div className="relative w-full h-full flex items-center justify-center pointer-events-auto">
              <div className="scale-84 origin-center">
                <FrontView
                  onHover={(id) => setHighlightedMuscle(id)}
                  onLeave={() => setHighlightedMuscle(null)}
                  onSelect={(id) => setSelectedMuscle(id)}
                  selectedMuscle={selectedMuscle}
                  highlightedMuscle={highlightedMuscle}
                  className="h-[320px] w-auto transition-all duration-700 opacity-40 group-hover:opacity-100"
                />
              </div>
            </div>
          </div>

          {/* Compact Button */}
          <button className="bg-lime-400 p-3 mt-4 text-slate-950 font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white transition-all active:scale-[0.98]">
            Initialize Wizard <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;