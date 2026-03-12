"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FrontView from "@/components/anatomy/FrontView";
import BackView from "@/components/anatomy/BackView";
import exercisesData from "@/public/exercises.json";
import {
  RotateCcw,
  ChevronDown,
  Trash2,
  X,
  LayoutList,
  ArrowBigRight,
  Download,
} from "lucide-react";

const theme = {
  colors: {
    bgPrimary: "#0A2A9B",
    bgDark: "#04114F",
    panel: "#1B43C4",
    panelHover: "#2550E0",
    accent: "#22FFD1",
    accentSoft: "#54FFDC",
    textPrimary: "#FFFFFF",
    textSecondary: "#D7E3FF",
    textMuted: "#B7C7FF",
    textOnAccent: "#04114F",
  },
  heights: {
    fullPage: "93.6dvh",
  },
};

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
      }, 1800);
    }
    return () => clearInterval(intervalRef.current);
  }, [images.length]);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {images.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className={`absolute inset-0 transition-opacity duration-500 ${
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

const SectionHeading = ({ step, title, subtitle, center = true }) => (
  <div className={`${center ? "text-center" : "text-left"} mb-4 md:mb-5`}>
    {step && (
      <div className="mb-1 text-[11px] font-semibold tracking-[0.18em] text-[#22FFD1] md:text-xs">
        {step}
      </div>
    )}
    <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-2 text-sm font-medium text-[#D7E3FF] md:text-base">
        {subtitle}
      </p>
    )}
  </div>
);

const SelectionCard = ({ title, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full border p-4 text-left transition-all duration-200 md:p-5 ${
      active
        ? "border-[#22FFD1] bg-[#22FFD1] text-[#04114F] shadow-[0_0_24px_rgba(34,255,209,0.18)]"
        : "border-[#6D8DFF]/30 bg-[#1B43C4] text-white hover:border-[#22FFD1] hover:bg-[#2550E0]"
    }`}
  >
    <div className="flex h-full flex-col justify-between gap-4">
      <div>
        <h3
          className={`text-base font-semibold tracking-tight capitalize md:text-lg ${
            active ? "text-[#04114F]" : "text-white"
          }`}
        >
          {title}
        </h3>
      </div>

      <div>
        <span
          className={`inline-flex px-3 py-1 text-[11px] font-semibold ${
            active ? "bg-[#04114F] text-[#22FFD1]" : "bg-[#0A2A9B] text-white"
          }`}
        >
          {count}
        </span>
      </div>
    </div>
  </button>
);

const CleanTag = ({ children, accent = false }) => (
  <span
    className={`px-2.5 py-1 text-[11px] font-medium capitalize ${
      accent
        ? "bg-[#22FFD1] text-[#04114F]"
        : "border border-[#6D8DFF]/30 bg-[#0A2A9B] text-white"
    }`}
  >
    {children}
  </span>
);

