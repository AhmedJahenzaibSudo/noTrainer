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
  ChevronDown,
  Wand2,
  UserCircle,
  Database,
  Columns3,
  Gamepad2,
  ArrowRight,
} from "lucide-react";

import FrontView from "@/components/anatomy/FrontView";

// App colors and animation settings
const config = {
  sections: {
    hero: {
      bg: "#1E3A8A",
      accent: "#38BDF8",
      textAccent: "#38BDF8",
      cardBg: "#FDE047",
      cardText: "#1E293B",
    },
    muscle: {
      bg: "#6B21A8",
      accent: "#FB7185",
      textAccent: "#FB7185",
      cardBg: "#FEF08A",
      cardText: "#581C87",
    },
    problems: {
      bg: "#047857",
      accent: "#BEF264",
      textAccent: "#BEF264",
      cardBg: "#FEF08A",
      cardText: "#064E3B",
      buttonBg: "#047857",
      buttonHover: "#059669",
    },
    features: {
      bg: "#4C1D95",
      accent: "#E879F9",
      textAccent: "#E879F9",
      cardBg: "#38BDF8",
      cardText: "#1E293B",
    },
  },
  animation: {
    marqueeDuration: "45s",
  },
};

// Feature cards data
const featureList = [
  {
    title: "Workout Wizard",
    description: "Select muscles and generate workouts instantly.",
    icon: Wand2,
  },
  {
    title: "Muscle Map",
    description: "Interactive diagram for intuitive discovery.",
    icon: UserCircle,
  },
  {
    title: "Rich Dataset",
    description: "Categorized exercises for all goals.",
    icon: Database,
  },
  {
    title: "Calculators",
    description: "BMI, calories, and protein formulas.",
    icon: Calculator,
  },
  {
    title: "AI Chatbot",
    description: "24/7 intelligent fitness assistant.",
    icon: MessageSquare,
  },
  {
    title: "Kanban Board",
    description: "Visual tracking for fitness tasks.",
    icon: Columns3,
  },
  {
    title: "Mini Games",
    description: "Boost focus and motivation.",
    icon: Gamepad2,
  },
];

// Rotating hero words
const heroWords = ["Home Gym", "Workout Guide", "AI Trainer", "Fitness Hub"];

// Sticky top spacing
const HEADER_HEIGHT = 40;

