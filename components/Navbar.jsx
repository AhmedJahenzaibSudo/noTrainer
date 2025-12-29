"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calculator, Dumbbell, Gamepad2, LayoutDashboard, Info, Home } from "lucide-react";
import Link from "next/link";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  // Increased base opacity from 0.05 to 0.15 for better visibility on dark bg
  const [activeColor, setActiveColor] = useState("rgba(255, 255, 255, 0.15)");
  const [showArrow, setShowArrow] = useState(false);

  const toggleMenu = () => {
    if (!isOpen) {
      setShowArrow(true);
      setTimeout(() => setIsOpen(true), 300); // Slightly faster trigger
    } else {
      setIsOpen(false);
      setShowArrow(false);
      setActiveColor("rgba(255, 255, 255, 0.15)");
      setActiveLink(null);
    }
  };

  const navLinks = [
    { 
      name: "Home", 
      href: "/", 
      color: "rgba(36, 120, 255, 0.6)", // Increased opacity
      icon: <Home size={40} />,
      desc: "Welcome to noTrainer. Your house, your gym.",
      details: ["24/7 Chatbot Support", "Daily Challenges", "Motivation"]
    },
    { 
      name: "Wizard", 
      href: "/wizard", 
      color: "rgba(168, 85, 247, 0.6)",
      icon: <Dumbbell size={40} />,
      desc: "Custom workout generator based on your body.",
      details: ["SVG Muscle Selection", "Equipment Filtering", "Posture Guides"]
    },
    { 
      name: "Calculators", 
      href: "/calculators", 
      color: "rgba(236, 72, 153, 0.6)",
      icon: <Calculator size={40} />,
      desc: "Track your health metrics precisely.",
      details: ["BMI & Calorie Tracker", "Ideal Body Weight", "Protein Intake"]
    },
    { 
      name: "Game", 
      href: "/game", 
      color: "rgba(34, 197, 94, 0.6)",
      icon: <Gamepad2 size={40} />,
      desc: "Relax and focus with our mini-games.",
      details: ["Focus Exercises", "Relaxation Mode", "High Scores"]
    },
    { 
      name: "Kanban", 
      href: "/kanban", 
      color: "rgba(249, 115, 22, 0.6)",
      icon: <LayoutDashboard size={40} />,
      desc: "Organize your fitness journey.",
      details: ["Task Tracking", "Workout Scheduling", "Progress Visualization"]
    },
    { 
      name: "About", 
      href: "/about", 
      color: "rgba(6, 182, 212, 0.6)",
      icon: <Info size={40} />,
      desc: "Why we built noTrainer.",
      details: ["Mission Statement", "Home Gym Philosophy", "Contact Team"]
    },
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-8 left-8 z-[100] w-14 h-14 rounded-full flex flex-col items-center justify-center gap-1.5 transition-all duration-500 bg-white/20 backdrop-blur-2xl border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95"
      >
        <motion.span
          animate={isOpen ? { rotate: 45, y: 8, width: "24px" } : { rotate: 0, y: 0, width: "22px" }}
          className="h-1 bg-white rounded-full shadow-[0_0_10px_white]"
        />
        <motion.span
          animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0, width: "18px" }}
          className="h-1 bg-white rounded-full shadow-[0_0_10px_white]"
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -8, width: "24px" } : { rotate: 0, y: 0, width: "22px" }}
          className="h-1 bg-white rounded-full shadow-[0_0_10px_white]"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed inset-0 z-[90] bg-zinc-950 flex items-center justify-between px-10 md:px-32 overflow-hidden"
          >
            {/* Dynamic Background Glow - Speed increased to 300ms */}
            <motion.div 
              className="absolute inset-0 transition-colors duration-300 ease-out"
              style={{ backgroundColor: activeColor }}
            />

            {/* LEFT: Navigation Links */}
            <nav className="relative z-10 flex flex-col space-y-6 w-1/2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (index * 0.05) }}
                  onMouseEnter={() => {
                    setActiveColor(link.color);
                    setActiveLink(link);
                  }}
                  onMouseLeave={() => setActiveColor("rgba(255, 255, 255, 0.15)")}
                >
                  <Link
                    href={link.href}
                    onClick={toggleMenu}
                    className="group flex items-center text-5xl md:text-7xl font-bold tracking-tighter text-white/60 hover:text-white transition-all duration-200"
                  >
                    <div className="w-0 overflow-hidden group-hover:w-16 md:group-hover:w-24 transition-all duration-300 ease-out flex items-center">
                      <ArrowRight size={40} strokeWidth={3} className="text-white" />
                    </div>
                    <span>{link.name}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* RIGHT: Preview Panel */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="relative z-10 w-1/3 hidden lg:flex flex-col justify-center border-l border-white/20 pl-16 h-[60vh]"
            >
              <AnimatePresence mode="wait">
                {activeLink && (
                  <motion.div
                    key={activeLink.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="text-white">{activeLink.icon}</div>
                    <h2 className="text-5xl font-black text-white">{activeLink.name}</h2>
                    <p className="text-xl text-white/90 leading-relaxed font-medium">
                      {activeLink.desc}
                    </p>
                    <ul className="space-y-4">
                      {activeLink.details.map((detail, i) => (
                        <li key={i} className="flex items-center text-white text-sm font-bold tracking-widest uppercase">
                          <span className="w-3 h-3 rounded-full bg-white mr-3 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;