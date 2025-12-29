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
} from "lucide-react";

export default function WorkoutWizard() {
  const [step, setStep] = useState(1);
  const [view, setView] = useState("front");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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

  // Persist routine/favorites
  useEffect(() => {
    localStorage.setItem("workout_routine_v1", JSON.stringify(routine));
  }, [routine]);

  useEffect(() => {
    localStorage.setItem("workout_favs_v1", JSON.stringify(favorites));
  }, [favorites]);

  // Carousel auto-play
  useEffect(() => {
    if (isPlaying && step === 5 && finalExercises.length > 1) {
      const interval = setInterval(() => {
        setCarouselIndex((prev) => (prev + 1) % finalExercises.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, step, finalExercises.length]);

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
      if (copy[exId]) delete copy[exId];
      else copy[exId] = true;
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
      alert("Share link copied!");
    } catch (e) {
      prompt("Copy this link:", url);
    }
  };

  // Equipment icons
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

  // --- RENDER HELPERS ---
  const StepIndicator = ({ num, label, active, selection }) => (
    <div className="flex flex-col items-center">
      <div
        className={`w-14 h-14 border-4 border-black flex items-center justify-center text-lg font-black mb-2 transition-all ${
          active
            ? "bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-110"
            : "bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        }`}
      >
        {step > num ? <Check size={24} className="text-black" /> : num}
      </div>
      <span className="text-xs font-black uppercase tracking-wide mb-1">
        {label}
      </span>
      {selection && (
        <span className="text-xs font-bold text-pink-600 max-w-24 text-center truncate">
          {selection}
        </span>
      )}
    </div>
  );

  // Auto-rotating image
  const RotatingImage = ({ images = [], name }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
      if (images.length > 1) {
        intervalRef.current = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 300);
      }
      return () => clearInterval(intervalRef.current);
    }, [images.length]);

    return (
      <div className="relative w-full h-full bg-blue-100 border-4 border-black overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-300 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={`/exercises/${image || "placeholder.png"}`}
              alt={`${name} view ${index + 1}`}
              className="w-full h-full object-contain p-2"
            />
          </div>
        ))}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 font-bold border-2 border-black">
            {currentIndex + 1}/{images.length}
          </div>
        )}
      </div>
    );
  };

  // Exercise card
  const ExerciseCard = ({ exercise, index }) => {
    const isFavorited = favorites[exercise.id];

    if (index !== carouselIndex) return null;

    return (
      <div
        className="bg-white border-4 border-black p-6 cursor-pointer transition-all hover:translate-x-1 hover:translate-y-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        onClick={() => setSelectedExercise(exercise)}
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-52 h-52">
            <RotatingImage images={exercise.images} name={exercise.name} />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-black text-2xl text-black leading-tight">
                {exercise.name}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(exercise.id);
                }}
                className={`p-2 border-4 border-black transition-all hover:translate-x-0.5 hover:translate-y-0.5 ${
                  isFavorited
                    ? "bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                }`}
              >
                <Star
                  size={20}
                  fill={isFavorited ? "#000" : "none"}
                  className="text-black"
                />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-300 border-3 border-black text-black text-sm font-black uppercase">
                {exercise.equipment || "BODYWEIGHT"}
              </span>
              <span className="px-3 py-1 bg-pink-300 border-3 border-black text-black text-sm font-black uppercase">
                {exercise.category}
              </span>
              <span className="px-3 py-1 bg-green-300 border-3 border-black text-black text-sm font-black uppercase">
                {exercise.level}
              </span>
            </div>

            <div className="mb-4">
              <span className="block text-xs font-black text-black mb-2 tracking-wider">
                PRIMARY MUSCLES
              </span>
              <div className="flex flex-wrap gap-2">
                {exercise.primaryMuscles?.map((muscle) => (
                  <span
                    key={muscle}
                    className="px-3 py-1 bg-yellow-400 border-3 border-black text-black text-sm font-bold uppercase"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t-4 border-black">
              <p className="text-sm font-bold text-black">
                Click for details →
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToRoutine(exercise);
                }}
                className="bg-pink-400 hover:bg-pink-500 border-4 border-black text-black font-black py-2 px-5 text-sm transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 uppercase"
              >
                <Plus size={18} strokeWidth={3} /> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Carousel
  const ExerciseCarousel = () => {
    return (
      <div className="relative">
        {finalExercises.length === 0 ? (
          <div className="bg-white border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Zap size={64} className="mx-auto mb-4 text-black" />
            <p className="text-black font-black text-xl">NO EXERCISES FOUND</p>
            <p className="text-black font-bold mt-2">Try different filters!</p>
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden">
              {finalExercises.map((ex, index) => (
                <ExerciseCard key={ex.id} exercise={ex} index={index} />
              ))}
            </div>

            {finalExercises.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCarouselIndex((prev) =>
                      prev === 0 ? finalExercises.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-yellow-400 border-4 border-black text-black p-3 transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] z-10"
                >
                  <ChevronLeft size={28} strokeWidth={3} />
                </button>
                <button
                  onClick={() =>
                    setCarouselIndex(
                      (prev) => (prev + 1) % finalExercises.length
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-yellow-400 border-4 border-black text-black p-3 transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] z-10"
                >
                  <ChevronRight size={28} strokeWidth={3} />
                </button>
                <div className="flex justify-center mt-6 space-x-3">
                  {finalExercises.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCarouselIndex(index)}
                      className={`h-3 border-3 border-black transition-all ${
                        index === carouselIndex
                          ? "bg-pink-400 w-10 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                          : "bg-white w-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute right-4 bottom-4 bg-white border-3 border-black text-black p-2 transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10"
                >
                  {isPlaying ? (
                    <Pause size={18} strokeWidth={3} />
                  ) : (
                    <Play size={18} strokeWidth={3} />
                  )}
                </button>
              </>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-yellow-50 text-black p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white border-4 border-black p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Zap size={36} className="text-black" strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight">
                  WORKOUT WIZARD
                </h1>
                <p className="text-base font-bold text-black mt-1">
                  Build your perfect routine
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleReset}
                className="bg-white hover:bg-gray-100 border-4 border-black text-black font-black py-3 px-5 text-sm transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 uppercase"
              >
                <RefreshCw size={18} strokeWidth={3} /> Reset
              </button>
              <button
                onClick={copyShareLink}
                className="bg-blue-400 hover:bg-blue-500 border-4 border-black text-black font-black py-3 px-5 text-sm transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 uppercase"
              >
                <Share2 size={18} strokeWidth={3} /> Share
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-8">
            <div className="flex justify-between max-w-3xl mx-auto">
              <StepIndicator
                num={1}
                label="Muscle"
                active={step >= 1}
                selection={muscle}
              />
              <StepIndicator
                num={2}
                label="Gear"
                active={step >= 2}
                selection={equipment}
              />
              <StepIndicator
                num={3}
                label="Type"
                active={step >= 3}
                selection={category}
              />
              <StepIndicator
                num={4}
                label="Level"
                active={step >= 4}
                selection={level}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="min-h-[500px]">
          {/* STEP 1: MUSCLE */}
          {step === 1 && (
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-3xl font-black text-black mb-4 md:mb-0 flex items-center gap-3">
                  <Target size={32} strokeWidth={3} />
                  SELECT MUSCLE
                </h2>

                <div className="flex bg-gray-100 border-4 border-black p-1 gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <button
                    onClick={() => setView("front")}
                    className={`px-6 py-2 font-black text-sm uppercase transition-all border-2 border-black ${
                      view === "front"
                        ? "bg-pink-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    Front
                  </button>
                  <button
                    onClick={() => setView("back")}
                    className={`px-6 py-2 font-black text-sm uppercase transition-all border-2 border-black ${
                      view === "back"
                        ? "bg-pink-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    Back
                  </button>
                </div>
              </div>

              <div
                className="relative w-full max-w-md mx-auto"
                ref={containerRef}
                onMouseMove={handleMouseMove}
              >
                {tooltip.show && (
                  <div
                    className="absolute bg-yellow-400 border-4 border-black text-black text-sm font-black px-4 py-2 z-50 pointer-events-none whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    style={{
                      left: tooltip.x,
                      top: tooltip.y,
                      transform: "translate(-50%, -120%)",
                    }}
                  >
                    {tooltip.content}
                  </div>
                )}

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
          )}

          {/* STEP 2: EQUIPMENT */}
          {step === 2 && (
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-3xl font-black text-black mb-6 text-center uppercase">
                Choose Equipment
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableEquipment.map((opt) => {
                  const Icon = equipmentIcons[opt.toLowerCase()] || Dumbbell;
                  const exerciseCount = exercisesForMuscle.filter(
                    (e) => e.equipment === opt
                  ).length;

                  return (
                    <button
                      key={opt}
                      onClick={() => setEquipment(opt)}
                      className={`p-5 text-left font-bold text-base transition-all hover:translate-x-1 hover:translate-y-1 border-4 border-black ${
                        equipment === opt
                          ? "bg-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                          : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon size={28} strokeWidth={2.5} />
                        <span className="capitalize font-black">{opt}</span>
                      </div>
                      <p className="text-xs font-bold opacity-70">
                        {exerciseCount} exercises
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: TYPE */}
          {step === 3 && (
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-3xl font-black text-black mb-6 text-center uppercase">
                Workout Type
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableCategories.map((opt) => {
                  const exerciseCount = exercisesForEquipment.filter(
                    (e) => e.category === opt
                  ).length;

                  return (
                    <button
                      key={opt}
                      onClick={() => setCategory(opt)}
                      className={`p-6 text-center font-black text-lg transition-all hover:translate-x-1 hover:translate-y-1 capitalize border-4 border-black ${
                        category === opt
                          ? "bg-pink-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                          : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      }`}
                    >
                      <div className="mb-1">{opt}</div>
                      <p className="text-xs font-bold opacity-70">
                        {exerciseCount} exercises
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: LEVEL */}
          {step === 4 && (
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-3xl font-black text-black mb-6 text-center uppercase">
                Your Level
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {availableLevels.map((opt) => {
                  const isActive = level === opt;
                  let bgColor;

                  if (opt === "beginner") bgColor = "bg-green-400";
                  else if (opt === "intermediate") bgColor = "bg-yellow-400";
                  else bgColor = "bg-pink-400";

                  return (
                    <button
                      key={opt}
                      onClick={() => setLevel(opt)}
                      className={`p-10 flex flex-col items-center justify-center font-black text-2xl transition-all hover:translate-x-1 hover:translate-y-1 capitalize border-4 border-black ${bgColor} ${
                        isActive
                          ? "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-105"
                          : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] opacity-60"
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
            <div>
              <div className="bg-white border-4 border-black p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
                <h2 className="text-3xl font-black text-black uppercase">
                  Your Exercises
                </h2>
                <p className="text-lg font-bold mt-2">
                  Found {finalExercises.length} exercise
                  {finalExercises.length !== 1 ? "s" : ""}
                </p>
              </div>

              <ExerciseCarousel />

              {/* Routine */}
              <div className="bg-white border-4 border-black p-6 mt-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-black flex items-center gap-3 uppercase">
                    <Activity size={32} strokeWidth={3} />
                    Your Routine
                  </h3>
                  {routine.length > 0 && (
                    <button
                      onClick={() => setRoutine([])}
                      className="bg-red-400 hover:bg-red-500 border-4 border-black text-black font-black py-2 px-4 text-sm transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 uppercase"
                    >
                      <Trash2 size={16} strokeWidth={3} /> Clear
                    </button>
                  )}
                </div>

                {routine.length === 0 ? (
                  <div className="bg-blue-100 border-4 border-dashed border-black p-12 text-center">
                    <Dumbbell
                      size={64}
                      className="mx-auto mb-4 text-black"
                      strokeWidth={2}
                    />
                    <p className="text-black font-black text-xl">
                      NO EXERCISES YET
                    </p>
                    <p className="text-black font-bold mt-2">
                      Add exercises to build your routine!
                    </p>
                  </div>
                ) : (
                  <ol className="space-y-3">
                    {routine.map((item, index) => (
                      <li
                        key={index}
                        className="bg-green-100 border-4 border-black p-4 flex flex-col sm:flex-row sm:items-center justify-between transition-all hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <div className="mb-3 sm:mb-0 flex items-center gap-4">
                          <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg border-2 border-black">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-black text-black text-lg">
                              {item.name}
                            </div>
                            <div className="text-sm font-bold text-black">
                              {item.sets} sets × {item.reps} reps
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromRoutine(index)}
                          className="bg-red-400 hover:bg-red-500 border-3 border-black text-black font-black py-2 px-4 text-sm transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 uppercase"
                        >
                          <Trash2 size={16} strokeWidth={3} /> Remove
                        </button>
                      </li>
                    ))}
                  </ol>
                )}

                {routine.length > 0 && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={exportCSV}
                      className="bg-green-400 hover:bg-green-500 border-4 border-black text-black font-black py-4 px-8 text-lg transition-all hover:translate-x-1 hover:translate-y-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 uppercase"
                    >
                      <Download size={24} strokeWidth={3} /> Export Routine
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        {step < 5 && (
          <div className="bg-white border-4 border-black p-4 mt-6 flex flex-col sm:flex-row sm:justify-between items-center gap-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`py-3 px-6 font-black text-base flex items-center gap-2 border-4 border-black uppercase transition-all ${
                step === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50 hover:translate-x-0.5 hover:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              <ChevronLeft size={20} strokeWidth={3} /> Back
            </button>

            <div className="text-base font-black text-black uppercase">
              Step {step} / 4
            </div>

            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`py-3 px-6 font-black text-base flex items-center gap-2 border-4 border-black uppercase transition-all ${
                !canProceed()
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-500 hover:translate-x-0.5 hover:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              {step === 4 ? "See Results" : "Next"}{" "}
              <ChevronRight size={20} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedExercise && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedExercise(null)}
        >
          <div
            className="bg-white border-4 border-black w-full max-w-5xl max-h-[90vh] overflow-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-yellow-400 border-b-4 border-black p-6 flex justify-between items-center z-10">
              <h2 className="text-3xl font-black text-black uppercase">
                {selectedExercise.name}
              </h2>
              <button
                onClick={() => setSelectedExercise(null)}
                className="bg-white border-3 border-black text-black p-2 transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <X size={28} strokeWidth={3} />
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="h-80 mb-6">
                    <RotatingImage
                      images={selectedExercise.images}
                      name={selectedExercise.name}
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="px-4 py-2 bg-blue-300 border-3 border-black text-black text-sm font-black uppercase">
                      {selectedExercise.equipment || "BODYWEIGHT"}
                    </span>
                    <span className="px-4 py-2 bg-pink-300 border-3 border-black text-black text-sm font-black uppercase">
                      {selectedExercise.category}
                    </span>
                    <span className="px-4 py-2 bg-green-300 border-3 border-black text-black text-sm font-black uppercase">
                      {selectedExercise.level}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="bg-blue-100 border-4 border-black p-5 mb-6">
                    <h3 className="text-xl font-black text-black mb-4 uppercase">
                      Instructions
                    </h3>
                    <ol className="list-decimal pl-5 space-y-2 text-base text-black font-bold">
                      {selectedExercise.instructions?.map((ins, idx) => (
                        <li key={idx}>{ins}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="bg-pink-100 border-4 border-black p-5 mb-6">
                    <h3 className="text-xl font-black text-black mb-4 uppercase">
                      Muscles
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <span className="block text-sm font-black text-black mb-2 uppercase">
                          Primary
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {selectedExercise.primaryMuscles?.map((muscle) => (
                            <span
                              key={muscle}
                              className="px-3 py-1 bg-yellow-400 border-3 border-black text-black text-sm font-bold uppercase"
                            >
                              {muscle}
                            </span>
                          ))}
                        </div>
                      </div>
                      {selectedExercise.secondaryMuscles && (
                        <div>
                          <span className="block text-sm font-black text-black mb-2 uppercase">
                            Secondary
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {selectedExercise.secondaryMuscles.map((muscle) => (
                              <span
                                key={muscle}
                                className="px-3 py-1 bg-white border-3 border-black text-black text-sm font-bold uppercase"
                              >
                                {muscle}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        addToRoutine(selectedExercise);
                        setSelectedExercise(null);
                      }}
                      className="flex-1 bg-pink-400 hover:bg-pink-500 border-4 border-black text-black font-black py-3 px-6 flex items-center justify-center gap-2 transition-all hover:translate-x-1 hover:translate-y-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] uppercase"
                    >
                      <Plus size={22} strokeWidth={3} /> Add
                    </button>
                    <button
                      onClick={() => toggleFavorite(selectedExercise.id)}
                      className={`px-6 py-3 font-black border-4 border-black flex items-center justify-center gap-2 transition-all hover:translate-x-1 hover:translate-y-1 uppercase ${
                        favorites[selectedExercise.id]
                          ? "bg-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                          : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      }`}
                    >
                      <Star
                        size={22}
                        fill={favorites[selectedExercise.id] ? "#000" : "none"}
                        strokeWidth={2.5}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
