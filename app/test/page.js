"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FrontView from "@/components/anatomy/FrontView";
import BackView from "@/components/anatomy/BackView";
import exercisesData from "@/public/exercises.json";
import {
  Dumbbell,
  Weight,
  GitPullRequest,
  Activity,
  Barbell,
  Wind,
  Users,
  Coffee,
  BookOpen,
  Plus,
  Download,
  RotateCcw,
  ChevronDown,
  Zap,
  Trash2,
  X,
} from "lucide-react";

// ============================================
// THEME
// ============================================
const theme = {
  bg: "#0f172a",
  card: "#1e293b",
  accent: "#22d3ee",
  highlight: "#fcd34d",
};

// ============================================
// SCROLL SNAP (fixed to use container height)
// ============================================
const useScrollSnap = () => {
  const containerRef = useRef(null);
  const [activeSection, setActiveSection] = useState(0);

  const getPageHeight = () =>
    containerRef.current?.clientHeight || window.innerHeight;

  const scrollTo = (index) => {
    const h = getPageHeight();
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * h,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const h = getPageHeight();
    const index = Math.round(containerRef.current.scrollTop / h);
    setActiveSection(index);
  };

  return { containerRef, activeSection, scrollTo, handleScroll };
};

// ============================================
// ROTATING IMAGE (restored)
// ============================================
const RotatingImage = ({ images = [], name, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images?.length]);

  useEffect(() => {
    if (images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 1500);
    }
    return () => clearInterval(intervalRef.current);
  }, [images.length]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {images.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out flex items-center justify-center ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={`/exercises/${image || "placeholder.png"}`}
            alt={`${name} view ${index + 1}`}
            className="w-full h-full object-contain"
          />
        </div>
      ))}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function WorkoutWizard() {
  // IMPORTANT:
  // Marquee is sticky with h-10 (2.5rem) / md:h-12 (3rem)
  // So wizard must be height: 100vh - marquee height
  const WIZARD_H = "h-[calc(100vh-2.5rem)] md:h-[calc(100vh-3rem)]"; // remaining space under marquee

  // --- STATE ---
  const { containerRef, activeSection, scrollTo, handleScroll } =
    useScrollSnap();

  // Anatomy Tooltip State
  const anatomyBoxRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Selections
  const [view, setView] = useState("front");
  const [muscle, setMuscle] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [category, setCategory] = useState(null);
  const [level, setLevel] = useState(null);

  // Data State
  const [routine, setRoutine] = useState([]); // store exercise IDs
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [highlightedMuscle, setHighlightedMuscle] = useState(null);

  // --- EFFECTS: reset dependent filters to avoid empty results ---
  useEffect(() => {
    // changing muscle invalidates the rest
    setEquipment(null);
    setCategory(null);
    setLevel(null);
  }, [muscle]);

  useEffect(() => {
    // changing equipment invalidates category/level
    setCategory(null);
    setLevel(null);
  }, [equipment]);

  useEffect(() => {
    // changing category invalidates level
    setLevel(null);
  }, [category]);

  // --- HANDLERS ---
  const handleMouseMove = (e) => {
    if (!anatomyBoxRef.current) return;
    const rect = anatomyBoxRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const resetAll = () => {
    setMuscle(null);
    setEquipment(null);
    setCategory(null);
    setLevel(null);
    setSelectedExercise(null);
    scrollTo(0);
  };

  const isInRoutine = (exId) => routine.includes(exId);

  const addToRoutine = (ex) => {
    if (!ex?.id) return;
    setRoutine((prev) => (prev.includes(ex.id) ? prev : [...prev, ex.id]));
  };

  const removeFromRoutine = (exId) => {
    setRoutine((prev) => prev.filter((id) => id !== exId));
  };

  const exportCSV = () => {
    // export current routine as list of names (simple)
    const selected = routine
      .map((id) => exercisesData.find((e) => e.id === id))
      .filter(Boolean);

    const header = ["Order", "Name", "Equipment", "Category", "Level"];
    const rows = selected.map((ex, i) => [
      i + 1,
      ex.name,
      ex.equipment || "",
      ex.category || "",
      ex.level || "",
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

  // --- PROGRESSIVE LOGIC (prevents empty workouts) ---
  // 1) Filter by Muscle
  const exercisesForMuscle = useMemo(() => {
    if (!muscle) return [];
    return exercisesData.filter(
      (ex) =>
        ex.primaryMuscles?.includes(muscle) ||
        ex.secondaryMuscles?.includes(muscle),
    );
  }, [muscle]);

  // 2) Available Equipment from muscle-filtered
  const availableEquipment = useMemo(() => {
    return [
      ...new Set(exercisesForMuscle.map((ex) => ex.equipment).filter(Boolean)),
    ].sort();
  }, [exercisesForMuscle]);

  // 3) Filter by Equipment
  const exercisesForEquipment = useMemo(() => {
    return exercisesForMuscle.filter(
      (ex) => !equipment || ex.equipment === equipment,
    );
  }, [exercisesForMuscle, equipment]);

  // 4) Available Categories from equipment-filtered
  const availableCategories = useMemo(() => {
    return [
      ...new Set(
        exercisesForEquipment.map((ex) => ex.category).filter(Boolean),
      ),
    ].sort();
  }, [exercisesForEquipment]);

  // 5) Filter by Category
  const exercisesForCategory = useMemo(() => {
    return exercisesForEquipment.filter(
      (ex) => !category || ex.category === category,
    );
  }, [exercisesForEquipment, category]);

  // 6) Available Levels from category-filtered
  const availableLevels = useMemo(() => {
    return [
      ...new Set(exercisesForCategory.map((ex) => ex.level).filter(Boolean)),
    ];
  }, [exercisesForCategory]);

  // 7) Final result
  const finalExercises = useMemo(() => {
    return exercisesForCategory.filter((ex) => !level || ex.level === level);
  }, [exercisesForCategory, level]);

  const equipIcons = {
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

  // ============================================
  // RENDER
  // ============================================
  return (
    <div
      className={`relative w-full ${WIZARD_H} bg-[#020617] text-white font-sans overflow-hidden`}
    >
      {/* FORCE SVG SIZE */}
      <style>{`
        .anatomy-svg-wrapper svg {
          width: 100% !important;
          height: 100% !important;
          max-height: 100%;
          display: block;
          margin: 0 auto;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome/Safari/Edge */
        }
      `}</style>

      {/* GLOBAL HUD */}
      <div className="fixed top-[2.5rem] md:top-[3rem] w-full px-6 py-4 flex justify-between items-start z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-xl md:text-2xl font-black fixed left-27 italic tracking-tighter uppercase text-white drop-shadow-lg">
            Workout<span className="text-cyan-400">Wizard</span>
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {muscle && <Badge label={muscle} color="cyan" />}
            {equipment && <Badge label={equipment} color="purple" />}
            {category && <Badge label={category} color="emerald" />}
            {level && <Badge label={level} color="orange" />}
          </div>
        </div>

        {activeSection > 0 && (
          <button
            onClick={resetAll}
            className="pointer-events-auto p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Reset"
          >
            <RotateCcw size={20} className="text-white/70" />
          </button>
        )}
      </div>

      {/* SNAP CONTAINER (fills remaining space under marquee) */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
      >
        {/* ============================================
            PANEL 1: INTRO
           ============================================ */}
        <section className="h-full w-full snap-start relative flex flex-col items-center justify-center bg-[#020617] overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center px-4"
          >
            <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white mb-6">
              Workout{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600">
                Wizard
              </span>
            </h1>

            <div className="flex items-center justify-center gap-3 text-sm md:text-xl font-medium text-slate-400">
              <span className="text-white">Your Selections</span>
              <span className="text-cyan-500">→</span>
              <span className="text-white">Your Routine</span>
            </div>
          </motion.div>

          <motion.button
            onClick={() => scrollTo(1)}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 flex flex-col items-center gap-3 group cursor-pointer"
          >
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-slate-600 group-hover:text-cyan-400 transition-colors">
              Scroll to Start
            </span>
            <ChevronDown
              className="text-white/20 group-hover:text-cyan-400 transition-colors animate-bounce"
              size={24}
            />
          </motion.button>
        </section>

        {/* ============================================
            PANEL 2: ANATOMY SELECTOR
           ============================================ */}
        <section className="h-full w-full snap-start relative flex items-center justify-center bg-[#020617] overflow-hidden p-4 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.15),transparent_60%)] pointer-events-none" />

          <div className="w-full max-w-7xl h-full flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 items-center justify-center relative z-10 pt-20 lg:pt-0">
            {/* Left Column */}
            <div className="text-center lg:text-left space-y-4 lg:space-y-6 mb-6 lg:mb-0 flex-shrink-0">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
                Step 01 <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                  Target Muscle
                </span>
              </h2>
              <p className="text-slate-400 text-sm md:text-lg max-w-md mx-auto lg:mx-0">
                Interact with the model to select your primary focus area.
              </p>

              <div className="flex justify-center lg:justify-start gap-4">
                {["front", "back"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-6 py-2 md:px-8 md:py-3 rounded-full font-bold uppercase tracking-widest text-xs md:text-sm border transition-all ${
                      view === v
                        ? "bg-cyan-500 border-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                        : "bg-transparent border-white/20 text-white hover:border-white"
                    }`}
                  >
                    {v} View
                  </button>
                ))}
              </div>
            </div>

            {/* Anatomy Box */}
            <div
              ref={anatomyBoxRef}
              onMouseMove={handleMouseMove}
              className="relative h-[48vh] md:h-[60vh] w-full flex items-center justify-center bg-slate-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl"
            >
              {/* Scanning line */}
              <motion.div
                animate={{ top: ["-10%", "110%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[1px] z-20 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
                  boxShadow: `0 0 15px ${theme.accent}`,
                }}
              />

              {/* Tooltip */}
              <AnimatePresence>
                {highlightedMuscle && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: mousePos.x + 30,
                      y: mousePos.y - 50,
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-0 left-0 z-50 pointer-events-none px-4 py-2 rounded-lg backdrop-blur-md border border-white/10"
                    style={{
                      backgroundColor: `${theme.bg}cc`,
                      boxShadow: `0 0 15px ${theme.accent}`,
                    }}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                      {highlightedMuscle}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="anatomy-svg-wrapper h-full w-full flex items-center justify-center p-6 md:p-12 transition-transform duration-700 hover:scale-105">
                {view === "front" ? (
                  <FrontView
                    onHover={setHighlightedMuscle}
                    onLeave={() => setHighlightedMuscle(null)}
                    onSelect={(m) => {
                      setMuscle(m);
                      scrollTo(2);
                    }}
                    selectedMuscle={muscle}
                    highlightedMuscle={highlightedMuscle}
                  />
                ) : (
                  <BackView
                    onHover={setHighlightedMuscle}
                    onLeave={() => setHighlightedMuscle(null)}
                    onSelect={(m) => {
                      setMuscle(m);
                      scrollTo(2);
                    }}
                    selectedMuscle={muscle}
                    highlightedMuscle={highlightedMuscle}
                  />
                )}
              </div>

              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                  backgroundImage:
                    "linear-gradient(0deg, transparent 49%, white 50%, transparent 51%), linear-gradient(90deg, transparent 49%, white 50%, transparent 51%)",
                  backgroundSize: "32px 32px",
                }}
              />
            </div>
          </div>
        </section>

        {/* ============================================
            PANEL 3: EQUIPMENT SELECTOR (full width, no inner scroll)
           ============================================ */}
        <section
          className={`h-full w-full snap-start flex flex-col items-center justify-center bg-[#050505] relative transition-opacity duration-500 ${
            muscle
              ? "opacity-100 pointer-events-auto"
              : "opacity-30 pointer-events-none"
          }`}
        >
          <div className="w-full px-4 md:px-10 text-center">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2">
              Step 02
            </h2>
            <h3 className="text-2xl md:text-4xl font-bold uppercase tracking-widest text-purple-500 mb-8">
              Select Equipment
            </h3>

            {/* Auto-fit grid so it uses full width and avoids inner scroll */}
            <div className="w-full mx-auto grid gap-3 md:gap-4 [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]">
              {availableEquipment.map((item) => {
                const Icon = equipIcons[item] || Dumbbell;
                const isSelected = equipment === item;

                return (
                  <button
                    key={item}
                    onClick={() => {
                      setEquipment(item);
                      scrollTo(3);
                    }}
                    className={`group relative rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 py-4 px-3 md:py-6 md:px-4 ${
                      isSelected
                        ? "bg-purple-600 border-purple-500 shadow-[0_0_30px_rgba(147,51,234,0.4)] scale-[1.02] z-10"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/50"
                    }`}
                  >
                    <Icon
                      size={30}
                      className={`${
                        isSelected
                          ? "text-white"
                          : "text-purple-400 group-hover:text-purple-300"
                      }`}
                    />
                    <span className="font-bold uppercase tracking-wider text-[11px] md:text-sm">
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>

            {availableEquipment.length === 0 && (
              <p className="mt-6 text-slate-500 font-mono text-sm">
                Select a muscle first.
              </p>
            )}
          </div>
        </section>

        {/* ============================================
            PANEL 4: FILTERS (Category & Level) - simplified (like before)
           ============================================ */}
        <section
          className={`h-full w-full snap-start flex flex-col items-center justify-center bg-[#0f172a] relative ${
            equipment ? "opacity-100" : "opacity-30 pointer-events-none"
          }`}
        >
          <div className="max-w-5xl w-full px-6 grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Category */}
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest text-emerald-400 flex items-center gap-3">
                <Activity /> Objective
              </h3>

              <div className="grid gap-3">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      if (level) scrollTo(4);
                    }}
                    className={`w-full p-4 md:p-6 text-left rounded-xl border transition-all ${
                      category === cat
                        ? "bg-emerald-600 border-emerald-500 text-white shadow-lg scale-[1.02]"
                        : "bg-black/20 border-white/10 hover:bg-white/5 text-slate-400"
                    }`}
                  >
                    <span className="text-lg md:text-xl font-black uppercase italic">
                      {cat}
                    </span>
                  </button>
                ))}
              </div>

              {availableCategories.length === 0 && (
                <p className="text-slate-500 font-mono text-sm">
                  No categories available.
                </p>
              )}
            </div>

            {/* Level */}
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest text-orange-400 flex items-center gap-3">
                <Zap /> Intensity
              </h3>

              <div className="grid gap-3">
                {availableLevels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      setLevel(lvl);
                      if (category) scrollTo(4);
                    }}
                    className={`w-full p-4 md:p-6 text-left rounded-xl border transition-all ${
                      level === lvl
                        ? "bg-orange-600 border-orange-500 text-white shadow-lg scale-[1.02]"
                        : "bg-black/20 border-white/10 hover:bg-white/5 text-slate-400"
                    }`}
                  >
                    <span className="text-lg md:text-xl font-black uppercase italic">
                      {lvl}
                    </span>
                  </button>
                ))}
              </div>

              {availableLevels.length === 0 && (
                <p className="text-slate-500 font-mono text-sm">
                  No levels available.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ============================================
            PANEL 5: RESULTS & ROUTINE
           ============================================ */}
        <section
          className={`h-full w-full snap-start flex flex-col bg-[#000] relative ${
            category && level ? "opacity-100" : "opacity-30 pointer-events-none"
          }`}
        >
          <div className="w-full h-full pt-20 flex flex-col overflow-hidden">
            {/* Header (centered title, routine summary moved left) */}
            <div className="px-6 md:px-8 pb-4 md:pb-6 border-b border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4">
                {/* LEFT: routine summary (moved left) */}
                <div className="flex items-center gap-4 justify-start">
                  <div className="text-left">
                    <div className="text-2xl font-black text-white">
                      {routine.length}
                    </div>
                    <div className="text-[10px] md:text-xs font-bold uppercase text-slate-500 tracking-widest">
                      In Routine
                    </div>
                  </div>

                  <button
                    onClick={exportCSV}
                    disabled={routine.length === 0}
                    className={`h-10 w-10 md:h-12 md:w-12 rounded-lg flex items-center justify-center transition-colors ${
                      routine.length === 0
                        ? "bg-white/10 text-white/30 cursor-not-allowed"
                        : "bg-white text-black hover:bg-cyan-400"
                    }`}
                    aria-label="Export Routine"
                    title={
                      routine.length === 0
                        ? "Add exercises first"
                        : "Export CSV"
                    }
                  >
                    <Download size={20} />
                  </button>
                </div>

                {/* CENTER: workout header (centered) */}
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
                    Your <span className="text-cyan-400">Workout</span>
                  </h2>
                  <p className="text-slate-400 mt-2 text-sm md:text-base">
                    {finalExercises.length} exercises match your criteria
                  </p>
                </div>

                {/* RIGHT: empty spacer (keeps center truly centered) */}
                <div className="hidden md:block" />
              </div>
            </div>

            {/* Horizontal Scroll Cards */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-center gap-6 px-6 md:px-8 py-4 md:py-8 no-scrollbar snap-x snap-mandatory">
              {finalExercises.length === 0 ? (
                <div className="w-full text-center text-slate-500 font-mono">
                  NO MATCHES FOUND. TRY ADJUSTING FILTERS.
                </div>
              ) : (
                finalExercises.map((ex) => {
                  const inRoutine = isInRoutine(ex.id);

                  return (
                    <div
                      key={ex.id}
                      onClick={() => setSelectedExercise(ex)}
                      className="h-[60vh] md:h-full max-h-[500px] w-[280px] md:w-[350px] flex-shrink-0 bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all group cursor-pointer relative snap-center"
                    >
                      {/* Image Area (rotating) */}
                      <div className="h-[55%] bg-black relative p-6 flex items-center justify-center border-b border-white/5">
                        <RotatingImage
                          images={ex.images || []}
                          name={ex.name}
                        />
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs font-bold uppercase tracking-wider text-white border border-white/10 z-10">
                          {ex.level}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 md:p-6 flex flex-col justify-between h-[45%]">
                        <div>
                          <h3 className="text-xl md:text-2xl font-black uppercase leading-none mb-2 line-clamp-2">
                            {ex.name}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="text-[10px] uppercase font-bold text-slate-500 border border-slate-800 px-2 py-1 rounded">
                              {ex.equipment || "bodyweight"}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-slate-500 border border-slate-800 px-2 py-1 rounded">
                              {ex.category}
                            </span>
                          </div>
                        </div>

                        {/* Add/Remove button */}
                        {inRoutine ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromRoutine(ex.id);
                            }}
                            className="w-full py-2 md:py-3 bg-red-500 text-white font-black uppercase tracking-widest hover:bg-red-400 transition-colors rounded-lg flex items-center justify-center gap-2 text-sm md:text-base"
                          >
                            <Trash2 size={16} strokeWidth={3} /> Remove
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToRoutine(ex);
                            }}
                            className="w-full py-2 md:py-3 bg-white text-black font-black uppercase tracking-widest hover:bg-cyan-400 transition-colors rounded-lg flex items-center justify-center gap-2 text-sm md:text-base"
                          >
                            <Plus size={16} strokeWidth={3} /> Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedExercise(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111] border border-white/20 w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-3xl grid md:grid-cols-2 overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedExercise(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X size={18} className="text-white" />
              </button>

              <div className="bg-black p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
                <div className="w-full aspect-square">
                  <RotatingImage
                    images={selectedExercise.images || []}
                    name={selectedExercise.name}
                  />
                </div>
              </div>

              <div className="p-8 md:p-12 overflow-y-auto">
                <h2 className="text-3xl md:text-4xl font-black uppercase italic mb-6">
                  {selectedExercise.name}
                </h2>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-cyan-400 font-bold uppercase tracking-widest text-xs mb-2">
                      Instructions
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-slate-300 text-sm md:text-base">
                      {selectedExercise.instructions?.map((i, idx) => (
                        <li key={idx}>{i}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Add/Remove */}
                  {isInRoutine(selectedExercise.id) ? (
                    <button
                      onClick={() => {
                        removeFromRoutine(selectedExercise.id);
                        setSelectedExercise(null);
                      }}
                      className="w-full py-4 bg-red-500 text-white font-black uppercase tracking-widest rounded-xl hover:bg-red-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} /> Remove from Routine
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        addToRoutine(selectedExercise);
                        setSelectedExercise(null);
                      }}
                      className="w-full py-4 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-colors"
                    >
                      Add to Routine
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// BADGE
// ============================================
const Badge = ({ label, color }) => {
  const colors = {
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] md:text-xs font-bold uppercase tracking-wider border ${
        colors[color] || colors.cyan
      }`}
    >
      {label}
    </span>
  );
};
