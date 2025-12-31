"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  X,
  Zap,
  Dumbbell,
  LayoutDashboard,
  Calculator,
  MessageSquare,
  Target,
  Info,
  ChevronRight,
  MapPin,
} from "lucide-react";

import FrontView from "@/components/anatomy/FrontView";
import { TextRotate } from "@/components/ui/text-rotate";

const Hero = () => {
  const [glitchIds, setGlitchIds] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [highlightedMuscle, setHighlightedMuscle] = useState(null);
  const [mounted, setMounted] = useState(false);

  /* ---------- Mount guard ---------- */
  useEffect(() => {
    setMounted(true);
  }, []);

  const blueprint = [
    { prob: "Gym is too far / Cold outside", sol: "Make your house your gym", icon: <MapPin size={16} /> },
    { prob: "Expensive gym fees", sol: "Free Calculators & Tools", icon: <Calculator size={16} /> },
    { prob: "Wrong workouts don't help", sol: "Posture guides & Photo refs", icon: <Info size={16} /> },
    { prob: "Too introverted for help", sol: "24/7 AI Chatbot support", icon: <MessageSquare size={16} /> },
    { prob: "No information available", sol: "Rich dataset & Details", icon: <Dumbbell size={16} /> },
    { prob: "Women who can't go out", sol: "Custom Workout Wizard", icon: <Zap size={18} /> },
    { prob: "Need organization", sol: "Kanban & Tracking", icon: <LayoutDashboard size={16} /> },
    { prob: "Low motivation", sol: "Games & Challenges", icon: <Target size={16} /> },
  ];

  const muscleIds = useMemo(
    () => [
      "face", "traps", "shoulders", "chest", "neck", 
      "biceps", "forearms", "lats", "abdominals", 
      "quadriceps", "calves", "triceps", "hands",
    ],
    []
  );

  /* ---------- Glitch logic (Aggressive Multi-Glitch) ---------- */
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
              texts={["Home Gym", "House Gym", "Bio-Logic", "AI Logic"]}
              staggerDuration={0.02}
              rotation={0}
              mainClassName="rotate-0"
            />
          </div>
        </div>
        <div className="h-1 w-20 bg-lime-400 mt-2" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">
        
        {/* ---------- LIST (Expanded to 8 columns) ---------- */}
        <div className="lg:col-span-8 space-y-3">
          {blueprint.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-stretch group h-12 cursor-pointer"
            >
              <div className="w-1/2 bg-zinc-900/40 border-y border-l border-white/5 px-4 flex items-center gap-3">
                <X size={14} className="text-red-500/60" />
                <span className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-tight truncate">
                  {item.prob}
                </span>
              </div>

              <div className="w-1/2 bg-white/5 border border-white/10 px-4 flex items-center gap-3 group-hover:bg-lime-400 group-hover:border-lime-400 transition-all duration-200">
                <div className="text-lime-400 group-hover:text-slate-950">
                  {item.icon}
                </div>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white group-hover:text-slate-950 truncate">
                  {item.sol}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ---------- SVG PANEL (RESIZED & COMPACT) ---------- */}
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
                /* Fixed height makes the SVG fill the smaller box perfectly */
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