import { useState, useMemo, useRef, useEffect } from "react";
import exercisesData from "@/public/exercises.json";

export function useWorkoutWizard() {
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

  return {
    step,
    view,
    setView,
    carouselIndex,
    setCarouselIndex,
    isPlaying,
    setIsPlaying,
    muscle,
    equipment,
    category,
    level,
    routine,
    favorites,
    selectedExercise,
    tooltip,
    highlightedMuscle,
    containerRef,
    handlers: {
      handleMuscleClick,
      handleMouseMove,
      handleMouseEnterMuscle,
      handleMouseLeaveMuscle,
      handleReset,
      canProceed,
      nextStep,
      prevStep,
      toggleFavorite,
      addToRoutine,
      removeFromRoutine,
      exportCSV,
      copyShareLink,
      setEquipment,
      setCategory,
      setLevel,
      setSelectedExercise,
    },
    derivedData: {
      exercisesForMuscle,
      availableEquipment,
      exercisesForEquipment,
      availableCategories,
      exercisesForCategory,
      availableLevels,
      finalExercises,
    },
  };
}
