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


const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Wizard", href: "/wizard", icon: Dumbbell },
  { name: "Calculators", href: "/calculators", icon: Calculator },
  { name: "Game", href: "/game", icon: Gamepad2 },
  { name: "Kanban", href: "/kanban", icon: LayoutDashboard },
  { name: "Contact Us", href: "/contact", icon: Info },
];

const COLORS = {
  mint: "#F4B942",  // warm gold
  pink: "#7C3AED",  // vivid purple
  black: "#111827", // deep charcoal
  white: "#F9FAFB", // soft white
};

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  
  // Control states for the floating buttons
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen Logic
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen: ${e.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <>
      {/* Floating Toggle Button - Fixed to top-left */}
      <div className="fixed top-2 left-2 md:top-3 md:left-3 z-[110] flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full transition-colors duration-300"
          style={{
            backgroundColor: isOpen ? COLORS.black : COLORS.pink,
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.3)",
          }}
          aria-label="Toggle menu"
        >
          <div className="relative w-5 h-4 md:w-6 md:h-5">
            <motion.span
              animate={isOpen ? { rotate: 45, top: "50%", y: "-50%" } : { rotate: 0, top: "0%", y: "0%" }}
              className="absolute left-0 w-full h-0.5 rounded-full"
              style={{ backgroundColor: isOpen ? COLORS.mint : COLORS.white }}
            />
            <motion.span
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className="absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2 rounded-full"
              style={{ backgroundColor: isOpen ? COLORS.mint : COLORS.white }}
            />
            <motion.span
              animate={isOpen ? { rotate: -45, bottom: "50%", y: "50%" } : { rotate: 0, bottom: "0%", y: "0%" }}
              className="absolute left-0 w-full h-0.5 rounded-full"
              style={{ backgroundColor: isOpen ? COLORS.mint : COLORS.white }}
            />
          </div>
        </motion.button>

        <span
  className="text-sm md:text-sm bg-black font-bold uppercase tracking-[0.2em] hidden sm:block rounded-full px-4 py-2"
  style={{ color: isOpen ? COLORS.white : COLORS.white }}
>
  Menu
</span>

      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex items-center overflow-hidden"
            style={{ backgroundColor: COLORS.mint }}
          >
            

            {/* Main Menu Content */}
            <div className="w-full max-w-7xl mx-auto px-5 md:px-24 flex flex-col md:flex-row justify-center md:justify-between md:items-center gap-10 relative z-10">
              {/* Left Side */}
              <nav className="flex flex-col space-y-2 w-full md:w-auto">
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  const isActive = activeLink?.name === link.name;

                  return (
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
                        onClick={() => {
                          setIsOpen(false);
                          setActiveLink(null);
                        }}
                        className="group flex items-center gap-3 md:gap-8 py-2"
                      >
                        <span
                          className="text-sm md:text-lg font-mono font-bold min-w-[28px] md:min-w-[40px]"
                          style={{ color: COLORS.black, opacity: 0.55 }}
                        >
                          0{index + 1}
                        </span>

                        <div className="flex items-center gap-3 md:gap-5">
                          <div
                            className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border-2 rounded-full transition-colors duration-200"
                            style={{
                              borderColor: COLORS.black,
                              color: isActive ? COLORS.black : COLORS.mint,
                              backgroundColor: isActive ? COLORS.pink : COLORS.black,
                            }}
                          >
                            <Icon size={22} />
                          </div>

                          <div className="relative">
                            <span
                              className="text-2xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter transition-transform duration-200 block leading-none"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                color: isActive ? COLORS.pink : COLORS.black,
                                transform: isActive ? "translateX(12px)" : "translateX(0)",
                              }}
                            >
                              {link.name}
                            </span>

                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: isActive ? 1 : 0 }}
                              className="h-1 md:h-1.5 w-full mt-1 origin-left"
                              style={{ backgroundColor: COLORS.black }}
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
                      animate={{ opacity: 0.2, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      style={{ color: COLORS.pink }}
                      className="flex items-center justify-center"
                    >
                      <activeLink.icon size={300} strokeWidth={1.5} />
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