"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FrontView from "@/components/anatomy/FrontView";
import BackView from "@/components/anatomy/BackView";
import exercisesData from "@/public/exercises.json";
import {
  RotateCcw,
  Trash2,
  X,
  LayoutList,
  Download,
  ArrowRight,
} from "lucide-react";

/* =========================================================
   DESIGN CONFIG
========================================================= */

const DESIGN = {
  colors: {
    background: "color(display-p3 0.056 0.958 0.949)",
    element: "color(display-p3 0.079 0.201 0.346)",

    // selected state
    selected: "color(display-p3 0.98 0.78 0.12)",
    selectedText: "color(display-p3 0.079 0.201 0.346)",
  },

  fontSize: {
    hero: "clamp(3.75rem, 8vw, 6rem)",
    section: "clamp(1.9rem, 3vw, 2.4rem)",
    cardTitle: "1.25rem",
    body: "1rem",
    small: "0.875rem",
  },

  borderWidth: "2px",
};

const baseTheme = {
  bg: "wizard-bg",
  header: "wizard-block",
  panel: "wizard-block",
  border: "wizard-border",
  textAccent: "wizard-text",
  bgAccent: "wizard-block",
  borderAccent: "wizard-border",
  hoverBorder: "wizard-hover-border",
  hoverBg: "wizard-hover-fill",
  textHover: "wizard-hover-text",
  textOnAccent: "wizard-block-text",
  modalBg: "wizard-modal-bg",
  scrollThumb: DESIGN.colors.element,
  scrollThumbHover: DESIGN.colors.element,
};

const themes = {
  0: baseTheme,
  1: baseTheme,
  2: baseTheme,
  3: baseTheme,
  4: baseTheme,
  5: baseTheme,
};

/* =========================================================
   ROTATING IMAGE
========================================================= */

