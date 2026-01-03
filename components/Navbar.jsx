"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calculator, Dumbbell, Gamepad2, LayoutDashboard, Info, Home, X } from "lucide-react";
import Link from "next/link";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setActiveLink(null);
    }
  };

  const navLinks = [
    { 
      name: "Home", 
      href: "/", 
      icon: <Home size={40} />,
      desc: "Welcome to noTrainer. Your house, your gym.",
      details: ["24/7 Chatbot Support", "Daily Challenges", "Motivation"]
    },
    { 
      name: "Wizard", 
      href: "/wizard", 
      icon: <Dumbbell size={40} />,
      desc: "Custom workout generator based on your body.",
      details: ["SVG Muscle Selection", "Equipment Filtering", "Posture Guides"]
    },
    { 
      name: "Calculators", 
      href: "/calculators", 
      icon: <Calculator size={40} />,
      desc: "Track your health metrics precisely.",
      details: ["BMI & Calorie Tracker", "Ideal Body Weight", "Protein Intake"]
    },
    { 
      name: "Game", 
      href: "/game", 
      icon: <Gamepad2 size={40} />,
      desc: "Relax and focus with our mini-games.",
      details: ["Focus Exercises", "Relaxation Mode", "High Scores"]
    },
    { 
      name: "Kanban", 
      href: "/kanban", 
      icon: <LayoutDashboard size={40} />,
      desc: "Organize your fitness journey.",
      details: ["Task Tracking", "Workout Scheduling", "Progress Visualization"]
    },
    { 
      name: "About", 
      href: "/about", 
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
        className="fixed top-8 left-8 z-[100] w-14 h-14 rounded-full flex flex-col items-center justify-center gap-1.5 transition-all duration-500 bg-yellow-400 border-4 border-black shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
      >
        <motion.span
          animate={isOpen ? { rotate: 45, y: 8, width: "24px" } : { rotate: 0, y: 0, width: "22px" }}
          className="h-1 bg-black rounded-full"
        />
        <motion.span
          animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0, width: "18px" }}
          className="h-1 bg-black rounded-full"
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -8, width: "24px" } : { rotate: 0, y: 0, width: "22px" }}
          className="h-1 bg-black rounded-full"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: "circle(30px at 60px 60px)" }}
            animate={{ clipPath: "circle(150% at 60px 60px)" }}
            exit={{ clipPath: "circle(30px at 60px 60px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[90] bg-black"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="h-full flex items-center justify-between px-10 md:px-32"
            >
              {/* LEFT: Navigation Links */}
              <nav className="flex flex-col space-y-4 w-1/2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (index * 0.05) }}
                    onMouseEnter={() => setActiveLink(link)}
                    onMouseLeave={() => setActiveLink(null)}
                  >
                    <Link
                      href={link.href}
                      onClick={toggleMenu}
                      className="group flex items-center text-5xl md:text-7xl font-black tracking-tighter text-white hover:text-yellow-400 transition-all duration-200"
                    >
                      <div className="w-0 overflow-hidden group-hover:w-16 md:group-hover:w-24 transition-all duration-300 ease-out flex items-center">
                        <ArrowRight size={40} strokeWidth={3} className="text-yellow-400" />
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
                className="relative z-10 w-1/3 hidden lg:flex flex-col justify-center border-l-4 border-yellow-400 pl-16 h-[60vh]"
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
                      <div className="bg-yellow-400 border-4 border-black w-20 h-20 rounded-xl flex items-center justify-center">
                        <div className="text-black">{activeLink.icon}</div>
                      </div>
                      <h2 className="text-5xl font-black text-white">{activeLink.name}</h2>
                      <p className="text-xl text-white leading-relaxed font-bold">
                        {activeLink.desc}
                      </p>
                      <ul className="space-y-4">
                        {activeLink.details.map((detail, i) => (
                          <li key={i} className="flex items-center text-white text-sm font-black tracking-widest uppercase">
                            <span className="w-3 h-3 rounded-full bg-yellow-400 mr-3 border-2 border-black" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Close Button */}
              <button
                onClick={toggleMenu}
                className="absolute top-8 right-8 z-10 w-12 h-12 rounded-full bg-white border-4 border-black flex items-center justify-center hover:scale-110 transition-transform"
              >
                <X size={24} className="text-black" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;