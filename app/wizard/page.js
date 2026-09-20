"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  LayoutList,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";

import FrontView from "@/components/anatomy/FrontView";
import BackView from "@/components/anatomy/BackView";
import exercisesData from "@/public/exercises.json";

const BG = "color(display-p3 0.056 0.958 0.949)";
const ELEMENT = "color(display-p3 0.079 0.201 0.346)";
const SELECTED = "color(display-p3 0.98 0.78 0.12)";
const SELECTED_TEXT = "color(display-p3 0.079 0.201 0.346)";

const RotatingImage = ({ images = [], name }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [images.length]);

  if (!images.length) {
    return (
      <div className="flex h-full w-full items-center justify-center px-6 text-center text-xs font-bold uppercase tracking-widest opacity-40">
        No image available
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {images.map((image, index) => (
        <img
          key={`${image}-${index}`}
          src={`/exercises/${image || "placeholder.png"}`}
          alt={`${name} view ${index + 1}`}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
};

const SelectionCard = ({ title, count, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full border-2 p-4 text-left transition-transform duration-200 sm:p-5 ${
        active ? "wizard-selected" : "wizard-card"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="min-w-0 break-words text-base font-bold capitalize sm:text-lg">
          {title}
        </h3>

        <span className="shrink-0 border-2 border-current px-2 py-1 text-[10px] font-bold uppercase tracking-wider sm:px-3 sm:text-xs">
          {count}
        </span>
      </div>
    </button>
  );
};

const StepHeader = ({ children }) => {
  return (
    <div className="mb-6 text-center sm:mb-8">
      <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl md:text-4xl">
        {children}
      </h2>
    </div>
  );
};

const PrimaryButton = ({ children, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-center gap-3 border-2 px-5 py-4 text-sm font-black uppercase tracking-widest transition-all sm:py-5 sm:text-base ${
        disabled
          ? "cursor-not-allowed border-current opacity-30"
          : "wizard-primary"
      }`}
    >
      {children}
    </button>
  );
};

export default function WorkoutWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const [view, setView] = useState("front");

  const [muscle, setMuscle] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [category, setCategory] = useState(null);
  const [level, setLevel] = useState(null);

  const [routine, setRoutine] = useState([]);

  const [highlightedMuscle, setHighlightedMuscle] = useState(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);

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

  const equipmentCounts = useMemo(() => {
    const counts = {};

    availableEquipment.forEach((item) => {
      counts[item] = exercisesForMuscle.filter(
        (exercise) => exercise.equipment === item,
      ).length;
    });

    return counts;
  }, [availableEquipment, exercisesForMuscle]);

  const exercisesForEquipment = useMemo(() => {
    return exercisesForMuscle.filter(
      (exercise) => !equipment || exercise.equipment === equipment,
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

  const categoryCounts = useMemo(() => {
    const counts = {};

    availableCategories.forEach((item) => {
      counts[item] = exercisesForEquipment.filter(
        (exercise) => exercise.category === item,
      ).length;
    });

    return counts;
  }, [availableCategories, exercisesForEquipment]);

  const exercisesForCategory = useMemo(() => {
    return exercisesForEquipment.filter(
      (exercise) => !category || exercise.category === category,
    );
  }, [exercisesForEquipment, category]);

  const availableLevels = useMemo(() => {
    return [
      ...new Set(
        exercisesForCategory.map((exercise) => exercise.level).filter(Boolean),
      ),
    ].sort();
  }, [exercisesForCategory]);

  const levelCounts = useMemo(() => {
    const counts = {};

    availableLevels.forEach((item) => {
      counts[item] = exercisesForCategory.filter(
        (exercise) => exercise.level === item,
      ).length;
    });

    return counts;
  }, [availableLevels, exercisesForCategory]);

  const finalExercises = useMemo(() => {
    return exercisesForCategory.filter(
      (exercise) => !level || exercise.level === level,
    );
  }, [exercisesForCategory, level]);

  const currentPreview = finalExercises[activeIndex];

  const breadcrumbText = [muscle, equipment, category, level]
    .filter(Boolean)
    .join(" / ");

  useEffect(() => {
    if (!isModalOpen && !isRoutineModalOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isModalOpen, isRoutineModalOpen]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resetWizard = () => {
    setCurrentStep(0);

    setView("front");

    setMuscle(null);
    setEquipment(null);
    setCategory(null);
    setLevel(null);

    setHighlightedMuscle(null);
    setActiveIndex(0);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSelectMuscle = (selected) => {
    setMuscle(selected);

    setEquipment(null);
    setCategory(null);
    setLevel(null);
    setActiveIndex(0);
  };

  const handleSelectEquipment = (selected) => {
    setEquipment(selected);

    setCategory(null);
    setLevel(null);
    setActiveIndex(0);
  };

  const handleSelectCategory = (selected) => {
    setCategory(selected);

    setLevel(null);
    setActiveIndex(0);
  };

  const handleSelectLevel = (selected) => {
    setLevel(selected);

    setActiveIndex(0);
  };

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

  return (
    <div
      className="wizard-page relative w-full overflow-x-hidden"
      style={{
        backgroundColor: BG,
        color: ELEMENT,
      }}
    >
      <style>{`
        .wizard-page {
          --wizard-bg: ${BG};
          --wizard-element: ${ELEMENT};
          --wizard-selected: ${SELECTED};
          --wizard-selected-text: ${SELECTED_TEXT};
          min-height: 100svh;
          background: var(--wizard-bg);
          color: var(--wizard-element);
        }

        .wizard-card {
          background: var(--wizard-element);
          border-color: var(--wizard-element);
          color: var(--wizard-bg);
        }

        .wizard-card:hover {
          transform: translateY(-2px);
        }

        .wizard-selected {
          background: var(--wizard-selected);
          border-color: var(--wizard-selected-text);
          color: var(--wizard-selected-text);
        }

        .wizard-primary {
          background: var(--wizard-element);
          border-color: var(--wizard-element);
          color: var(--wizard-bg);
        }

        .wizard-primary:hover {
          opacity: 0.9;
        }

        .wizard-outline {
          background: transparent;
          border-color: var(--wizard-element);
          color: var(--wizard-element);
        }

        .wizard-outline:hover {
          background: var(--wizard-element);
          color: var(--wizard-bg);
        }

        .wizard-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .wizard-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .wizard-scroll::-webkit-scrollbar-thumb {
          background: var(--wizard-element);
        }

        .anatomy-svg-wrapper svg {
          display: block;
          width: 100% !important;
          height: auto !important;
          max-width: 100%;
          margin: 0 auto;
        }
      `}</style>

      {currentStep > 0 && (
        <header className="relative z-20 w-full border-b-2 border-current">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
            <div className="min-w-0">
              <h1 className="text-sm font-black uppercase tracking-tight sm:text-lg">
                Workout Wizard
              </h1>

              {breadcrumbText && (
                <p className="mt-1 hidden max-w-xl truncate text-xs font-bold opacity-50 md:block">
                  {breadcrumbText}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={resetWizard}
                className="wizard-outline flex h-10 items-center justify-center gap-2 border-2 px-3 text-xs font-bold uppercase tracking-wider sm:px-4"
              >
                <RotateCcw size={14} />

                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                onClick={() => setIsRoutineModalOpen(true)}
                className="wizard-primary flex h-10 items-center justify-center gap-2 border-2 px-3 text-xs font-bold uppercase tracking-wider sm:px-4"
              >
                <LayoutList size={14} />

                <span className="hidden sm:inline">Routine</span>

                <span>({routine.length})</span>
              </button>
            </div>
          </div>
        </header>
      )}

      <main className="relative w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            transition={{
              duration: 0.2,
            }}
            className="w-full"
          >
            {currentStep === 0 && (
              <section className="relative flex min-h-[100svh] w-full items-center justify-center px-5 py-20 sm:px-8 sm:py-24">
                <button
                  onClick={() => setIsRoutineModalOpen(true)}
                  className="wizard-outline absolute right-4 top-5 flex items-center gap-2 border-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider sm:right-6 sm:top-6 sm:px-4 sm:py-3 sm:text-xs"
                >
                  <LayoutList size={14} />
                  Routine ({routine.length})
                </button>

                <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
                  <h1 className="text-[clamp(3.3rem,16vw,7rem)] font-black uppercase leading-[0.88] tracking-[-0.055em]">
                    Workout
                    <br />
                    Wizard
                  </h1>

                  <p className="mt-6 max-w-md text-xs font-bold uppercase leading-relaxed tracking-[0.14em] opacity-60 sm:mt-8 sm:text-sm sm:tracking-widest md:text-base">
                    Find the right exercises for you
                  </p>

                  <button
                    onClick={handleNext}
                    className="wizard-primary mt-10 flex w-full max-w-sm items-center justify-center gap-3 border-2 px-5 py-4 text-base font-black uppercase tracking-widest sm:mt-14 sm:py-5 sm:text-lg"
                  >
                    Start
                    <ArrowRight size={20} strokeWidth={3} />
                  </button>
                </div>
              </section>
            )}

            {currentStep === 1 && (
              <section className="relative w-full px-5 py-14 sm:px-8 sm:py-20">
                <div className="mx-auto w-full max-w-5xl">
                  <StepHeader>Select a Target</StepHeader>

                  <div className="mb-7 flex justify-center gap-2 sm:mb-8 sm:gap-3">
                    {["front", "back"].map((item) => (
                      <button
                        key={item}
                        onClick={() => setView(item)}
                        className={`border-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors sm:px-8 sm:py-3 sm:text-sm ${
                          view === item ? "wizard-selected" : "wizard-outline"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <div className="anatomy-svg-wrapper mx-auto flex w-full max-w-[225px] items-center justify-center sm:max-w-[290px] md:max-w-[360px] lg:max-w-[400px]">
                    {view === "front" ? (
                      <FrontView
                        onSelect={handleSelectMuscle}
                        selectedMuscle={muscle}
                        highlightedMuscle={highlightedMuscle}
                        onHover={setHighlightedMuscle}
                        onLeave={() => setHighlightedMuscle(null)}
                      />
                    ) : (
                      <BackView
                        onSelect={handleSelectMuscle}
                        selectedMuscle={muscle}
                        highlightedMuscle={highlightedMuscle}
                        onHover={setHighlightedMuscle}
                        onLeave={() => setHighlightedMuscle(null)}
                      />
                    )}
                  </div>

                  {muscle && (
                    <div
                      className="mx-auto mt-6 w-fit px-4 py-2 text-center text-xs font-bold uppercase tracking-wider sm:text-sm"
                      style={{
                        backgroundColor: SELECTED,
                        color: SELECTED_TEXT,
                      }}
                    >
                      {muscle}
                    </div>
                  )}

                  <div className="mx-auto mt-9 w-full max-w-md sm:mt-10">
                    <PrimaryButton onClick={handleNext} disabled={!muscle}>
                      Next Step
                      <ArrowRight size={18} />
                    </PrimaryButton>
                  </div>
                </div>
              </section>
            )}

            {currentStep === 2 && (
              <section className="relative w-full px-5 py-14 sm:px-8 sm:py-20">
                <div className="mx-auto w-full max-w-4xl">
                  <StepHeader>Select Equipment</StepHeader>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    {availableEquipment.map((item) => (
                      <SelectionCard
                        key={item}
                        title={item}
                        count={equipmentCounts[item]}
                        active={equipment === item}
                        onClick={() => handleSelectEquipment(item)}
                      />
                    ))}
                  </div>

                  <div className="mt-8 sm:mt-10">
                    <PrimaryButton onClick={handleNext} disabled={!equipment}>
                      Next Step
                      <ArrowRight size={18} />
                    </PrimaryButton>
                  </div>
                </div>
              </section>
            )}

            {currentStep === 3 && (
              <section className="relative w-full px-5 py-14 sm:px-8 sm:py-20">
                <div className="mx-auto w-full max-w-4xl">
                  <StepHeader>Select Type</StepHeader>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    {availableCategories.map((item) => (
                      <SelectionCard
                        key={item}
                        title={item}
                        count={categoryCounts[item]}
                        active={category === item}
                        onClick={() => handleSelectCategory(item)}
                      />
                    ))}
                  </div>

                  <div className="mt-8 sm:mt-10">
                    <PrimaryButton onClick={handleNext} disabled={!category}>
                      Next Step
                      <ArrowRight size={18} />
                    </PrimaryButton>
                  </div>
                </div>
              </section>
            )}

            {currentStep === 4 && (
              <section className="relative w-full px-5 py-14 sm:px-8 sm:py-20">
                <div className="mx-auto w-full max-w-4xl">
                  <StepHeader>Select Difficulty</StepHeader>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    {availableLevels.map((item) => (
                      <SelectionCard
                        key={item}
                        title={item}
                        count={levelCounts[item]}
                        active={level === item}
                        onClick={() => handleSelectLevel(item)}
                      />
                    ))}
                  </div>

                  <div className="mt-8 sm:mt-10">
                    <PrimaryButton onClick={handleNext} disabled={!level}>
                      Show Workouts
                      <ArrowRight size={18} />
                    </PrimaryButton>
                  </div>
                </div>
              </section>
            )}

            {currentStep === 5 && (
              <section className="relative w-full px-5 py-14 sm:px-8 sm:py-20">
                <div className="mx-auto w-full max-w-6xl">
                  <div className="mb-8 flex flex-col gap-2 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
                    <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl md:text-4xl">
                      Your Workouts
                    </h2>

                    <p className="text-xs font-bold uppercase tracking-widest opacity-50 sm:text-sm">
                      {finalExercises.length} results
                    </p>
                  </div>

                  {finalExercises.length ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                      {finalExercises.map((exercise, index) => (
                        <button
                          key={exercise.id}
                          onClick={() => {
                            setActiveIndex(index);
                            setIsModalOpen(true);
                          }}
                          className="wizard-card flex min-h-[96px] w-full items-center border-2 p-4 text-left transition-transform sm:min-h-[115px] sm:p-5"
                        >
                          <h3 className="break-words text-base font-bold leading-snug sm:text-lg">
                            {exercise.name}
                          </h3>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="border-2 border-current p-8 text-center sm:p-12">
                      <p className="text-sm font-bold uppercase tracking-widest opacity-50">
                        No workouts found
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isModalOpen && currentPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 sm:p-5"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 15,
                scale: 0.98,
              }}
              onClick={(event) => event.stopPropagation()}
              className="wizard-scroll relative max-h-[90svh] w-full max-w-3xl overflow-y-auto border-2 border-current"
              style={{
                backgroundColor: BG,
                color: ELEMENT,
              }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="wizard-primary absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center border-2 sm:right-4 sm:top-4 sm:h-10 sm:w-10"
                aria-label="Close"
              >
                <X size={17} strokeWidth={3} />
              </button>

              <div
                className="border-b-2 border-current px-5 py-5 pr-16 sm:px-7 sm:py-7 sm:pr-20"
                style={{
                  backgroundColor: ELEMENT,
                  color: BG,
                }}
              >
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] opacity-60 sm:text-xs">
                  Exercise
                </p>

                <h3 className="break-words text-xl font-black uppercase leading-tight sm:text-2xl md:text-3xl">
                  {currentPreview.name}
                </h3>
              </div>

              <div
                className="relative flex h-[200px] w-full items-center justify-center overflow-hidden sm:h-[280px]"
                style={{
                  backgroundColor: ELEMENT,
                }}
              >
                <RotatingImage
                  images={currentPreview.images}
                  name={currentPreview.name}
                />
              </div>

              <div className="grid grid-cols-1 border-b-2 border-current sm:grid-cols-3">
                <div className="border-b-2 border-current p-4 sm:border-b-0 sm:border-r-2 sm:p-5">
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-widest opacity-50 sm:text-[10px]">
                    Equipment
                  </p>

                  <p className="break-words text-xs font-black uppercase sm:text-sm">
                    {currentPreview.equipment}
                  </p>
                </div>

                <div className="border-b-2 border-current p-4 sm:border-b-0 sm:border-r-2 sm:p-5">
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-widest opacity-50 sm:text-[10px]">
                    Category
                  </p>

                  <p className="break-words text-xs font-black uppercase sm:text-sm">
                    {currentPreview.category}
                  </p>
                </div>

                <div className="p-4 sm:p-5">
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-widest opacity-50 sm:text-[10px]">
                    Level
                  </p>

                  <p className="break-words text-xs font-black uppercase sm:text-sm">
                    {currentPreview.level}
                  </p>
                </div>
              </div>

              <div className="border-b-2 border-current p-5 sm:p-6">
                <p className="mb-2 text-xs font-black uppercase tracking-widest">
                  Target Muscles
                </p>

                <p className="text-sm font-bold uppercase leading-relaxed opacity-70">
                  {currentPreview.primaryMuscles?.join(" • ")}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 border-b-2 border-current p-5 sm:p-6">
                <h4 className="text-xs font-black uppercase tracking-widest sm:text-sm">
                  Instructions
                </h4>

                <span className="shrink-0 text-[10px] font-bold uppercase opacity-50 sm:text-xs">
                  {currentPreview.instructions?.length || 0} Steps
                </span>
              </div>

              <div>
                {currentPreview.instructions?.map((step, index) => (
                  <div
                    key={index}
                    className="flex gap-3 border-b-2 border-current p-4 sm:gap-4 sm:p-6"
                  >
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center text-[10px] font-black sm:h-8 sm:w-8 sm:text-xs"
                      style={{
                        backgroundColor: ELEMENT,
                        color: BG,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <p className="text-sm leading-relaxed opacity-80 sm:text-base">
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 sm:p-6">
                <button
                  onClick={() => toggleRoutine(currentPreview)}
                  className={`w-full border-2 px-4 py-4 text-xs font-black uppercase tracking-widest sm:text-sm ${
                    routine.some((item) => item.id === currentPreview.id)
                      ? "wizard-outline"
                      : "wizard-primary"
                  }`}
                >
                  {routine.some((item) => item.id === currentPreview.id)
                    ? "Remove from Routine"
                    : "Add to Routine"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isRoutineModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsRoutineModalOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 sm:p-5"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 15,
                scale: 0.98,
              }}
              onClick={(event) => event.stopPropagation()}
              className="flex max-h-[90svh] w-full max-w-3xl flex-col overflow-hidden border-2 border-current"
              style={{
                backgroundColor: BG,
                color: ELEMENT,
              }}
            >
              <div
                className="flex items-center justify-between gap-3 border-b-2 border-current p-4 sm:p-5"
                style={{
                  backgroundColor: ELEMENT,
                  color: BG,
                }}
              >
                <div>
                  <h2 className="text-lg font-black uppercase sm:text-2xl">
                    My Routine
                  </h2>

                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest opacity-60 sm:text-xs">
                    {routine.length} exercises
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {routine.length > 0 && (
                    <button
                      onClick={() => setRoutine([])}
                      className="px-2 py-2 text-[10px] font-bold uppercase tracking-wider opacity-70 transition-opacity hover:opacity-100 sm:px-3 sm:text-xs"
                    >
                      Clear
                    </button>
                  )}

                  <button
                    onClick={() => setIsRoutineModalOpen(false)}
                    className="flex h-9 w-9 items-center justify-center border-2 border-current sm:h-10 sm:w-10"
                    aria-label="Close routine"
                  >
                    <X size={17} strokeWidth={3} />
                  </button>
                </div>
              </div>

              <div className="wizard-scroll min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                {routine.length === 0 ? (
                  <div className="flex min-h-[180px] items-center justify-center text-center text-xs font-bold uppercase tracking-widest opacity-40 sm:text-sm">
                    Your routine is empty
                  </div>
                ) : (
                  <div className="space-y-3">
                    {routine.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="wizard-card flex items-center justify-between gap-3 border-2 p-4 sm:p-5"
                      >
                        <h3 className="min-w-0 break-words text-sm font-bold sm:text-base">
                          {exercise.name}
                        </h3>

                        <button
                          onClick={() => toggleRoutine(exercise)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-current sm:h-10 sm:w-10"
                          aria-label={`Remove ${exercise.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t-2 border-current p-4 sm:p-5">
                <button
                  onClick={exportRoutineCSV}
                  disabled={!routine.length}
                  className={`flex w-full items-center justify-center gap-3 border-2 px-4 py-4 text-xs font-black uppercase tracking-widest sm:text-sm ${
                    routine.length
                      ? "wizard-primary"
                      : "cursor-not-allowed border-current opacity-30"
                  }`}
                >
                  <Download size={17} strokeWidth={3} />
                  Export CSV
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
