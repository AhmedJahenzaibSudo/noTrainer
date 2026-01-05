"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calculator, Dumbbell, Gamepad2, LayoutDashboard, Info, Home } from "lucide-react";
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
      icon: <Home size={80} strokeWidth={1.5} />,
      desc: "Welcome to noTrainer. Your house, your gym.",
      details: ["24/7 Chatbot Support", "Daily Challenges", "Motivation"]
    },
    { 
      name: "Wizard", 
      href: "/wizard", 
      icon: <Dumbbell size={80} strokeWidth={1.5} />,
      desc: "Custom workout generator based on your body.",
      details: ["SVG Muscle Selection", "Equipment Filtering", "Posture Guides"]
    },
    { 
      name: "Calculators", 
      href: "/calculators", 
      icon: <Calculator size={80} strokeWidth={1.5} />,
      desc: "Track your health metrics precisely.",
      details: ["BMI & Calorie Tracker", "Ideal Body Weight", "Protein Intake"]
    },
    { 
      name: "Game", 
      href: "/game", 
      icon: <Gamepad2 size={80} strokeWidth={1.5} />,
      desc: "Relax and focus with our mini-games.",
      details: ["Focus Exercises", "Relaxation Mode", "High Scores"]
    },
    { 
      name: "Kanban", 
      href: "/kanban", 
      icon: <LayoutDashboard size={80} strokeWidth={1.5} />,
      desc: "Organize your fitness journey.",
      details: ["Task Tracking", "Workout Scheduling", "Progress Visualization"]
    },
    { 
      name: "About", 
      href: "/about", 
      icon: <Info size={80} strokeWidth={1.5} />,
      desc: "Why we built noTrainer.",
      details: ["Mission Statement", "Home Gym Philosophy", "Contact Team"]
    },
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-8 left-8 z-[100] w-14 h-14 rounded-full flex flex-col items-center justify-center gap-1.5 transition-all duration-300 bg-yellow-400 border-4 border-black shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-yellow-400/50 hover:scale-110 active:scale-95"
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
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }} 
            className="fixed inset-0 z-[90] bg-zinc-950"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full flex items-center justify-between px-10 md:px-32"
            >
              {/* LEFT: Navigation Links */}
              <nav className="flex flex-col space-y-2 w-full lg:w-1/2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (index * 0.04) }}
                    onMouseEnter={() => setActiveLink(link)}
                    onMouseLeave={() => setActiveLink(null)}
                  >
                    <Link
                      href={link.href}
                      onClick={toggleMenu}
                      className="group flex items-center text-6xl md:text-8xl font-black tracking-tighter text-zinc-500 hover:text-white transition-all duration-300"
                    >
                      <div className="w-0 overflow-hidden group-hover:w-16 md:group-hover:w-24 transition-all duration-300 ease-out flex items-center">
                        <ArrowRight size={48} strokeWidth={4} className="text-yellow-400" />
                      </div>
                      <span className="relative">
                        {link.name}
                        <span className="absolute left-0 -bottom-1 w-0 h-2 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* RIGHT: Preview Panel */}
              <motion.div 
                className="relative z-10 w-1/3 hidden lg:flex flex-col justify-center border-l border-white/10 pl-20 h-[70vh]"
              >
                <AnimatePresence mode="wait">
                  {activeLink ? (
                    <motion.div
                      key={activeLink.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      {/* Big Glowing Icon */}
                      <div className="text-yellow-400 filter drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] mb-4">
                        {activeLink.icon}
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter">
                          {activeLink.name}
                        </h2>
                        <p className="text-xl text-zinc-400 leading-relaxed max-w-sm">
                          {activeLink.desc}
                        </p>
                      </div>

                      <ul className="space-y-3">
                        {activeLink.details.map((detail, i) => (
                          <li key={i} className="flex items-center text-yellow-400 text-xs font-black tracking-[0.2em] uppercase">
                            <span className="w-8 h-[1px] bg-yellow-400 mr-3" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ) : (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.2 }}
                      className="text-white text-8xl font-black uppercase vertical-text tracking-tighter"
                    >
                      Menu
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;