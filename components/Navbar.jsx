"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Dumbbell, Gamepad2, LayoutDashboard, Info, Home } from "lucide-react";
import Link from "next/link";

const NEO_COLORS = {
  bg: "#120c52ff", // Deep Slate Blue
  text: "#FFFFFF",
  
  // Bright solid accent colors
  blue: "#3b82f6",
  red: "#ef4444",
  green: "#22c55e",
  purple: "#a855f7",
  pink: "#ec4899",
  orange: "#f97316",
};

const navLinks = [
  { name: "Home", href: "/", color: NEO_COLORS.blue, icon: <Home /> },
  { name: "Wizard", href: "/wizard", color: NEO_COLORS.purple, icon: <Dumbbell /> },
  { name: "Calculators", href: "/calculators", color: NEO_COLORS.orange, icon: <Calculator /> },
  { name: "Game", href: "/game", color: NEO_COLORS.green, icon: <Gamepad2 /> },
  { name: "Kanban", href: "/kanban", color: NEO_COLORS.pink, icon: <LayoutDashboard /> },
  { name: "About", href: "/about", color: NEO_COLORS.red, icon: <Info /> },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap');
      `}</style>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-8 left-8 z-[100] w-14 h-14 rounded-full flex flex-col items-center justify-center gap-1.5 transition-all active:scale-90"
        style={{
            backgroundColor: isOpen ? 'transparent' : '#0d27beff',
            border: isOpen ? 'none' : '2px solid rgba(70, 96, 190, 0.83)',
            boxShadow: isOpen ? 'none' : '0 4px 12px rgba(85, 63, 225, 0.69)'
        }}
      >
        <motion.span 
            animate={isOpen ? { rotate: 45, y: 7.5, backgroundColor: "#FFF" } : { rotate: 0, y: 0, backgroundColor: "#FFF" }} 
            className="h-0.5 w-6 rounded-full" 
        />
        <motion.span 
            animate={isOpen ? { opacity: 0 } : { opacity: 1, backgroundColor: "#FFF" }} 
            className="h-0.5 w-6 rounded-full" 
        />
        <motion.span 
            animate={isOpen ? { rotate: -45, y: -7.5, backgroundColor: "#FFF" } : { rotate: 0, y: 0, backgroundColor: "#FFF" }} 
            className="h-0.5 w-6 rounded-full" 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center overflow-hidden"
            style={{ backgroundColor: NEO_COLORS.bg }}
          >
            <div className="w-full max-w-7xl mx-auto px-12 md:px-24 flex justify-between items-center relative z-10">
              
              {/* Left Side: Navigation Links */}
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    onMouseEnter={() => setActiveLink(link)}
                    onMouseLeave={() => setActiveLink(null)}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center gap-8 py-2"
                    >
                      {/* Index */}
                      <span className="text-lg font-mono font-bold text-white/60">0{index + 1}</span>
                      
                      <div className="relative">
                        <span 
                          className="text-4xl md:text-6xl font-black uppercase tracking-tighter transition-transform duration-200 block"
                          style={{ 
                            fontFamily: "'Inter', sans-serif",
                            color: activeLink === link ? link.color : NEO_COLORS.text,
                            transform: activeLink === link ? "translateX(15px)" : "translateX(0)",
                          }}
                        >
                          {link.name}
                        </span>

                        {/* Flat Underline Bar */}
                        <motion.div 
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: activeLink === link ? 1 : 0 }}
                          className="h-1.5 w-full mt-1 origin-left"
                          style={{ backgroundColor: link.color }}
                        />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Right Side: Feature Icon (Real, Solid, Opaque) */}
              <div className="hidden lg:flex items-center justify-center absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none w-[450px] h-[450px]">
                <AnimatePresence mode="wait">
                  {activeLink && (
                    <motion.div
                      key={activeLink.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }} // Full Opacity
                      exit={{ opacity: 0, scale: 0.8 }}
                      style={{ color: activeLink.color }}
                      className="flex items-center justify-center"
                    >
                      {/* Using a thicker stroke to make it look like a solid UI element */}
                      {React.cloneElement(activeLink.icon, { 
                        size: 400, 
                        strokeWidth: 2
                      })}
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