const RotatingImage = ({ images = [], name, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images?.length]);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {images.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className={`absolute inset-0 transition-opacity duration-0 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={`/exercises/${image || "placeholder.png"}`}
            alt={`${name} view ${index + 1}`}
            className="h-full w-full object-contain"
          />
        </div>
      ))}
    </div>
  );
};

/* =========================================================
   SELECTION CARD
========================================================= */

const SelectionCard = ({ title, count, active, onClick, t }) => (
  <button
    onClick={onClick}
    className={`w-full border-2 p-5 text-left transition-colors duration-200 ${
      active ? "wizard-selected" : `${t.border} ${t.panel} ${t.hoverBorder}`
    }`}
  >
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold capitalize">{title}</h3>

      <div>
        <span
          className={`inline-flex border-2 px-3 py-1 text-xs font-bold uppercase tracking-widest ${
            active ? "border-current" : `${t.borderAccent} ${t.textOnAccent}`
          }`}
        >
          {count} options
        </span>
      </div>
    </div>
  </button>
);

/* =========================================================
   WORKOUT WIZARD
========================================================= */

export default function WorkoutWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);

  const [view, setView] = useState("front");

  const [muscle, setMuscle] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [category, setCategory] = useState(null);
  const [level, setLevel] = useState(null);

  const [routine, setRoutine] = useState([]);

  const [highlightedMuscle, setHighlightedMuscle] = useState(null);

  const [activeIndex, setActiveIndex] = useState(0);

  /* =======================================================
     DATA FILTERING
  ======================================================= */

  const exercisesForMuscle = useMemo(() => {
    if (!muscle) return [];

    return exercisesData.filter(
      (ex) =>
        ex.primaryMuscles?.includes(muscle) ||
        ex.secondaryMuscles?.includes(muscle),
    );
  }, [muscle]);

  const availableEquipment = useMemo(
    () =>
      [
        ...new Set(
          exercisesForMuscle.map((ex) => ex.equipment).filter(Boolean),
        ),
      ].sort(),
    [exercisesForMuscle],
  );

  const equipmentCounts = useMemo(() => {
    const counts = {};

    availableEquipment.forEach((eq) => {
      counts[eq] = exercisesForMuscle.filter(
        (ex) => ex.equipment === eq,
      ).length;
    });

    return counts;
  }, [availableEquipment, exercisesForMuscle]);

  const exercisesForEquipment = useMemo(
    () =>
      exercisesForMuscle.filter(
        (ex) => !equipment || ex.equipment === equipment,
      ),
    [exercisesForMuscle, equipment],
  );

  const availableCategories = useMemo(
    () =>
      [
        ...new Set(
          exercisesForEquipment.map((ex) => ex.category).filter(Boolean),
        ),
      ].sort(),
    [exercisesForEquipment],
  );

  const categoryCounts = useMemo(() => {
    const counts = {};

    availableCategories.forEach((cat) => {
      counts[cat] = exercisesForEquipment.filter(
        (ex) => ex.category === cat,
      ).length;
    });

    return counts;
  }, [availableCategories, exercisesForEquipment]);

  const exercisesForCategory = useMemo(
    () =>
      exercisesForEquipment.filter(
        (ex) => !category || ex.category === category,
      ),
    [exercisesForEquipment, category],
  );

  const availableLevels = useMemo(
    () => [
      ...new Set(exercisesForCategory.map((ex) => ex.level).filter(Boolean)),
    ],
    [exercisesForCategory],
  );

  const levelCounts = useMemo(() => {
    const counts = {};

    availableLevels.forEach((lvl) => {
      counts[lvl] = exercisesForCategory.filter(
        (ex) => ex.level === lvl,
      ).length;
    });

    return counts;
  }, [availableLevels, exercisesForCategory]);

  const finalExercises = useMemo(
    () => exercisesForCategory.filter((ex) => !level || ex.level === level),
    [exercisesForCategory, level],
  );

  const currentPreview = finalExercises[activeIndex];

  /* =======================================================
     HANDLERS
  ======================================================= */

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const resetWizard = () => {
    setMuscle(null);
    setEquipment(null);
    setCategory(null);
    setLevel(null);

    setActiveIndex(0);
    setCurrentStep(0);
  };

  const handleSelectMuscle = (selected) => {
    setMuscle(selected);

    setEquipment(null);
    setCategory(null);
    setLevel(null);
  };

  const handleSelectEquipment = (item) => {
    setEquipment(item);

    setCategory(null);
    setLevel(null);
  };

  const handleSelectCategory = (cat) => {
    setCategory(cat);
    setLevel(null);
  };

  const handleSelectLevel = (lvl) => {
    setLevel(lvl);
  };

  const toggleRoutine = (ex) => {
    setRoutine((prev) =>
      prev.some((item) => item.id === ex.id)
        ? prev.filter((item) => item.id !== ex.id)
        : [...prev, ex],
    );
  };

  const exportRoutineCSV = () => {
    if (!routine.length) return;

    const rows = [
      ["Name", "Equipment", "Type", "Difficulty", "Primary Muscles"],

      ...routine.map((ex) => [
        ex.name || "",
        ex.equipment || "",
        ex.category || "",
        ex.level || "",
        (ex.primaryMuscles || []).join(", "),
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
    link.setAttribute("download", "workout-routine.csv");

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const breadcrumbText = [muscle, equipment, category, level]
    .filter(Boolean)
    .join(" / ");

  const t = themes[currentStep] || themes[0];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className={`wizard-page relative flex h-[calc(100dvh-40px)] w-full flex-col overflow-hidden md:h-[calc(100dvh-48px)] ${t.bg}`}
    >
      <style>{`
        .wizard-page {
          --wizard-bg: ${DESIGN.colors.background};
          --wizard-element: ${DESIGN.colors.element};

          background: var(--wizard-bg);
          color: var(--wizard-element);
        }

        .wizard-selected {
  background: ${DESIGN.colors.selected} !important;
  border-color: ${DESIGN.colors.selected} !important;
  color: ${DESIGN.colors.selectedText} !important;
}

.wizard-selected * {
  color: ${DESIGN.colors.selectedText} !important;
}

.wizard-selected:hover {
  background: ${DESIGN.colors.selected} !important;
  border-color: ${DESIGN.colors.selectedText} !important;
}

        /* =========================
           BASE COLORS
        ========================= */

        .wizard-bg {
          background: var(--wizard-bg) !important;
          color: var(--wizard-element) !important;
        }

        .wizard-text {
          color: var(--wizard-element) !important;
        }

        .wizard-border {
          border-color: var(--wizard-element) !important;
        }

        /* =========================
           DARK BLOCKS
        ========================= */

        .wizard-block {
          background: var(--wizard-element) !important;
          border-color: var(--wizard-element) !important;
          color: var(--wizard-bg) !important;
        }

        .wizard-block-text {
          color: var(--wizard-bg) !important;
        }

        .wizard-block * {
          color: var(--wizard-bg);
        }

        /* =========================
           HOVER
        ========================= */

        .wizard-hover-border:hover {
          border-color: var(--wizard-element) !important;
        }

        .wizard-hover-fill:hover {
          background: var(--wizard-bg) !important;
          border-color: var(--wizard-element) !important;
          color: var(--wizard-element) !important;
        }

        .wizard-hover-fill:hover * {
          color: var(--wizard-element) !important;
        }

        .wizard-hover-text:hover {
          color: var(--wizard-element) !important;
        }

        /* =========================
           MODAL BACKGROUND
        ========================= */

        .wizard-modal-bg {
          background: color-mix(
            in srgb,
            ${DESIGN.colors.element} 88%,
            transparent
          ) !important;
        }

        /* =========================
           TYPOGRAPHY
        ========================= */

        .wizard-page h1,
        .wizard-page h2,
        .wizard-page h3,
        .wizard-page h4 {
          color: inherit;
        }

        .wizard-page h1 {
          letter-spacing: -0.035em;
        }

        .wizard-page h2 {
          font-size: ${DESIGN.fontSize.section};
        }

        .wizard-hero-title {
          font-size: ${DESIGN.fontSize.hero};
          letter-spacing: -0.055em !important;
        }

        /* =========================
           ANATOMY
        ========================= */

        .anatomy-svg-wrapper svg {
          width: 100% !important;
          height: 100% !important;

          max-width: 100%;
          max-height: 100%;

          display: block;
          margin: 0 auto;
        }

        /* =========================
           SCROLLBAR
        ========================= */

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: color-mix(
            in srgb,
            ${DESIGN.colors.element} 10%,
            transparent
          );
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${t.scrollThumb};
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${t.scrollThumbHover};
        }
      `}</style>

      {/* =====================================================
          HEADER
      ===================================================== */}

      {currentStep > 0 && (
        <header
          className={`flex h-16 shrink-0 items-center justify-between border-b-2 px-6 ${t.border} ${t.header}`}
        >
          <div className="flex min-w-0 items-center gap-4">
            <h1 className="shrink-0 text-xl font-bold uppercase">
              Workout <span className="font-black">Wizard</span>
            </h1>

            {breadcrumbText && (
              <span className="hidden truncate text-sm font-bold opacity-60 md:block">
                {breadcrumbText}
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              onClick={resetWizard}
              className={`flex items-center gap-2 border-2 px-4 py-2 text-xs font-bold uppercase tracking-widest ${t.border} ${t.panel} ${t.hoverBorder}`}
            >
              <RotateCcw size={14} />

              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={() => setIsRoutineModalOpen(true)}
              className={`flex items-center gap-2 border-2 px-4 py-2 text-xs font-bold uppercase tracking-widest ${t.borderAccent} ${t.bgAccent} ${t.textOnAccent} ${t.hoverBg}`}
            >
              <LayoutList size={14} />
              Routine ({routine.length})
            </button>
          </div>
        </header>
      )}

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.2,
            }}
            className="flex h-full w-full flex-col"
          >
            {/* =================================================
                STEP 0 — HERO
            ================================================= */}

            {currentStep === 0 && (
              <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
                <div className="absolute right-6 top-6 z-10">
                  <button
                    onClick={() => setIsRoutineModalOpen(true)}
                    className={`flex items-center gap-2 border-2 px-4 py-3 text-xs font-bold uppercase tracking-widest ${t.border} ${t.panel} ${t.hoverBorder}`}
                  >
                    <LayoutList size={14} />
                    Routine ({routine.length})
                  </button>
                </div>

                <div className="flex w-full max-w-3xl flex-col items-center justify-center">
                  <h1 className="wizard-hero-title font-black uppercase leading-[0.88]">
                    Workout
                    <br />
                    Wizard
                  </h1>

                  <p className="mt-8 text-lg font-bold uppercase tracking-widest opacity-60">
                    Find the right exercises for you
                  </p>

                  <button
                    onClick={handleNext}
                    className={`mt-16 flex w-full max-w-sm items-center justify-center gap-4 border-2 py-5 text-xl font-black uppercase tracking-widest ${t.borderAccent} ${t.textAccent} ${t.hoverBg}`}
                  >
                    Start
                    <ArrowRight size={24} strokeWidth={3} />
                  </button>
                </div>
              </div>
            )}

            {/* =================================================
                STEP 1 — MUSCLE
            ================================================= */}

            {currentStep === 1 && (
              <div className="flex h-full flex-col p-6">
                <div className="mb-6 flex shrink-0 flex-col items-center">
                  <h2 className="font-black uppercase">Select a Target</h2>

                  <div className="mt-6 flex gap-3">
                    {["front", "back"].map((v) => (
                      <button
                        key={v}
                        onClick={() => setView(v)}
                        className={`border-2 px-8 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${
                          view === v
                            ? "wizard-selected"
                            : `${t.border} ${t.panel} ${t.hoverBorder}`
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-hidden">
                  <div className="anatomy-svg-wrapper flex h-full w-full items-center justify-center overflow-hidden">
                    <div className="flex h-full w-full scale-[0.94] items-center justify-center sm:scale-[0.98] md:scale-[1.04]">
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
                  </div>
                </div>

                <div className="mt-6 flex shrink-0 justify-center">
                  <button
                    onClick={handleNext}
                    disabled={!muscle}
                    className={`flex w-full max-w-md items-center justify-center gap-3 border-2 p-5 text-base font-bold uppercase tracking-widest transition-colors ${
                      muscle
                        ? `${t.borderAccent} ${t.bgAccent} ${t.textOnAccent} ${t.hoverBg}`
                        : `cursor-not-allowed ${t.border} ${t.panel} opacity-40`
                    }`}
                  >
                    Next Step
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* =================================================
                STEP 2 — EQUIPMENT
            ================================================= */}

            {currentStep === 2 && (
              <div className="mx-auto flex h-full w-full max-w-4xl flex-col p-6">
                <h2 className="mb-8 shrink-0 text-center font-black uppercase">
                  Select Equipment
                </h2>

                <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pr-3">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {availableEquipment.map((item) => (
                      <SelectionCard
                        key={item}
                        title={item}
                        count={equipmentCounts[item]}
                        active={equipment === item}
                        onClick={() => handleSelectEquipment(item)}
                        t={t}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-8 shrink-0">
                  <button
                    onClick={handleNext}
                    disabled={!equipment}
                    className={`flex w-full items-center justify-center gap-3 border-2 p-5 text-base font-bold uppercase tracking-widest transition-colors ${
                      equipment
                        ? `${t.borderAccent} ${t.bgAccent} ${t.textOnAccent} ${t.hoverBg}`
                        : `cursor-not-allowed ${t.border} ${t.panel} opacity-40`
                    }`}
                  >
                    Next Step
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* =================================================
                STEP 3 — CATEGORY
            ================================================= */}

            {currentStep === 3 && (
              <div className="mx-auto flex h-full w-full max-w-4xl flex-col p-6">
                <h2 className="mb-8 shrink-0 text-center font-black uppercase">
                  Select Type
                </h2>

                <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pr-3">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {availableCategories.map((cat) => (
                      <SelectionCard
                        key={cat}
                        title={cat}
                        count={categoryCounts[cat]}
                        active={category === cat}
                        onClick={() => handleSelectCategory(cat)}
                        t={t}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-8 shrink-0">
                  <button
                    onClick={handleNext}
                    disabled={!category}
                    className={`flex w-full items-center justify-center gap-3 border-2 p-5 text-base font-bold uppercase tracking-widest transition-colors ${
                      category
                        ? `${t.borderAccent} ${t.bgAccent} ${t.textOnAccent} ${t.hoverBg}`
                        : `cursor-not-allowed ${t.border} ${t.panel} opacity-40`
                    }`}
                  >
                    Next Step
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* =================================================
                STEP 4 — DIFFICULTY
            ================================================= */}

            {currentStep === 4 && (
              <div className="mx-auto flex h-full w-full max-w-4xl flex-col p-6">
                <h2 className="mb-8 shrink-0 text-center font-black uppercase">
                  Select Difficulty
                </h2>

                <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pr-3">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {availableLevels.map((lvl) => (
                      <SelectionCard
                        key={lvl}
                        title={lvl}
                        count={levelCounts[lvl]}
                        active={level === lvl}
                        onClick={() => handleSelectLevel(lvl)}
                        t={t}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-8 shrink-0">
                  <button
                    onClick={handleNext}
                    disabled={!level}
                    className={`flex w-full items-center justify-center gap-3 border-2 p-5 text-base font-bold uppercase tracking-widest transition-colors ${
                      level
                        ? `${t.borderAccent} ${t.bgAccent} ${t.textOnAccent} ${t.hoverBg}`
                        : `cursor-not-allowed ${t.border} ${t.panel} opacity-40`
                    }`}
                  >
                    Show Workouts
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* =================================================
                STEP 5 — RESULTS
            ================================================= */}

            {currentStep === 5 && (
              <div className="mx-auto flex h-full w-full max-w-5xl flex-col p-6">
                <div className="mb-8 flex shrink-0 items-center justify-between">
                  <h2 className="font-black uppercase">
                    Your Workouts <span>({finalExercises.length})</span>
                  </h2>
                </div>

                <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pr-3">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {finalExercises.map((ex, idx) => (
                      <button
                        key={ex.id}
                        onClick={() => {
                          setActiveIndex(idx);
                          setIsModalOpen(true);
                        }}
                        className={`flex min-h-[110px] flex-col justify-center border-2 p-6 text-left transition-colors ${t.border} ${t.panel} ${t.hoverBorder}`}
                      >
                        <h3 className="text-lg font-bold">{ex.name}</h3>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* =====================================================
          EXERCISE MODAL
      ===================================================== */}

      <AnimatePresence>
        {isModalOpen && currentPreview && (
          <div
            className={`absolute inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md md:p-8 ${t.modalBg}`}
          >
            <div
              className={`relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden border-2 shadow-2xl ${t.borderAccent} ${t.bg}`}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className={`absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center border-2 transition-colors ${t.border} ${t.panel} ${t.hoverBg}`}
              >
                <X size={18} strokeWidth={3} />
              </button>

              <div className="custom-scrollbar overflow-y-auto p-6 md:p-8">
                <h3
                  className="mb-6 font-black uppercase leading-tight"
                  style={{
                    fontSize: DESIGN.fontSize.section,
                  }}
                >
                  {currentPreview.name}
                </h3>

                {/* IMAGE */}

                <div
                  className={`mb-8 flex w-full justify-center border-2 ${t.border} ${t.panel}`}
                >
                  <div className="relative aspect-[4/3] w-full max-w-md">
                    <RotatingImage
                      images={currentPreview.images}
                      name={currentPreview.name}
                    />
                  </div>
                </div>

                {/* META */}

                <div className="mb-8 flex flex-wrap gap-4 text-sm font-bold uppercase tracking-widest opacity-60">
                  <span>{currentPreview.equipment}</span>

                  <span>•</span>

                  <span>{currentPreview.category}</span>

                  <span>•</span>

                  <span>{currentPreview.level}</span>
                </div>

                {/* MUSCLES */}

                <div className="mb-10">
                  <h4 className="mb-4 text-sm font-black uppercase tracking-widest">
                    Target Muscles
                  </h4>

                  <div className="flex flex-wrap gap-3">
                    {currentPreview.primaryMuscles?.map((m) => (
                      <span
                        key={m}
                        className={`border-2 px-4 py-2 text-xs font-bold uppercase tracking-widest ${t.border} ${t.panel}`}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* INSTRUCTIONS */}

                <div className="mb-12">
                  <h4 className="mb-5 text-sm font-black uppercase tracking-widest">
                    Instructions
                  </h4>

                  <div className="space-y-6">
                    {currentPreview.instructions?.map((step, i) => (
                      <div key={i} className="flex gap-5">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center border-2 text-sm font-black ${t.borderAccent} ${t.bgAccent} ${t.textOnAccent}`}
                        >
                          {i + 1}
                        </span>

                        <p className="pt-1 text-base font-medium leading-relaxed opacity-80">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ADD / REMOVE */}

                <button
                  onClick={() => toggleRoutine(currentPreview)}
                  className={`w-full border-2 p-5 text-sm font-black uppercase tracking-widest transition-colors ${
                    routine.some((r) => r.id === currentPreview.id)
                      ? `${t.borderAccent} ${t.textAccent} ${t.hoverBg}`
                      : `${t.borderAccent} ${t.bgAccent} ${t.textOnAccent} ${t.hoverBg}`
                  }`}
                >
                  {routine.some((r) => r.id === currentPreview.id)
                    ? "Remove from Routine"
                    : "Add to Routine"}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================
          ROUTINE MODAL
      ===================================================== */}

      <AnimatePresence>
        {isRoutineModalOpen && (
          <div
            className={`absolute inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md md:p-8 ${t.modalBg}`}
          >
            <div
              className={`flex h-full w-full max-w-3xl flex-col overflow-hidden border-2 shadow-2xl ${t.borderAccent} ${t.bg}`}
            >
              {/* HEADER */}

              <div
                className={`flex shrink-0 items-center justify-between border-b-2 p-6 ${t.border} ${t.panel}`}
              >
                <h2 className="font-black uppercase">My Routine</h2>

                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setRoutine([])}
                    className="text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-60"
                  >
                    Clear All
                  </button>

                  <button
                    onClick={() => setIsRoutineModalOpen(false)}
                    className={`flex h-10 w-10 items-center justify-center border-2 transition-colors ${t.border} ${t.hoverBg}`}
                  >
                    <X size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>

              {/* ROUTINE CONTENT */}

              <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-6 md:p-8">
                {routine.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm font-bold uppercase tracking-widest opacity-40">
                    Your routine is empty
                  </div>
                ) : (
                  <div className="space-y-4">
                    {routine.map((ex) => (
                      <div
                        key={ex.id}
                        className={`flex items-center justify-between border-2 p-6 transition-colors ${t.border} ${t.panel} ${t.hoverBorder}`}
                      >
                        <div className="min-w-0 pr-4">
                          <h3 className="truncate text-lg font-bold">
                            {ex.name}
                          </h3>
                        </div>

                        <button
                          onClick={() => toggleRoutine(ex)}
                          className={`ml-4 flex h-12 w-12 shrink-0 items-center justify-center border-2 transition-colors ${t.borderAccent} ${t.hoverBg}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* EXPORT */}

              <div className={`shrink-0 border-t-2 p-6 ${t.border} ${t.panel}`}>
                <button
                  onClick={exportRoutineCSV}
                  disabled={routine.length === 0}
                  className={`flex w-full items-center justify-center gap-3 border-2 p-5 text-sm font-black uppercase tracking-widest transition-colors ${
                    routine.length === 0
                      ? `${t.borderAccent} opacity-30 cursor-not-allowed`
                      : `${t.borderAccent} ${t.bgAccent} ${t.textOnAccent} ${t.hoverBg}`
                  }`}
                >
                  <Download size={18} strokeWidth={3} />
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
