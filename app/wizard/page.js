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
  Users,
  Plus,
  Download,
  RotateCcw,
  ChevronDown,
  Trash2,
  X,
  Target,
  Check,
  Zap,
  LayoutList,
  Maximize2,
  CircleDot,
  Dna,
  ArrowBigRight,
} from "lucide-react";

const equipIcons = {
  dumbbell: Dumbbell,
  barbell: Barbell,
  machine: Weight,
  cable: GitPullRequest,
  bodyweight: Activity,
  kettlebell: CircleDot,
  "pull-up bar": Users,
};

// ============================================
// UTILITY: ROTATING IMAGE (Full Fit)
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
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* FIX: Changed object-cover to object-contain so images aren't cropped */}
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
  const WIZARD_H = "h-[calc(100vh-2.5rem)] md:h-[calc(100vh-3rem)]";

  // --- STATE ---
  const containerRef = useRef(null);
  const [activeSection, setActiveSection] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState("front");
  const [muscle, setMuscle] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [category, setCategory] = useState(null);
  const [level, setLevel] = useState(null);

  const [routine, setRoutine] = useState([]);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [highlightedMuscle, setHighlightedMuscle] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // --- PROGRESSIVE LOGIC & COUNTS ---
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

  // --- HANDLERS ---
  const scrollTo = (index) => {
    const h = containerRef.current?.clientHeight || window.innerHeight;
    containerRef.current?.scrollTo({ top: index * h, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    setActiveSection(
      Math.round(
        containerRef.current.scrollTop / containerRef.current.clientHeight,
      ),
    );
  };

  const toggleRoutine = (ex) => {
    setRoutine((prev) =>
      prev.some((item) => item.id === ex.id)
        ? prev.filter((item) => item.id !== ex.id)
        : [...prev, ex],
    );
  };

  const currentPreview = finalExercises[activeIndex];

  return (
    <div
      className={`relative w-full ${WIZARD_H} bg-[#020617] text-white font-sans overflow-hidden selection:bg-cyan-500/30`}
    >
      <style>{`.anatomy-svg-wrapper svg { width: 100% !important; height: 100% !important; } .no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

      {/* GLOBAL HUD */}
      <div className="fixed top-8 left-0 right-0 px-6 py-4 z-[60] pointer-events-none flex justify-between items-start">
        <div className="pointer-events-auto flex flex-col gap-2 ml-12 md:ml-20">
          <h1 className="text-xl md:text-2xl font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
            Workout<span className="text-cyan-400">Wizard</span>
          </h1>
        </div>

        <div className="pointer-events-auto flex items-center gap-3">
          <button
            onClick={() => setIsRoutineModalOpen(true)}
            className="px-5 py-2.5 bg-cyan-500 text-black font-black uppercase text-[11px] flex items-center gap-2 hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)]"
          >
            <LayoutList size={16} /> Routine ({routine.length})
          </button>
          {activeSection > 0 && (
            <button
              onClick={() => {
                setMuscle(null);
                setEquipment(null);
                setCategory(null);
                setLevel(null);
                scrollTo(0);
              }}
              className="px-5 py-2.5 bg-white text-black font-black uppercase text-[11px] flex items-center gap-2"
            >
              <RotateCcw size={16} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* TOOLTIP */}
      <AnimatePresence>
        {highlightedMuscle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: mousePos.x + 20, y: mousePos.y - 20 }}
            exit={{ opacity: 0 }}
            className="fixed z-[100] px-4 py-2 bg-cyan-400 text-black font-black uppercase text-[11px] pointer-events-none border border-white/40 shadow-xl"
          >
            {highlightedMuscle}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        {/* PANEL 1: INTRO */}
        <section
          className="h-full w-full snap-start relative flex flex-col items-center justify-center bg-[#020617]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(56, 89, 198, 0.84), transparent 40%), radial-gradient(circle at 70% 60%, rgba(17, 68, 177, 0.91), transparent 40%)",
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[500px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-center px-4 relative z-10"
          >
            <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none text-white mb-6">
              Workout
              <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                Wizard
              </span>
            </h1>
            <p className="text-slate-400 font-bold text-md md:text-lg">
              <span className="flex justify-center items-center gap-2">
                Your Choice <ArrowBigRight size={20} /> Your Workouts
              </span>
            </p>
          </motion.div>
          <motion.button
            onClick={() => scrollTo(1)}
            className="absolute bottom-10 flex flex-col items-center gap-3 cursor-pointer group"
          >
            <span className="text-[20px] font-black uppercase  text-cyan-400 group-hover:text-white transition-colors">
              Scroll Down
            </span>
            <ChevronDown size={28} className="animate-bounce" />
          </motion.button>
        </section>

        {/* PANEL 2: MUSCLE */}
        <section className="h-full w-full snap-start relative flex items-center justify-center bg-[#020617] p-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05),transparent_70%)] pointer-events-none" />
          <div className="w-full max-w-6xl flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 items-center pt-20">
            <div className="text-center lg:text-left space-y-4">
              <h2 className="text-5xl md:text-4xl font-black uppercase text-white">
                Select a Muscle
              </h2>
              <div className="flex justify-center lg:justify-start gap-4 pt-6">
                {["front", "back"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-10 py-3 font-black uppercase text-xs border-2 transition-all ${view === v ? "bg-cyan-500 text-black border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.4)]" : "bg-transparent border-white/10 text-white hover:border-white"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative h-[50vh] md:h-[65vh] w-full flex items-center justify-center bg-zinc-900 border border-white/10 rounded-none shadow-2xl anatomy-svg-wrapper">
              {view === "front" ? (
                <FrontView
                  onSelect={setMuscle}
                  selectedMuscle={muscle}
                  onHover={setHighlightedMuscle}
                  onLeave={() => setHighlightedMuscle(null)}
                />
              ) : (
                <BackView
                  onSelect={setMuscle}
                  selectedMuscle={muscle}
                  onHover={setHighlightedMuscle}
                  onLeave={() => setHighlightedMuscle(null)}
                />
              )}
            </div>
          </div>
        </section>

        {/* PANEL 3: EQUIPMENT */}
        <section
          className={`h-full w-full snap-start flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-500 ${
            muscle ? "opacity-100" : "opacity-20 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />

          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
              <span className="text-white block mb-2 text-xl md:text-2xl opacity-50">
                Step 2
              </span>
              <span className="text-blue-500">Select Equipment</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-6xl px-6 relative z-10">
            {availableEquipment.map((item) => {
              const isActive = equipment === item;

              return (
                <button
                  key={item}
                  onClick={() => setEquipment(item)}
                  className={`relative px-6 py-10 rounded-2xl border-2 transition-all duration-300 group flex flex-col items-center justify-center overflow-hidden ${
                    isActive
                      ? "bg-blue-600 border-blue-400 scale-105 shadow-[0_0_30px_rgba(59,130,246,0.5)] z-10"
                      : "bg-gradient-to-br from-slate-700 to-slate-800 border-slate-500 hover:border-blue-400 hover:from-slate-600 hover:to-slate-700 shadow-lg"
                  }`}
                >
                  {/* Subtle light reflection - now partially visible on unselected cards too */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none transition-opacity duration-300 ${
                      isActive
                        ? "opacity-100"
                        : "opacity-40 group-hover:opacity-70"
                    }`}
                  />

                  <div className="text-center relative z-10">
                    {/* Equipment Name */}
                    <span
                      className={`font-black uppercase tracking-wide text-lg block transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-slate-100 group-hover:text-white"
                      }`}
                    >
                      {item}
                    </span>

                    {/* Exercise Count Pill */}
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest block mt-4 px-3 py-1.5 rounded-full border transition-colors ${
                        isActive
                          ? "bg-blue-500/50 border-blue-300/50 text-blue-50"
                          : "bg-slate-900/40 border-slate-400/50 text-slate-200 group-hover:border-blue-400/60 group-hover:text-blue-100 group-hover:bg-slate-800/50"
                      }`}
                    >
                      {equipmentCounts[item]} Exercises
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* PANEL 4: FILTERS */}
        <section
          className={`h-full w-full snap-start flex items-center justify-center bg-black transition-opacity ${equipment ? "opacity-100" : "opacity-20"}`}
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(56, 89, 198, 0.84), transparent 100%), radial-gradient(circle at 80% 80%, rgba(17, 68, 177, 0.91), transparent 70%)",
          }}
        >
          <div className="grid md:grid-cols-2 gap-12 w-full max-w-6xl px-8 relative z-10">
            <div className="space-y-6">
              <h3 className="text-base font-black uppercase text-emerald-400 tracking-[0.2em] flex items-center gap-3">
                <Activity size={50} /> Mode
              </h3>
              <div className="space-y-3">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full p-7 text-left border-2 transition-all flex justify-between items-center ${category === cat ? "bg-emerald-600 border-emerald-400 scale-[1.02] shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "bg-zinc-900/50 border-white/10 hover:border-emerald-500/50"}`}
                  >
                    <span className="text-2xl font-black uppercase italic text-white">
                      {cat}
                    </span>
                    <span className="font-black text-xs text-white bg-black/50 px-4 py-1.5">
                      {categoryCounts[cat]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-base font-black uppercase text-orange-500 tracking-[0.2em] flex items-center gap-3">
                <Zap size={50} /> Intensity
              </h3>
              <div className="space-y-3">
                {availableLevels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLevel(lvl)}
                    className={`w-full p-7 text-left border-2 transition-all flex justify-between items-center ${level === lvl ? "bg-orange-600 border-orange-400 scale-[1.02] shadow-[0_0_20px_rgba(249,115,22,0.3)]" : "bg-zinc-900/50 border-white/10 hover:border-orange-500/50"}`}
                  >
                    <span className="text-2xl font-black uppercase italic text-white">
                      {lvl}
                    </span>
                    <span className="font-black text-xs text-white bg-black/50 px-4 py-1.5">
                      {levelCounts[lvl]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PANEL 5: EXERCISES DASHBOARD */}
        <section
          className={`h-screen w-full snap-start bg-slate-900 flex flex-col transition-opacity ${
            category && level ? "opacity-100" : "opacity-50 pointer-events-none"
          }`}
        >
          {/* HEADER */}
          <div className="pt-16 px-10 pb-6 border-b border-slate-800 bg-slate-900 shrink-0">
            <h2 className="text-3xl font-bold text-white">Exercises</h2>
            <p className="text-sm text-slate-400 mt-1">
              {finalExercises.length} exercises found
            </p>
          </div>

          {/* MAIN SCROLLABLE LIST */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3 no-scrollbar">
            {finalExercises.map((ex, idx) => {
              const added = routine.some((r) => r.id === ex.id);

              return (
                <button
                  key={ex.id}
                  onClick={() => {
                    setActiveIndex(idx);
                    setIsModalOpen(true);
                  }}
                  className="w-full px-6 py-5 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between transition-all hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-500 tabular-nums">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="text-lg font-semibold text-slate-100">
                      {ex.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {added && (
                      <span className="text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-bold">
                        Added ✓
                      </span>
                    )}
                    <span className="text-sm text-slate-400 font-medium hover:text-white transition-colors">
                      View Details →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* POPUP MODAL */}
          {isModalOpen && finalExercises[activeIndex] && (
            <div className="fixed inset-0 z-300 flex items-center justify-center bg-slate-950/80 p-4 md:p-8 backdrop-blur-sm">
              {/* MODAL CONTAINER 
        Fixed height to 85vh to prevent top/bottom cutoff. 
      */}
              <div className="bg-slate-900 w-full max-w-6xl h-[85vh] rounded-2xl shadow-2xl border border-slate-700 flex flex-col md:flex-row overflow-hidden relative">
                {/* CLOSE BUTTON */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 rounded-full flex items-center justify-center font-bold transition-colors"
                >
                  ✕
                </button>

                {/* SECTION 1: IMAGES (Scrollable) */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-y-auto no-scrollbar border-b md:border-b-0 md:border-r border-slate-800 bg-slate-800/30 p-4 md:p-8 flex items-center justify-center">
                  {/* FIX: Added relative, aspect-square, and min-h to ensure the wrapper forces the images to render */}
                  <div className="relative w-full aspect-square min-h-[250px] max-w-md mx-auto flex items-center justify-center">
                    <RotatingImage
                      images={finalExercises[activeIndex].images}
                      name={finalExercises[activeIndex].name}
                    />
                  </div>
                </div>

                {/* SECTION 2: DETAILS 
          Takes up the other half. Includes a fixed header/footer and a scrollable body.
        */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-slate-900">
                  {/* Details Header (Fixed) */}
                  <div className="px-8 py-6 border-b border-slate-800 shrink-0 pr-16">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight">
                      {finalExercises[activeIndex].name}
                    </h3>
                    <div className="flex gap-4 mt-3">
                      <span className="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                        {finalExercises[activeIndex].equipment}
                      </span>
                      <span className="bg-slate-800 border border-slate-700 text-cyan-400 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                        {finalExercises[activeIndex].level}
                      </span>
                    </div>
                  </div>

                  {/* Details Body (Scrollable) */}
                  <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 no-scrollbar">
                    {/* Muscles */}
                    <div>
                      <p className="text-[10px] font-black uppercase text-cyan-500 tracking-widest mb-3">
                        Primary Muscles
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {finalExercises[activeIndex].primaryMuscles?.map(
                          (m) => (
                            <span
                              key={m}
                              className="border border-slate-700 bg-slate-800 text-slate-200 px-4 py-2 rounded-lg text-xs font-semibold uppercase"
                            >
                              {m}
                            </span>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Instructions */}
                    <div>
                      <p className="text-[10px] font-black uppercase text-cyan-500 tracking-widest mb-4">
                        Action Sequence
                      </p>
                      <div className="space-y-6">
                        {finalExercises[activeIndex].instructions?.map(
                          (step, i) => (
                            <div key={i} className="flex gap-4">
                              <span className="w-6 h-6 shrink-0 rounded bg-slate-800 border border-slate-700 text-cyan-500 flex items-center justify-center text-xs font-bold">
                                {i + 1}
                              </span>
                              <p className="text-slate-400 text-sm leading-relaxed mt-0.5">
                                {step}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Details Footer / Action Bar (Fixed) */}
                  <div className="p-6 border-t border-slate-800 bg-slate-900 shrink-0">
                    <button
                      onClick={() => toggleRoutine(finalExercises[activeIndex])}
                      className={`w-full py-4 rounded-xl font-bold uppercase text-sm tracking-widest transition-all ${
                        routine.some(
                          (r) => r.id === finalExercises[activeIndex].id,
                        )
                          ? "bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20"
                          : "bg-cyan-500 text-slate-900 hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                      }`}
                    >
                      {routine.some(
                        (r) => r.id === finalExercises[activeIndex].id,
                      )
                        ? "Remove from Routine"
                        : "Add to Routine"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ROUTINE MANAGER MODAL */}
      <AnimatePresence>
        {isRoutineModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md"
          >
            <div className="bg-[#0a0a0a] border border-white/20 w-full max-w-xl h-[75vh] flex flex-col relative">
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-[#111]">
                <h2 className="text-3xl font-black uppercase italic text-white tracking-tighter">
                  My <span className="text-cyan-400">Routine</span>
                </h2>
                <div className="flex gap-6 items-center">
                  <button
                    onClick={() => setRoutine([])}
                    className="text-[10px] font-black uppercase text-red-500 tracking-widest hover:text-white transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsRoutineModalOpen(false)}
                    className="bg-white text-black p-2 hover:bg-cyan-500"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-black">
                {routine.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-700 font-black uppercase text-xs tracking-widest">
                    No Sequences Defined
                  </div>
                ) : (
                  routine.map((ex) => (
                    <div
                      key={ex.id}
                      className="bg-zinc-900/50 p-5 flex justify-between items-center border border-white/5 hover:border-cyan-500/30 transition-all"
                    >
                      <div className="flex flex-col">
                        <span className="text-white font-black uppercase italic text-sm">
                          {ex.name}
                        </span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                          {ex.equipment} • {ex.level}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleRoutine(ex)}
                        className="text-red-500 hover:bg-red-500 hover:text-white p-2 transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="p-8 border-t border-white/10 bg-[#111]">
                <button className="w-full bg-cyan-500 py-5 text-black font-black uppercase text-xs tracking-[0.2em] shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                  Export Sequence (.CSV)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
