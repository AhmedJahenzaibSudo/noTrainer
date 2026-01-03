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
      }, 1500);
    }
    return () => clearInterval(intervalRef.current);
  }, [images.length]);

  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden border-4 border-black">
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
        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-lg border-2 border-white font-bold">
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
        x: e.clientX + 10,
        y: e.clientY - 30,
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

  // Equipment icons mapping
  const equipmentIcons = {
    dumbbell: Dumbbell,
    barbell: Barbell,
    machine: Weight,
    cable: GitPullRequest,
    bodyweight: Activity,
    bench: Coffee,
    "pull-up bar": Users,
    "resistance band": Wind,
    kettlebell: BookOpen,
  };

  // --- UI COMPONENTS ---

  const StepDot = ({ num, active, completed }) => (
    <div className="flex flex-col items-center relative z-10">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
          active
            ? "bg-yellow-400 border-black scale-110"
            : completed
            ? "bg-white border-black text-black"
            : "bg-black border-white text-white"
        }`}
      >
        {completed && !active ? (
          <Check size={18} className="text-black" />
        ) : (
          <span className="font-black text-sm">{num}</span>
        )}
      </div>
    </div>
  );

  const StepConnector = () => (
    <div className="h-1 flex-1 mx-2 bg-white rounded-full"></div>
  );

  // --- RENDER HELPERS ---

  const ExerciseCard = ({ exercise }) => {
    const isFavorited = favorites[exercise.id];

    return (
      <div
        className="bg-yellow-400 border-4 border-black rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105"
        onClick={() => setSelectedExercise(exercise)}
      >
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Fixed left side with rotating images */}
          <div className="w-full md:w-80 h-80 flex-shrink-0">
            <RotatingImage images={exercise.images} name={exercise.name} />
          </div>

          {/* Right side with information */}
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:justify-between items-start gap-4 mb-4">
              <h3 className="font-black text-2xl text-black tracking-tight">
                {exercise.name}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(exercise.id);
                }}
                className={`p-3 rounded-full border-4 transition-all duration-300 ${
                  isFavorited
                    ? "bg-red-500 border-black text-white"
                    : "bg-white border-black text-black"
                }`}
              >
                <Star
                  size={20}
                  fill={isFavorited ? "currentColor" : "none"}
                  strokeWidth={2.5}
                />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-white border-4 border-black text-black text-xs font-black uppercase">
                {exercise.equipment || "Bodyweight"}
              </span>
              <span className="px-3 py-1 rounded-full bg-white border-4 border-black text-black text-xs font-black uppercase">
                {exercise.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-white border-4 border-black text-black text-xs font-black uppercase">
                {exercise.level}
              </span>
            </div>

            <div className="mb-4">
              <span className="block text-xs font-black text-black mb-2 tracking-widest uppercase">
                Primary Muscles
              </span>
              <div className="flex flex-wrap gap-2">
                {exercise.primaryMuscles?.map((muscle) => (
                  <span
                    key={muscle}
                    className="px-3 py-1 rounded-lg bg-white border-4 border-black text-black text-xs font-black uppercase"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t-4 border-black flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm font-black text-black flex items-center gap-2">
                <Info size={16} /> Click for details
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToRoutine(exercise);
                }}
                className="bg-black text-white font-black py-2 px-6 rounded-full border-4 border-black transition-all duration-300 hover:shadow-xl flex items-center gap-2 uppercase tracking-wide text-sm"
              >
                <Plus size={18} strokeWidth={3} /> Add to Routine
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ExerciseGrid = () => {
    return (
      <div className="py-6 px-4">
        {finalExercises.length === 0 ? (
          <div className="bg-white border-4 border-black p-8 text-center rounded-xl max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap size={28} className="text-yellow-400" />
            </div>
            <p className="text-black font-black text-xl">No exercises found</p>
            <p className="text-black font-medium mt-2">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {finalExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // --- MAIN RETURN ---

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-yellow-400 border-4 border-black text-black px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
            <span className="font-black text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 relative z-10">
        {/* Header */}
        <div className="bg-white border-4 border-black p-4 md:p-6 mb-6 rounded-xl flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-yellow-400 border-4 border-black rounded-xl">
              <Zap className="text-black" size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                Workout Wizard
              </h1>
              <p className="text-sm text-black font-bold mt-1">
                Build your perfect routine
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-yellow-400 border-4 border-black text-black font-black transition-all duration-300 text-sm hover:shadow-xl"
            >
              Reset
            </button>
            <button
              onClick={copyShareLink}
              className="px-4 py-2 rounded-xl bg-yellow-400 border-4 border-black text-black font-black transition-all duration-300 text-sm flex items-center gap-2 hover:shadow-xl"
            >
              <Share2 size={14} strokeWidth={2} /> Share
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white border-4 border-black p-3 rounded-xl mb-8 max-w-3xl mx-auto">
          <div className="flex justify-between items-center relative">
            {[1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <StepDot num={s} active={step === s} completed={step > s} />
                {s < 4 && <StepConnector />}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-3 px-2 text-xs font-black uppercase tracking-widest text-black">
            <span>Muscle</span>
            <span>Gear</span>
            <span>Type</span>
            <span>Level</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="min-h-[400px] relative">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="bg-white border-4 border-black rounded-xl p-4 md:p-6 max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-black flex items-center gap-3">
                    <Target className="text-black" size={28} strokeWidth={2} />
                    Select Muscle Group
                  </h2>
                </div>
                <div className="flex bg-black p-1 rounded-lg">
                  <button
                    onClick={() => setView("front")}
                    className={`px-4 py-1 rounded-lg font-black text-sm transition-all duration-300 ${
                      view === "front"
                        ? "bg-yellow-400 text-black"
                        : "text-white hover:text-yellow-400"
                    }`}
                  >
                    Front
                  </button>
                  <button
                    onClick={() => setView("back")}
                    className={`px-4 py-1 rounded-lg font-black text-sm transition-all duration-300 ${
                      view === "back"
                        ? "bg-yellow-400 text-black"
                        : "text-white hover:text-yellow-400"
                    }`}
                  >
                    Back
                  </button>
                </div>
              </div>

              <div
                className="relative w-full max-w-lg mx-auto p-6"
                ref={containerRef}
                onMouseMove={handleMouseMove}
              >
                {tooltip.show && (
                  <div
                    className="fixed bg-yellow-400 border-4 border-black text-black text-xs font-black px-3 py-1 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-50"
                    style={{
                      left: tooltip.x,
                      top: tooltip.y,
                    }}
                  >
                    {tooltip.content}
                  </div>
                )}

                <div className="relative rounded-xl overflow-hidden p-2 bg-white border-4 border-black">
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
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl font-black text-center mb-6 text-white">
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
                      className={`group relative p-4 rounded-xl border-4 transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                        isActive
                          ? "bg-yellow-400 border-black"
                          : "bg-white border-black hover:shadow-xl"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-black text-yellow-400"
                            : "bg-black text-white"
                        }`}
                      >
                        <Icon size={24} strokeWidth={2} />
                      </div>
                      <span
                        className={`font-black capitalize text-sm ${
                          isActive ? "text-black" : "text-black"
                        }`}
                      >
                        {opt}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          isActive ? "text-black" : "text-black"
                        }`}
                      >
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
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl font-black text-center mb-6 text-white">
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
                      className={`p-4 rounded-xl border-4 transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                        isActive
                          ? "bg-yellow-400 border-black"
                          : "bg-white border-black hover:shadow-xl"
                      }`}
                    >
                      <span
                        className={`font-black capitalize text-lg ${
                          isActive ? "text-black" : "text-black"
                        }`}
                      >
                        {opt}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          isActive ? "text-black" : "text-black"
                        }`}
                      >
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
              <h2 className="text-xl font-black text-center mb-6 text-white">
                Experience Level
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableLevels.map((opt) => {
                  const isActive = level === opt;
                  let colorClass = "";

                  if (opt === "beginner") colorClass = "bg-green-500";
                  else if (opt === "intermediate") colorClass = "bg-yellow-400";
                  else colorClass = "bg-red-500";

                  return (
                    <button
                      key={opt}
                      onClick={() => setLevel(opt)}
                      className={`group relative p-6 rounded-xl border-4 font-black text-xl capitalize transition-all duration-300 ${
                        isActive
                          ? `${colorClass} border-black text-white shadow-xl scale-105`
                          : "bg-white border-black text-black hover:shadow-xl"
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
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-black text-white mb-2">
                  Your Workout
                </h2>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400 border-4 border-black text-sm font-black text-black">
                  <Target size={14} /> Found {finalExercises.length} exercises
                </div>
              </div>

              <ExerciseGrid />

              {/* Routine */}
              <div className="bg-white border-4 border-black rounded-xl p-4 md:p-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-black text-black flex items-center gap-3">
                    <Activity
                      className="text-black"
                      size={20}
                      strokeWidth={2}
                    />
                    Your Routine
                  </h3>
                  {routine.length > 0 && (
                    <button
                      onClick={() => setRoutine([])}
                      className="px-3 py-1 text-xs font-black uppercase tracking-wider text-red-500 hover:text-red-600 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {routine.length === 0 ? (
                  <div className="border-4 border-dashed border-black rounded-xl p-8 text-center">
                    <Dumbbell className="mx-auto mb-3 text-black" size={36} />
                    <p className="text-black font-black">Routine is empty</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {routine.map((item, index) => (
                      <div
                        key={index}
                        className="bg-yellow-400 border-4 border-black p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:shadow-xl transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center font-black text-white text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-black text-black">
                              {item.name}
                            </div>
                            <div className="text-xs font-bold text-black">
                              {item.sets} sets × {item.reps} reps
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromRoutine(index)}
                          className="text-black hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {routine.length > 0 && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={exportCSV}
                      className="bg-yellow-400 text-black font-black py-3 px-8 rounded-full border-4 border-black shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
                    >
                      <Download size={16} strokeWidth={2.5} /> Export CSV
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER NAV */}
        {step < 5 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 z-40">
            <div className="max-w-4xl mx-auto bg-white border-4 border-black rounded-xl shadow-2xl p-3 flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black transition-all duration-300 ${
                  step === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-black hover:bg-yellow-400"
                }`}
              >
                <ChevronLeft size={18} /> Back
              </button>

              <div className="text-sm font-black uppercase tracking-widest text-black">
                {step} of 4
              </div>

              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-black transition-all duration-300 border-4 ${
                  !canProceed()
                    ? "bg-gray-200 text-gray-400 border-black cursor-not-allowed"
                    : "bg-yellow-400 text-black border-black hover:shadow-xl"
                }`}
              >
                {step === 4 ? "Finish" : "Next"} <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedExercise && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedExercise(null)}
        >
          <div
            className="bg-white border-4 border-black w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedExercise(null)}
              className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors z-10 border-4 border-black"
            >
              <X size={20} />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="p-6 bg-black flex flex-col items-center justify-center">
                <div className="w-full max-w-md aspect-square">
                  <RotatingImage
                    images={selectedExercise.images}
                    name={selectedExercise.name}
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <span className="px-3 py-1 rounded-full bg-yellow-400 border-4 border-black text-black text-xs font-black uppercase">
                    {selectedExercise.equipment || "Bodyweight"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-yellow-400 border-4 border-black text-black text-xs font-black uppercase">
                    {selectedExercise.level}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-black text-black mb-4">
                  {selectedExercise.name}
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 text-black">
                      Instructions
                    </h3>
                    <ol className="space-y-3">
                      {selectedExercise.instructions?.map((ins, idx) => (
                        <li
                          key={idx}
                          className="flex gap-3 text-black leading-relaxed"
                        >
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400 border-4 border-black flex items-center justify-center text-xs font-black text-black mt-0.5">
                            {idx + 1}
                          </span>
                          {ins}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 text-black">
                      Muscles Targeted
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedExercise.primaryMuscles?.map((muscle) => (
                        <span
                          key={muscle}
                          className="px-3 py-1 rounded-lg bg-yellow-400 border-4 border-black text-black text-sm font-black"
                        >
                          {muscle}
                        </span>
                      ))}
                      {selectedExercise.secondaryMuscles?.map((muscle) => (
                        <span
                          key={muscle}
                          className="px-3 py-1 rounded-lg bg-white border-4 border-black text-black text-sm font-black"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t-4 border-black flex gap-3">
                  <button
                    onClick={() => {
                      addToRoutine(selectedExercise);
                      setSelectedExercise(null);
                    }}
                    className="flex-1 bg-yellow-400 text-black font-black py-3 rounded-xl border-4 border-black hover:shadow-xl transition-all"
                  >
                    Add to Routine
                  </button>
                  <button
                    onClick={() => toggleFavorite(selectedExercise.id)}
                    className={`px-4 py-3 rounded-xl border-4 font-black transition-all ${
                      favorites[selectedExercise.id]
                        ? "bg-red-500 border-black text-white"
                        : "bg-white border-black text-black hover:shadow-xl"
                    }`}
                  >
                    <Star
                      size={20}
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
