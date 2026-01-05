"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Zap,
  Dumbbell,
  LayoutDashboard,
  Calculator,
  MessageSquare,
  Target,
  Info,
  MapPin,
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const excuses = [
    {
      id: 1,
      text: "Gym too far / Cold outside",
      solution: "Transform your home into the perfect gym space with our AI-powered workout wizard. No weather, no travel, just results.",
      icon: <MapPin size={28} />,
      color: "bg-yellow-400",
      textColor: "text-gray-900",
    },
    {
      id: 2,
      text: "Expensive gym fees",
      solution: "Get everything you need for free. Premium calculators, tracking tools, and personalized workouts without subscriptions.",
      icon: <Calculator size={28} />,
      color: "bg-yellow-400",
      textColor: "text-gray-900",
    },
    {
      id: 3,
      text: "Wrong workouts don't help",
      solution: "Every exercise includes posture cues, photo references, and muscle targeting so you train correctly every time.",
      icon: <Info size={28} />,
      color: "bg-yellow-400",
      textColor: "text-gray-900",
    },
    {
      id: 4,
      text: "Too introverted for help",
      solution: "Your AI trainer is available 24/7. Ask anything, anytime, without judgment or pressure.",
      icon: <MessageSquare size={28} />,
      color: "bg-yellow-400",
      textColor: "text-gray-900",
    },
    {
      id: 5,
      text: "No information available",
      solution: "Access 500+ exercises with difficulty levels, muscle focus, and step-by-step instructions.",
      icon: <Dumbbell size={28} />,
      color: "bg-yellow-400",
      textColor: "text-gray-900",
    },
    {
      id: 6,
      text: "Women who can't go out",
      solution: "Private, safe, and effective home workouts designed for your space and comfort.",
      icon: <Zap size={28} />,
      color: "bg-yellow-400",
      textColor: "text-gray-900",
    },
    {
      id: 7,
      text: "Need organization",
      solution: "Plan workouts, track progress, and stay consistent with built-in boards and goals.",
      icon: <LayoutDashboard size={28} />,
      color: "bg-yellow-400",
      textColor: "text-gray-900",
    },
    {
      id: 8,
      text: "Low motivation",
      solution: "Challenges, streaks, and rewards keep you engaged and progressing every day.",
      icon: <Target size={28} />,
      color: "bg-yellow-400",
      textColor: "text-gray-900",
    },
    {
      id: 9,
      text: "No equipment available",
      solution: "Effective bodyweight programs that build strength using nothing but your body.",
      icon: <Package size={28} />,
      color: "bg-yellow-400",
      textColor: "text-gray-900",
    },
  ];

  const muscleIds = useMemo(
    () => [
      "face", "traps", "shoulders", "chest", "neck", "biceps", 
      "forearms", "lats", "abdominals", "quadriceps", "calves", 
      "triceps", "hands",
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
    <section 
      className="min-h-screen bg-black text-white px-6 md:px-20 pt-8 pb-12 overflow-hidden relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      {/* Background Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/20 z-0" />

      <style>{glitchStyles}</style>

      {/* Content wrapper to stay above overlay */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 text-5xl md:text-6xl font-black uppercase">
            <h1>noTrainer</h1>
            <span className="text-yellow-400">/</span>
            <div className="bg-yellow-400 text-black px-4 py-1 rounded-lg">
              <TextRotate
                texts={["Home Gym", "Workout Reference", "Calculators", "Health AI", "Productivity Tools"]}
              />
            </div>
          </div>
          <div className="h-1 w-24 bg-yellow-400 mt-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Excuses Section */}
          <div className="lg:col-span-8">
            <h2 className="text-4xl font-black mb-2">What's Stopping You?</h2>
            <p className="text-gray-100 mb-6 font-medium">Pick the problem. We handle the solution.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {excuses.map((excuse) => (
                <motion.div
                  key={excuse.id}
                  layoutId={`excuse-${excuse.id}`}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedExcuse(excuse)}
                  className={`${excuse.color} ${excuse.textColor} p-6 rounded-lg border-2 border-black cursor-pointer shadow-lg`}
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    {excuse.icon}
                    <p className="text-sm font-bold uppercase">{excuse.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Anatomy Panel */}
          <div className="lg:col-span-4 max-w-sm mx-auto w-full">
            <div
              className={`relative h-[550px] border-4 border-yellow-400/20 bg-zinc-900/40 backdrop-blur-md rounded-xl flex items-center justify-center overflow-hidden transition-opacity duration-300 p-12 ${
                selectedExcuse ? "opacity-10" : "opacity-100"
              }`}
            >
              <motion.div
                animate={{ top: ["-2%", "102%"] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[2px] bg-green-400 z-20"
                style={{ boxShadow: "0 0 15px 2px rgba(74, 222, 128, 0.8)" }}
              />

              <FrontView
                onHover={setHighlightedMuscle}
                onLeave={() => setHighlightedMuscle(null)}
                onSelect={setSelectedMuscle}
                selectedMuscle={selectedMuscle}
                highlightedMuscle={highlightedMuscle}
                className="h-[340px] w-auto opacity-90 z-10 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedExcuse && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40"
              onClick={() => setSelectedExcuse(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div
                layoutId={`excuse-${selectedExcuse.id}`}
                className="relative bg-yellow-400 text-black p-8 md:p-12 rounded-xl max-w-2xl w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              >
                <button
                  onClick={() => setSelectedExcuse(null)}
                  className="absolute top-4 right-4 bg-black text-white p-2 rounded-lg hover:scale-110"
                >
                  <X size={20} />
                </button>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-black text-yellow-400 rounded-lg">{selectedExcuse.icon}</div>
                    <h3 className="text-3xl font-black uppercase">The Solution</h3>
                  </div>
                  <p className="text-xl md:text-2xl font-medium leading-relaxed italic border-l-4 border-black pl-4">
                    "{selectedExcuse.solution}"
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;