"use client";

import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";

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

/* =========================================================
   COLORS
========================================================= */

const BG =
  "color(display-p3 0.056 0.958 0.949)";

const ELEMENT =
  "color(display-p3 0.079 0.201 0.346)";

const ACCENT =
  "color(display-p3 0.98 0.78 0.12)";

/* =========================================================
   DATA
========================================================= */

const heroTags = [
  "Home Workouts",
  "Exercise Library",
  "AI Trainer",
  "Fitness Tools",
];

const featureList = [
  {
    title: "Workout Wizard",
    description:
      "Build a workout based on the muscles you want to train.",
    icon: Wand2,
  },
  {
    title: "Exercise Library",
    description:
      "Explore hundreds of exercises with clear instructions.",
    icon: Database,
  },
  {
    title: "Calculators",
    description:
      "Calculate BMI, calories, protein, and more.",
    icon: Calculator,
  },
  {
    title: "AI Trainer",
    description:
      "Get instant answers and guidance whenever you need it.",
    icon: MessageSquare,
  },
  {
    title: "Kanban Board",
    description:
      "Organize your training and keep track of your progress.",
    icon: Columns3,
  },
  {
    title: "Mini Games",
    description:
      "Take a break, stay focused, and keep moving.",
    icon: Gamepad2,
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Hero = () => {
  const [selectedMuscle, setSelectedMuscle] =
    useState(null);

  const [highlightedMuscle, setHighlightedMuscle] =
    useState(null);

  const [mousePos, setMousePos] = useState({
    x: 0,
    y: 0,
  });

  const anatomyBoxRef = useRef(null);

  /* =======================================================
     PROBLEMS
  ======================================================= */

  const problemList = useMemo(
    () => [
      {
        id: 1,
        text: "No gym",
        solution: "Train at home with minimal equipment.",
        icon: MapPin,
      },
      {
        id: 2,
        text: "High cost",
        solution: "Free workouts, tools, and guidance.",
        icon: Calculator,
      },
      {
        id: 3,
        text: "Not sure what to do",
        solution: "Follow simple, step-by-step exercises.",
        icon: Info,
      },
      {
        id: 4,
        text: "Need guidance",
        solution: "Ask the AI trainer whenever you need help.",
        icon: MessageSquare,
      },
      {
        id: 5,
        text: "Limited knowledge",
        solution: "Learn from a large exercise library.",
        icon: Dumbbell,
      },
      {
        id: 6,
        text: "Can't get to the gym",
        solution: "Follow effective home workout plans.",
        icon: Zap,
      },
      {
        id: 7,
        text: "Need structure",
        solution: "Organize your training with Kanban.",
        icon: LayoutDashboard,
      },
      {
        id: 8,
        text: "Need motivation",
        solution: "Stay engaged with simple daily tools.",
        icon: Target,
      },
      {
        id: 9,
        text: "No equipment",
        solution: "Start with bodyweight exercises.",
        icon: Package,
      },
    ],
    []
  );

  /* =======================================================
     POINTER
  ======================================================= */

  const handlePointerMove = useCallback((e) => {
    if (!anatomyBoxRef.current) return;

    const rect =
      anatomyBoxRef.current.getBoundingClientRect();

    const clientX = e.touches
      ? e.touches[0].clientX
      : e.clientX;

    const clientY = e.touches
      ? e.touches[0].clientY
      : e.clientY;

    setMousePos({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
  }, []);

  /* =======================================================
     ANIMATION
  ======================================================= */

  const panelVariants = {
    hidden: {
      opacity: 0,
      y: 15,
    },

    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        delay: custom * 0.1,
      },
    }),
  };

  /* =======================================================
     SHARED PANEL
  ======================================================= */

  const panel =
    "mx-auto w-full max-w-5xl overflow-hidden border-2";

  return (
    <main
      className="min-h-screen w-full space-y-4 px-3 py-5 sm:px-5 md:space-y-5 md:px-8 md:py-8"
      style={{
        backgroundColor: BG,
        color: ELEMENT,
      }}
    >

      {/* =====================================================
          HERO
      ===================================================== */}

      <motion.section
        custom={0}
        initial="hidden"
        animate="visible"
        variants={panelVariants}
        className={panel}
        style={{
          borderColor: ELEMENT,
          backgroundColor: ELEMENT,
          color: BG,
        }}
      >
        <div className="p-7 text-center sm:p-10 md:p-14">

          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] opacity-60">
            Your Personal Fitness Hub
          </p>

          <h1 className="text-5xl font-light leading-none tracking-tight sm:text-7xl md:text-8xl">
            noTrainer{" "}
            <span className="font-normal">
              AI
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed opacity-80 sm:text-lg">
            Work out anywhere, learn as you go, and
            build a routine that works for you.
          </p>

          <div className="mt-8 flex flex-wrap justify-center">
            {heroTags.map((tag, index) => (
              <span
                key={tag}
                className={`border-2 px-4 py-2 text-[10px] font-bold uppercase tracking-wider ${
                  index !== heroTags.length - 1
                    ? "border-r-0"
                    : ""
                }`}
                style={{
                  borderColor: BG,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

        </div>
      </motion.section>

      {/* =====================================================
          ANATOMY
      ===================================================== */}

      <motion.section
        custom={1}
        initial="hidden"
        animate="visible"
        variants={panelVariants}
        className={panel}
        style={{
          borderColor: ELEMENT,
          backgroundColor: "transparent",
        }}
      >

        {/* HEADER */}

        <div
          className="border-b-2 p-6 sm:p-8"
          style={{
            borderColor: ELEMENT,
          }}
        >
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] opacity-50">
            Explore Your Body
          </p>

          <h2 className="text-3xl font-light uppercase tracking-tight sm:text-5xl">
            Choose a{" "}
            <span className="font-semibold">
              Muscle
            </span>
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-relaxed opacity-60">
            Select a muscle to find exercises that
            target it.
          </p>
        </div>

        {/* SELECTED MUSCLE */}

        <div
          className="flex min-h-[60px] items-center justify-between border-b-2 px-6 py-4 sm:px-8"
          style={{
            borderColor: ELEMENT,
          }}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">
            Selected
          </span>

          <span className="text-sm font-black uppercase">
            {selectedMuscle
              ? String(selectedMuscle)
              : "Select a muscle"}
          </span>
        </div>

        {/* ANATOMY */}

        <div
          ref={anatomyBoxRef}
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          className="relative flex w-full items-center justify-center overflow-auto p-6 sm:p-8 md:p-10"
        >
          <AnimatePresence>
            {highlightedMuscle && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: mousePos.x + 16,
                  y: mousePos.y - 32,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                }}
                className="pointer-events-none absolute left-0 top-0 z-50 border-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest"
                style={{
                  backgroundColor: BG,
                  color: ELEMENT,
                  borderColor: ELEMENT,
                }}
              >
                {highlightedMuscle}
              </motion.div>
            )}
          </AnimatePresence>

          {/* SVG IS NOT RESIZED HERE.
              FrontView controls its own size. */}

          <div className="shrink-0">
            <FrontView
              onHover={setHighlightedMuscle}
              onLeave={() =>
                setHighlightedMuscle(null)
              }
              onSelect={setSelectedMuscle}
              selectedMuscle={selectedMuscle}
              highlightedMuscle={highlightedMuscle}
            />
          </div>
        </div>
      </motion.section>

      {/* =====================================================
          SOLUTIONS
      ===================================================== */}

      <motion.section
        custom={2}
        initial="hidden"
        animate="visible"
        variants={panelVariants}
        className={panel}
        style={{
          backgroundColor: ELEMENT,
          color: BG,
          borderColor: ELEMENT,
        }}
      >

        {/* HEADER */}

        <div
          className="border-b-2 p-6 sm:p-8"
          style={{
            borderColor:
              "rgba(56, 244, 242, 0.2)",
          }}
        >
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] opacity-50">
            What You Need
          </p>

          <h2 className="text-3xl font-light uppercase tracking-tight sm:text-5xl">
            Simple{" "}
            <span className="font-semibold">
              Solutions
            </span>
          </h2>
        </div>

        {/* LIST */}

        <div>
          {problemList.map((problem) => {
            const Icon = problem.icon;

            return (
              <div
                key={problem.id}
                className="grid grid-cols-[32px_1fr] gap-4 border-b-2 p-5 last:border-b-0 sm:grid-cols-[40px_1fr_1fr] sm:items-center sm:gap-6 sm:p-6"
                style={{
                  borderColor:
                    "rgba(56, 244, 242, 0.12)",
                }}
              >

                {/* NUMBER */}

                <span className="text-xs font-black opacity-40">
                  {String(problem.id).padStart(
                    2,
                    "0"
                  )}
                </span>

                {/* PROBLEM */}

                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    strokeWidth={2}
                    className="shrink-0 opacity-60"
                  />

                  <span className="text-sm font-black uppercase tracking-wide">
                    {problem.text}
                  </span>
                </div>

                {/* SOLUTION */}

                <div className="col-start-2 flex items-start gap-2 sm:col-auto">
                  <ArrowRight
                    size={16}
                    className="mt-0.5 shrink-0 opacity-40"
                  />

                  <p className="text-sm leading-relaxed opacity-70">
                    {problem.solution}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      </motion.section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <motion.section
        custom={3}
        initial="hidden"
        animate="visible"
        variants={panelVariants}
        className={panel}
        style={{
          backgroundColor: ELEMENT,
          color: BG,
          borderColor: ELEMENT,
        }}
      >

        {/* HEADER */}

        <div
          className="border-b-2 p-6 sm:p-8"
          style={{
            borderColor:
              "rgba(56, 244, 242, 0.2)",
          }}
        >
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] opacity-50">
            Inside noTrainer
          </p>

          <h2 className="text-3xl font-light uppercase tracking-tight sm:text-5xl">
            Built to{" "}
            <span className="font-semibold">
              Help You Train
            </span>
          </h2>
        </div>

        {/* FEATURES */}

        <div className="grid grid-cols-1 md:grid-cols-2">
          {featureList.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`flex gap-4 p-5 sm:p-6 ${
                  index % 2 === 0
                    ? "md:border-r-2"
                    : ""
                } ${
                  index <
                  featureList.length - 2
                    ? "border-b-2"
                    : ""
                }`}
                style={{
                  borderColor:
                    "rgba(56, 244, 242, 0.12)",
                }}
              >

                {/* ICON */}

                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center"
                  style={{
                    backgroundColor: BG,
                    color: ELEMENT,
                  }}
                >
                  <Icon
                    size={19}
                    strokeWidth={2.5}
                  />
                </div>

                {/* TEXT */}

                <div>
                  <h3 className="mb-1 text-sm font-black uppercase tracking-wide">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-relaxed opacity-70">
                    {feature.description}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      </motion.section>
    </main>
  );
};

export default Hero;