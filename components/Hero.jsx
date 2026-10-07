"use client";

import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  MessageSquare,
  Wand2,
  Database,
  Columns3,
  Gamepad2,
  ArrowRight,
} from "lucide-react";

import FrontView from "@/components/anatomy/FrontView";

const CONFIG = {
  colors: {
    bg: "#09E0F4",
    element: "#142F50",
    accent: "#f4fc06ee",
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

const heroTags = [
  "Workout Wizard",
  "Kanban Board",
  "AI Chat",
  "Calculators",
  "Brain Training",
];

const featureList = [
  {
    title: "Workout Wizard",
    description: "Select muscles and generate workouts.",
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

/* -------------------------------------------------------
   CARD STYLE
------------------------------------------------------- */

const cardStyle = {
  bg: ACCENT,
  text: ELEMENT,
  border: `8px solid ${ELEMENT}`,
};

/* -------------------------------------------------------
   HERO
------------------------------------------------------- */

const Hero = () => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [highlightedMuscle, setHighlightedMuscle] = useState(null);

  const [mousePos, setMousePos] = useState({
    x: 0,
    y: 0,
  });

  const anatomyBoxRef = useRef(null);

  /* -------------------------------------------------------
     PROBLEMS
  ------------------------------------------------------- */

  const problemList = useMemo(
    () => [
      {
        id: 1,
        text: "No gym access",
        solution: "Bodyweight routines",
      },
      {
        id: 2,
        text: "Too expensive",
        solution: "Free workout plans",
      },
      {
        id: 3,
        text: "Don't know how",
        solution: "Step-by-step guides",
      },
      {
        id: 4,
        text: "Need privacy",
        solution: "24/7 AI trainer",
      },
      {
        id: 5,
        text: "Lack of knowledge",
        solution: "800+ exercises",
      },
      {
        id: 6,
        text: "Can't go out",
        solution: "Home programs",
      },
      {
        id: 7,
        text: "Need structure",
        solution: "Kanban tracking",
      },
      {
        id: 8,
        text: "No motivation",
        solution: "Motivation Marquee",
      },
      {
        id: 9,
        text: "No equipment",
        solution: "Body weight trainings",
      },
    ],
    [],
  );

  /* -------------------------------------------------------
     MOUSE
  ------------------------------------------------------- */

  const handleMouseMove = useCallback((e) => {
    if (!anatomyBoxRef.current) return;

    const rect =
      anatomyBoxRef.current.getBoundingClientRect();

    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <main
      className="flex w-full flex-col antialiased"
      style={{
        backgroundColor: BG,
        color: ELEMENT,
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
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

            * {
              box-sizing: border-box;
            }

            html {
              scroll-behavior: smooth;
            }

            body {
              margin: 0;
              background: ${BG};
              color: ${ELEMENT};
            }

            .slackey {
              font-family: "Slackey", cursive;
              font-weight: 400;
            }

            /* ---------------------------------------------
               STACK CARDS
            --------------------------------------------- */

            #stack-cards {
              list-style: none;
              padding: 0;
              display: flex;
              flex-direction: column;
              gap: var(--card-margin);
              width: 90vw;
              max-width: 900px;
              margin: 0 auto;
              padding-bottom: calc(
                10vh + var(--card-height)
              );
            }

            .stack-card {
              position: sticky;
              top: 15vh;
              padding-top: calc(
                var(--index) * var(--card-top-offset)
              );
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

              box-shadow:
                0 18px 0 ${ELEMENT};

              position: relative;
              overflow: hidden;
            }

            @media (min-width: 768px) {
              .stack-card__content {
                padding: 40px;
              }
            }

            .stack-number {
              font-family: "Slackey", cursive;
              font-size: clamp(
                4rem,
                12vw,
                8rem
              );

              position: absolute;
              right: 1.5rem;
              top: 1rem;

              opacity: 0.18;
              line-height: 1;
            }

            /* ---------------------------------------------
               KINETIC LIST
            --------------------------------------------- */

            .kinetic-list {
              display: flex;
              flex-direction: column;
              gap: 3vh;
              list-style: none;
              padding: 0;
              margin: 0 auto;
              width: 100%;
            }

            .kinetic-list li {
              display: flex;
              align-items: center;
              justify-content: center;

              font-size: clamp(
                1rem,
                3vw,
                2.5rem
              );

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

              color: ${ELEMENT};

              background: ${ACCENT};
              padding: 0.05em 0.25em;
            }

            .kinetic-gap {
              width: clamp(24px, 5vw, 48px);
              margin: 0 clamp(
                1rem,
                3vw,
                3rem
              );
              flex-shrink: 0;
            }

            .kinetic-arrow-fixed {
              width: clamp(24px, 5vw, 48px);
              height: clamp(24px, 5vw, 48px);
              color: ${ACCENT};
            }

            /* ---------------------------------------------
               ANATOMY
            --------------------------------------------- */

            .anatomy-svg-wrapper svg {
              width: 100%;
              height: auto;
              max-height: 62svh;
            }

            @media (max-width: 640px) {
              .anatomy-svg-wrapper svg {
                max-height: 53svh;
              }
            }

            /* ---------------------------------------------
               CUSTOM SELECTION
            --------------------------------------------- */

            ::selection {
              background: ${ACCENT};
              color: ${ELEMENT};
            }

            /* ---------------------------------------------
               SCROLL ANIMATION
            --------------------------------------------- */

            @supports (
              animation-timeline: view()
            ) {
              .kinetic-list li {
                opacity: 0.15;
                animation: brighten linear both;
                animation-timeline: view();
                animation-range:
                  cover 40%
                  cover 60%;

                transform: scale(0.9);
              }

              @keyframes brighten {
                0%,
                100% {
                  opacity: 0.15;
                  transform: scale(0.9);
                }

                50% {
                  opacity: 1;
                  transform: scale(1.05);
                }
              }
            }
          `,
        }}
      />

      {/* ===================================================
          HERO
      =================================================== */}

      <section className="flex min-h-screen w-full flex-col items-center justify-center px-6 py-24 text-center">
        <div className="flex w-full max-w-5xl flex-col items-center">
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className="slackey flex flex-col items-center tracking-tight sm:flex-row"
            style={{
              fontSize: CONFIG.fontSize.hero,
            }}
          >
            <span>noTrainer</span>

            <motion.span
              className="mt-2 sm:ml-4 sm:mt-0"
              style={{
                color: ACCENT,
              }}
            >
              AI
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
              duration: 0.6,
            }}
            className="mt-6 max-w-xl text-xl sm:text-2xl md:text-3xl"
            style={{
              opacity: 0.8,
            }}
          >
            Train Anywhere.
            <br />
            No Trainer Needed.
          </motion.p>

          {/* Tags */}
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
            className="mt-12 flex w-full max-w-3xl flex-wrap items-center justify-center gap-4"
          >
            {heroTags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: 0.5 + index * 0.1,
                  duration: 0.4,
                }}
                whileHover={{
                  scale: 1.06,
                  rotate: index % 2 === 0 ? -1 : 1,
                }}
                className="cursor-default px-6 py-3 text-sm uppercase tracking-wider sm:text-base"
                style={{
                  backgroundColor: ACCENT,
                  color: ELEMENT,
                  borderRadius: CONFIG.radius.pill,
                  boxShadow: `4px 4px 0 ${ELEMENT}`,
                }}
              >
                {tag}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================================================
          ANATOMY
      =================================================== */}

      <section className="flex min-h-screen w-full flex-col items-center justify-center px-6 py-5">
        <div className="flex w-full max-w-5xl flex-col items-center">
          <div className="mb-12 text-center">
            <h2
              className="slackey tracking-tight"
              style={{
                fontSize: CONFIG.fontSize.section,
              }}
            >
              Use{" "}
              <span style={{ color: ACCENT }}>
                Muscle
              </span>{" "}
              Diagrams
            </h2>
          </div>

          {/* Selected muscle */}
          <motion.div
            layout
            className="mb-12 flex w-full max-w-xs items-center justify-center px-6 py-4"
            style={{
              backgroundColor: selectedMuscle
                ? ACCENT
                : BG,

              color: ELEMENT,

              border: `3px solid ${ELEMENT}`,

              borderRadius:
                CONFIG.radius.medium,

              boxShadow: selectedMuscle
                ? `6px 6px 0 ${ELEMENT}`
                : "none",
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
                className="text-lg uppercase tracking-widest"
              >
                {String(selectedMuscle)}
              </motion.span>
            ) : (
              <span className="text-sm uppercase opacity-80">
                Select a Muscle
              </span>
            )}
          </motion.div>

          {/* Anatomy */}
          <div
            ref={anatomyBoxRef}
            onMouseMove={handleMouseMove}
            className="relative flex w-full flex-col items-center justify-center [&_svg]:h-[400px] [&_svg]:w-auto [&_svg]:cursor-crosshair sm:[&_svg]:h-[500px] md:[&_svg]:h-[400px]"
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
                  className="pointer-events-none absolute left-0 top-0 z-50 px-4 py-2 text-sm uppercase tracking-wider"
                  style={{
                    backgroundColor: ACCENT,
                    color: ELEMENT,
                    borderRadius:
                      CONFIG.radius.small,
                    border: `2px solid ${ELEMENT}`,
                    boxShadow: `4px 4px 0 ${ELEMENT}`,
                  }}
                >
                  {highlightedMuscle}
                </motion.div>
              )}
            </AnimatePresence>

            <FrontView
              onHover={setHighlightedMuscle}
              onLeave={() =>
                setHighlightedMuscle(null)
              }
              onSelect={setSelectedMuscle}
              selectedMuscle={selectedMuscle}
              highlightedMuscle={
                highlightedMuscle
              }
            />
          </div>
        </div>
      </section>

      {/* ===================================================
          PROBLEMS
      =================================================== */}

      <section className="flex w-full flex-col items-center justify-center pb-12 pt-24">
        <div className="relative z-20 mb-16 w-full px-6 text-center">
          <h2
            className="slackey flex flex-col items-center justify-center gap-2 tracking-tight sm:flex-row sm:gap-6"
            style={{
              fontSize:
                "clamp(1.5rem, 5vw, 3.5rem)",
            }}
          >
            <span>
              Solving Problems
            </span>

            <ArrowRight
              className="hidden sm:block"
              style={{
                color: ACCENT,
              }}
              strokeWidth={4}
              size={40}
            />

            <ArrowRight
              className="rotate-90 sm:hidden"
              style={{
                color: ACCENT,
              }}
              strokeWidth={4}
              size={28}
            />

            <span
              style={{
                color: ACCENT,
                fontFamily: "sans-serif",
                fontWeight: 900,
              }}
            >
              in our Style
            </span>
          </h2>
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-8">
          <div className="pointer-events-none absolute left-0 top-0 z-10 flex h-full w-full justify-center">
            <div className="sticky top-[50vh] flex h-0 -translate-y-1/2 items-center justify-center">
              <ArrowRight
                className="kinetic-arrow-fixed"
                strokeWidth={4}
              />
            </div>
          </div>

          <ul className="kinetic-list relative z-0 py-[10vh]">
            {problemList.map((problem) => (
              <li key={problem.id}>
                <span>
                  {problem.text}
                </span>

                <span className="kinetic-gap" />

                <span>
                  {problem.solution}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===================================================
          FEATURES
      =================================================== */}

      <section className="relative flex w-full flex-col items-center justify-center pb-24 pt-12">
        <div className="sticky top-3 z-30 flex w-full justify-center py-8">
          <h2
            className="slackey tracking-tight"
            style={{
              fontSize:
                CONFIG.fontSize.section,
            }}
          >
            Features
          </h2>
        </div>

        <div className="flex w-full max-w-6xl flex-col">
          <ul id="stack-cards">
            {featureList.map(
              (feature, i) => {
                const Icon = feature.icon;

                return (
                  <li
                    key={feature.title}
                    className="stack-card"
                    style={{
                      "--index": i + 1,
                      "--card-bg":
                        cardStyle.bg,
                      "--card-text":
                        cardStyle.text,
                      "--card-border":
                        cardStyle.border,
                    }}
                  >
                    <motion.div
                      whileHover={{
                        y: -4,
                      }}
                      className="stack-card__content"
                    >
                      <span className="stack-number">
                        0{i + 1}
                      </span>

                      <div className="mb-4 sm:mb-6">
                        <Icon
                          size={40}
                          strokeWidth={2.5}
                        />
                      </div>

                      <h3 className="mb-2 max-w-sm text-xl uppercase tracking-tight sm:mb-4 sm:text-3xl">
                        {feature.title}
                      </h3>

                      <p className="max-w-xl font-sans text-base font-bold opacity-90 sm:text-lg">
                        {feature.description}
                      </p>
                    </motion.div>
                  </li>
                );
              },
            )}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default Hero;