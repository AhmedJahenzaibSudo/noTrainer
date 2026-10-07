"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Download,
  LayoutList,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";

import FrontView from "@/components/anatomy/FrontView";
import BackView from "@/components/anatomy/BackView";
import exercisesData from "@/public/exercises.json";

const BG = "#0D1117";
const ELEMENT = "#FF7B72";
const ACCENT = "#7EE787";
const TEXT = "#FFFFFF";

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
      <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest opacity-40">
        No image
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
        exercise.secondaryMuscles?.includes(muscle)
    );
  }, [muscle]);

  const availableEquipment = useMemo(() => {
    return [
      ...new Set(
        exercisesForMuscle
          .map((exercise) => exercise.equipment)
          .filter(Boolean)
      ),
    ].sort();
  }, [exercisesForMuscle]);

  const exercisesForEquipment = useMemo(() => {
    return exercisesForMuscle.filter(
      (exercise) => !equipment || exercise.equipment === equipment
    );
  }, [exercisesForMuscle, equipment]);

  const availableCategories = useMemo(() => {
    return [
      ...new Set(
        exercisesForEquipment
          .map((exercise) => exercise.category)
          .filter(Boolean)
      ),
    ].sort();
  }, [exercisesForEquipment]);

  const exercisesForCategory = useMemo(() => {
    return exercisesForEquipment.filter(
      (exercise) => !category || exercise.category === category
    );
  }, [exercisesForEquipment, category]);

  const availableLevels = useMemo(() => {
    return [
      ...new Set(
        exercisesForCategory.map((exercise) => exercise.level).filter(Boolean)
      ),
    ].sort();
  }, [exercisesForCategory]);

  const finalExercises = useMemo(() => {
    return exercisesForCategory.filter(
      (exercise) => !level || exercise.level === level
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

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 5));

  const resetWizard = () => {
    setCurrentStep(0);
    setView("front");
    setMuscle(null);
    setEquipment(null);
    setCategory(null);
    setLevel(null);
    setHighlightedMuscle(null);
    setActiveIndex(0);
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
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "workout-routine.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const btnBase = "w-full p-3 text-xs font-black uppercase tracking-widest transition-all rounded-lg";
  const cardBase = "w-full p-3 text-left rounded-lg transition-all";

  return (
    <div
      className="wizard-page relative w-full overflow-x-hidden min-h-screen flex flex-col"
      style={{ backgroundColor: BG, color: TEXT }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Slackey&display=swap');
        .wizard-page { font-family: 'Slackey', cursive; }
        .wizard-card { background: #21262D; color: ${TEXT}; }
        .wizard-card:hover { background: #30363D; }
        .wizard-selected { background: ${ACCENT}; color: ${BG}; }
        .wizard-primary { background: ${ELEMENT}; color: ${BG}; }
        .wizard-primary:hover { opacity: 0.9; }
        .wizard-outline { background: transparent; color: ${TEXT}; }
        .wizard-outline:hover { background: #21262D; }
        .wizard-scroll::-webkit-scrollbar { width: 4px; }
        .wizard-scroll::-webkit-scrollbar-thumb { background: #30363D; }
        .anatomy-svg-wrapper svg { display: block; width: 100% !important; height: auto !important; max-width: 100%; margin: 0 auto; }
      `}</style>

      {currentStep > 0 && (
        <header className="flex items-center justify-between border-b border-[#30363D] p-4">
          <div className="min-w-0">
            <h1 className="text-sm font-black uppercase tracking-tight">Wizard</h1>
            {breadcrumbText && (
              <p className="mt-0.5 truncate text-[10px] font-bold opacity-60">
                {breadcrumbText}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={resetWizard}
              className="wizard-outline flex h-9 items-center justify-center gap-2 px-3 text-[10px] font-bold uppercase tracking-wider rounded-lg"
            >
              <RotateCcw size={12} />
              Reset
            </button>
            <button
              onClick={() => setIsRoutineModalOpen(true)}
              className="wizard-primary flex h-9 items-center justify-center gap-2 px-3 text-[10px] font-bold uppercase tracking-wider rounded-lg"
            >
              <LayoutList size={12} />
              Routine ({routine.length})
            </button>
          </div>
        </header>
      )}

      <main className="relative w-full flex-1 flex flex-col p-4">
        {currentStep === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
              Workout Wizard
            </h1>
            <button
              onClick={handleNext}
              className="wizard-primary max-w-xs px-8 py-4 text-sm uppercase tracking-widest rounded-lg"
            >
              Start
            </button>
          </div>
        )}

        {currentStep === 1 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <h2 className="text-xs font-bold uppercase tracking-widest opacity-60">Select Target</h2>
            <div className="flex gap-2">
              {["front", "back"].map((item) => (
                <button
                  key={item}
                  onClick={() => setView(item)}
                  className={`rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                    view === item ? "wizard-selected" : "wizard-outline"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="anatomy-svg-wrapper w-48 sm:w-64">
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
            <button
              onClick={handleNext}
              disabled={!muscle}
              className={`wizard-primary max-w-xs ${btnBase} ${!muscle ? "opacity-30 cursor-not-allowed" : ""}`}
            >
              Next
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex flex-1 flex-col gap-4">
            <h2 className="text-center text-xs font-bold uppercase tracking-widest opacity-60">Select Equipment</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 flex-1 content-start">
              {availableEquipment.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSelectEquipment(item)}
                  className={`${cardBase} text-xs font-bold uppercase tracking-wider ${
                    equipment === item ? "wizard-selected" : "wizard-card"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={!equipment}
              className={`wizard-primary max-w-xs mx-auto ${!equipment ? "opacity-30 cursor-not-allowed" : ""} ${btnBase}`}
            >
              Next
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex flex-1 flex-col gap-4">
            <h2 className="text-center text-xs font-bold uppercase tracking-widest opacity-60">Select Type</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 flex-1 content-start">
              {availableCategories.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSelectCategory(item)}
                  className={`${cardBase} text-xs font-bold uppercase tracking-wider ${
                    category === item ? "wizard-selected" : "wizard-card"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={!category}
              className={`wizard-primary max-w-xs mx-auto ${!category ? "opacity-30 cursor-not-allowed" : ""} ${btnBase}`}
            >
              Next
            </button>
          </div>
        )}

        {currentStep === 4 && (
          <div className="flex flex-1 flex-col gap-4">
            <h2 className="text-center text-xs font-bold uppercase tracking-widest opacity-60">Select Difficulty</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 flex-1 content-start">
              {availableLevels.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSelectLevel(item)}
                  className={`${cardBase} text-xs font-bold uppercase tracking-wider ${
                    level === item ? "wizard-selected" : "wizard-card"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={!level}
              className={`wizard-primary max-w-xs mx-auto ${!level ? "opacity-30 cursor-not-allowed" : ""} ${btnBase}`}
            >
              Show Workouts
            </button>
          </div>
        )}

        {currentStep === 5 && (
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-tight">Your Workouts</h2>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                {finalExercises.length} results
              </span>
            </div>
            {finalExercises.length ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 flex-1 content-start">
                {finalExercises.map((exercise, index) => (
                  <button
                    key={exercise.id}
                    onClick={() => {
                      setActiveIndex(index);
                      setIsModalOpen(true);
                    }}
                    className="wizard-card p-3 text-left text-xs font-bold uppercase tracking-wider leading-tight"
                  >
                    {exercise.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center text-xs font-bold uppercase tracking-widest opacity-40">
                No workouts found
              </div>
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {isModalOpen && currentPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="wizard-scroll relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-[#30363D] bg-[#0D1117]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-[#21262D] text-[#FFFFFF] hover:bg-[#30363D]"
                aria-label="Close"
              >
                <X size={14} strokeWidth={3} />
              </button>

              {/* Image */}
              <div className="flex h-[200px] w-full items-center justify-center border-b border-[#30363D] bg-[#21262D]">
                <RotatingImage
                  images={currentPreview.images}
                  name={currentPreview.name}
                />
              </div>

              {/* Info Below */}
              <div className="p-4 space-y-4">
                <h3 className="pr-8 text-lg font-black uppercase leading-tight">
                  {currentPreview.name}
                </h3>

                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60">
                  <span>{currentPreview.equipment}</span>
                  <span>{currentPreview.category}</span>
                  <span>{currentPreview.level}</span>
                </div>

                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
                    Target Muscles
                  </p>
                  <p className="text-xs font-bold uppercase opacity-90">
                    {currentPreview.primaryMuscles?.join(" • ")}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
                    Instructions
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-xs opacity-90">
                    {currentPreview.instructions?.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>

                <button
                  onClick={() => toggleRoutine(currentPreview)}
                  className={`w-full rounded-lg py-3 text-xs font-black uppercase tracking-widest transition-all ${
                    routine.some((item) => item.id === currentPreview.id)
                      ? "wizard-outline"
                      : "wizard-primary"
                  }`}
                >
                  {routine.some((item) => item.id === currentPreview.id)
                    ? "Remove"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-[#30363D] bg-[#0D1117]"
            >
              <div className="flex items-center justify-between border-b border-[#30363D] p-4">
                <h2 className="text-sm font-black uppercase">My Routine</h2>
                <div className="flex items-center gap-2">
                  {routine.length > 0 && (
                    <button
                      onClick={() => setRoutine([])}
                      className="text-[10px] font-bold uppercase tracking-wider opacity-60 hover:opacity-100"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setIsRoutineModalOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#21262D] hover:bg-[#30363D]"
                    aria-label="Close routine"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>

              <div className="wizard-scroll min-h-0 flex-1 overflow-y-auto p-4">
                {routine.length === 0 ? (
                  <div className="flex min-h-[120px] items-center justify-center text-center text-[10px] font-bold uppercase tracking-widest opacity-40">
                    Empty
                  </div>
                ) : (
                  <div className="space-y-2">
                    {routine.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="wizard-card flex items-center justify-between gap-3 rounded-lg p-3"
                      >
                        <h3 className="min-w-0 break-words text-xs font-bold uppercase tracking-wider">
                          {exercise.name}
                        </h3>
                        <button
                          onClick={() => toggleRoutine(exercise)}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#0D1117] text-[#FFFFFF] hover:bg-[#30363D]"
                          aria-label={`Remove ${exercise.name}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-[#30363D] p-4">
                <button
                  onClick={exportRoutineCSV}
                  disabled={!routine.length}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 text-xs font-black uppercase tracking-widest transition-all ${
                    routine.length ? "wizard-primary" : "cursor-not-allowed opacity-30"
                  }`}
                >
                  <Download size={14} strokeWidth={3} />
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