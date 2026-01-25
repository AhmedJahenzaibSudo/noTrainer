"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Sparkles,
} from "lucide-react";

import FrontView from "@/components/anatomy/FrontView";
import { TextRotate } from "@/components/text-rotate";

const Hero = () => {
  const [glitchIds, setGlitchIds] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [highlightedMuscle, setHighlightedMuscle] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [selectedExcuseId, setSelectedExcuseId] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  const excuses = [
    {
      id: 1,
      text: "Gym too far / Cold outside",
      solution:
        "Transform your home into the perfect gym space with our AI-powered workout wizard. No weather, no travel, just results.",
      icon: <MapPin size={22} />,
    },
    {
      id: 2,
      text: "Expensive gym fees",
      solution:
        "Get everything you need for free. Premium calculators, tracking tools, and personalized workouts without subscriptions.",
      icon: <Calculator size={22} />,
    },
    {
      id: 3,
      text: "Wrong workouts don't help",
      solution:
        "Every exercise includes posture cues, photo references, and muscle targeting so you train correctly every time.",
      icon: <Info size={22} />,
    },
    {
      id: 4,
      text: "Too introverted for help",
      solution:
        "Your AI trainer is available 24/7. Ask anything, anytime, without judgment or pressure.",
      icon: <MessageSquare size={22} />,
    },
    {
      id: 5,
      text: "No information available",
      solution:
        "Access 500+ exercises with difficulty levels, muscle focus, and step-by-step instructions.",
      icon: <Dumbbell size={22} />,
    },
    {
      id: 6,
      text: "Women who can't go out",
      solution:
        "Private, safe, and effective home workouts designed for your space and comfort.",
      icon: <Zap size={22} />,
    },
    {
      id: 7,
      text: "Need organization",
      solution:
        "Plan workouts, track progress, and stay consistent with built-in boards and goals.",
      icon: <LayoutDashboard size={22} />,
    },
    {
      id: 8,
      text: "Low motivation",
      solution:
        "Challenges, streaks, and rewards keep you engaged and progressing every day.",
      icon: <Target size={22} />,
    },
    {
      id: 9,
      text: "No equipment available",
      solution:
        "Effective bodyweight programs that build strength using nothing but your body.",
      icon: <Package size={22} />,
    },
  ];

  const selectedExcuse = useMemo(
    () => excuses.find((e) => e.id === selectedExcuseId) || excuses[0],
    [selectedExcuseId]
  );

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

  const glitchStyles = useMemo(() => {
    if (!glitchIds.length) return "";
    return glitchIds
      .map(
        (id) => `
        #${id.replace(/\s+/g, "\\ ")} {
          fill: #22c55e !important;
          filter: drop-shadow(0 0 12px #22c55e);
          opacity: 1 !important;
        }
      `
      )
      .join("");
  }, [glitchIds]);

  if (!mounted) return null;

  return (
    <section className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-400/5 via-transparent to-transparent" />
      
      <style>{glitchStyles}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16">
        
        {/* 1. BRAND NAME - Big at top */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-yellow-400" />
            <Sparkles className="text-yellow-400" size={20} />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-yellow-400" />
          </div>
          
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-400 to-white">
              noTrainer
            </span>
          </h1>
          
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="h-1 w-20 bg-yellow-400 rounded-full" />
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400 font-bold">
              AI Powered
            </p>
            <div className="h-1 w-20 bg-yellow-400 rounded-full" />
          </div>
        </motion.div>

        {/* 2. TEXT ROTATION WINDOW */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="relative rounded-2xl border-2 border-yellow-400/30 bg-zinc-900/60 backdrop-blur-xl overflow-hidden">
            {/* Animated border glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 animate-pulse" />
            
            <div className="relative px-8 py-10 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-yellow-400 font-black mb-4">
                Your Complete Fitness Solution
              </p>
              
              <div className="text-4xl md:text-5xl lg:text-6xl font-black uppercase flex items-center justify-center gap-4">
                <TextRotate
                  texts={[
                    "Home Gym",
                    "Workout Reference",
                    "Calculators",
                    "Health AI",
                    "Productivity Tools",
                  ]}
                  className="text-yellow-400"
                />
              </div>
              
              <p className="mt-6 text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto">
                Everything you need to build strength, track progress, and achieve your fitness goals — all in one intelligent platform.
              </p>
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-yellow-400" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-yellow-400" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-yellow-400" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-yellow-400" />
          </div>
        </motion.div>

        {/* 3. SVG ANATOMY VIEWER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-md mx-auto mb-20"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-black uppercase mb-2">
              Target Every Muscle
            </h2>
            <p className="text-gray-400 font-medium">
              Precision anatomy mapping for optimal results
            </p>
          </div>

          <div className="relative h-[600px] border-4 border-yellow-400/30 bg-zinc-900/50 backdrop-blur-md rounded-2xl flex items-center justify-center overflow-hidden group hover:border-yellow-400/50 transition-all duration-300">
            {/* Scanning effect */}
            <motion.div
              animate={{ top: ["-2%", "102%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-green-400 to-transparent z-20"
              style={{ 
                boxShadow: "0 0 20px 3px rgba(74, 222, 128, 0.8)",
                filter: "blur(1px)"
              }}
            />

            {/* Status indicators */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-30">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_12px_2px_rgba(74,222,128,0.6)]" />
              <span className="text-xs uppercase tracking-wide text-green-400 font-black">
                Active Scan
              </span>
            </div>

            <div className="absolute top-4 right-4 z-30">
              <div className="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-lg border border-yellow-400/30">
                <span className="text-xs uppercase tracking-wide text-yellow-400 font-black">
                  3D Model
                </span>
              </div>
            </div>

            {/* Anatomy SVG */}
            <FrontView
              onHover={setHighlightedMuscle}
              onLeave={() => setHighlightedMuscle(null)}
              onSelect={setSelectedMuscle}
              selectedMuscle={selectedMuscle}
              highlightedMuscle={highlightedMuscle}
              className="h-[420px] w-auto opacity-90 z-10 transition-transform duration-500 group-hover:scale-105"
            />

            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none" 
              style={{
                backgroundImage: `
                  linear-gradient(0deg, transparent 24%, rgba(250, 204, 21, 0.05) 25%, rgba(250, 204, 21, 0.05) 26%, transparent 27%, transparent 74%, rgba(250, 204, 21, 0.05) 75%, rgba(250, 204, 21, 0.05) 76%, transparent 77%, transparent),
                  linear-gradient(90deg, transparent 24%, rgba(250, 204, 21, 0.05) 25%, rgba(250, 204, 21, 0.05) 26%, transparent 27%, transparent 74%, rgba(250, 204, 21, 0.05) 75%, rgba(250, 204, 21, 0.05) 76%, transparent 77%, transparent)
                `,
                backgroundSize: '50px 50px'
              }}
            />
          </div>

          {/* Muscle info display */}
          {(selectedMuscle || highlightedMuscle) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-xl text-center"
            >
              <p className="text-sm uppercase tracking-wide text-yellow-400 font-black">
                {selectedMuscle || highlightedMuscle}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* 4. PROBLEM → SOLUTION SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-16 bg-yellow-400" />
              <span className="text-sm uppercase tracking-[0.3em] text-yellow-400 font-black">
                Real Problems
              </span>
              <div className="h-px w-16 bg-yellow-400" />
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black uppercase mb-4">
              Problems <span className="text-yellow-400">→</span> Solutions
            </h2>
            <p className="text-xl text-gray-300 font-medium max-w-2xl mx-auto">
              Pick your challenge. See the solution. Start transforming today.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* PROBLEMS GRID */}
            <div className="rounded-2xl border-2 border-yellow-400/30 bg-zinc-900/50 backdrop-blur-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-yellow-400/20 flex items-center justify-between bg-gradient-to-r from-yellow-400/10 to-transparent">
                <div>
                  <p className="font-black uppercase tracking-wide text-lg text-yellow-400">
                    Common Barriers
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Click to explore solutions
                  </p>
                </div>
                <div className="px-3 py-1 bg-yellow-400/20 rounded-lg">
                  <p className="text-sm font-black text-yellow-400">
                    {excuses.length}
                  </p>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {excuses.map((excuse) => {
                    const active = excuse.id === selectedExcuseId;

                    return (
                      <motion.button
                        key={excuse.id}
                        type="button"
                        onClick={() => setSelectedExcuseId(excuse.id)}
                        whileHover={{ y: -3, scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className={[
                          "group rounded-xl border-2 text-left p-4 transition-all duration-200",
                          "min-h-[130px] flex flex-col justify-between relative overflow-hidden",
                          active
                            ? "bg-yellow-400 text-black border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)]"
                            : "bg-black/30 text-white border-yellow-400/20 hover:border-yellow-400/50 hover:bg-black/50",
                        ].join(" ")}
                      >
                        {/* Hover gradient */}
                        {!active && (
                          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}

                        <div className="relative z-10">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div
                              className={[
                                "shrink-0 rounded-lg p-2.5 transition-all",
                                active
                                  ? "bg-black text-yellow-400 shadow-lg"
                                  : "bg-yellow-400/10 text-yellow-400 group-hover:bg-yellow-400/20",
                              ].join(" ")}
                            >
                              {excuse.icon}
                            </div>

                            <div
                              className={[
                                "h-2.5 w-2.5 rounded-full transition-all",
                                active 
                                  ? "bg-black shadow-[0_0_8px_rgba(0,0,0,0.5)]" 
                                  : "bg-green-400/0 group-hover:bg-green-400",
                              ].join(" ")}
                            />
                          </div>

                          <p
                            className={[
                              "font-black uppercase tracking-wide leading-tight",
                              "text-[11px] md:text-[12px]",
                              active ? "text-black" : "text-white",
                            ].join(" ")}
                          >
                            {excuse.text}
                          </p>
                        </div>

                        {/* Active indicator */}
                        {active && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute bottom-0 left-0 right-0 h-1 bg-black"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SOLUTION PANEL */}
            <div className="rounded-2xl border-2 border-green-400/30 bg-zinc-900/50 backdrop-blur-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-green-400/20 flex items-center justify-between bg-gradient-to-r from-green-400/10 to-transparent">
                <p className="font-black uppercase tracking-wide text-lg text-green-400">
                  Your Solution
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_12px_2px_rgba(74,222,128,0.6)]" />
                  <span className="text-xs uppercase tracking-wide text-green-400 font-bold">
                    Ready
                  </span>
                </div>
              </div>

              <div className="p-8 min-h-[400px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedExcuse.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 w-full"
                  >
                    {/* Problem reference */}
                    <div className="flex items-start gap-4">
                      <div className="p-3.5 bg-gradient-to-br from-yellow-400 to-yellow-500 text-black rounded-xl shadow-lg">
                        {selectedExcuse.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1 font-bold">
                          Challenge
                        </p>
                        <h3 className="text-xl md:text-2xl font-black uppercase leading-tight text-white">
                          {selectedExcuse.text}
                        </h3>
                      </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent" />

                    {/* Solution */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <ChevronRight className="text-green-400" size={24} />
                        <p className="text-sm uppercase tracking-wider text-green-400 font-black">
                          How we solve it
                        </p>
                      </div>
                      
                      <p className="text-lg md:text-xl font-medium leading-relaxed text-gray-100 pl-8">
                        {selectedExcuse.solution}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="pt-4 pl-8">
                      <button
                        type="button"
                        className="group inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-xl font-black uppercase text-sm border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] transition-all duration-150"
                      >
                        Get Started Free
                        <ChevronRight 
                          size={20} 
                          className="group-hover:translate-x-1 transition-transform" 
                        />
                      </button>
                    </div>
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