export default function WorkoutWizard() {
  const containerRef = useRef(null);
  const touchStartY = useRef(null);

  const [activeSection, setActiveSection] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

  const maxUnlockedSection = useMemo(() => {
    if (!muscle) return 1;
    if (!equipment) return 2;
    if (!category) return 3;
    if (!level) return 4;
    return 5;
  }, [muscle, equipment, category, level]);

  const scrollTo = (index) => {
    const clamped = Math.max(0, Math.min(index, maxUnlockedSection));
    const h = containerRef.current?.clientHeight || window.innerHeight;
    containerRef.current?.scrollTo({ top: clamped * h, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!containerRef.current) return;

    const h = containerRef.current.clientHeight;
    const rawIndex = Math.round(containerRef.current.scrollTop / h);
    const boundedIndex = Math.min(rawIndex, maxUnlockedSection);

    if (rawIndex > maxUnlockedSection) {
      containerRef.current.scrollTo({
        top: maxUnlockedSection * h,
        behavior: "auto",
      });
      setActiveSection(maxUnlockedSection);
      return;
    }

    setActiveSection(boundedIndex);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const h = containerRef.current.clientHeight;
    const currentIndex = Math.round(containerRef.current.scrollTop / h);
    if (currentIndex > maxUnlockedSection) {
      containerRef.current.scrollTo({
        top: maxUnlockedSection * h,
        behavior: "smooth",
      });
      setActiveSection(maxUnlockedSection);
    }
  }, [maxUnlockedSection]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const canScrollInner = (target, deltaY) => {
      const scrollable = target.closest(".section-scroll");
      if (!scrollable) return false;

      const { scrollTop, scrollHeight, clientHeight } = scrollable;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

      if (deltaY > 0 && !atBottom) return true;
      if (deltaY < 0 && !atTop) return true;
      return false;
    };

    const onWheel = (e) => {
      if (canScrollInner(e.target, e.deltaY)) return;

      const goingDown = e.deltaY > 0;
      const goingUp = e.deltaY < 0;

      if (goingDown && activeSection >= maxUnlockedSection) {
        e.preventDefault();
        return;
      }

      if (goingUp && activeSection <= 0) {
        e.preventDefault();
      }
    };

    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      const scrollable = e.target.closest(".section-scroll");
      if (scrollable) return;

      if (touchStartY.current == null) return;
      const currentY = e.touches[0].clientY;
      const delta = touchStartY.current - currentY;
      const goingDown = delta > 0.5;

      if (goingDown && activeSection >= maxUnlockedSection) {
        e.preventDefault();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [activeSection, maxUnlockedSection]);

  const toggleRoutine = (ex) => {
    setRoutine((prev) =>
      prev.some((item) => item.id === ex.id)
        ? prev.filter((item) => item.id !== ex.id)
        : [...prev, ex],
    );
  };

  const resetWizard = () => {
    setMuscle(null);
    setEquipment(null);
    setCategory(null);
    setLevel(null);
    setActiveIndex(0);
    scrollTo(0);
  };

  const exportRoutineCSV = () => {
    if (!routine.length) return;

    const rows = [
      ["Name", "Equipment", "Category", "Difficulty", "Primary Muscles"],
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
    link.setAttribute("download", "notrainer-routine.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const breadcrumbText = [muscle, equipment, category, level]
    .filter(Boolean)
    .join(" > ");

  return (
    <div
      className="relative w-full overflow-hidden bg-[#04114F] text-white"
      style={{ height: theme.heights.fullPage }}
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

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .wizard-panel {
          height: ${theme.heights.fullPage};
          min-height: ${theme.heights.fullPage};
          scroll-snap-align: start;
          overflow: hidden;
        }
      `}</style>

      <div className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-20 bg-gradient-to-b from-[#04114F] via-[#04114F]/90 to-transparent" />

      <div className="fixed left-0 right-0 top-14 z-[80] px-3 md:top-16 md:px-6">
        <div className="mx-auto flex max-w-7xl items-start justify-end gap-3">
          <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2">
            <button
              onClick={() => setIsRoutineModalOpen(true)}
              className="flex items-center gap-2 bg-[#22FFD1] px-4 py-3 text-[11px] font-black tracking-[0.16em] text-[#04114F] transition-all hover:bg-[#54FFDC] md:px-5"
            >
              <LayoutList size={16} />
              Routine ({routine.length})
            </button>

            {breadcrumbText && (
              <div className="hidden items-center bg-[#1B43C4] px-4 py-3 text-[11px] font-semibold text-white xl:flex">
                <span className="capitalize">{breadcrumbText}</span>
              </div>
            )}

            {activeSection > 0 && (
              <button
                onClick={resetWizard}
                className="flex items-center gap-2 border border-[#22FFD1]/30 bg-[#16359E] px-4 py-3 text-[11px] font-black tracking-[0.16em] text-white transition-all hover:border-[#22FFD1] hover:bg-[#1B43C4] md:px-5"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {highlightedMuscle && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, x: mousePos.x + 18, y: mousePos.y - 28 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-[100] hidden bg-[#22FFD1] px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#04114F] shadow-xl md:block"
          >
            {highlightedMuscle}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
        className="no-scrollbar h-full w-full snap-y snap-mandatory overflow-y-auto scroll-smooth"
      >
        {/* HERO */}
        <section className="wizard-panel relative flex items-center justify-center bg-[#04114F] px-4">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] bg-[#0A2A9B] blur-[130px]" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[320px] w-[320px] bg-[#22FFD1] opacity-25 blur-[120px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
          >
            <h1 className="text-5xl font-black uppercase tracking-tighter text-white sm:text-6xl md:text-8xl">
              Workout <span className="text-[#22FFD1]">Wizard</span>
            </h1>

            <div className="mt-4 h-1.5 w-20 bg-[#22FFD1]" />

            <p className="mt-6 max-w-xl text-sm font-semibold text-[#D7E3FF] sm:text-base md:text-lg">
              Choose your target and get matching workouts
            </p>
          </motion.div>

          <button
            onClick={() => scrollTo(1)}
            className="absolute bottom-6 flex flex-col items-center gap-2 text-[#22FFD1] transition-colors hover:text-white md:bottom-8"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.2em] md:text-xs">
              Start
            </span>
            <ChevronDown size={28} className="animate-bounce" />
          </button>
        </section>

        {/* MUSCLE */}
        <section className="wizard-panel relative bg-[#0A2A9B] px-4 pt-20 pb-4 md:px-6 md:pt-24">
          <div className="absolute inset-0 bg-[#0A2A9B]" />
          <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 bg-[#22FFD1] opacity-10 blur-[140px]" />

          <div className="relative z-10 flex h-full flex-col overflow-hidden">
            <SectionHeading
              step="STEP 1"
              title={
                <>
                  Select a <span className="text-[#22FFD1]">Muscle</span>
                </>
              }
            />

            <div className="mb-3 flex justify-center gap-3">
              {["front", "back"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`min-w-[120px] px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] transition-all md:text-xs ${
                    view === v
                      ? "bg-[#22FFD1] text-[#04114F]"
                      : "border border-white/15 bg-[#1B43C4] text-white hover:border-[#22FFD1]"
                  }`}
                >
                  {v} view
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="anatomy-svg-wrapper flex h-full w-full items-center justify-center overflow-hidden">
                <div className="flex h-full w-full items-center justify-center scale-[0.94] sm:scale-[0.98] md:scale-[1.04]">
                  {view === "front" ? (
                    <FrontView
                      onSelect={(selected) => {
                        setMuscle(selected);
                        setEquipment(null);
                        setCategory(null);
                        setLevel(null);
                        setTimeout(() => scrollTo(2), 150);
                      }}
                      selectedMuscle={muscle}
                      onHover={setHighlightedMuscle}
                      onLeave={() => setHighlightedMuscle(null)}
                    />
                  ) : (
                    <BackView
                      onSelect={(selected) => {
                        setMuscle(selected);
                        setEquipment(null);
                        setCategory(null);
                        setLevel(null);
                        setTimeout(() => scrollTo(2), 150);
                      }}
                      selectedMuscle={muscle}
                      onHover={setHighlightedMuscle}
                      onLeave={() => setHighlightedMuscle(null)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EQUIPMENT */}
        <section
          className={`wizard-panel relative bg-[#04114F] px-4 pt-20 pb-4 transition-opacity duration-500 md:px-6 md:pt-24 ${
            muscle ? "opacity-100" : "pointer-events-none opacity-30"
          }`}
        >
          <div className="absolute inset-0 bg-[#04114F]" />
          <div className="absolute left-0 top-0 h-[380px] w-[700px] bg-[#1B43C4] opacity-70 blur-[150px]" />

          <div className="relative z-10 flex h-full flex-col overflow-hidden">
            <SectionHeading
              step="STEP 2"
              title={
                <>
                  Select <span className="text-[#22FFD1]">Equipment</span>
                </>
              }
            />

            <div className="section-scroll no-scrollbar flex-1 overflow-y-auto pr-1">
              <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 md:grid-cols-2">
                {availableEquipment.map((item) => {
                  const isActive = equipment === item;

                  return (
                    <SelectionCard
                      key={item}
                      title={item}
                      count={`${equipmentCounts[item]} exercises`}
                      active={isActive}
                      onClick={() => {
                        setEquipment(item);
                        setCategory(null);
                        setLevel(null);
                        setTimeout(() => scrollTo(3), 150);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY */}
        <section
          className={`wizard-panel relative bg-[#0A2A9B] px-4 pt-20 pb-4 transition-opacity duration-500 md:px-6 md:pt-24 ${
            equipment ? "opacity-100" : "pointer-events-none opacity-30"
          }`}
        >
          <div className="absolute inset-0 bg-[#0A2A9B]" />
          <div className="absolute left-1/2 top-0 h-[380px] w-[800px] -translate-x-1/2 bg-[#22FFD1] opacity-10 blur-[150px]" />

          <div className="relative z-10 flex h-full flex-col overflow-hidden">
            <SectionHeading
              step="STEP 3"
              title={
                <>
                  Select <span className="text-[#22FFD1]">Category</span>
                </>
              }
            />

            <div className="section-scroll no-scrollbar flex-1 overflow-y-auto pr-1">
              <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 md:grid-cols-2">
                {availableCategories.map((cat) => (
                  <SelectionCard
                    key={cat}
                    title={cat}
                    count={`${categoryCounts[cat]}`}
                    active={category === cat}
                    onClick={() => {
                      setCategory(cat);
                      setLevel(null);
                      setTimeout(() => scrollTo(4), 150);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* DIFFICULTY */}
        <section
          className={`wizard-panel relative bg-[#04114F] px-4 pt-20 pb-4 transition-opacity duration-500 md:px-6 md:pt-24 ${
            category ? "opacity-100" : "pointer-events-none opacity-30"
          }`}
        >
          <div className="absolute inset-0 bg-[#04114F]" />
          <div className="absolute right-0 top-0 h-[340px] w-[700px] bg-[#1B43C4] opacity-70 blur-[150px]" />

          <div className="relative z-10 flex h-full flex-col overflow-hidden">
            <SectionHeading
              step="STEP 4"
              title={
                <>
                  Select <span className="text-[#22FFD1]">Difficulty</span>
                </>
              }
            />

            <div className="section-scroll no-scrollbar flex-1 overflow-y-auto pr-1">
              <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 md:grid-cols-2">
                {availableLevels.map((lvl) => (
                  <SelectionCard
                    key={lvl}
                    title={lvl}
                    count={`${levelCounts[lvl]}`}
                    active={level === lvl}
                    onClick={() => {
                      setLevel(lvl);
                      setTimeout(() => scrollTo(5), 150);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* EXERCISES */}
        <section
          className={`wizard-panel relative bg-[#04114F] transition-opacity duration-500 ${
            level ? "opacity-100" : "pointer-events-none opacity-40"
          }`}
        >
          <div className="absolute inset-0 bg-[#04114F]" />
          <div className="absolute bottom-0 right-0 h-[340px] w-[700px] bg-[#1B43C4] opacity-70 blur-[150px]" />

          <div className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden pt-16 md:pt-20">
            <div className="shrink-0 border-b border-white/10 bg-[#04114F] px-4 py-5 md:px-8 md:py-6">
              <div className="flex flex-col items-center justify-center text-center">
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-5xl">
                  {finalExercises.length} workouts found
                </h2>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              <div className="section-scroll no-scrollbar h-full overflow-y-auto px-3 py-3 md:px-6 md:py-5">
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 lg:grid-cols-2">
                  {finalExercises.map((ex, idx) => {
                    const added = routine.some((r) => r.id === ex.id);

                    return (
                      <button
                        key={ex.id}
                        onClick={() => {
                          setActiveIndex(idx);
                          setIsModalOpen(true);
                        }}
                        className="border border-[#6D8DFF]/30 bg-[#1B43C4] p-5 text-left transition-all hover:border-[#22FFD1] hover:bg-[#2550E0]"
                      >
                        <div className="flex h-full flex-col gap-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-[#22FFD1]">
                                {(idx + 1).toString().padStart(2, "0")}
                              </div>
                              <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-white">
                                {ex.name}
                              </h3>
                            </div>

                            {added && (
                              <span className="shrink-0 bg-[#22FFD1] px-3 py-1 text-[10px] font-semibold text-[#04114F]">
                                Added
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {ex.equipment && (
                              <CleanTag>{ex.equipment}</CleanTag>
                            )}
                            {ex.category && <CleanTag>{ex.category}</CleanTag>}
                            {ex.level && <CleanTag accent>{ex.level}</CleanTag>}
                          </div>

                          <div className="mt-auto border-t border-white/10 pt-3">
                            <span className="text-sm font-medium text-slate-100">
                              View exercise
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {isModalOpen && currentPreview && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#04114F]/90 p-3 backdrop-blur-sm md:p-6">
              <div className="relative flex h-[92dvh] w-full max-w-6xl flex-col overflow-hidden border border-white/10 bg-[#04114F] md:h-[88dvh] md:flex-row">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center border border-white/10 bg-[#1B43C4] text-white transition-all hover:border-[#22FFD1] hover:text-[#22FFD1]"
                >
                  <X size={18} />
                </button>

                <div className="flex h-[38%] w-full items-center justify-center border-b border-white/10 bg-[#0A2A9B] p-4 md:h-full md:w-1/2 md:border-b-0 md:border-r md:p-8">
                  <div className="relative flex h-full w-full max-w-md items-center justify-center">
                    <RotatingImage
                      images={currentPreview.images}
                      name={currentPreview.name}
                    />
                  </div>
                </div>

                <div className="flex h-[62%] w-full flex-col bg-[#04114F] md:h-full md:w-1/2">
                  <div className="shrink-0 border-b border-white/10 px-5 py-5 pr-16 md:px-8 md:py-6">
                    <h3 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                      {currentPreview.name}
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {currentPreview.equipment && (
                        <CleanTag>{currentPreview.equipment}</CleanTag>
                      )}
                      {currentPreview.category && (
                        <CleanTag>{currentPreview.category}</CleanTag>
                      )}
                      {currentPreview.level && (
                        <CleanTag accent>{currentPreview.level}</CleanTag>
                      )}
                    </div>
                  </div>

                  <div className="section-scroll no-scrollbar flex-1 overflow-y-auto px-5 py-5 md:px-8 md:py-6">
                    <div>
                      <p className="mb-3 text-[11px] font-semibold text-[#22FFD1]">
                        Primary muscles
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {currentPreview.primaryMuscles?.map((m) => (
                          <span
                            key={m}
                            className="border border-[#6D8DFF]/30 bg-[#1B43C4] px-3 py-2 text-[11px] font-medium capitalize text-white"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8">
                      <p className="mb-4 text-[11px] font-semibold text-[#22FFD1]">
                        Instructions
                      </p>
                      <div className="space-y-4">
                        {currentPreview.instructions?.map((step, i) => (
                          <div key={i} className="flex gap-3 md:gap-4">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#22FFD1] text-[11px] font-semibold text-[#04114F] md:h-8 md:w-8">
                              {i + 1}
                            </span>
                            <p className="pt-0.5 text-sm leading-relaxed text-slate-200 md:text-[15px]">
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 border-t border-white/10 bg-[#04114F] p-5 md:p-6">
                    <button
                      onClick={() => toggleRoutine(currentPreview)}
                      className={`w-full py-4 text-sm font-semibold transition-all ${
                        routine.some((r) => r.id === currentPreview.id)
                          ? "border border-red-400 bg-transparent text-red-400 hover:bg-red-500/10"
                          : "bg-[#22FFD1] text-[#04114F] hover:bg-[#54FFDC]"
                      }`}
                    >
                      {routine.some((r) => r.id === currentPreview.id)
                        ? "Remove from routine"
                        : "Add to routine"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {isRoutineModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] flex items-center justify-center bg-[#04114F]/95 p-3 backdrop-blur-sm md:p-6"
          >
            <div className="flex h-[90dvh] w-full max-w-2xl flex-col border border-white/10 bg-[#04114F] md:h-[80dvh]">
              <div className="flex items-center justify-between border-b border-white/10 bg-[#0A2A9B] px-5 py-5 md:px-8">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
                    My <span className="text-[#22FFD1]">Routine</span>
                  </h2>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                  <button
                    onClick={() => setRoutine([])}
                    className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400 transition-colors hover:text-white md:text-xs"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setIsRoutineModalOpen(false)}
                    className="flex h-10 w-10 items-center justify-center bg-[#22FFD1] text-[#04114F]"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="section-scroll no-scrollbar flex-1 overflow-y-auto bg-[#04114F] p-4 md:p-6">
                {routine.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-300 md:text-base">
                      No routine items yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {routine.map((ex) => (
                      <div
                        key={ex.id}
                        className="flex items-center justify-between border border-[#6D8DFF]/30 bg-[#1B43C4] p-4 md:p-5"
                      >
                        <div className="min-w-0">
                          <span className="block truncate text-sm font-black uppercase tracking-tight text-white md:text-base">
                            {ex.name}
                          </span>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {ex.equipment && (
                              <CleanTag>{ex.equipment}</CleanTag>
                            )}
                            {ex.category && <CleanTag>{ex.category}</CleanTag>}
                            {ex.level && <CleanTag accent>{ex.level}</CleanTag>}
                          </div>
                        </div>

                        <button
                          onClick={() => toggleRoutine(ex)}
                          className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center border border-red-400 text-red-400 transition-all hover:bg-red-500/10"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 bg-[#04114F] p-4 md:p-6">
                <button
                  onClick={exportRoutineCSV}
                  className="flex w-full items-center justify-center gap-2 bg-[#22FFD1] py-4 text-[11px] font-black uppercase tracking-[0.2em] text-[#04114F] transition-all hover:bg-[#54FFDC] md:text-xs"
                >
                  <Download size={16} />
                  Export routine (.csv)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
