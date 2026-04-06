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
  ChevronDown,
} from "lucide-react";

// Dynamic Themes (No Black, Flat color transitions)
const themes = {
  0: {
    // Hero: Deep Navy & Cyan
    bg: "bg-indigo-950",
    header: "bg-indigo-900",
    panel: "bg-indigo-900",
    border: "border-indigo-800",
    textAccent: "text-cyan-400",
    bgAccent: "bg-cyan-400",
    borderAccent: "border-cyan-400",
    hoverBorder: "hover:border-cyan-400",
    hoverBg: "hover:bg-cyan-400",
    textHover: "hover:text-indigo-950",
    textOnAccent: "text-indigo-950",
    modalBg: "bg-indigo-950/95",
    scrollThumb: "rgba(34,211,238,0.3)",
    scrollThumbHover: "rgba(34,211,238,0.6)",
  },
  1: {
    // Muscle: Deep Violet & Pink
    bg: "bg-violet-950",
    header: "bg-violet-900",
    panel: "bg-violet-900",
    border: "border-violet-800",
    textAccent: "text-pink-400",
    bgAccent: "bg-pink-400",
    borderAccent: "border-pink-400",
    hoverBorder: "hover:border-pink-400",
    hoverBg: "hover:bg-pink-400",
    textHover: "hover:text-violet-950",
    textOnAccent: "text-violet-950",
    modalBg: "bg-violet-950/95",
    scrollThumb: "rgba(244,114,182,0.3)",
    scrollThumbHover: "rgba(244,114,182,0.6)",
  },
  2: {
    // Equipment: Emerald & Amber
    bg: "bg-emerald-950",
    header: "bg-emerald-900",
    panel: "bg-emerald-900",
    border: "border-emerald-800",
    textAccent: "text-amber-400",
    bgAccent: "bg-amber-400",
    borderAccent: "border-amber-400",
    hoverBorder: "hover:border-amber-400",
    hoverBg: "hover:bg-amber-400",
    textHover: "hover:text-emerald-950",
    textOnAccent: "text-emerald-950",
    modalBg: "bg-emerald-950/95",
    scrollThumb: "rgba(251,191,36,0.3)",
    scrollThumbHover: "rgba(251,191,36,0.6)",
  },
  3: {
    // Category: Deep Rose & Orange
    bg: "bg-rose-950",
    header: "bg-rose-900",
    panel: "bg-rose-900",
    border: "border-rose-800",
    textAccent: "text-orange-400",
    bgAccent: "bg-orange-400",
    borderAccent: "border-orange-400",
    hoverBorder: "hover:border-orange-400",
    hoverBg: "hover:bg-orange-400",
    textHover: "hover:text-rose-950",
    textOnAccent: "text-rose-950",
    modalBg: "bg-rose-950/95",
    scrollThumb: "rgba(251,146,60,0.3)",
    scrollThumbHover: "rgba(251,146,60,0.6)",
  },
  4: {
    // Difficulty: Slate Blue & Lime
    bg: "bg-slate-900",
    header: "bg-slate-800",
    panel: "bg-slate-800",
    border: "border-slate-700",
    textAccent: "text-lime-400",
    bgAccent: "bg-lime-400",
    borderAccent: "border-lime-400",
    hoverBorder: "hover:border-lime-400",
    hoverBg: "hover:bg-lime-400",
    textHover: "hover:text-slate-900",
    textOnAccent: "text-slate-900",
    modalBg: "bg-slate-900/95",
    scrollThumb: "rgba(163,230,53,0.3)",
    scrollThumbHover: "rgba(163,230,53,0.6)",
  },
  5: {
    // Results: Royal Blue & Yellow
    bg: "bg-blue-950",
    header: "bg-blue-900",
    panel: "bg-blue-900",
    border: "border-blue-800",
    textAccent: "text-yellow-400",
    bgAccent: "bg-yellow-400",
    borderAccent: "border-yellow-400",
    hoverBorder: "hover:border-yellow-400",
    hoverBg: "hover:bg-yellow-400",
    textHover: "hover:text-blue-950",
    textOnAccent: "text-blue-950",
    modalBg: "bg-blue-950/95",
    scrollThumb: "rgba(250,204,21,0.3)",
    scrollThumbHover: "rgba(250,204,21,0.6)",
  },
};

const RotatingImage = ({ images = [], name, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images?.length]);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 1800);
      return () => clearInterval(interval);
    }
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

