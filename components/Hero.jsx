"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Activity,
  ChevronUp,
  ChevronDown,
  Wand2,
  UserCircle,
  Database,
  Columns3,
  Gamepad2,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import FrontView from "@/components/anatomy/FrontView";
import { TextRotate } from "@/components/text-rotate";

// ============================================
// THEME
// ============================================
const theme = {
  primary: {
    main: "#06b6d4",
    light: "#22d3ee",
    dark: "#0891b2",
    glow: "rgba(6, 182, 212, 0.5)",
  },
  secondary: {
    main: "#3b82f6",
    light: "#60a5fa",
    dark: "#2563eb",
    glow: "rgba(59, 130, 246, 0.5)",
  },
  accent: {
    success: "#10b981",
    orange: "#f97316",
    purple: "#a855f7",
  },
  bg: {
    primary: "#000000",
    card: "#0f172a",
    cardLight: "#1e293b",
  },
  text: {
    primary: "#ffffff",
    secondary: "#94a3b8",
  },
  border: {
    default: "rgba(6, 182, 212, 0.2)",
  },
};

// ============================================
// FEATURES DATA
// ============================================
const features = [
  {
    title: "Custom Workout Wizard",
    description: "Select body muscles from an interactive SVG diagram and generate relevant workouts instantly.",
    icon: <Wand2 className="w-5 h-5" />,
  },
  {
    title: "SVG Muscle Selection",
    description: "Interactive human body diagram lets you visually select muscle groups for intuitive discovery.",
    icon: <UserCircle className="w-5 h-5" />,
  },
  {
    title: "Rich Workout Dataset",
    description: "A continuously growing collection of exercises categorized by muscle and goals.",
    icon: <Database className="w-5 h-5" />,
  },
  {
    title: "Health Calculators",
    description: "BMI, calorie needs, and protein intake calculated instantly with modern formulas.",
    icon: <Calculator className="w-5 h-5" />,
  },
  {
    title: "24/7 Fitness Chatbot",
    description: "Ask fitness or nutrition questions anytime with an intelligent assistant.",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    title: "Workout Kanban Board",
    description: "Organize workouts and fitness tasks using a visual Kanban board.",
    icon: <Columns3 className="w-5 h-5" />,
  },
  {
    title: "Mini Games",
    description: "Simple games designed to improve focus and keep motivation high between workouts.",
    icon: <Gamepad2 className="w-5 h-5" />,
  },
  {
    title: "Daily Challenges",
    description: "Fresh daily challenges that push consistency and encourage healthy habits.",
    icon: <Trophy className="w-5 h-5" />,
  }
];

