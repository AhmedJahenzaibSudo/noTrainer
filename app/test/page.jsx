"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
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
  Wand2,
  Database,
  Columns3,
  Gamepad2,
  ArrowRight,
} from "lucide-react";

import FrontView from "@/components/anatomy/FrontView";

const CONFIG = {
  colors: {
    bg: "#4d3285ff",       // Deep Indigo
    element: "#FFFFFF",  // Pure White for text
    accent: "#f65e91ff",    // Neon Pink
  },
  fontSize: {
    hero: "clamp(3.5rem, 10vw, 7rem)",
    section: "clamp(2.5rem, 6vw, 4rem)",
    cardTitle: "1.25rem",
    body: "1.1rem",
  },
  radius: {
    small: "0.5rem",
    medium: "1rem",
    large: "1.5rem",
    pill: "999px",
  },
  animation: {
    duration: 0.5,
    stagger: 0.05,
  },
};

const BG = CONFIG.colors.bg;
const ELEMENT = CONFIG.colors.element;
const ACCENT = CONFIG.colors.accent;

const heroTags = ["Workout Wizard", "Kanban Board", "AI Chat", "Calculators", "Brain Training"];

const featureList = [
  { title: "Workout Wizard", description: "Select muscles and generate workouts.", icon: Wand2 },
  { title: "Rich Dataset", description: "Categorized exercises for all goals.", icon: Database },
  { title: "Calculators", description: "BMI, calories, and protein formulas.", icon: Calculator },
  { title: "AI Chatbot", description: "24/7 intelligent fitness assistant.", icon: MessageSquare },
  { title: "Kanban Board", description: "Visual tracking for fitness tasks.", icon: Columns3 },
  { title: "Mini Games", description: "Boost focus and motivation.", icon: Gamepad2 },
];

const cardStyles = [
  { bg: ACCENT, text: BG, shadow: "rgba(255, 0, 85, 0.4)", border: "none" },
  { bg: BG, text: ACCENT, shadow: "rgba(13, 2, 33, 0.8)", border: `2px solid ${ACCENT}` },
  { bg: ACCENT, text: BG, shadow: "rgba(255, 0, 85, 0.4)", border: "none" },
];