// Flat color transition card (no lift/transform)
const SelectionCard = ({ title, count, active, onClick, t }) => (
  <button
    onClick={onClick}
    className={`w-full border-2 p-5 text-left transition-colors duration-200 ${
      active
        ? `${t.borderAccent} ${t.bgAccent} ${t.textOnAccent}`
        : `${t.border} ${t.panel} text-white ${t.hoverBorder} hover:text-white`
    }`}
  >
    <div className="flex flex-col gap-4">
      <h3
        className={`text-xl font-bold capitalize ${active ? t.textOnAccent : "text-white"}`}
      >
        {title}
      </h3>
      <div>
        <span
          className={`inline-flex px-3 py-1 text-xs font-bold uppercase tracking-widest border-2 ${
            active ? "border-current" : t.borderAccent
          } ${active ? t.textOnAccent : t.textAccent}`}
        >
          {count} options
        </span>
      </div>
    </div>
  </button>
);

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
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
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

  return (
    <div
      className={`relative flex h-[calc(100dvh-40px)] md:h-[calc(100dvh-48px)] w-full flex-col ${t.bg} text-white overflow-hidden transition-colors duration-500`}
    >
      <style>{`
        .anatomy-svg-wrapper svg {
          width: 100% !important;
          height: 100% !important;
          max-width: 100%;
          max-height: 100%;
          display: block;
          margin: 0 auto;
        }

        /* Custom Sharp Scrollbars */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${t.scrollThumb};
          border-radius: 0px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${t.scrollThumbHover};
        }
      `}</style>

      {/* HEADER (Hidden on Hero Step) */}
      {currentStep > 0 && (
        <header
          className={`flex h-16 shrink-0 items-center justify-between border-b-2 ${t.border} ${t.header} px-6 transition-colors duration-500`}
        >
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold uppercase tracking-widest text-white">
              Workout <span className={t.textAccent}>Wizard</span>
            </h1>
            {breadcrumbText && (
              <span className="hidden text-sm font-bold text-white/60 md:block">
                {breadcrumbText}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetWizard}
              className={`flex items-center gap-2 border-2 ${t.border} ${t.panel} px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors ${t.hoverBorder}`}
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={() => setIsRoutineModalOpen(true)}
              className={`flex items-center gap-2 ${t.bgAccent} px-4 py-2 text-xs font-bold uppercase tracking-widest ${t.textOnAccent} border-2 ${t.borderAccent} transition-colors hover:bg-white hover:border-white`}
            >
              <LayoutList size={14} />
              Routine ({routine.length})
            </button>
          </div>
        </header>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex h-full w-full flex-col"
          >
            {/* STEP 0: HERO */}
            {/* STEP 0: HERO */}
            {currentStep === 0 && (
              <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
                <div className="absolute right-6 top-6 z-10">
                  <button
                    onClick={() => setIsRoutineModalOpen(true)}
                    className={`flex items-center gap-2 border-2 ${t.border} ${t.panel} px-4 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors ${t.hoverBorder}`}
                  >
                    <LayoutList size={14} />
                    Routine ({routine.length})
                  </button>
                </div>

                <div className="flex flex-col items-center justify-center w-full max-w-3xl">
                  <h1 className="text-6xl font-black uppercase tracking-widest text-white sm:text-7xl md:text-8xl">
                    Workout
                    <br />
                    <span className={t.textAccent}>Wizard</span>
                  </h1>

                  <p className="mt-8 text-lg font-bold text-white/60 uppercase tracking-widest">
                    Find the right exercises for you
                  </p>

                  <button
                    onClick={handleNext}
                    className={`mt-16 flex w-full max-w-sm items-center justify-center gap-4 border-2 ${t.borderAccent} py-5 text-xl font-black uppercase tracking-widest ${t.textAccent} transition-colors hover:${t.bgAccent} hover:${t.textOnAccent}`}
                  >
                    Start <ArrowRight size={24} strokeWidth={3} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1: MUSCLE */}
            {currentStep === 1 && (
              <div className="flex h-full flex-col p-6">
                <div className="mb-6 flex flex-col items-center shrink-0">
                  <h2 className="text-3xl font-black uppercase tracking-wide text-white">
                    Select a Target
                  </h2>
                  <div className="mt-6 flex gap-3">
                    {["front", "back"].map((v) => (
                      <button
                        key={v}
                        onClick={() => setView(v)}
                        className={`border-2 px-8 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${
                          view === v
                            ? `${t.borderAccent} ${t.bgAccent} ${t.textOnAccent}`
                            : `${t.border} ${t.panel} text-white ${t.hoverBorder} hover:text-white`
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-hidden">
                  <div className="anatomy-svg-wrapper flex h-full w-full items-center justify-center overflow-hidden">
                    <div className="flex h-full w-full items-center justify-center scale-[0.94] sm:scale-[0.98] md:scale-[1.04]">
                      {view === "front" ? (
                        <FrontView
                          onSelect={handleSelectMuscle}
                          selectedMuscle={muscle}
                          onHover={setHighlightedMuscle}
                          onLeave={() => setHighlightedMuscle(null)}
                        />
                      ) : (
                        <BackView
                          onSelect={handleSelectMuscle}
                          selectedMuscle={muscle}
                          onHover={setHighlightedMuscle}
                          onLeave={() => setHighlightedMuscle(null)}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center shrink-0">
                  <button
                    onClick={handleNext}
                    disabled={!muscle}
                    className={`flex w-full max-w-md items-center justify-center gap-3 border-2 p-5 text-base font-bold uppercase tracking-widest transition-colors ${
                      muscle
                        ? `${t.borderAccent} ${t.bgAccent} ${t.textOnAccent} hover:bg-white hover:border-white`
                        : `cursor-not-allowed ${t.border} ${t.panel} text-white/40`
                    }`}
                  >
                    Next Step <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: EQUIPMENT */}
            {currentStep === 2 && (
              <div className="mx-auto flex h-full w-full max-w-4xl flex-col p-6">
                <h2 className="mb-8 text-3xl font-black uppercase tracking-wide text-white text-center shrink-0">
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
                        ? `${t.borderAccent} ${t.bgAccent} ${t.textOnAccent} hover:bg-white hover:border-white`
                        : `cursor-not-allowed ${t.border} ${t.panel} text-white/40`
                    }`}
                  >
                    Next Step <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CATEGORY */}
            {currentStep === 3 && (
              <div className="mx-auto flex h-full w-full max-w-4xl flex-col p-6">
                <h2 className="mb-8 text-3xl font-black uppercase tracking-wide text-white text-center shrink-0">
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
                        ? `${t.borderAccent} ${t.bgAccent} ${t.textOnAccent} hover:bg-white hover:border-white`
                        : `cursor-not-allowed ${t.border} ${t.panel} text-white/40`
                    }`}
                  >
                    Next Step <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: DIFFICULTY */}
            {currentStep === 4 && (
              <div className="mx-auto flex h-full w-full max-w-4xl flex-col p-6">
                <h2 className="mb-8 text-3xl font-black uppercase tracking-wide text-white text-center shrink-0">
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
                        ? `${t.borderAccent} ${t.bgAccent} ${t.textOnAccent} hover:bg-white hover:border-white`
                        : `cursor-not-allowed ${t.border} ${t.panel} text-white/40`
                    }`}
                  >
                    Show Workouts <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: RESULTS */}
            {currentStep === 5 && (
              <div className="mx-auto flex h-full w-full max-w-5xl flex-col p-6">
                <div className="mb-8 flex items-center justify-between shrink-0">
                  <h2 className="text-3xl font-black uppercase tracking-wide text-white">
                    Your Workouts{" "}
                    <span className={t.textAccent}>
                      ({finalExercises.length})
                    </span>
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
                        className={`flex min-h-[110px] flex-col justify-center border-2 ${t.border} ${t.panel} p-6 text-left transition-colors ${t.hoverBorder} hover:text-white`}
                      >
                        <h3 className="text-lg font-bold text-white">
                          {ex.name}
                        </h3>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* PREVIEW MODAL - Switched to Absolute inset-0 */}
      <AnimatePresence>
        {isModalOpen && currentPreview && (
          <div
            className={`absolute inset-0 z-50 flex items-center justify-center ${t.modalBg} p-4 md:p-8 backdrop-blur-md`}
          >
            <div
              className={`relative flex h-full w-full max-w-6xl flex-col border-2 ${t.borderAccent} ${t.bg} md:flex-row shadow-2xl overflow-hidden`}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className={`absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center border-2 ${t.border} ${t.panel} text-white transition-colors ${t.hoverBorder} ${t.hoverBg} ${t.textHover}`}
              >
                <X size={18} strokeWidth={3} />
              </button>

              <div
                className={`flex h-[40%] w-full items-center justify-center border-b-2 ${t.border} ${t.panel} p-6 md:h-full md:w-1/2 md:border-b-0 md:border-r-2 shrink-0`}
              >
                <div className="relative flex h-full w-full max-w-md items-center justify-center">
                  <RotatingImage
                    images={currentPreview.images}
                    name={currentPreview.name}
                  />
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col md:w-1/2">
                <div className={`border-b-2 ${t.border} p-6 pr-16 shrink-0`}>
                  <h3 className="text-3xl font-black uppercase tracking-wide text-white">
                    {currentPreview.name}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold text-white/60 uppercase tracking-widest">
                    <span>{currentPreview.equipment}</span>
                    <span>•</span>
                    <span>{currentPreview.category}</span>
                    <span>•</span>
                    <span className={t.textAccent}>{currentPreview.level}</span>
                  </div>
                </div>

                <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-6 md:p-8">
                  <div className="mb-10">
                    <h4
                      className={`mb-4 text-sm font-black uppercase tracking-widest ${t.textAccent}`}
                    >
                      Target Muscles
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {currentPreview.primaryMuscles?.map((m) => (
                        <span
                          key={m}
                          className={`border-2 ${t.border} ${t.panel} px-4 py-2 text-xs font-bold uppercase tracking-widest text-white`}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4
                      className={`mb-5 text-sm font-black uppercase tracking-widest ${t.textAccent}`}
                    >
                      Instructions
                    </h4>
                    <div className="space-y-6">
                      {currentPreview.instructions?.map((step, i) => (
                        <div key={i} className="flex gap-5">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center border-2 ${t.borderAccent} ${t.bgAccent} text-sm font-black ${t.textOnAccent}`}
                          >
                            {i + 1}
                          </span>
                          <p className="text-base font-medium leading-relaxed text-white/80 pt-1">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={`border-t-2 ${t.border} p-6 shrink-0`}>
                  <button
                    onClick={() => toggleRoutine(currentPreview)}
                    className={`w-full border-2 p-5 text-sm font-black uppercase tracking-widest transition-colors ${
                      routine.some((r) => r.id === currentPreview.id)
                        ? "border-red-500 bg-transparent text-red-500 hover:bg-red-500 hover:text-white"
                        : `${t.borderAccent} ${t.bgAccent} ${t.textOnAccent} hover:bg-white hover:border-white hover:text-black`
                    }`}
                  >
                    {routine.some((r) => r.id === currentPreview.id)
                      ? "Remove from Routine"
                      : "Add to Routine"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ROUTINE MODAL - Switched to Absolute inset-0 */}
      <AnimatePresence>
        {isRoutineModalOpen && (
          <div
            className={`absolute inset-0 z-50 flex items-center justify-center ${t.modalBg} p-4 md:p-8 backdrop-blur-md`}
          >
            <div
              className={`flex h-full w-full max-w-3xl flex-col border-2 ${t.borderAccent} ${t.bg} shadow-2xl overflow-hidden`}
            >
              <div
                className={`flex items-center justify-between border-b-2 ${t.border} ${t.panel} p-6 shrink-0`}
              >
                <h2 className="text-3xl font-black uppercase tracking-wide text-white">
                  My Routine
                </h2>
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setRoutine([])}
                    className="text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsRoutineModalOpen(false)}
                    className={`flex h-10 w-10 items-center justify-center border-2 ${t.border} text-white transition-colors ${t.hoverBorder} ${t.hoverBg} ${t.textHover}`}
                  >
                    <X size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>

              <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-6 md:p-8">
                {routine.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm font-bold uppercase tracking-widest text-white/40">
                    Your routine is empty
                  </div>
                ) : (
                  <div className="space-y-4">
                    {routine.map((ex) => (
                      <div
                        key={ex.id}
                        className={`flex items-center justify-between border-2 ${t.border} ${t.panel} p-6 transition-colors hover:${t.borderAccent}`}
                      >
                        <div className="min-w-0 pr-4">
                          <h3 className="truncate text-lg font-bold text-white">
                            {ex.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => toggleRoutine(ex)}
                          className="ml-4 flex h-12 w-12 shrink-0 items-center justify-center border-2 border-red-500 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={`border-t-2 ${t.border} ${t.panel} p-6 shrink-0`}>
                <button
                  onClick={exportRoutineCSV}
                  disabled={routine.length === 0}
                  className={`flex w-full items-center justify-center gap-3 border-2 p-5 text-sm font-black uppercase tracking-widest transition-colors ${
                    routine.length === 0
                      ? `border-transparent bg-white/5 text-white/30 cursor-not-allowed`
                      : `${t.borderAccent} ${t.bgAccent} ${t.textOnAccent} hover:bg-white hover:border-white hover:text-black`
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
