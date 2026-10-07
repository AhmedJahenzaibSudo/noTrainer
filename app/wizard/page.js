"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  RotateCcw,
  LayoutList,
  Download,
  Trash2,
  ArrowDown,
} from "lucide-react";

import FrontView from "@/components/anatomy/FrontView";
import BackView from "@/components/anatomy/BackView";
import exercisesData from "@/public/exercises.json";

const BG = "#09e0f4ff";
const DARK = "#142F50";
const ACCENT = "#FFD43B";

const TYPE_SPEED = 24;
const IMAGE_INTERVAL = 550;

/* -------------------------------------------------------
   HELPERS
------------------------------------------------------- */

function formatOption(value) {
  if (!value) return "";

  const normalized = value.toLowerCase();

  if (normalized === "body only" || normalized === "bodyweight") {
    return "bodyweight";
  }

  return value;
}

/* -------------------------------------------------------
   TYPEWRITER
------------------------------------------------------- */

function TypewriterText({
  text,
  speed = TYPE_SPEED,
  onComplete,
  className = "",
}) {
  const [displayed, setDisplayed] = useState("");
  const completedRef = useRef(false);

  useEffect(() => {
    let index = 0;

    completedRef.current = false;
    setDisplayed("");

    const interval = setInterval(() => {
      index += 1;

      setDisplayed(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);

        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayed}

      {displayed.length < text.length && <span className="type-cursor">▋</span>}
    </span>
  );
}

/* -------------------------------------------------------
   EXERCISE IMAGE
------------------------------------------------------- */

function ExerciseImages({ images = [], name }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);

    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, IMAGE_INTERVAL);

    return () => clearInterval(interval);
  }, [images]);

  if (!images?.length) {
    return (
      <div className="flex min-h-[180px] items-center justify-center text-sm opacity-50">
        No preview available.
      </div>
    );
  }

  return (
    <div className="relative flex w-full justify-center overflow-hidden">
      <img
        src={`/exercises/${images[index]}`}
        alt={`${name} demonstration`}
        className="block h-auto max-h-[360px] w-auto max-w-full object-contain"
      />
    </div>
  );
}

/* -------------------------------------------------------
   INLINE CHOICE
------------------------------------------------------- */