const Hero = () => {
  // ======================
  // STATE
  // ======================
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [glitchIds, setGlitchIds] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [highlightedMuscle, setHighlightedMuscle] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedExcuseId, setSelectedExcuseId] = useState(1);
  const [isAtLastSection, setIsAtLastSection] = useState(false);

  // ======================
  // REFS
  // ======================
  const anatomyBoxRef = useRef(null);
  const featuresCarouselRef = useRef(null);
  const snapContainerRef = useRef(null);
  const sectionsRef = useRef([]);
  const isScrollingRef = useRef(false);

  // ======================
  // SECTIONS
  // ======================
  const sections = useMemo(
    () => [
      { key: "home", label: "Home", color: theme.primary.main },
      { key: "value", label: "Value", color: theme.secondary.main },
      { key: "anatomy", label: "Anatomy", color: theme.accent.success },
      { key: "solutions", label: "Solutions", color: theme.primary.light },
      { key: "features", label: "Features", color: theme.accent.purple },
    ],
    [],
  );

  // ======================
  // BACKGROUND ANIMATION PER SECTION
  // ======================
  const bgColor = sections[activeSection]?.color ?? theme.primary.main;

  // ======================
  // MOUNT EFFECT
  // ======================
  useEffect(() => {
    setMounted(true);
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  // ======================
  // SCROLL TO SECTION FUNCTION
  // ======================
  const scrollToSection = (index) => {
    if (isScrollingRef.current) return;
    if (index < 0 || index >= sections.length) return;

    isScrollingRef.current = true;
    setActiveSection(index);

    if (snapContainerRef.current) {
      const sectionHeight = window.innerHeight;
      snapContainerRef.current.scrollTo({
        top: index * sectionHeight,
        behavior: 'smooth'
      });
    }

    // Reset scrolling flag
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 500);
  };

  // ======================
  // HANDLE WHEEL SCROLL
  // ======================
  useEffect(() => {
    const handleWheel = (e) => {
      if (!snapContainerRef.current) return;
      
      const container = snapContainerRef.current;
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const isAtBottom = scrollTop + containerHeight >= container.scrollHeight - 10;
      
      // If at bottom of last section and scrolling down, let it scroll naturally to footer
      if (isAtBottom && activeSection === sections.length - 1 && e.deltaY > 0) {
        setIsAtLastSection(true);
        return;
      }
      
      // If at top and scrolling up from first section, do nothing
      if (scrollTop <= 0 && e.deltaY < 0) {
        return;
      }
      
      // Otherwise, handle the snap scroll
      e.preventDefault();
      
      if (e.deltaY > 0) {
        // Scroll down to next section
        scrollToSection(Math.min(activeSection + 1, sections.length - 1));
      } else if (e.deltaY < 0) {
        // Scroll up to previous section
        scrollToSection(Math.max(activeSection - 1, 0));
      }
    };

    const container = snapContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [activeSection, sections.length]);

  // ======================
  // HANDLE CONTAINER SCROLL
  // ======================
  const handleContainerScroll = () => {
    if (!snapContainerRef.current || isScrollingRef.current) return;
    
    const container = snapContainerRef.current;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const currentSection = Math.round(scrollTop / containerHeight);
    
    if (currentSection !== activeSection) {
      setActiveSection(currentSection);
    }
    
    // Check if at bottom
    const isAtBottom = scrollTop + containerHeight >= container.scrollHeight - 10;
    if (isAtBottom && activeSection === sections.length - 1) {
      setIsAtLastSection(true);
    } else {
      setIsAtLastSection(false);
    }
  };

  // ======================
  // CAROUSEL FUNCTIONS
  // ======================
  const scrollCarousel = (direction) => {
    if (!featuresCarouselRef.current) return;
    
    const cardWidth = 320;
    const gap = 24;
    const scrollAmount = (cardWidth + gap) * 2;
    
    const currentScroll = featuresCarouselRef.current.scrollLeft;
    const newScroll = direction === 'next' 
      ? currentScroll + scrollAmount
      : currentScroll - scrollAmount;
    
    featuresCarouselRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });
    
    const newIndex = Math.round(newScroll / (cardWidth + gap));
    setCurrentFeatureIndex(Math.max(0, Math.min(newIndex, features.length - 1)));
  };

  const goToFeature = (index) => {
    if (!featuresCarouselRef.current) return;
    
    const cardWidth = 320;
    const gap = 24;
    const scrollPosition = index * (cardWidth + gap);
    
    featuresCarouselRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    
    setCurrentFeatureIndex(index);
  };

  // ======================
  // PROBLEMS
  // ======================
  const problems = useMemo(
    () => [
      {
        id: 1,
        text: "No gym access",
        solution:
          "Train anywhere with bodyweight workouts and home equipment routines designed for maximum results.",
        icon: <MapPin size={22} />,
        color: theme.accent.orange,
      },
      {
        id: 2,
        text: "Too expensive",
        solution:
          "Free workout plans, progress tracking, and nutrition calculators - everything you need at zero cost.",
        icon: <Calculator size={22} />,
        color: theme.primary.main,
      },
      {
        id: 3,
        text: "Don't know how",
        solution:
          "Step-by-step exercise guides with photos, videos, and form tips for proper technique every time.",
        icon: <Info size={22} />,
        color: theme.secondary.main,
      },
      {
        id: 4,
        text: "Need privacy",
        solution:
          "AI trainer available 24/7 with no judgment or awkwardness - train on your own terms in your own space.",
        icon: <MessageSquare size={22} />,
        color: theme.accent.success,
      },
      {
        id: 5,
        text: "Lack of knowledge",
        solution:
          "500+ exercises with difficulty levels, muscle targeting, and detailed instructions to educate and empower you.",
        icon: <Dumbbell size={22} />,
        color: theme.accent.purple,
      },
      {
        id: 6,
        text: "Can't go out",
        solution:
          "Effective home workouts designed for any space - bedroom, living room, or backyard.",
        icon: <Zap size={22} />,
        color: theme.accent.orange,
      },
      {
        id: 7,
        text: "Need structure",
        solution:
          "Organized workout plans with progress tracking, goals, and accountability to keep you on track.",
        icon: <LayoutDashboard size={22} />,
        color: theme.primary.main,
      },
      {
        id: 8,
        text: "No motivation",
        solution:
          "Daily challenges, streaks, and achievement rewards that make fitness fun and keep you coming back.",
        icon: <Target size={22} />,
        color: theme.secondary.main,
      },
      {
        id: 9,
        text: "No equipment",
        solution:
          "Build strength with proven bodyweight training programs that require nothing but your commitment.",
        icon: <Package size={22} />,
        color: theme.accent.success,
      },
    ],
    [],
  );

  const selectedProblem = useMemo(
    () => problems.find((p) => p.id === selectedExcuseId) || problems[0],
    [problems, selectedExcuseId],
  );

  // ======================
  // GLITCH HIGHLIGHTS
  // ======================
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
    [],
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
          fill: ${theme.accent.success} !important;
          filter: drop-shadow(0 0 12px ${theme.accent.success});
          opacity: 1 !important;
        }
      `,
      )
      .join("");
  }, [glitchIds]);

  // ======================
  // ANATOMY TOOLTIP POSITION
  // ======================
  const handleMouseMove = (e) => {
    if (!anatomyBoxRef.current) return;
    const rect = anatomyBoxRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  if (!mounted) return null;

  return (
    <div className="relative w-full text-white" style={{
      backgroundColor: theme.bg.primary,
      fontFamily: "'Inter', sans-serif",
    }}>
      <style>{`
        /* Hide scrollbars */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .features-carousel::-webkit-scrollbar {
          display: none;
        }
        .features-carousel {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Force snap behavior */
        .force-snap {
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }
        .force-snap > section {
          scroll-snap-align: start;
        }
      `}</style>

      <style>{glitchStyles}</style>

      {/* ======================================
          FULL PAGE COLOR TRANSITION ANIMATION
         ====================================== */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.18 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle at center, ${bgColor}, transparent 70%)`,
          }}
        />
      </AnimatePresence>

      {/* Ambient dual glow for depth */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.10]"
        style={{
          background: `radial-gradient(circle at 15% 15%, ${theme.primary.glow}, transparent 55%),
                       radial-gradient(circle at 85% 70%, ${theme.secondary.glow}, transparent 55%)`,
        }}
      />

      {/* ======================================
          SIDE NAVIGATION (UP/DOWN + DOTS)
         ====================================== */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-6">
        <button
          onClick={() => scrollToSection(activeSection - 1)}
          disabled={activeSection === 0}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Go to previous section"
        >
          <ChevronUp size={20} />
        </button>

        <div className="flex flex-col gap-3 px-2 py-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
          {sections.map((s, i) => (
            <button
              key={s.key}
              onClick={() => scrollToSection(i)}
              className="group relative flex items-center justify-center"
              aria-label={`Go to ${s.label}`}
            >
              <motion.div
                animate={{
                  scale: activeSection === i ? 1.6 : 1,
                  backgroundColor:
                    activeSection === i
                      ? theme.primary.main
                      : "rgba(255,255,255,0.28)",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-2 h-2 rounded-full"
                style={{
                  boxShadow:
                    activeSection === i
                      ? `0 0 18px ${theme.primary.glow}`
                      : "none",
                }}
              />
              <span className="absolute right-8 px-2 py-1 rounded bg-black/80 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                {s.label}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            if (activeSection < sections.length - 1) {
              scrollToSection(activeSection + 1);
            }
          }}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          aria-label="Go to next section"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      {/* ======================================
          SNAP CONTAINER (5 sections with forced snap)
         ====================================== */}
      <div
        ref={snapContainerRef}
        onScroll={handleContainerScroll}
        className="force-snap h-screen overflow-y-scroll no-scrollbar relative z-10"
        style={{ height: '93.5vh' }}
      >
        {/* SECTION 1: BRAND */}
        <section 
          ref={el => sectionsRef.current[0] = el}
          className="h-screen w-full flex flex-col justify-start items-center relative px-6 overflow-hidden bg-black pt-44"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] rounded-full blur-[120px] opacity-30"
              style={{
                background: `radial-gradient(circle, ${theme.primary.main} 0%, transparent 70%)`,
              }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center z-10"
          >
            <h1
              className="text-6xl md:text-8xl lg:text-[8rem] font-extrabold tracking-tight leading-none"
              style={{
                fontFamily: "Inter, sans-serif",
                background: `linear-gradient(180deg, #ffffff 40%, ${theme.text.secondary} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              noTrainer
            </h1>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-[1px] w-32 mx-auto mt-8 bg-cyan-500 shadow-[0_0_15px_#06b6d4]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-28 flex flex-col items-center gap-6 z-20"
          >
            <span className="text-[12px] uppercase tracking-[0.8em] text-white font-bold drop-shadow-lg">
              Explore
            </span>

            <motion.div
              animate={{
                y: [0, 12, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ChevronDown size={32} className="text-cyan-400 stroke-[3px]" />
            </motion.div>
          </motion.div>
        </section>

        {/* SECTION 2: PLATFORM / TEXT ROTATE */}
        <section 
          ref={el => sectionsRef.current[1] = el}
          className="h-screen w-full flex flex-col justify-center items-center relative px-4 overflow-hidden bg-black"
        >
          <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
            <div
              className="w-[800px] h-[600px] rounded-full opacity-30 blur-[150px]"
              style={{
                background: `radial-gradient(circle, ${theme.primary.main} 0%, ${theme.secondary.main} 100%)`,
              }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-5xl z-10"
          >
            <div
              className="relative rounded-[3.5rem] px-4 py-24 text-center border border-white/10 overflow-hidden"
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(50px) saturate(200%)",
                boxShadow: "inset 0 0 40px rgba(255,255,255,0.02)",
              }}
            >
              <div className="flex flex-col items-center justify-center relative z-10">
                <span className="text-[12px] font-black uppercase tracking-[0.8em] text-cyan-400 mb-14 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
                  The Platform
                </span>

                <div className="w-full flex justify-center items-center">
                  <div className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                    <TextRotate
                      texts={[
                        "Home Gym",
                        "Workout Guide",
                        "AI Trainer",
                        "AI Help",
                        "Fitness Hub",
                      ]}
                      className="whitespace-nowrap py-2"
                      mainClassName="flex flex-col items-center justify-center overflow-visible"
                      staggerDuration={0.02}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 200,
                      }}
                      rotationInterval={3000}
                    />
                  </div>
                </div>

                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "160px" }}
                  className="h-[3px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-16 rounded-full shadow-[0_0_30px_#06b6d4]"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 3: ANATOMY */}
        <section 
          ref={el => sectionsRef.current[2] = el}
          className="h-screen w-full flex flex-col justify-center items-center px-6 bg-black/20"
        >
          <style>{`
            .anatomy-svg-wrapper svg {
              width: 100% !important;
              height: 100% !important;
              max-height: 100%;
            }
          `}</style>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.7 }}
            className="max-w-6xl w-full grid md:grid-cols-2 gap-10 md:gap-12 items-center"
          >
            <div className="flex flex-col justify-center">
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Target Every Muscle
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                Interactive muscle mapping
              </p>

              {selectedMuscle ? (
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-6">
                  <div className="text-[10px] uppercase tracking-[0.4em] text-cyan-400 font-bold mb-1">
                    Active Selection
                  </div>
                  <div className="text-2xl font-black text-white">
                    {String(selectedMuscle)}
                  </div>
                </div>
              ) : (
                <div className="inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-6 py-3 text-xs font-bold uppercase tracking-widest text-cyan-300">
                  <Activity size={14} className="animate-pulse" />
                  Hover the body to explore
                </div>
              )}
            </div>

            <div
              ref={anatomyBoxRef}
              onMouseMove={handleMouseMove}
              className="relative h-[50vh] md:h-[60vh] w-full flex items-center justify-center bg-slate-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl"
            >
              <motion.div
                animate={{ top: ["-10%", "110%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[1px] z-20 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${theme.accent.success}, transparent)`,
                  boxShadow: `0 0 15px ${theme.accent.success}`,
                }}
              />

              <AnimatePresence>
                {highlightedMuscle && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: mousePos.x + 30,
                      y: mousePos.y - 50,
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-0 left-0 z-50 pointer-events-none px-4 py-2 rounded-lg backdrop-blur-md border border-white/10"
                    style={{
                      backgroundColor: `${theme.primary.main}cc`,
                      boxShadow: `0 0 15px ${theme.primary.glow}`,
                    }}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                      {highlightedMuscle}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="anatomy-svg-wrapper h-full w-full flex items-center justify-center p-12 transition-transform duration-700 hover:scale-105">
                <FrontView
                  onHover={setHighlightedMuscle}
                  onLeave={() => setHighlightedMuscle(null)}
                  onSelect={setSelectedMuscle}
                  selectedMuscle={selectedMuscle}
                  highlightedMuscle={highlightedMuscle}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    width: "auto",
                    height: "auto",
                    filter: `drop-shadow(0 0 25px ${theme.primary.glow})`,
                    display: "block",
                    margin: "auto",
                  }}
                />
              </div>

              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                  backgroundImage: `linear-gradient(0deg, transparent 49%, white 50%, transparent 51%), linear-gradient(90deg, transparent 49%, white 50%, transparent 51%)`,
                  backgroundSize: "32px 32px",
                }}
              />
            </div>
          </motion.div>
        </section>

        {/* SECTION 4: PROBLEM -> SOLUTION */}
        <section 
          ref={el => sectionsRef.current[3] = el}
          className="h-screen w-full flex flex-col justify-center items-center relative px-6 overflow-hidden bg-[#050505]"
        >
          <div
            className="absolute inset-0 opacity-40 blur-[140px] pointer-events-none transition-colors duration-1000"
            style={{
              background: `radial-gradient(circle at 80% 50%, ${selectedProblem.color}, transparent 65%),
                   radial-gradient(circle at 10% 10%, #3b82f6, transparent 55%)`,
            }}
          />

          <div className="max-w-6xl w-full z-10 flex flex-col h-full max-h-[80vh] justify-center font-sans">
            <div className="flex items-center justify-center gap-8 mb-12">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.4, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl md:text-3xl font-black tracking-tighter text-white uppercase italic"
              >
                Your Problems
              </motion.h2>

              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "140px", opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="h-[1px] bg-white/20 relative"
              >
                <div className="absolute right-0 -top-[3px] border-y-[4px] border-y-transparent border-l-[7px] border-l-white/20" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.4, 1] }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="text-xl md:text-3xl font-black tracking-tighter uppercase italic"
                style={{
                  color: selectedProblem.color,
                  textShadow: `0 0 25px ${selectedProblem.color}`,
                }}
              >
                Our Solutions
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch h-full max-h-[60vh]">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col overflow-y-auto no-scrollbar border-l border-white/20"
              >
                {problems.map((problem) => {
                  const active = problem.id === selectedExcuseId;
                  return (
                    <button
                      key={problem.id}
                      onClick={() => setSelectedExcuseId(problem.id)}
                      className={`group flex items-center gap-6 p-3 transition-all duration-200 border-b border-white/10 ${
                        active
                          ? "bg-white/10"
                          : "bg-transparent hover:bg-white/[0.04]"
                      }`}
                      style={{ borderRadius: "0px" }}
                    >
                      <div
                        className="transition-all duration-500 pl-2"
                        style={{
                          color: active
                            ? problem.color
                            : "rgba(255,255,255,0.45)",
                          filter: active
                            ? `drop-shadow(0 0 12px ${problem.color})`
                            : "none",
                        }}
                      >
                        {React.cloneElement(problem.icon, {
                          size: 24,
                          strokeWidth: active ? 3 : 2,
                        })}
                      </div>

                      <span
                        className={`text-base font-bold tracking-tight uppercase italic transition-colors ${
                          active ? "text-white" : "text-white/45"
                        }`}
                      >
                        {problem.text}
                      </span>
                    </button>
                  );
                })}
              </motion.div>

              <motion.div
                key={selectedProblem.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="relative flex flex-col justify-center p-10 bg-white/[0.04] border border-white/10"
                style={{ borderRadius: "0px", backdropFilter: "blur(40px)" }}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{
                    backgroundColor: selectedProblem.color,
                    boxShadow: `0 0 30px ${selectedProblem.color}`,
                  }}
                />

                <div className="space-y-4">
                  <div
                    style={{
                      color: selectedProblem.color,
                      filter: `drop-shadow(0 0 20px ${selectedProblem.color})`,
                    }}
                  >
                    {React.cloneElement(selectedProblem.icon, {
                      size: 48,
                      strokeWidth: 2.5,
                    })}
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic leading-none">
                    {selectedProblem.text}
                  </h3>

                  <div
                    className="h-[2px] w-16"
                    style={{ backgroundColor: `${selectedProblem.color}44` }}
                  />

                  <p className="text-xl md:text-2xl font-bold text-white leading-tight tracking-tight">
                    {selectedProblem.solution}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 5: FEATURES */}
        <section 
  ref={el => sectionsRef.current[4] = el}
  className="h-screen w-full flex flex-col bg-[#0f172a]"
