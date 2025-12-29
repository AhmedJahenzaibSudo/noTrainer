"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import FrontView from "@/components/anatomy/FrontView";
import BackView from "@/components/anatomy/BackView";
import exercisesData from "@/public/exercises.json";

import {
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Check,
  Download,
  Star,
  Trash2,
  Share2,
  Plus,
  X,
  Dumbbell,
  Weight,
  GitPullRequest,
  Activity,
  Barbell,
  Wind,
  Users,
  Coffee,
  BookOpen,
  Play,
  Pause,
  Zap,
  Target,
  Info,
} from "lucide-react";

// --- STABLE COMPONENTS (Defined outside to prevent re-mounting) ---

const RotatingImage = ({ images = [], name }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 1500); // Slower rotation for elegance
    }
    return () => clearInterval(intervalRef.current);
  }, [images.length]);

  return (
    <div className="relative w-full h-full bg-slate-800/50 rounded-2xl overflow-hidden border border-white/5 shadow-inner">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={`/exercises/${image || "placeholder.png"}`}
            alt={`${name} view ${index + 1}`}
            className="w-full h-full object-contain p-4"
          />
        </div>
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white/80 text-xs px-2 py-1 rounded-lg border border-white/10 font-medium">
          {currentIndex + 1}/{images.length}
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function WorkoutWizard() {
  const [step, setStep] = useState(1);
  const [view, setView] = useState("front");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: "" });

  // Selection State
  const [muscle, setMuscle] = useState(null);
  const [equipment, setEquipment] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");

  // Highlighted muscle state
  const [highlightedMuscle, setHighlightedMuscle] = useState(null);

  // Tooltip State
  const [tooltip, setTooltip] = useState({
    show: false,
    content: "",
    x: 0,
    y: 0,
  });
  const containerRef = useRef(null);

  // Routine builder
  const [routine, setRoutine] = useState(() => {
    try {
      const raw = localStorage.getItem("workout_routine_v1");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem("workout_favs_v1");
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });

  // Modal preview
  const [selectedExercise, setSelectedExercise] = useState(null);

  // --- DERIVED DATA ---
  const exercisesForMuscle = useMemo(() => {
    if (!muscle) return [];
    return exercisesData.filter(
      (ex) =>
        ex.primaryMuscles?.includes(muscle) ||
        ex.secondaryMuscles?.includes(muscle)
    );
  }, [muscle]);

  const availableEquipment = useMemo(() => {
    return [
      ...new Set(exercisesForMuscle.map((ex) => ex.equipment).filter(Boolean)),
    ].sort();
  }, [exercisesForMuscle]);

  const exercisesForEquipment = useMemo(() => {
    return exercisesForMuscle.filter(
      (ex) => !equipment || ex.equipment === equipment
    );
  }, [exercisesForMuscle, equipment]);

  const availableCategories = useMemo(() => {
    return [
      ...new Set(
        exercisesForEquipment.map((ex) => ex.category).filter(Boolean)
      ),
    ].sort();
  }, [exercisesForEquipment]);

  const exercisesForCategory = useMemo(() => {
    return exercisesForEquipment.filter(
      (ex) => !category || ex.category === category
    );
  }, [exercisesForEquipment, category]);

  const availableLevels = useMemo(() => {
    return [
      ...new Set(exercisesForCategory.map((ex) => ex.level).filter(Boolean)),
    ];
  }, [exercisesForCategory]);

  const finalExercises = useMemo(() => {
    return exercisesForCategory.filter((ex) => !level || ex.level === level);
  }, [exercisesForCategory, level]);

  // --- EFFECTS ---

  // Reset carousel if the results list changes significantly
  useEffect(() => {
    setCarouselIndex(0);
  }, [muscle, equipment, category, level]);

  // Persist
  useEffect(() => {
    localStorage.setItem("workout_routine_v1", JSON.stringify(routine));
  }, [routine]);

  useEffect(() => {
    localStorage.setItem("workout_favs_v1", JSON.stringify(favorites));
  }, [favorites]);

  // Auto-play
  useEffect(() => {
    if (isPlaying && step === 5 && finalExercises.length > 1) {
      const interval = setInterval(() => {
        setCarouselIndex((prev) => (prev + 1) % finalExercises.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, step, finalExercises.length]);

  // Toast Helper
  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  // --- HANDLERS ---
  const handleMuscleClick = (muscleId) => {
    if (!muscleId) return;
    setMuscle(muscleId);
    setEquipment("");
    setCategory("");
    setLevel("");
  };

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setTooltip((prev) => ({
        ...prev,
        x: x + 25,
        y: y - 20,
      }));
    }
  };

  const handleMouseEnterMuscle = (muscleName) => {
    setHighlightedMuscle(muscleName);
    setTooltip({
      show: true,
      content: muscleName.toUpperCase(),
      x: 0,
      y: 0,
    });
  };

  const handleMouseLeaveMuscle = () => {
    setHighlightedMuscle(null);
    setTooltip({
      show: false,
      content: "",
      x: 0,
      y: 0,
    });
  };

  const handleReset = () => {
    setMuscle(null);
    setEquipment("");
    setCategory("");
    setLevel("");
    setStep(1);
    setHighlightedMuscle(null);
    setSelectedExercise(null);
    setCarouselIndex(0);
  };

  const canProceed = () => {
    if (step === 1 && muscle) return true;
    if (step === 2 && equipment) return true;
    if (step === 3 && category) return true;
    if (step === 4 && level) return true;
    return false;
  };

  const nextStep = () => {
    if (canProceed()) setStep((s) => Math.min(5, s + 1));
  };

  const prevStep = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const toggleFavorite = (exId) => {
    setFavorites((prev) => {
      const copy = { ...prev };
      if (copy[exId]) {
        delete copy[exId];
        showToast("Removed from favorites");
      } else {
        copy[exId] = true;
        showToast("Added to favorites");
      }
      return copy;
    });
  };

  const addToRoutine = (ex, opts = {}) => {
    setRoutine((r) => [
      ...r,
      {
        id: ex.id,
        name: ex.name,
        sets: opts.sets || (ex.level === "beginner" ? 3 : 4),
        reps: opts.reps || (ex.category === "strength" ? 8 : 12),
        notes: opts.notes || "",
        equipment: ex.equipment,
      },
    ]);
    showToast("Added to routine");
  };

  const removeFromRoutine = (index) => {
    setRoutine((r) => r.filter((_, i) => i !== index));
  };

  const exportCSV = () => {
    const header = ["Order", "Name", "Sets", "Reps", "Equipment", "Notes"];
    const rows = routine.map((it, i) => [
      i + 1,
      it.name,
      it.sets,
      it.reps,
      it.equipment || "",
      it.notes || "",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `routine-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Routine exported!");
  };

  const copyShareLink = async () => {
    const params = new URLSearchParams();
    if (muscle) params.set("m", muscle);
    if (equipment) params.set("e", equipment);
    if (category) params.set("c", category);
    if (level) params.set("l", level);
    const url = `${window.location.origin}${
      window.location.pathname
    }?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard!");
    } catch (e) {
      prompt("Copy this link:", url);
    }
  };

  // Equipment icons mapping (Refined for new look)
  const equipmentIcons = {
    dumbbell: Dumbbell,
    barbell: Barbell,
    machine: Weight,
    cable: GitPullRequest,
    bodyweight: Activity,
    bench: Coffee, // Keeping user map but styling changes perception
    "pull-up bar": Users,
    "resistance band": Wind,
    kettlebell: BookOpen,
  };

  // --- UI COMPONENTS ---

  const StepDot = ({ num, active, completed }) => (
    <div className="flex flex-col items-center relative z-10">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
          active
            ? "bg-gradient-to-br from-cyan-400 to-blue-500 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] scale-110"
            : completed
            ? "bg-white/20 border-white/40 text-white"
            : "bg-slate-800/50 border-white/10 text-slate-500"
        }`}
      >
        {completed && !active ? (
          <Check size={18} className="text-emerald-400" />
        ) : (
          <span className="font-semibold text-sm">{num}</span>
        )}
      </div>
    </div>
  );

  const StepConnector = () => (
    <div className="h-[2px] flex-1 mx-2 bg-white/10 rounded-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full animate-pulse" />
    </div>
  );

  // --- RENDER HELPERS ---

  const ExerciseCard = ({ exercise, index }) => {
    const isFavorited = favorites[exercise.id];

    if (index !== carouselIndex) return null;

    return (
      <div
        className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:bg-slate-800/60 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] group max-w-4xl mx-auto"
        onClick={() => setSelectedExercise(exercise)}
      >
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-72 h-72 flex-shrink-0">
            <RotatingImage images={exercise.images} name={exercise.name} />
          </div>

          <div className="flex-1 w-full text-center md:text-left">
            <div className="flex flex-col md:flex-row md:justify-between items-start gap-4 mb-6">
              <h3 className="font-bold text-3xl text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                {exercise.name}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(exercise.id);
                }}
                className={`p-3 rounded-full border transition-all duration-300 ${
                  isFavorited
                    ? "bg-yellow-400/20 border-yellow-400/50 text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.3)]"
                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Star
                  size={20}
                  fill={isFavorited ? "currentColor" : "none"}
                  strokeWidth={2.5}
                />
              </button>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
              <span className="px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                {exercise.equipment || "Bodyweight"}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                {exercise.category}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                {exercise.level}
              </span>
            </div>

            <div className="mb-6">
              <span className="block text-xs font-bold text-slate-400 mb-3 tracking-widest uppercase">
                Primary Muscles
              </span>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {exercise.primaryMuscles?.map((muscle) => (
                  <span
                    key={muscle}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-sm font-semibold uppercase"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Info size={16} /> Click for details
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToRoutine(exercise);
                }}
                className="bg-white text-slate-900 hover:bg-cyan-50 font-bold py-3 px-8 rounded-full shadow-lg shadow-white/10 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 uppercase tracking-wide text-sm"
              >
                <Plus size={18} strokeWidth={3} /> Add to Routine
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ExerciseCarousel = () => {
    return (
      <div className="relative py-12 px-4">
        {finalExercises.length === 0 ? (
          <div className="bg-slate-800/30 border border-white/5 backdrop-blur-md p-12 text-center rounded-3xl max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap size={32} className="text-slate-400" />
            </div>
            <p className="text-slate-200 font-bold text-xl">
              No exercises found
            </p>
            <p className="text-slate-400 font-medium mt-2">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <>
            <div className="relative">
              <ExerciseCard
                key={finalExercises[carouselIndex].id}
                exercise={finalExercises[carouselIndex]}
                index={0} // Always render current as index 0 for the card logic
              />
            </div>

            {finalExercises.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCarouselIndex((prev) =>
                      prev === 0 ? finalExercises.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft size={24} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() =>
                    setCarouselIndex(
                      (prev) => (prev + 1) % finalExercises.length
                    )
                  }
                  className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight size={24} strokeWidth={2.5} />
                </button>

                <div className="flex justify-center mt-8 gap-3">
                  {finalExercises.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCarouselIndex(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === carouselIndex
                          ? "bg-cyan-400 w-8 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                          : "bg-white/20 w-1.5 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute right-4 bottom-4 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 text-white p-2.5 rounded-full transition-all duration-300"
                >
                  {isPlaying ? (
                    <Pause size={16} strokeWidth={3} />
                  ) : (
                    <Play size={16} strokeWidth={3} className="ml-0.5" />
                  )}
                </button>
              </>
            )}
          </>
        )}
      </div>
    );
  };

  // --- MAIN RETURN ---

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#0B1120] to-slate-950"></div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px] pointer-events-none"></div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down">
          <div className="bg-slate-800/90 backdrop-blur-xl border border-white/10 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="font-medium text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative z-10">
        {/* Header */}
        <div className="bg-slate-900/60 backdrop-blur-xl border-b border-white/5 p-6 md:p-8 mb-8 rounded-2xl flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl group-hover:bg-cyan-400/30 transition-colors"></div>
              <Zap
                className="relative z-10 text-cyan-400"
                size={32}
                strokeWidth={2.5}
              />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Workout Wizard
              </h1>
              <p className="text-sm text-slate-400 font-medium mt-1">
                Build your perfect routine
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all duration-300 text-sm"
            >
              Reset
            </button>
            <button
              onClick={copyShareLink}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all duration-300 text-sm flex items-center gap-2"
            >
              <Share2 size={16} strokeWidth={2} /> Share
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl mb-12 max-w-3xl mx-auto">
          <div className="flex justify-between items-center relative">
            {[1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <StepDot num={s} active={step === s} completed={step > s} />
                {s < 4 && <StepConnector />}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            <span>Muscle</span>
            <span>Gear</span>
            <span>Type</span>
            <span>Level</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="min-h-[500px] relative">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="bg-slate-800/30 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-10 max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                    <Target
                      className="text-cyan-400"
                      size={32}
                      strokeWidth={2}
                    />
                    Select Muscle Group
                  </h2>
                </div>
                <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
                  <button
                    onClick={() => setView("front")}
                    className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                      view === "front"
                        ? "bg-white/10 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Front
                  </button>
                  <button
                    onClick={() => setView("back")}
                    className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                      view === "back"
                        ? "bg-white/10 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Back
                  </button>
                </div>
              </div>

              <div
                className="relative w-full max-w-lg mx-auto p-8"
                ref={containerRef}
                onMouseMove={handleMouseMove}
              >
                {tooltip.show && (
                  <div
                    className="fixed bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 text-cyan-200 text-xs font-bold px-3 py-1.5 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.2)] pointer-events-none whitespace-nowrap z-50 transition-transform duration-75"
                    style={{
                      left: tooltip.x,
                      top: tooltip.y,
                    }}
                  >
                    {tooltip.content}
                  </div>
                )}

                <div className="relative rounded-3xl overflow-hidden p-2 bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                  {view === "front" ? (
                    <FrontView
                      onSelect={handleMuscleClick}
                      selectedMuscle={muscle}
                      onHover={handleMouseEnterMuscle}
                      onLeave={handleMouseLeaveMuscle}
                      highlightedMuscle={highlightedMuscle}
                    />
                  ) : (
                    <BackView
                      onSelect={handleMuscleClick}
                      selectedMuscle={muscle}
                      onHover={handleMouseEnterMuscle}
                      onLeave={handleMouseLeaveMuscle}
                      highlightedMuscle={highlightedMuscle}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: EQUIPMENT */}
          {step === 2 && (
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8 text-white">
                Choose Equipment
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {availableEquipment.map((opt) => {
                  const Icon = equipmentIcons[opt.toLowerCase()] || Dumbbell;
                  const exerciseCount = exercisesForMuscle.filter(
                    (e) => e.equipment === opt
                  ).length;
                  const isActive = equipment === opt;

                  return (
                    <button
                      key={opt}
                      onClick={() => setEquipment(opt)}
                      className={`group relative p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                        isActive
                          ? "bg-cyan-500/10 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                          : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-xl transition-colors ${
                          isActive
                            ? "bg-cyan-500 text-white"
                            : "bg-white/5 text-slate-400 group-hover:text-white"
                        }`}
                      >
                        <Icon size={28} strokeWidth={2} />
                      </div>
                      <span className="font-semibold capitalize text-sm">
                        {opt}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {exerciseCount} exercises
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: TYPE */}
          {step === 3 && (
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8 text-white">
                Workout Category
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableCategories.map((opt) => {
                  const exerciseCount = exercisesForEquipment.filter(
                    (e) => e.category === opt
                  ).length;
                  const isActive = category === opt;

                  return (
                    <button
                      key={opt}
                      onClick={() => setCategory(opt)}
                      className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 group ${
                        isActive
                          ? "bg-purple-500/10 border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                          : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                      }`}
                    >
                      <span className="font-bold capitalize text-lg">
                        {opt}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {exerciseCount} exercises
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: LEVEL */}
          {step === 4 && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-10 text-white">
                Experience Level
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {availableLevels.map((opt) => {
                  const isActive = level === opt;
                  let colorClass = "";

                  if (opt === "beginner")
                    colorClass = "text-emerald-400 border-emerald-400/30";
                  else if (opt === "intermediate")
                    colorClass = "text-yellow-400 border-yellow-400/30";
                  else colorClass = "text-rose-400 border-rose-400/30";

                  return (
                    <button
                      key={opt}
                      onClick={() => setLevel(opt)}
                      className={`group relative p-10 rounded-3xl border-2 font-bold text-2xl capitalize transition-all duration-300 ${
                        isActive
                          ? `bg-white/5 ${colorClass} shadow-lg scale-105`
                          : "bg-transparent border-white/5 text-slate-500 hover:border-white/20 hover:bg-white/5"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: RESULTS */}
          {step === 5 && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Your Workout
                </h2>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-slate-400">
                  <Target size={16} /> Found {finalExercises.length} exercises
                </div>
              </div>

              <ExerciseCarousel />

              {/* Routine */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <Activity
                      className="text-cyan-400"
                      size={24}
                      strokeWidth={2}
                    />
                    Your Routine
                  </h3>
                  {routine.length > 0 && (
                    <button
                      onClick={() => setRoutine([])}
                      className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {routine.length === 0 ? (
                  <div className="border-2 border-dashed border-white/5 rounded-3xl p-12 text-center">
                    <Dumbbell
                      className="mx-auto mb-4 text-white/10"
                      size={48}
                    />
                    <p className="text-white/50 font-medium">
                      Routine is empty
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {routine.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-white/50 text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-bold text-white">
                              {item.name}
                            </div>
                            <div className="text-xs text-slate-400 font-medium">
                              {item.sets} sets × {item.reps} reps
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromRoutine(index)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {routine.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={exportCSV}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3.5 px-10 rounded-full shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
                    >
                      <Download size={18} strokeWidth={2.5} /> Export CSV
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER NAV */}
        {step < 5 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-40">
            <div className="max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  step === 1
                    ? "text-slate-600 cursor-not-allowed"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <ChevronLeft size={20} /> Back
              </button>

              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                {step} of 4
              </div>

              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg ${
                  !canProceed()
                    ? "bg-white/5 text-slate-600 cursor-not-allowed"
                    : "bg-white text-slate-900 hover:bg-cyan-50 hover:scale-105 active:scale-95"
                }`}
              >
                {step === 4 ? "Finish" : "Next"} <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedExercise && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedExercise(null)}
        >
          <div
            className="bg-[#0F172A] border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedExercise(null)}
              className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="p-8 bg-slate-900/50 flex flex-col items-center justify-center">
                <div className="w-full max-w-md aspect-square">
                  <RotatingImage
                    images={selectedExercise.images}
                    name={selectedExercise.name}
                  />
                </div>
                <div className="flex gap-2 mt-6">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase text-slate-300">
                    {selectedExercise.equipment || "Bodyweight"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase text-slate-300">
                    {selectedExercise.level}
                  </span>
                </div>
              </div>

              <div className="p-8 md:p-10">
                <h2 className="text-3xl font-bold text-white mb-6">
                  {selectedExercise.name}
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">
                      Instructions
                    </h3>
                    <ol className="space-y-4">
                      {selectedExercise.instructions?.map((ins, idx) => (
                        <li
                          key={idx}
                          className="flex gap-4 text-slate-300 leading-relaxed"
                        >
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/50 mt-0.5">
                            {idx + 1}
                          </span>
                          {ins}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-3">
                      Muscles Targeted
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedExercise.primaryMuscles?.map((muscle) => (
                        <span
                          key={muscle}
                          className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium"
                        >
                          {muscle}
                        </span>
                      ))}
                      {selectedExercise.secondaryMuscles?.map((muscle) => (
                        <span
                          key={muscle}
                          className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-sm font-medium"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex gap-4">
                  <button
                    onClick={() => {
                      addToRoutine(selectedExercise);
                      setSelectedExercise(null);
                    }}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  >
                    Add to Routine
                  </button>
                  <button
                    onClick={() => toggleFavorite(selectedExercise.id)}
                    className={`px-6 py-4 rounded-xl border font-bold transition-all ${
                      favorites[selectedExercise.id]
                        ? "bg-yellow-400/10 border-yellow-400/50 text-yellow-400"
                        : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    <Star
                      size={24}
                      fill={
                        favorites[selectedExercise.id] ? "currentColor" : "none"
                      }
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