function InlineChoice({
  children,
  onClick,
  selected = false,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`conversation-choice ${
        selected ? "conversation-choice-selected" : ""
      }`}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------
   JOURNEY SECTION
------------------------------------------------------- */

function JourneySection({ children, className = "" }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* -------------------------------------------------------
   MAIN
------------------------------------------------------- */

export default function WorkoutWizard() {
  const [started, setStarted] = useState(false);

  const [view, setView] = useState(null);
  const [muscle, setMuscle] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [category, setCategory] = useState(null);
  const [level, setLevel] = useState(null);

  const [greetingTyped, setGreetingTyped] = useState(false);
  const [viewTyped, setViewTyped] = useState(false);
  const [muscleTyped, setMuscleTyped] = useState(false);
  const [equipmentTyped, setEquipmentTyped] = useState(false);
  const [categoryTyped, setCategoryTyped] = useState(false);
  const [levelTyped, setLevelTyped] = useState(false);
  const [summaryTyped, setSummaryTyped] = useState(false);

  const [highlightedMuscle, setHighlightedMuscle] = useState(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const [isExerciseOpen, setIsExerciseOpen] = useState(false);
  const [isRoutineOpen, setIsRoutineOpen] = useState(false);

  const [routine, setRoutine] = useState([]);

  const bottomRef = useRef(null);

  /* -------------------------------------------------------
     DATA
  ------------------------------------------------------- */

  const exercisesForMuscle = useMemo(() => {
    if (!muscle) return [];

    return exercisesData.filter(
      (exercise) =>
        exercise.primaryMuscles?.includes(muscle) ||
        exercise.secondaryMuscles?.includes(muscle),
    );
  }, [muscle]);

  const availableEquipment = useMemo(() => {
    return [
      ...new Set(
        exercisesForMuscle
          .map((exercise) => exercise.equipment)
          .filter(Boolean),
      ),
    ].sort();
  }, [exercisesForMuscle]);

  const exercisesForEquipment = useMemo(() => {
    if (!equipment) return exercisesForMuscle;

    return exercisesForMuscle.filter(
      (exercise) => exercise.equipment === equipment,
    );
  }, [exercisesForMuscle, equipment]);

  const availableCategories = useMemo(() => {
    return [
      ...new Set(
        exercisesForEquipment
          .map((exercise) => exercise.category)
          .filter(Boolean),
      ),
    ].sort();
  }, [exercisesForEquipment]);

  const exercisesForCategory = useMemo(() => {
    if (!category) return exercisesForEquipment;

    return exercisesForEquipment.filter(
      (exercise) => exercise.category === category,
    );
  }, [exercisesForEquipment, category]);

  const availableLevels = useMemo(() => {
    return [
      ...new Set(
        exercisesForCategory.map((exercise) => exercise.level).filter(Boolean),
      ),
    ].sort();
  }, [exercisesForCategory]);

  const finalExercises = useMemo(() => {
    if (!level) return exercisesForCategory;

    return exercisesForCategory.filter((exercise) => exercise.level === level);
  }, [exercisesForCategory, level]);

  const currentExercise = finalExercises[activeIndex];

  /* -------------------------------------------------------
     AUTO SCROLL
  ------------------------------------------------------- */

  useEffect(() => {
    if (!started) return;

    const timeout = setTimeout(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 160);

    return () => clearTimeout(timeout);
  }, [
    started,
    greetingTyped,
    viewTyped,
    muscleTyped,
    equipmentTyped,
    categoryTyped,
    levelTyped,
    summaryTyped,
    view,
    muscle,
    equipment,
    category,
    level,
  ]);

  /* -------------------------------------------------------
     BODY LOCK
  ------------------------------------------------------- */

  useEffect(() => {
    if (!isExerciseOpen && !isRoutineOpen) return;

    const previous = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [isExerciseOpen, isRoutineOpen]);

  /* -------------------------------------------------------
     START
  ------------------------------------------------------- */

  const startJourney = () => {
    setStarted(true);
  };

  /* -------------------------------------------------------
     RESET
  ------------------------------------------------------- */

  const reset = () => {
    setStarted(false);

    setView(null);
    setMuscle(null);
    setEquipment(null);
    setCategory(null);
    setLevel(null);

    setGreetingTyped(false);
    setViewTyped(false);
    setMuscleTyped(false);
    setEquipmentTyped(false);
    setCategoryTyped(false);
    setLevelTyped(false);
    setSummaryTyped(false);

    setHighlightedMuscle(null);
    setActiveIndex(0);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* -------------------------------------------------------
     ROUTINE
  ------------------------------------------------------- */

  const toggleRoutine = (exercise) => {
    setRoutine((current) => {
      const exists = current.some((item) => item.id === exercise.id);

      if (exists) {
        return current.filter((item) => item.id !== exercise.id);
      }

      return [...current, exercise];
    });
  };

  const exportRoutineCSV = () => {
    if (!routine.length) return;

    const rows = [
      ["Name", "Equipment", "Type", "Difficulty", "Primary Muscles"],
      ...routine.map((exercise) => [
        exercise.name || "",
        exercise.equipment || "",
        exercise.category || "",
        exercise.level || "",
        (exercise.primaryMuscles || []).join(", "),
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "workout-routine.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* -------------------------------------------------------
     SELECTIONS
  ------------------------------------------------------- */

  const selectView = (selectedView) => {
    if (view) return;

    setView(selectedView);
  };

  const selectMuscle = (selectedMuscle) => {
    if (muscle) return;

    setMuscle(selectedMuscle);
  };

  const selectEquipment = (selectedEquipment) => {
    if (equipment) return;

    setEquipment(selectedEquipment);
  };

  const selectCategory = (selectedCategory) => {
    if (category) return;

    setCategory(selectedCategory);
  };

  const selectLevel = (selectedLevel) => {
    if (level) return;

    setLevel(selectedLevel);
    setActiveIndex(0);
  };

  /* -------------------------------------------------------
     PAGE
  ------------------------------------------------------- */

  return (
    <div
      className="wizard-page min-h-screen w-full"
      style={{
        backgroundColor: BG,
        color: DARK,
      }}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Slackey&display=swap");

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: ${BG};
          color: ${DARK};
        }

        .wizard-page {
          min-height: 100svh;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .slackey {
          font-family: "Slackey", cursive;
          font-weight: 400;
        }

        .type-cursor {
          display: inline-block;
          margin-left: 3px;
          font-size: 0.7em;
          animation: blink 0.8s infinite;
        }

        @keyframes blink {
          0%,
          45% {
            opacity: 1;
          }

          46%,
          100% {
            opacity: 0;
          }
        }

        .conversation-choice {
          position: relative;
          display: inline;
          appearance: none;
          padding: 0;
          margin: 0 0.08em;
          border: 0;
          background: transparent;
          color: ${DARK};
          font: inherit;
          font-weight: 800;
          cursor: pointer;

          text-decoration-line: underline;
          text-decoration-style: dotted;
          text-decoration-thickness: 2px;
          text-underline-offset: 6px;

          transition:
            background-color 160ms ease,
            opacity 160ms ease;
        }

        .conversation-choice:hover:not(:disabled) {
          background: ${ACCENT};
        }

        .conversation-choice-selected {
          background: ${ACCENT};
          text-decoration-color: transparent;
        }

        .conversation-choice:disabled {
          cursor: default;
        }

        .conversation-choice:disabled:not(.conversation-choice-selected) {
          opacity: 0.35;
        }

        .conversation-choice:focus-visible {
          outline: 2px solid ${DARK};
          outline-offset: 4px;
        }

        .anatomy-svg-wrapper svg {
          width: 100%;
          height: auto;
          max-height: 62svh;
        }

        .workout-item {
          position: relative;
          display: block;
          width: 100%;
          padding: 14px 0;
          border: 0;
          background: transparent;
          text-align: left;
          color: ${DARK};
          cursor: pointer;
          transition:
            transform 180ms ease,
            opacity 180ms ease;
        }

        .workout-item:hover {
          transform: translateX(6px);
        }

        .summary-value {
          font-weight: 800;
          text-transform: capitalize;
        }

        @media (max-width: 640px) {
          .anatomy-svg-wrapper svg {
            max-height: 53svh;
          }
        }
      `}</style>

      {/* ---------------------------------------------------
          TOP CONTROLS
      --------------------------------------------------- */}

      {started && (
        <div className="fixed right-4 top-12 z-40 flex items-center gap-2 sm:right-6 sm:top-10">
          <button
            type="button"
            onClick={reset}
            aria-label="Reset workout wizard"
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              backgroundColor: DARK,
              color: BG,
            }}
          >
            <RotateCcw size={16} />
          </button>

          <button
            type="button"
            onClick={() => setIsRoutineOpen(true)}
            aria-label="Open routine"
            className="relative flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              backgroundColor: ACCENT,
              color: DARK,
            }}
          >
            <LayoutList size={17} />

            {routine.length > 0 && (
              <span
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-black"
                style={{
                  backgroundColor: DARK,
                  color: BG,
                }}
              >
                {routine.length}
              </span>
            )}
          </button>
        </div>
      )}

      {/* ---------------------------------------------------
          START SCREEN
      --------------------------------------------------- */}

      {!started ? (
        <main className="flex min-h-[100svh] items-center justify-center px-5 py-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full max-w-5xl text-center"
          >
            <h1
              className="slackey text-[clamp(3.2rem,12vw,8.2rem)] leading-[0.9]"
              style={{ color: DARK }}
            >
              Workout
              <br />
              Wizard
            </h1>

            <button
              type="button"
              onClick={startJourney}
              className="group mx-auto mt-12 flex items-center gap-3 text-base font-black"
            >
              <span
                className="border-b-2 border-dotted pb-1"
                style={{ borderColor: DARK }}
              >
                Click to Begin
              </span>
            </button>
          </motion.div>
        </main>
      ) : (
        <main className="mx-auto w-full max-w-4xl px-5 pb-40 pt-28 sm:px-8 sm:pb-52 sm:pt-36">
          <div className="space-y-24 sm:space-y-32">
            {/* ------------------------------------------------
                GREETING
            ------------------------------------------------ */}

            <JourneySection>
              <p className="slackey max-w-3xl text-[clamp(2rem,5.5vw,4rem)] leading-[1.2]">
                <TypewriterText
                  text="Hey. Let's build your workout."
                  onComplete={() => setGreetingTyped(true)}
                />
              </p>
            </JourneySection>

            {/* ------------------------------------------------
                VIEW
            ------------------------------------------------ */}

            {greetingTyped && (
              <JourneySection>
                <p className="slackey max-w-3xl text-2xl leading-[1.5] sm:text-3xl">
                  <TypewriterText
                    text="First, which side do you want to explore?"
                    onComplete={() => setViewTyped(true)}
                  />
                </p>

                {viewTyped && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 text-xl leading-relaxed sm:text-2xl"
                  >
                    Show me the{" "}
                    <InlineChoice
                      onClick={() => selectView("front")}
                      selected={view === "front"}
                      disabled={Boolean(view)}
                    >
                      front
                    </InlineChoice>{" "}
                    or{" "}
                    <InlineChoice
                      onClick={() => selectView("back")}
                      selected={view === "back"}
                      disabled={Boolean(view)}
                    >
                      back
                    </InlineChoice>
                    .
                  </motion.p>
                )}
              </JourneySection>
            )}

            {/* ------------------------------------------------
                MUSCLE
            ------------------------------------------------ */}

            {view && (
              <JourneySection>
                <p className="slackey max-w-3xl text-2xl leading-[1.5] sm:text-3xl">
                  <TypewriterText
                    text="Now choose the muscle you want to train."
                    onComplete={() => setMuscleTyped(true)}
                  />
                </p>

                {muscleTyped && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 flex justify-center"
                  >
                    <div className="w-full max-w-[250px] sm:max-w-[310px]">
                      <div className="anatomy-svg-wrapper">
                        {view === "front" ? (
                          <FrontView
                            onSelect={selectMuscle}
                            selectedMuscle={muscle}
                            highlightedMuscle={highlightedMuscle}
                            onHover={setHighlightedMuscle}
                            onLeave={() => setHighlightedMuscle(null)}
                          />
                        ) : (
                          <BackView
                            onSelect={selectMuscle}
                            selectedMuscle={muscle}
                            highlightedMuscle={highlightedMuscle}
                            onHover={setHighlightedMuscle}
                            onLeave={() => setHighlightedMuscle(null)}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {muscle && (
                  <p className="mt-8 text-center text-lg font-bold capitalize">
                    {muscle}
                  </p>
                )}
              </JourneySection>
            )}

            {/* ------------------------------------------------
                EQUIPMENT
            ------------------------------------------------ */}

            {/* ------------------------------------------------
    EQUIPMENT
------------------------------------------------ */}

            {muscle && (
              <JourneySection>
                <p className="slackey max-w-3xl text-2xl leading-[1.5] sm:text-3xl">
                  <TypewriterText
                    text="What equipment do you have?"
                    onComplete={() => setEquipmentTyped(true)}
                  />
                </p>

                {equipmentTyped && (
                  <>
                    {/* EQUIPMENT OPTIONS EXCEPT BODY ONLY */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6 max-w-3xl text-xl leading-[1.9] sm:text-2xl"
                    >
                      {availableEquipment
                        .filter((item) => item.toLowerCase() !== "body only")
                        .map((item, index, filteredItems) => (
                          <React.Fragment key={item}>
                            <InlineChoice
                              onClick={() => selectEquipment(item)}
                              selected={equipment === item}
                              disabled={Boolean(equipment)}
                            >
                              {formatOption(item)}
                            </InlineChoice>

                            {index < filteredItems.length - 2 && ", "}

                            {index === filteredItems.length - 2 && " or "}
                          </React.Fragment>
                        ))}
                      .
                    </motion.p>

                    {/* BODYWEIGHT SEPARATE OPTION */}
                    {availableEquipment.some(
                      (item) => item.toLowerCase() === "body only",
                    ) && (
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mt-8 max-w-2xl text-lg leading-relaxed sm:text-xl"
                      >
                        Don&apos;t have any equipment? No problem. You can train
                        with just your{" "}
                        <InlineChoice
                          onClick={() => selectEquipment("body only")}
                          selected={equipment === "body only"}
                          disabled={Boolean(equipment)}
                        >
                          bodyweight
                        </InlineChoice>
                        .
                      </motion.p>
                    )}
                  </>
                )}
              </JourneySection>
            )}

            {/* ------------------------------------------------
                CATEGORY
            ------------------------------------------------ */}

            {equipment && (
              <JourneySection>
                <p className="slackey max-w-3xl text-2xl leading-[1.5] sm:text-3xl">
                  <TypewriterText
                    text="What kind of movement are you looking for?"
                    onComplete={() => setCategoryTyped(true)}
                  />
                </p>

                {categoryTyped && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 max-w-3xl text-xl leading-[1.9] sm:text-2xl"
                  >
                    {availableCategories.map((item, index) => (
                      <React.Fragment key={item}>
                        <InlineChoice
                          onClick={() => selectCategory(item)}
                          selected={category === item}
                          disabled={Boolean(category)}
                        >
                          {item}
                        </InlineChoice>

                        {index < availableCategories.length - 2 && ", "}

                        {index === availableCategories.length - 2 && " or "}
                      </React.Fragment>
                    ))}
                    .
                  </motion.p>
                )}
              </JourneySection>
            )}

            {/* ------------------------------------------------
                LEVEL
            ------------------------------------------------ */}

            {category && (
              <JourneySection>
                <p className="slackey max-w-3xl text-2xl leading-[1.5] sm:text-3xl">
                  <TypewriterText
                    text="What's your experience level?"
                    onComplete={() => setLevelTyped(true)}
                  />
                </p>

                {levelTyped && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 max-w-3xl text-xl leading-[1.9] sm:text-2xl"
                  >
                    {availableLevels.map((item, index) => (
                      <React.Fragment key={item}>
                        <InlineChoice
                          onClick={() => selectLevel(item)}
                          selected={level === item}
                          disabled={Boolean(level)}
                        >
                          {item}
                        </InlineChoice>

                        {index < availableLevels.length - 2 && ", "}

                        {index === availableLevels.length - 2 && " or "}
                      </React.Fragment>
                    ))}
                    .
                  </motion.p>
                )}
              </JourneySection>
            )}

            {/* ------------------------------------------------
                SUMMARY
            ------------------------------------------------ */}

            {level && (
              <JourneySection>
                <p className="slackey max-w-3xl text-2xl leading-[1.5] sm:text-3xl">
                  <TypewriterText
                    text="Alright. Here's what we're working with."
                    onComplete={() => setSummaryTyped(true)}
                  />
                </p>

                {summaryTyped && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="mt-10 space-y-4 text-lg sm:text-xl"
                  >
                    <p>
                      View — <span className="summary-value">{view}</span>
                    </p>

                    <p>
                      Muscle — <span className="summary-value">{muscle}</span>
                    </p>

                    <p>
                      Equipment —{" "}
                      <span className="summary-value">
                        {formatOption(equipment)}
                      </span>
                    </p>

                    <p>
                      Movement —{" "}
                      <span className="summary-value">{category}</span>
                    </p>

                    <p>
                      Level — <span className="summary-value">{level}</span>
                    </p>
                  </motion.div>
                )}
              </JourneySection>
            )}

            {/* ------------------------------------------------
                EXERCISES
            ------------------------------------------------ */}

            {summaryTyped && (
              <JourneySection>
                <div className="mb-10">
                  <h2 className="slackey text-3xl leading-tight sm:text-5xl">
                    Your workouts
                  </h2>

                  <p className="mt-4 text-base opacity-55 sm:text-lg">
                    {finalExercises.length}{" "}
                    {finalExercises.length === 1
                      ? "exercise matches"
                      : "exercises match"}{" "}
                    your choices.
                  </p>
                </div>

                {finalExercises.length > 0 ? (
                  <div className="space-y-1">
                    {finalExercises.map((exercise, index) => (
                      <motion.button
                        key={exercise.id}
                        type="button"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: Math.min(index * 0.035, 0.4),
                        }}
                        onClick={() => {
                          setActiveIndex(index);
                          setIsExerciseOpen(true);
                        }}
                        className="workout-item"
                      >
                        <span className="text-xl font-semibold sm:text-2xl">
                          {exercise.name}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <p className="text-lg opacity-50">
                    No workouts matched this combination.
                  </p>
                )}
              </JourneySection>
            )}

            <div ref={bottomRef} className="h-1" />
          </div>
        </main>
      )}

      {/* ---------------------------------------------------
          EXERCISE MODAL
      --------------------------------------------------- */}

      <AnimatePresence>
        {isExerciseOpen && currentExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
            style={{
              backgroundColor: BG,
              color: DARK,
            }}
          >
            <div className="mx-auto min-h-screen w-full max-w-4xl px-5 pb-20 pt-12 sm:px-8 sm:pt-8">
              {/* Header actions */}
              <div className="mb-8 flex justify-end">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleRoutine(currentExercise)}
                    className="text-sm font-black underline decoration-dotted decoration-2 underline-offset-4"
                  >
                    {routine.some((item) => item.id === currentExercise.id)
                      ? "Remove from routine"
                      : "Add to routine"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsExerciseOpen(false)}
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: DARK,
                      color: BG,
                    }}
                    aria-label="Close"
                  >
                    <X size={19} />
                  </button>
                </div>
              </div>

              {/* Exercise title */}
              <h1 className="slackey mx-auto max-w-3xl text-center text-4xl leading-tight sm:text-6xl">
                {" "}
                {currentExercise.name}
              </h1>

              {/* Exercise metadata */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-bold opacity-50">
                {" "}
                {[
                  currentExercise.primaryMuscles?.length > 0
                    ? currentExercise.primaryMuscles.join(", ")
                    : null,
                  formatOption(currentExercise.equipment),
                  currentExercise.category,
                  currentExercise.level,
                ]
                  .filter(Boolean)
                  .map((item, index) => (
                    <span
                      key={`${item}-${index}`}
                      className="flex items-center gap-3"
                    >
                      {index > 0 && <span className="opacity-40">/</span>}

                      <span className="capitalize">{item}</span>
                    </span>
                  ))}
              </div>

              {/* Exercise images */}
              <div className="mt-8">
                <ExerciseImages
                  images={currentExercise.images}
                  name={currentExercise.name}
                />
              </div>

              {/* Instructions */}
              {currentExercise.instructions?.length > 0 && (
                <div className="mt-16">
                  <h2 className="slackey text-3xl sm:text-4xl">How to do it</h2>

                  <div className="mt-8 space-y-8">
                    {currentExercise.instructions.map((step, index) => (
                      <div key={index} className="flex gap-5">
                        <span className="shrink-0 text-sm font-bold opacity-40">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <p className="max-w-2xl text-lg leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------
          ROUTINE
      --------------------------------------------------- */}

      <AnimatePresence>
        {isRoutineOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] overflow-y-auto"
            style={{
              backgroundColor: BG,
              color: DARK,
            }}
          >
            <div className="mx-auto min-h-screen w-full max-w-4xl px-5 pb-20 pt-5 sm:px-8 sm:pt-8">
              <div className="flex justify-end">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={exportRoutineCSV}
                    disabled={!routine.length}
                    className="flex items-center gap-2 text-sm font-black underline decoration-dotted decoration-2 underline-offset-4 disabled:opacity-30"
                  >
                    <Download size={15} />
                    Export CSV
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsRoutineOpen(false)}
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: DARK,
                      color: BG,
                    }}
                    aria-label="Close routine"
                  >
                    <X size={19} />
                  </button>
                </div>
              </div>

              <div className="mt-16">
                <h1 className="slackey text-5xl sm:text-7xl">My Routine</h1>

                <p className="mt-5 text-lg opacity-60">
                  {routine.length}{" "}
                  {routine.length === 1 ? "exercise" : "exercises"}
                </p>
              </div>

              {routine.length === 0 ? (
                <p className="mt-16 text-xl opacity-50">Nothing here yet.</p>
              ) : (
                <div className="mt-12 space-y-4">
                  {routine.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="flex items-center justify-between gap-5 py-3"
                    >
                      <p className="text-lg font-semibold sm:text-xl">
                        {exercise.name}
                      </p>

                      <button
                        type="button"
                        onClick={() => toggleRoutine(exercise)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: ACCENT,
                          color: DARK,
                        }}
                        aria-label={`Remove ${exercise.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