>
  {/* TOP SECTION: HEADING */}
  <div className="h-[15%] w-full flex items-center justify-center border-b border-white/10 bg-[#0f172a] z-20 shadow-xl">
    <h2 className="text-5xl md:text-7xl font-black text-white tracking-widest uppercase italic drop-shadow-lg">
      Features
    </h2>
  </div>

  {/* BOTTOM SECTION: VIBRANT STRIP */}
  <div className="h-[85%] w-full relative overflow-hidden bg-[#020617]">
    <div className="flex h-full animate-scroll-features hover:[animation-play-state:paused]">
      {[...features, ...features].map((feature, idx) => {
        
        // UPGRADED PALETTE: Uses gradients and lighter stops (600-800) instead of 950
        const colors = [
  // Electric Cyan - Crisp and icy
  'bg-gradient-to-b from-cyan-400 via-cyan-600 to-cyan-900 border-t border-cyan-300 shadow-inner shadow-cyan-400/50',
  
  // Royal Purple - Deep and velvety
  'bg-gradient-to-b from-purple-400 via-purple-600 to-purple-900 border-t border-purple-300 shadow-inner shadow-purple-400/50',
  
  // Dragon Fruit - Vibrant but sophisticated
  'bg-gradient-to-b from-rose-400 via-rose-600 to-rose-900 border-t border-rose-300 shadow-inner shadow-rose-400/50',
  
  // Jungle Emerald - High-energy tech green
  'bg-gradient-to-b from-emerald-400 via-emerald-600 to-emerald-900 border-t border-emerald-300 shadow-inner shadow-emerald-400/50',
  
  // Blood Orange - Saturated sunset
  'bg-gradient-to-b from-orange-400 via-orange-600 to-orange-900 border-t border-orange-300 shadow-inner shadow-orange-400/50',
  
  // Cobalt Blue - Deep ocean power
  'bg-gradient-to-b from-blue-400 via-blue-600 to-blue-900 border-t border-blue-300 shadow-inner shadow-blue-400/50',
  
  // Vivid Violet - Electric luxury
  'bg-gradient-to-b from-violet-400 via-violet-600 to-violet-900 border-t border-violet-300 shadow-inner shadow-violet-400/50',
  
  // Silver Graphite - Machined metal
  'bg-gradient-to-b from-slate-300 via-slate-500 to-slate-800 border-t border-slate-200 shadow-inner shadow-slate-300/50'
];

        return (
          <motion.div
            key={idx}
            whileHover={{ width: '420px' }}
            // Removed bg-black/40 overlay for instant visibility
            className={`h-full w-[280px] md:w-[350px] flex-shrink-0 relative group cursor-pointer transition-all duration-500 ease-out border-r border-white/20 overflow-hidden ${colors[idx % colors.length]}`}
          >
            
            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
              
              {/* Icon - Starts visible (80%), becomes pure white on hover */}
              <div className="text-white/80 group-hover:text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
                {React.cloneElement(feature.icon, { size: 80, strokeWidth: 1.5 })}
              </div>

              {/* Title - Pure White */}
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none mt-8 text-white drop-shadow-sm">
                {feature.title}
              </h3>

              {/* Description - High Contrast White */}
              <div className="max-h-0 opacity-0 group-hover:max-h-48 group-hover:opacity-100 transition-all duration-500 mt-4 overflow-hidden">
                <p className="text-white/90 text-lg font-medium leading-snug border-t-2 border-white/20 pt-4 max-w-[240px] mx-auto">
                  {feature.description}
                </p>
              </div>
            </div>

            {/* Background Index Number - More visible now */}
            <span className="absolute bottom-20 right-6 text-white/60 font-black text-8xl italic select-none pointer-events-none">
              {(idx % features.length) + 1}
            </span>
          </motion.div>
        );
      })}
    </div>
  </div>

  <style jsx>{`
    @keyframes scrollFeatures {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-scroll-features {
      animation: scrollFeatures 45s linear infinite;
      width: max-content;
      display: flex;
    }
  `}</style>
</section>
      </div>

      
    </div>
  );
};

export default Hero;