"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Dumbbell,
  Gamepad2,
  LayoutDashboard,
  Info,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

const NEO_COLORS = {
  bg: "#120c52",
  text: "#FFFFFF",
  blue: "#3b82f6",
  red: "#ef4444",
  green: "#22c55e",
  purple: "#a855f7",
  pink: "#ec4899",
  orange: "#f97316",
};

const navLinks = [
  {
    name: "Workout Wizard",
    href: "/wizard",
    color: NEO_COLORS.purple,
    icon: Dumbbell,
    desc: "Generate instant workouts",
  },
  {
    name: "Calculators",
    href: "/calculators",
    color: NEO_COLORS.orange,
    icon: Calculator,
    desc: "BMI, calories & protein formulas",
  },
  {
    name: "Mini Games",
    href: "/game",
    color: NEO_COLORS.green,
    icon: Gamepad2,
    desc: "Boost your focus & motivation",
  },
  {
    name: "Kanban Board",
    href: "/kanban",
    color: NEO_COLORS.pink,
    icon: LayoutDashboard,
    desc: "Visual tracking for fitness tasks",
  },
  {
    name: "Contact Us",
    href: "/contact",
    color: NEO_COLORS.red,
    icon: Info,
    desc: "Get in touch with our team",
  },
];

const heroWords = ["Home Gym", "Workout Guide", "AI Trainer", "Fitness Hub"];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);

  // Rotate hero words every 2.5 seconds
  useEffect(() => {
    const textInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % heroWords.length);
    }, 2500);
    return () => clearInterval(textInterval);
  }, []);

  return (
    <div
      className="min-h-screen w-full text-white font-sans selection:bg-blue-500/30"
      style={{ backgroundColor: NEO_COLORS.bg }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Krona+One&family=Inter:wght@400;600;900&display=swap');
      `}</style>

      {/* 1. TOP HERO AREA (100vh) */}
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 text-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
          <div className="w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative text-6xl md:text-8xl lg:text-9xl tracking-tight"
            style={{ fontFamily: "'Krona One', sans-serif" }}
          >
            <span className="relative z-10 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              noTrainer
            </span>

            {/* Animated AI text */}
            <motion.span
              className="relative z-10 ml-4 md:ml-6 bg-[length:200%_auto] bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to top right, ${NEO_COLORS.blue}, #8b5cf6, ${NEO_COLORS.blue})`,
              }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              AI
              <span className="absolute -inset-2 -z-10 animate-pulse blur-2xl bg-blue-500/30" />
            </motion.span>
          </motion.h1>

          <p className="mt-6 max-w-xl text-lg md:text-2xl font-medium text-slate-300">
            Train Anywhere.{" "}
            <span className="font-bold text-blue-400">No Trainer Needed.</span>
          </p>

          {/* Rotating hero card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative mt-12 w-full max-w-lg overflow-hidden rounded-2xl bg-white/5 p-6 backdrop-blur-md border border-white/10 shadow-2xl"
          >
            <div className="flex h-16 md:h-20 items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={wordIndex}
                  initial={{ y: 50, opacity: 0, rotateX: -40 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  exit={{ y: -50, opacity: 0, rotateX: 40 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="text-3xl md:text-5xl font-black uppercase tracking-tighter"
                  style={{
                    color: NEO_COLORS.text,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {heroWords[wordIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="absolute bottom-12 flex flex-col items-center gap-2 opacity-70"
        >
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Scroll to Explore
          </span>
          <ChevronDown className="h-8 w-8 text-blue-400" />
        </motion.div>
      </div>

      {/* 2. MASSIVE NAVIGATION PANELS AREA */}
      <div className="relative z-10 w-full px-4 md:px-8 pb-32 max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-6 md:gap-8">
          {navLinks.map((link, index) => {
            const Icon = link.icon;

            return (
              <Link href={link.href} key={link.name} className="w-full">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex flex-col md:flex-row items-start md:items-center justify-between w-full min-h-[25vh] overflow-hidden rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 transition-all duration-500"
                  style={{
                    backgroundColor: `${link.color}15`,
                    border: `2px solid ${link.color}30`,
                  }}
                >
                  {/* Hover Background Glow */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-20 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${link.color} 0%, transparent 80%)`,
                    }}
                  />

                  {/* Left Side: Icon & Text */}
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12 w-full">
                    {/* Giant Icon */}
                    <motion.div
                      variants={{
                        hover: { scale: 1.1, rotate: 5 },
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex-shrink-0 flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-[2rem] shadow-2xl"
                      style={{
                        backgroundColor: link.color,
                        color: NEO_COLORS.bg,
                      }}
                    >
                      <Icon
                        size={64}
                        strokeWidth={2}
                        className="md:w-20 md:h-20"
                      />
                    </motion.div>

                    {/* Text Content */}
                    <div className="flex flex-col">
                      <h2
                        className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-4"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {link.name}
                      </h2>
                      <p className="text-xl md:text-3xl text-slate-300 font-medium opacity-80">
                        {link.desc}
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Action Arrow */}
                  <motion.div
                    variants={{
                      hover: { x: 10, y: -10, scale: 1.1 },
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative z-10 mt-10 md:mt-0 flex-shrink-0 flex items-center justify-center h-20 w-20 md:h-28 md:w-28 rounded-full border-4 transition-colors duration-300 self-end md:self-auto"
                    style={{
                      borderColor: `${link.color}50`,
                      color: link.color,
                    }}
                  >
                    <ArrowUpRight
                      size={40}
                      strokeWidth={2.5}
                      className="md:w-16 md:h-16"
                    />
                  </motion.div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
