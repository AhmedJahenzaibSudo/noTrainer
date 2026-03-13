"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Dumbbell,
  Gamepad2,
  LayoutDashboard,
  Info,
  Home,
} from "lucide-react";
import Link from "next/link";

const NEO_COLORS = {
  bg: "#120c52ff",
  text: "#FFFFFF",
  blue: "#3b82f6",
  red: "#ef4444",
  green: "#22c55e",
  purple: "#a855f7",
  pink: "#ec4899",
  orange: "#f97316",
};

const navLinks = [
  { name: "Home", href: "/", color: NEO_COLORS.blue, icon: Home },
  { name: "Wizard", href: "/wizard", color: NEO_COLORS.purple, icon: Dumbbell },
  { name: "Calculators", href: "/calculators", color: NEO_COLORS.orange, icon: Calculator },
  { name: "Game", href: "/game", color: NEO_COLORS.green, icon: Gamepad2 },
  { name: "Kanban", href: "/kanban", color: NEO_COLORS.pink, icon: LayoutDashboard },
  { name: "About", href: "/about", color: NEO_COLORS.red, icon: Info },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
      `}</style>

      {/* Toggle Button - inside marquee */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-[110] w-8 h-8 md:w-9 md:h-9 flex flex-col items-center justify-center gap-1 transition-all duration-300 active:scale-90"
        style={{
  backgroundColor: "#2563eb",
  border: isOpen
    ? "2px solid #ffffff"
    : "2px solid #60a5fa",
  boxShadow: isOpen
    ? "0 0 0 2px rgba(255,255,255,0.18), 0 0 18px rgba(37,99,235,0.55)"
    : "0 0 14px rgba(37,99,235,0.55)",
}}
        aria-label="Toggle menu"
      >
        <motion.span
          animate={
            isOpen
              ? { rotate: 45, y: 5.5, scaleX: 1.1 }
              : { rotate: 0, y: 0, scaleX: 1 }
          }
          className="h-0.5 w-4 md:w-5 rounded-full bg-white"
        />
        <motion.span
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          className="h-0.5 w-4 md:w-5 rounded-full bg-white"
        />
        <motion.span
          animate={
            isOpen
              ? { rotate: -45, y: -5.5, scaleX: 1.1 }
              : { rotate: 0, y: 0, scaleX: 1 }
          }
          className="h-0.5 w-4 md:w-5 rounded-full bg-white"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex items-center overflow-hidden"
            style={{ backgroundColor: NEO_COLORS.bg }}
          >
            <div className="w-full max-w-7xl mx-auto px-5 md:px-24 flex flex-col md:flex-row justify-center md:justify-between md:items-center gap-10 relative z-10">
              {/* Left Side */}
              <nav className="flex flex-col space-y-2 w-full md:w-auto">
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  const isActive = activeLink?.name === link.name;

                  return (
                    <motion.div
                      key={link.name}
                      onMouseEnter={() => !isMobile && setActiveLink(link)}
                      onMouseLeave={() => !isMobile && setActiveLink(null)}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.2 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => {
                          setIsOpen(false);
                          setActiveLink(null);
                        }}
                        className="group flex items-center gap-3 md:gap-8 py-2"
                      >
                        <span className="text-sm md:text-lg font-mono font-bold text-white/60 min-w-[28px] md:min-w-[40px]">
                          0{index + 1}
                        </span>

                        <div className="flex items-center gap-3 md:gap-5">
                          <div
                            className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border"
                            style={{
                              borderColor: `${link.color}55`,
                              color: link.color,
                              backgroundColor: `${link.color}12`,
                            }}
                          >
                            <Icon size={isMobile ? 18 : 22} />
                          </div>

                          <div className="relative">
                            <span
                              className="text-2xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter transition-transform duration-200 block leading-none"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                color: isActive ? link.color : NEO_COLORS.text,
                                transform: isActive
                                  ? "translateX(12px)"
                                  : "translateX(0)",
                              }}
                            >
                              {link.name}
                            </span>

                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: isActive ? 1 : 0 }}
                              className="h-1 md:h-1.5 w-full mt-1 origin-left"
                              style={{ backgroundColor: link.color }}
                            />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Right Side Icon */}
              <div className="hidden lg:flex items-center justify-center absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none w-[380px] h-[380px]">
                <AnimatePresence mode="wait">
                  {activeLink && (
                    <motion.div
                      key={activeLink.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      style={{ color: activeLink.color }}
                      className="flex items-center justify-center"
                    >
                      <activeLink.icon size={300} strokeWidth={2} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;