const Hero = () => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [highlightedMuscle, setHighlightedMuscle] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const anatomyBoxRef = useRef(null);

  const problemList = useMemo(
    () => [
      { id: 1, text: "No gym access", solution: "Bodyweight routines" },
      { id: 2, text: "Too expensive", solution: "Free workout plans" },
      { id: 3, text: "Don't know how", solution: "Step-by-step guides" },
      { id: 4, text: "Need privacy", solution: "24/7 AI trainer" },
      { id: 5, text: "Lack of knowledge", solution: "800+ exercises" },
      { id: 6, text: "Can't go out", solution: "Home programs" },
      { id: 7, text: "Need structure", solution: "Kanban tracking" },
      { id: 8, text: "No motivation", solution: "Motivation Marquee" },
      { id: 9, text: "No equipment", solution: "Body weight trainings" },
    ],
    []
  );

  const handleMouseMove = useCallback((e) => {
    if (!anatomyBoxRef.current) return;
    const rect = anatomyBoxRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <main
      className="w-full flex flex-col antialiased"
      style={{
        backgroundColor: BG,
        backgroundImage: `radial-gradient(circle at 50% 0%, #1a033d 0%, ${BG} 60%)`,
        color: ELEMENT,
        fontFamily: '"Slackey", cursive',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Slackey&display=swap');
        
        :root {
          --card-height: 280px;
          --card-margin: 20px;
          --card-top-offset: 1.5em;
        }

        @media (min-width: 768px) {
          :root {
            --card-height: 320px;
            --card-margin: 30px;
          }
        }

        #stack-cards {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--card-margin);
          width: 90vw;
          max-width: 900px;
          margin: 0 auto;
          padding-bottom: calc(10vh + var(--card-height));
        }

        .stack-card {
          position: sticky;
          top: 15vh;
          padding-top: calc(var(--index) * var(--card-top-offset));
          z-index: var(--index);
        }

        .stack-card__content {
          box-sizing: border-box;
          padding: 24px;
          width: 100%;
          height: var(--card-height);
          border-radius: 32px;
          background: var(--card-bg);
          color: var(--card-text);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          border: var(--card-border);
          box-shadow: 0 20px 40px -10px var(--shadow-color);
          position: relative;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .stack-card__content {
            padding: 40px;
          }
        }

        .stack-number {
          font-size: clamp(4rem, 12vw, 8rem);
          position: absolute;
          right: 1.5rem;
          top: 1rem;
          opacity: 0.3;
          line-height: 1;
        }

        .kinetic-list {
          display: flex;
          flex-direction: column;
          gap: 3vh;
          list-style: none;
          padding: 0;
          margin: 0 auto;
          width:100%;
        }

        .kinetic-list li {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(1rem, 3vw, 2.5rem);
          color: ${ELEMENT};
          width: 100%;
        }

        .kinetic-list li > span:first-child {
          flex: 1 1 0;
          text-align: right;
        }

        .kinetic-list li > span:last-child {
          flex: 1 1 0;
          text-align: left;
          font-family: sans-serif;
          font-weight: 900;
          color: ${ACCENT};
        }

        .kinetic-gap {
          width: clamp(24px, 5vw, 48px);
          margin: 0 clamp(1rem, 3vw, 3rem);
          flex-shrink: 0;
        }

        .kinetic-arrow-fixed {
          width: clamp(24px, 5vw, 48px);
          height: clamp(24px, 5vw, 48px);
          color: ${ACCENT};
        }

        @supports (animation-timeline: view()) {
          .kinetic-list li {
            opacity: 0.15;
            animation: brighten linear both;
            animation-timeline: view();
            animation-range: cover 40% cover 60%;
            transform: scale(0.9);
          }

          @keyframes brighten {
            0%, 100% {
              opacity: 0.15;
              transform: scale(0.9);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
          }
        }
      ` }} />

      <section className="w-full min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="flex w-full max-w-5xl flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center sm:flex-row tracking-tight"
            style={{ fontSize: CONFIG.fontSize.hero }}
          >
            <span>noTrainer</span>
            <motion.span
              className="mt-2 sm:ml-4 sm:mt-0"
              style={{ color: ACCENT }}
            >
              AI
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 max-w-xl text-xl sm:text-2xl md:text-3xl opacity-80"
          >
            Train Anywhere. <br></br> No Trainer Needed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12 flex w-full max-w-3xl flex-wrap items-center justify-center gap-4"
          >
            {heroTags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                className="cursor-default px-6 py-3 text-sm sm:text-base uppercase tracking-wider"
                style={{ 
                  backgroundColor: ACCENT, 
                  color: BG,
                  borderRadius: CONFIG.radius.pill 
                }}
              >
                {tag}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="w-full min-h-screen flex flex-col items-center justify-center px-6 py-5">
        <div className="flex w-full max-w-5xl flex-col items-center">
          <div className="mb-12 text-center">
            <h2 className="tracking-tight" style={{ fontSize: CONFIG.fontSize.section }}>
              Use <span style={{ color: ACCENT }}>Muscle</span> Diagrams
            </h2>
          </div>

          <motion.div
            layout
            className="mb-12 flex w-full max-w-xs items-center justify-center px-6 py-4"
            style={{ 
              backgroundColor: selectedMuscle ? ACCENT : BG,
              color: selectedMuscle ? BG : ACCENT,
              border: `2px solid ${ACCENT}`,
              borderRadius: CONFIG.radius.medium 
            }}
          >
            {selectedMuscle ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-lg uppercase tracking-widest"
              >
                {String(selectedMuscle)}
              </motion.span>
            ) : (
              <span className="text-sm uppercase opacity-80">Select a Muscle</span>
            )}
          </motion.div>

          <div
            ref={anatomyBoxRef}
            onMouseMove={handleMouseMove}
            className="relative flex w-full flex-col items-center justify-center [&_svg]:h-[400px] [&_svg]:w-auto sm:[&_svg]:h-[500px] md:[&_svg]:h-[400px] [&_svg]:cursor-crosshair"
          >
            <AnimatePresence>
              {highlightedMuscle && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1, x: mousePos.x + 16, y: mousePos.y - 32 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="pointer-events-none absolute left-0 top-0 z-50 px-4 py-2 text-sm uppercase tracking-wider shadow-xl"
                  style={{ 
                    backgroundColor: ACCENT,
                    color: BG,
                    borderRadius: CONFIG.radius.small 
                  }}
                >
                  {highlightedMuscle}
                </motion.div>
              )}
            </AnimatePresence>

            <FrontView
              onHover={setHighlightedMuscle}
              onLeave={() => setHighlightedMuscle(null)}
              onSelect={setSelectedMuscle}
              selectedMuscle={selectedMuscle}
              highlightedMuscle={highlightedMuscle}
            />
          </div>
        </div>
      </section>

      <section className="w-full flex flex-col items-center justify-center pt-24 pb-12">
        <div className="w-full px-6 text-center z-20 relative mb-16">
          <h2 className="uppercase tracking-tight flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6" style={{ fontSize: "clamp(1.5rem, 5vw, 3.5rem)" }}>
            <span style={{ color: ELEMENT }}>Solving Problems</span>
            <ArrowRight className="hidden sm:block" style={{ color: ACCENT }} strokeWidth={4} size={40} />
            <ArrowRight className="sm:hidden rotate-90" style={{ color: ACCENT }} strokeWidth={4} size={28} />
            <span style={{ color: ACCENT, fontFamily: 'sans-serif', fontWeight: 900 }}>in our Style</span>
          </h2>
        </div>

        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-8">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex justify-center">
            <div className="sticky top-[50vh] flex justify-center items-center h-0 -translate-y-1/2">
              <ArrowRight className="kinetic-arrow-fixed" strokeWidth={4} />
            </div>
          </div>
          
          <ul className="kinetic-list relative z-0 py-[10vh]">
            {problemList.map((problem) => (
              <li key={problem.id}>
                <span>{problem.text}</span>
                <span className="kinetic-gap"></span>
                <span>{problem.solution}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="w-full flex flex-col items-center justify-center   pt-12 pb-24 relative">
        <div 
          className="sticky top-3 w-full z-30 py-8 flex justify-center" 
          
        >
          <h2 className="uppercase tracking-tight" style={{ fontSize: CONFIG.fontSize.section }}>
            Features
          </h2>
        </div>
        
        <div className="flex w-full max-w-6xl flex-col">
          <ul id="stack-cards">
            {featureList.map((feature, i) => {
              const Icon = feature.icon;
              const styleObj = cardStyles[i % cardStyles.length];
              return (
                <li
                  key={feature.title}
                  className="stack-card"
                  style={{
                    "--index": i + 1,
                    "--card-bg": styleObj.bg,
                    "--card-text": styleObj.text,
                    "--shadow-color": styleObj.shadow,
                    "--card-border": styleObj.border,
                  }}
                >
                  <div className="stack-card__content">
                    <span className="stack-number">0{i + 1}</span>
                    <div className="mb-4 sm:mb-6">
                      <Icon size={40} strokeWidth={2.5} />
                    </div>
                    <h3 className="mb-2 sm:mb-4 text-xl sm:text-3xl tracking-tight uppercase max-w-sm">
                      {feature.title}
                    </h3>
                    <p className="text-base sm:text-lg opacity-90 max-w-xl font-sans font-bold">
                      {feature.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default Hero;