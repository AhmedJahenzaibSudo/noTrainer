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
  UserCircle,
  Database,
  Columns3,
  Gamepad2,
  ArrowRight,
} from "lucide-react";

import FrontView from "@/components/anatomy/FrontView";


/* =========================================================
   DESIGN CONFIG
   Change values here only
========================================================= */

const CONFIG = {
  colors: {
    bg: "color(display-p3 0.056 0.958 0.949)",
    element: "color(display-p3 0.079 0.201 0.346)",
  },

  fontSize: {
    hero: "clamp(4rem, 9vw, 8rem)",
    section: "clamp(2.5rem, 5vw, 4rem)",
    cardTitle: "1.1rem",
    body: "1rem",
    label: "0.875rem",
  },

  radius: {
    small: "0.75rem",
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

/* =========================================================
   DATA
========================================================= */

const heroTags = ["Home Gym", "Workout Guide", "AI Trainer", "Fitness Hub"];

const featureList = [
  {
    title: "Workout Wizard",
    description: "Select muscles and generate workouts instantly.",
    icon: Wand2,
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

/* =========================================================
   HERO
========================================================= */

const Hero = () => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [highlightedMuscle, setHighlightedMuscle] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const anatomyBoxRef = useRef(null);

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

  const handleMouseMove = useCallback((e) => {
    if (!anatomyBoxRef.current) return;

    const rect = anatomyBoxRef.current.getBoundingClientRect();

    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const blockStyle = {
    backgroundColor: ELEMENT,
    color: BG,
  };

  return (
    <main
      className="relative w-full overflow-hidden font-light antialiased sm:font-thin"
      style={{
        backgroundColor: BG,
        color: ELEMENT,
      }}
    >
      {/* =========================================================
          HERO SECTION
      ========================================================= */}

      <section
        className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 text-center"
        style={{
          backgroundColor: BG,
        }}
      >
        <div className="relative z-10 flex w-full max-w-5xl flex-col items-center">
          <motion.h1
            initial={{
              opacity: 0,
              scale: 0.9,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative font-extralight tracking-tight"
            style={{
              color: ELEMENT,
              fontSize: CONFIG.fontSize.hero,
            }}
          >
            <span className="relative z-10">noTrainer</span>

            <motion.span
              className="relative z-10 ml-2 md:ml-4"
              animate={{
                opacity: [0.65, 1, 0.65],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              AI
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
              duration: 0.6,
            }}
            className="mt-6 max-w-md font-normal leading-relaxed"
            style={{
              color: ELEMENT,
              fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
            }}
          >
            Train Anywhere.{" "}
            <span className="font-semibold">No Trainer Needed.</span>
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.4,
              duration: 0.6,
            }}
            className="mt-12 flex w-full max-w-3xl flex-wrap items-center justify-center gap-3"
          >
            {heroTags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{
                  opacity: 0,
                  y: 10,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  delay: 0.5 + index * 0.1,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                }}
                className="cursor-default px-6 py-2.5 text-sm font-medium uppercase tracking-wider md:px-7 md:py-3 md:text-base"
                style={{
                  ...blockStyle,
                  borderRadius: CONFIG.radius.pill,
                }}
              >
                {tag}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          MUSCLE SECTION
      ========================================================= */}

      <section
        className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-24"
        style={{
          backgroundColor: BG,
        }}
      >
        <div className="relative z-10 flex w-full max-w-5xl flex-col items-center">
          <div className="mb-10 text-center">
            <h2
              className="font-light leading-tight tracking-tight"
              style={{
                color: ELEMENT,
                fontSize: CONFIG.fontSize.section,
              }}
            >
              Target Every <span className="font-semibold">Muscle</span>
            </h2>
          </div>

          <motion.div
            layout
            className="mb-8 flex w-full max-w-sm items-center justify-center px-6 py-4"
            style={{
              ...blockStyle,
              borderRadius: CONFIG.radius.medium,
            }}
          >
            {selectedMuscle ? (
              <motion.span
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className="text-lg font-medium capitalize tracking-wide md:text-xl"
              >
                {String(selectedMuscle)}
              </motion.span>
            ) : (
              <span className="text-sm font-medium uppercase tracking-[0.2em]">
                Select a Muscle
              </span>
            )}
          </motion.div>

          <div
            ref={anatomyBoxRef}
            onMouseMove={handleMouseMove}
            className="
              relative
              flex
              w-full
              items-center
              justify-center
              [&_svg]:mx-auto
              [&_svg]:block
              [&_svg]:h-[380px]
              [&_svg]:w-[300px]
              [&_svg]:max-w-full
              [&_svg]:cursor-pointer
              md:[&_svg]:h-[520px]
              md:[&_svg]:w-[420px]
            "
          >
            <AnimatePresence>
              {highlightedMuscle && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: mousePos.x + 16,
                    y: mousePos.y - 32,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                  className="pointer-events-none absolute left-0 top-0 z-50 px-4 py-2 text-xs font-medium uppercase tracking-[0.15em]"
                  style={{
                    ...blockStyle,
                    borderRadius: CONFIG.radius.small,
                  }}
                >
                  {highlightedMuscle}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex origin-center scale-[0.85] items-center justify-center md:scale-100">
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
      </section>

      {/* =========================================================
          PROBLEMS SECTION
      ========================================================= */}

      <section
        className="relative flex min-h-screen w-full flex-col justify-center px-5 py-24 md:px-8"
        style={{
          backgroundColor: BG,
        }}
      >
        <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col">
          <div className="mb-12 flex flex-col items-center justify-center gap-4 text-center md:mb-16 md:flex-row md:gap-6">
            <h2
              className="font-light uppercase tracking-widest"
              style={{
                color: ELEMENT,
                fontSize: "clamp(2rem, 4vw, 3rem)",
              }}
            >
              Problems
            </h2>

            <ArrowRight
              className="hidden h-8 w-8 md:block"
              style={{ color: ELEMENT }}
              strokeWidth={2.5}
            />

            <ArrowRight
              className="h-6 w-6 rotate-90 md:hidden"
              style={{ color: ELEMENT }}
              strokeWidth={1.5}
            />

            <h2
              className="font-semibold uppercase tracking-widest"
              style={{
                color: ELEMENT,
                fontSize: "clamp(2rem, 4vw, 3rem)",
              }}
            >
              Solutions
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {problemList.map((problem, idx) => {
              const Icon = problem.icon;

              return (
                <motion.div
                  key={problem.id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.1,
                  }}
                  transition={{
                    delay: idx * CONFIG.animation.stagger,
                    duration: CONFIG.animation.duration,
                  }}
                  whileHover={{
                    y: -4,
                  }}
                  className="group flex flex-col gap-4 p-6"
                  style={{
                    ...blockStyle,
                    borderRadius: CONFIG.radius.medium,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <Icon size={26} strokeWidth={1.7} />

                    <span
                      className="font-semibold uppercase tracking-wider"
                      style={{
                        fontSize: CONFIG.fontSize.cardTitle,
                      }}
                    >
                      {problem.text}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 pl-1">
                    <ArrowRight
                      className="mt-1 h-4 w-4 shrink-0"
                      strokeWidth={2}
                    />

                    <span
                      className="font-medium leading-relaxed"
                      style={{
                        fontSize: CONFIG.fontSize.body,
                      }}
                    >
                      {problem.solution}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURES SECTION
      ========================================================= */}

      <section
        className="relative flex min-h-screen w-full flex-col items-center justify-center px-5 py-24 md:px-8"
        style={{
          backgroundColor: BG,
        }}
      >
        <div className="mb-16 text-center">
          <h2
            className="font-light uppercase tracking-[0.2em]"
            style={{
              color: ELEMENT,
              fontSize: CONFIG.fontSize.section,
            }}
          >
            Features
          </h2>

          <p
            className="mt-4 font-medium tracking-wide"
            style={{
              color: ELEMENT,
              fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
            }}
          >
            Everything you need to succeed
          </p>
        </div>

        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featureList.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  margin: "-50px",
                }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                }}
                whileHover={{
                  y: -5,
                }}
                className="flex flex-col gap-5 p-8"
                style={{
                  ...blockStyle,
                  borderRadius: CONFIG.radius.large,
                }}
              >
                <Icon className="h-8 w-8" strokeWidth={1.6} />

                <div>
                  <h3
                    className="mb-2 font-semibold tracking-wide"
                    style={{
                      fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
                    }}
                  >
                    {feature.title}
                  </h3>

                  <p
                    className="font-medium leading-relaxed"
                    style={{
                      fontSize: CONFIG.fontSize.body,
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Hero;