// This wrapper keeps each section pinned and clipped to the screen
const ClipSection = ({ children, bgColor }) => (
  <div
    className="snap-start"
    style={{
      position: "relative",
      width: "100%",
      height: `calc(100vh - ${HEADER_HEIGHT}px)`,
    }}
  >
    <div
      style={{
        position: "absolute",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        clip: "rect(0, auto, auto, 0)",
        WebkitClipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
      }}
    >
      {/* Solid section background */}
      <div
        style={{
          position: "fixed",
          top: HEADER_HEIGHT,
          left: 0,
          width: "100%",
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          backgroundColor: bgColor,
          zIndex: 0,
        }}
      />

      {/* Section content */}
      <div
        style={{
          position: "fixed",
          top: HEADER_HEIGHT,
          left: 0,
          width: "100%",
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  </div>
);

const Hero = () => {
  // Selected muscle from anatomy view
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  // Muscle being hovered
  const [highlightedMuscle, setHighlightedMuscle] = useState(null);

  // Mouse position for hover tooltip
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Current hero word index
  const [wordIndex, setWordIndex] = useState(0);

  // Active problem card
  const [activeProblem, setActiveProblem] = useState(null);

  // Ref for anatomy area
  const anatomyBoxRef = useRef(null);

  const { hero, muscle, problems, features } = config.sections;

  // Rotate hero words every 2.5 seconds
  useEffect(() => {
    const textInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % heroWords.length);
    }, 2500);

    return () => clearInterval(textInterval);
  }, []);

  // Problem and solution data
  const problemList = useMemo(
    () => [
      {
        id: 1,
        text: "No gym access",
        solution: "Bodyweight & home equipment routines.",
        icon: MapPin,
      },
      {
        id: 2,
        text: "Too expensive",
        solution: "Free workout plans & calculators.",
        icon: Calculator,
      },
      {
        id: 3,
        text: "Don't know how",
        solution: "Step-by-step exercise guides.",
        icon: Info,
      },
      {
        id: 4,
        text: "Need privacy",
        solution: "24/7 AI trainer, no judgment.",
        icon: MessageSquare,
      },
      {
        id: 5,
        text: "Lack of knowledge",
        solution: "800+ exercises with instructions.",
        icon: Dumbbell,
      },
      {
        id: 6,
        text: "Can't go out",
        solution: "Effective home workout programs.",
        icon: Zap,
      },
      {
        id: 7,
        text: "Need structure",
        solution: "Visual Kanban Board tracking.",
        icon: LayoutDashboard,
      },
      {
        id: 8,
        text: "No motivation",
        solution: "Motivation Marquee always on top.",
        icon: Target,
      },
      {
        id: 9,
        text: "No equipment",
        solution: "Trainings with just your body weights.",
        icon: Package,
      },
    ],
    [],
  );

  // Track mouse inside anatomy area
  const handleMouseMove = (e) => {
    if (!anatomyBoxRef.current) return;

    const rect = anatomyBoxRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <>
      <style>{`
        /* Hide scrollbar */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* Set anatomy svg size */
        .anatomy-svg-wrapper svg {
          width: 420px !important;
          height: 520px !important;
          max-width: 100%;
          display: block;
          margin: 0 auto;
          cursor: pointer;
        }

        /* Auto scroll feature row if needed later */
        @keyframes scrollFeatures {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-scroll-features {
          animation: scrollFeatures ${config.animation.marqueeDuration} linear infinite;
        }

        /* Resize anatomy on mobile */
        @media (max-width: 767px) {
          .anatomy-svg-wrapper svg {
            width: 300px !important;
            height: 380px !important;
          }
        }
      `}</style>

      <div className="relative w-full snap-y snap-proximity text-white font-sans">
        {/* Hero section */}
        <ClipSection bgColor={hero.bg}>
          <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-6 text-center">
            <motion.h1
              initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative text-6xl font-normal md:text-9xl"
              style={{ fontFamily: "'Krona One', sans-serif" }}
            >
              {/* Soft animated duplicate text behind title */}
              <motion.span
                animate={{
                  opacity: [0, 0.4, 0],
                  x: [0, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 z-0 blur-md"
                style={{ color: `${hero.accent}55` }}
                aria-hidden="true"
              >
                noTrainer AI
              </motion.span>

              {/* Main title */}
              <span className="relative z-10 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                noTrainer
              </span>

              {/* Animated AI text */}
              <motion.span
                className="relative z-10 ml-4 bg-[length:200%_auto] bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to top right, ${hero.accent}, #3399ff, ${hero.accent})`,
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                AI
                <span
                  className="absolute -inset-2 -z-10 animate-pulse blur-2xl"
                  style={{ backgroundColor: `${hero.accent}33` }}
                />
              </motion.span>
            </motion.h1>

            <p className="mt-5 max-w-md text-lg font-semibold text-slate-200 md:text-xl">
              Train Anywhere.{" "}
              <span className="font-semibold" style={{ color: hero.accent }}>
                No Trainer Needed.
              </span>
            </p>

            {/* Rotating hero card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative mt-12 w-full max-w-3xl overflow-hidden p-8 shadow-xl"
              style={{ backgroundColor: hero.cardBg, color: hero.cardText }}
            >
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: hero.cardText }}
              />

              <div className="flex h-20 items-center justify-center overflow-hidden md:h-24">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={wordIndex}
                    initial={{ y: 50, opacity: 0, rotateX: -40 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    exit={{ y: -50, opacity: 0, rotateX: 40 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="text-4xl font-black uppercase tracking-tight md:text-6xl"
                    style={{ color: hero.cardText }}
                  >
                    {heroWords[wordIndex]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Down arrow */}
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
              className="mt-12"
            >
              <ChevronDown
                className="h-8 w-8 opacity-70"
                style={{ color: hero.accent }}
              />
            </motion.div>
          </div>
        </ClipSection>

        {/* Muscle section */}
        <ClipSection bgColor={muscle.bg}>
          <div className="relative z-10 mt-6 flex w-full max-w-5xl flex-col items-center px-6">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                Target Every{" "}
                <span style={{ color: muscle.accent }}>Muscle</span>
              </h2>
            </div>

            {/* Selected muscle display */}
            <div
              className="mb-6 flex w-full max-w-md items-center justify-center px-5 py-3 md:py-4"
              style={{ backgroundColor: muscle.cardBg }}
            >
              {selectedMuscle ? (
                <span
                  className="text-lg font-black capitalize tracking-tight md:text-xl"
                  style={{ color: muscle.cardText }}
                >
                  {String(selectedMuscle)}
                </span>
              ) : (
                <span
                  className="text-xs font-black uppercase tracking-[0.14em] md:text-sm"
                  style={{ color: muscle.cardText }}
                >
                  Select a Muscle
                </span>
              )}
            </div>

            {/* Anatomy view and hover label */}
            <div
              ref={anatomyBoxRef}
              onMouseMove={handleMouseMove}
              className="relative flex w-full items-center justify-center"
            >
              <AnimatePresence>
                {highlightedMuscle && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: mousePos.x + 18,
                      y: mousePos.y - 34,
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="pointer-events-none absolute left-0 top-0 z-50 px-3 py-2 text-xs font-black uppercase tracking-[0.16em]"
                    style={{
                      backgroundColor: muscle.cardBg,
                      color: muscle.cardText,
                    }}
                  >
                    {highlightedMuscle}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="anatomy-svg-wrapper flex w-full items-center justify-center">
                <div className="origin-center flex scale-[0.82] items-center justify-center md:scale-[0.88]">
                  <FrontView
                    onHover={setHighlightedMuscle}
                    onLeave={() => setHighlightedMuscle(null)}
                    onSelect={setSelectedMuscle}
                    selectedMuscle={selectedMuscle}
                    highlightedMuscle={highlightedMuscle}
                  />
                </div>
              </div>
            </div>
          </div>
        </ClipSection>

        {/* Problems section */}
        <ClipSection bgColor={problems.bg}>
          <div className="relative z-10 flex h-full w-full max-w-6xl flex-col justify-center overflow-hidden px-5 py-10 md:px-6 md:py-12">
            <div className="mb-8 flex items-center justify-center gap-3 md:mb-9 md:gap-5">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl md:text-4xl">
                Problems
              </h2>
              <ArrowRight
                className="h-5 w-5 md:h-8 md:w-8"
                strokeWidth={3}
                style={{ color: problems.accent }}
              />
              <h2
                className="text-2xl font-black uppercase tracking-tight sm:text-3xl md:text-4xl"
                style={{ color: problems.accent }}
              >
                Solutions
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {problemList.map((problem) => {
                const isActive = activeProblem?.id === problem.id;

                return (
                  <button
                    key={problem.id}
                    onClick={() => setActiveProblem(problem)}
                    className="flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-2xl px-3 py-4 text-center transition-all duration-300 md:min-h-[112px] md:px-4 md:py-5"
                    style={{
                      backgroundColor: isActive ? problems.cardBg : "#047857",
                      color: isActive ? problems.cardText : "#ffffff",
                      border: isActive
                        ? `2px solid ${problems.accent}`
                        : "2px solid rgba(255,255,255,0.08)",
                      boxShadow: isActive
                        ? `0 0 24px ${problems.accent}33`
                        : "0 8px 18px rgba(0,0,0,0.18)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "#059669";
                        e.currentTarget.style.border = `2px solid ${problems.accent}55`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "#047857";
                        e.currentTarget.style.border =
                          "2px solid rgba(255,255,255,0.08)";
                      }
                    }}
                  >
                    <problem.icon
                      size={26}
                      strokeWidth={2.5}
                      className="shrink-0 transition-all duration-300 md:h-8 md:w-8"
                      style={{
                        color: isActive ? problems.cardText : problems.accent,
                      }}
                    />

                    <span
                      className="text-xs font-black uppercase leading-snug tracking-[0.05em] md:text-sm"
                      style={{
                        color: isActive ? problems.cardText : "#ffffff",
                      }}
                    >
                      {problem.text}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              className="mt-4 text-center text-[11px] font-bold uppercase tracking-[0.18em] md:mt-5 md:text-xs"
              style={{ color: problems.accent }}
            >
              Tap a problem to view the solution
            </div>
          </div>

          {activeProblem && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 px-5">
              <div
                className="relative w-full max-w-xl rounded-3xl px-5 py-6 text-center md:px-8 md:py-8"
                style={{
                  backgroundColor: problems.cardBg,
                  boxShadow: `0 0 32px ${problems.accent}2e`,
                }}
              >
                <button
                  onClick={() => setActiveProblem(null)}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-lg font-black transition-all duration-200"
                  style={{
                    backgroundColor: problems.cardText,
                    color: problems.cardBg,
                  }}
                >
                  ×
                </button>

                <div className="flex flex-col items-center justify-center gap-3 md:gap-4">
                  <activeProblem.icon
                    size={34}
                    strokeWidth={2.6}
                    style={{ color: problems.cardText }}
                  />

                  <h3
                    className="text-lg font-black uppercase tracking-[0.07em] md:text-xl"
                    style={{ color: problems.cardText }}
                  >
                    {activeProblem.text}
                  </h3>

                  <p
                    className="max-w-lg text-sm font-extrabold leading-relaxed md:text-lg"
                    style={{ color: problems.cardText }}
                  >
                    {activeProblem.solution}
                  </p>
                </div>
              </div>
            </div>
          )}
        </ClipSection>

        {/* Features section */}
        <div
          className="snap-start"
          style={{
            position: "relative",
            width: "100%",
            minHeight: `${featureList.length * 42}vh`,
            backgroundColor: features.bg,
          }}
        >
          {/* Sticky title */}
          <div
            style={{
              position: "sticky",
              top: HEADER_HEIGHT,
              height: "14vh",
              width: "100%",
              zIndex: 90,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: features.bg,
            }}
          >
            <h2
              className="text-3xl font-black uppercase tracking-[0.16em] text-white md:text-6xl"
              style={{
                fontFamily: "'Krona One', sans-serif",
                textShadow: `0 0 24px ${features.accent}33`,
              }}
            >
              Features
            </h2>
          </div>

          {/* Feature cards */}
          <div className="relative z-10 flex w-full flex-col items-center px-4 pt-[16vh] md:px-8">
            <style
              dangerouslySetInnerHTML={{
                __html: `
          .stack-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 920px;
            padding: 0;
            margin: 0;
            list-style: none;
          }

          .stack-item {
            position: sticky;
            height: 26vh;
            min-height: 200px;
            margin-bottom: 3vh;
            top: calc(${HEADER_HEIGHT}px + 14vh);
          }

          .stack-item-inner {
            width: 100%;
            height: 100%;
            border-radius: 24px;
            overflow: hidden;
            animation: card-fold linear forwards;
            animation-timeline: view();
            animation-range: exit-crossing 0% exit-crossing 100%;
            transform-origin: 50% 0%;
            will-change: transform, filter;
          }

          .stack-item-content {
            opacity: 0;
            transform: translateY(14px);
            animation: content-rise linear forwards;
            animation-timeline: view();
            animation-range: entry 25% entry 70%;
            will-change: transform, opacity;
          }

          @keyframes card-fold {
            to {
              transform: scale(0.9) rotateX(16deg);
              filter: brightness(0.78);
            }
          }

          @keyframes content-rise {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 767px) {
            .stack-container {
              max-width: 100%;
            }

            .stack-item {
              height: 22vh;
              min-height: 170px;
              margin-bottom: 2vh;
              top: calc(${HEADER_HEIGHT}px + 14vh);
            }

            .stack-item-inner {
              animation-range: exit-crossing 0% exit-crossing 85%;
            }

            .stack-item-content {
              animation-range: entry 15% entry 60%;
            }

            .stack-container li:last-child {
              margin-bottom: 0;
            }
          }
        `,
              }}
            />

            <ul className="stack-container">
              {featureList.map((feature, idx) => {
                const cardStyles = [
                  { bg: "#1E3A8A", accent: "#60A5FA", text: "#FFFFFF" },
                  { bg: "#6B21A8", accent: "#C084FC", text: "#FFFFFF" },
                  { bg: "#BE185D", accent: "#FB7185", text: "#FFFFFF" },
                  { bg: "#B45309", accent: "#FDE047", text: "#FFFFFF" },
                  { bg: "#047857", accent: "#34D399", text: "#FFFFFF" },
                ];

                const style = cardStyles[idx % cardStyles.length];

                return (
                  <li
                    key={idx}
                    className="stack-item"
                    style={{
                      zIndex: idx + 1,
                    }}
                  >
                    <div
                      className="stack-item-inner relative flex h-full items-center p-4 md:p-7"
                      style={{
                        backgroundColor: style.bg,
                        color: style.text,
                        border: `2px solid ${style.accent}`,
                        boxShadow: "0 16px 36px rgba(0,0,0,0.26)",
                      }}
                    >
                      <div
                        className="absolute right-4 top-3 text-lg font-black md:top-4 md:text-2xl"
                        style={{ color: style.accent }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </div>

                      <div className="stack-item-content flex w-full items-center gap-3 pr-8 md:gap-6 md:pr-10">
                        <feature.icon
                          className="h-8 w-8 shrink-0 md:h-11 md:w-11"
                          style={{ color: style.accent }}
                        />

                        <div className="flex flex-col justify-center">
                          <h3 className="text-lg font-black leading-tight text-white md:text-3xl">
                            {feature.title}
                          </h3>

                          <p className="mt-1 max-w-2xl text-xs font-medium leading-relaxed text-white/88 md:mt-2 md:text-lg">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Ending text */}
          <div className="flex w-full flex-col items-center justify-center px-4 pb-8 pt-10 md:pb-20 md:pt-16">
            <h2
              className="text-center text-[10vw] font-black uppercase leading-[0.9] tracking-tight text-white md:text-[7vw]"
              style={{
                fontFamily: "'Krona One', sans-serif",
                textShadow: `0 0 30px ${features.accent}22`,
              }}
            >
              No Excuses.
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
