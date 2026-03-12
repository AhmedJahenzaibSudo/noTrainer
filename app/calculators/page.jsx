"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  RotateCcw,
  Coffee,
  Dumbbell,
  Zap,
  Trophy,
  Footprints,
  TrendingUp,
  TrendingDown,
  Shield,
  Mars,
  Venus,
  Droplets,
  GlassWater,
  Download,
  CheckCircle2,
  BatteryMedium,
  Activity,
  Beef,
  Wheat,
  Target,
  Scale,
} from "lucide-react";

const config = {
  colors: {
    bgPrimary: "#051061",
    bgDark: "#091d5bff",
    accent: "#1AF0BE",
    textPrimary: "#ffffff",
  },
};

const SECTION_HEIGHT = "h-[calc(100vh-2.5rem)] md:h-[calc(100vh-3rem)]";

const ACTIVITY_LEVELS = [
  {
    label: "Sedentary",
    desc: "Desk job, little movement",
    val: 1.2,
    icon: Coffee,
  },
  {
    label: "Light",
    desc: "Light walks, 1–3×/week",
    val: 1.375,
    icon: Footprints,
  },
  {
    label: "Moderate",
    desc: "Regular gym, 3–5×/week",
    val: 1.55,
    icon: Dumbbell,
  },
  { label: "Active", desc: "Hard training, 6–7×/week", val: 1.725, icon: Zap },
  {
    label: "Athlete",
    desc: "Physical job + daily sport",
    val: 1.9,
    icon: Trophy,
  },
];

const GOALS = [
  { label: "Lose Weight", val: -500, icon: TrendingDown },
  { label: "Maintain", val: 0, icon: Shield },
  { label: "Build Muscle", val: 500, icon: TrendingUp },
];

const BMI_CATEGORIES = [
  { label: "Underweight", min: 0, max: 18.5, color: "#38bdf8" },
  { label: "Healthy", min: 18.5, max: 25, color: "#1AF0BE" },
  { label: "Overweight", min: 25, max: 30, color: "#fbbf24" },
  { label: "Obese", min: 30, max: 1000, color: "#f87171" },
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
function parseNum(raw, mode = "float") {
  if (raw === "") return "";
  const v = mode === "int" ? parseInt(raw, 10) : parseFloat(raw);
  return Number.isFinite(v) ? v : "";
}

function useCountUp(target, duration = 900, trigger = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger || target === 0) {
      setValue(target);
      return;
    }
    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * e));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, trigger, duration]);
  return value;
}

function CountDisplay({
  value,
  trigger,
  duration = 900,
  isFloat = false,
  className = "",
  color = "white",
}) {
  const num = isFloat ? parseFloat(value) : parseInt(value, 10);
  const counted = useCountUp(num, duration, trigger);
  return (
    <span className={className} style={{ color }}>
      {isFloat ? counted.toFixed(1) : counted}
    </span>
  );
}

function BMIRangeBar({ bmi }) {
  const min = 12,
    max = 40;
  const pos = ((clamp(bmi, min, max) - min) / (max - min)) * 100;
  return (
    <div className="w-full mt-5">
      <div
        className="relative h-5 rounded-xl overflow-hidden"
        style={{ background: "rgba(0,0,0,0.35)" }}
      >
        <div className="absolute inset-0 flex">
          <div className="w-[23%]" style={{ background: "#38bdf8" }} />
          <div className="w-[23%]" style={{ background: "#1AF0BE" }} />
          <div className="w-[12%]" style={{ background: "#fbbf24" }} />
          <div className="flex-1" style={{ background: "#f87171" }} />
        </div>
        <motion.div
          className="absolute top-1 bottom-1 w-2 rounded-full z-10"
          initial={{ left: "0%" }}
          animate={{ left: `calc(${pos}% - 4px)` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          style={{
            background: "white",
            boxShadow: "0 0 10px rgba(255,255,255,0.9)",
          }}
        />
      </div>
      <div className="grid grid-cols-4 gap-1.5 mt-3">
        {BMI_CATEGORIES.map((c) => {
          const active = bmi >= c.min && bmi < c.max;
          return (
            <div
              key={c.label}
              className="py-2 text-center rounded-xl text-[10px] md:text-xs font-black uppercase transition-all"
              style={{
                background: active ? c.color : `${c.color}12`,
                color: active ? "#020a21" : c.color,
                border: `1.5px solid ${active ? c.color : c.color + "30"}`,
              }}
            >
              {c.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FilledGlass() {
  return (
    <GlassWater
      size={26}
      strokeWidth={1.5}
      style={{ color: config.colors.accent }}
    />
  );
}

function SectionHeader({ title, accent, sub }) {
  return (
    <div className="text-center mb-6 md:mb-8">
      <h2 className="font-hero text-3xl md:text-5xl font-black uppercase leading-tight tracking-tight">
        {title} <span style={{ color: config.colors.accent }}>{accent}</span>
      </h2>
      <p className="text-sm md:text-base text-slate-300 mt-2.5 font-medium max-w-lg mx-auto leading-relaxed">
        {sub}
      </p>
    </div>
  );
}

function ResultSection({ id, children, sectionRefs }) {
  return (
    <section
      data-section={id}
      ref={(el) => {
        if (el) sectionRefs.current[id] = el;
      }}
      className={`min-h-full w-full snap-start flex flex-col items-center justify-center px-5 md:px-8 ${SECTION_HEIGHT}`}
      style={{ backgroundColor: config.colors.bgDark }}
    >
      {children}
    </section>
  );
}

const INITIAL_INPUTS = {
  gender: "",
  age: "",
  weight: "",
  feet: "",
  inches: "",
  activity: "",
  goal: "",
};

export default function HealthCalculators() {
  const scrollContainerRef = useRef(null);
  const ageRef = useRef(null);
  const weightRef = useRef(null);
  const feetRef = useRef(null);
  const inchesRef = useRef(null);
  const sectionRefs = useRef({});

  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState(INITIAL_INPUTS);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});

  const noSpinner =
    "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  const inputStyle = useMemo(
    () =>
      `w-full bg-transparent text-center text-5xl md:text-7xl font-black outline-none border-b-4 transition-all py-3 placeholder:text-slate-800 ${noSpinner}`,
    [noSpinner],
  );

  const scrollToPage = (i) => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollTo({
      top: scrollContainerRef.current.clientHeight * i,
      behavior: "smooth",
    });
  };

  const resetAll = () => {
    setResults(null);
    setStep(0);
    setInputs(INITIAL_INPUTS);
    setShowResults(false);
    setVisibleSections({});
    scrollToPage(0);
  };

  useEffect(() => {
    if (!results) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting)
            setVisibleSections((p) => ({
              ...p,
              [e.target.dataset.section]: true,
            }));
        }),
      { threshold: 0.4 },
    );
    Object.values(sectionRefs.current).forEach(
      (el) => el && observer.observe(el),
    );
    return () => observer.disconnect();
  }, [results]);

  const canNext = useMemo(() => {
    if (step === 0) return inputs.gender !== "";
    if (step === 1) return inputs.age >= 5 && inputs.age <= 120;
    if (step === 2) return inputs.weight >= 20 && inputs.weight <= 400;
    if (step === 3) {
      const t = (inputs.feet || 0) * 12 + (inputs.inches || 0);
      return inputs.feet !== "" && t >= 36 && t <= 96;
    }
    if (step === 4) return inputs.activity !== "";
    if (step === 5) return inputs.goal !== "";
    return false;
  }, [step, inputs]);

  const setAgeInputRef = useCallback(
    (n) => {
      ageRef.current = n;
      if (n && step === 1) n.focus({ preventScroll: true });
    },
    [step],
  );
  const setWeightInputRef = useCallback(
    (n) => {
      weightRef.current = n;
      if (n && step === 2) n.focus({ preventScroll: true });
    },
    [step],
  );
  const setFeetInputRef = useCallback(
    (n) => {
      feetRef.current = n;
      if (n && step === 3) n.focus({ preventScroll: true });
    },
    [step],
  );
  const setInchesInputRef = useCallback((n) => {
    inchesRef.current = n;
  }, []);

  const goalLabel =
    inputs.goal === 0
      ? "Maintain Weight"
      : inputs.goal > 0
        ? "Build Muscle"
        : "Lose Weight";

  const calculate = () => {
    const feet = inputs.feet,
      inches = inputs.inches === "" ? 0 : inputs.inches;
    const totalInches = feet * 12 + inches;
    const heightM = totalInches * 0.0254,
      heightCm = heightM * 100;
    const { weight: wkg, age } = inputs;

    const bmi = Number((wkg / heightM ** 2).toFixed(1));
    const cat =
      BMI_CATEGORIES.find((c) => bmi >= c.min && bmi < c.max) ||
      BMI_CATEGORIES[3];
    const bmr = Math.round(
      10 * wkg +
        6.25 * heightCm -
        5 * age +
        (inputs.gender === "male" ? 5 : -161),
    );
    const tdee = Math.round(bmr * inputs.activity);
    const targetCalories = Math.max(1200, tdee + inputs.goal);

    const ibw = clamp(
      (inputs.gender === "male" ? 50 : 45.5) + 2.3 * (totalInches - 60),
      30,
      250,
    );
    const idealRangeMin = Number((ibw * 0.9).toFixed(1));
    const idealRangeMax = Number((ibw * 1.1).toFixed(1));
    const mid = (idealRangeMin + idealRangeMax) / 2;
    const targetWeight =
      wkg > idealRangeMax
        ? idealRangeMax
        : wkg < idealRangeMin
          ? idealRangeMin
          : mid;
    const diffToTarget = Number((wkg - targetWeight).toFixed(1));

    const protein = Math.round((targetCalories * 0.3) / 4);
    const carbs = Math.round((targetCalories * 0.4) / 4);
    const fat = Math.round((targetCalories * 0.3) / 9);
    const waterL = Number((wkg * 0.035).toFixed(1));
    const glasses = Math.max(1, Math.round(waterL / 0.25));

    setResults({
      bmi,
      cat,
      bmr,
      tdee,
      targetCalories,
      protein,
      carbs,
      fat,
      waterL,
      glasses,
      idealRangeMin,
      idealRangeMax,
      targetWeight: Number(targetWeight.toFixed(1)),
      diffToTarget,
    });
    setShowResults(true);
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToPage(2)));
  };

  const onEnter = (e) => {
    if (e.key !== "Enter") return;
    if (step === 3 && e.target === feetRef.current) {
      inchesRef.current?.focus({ preventScroll: true });
      return;
    }
    if (step < 5 && canNext) {
      setStep((s) => s + 1);
      return;
    }
    if (step === 5 && canNext) calculate();
  };

  const goalSentence = useMemo(() => {
    if (!results) return { text: "", color: "#1AF0BE" };
    const d = results.diffToTarget;
    if (Math.abs(d) < 0.6)
      return {
        text: "You're already in a healthy weight range.",
        color: "#1AF0BE",
      };
    if (d > 0)
      return {
        text: `Lose ${Math.abs(d).toFixed(1)} kg to reach your healthy range.`,
        color: "#f87171",
      };
    return {
      text: `Gain ${Math.abs(d).toFixed(1)} kg to reach your healthy range.`,
      color: "#38bdf8",
    };
  }, [results]);

  const downloadReport = () => {
    if (!results) return;
    const actObj = ACTIVITY_LEVELS.find((a) => a.val === inputs.activity);
    const blob = new Blob(
      [
        `HEALTH REPORT\n${new Date().toLocaleDateString()}\n${"─".repeat(40)}\nGender: ${inputs.gender} | Age: ${inputs.age} | Weight: ${inputs.weight}kg | Height: ${inputs.feet}'${inputs.inches || 0}"\nActivity: ${actObj?.label} | Goal: ${goalLabel}\n${"─".repeat(40)}\nBMI: ${results.bmi} (${results.cat.label})\nIBW: ${results.idealRangeMin}–${results.idealRangeMax} kg\nBMR: ${results.bmr} kcal | TDEE: ${results.tdee} kcal\nTarget: ${results.targetCalories} kcal\nProtein: ${results.protein}g | Carbs: ${results.carbs}g | Fat: ${results.fat}g\nHydration: ${results.waterL} L`,
      ],
      { type: "text/plain" },
    );
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: `Health_Report_${new Date().toISOString().slice(0, 10)}.txt`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Selectable card style — hover handled via CSS class
  const cardStyle = (active, color = config.colors.accent) => ({
    background: active ? color : "#0c1a30",
    borderColor: active ? color : `${color}2e`,
    color: active ? "#020a21" : "rgba(255,255,255,0.55)",
    boxShadow: active ? `0 0 26px ${color}30` : "none",
    transition: "all 0.17s ease",
  });

  return (
    <div
      className="text-white overflow-hidden selection:bg-[#1AF0BE]/30"
      style={{ backgroundColor: config.colors.bgDark }}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800&family=Krona+One&display=swap");

        body {
          font-family: "Outfit", sans-serif;
        }
        .font-hero {
          font-family: "Krona One", sans-serif;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
        .sel:hover:not(.sel-on) {
          background: rgba(26, 240, 190, 0.38) !important;
          border-color: rgba(49, 223, 182, 0.89) !important;
          color: rgba(255, 255, 255, 0.85) !important;
          box-shadow: 0 0 18px rgba(16, 225, 177, 0.88) !important;
        }
      `}</style>

      <div
        ref={scrollContainerRef}
        className={`${SECTION_HEIGHT} overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth`}
      >
        {/* ═══════ HERO ═══════ */}
        <section
          className={`min-h-full w-full snap-start relative flex flex-col items-center justify-center ${SECTION_HEIGHT}`}
          style={{
            backgroundColor: config.colors.bgDark,
            backgroundImage: `radial-gradient(ellipse at 50% 58%, ${config.colors.bgPrimary}, transparent 68%)`,
          }}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[52vw] h-[52vw] max-w-[520px] blur-[120px] rounded-full pointer-events-none opacity-20"
            style={{ backgroundColor: config.colors.accent }}
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl relative z-10 px-6"
          >
            <h1 className="font-hero text-5xl md:text-7xl font-black uppercase tracking-tight leading-none mb-5">
              Health{" "}
              <span style={{ color: config.colors.accent }}>Calculators</span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg font-medium mb-9 max-w-md mx-auto leading-relaxed">
              Know your numbers. Understand what your body actually needs.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {["BMI", "BMR", "TDEE", "IBW", "Macros", "Hydration"].map(
                (t, i) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.07 }}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg"
                    style={{
                      border: `1.5px solid ${config.colors.accent}40`,
                      color: config.colors.accent,
                      background: `${config.colors.accent}0c`,
                    }}
                  >
                    {t}
                  </motion.span>
                ),
              )}
            </div>
            <motion.button
              onClick={() => scrollToPage(1)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-14 py-4 font-black uppercase text-base md:text-lg tracking-wider rounded-2xl"
              style={{
                backgroundColor: config.colors.accent,
                color: config.colors.bgDark,
                boxShadow: `0 0 40px ${config.colors.accent}40`,
              }}
            >
              Get Started
            </motion.button>
          </motion.div>
        </section>

        {/* ═══════ INPUTS ═══════ */}
        <section
          className={`min-h-full w-full snap-start relative flex flex-col items-center justify-center px-5 md:px-8 ${SECTION_HEIGHT}`}
          style={{ backgroundColor: config.colors.bgDark }}
        >
          {/* Step indicator — top center */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === step ? 22 : 8,
                  height: 8,
                  background:
                    i <= step ? config.colors.accent : "rgba(255,255,255,0.1)",
                }}
              />
            ))}
          </div>

          {/* Nav — bottom center, bigger */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
            <button
              onClick={() => step > 0 && setStep((s) => s - 1)}
              disabled={step === 0}
              className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border-2 rounded-2xl transition-all disabled:opacity-20 hover:bg-white/5"
              style={{
                borderColor: config.colors.accent + "55",
                color: config.colors.accent,
              }}
            >
              <ArrowLeft size={22} strokeWidth={2.5} />
            </button>
            <button
              onClick={resetAll}
              className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border-2 rounded-2xl transition-all hover:bg-red-500/10"
              style={{ borderColor: "#f87171" + "55", color: "#f87171" }}
            >
              <RotateCcw size={20} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => canNext && step < 5 && setStep((s) => s + 1)}
              disabled={!canNext || step >= 5}
              className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border-2 rounded-2xl transition-all disabled:opacity-20"
              style={{
                background:
                  canNext && step < 5 ? config.colors.accent : "transparent",
                color:
                  canNext && step < 5
                    ? config.colors.bgDark
                    : "rgba(255,255,255,0.2)",
                borderColor:
                  canNext && step < 5
                    ? config.colors.accent
                    : "rgba(255,255,255,0.1)",
              }}
            >
              <ArrowRight size={22} strokeWidth={2.5} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="gender"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.22 }}
                className="w-full max-w-md"
              >
                <p className="font-hero text-2xl md:text-3xl font-black uppercase text-center mb-8">
                  Select{" "}
                  <span style={{ color: config.colors.accent }}>Gender</span>
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {["male", "female"].map((g) => {
                    const active = inputs.gender === g;
                    return (
                      <button
                        key={g}
                        onClick={() => setInputs((p) => ({ ...p, gender: g }))}
                        className={`py-10 md:py-14 border-2 flex flex-col items-center gap-4 rounded-2xl font-black uppercase text-lg sel ${active ? "sel-on" : ""}`}
                        style={cardStyle(active)}
                      >
                        {g === "male" ? (
                          <Mars size={44} strokeWidth={1.5} />
                        ) : (
                          <Venus size={44} strokeWidth={1.5} />
                        )}
                        {g}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="age"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.22 }}
                className="w-full max-w-sm text-center"
              >
                <p className="font-hero text-2xl md:text-3xl font-black uppercase mb-8">
                  Your <span style={{ color: config.colors.accent }}>Age</span>
                </p>
                <input
                  ref={setAgeInputRef}
                  type="number"
                  inputMode="numeric"
                  value={inputs.age === "" ? "" : String(inputs.age)}
                  onKeyDown={onEnter}
                  onChange={(e) =>
                    setInputs((p) => ({
                      ...p,
                      age: parseNum(e.target.value, "int"),
                    }))
                  }
                  className={inputStyle}
                  style={{ borderColor: config.colors.accent, color: "white" }}
                  placeholder="0"
                />
                <p className="text-slate-400 font-semibold mt-4 text-sm uppercase tracking-widest">
                  Years old
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="weight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.22 }}
                className="w-full max-w-sm text-center"
              >
                <p className="font-hero text-2xl md:text-3xl font-black uppercase mb-8">
                  Your{" "}
                  <span style={{ color: config.colors.accent }}>Weight</span>
                </p>
                <input
                  ref={setWeightInputRef}
                  type="number"
                  inputMode="decimal"
                  value={inputs.weight === "" ? "" : String(inputs.weight)}
                  onKeyDown={onEnter}
                  onChange={(e) =>
                    setInputs((p) => ({
                      ...p,
                      weight: parseNum(e.target.value, "float"),
                    }))
                  }
                  className={inputStyle}
                  style={{ borderColor: config.colors.accent, color: "white" }}
                  placeholder="0"
                />
                <p className="text-slate-400 font-semibold mt-4 text-sm uppercase tracking-widest">
                  Kilograms
                </p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="height"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.22 }}
                className="w-full max-w-sm text-center"
              >
                <p className="font-hero text-2xl md:text-3xl font-black uppercase mb-8">
                  Your{" "}
                  <span style={{ color: config.colors.accent }}>Height</span>
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    {
                      label: "Feet",
                      ref: setFeetInputRef,
                      val: inputs.feet,
                      key: "feet",
                      mode: "int",
                      ph: "5",
                    },
                    {
                      label: "Inches",
                      ref: setInchesInputRef,
                      val: inputs.inches,
                      key: "inches",
                      mode: "int",
                      ph: "10",
                    },
                  ].map(({ label, ref, val, key, mode, ph }) => (
                    <div key={key}>
                      <p className="text-slate-400 font-semibold mb-3 text-sm uppercase tracking-widest">
                        {label}
                      </p>
                      <input
                        ref={ref}
                        type="number"
                        inputMode="numeric"
                        value={val === "" ? "" : String(val)}
                        onKeyDown={onEnter}
                        onChange={(e) =>
                          setInputs((p) => ({
                            ...p,
                            [key]: parseNum(e.target.value, mode),
                          }))
                        }
                        className={inputStyle}
                        style={{
                          borderColor: config.colors.accent,
                          color: "white",
                        }}
                        placeholder={ph}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                /* Max-width 6xl (1152px) allows cards to expand horizontally on PC */
                className="w-full max-w-6xl mx-auto pb-10 px-4"
              >
                <p className="font-hero text-2xl md:text-4xl font-black uppercase text-center mb-10">
                  Activity{" "}
                  <span style={{ color: config.colors.accent }}>Level</span>
                </p>

                {/* flex-col on mobile | flex-row on PC */}
                <div className="flex flex-col md:flex-row items-stretch justify-center gap-4">
                  {ACTIVITY_LEVELS.map((lvl) => {
                    const active = inputs.activity === lvl.val;
                    return (
                      <button
                        key={lvl.val}
                        onClick={() =>
                          setInputs((p) => ({ ...p, activity: lvl.val }))
                        }
                        /* md:py-10: Tall cards on PC 
             md:flex-1: Even distribution
             hover:-translate-y-1: Premium "lift" effect
          */
                        className={`
            group relative flex flex-row md:flex-col items-center md:justify-center
            gap-5 p-5 md:py-10 md:px-6 md:flex-1 md:min-w-0
            border-2 rounded-3xl transition-all duration-300
            text-left md:text-center
            ${
              active
                ? "border-current bg-current/5 shadow-lg"
                : "border-opacity-10 hover:border-opacity-30 hover:-translate-y-1"
            }
          `}
                        style={cardStyle(active)}
                      >
                        {/* Icon: Large and prominent on PC */}
                        <div
                          className={`
            p-3 md:p-5 rounded-2xl shrink-0 transition-transform duration-300
            ${active ? "bg-white/20 scale-110" : "bg-gray-100 dark:bg-white/5 group-hover:scale-110"}
          `}
                        >
                          <lvl.icon size={32} strokeWidth={1.5} />
                        </div>

                        <div className="flex-1 md:w-full">
                          <div className="font-black text-sm md:text-lg uppercase tracking-tight leading-tight">
                            {lvl.label}
                          </div>
                          {/* Description: Visible and clean */}
                          <div className="text-[11px] md:text-xs font-semibold opacity-60 leading-relaxed mt-2 line-clamp-2">
                            {lvl.desc}
                          </div>
                        </div>

                        {/* Indicator: Centered bottom checkmark for PC */}
                        {active && (
                          <div className="hidden md:flex absolute bottom-3 justify-center w-full">
                            <CheckCircle2 size={20} />
                          </div>
                        )}
                        {/* Standard checkmark for mobile side-view */}
                        {active && (
                          <CheckCircle2
                            size={20}
                            className="md:hidden shrink-0"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="goal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.22 }}
                className="w-full max-w-lg"
              >
                <p className="font-hero text-2xl md:text-3xl font-black uppercase text-center mb-6">
                  Primary{" "}
                  <span style={{ color: config.colors.accent }}>Goal</span>
                </p>
                <div className="flex flex-col gap-3 mb-8">
                  {GOALS.map((g) => {
                    const active = inputs.goal === g.val;
                    return (
                      <button
                        key={g.val}
                        onClick={() =>
                          setInputs((p) => ({ ...p, goal: g.val }))
                        }
                        className={`flex items-center gap-5 px-6 py-5 md:py-6 border-2 rounded-2xl text-left sel ${active ? "sel-on" : ""}`}
                        style={cardStyle(active)}
                      >
                        <g.icon size={26} strokeWidth={1.7} />
                        <span className="font-black text-lg md:text-xl uppercase flex-1">
                          {g.label}
                        </span>
                        {active && <CheckCircle2 size={20} />}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => canNext && calculate()}
                  disabled={!canNext}
                  className="w-full py-4 md:py-5 font-black uppercase text-base md:text-lg tracking-wider rounded-2xl transition-all disabled:opacity-30"
                  style={{
                    backgroundColor: config.colors.accent,
                    color: config.colors.bgDark,
                    boxShadow: canNext
                      ? `0 0 32px ${config.colors.accent}40`
                      : "none",
                  }}
                >
                  Calculate My Results →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ═══════ RESULTS ═══════ */}
        {results && (
          <>
            {/* BMI - Style: Status Card (Centered, Immediate Feedback) */}
            <ResultSection id="bmi" sectionRefs={sectionRefs}>
              <SectionHeader
                title="Body Mass"
                accent="Index"
                sub="A ratio of weight to height — a quick signal of whether you're in a healthy range."
              />
              <div className="w-full max-w-lg mx-auto">
                <div
                  className="rounded-2xl overflow-hidden text-center py-10"
                  style={{ background: results.cat.color }}
                >
                  <div className="px-8 flex flex-col items-center justify-center">
                    <p
                      className="text-xs font-black uppercase tracking-[0.25em] mb-2 opacity-80"
                      style={{ color: "#020a21" }}
                    >
                      Your Classification
                    </p>
                    <h3
                      className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4"
                      style={{ color: "#020a21" }}
                    >
                      {results.cat.label}
                    </h3>
                    <div className="flex items-end gap-2 mb-6">
                      <CountDisplay
                        value={results.bmi}
                        isFloat
                        trigger={visibleSections["bmi"]}
                        className="text-7xl md:text-8xl font-black leading-none font-hero"
                        color="#020a21"
                      />
                    </div>
                    <div className="w-16 h-1 rounded-full bg-black/10 mb-6"></div>
                    <p
                      className="text-sm md:text-base font-semibold leading-relaxed max-w-sm"
                      style={{ color: "#020a21cc" }}
                    >
                      {results.bmi < 18.5 &&
                        "Being underweight can affect your immune system and energy levels. Focus on nutrient-dense foods."}
                      {results.bmi >= 18.5 &&
                        results.bmi < 25 &&
                        "Excellent. You are in the healthy weight zone. Maintain your current lifestyle."}
                      {results.bmi >= 25 &&
                        results.bmi < 30 &&
                        "Excess weight can strain joints. Losing just 5-10% of your weight brings health benefits."}
                      {results.bmi >= 30 &&
                        "Consider consulting a healthcare provider. Small changes in diet and activity can significantly improve health markers."}
                    </p>
                  </div>
                </div>
                <BMIRangeBar bmi={results.bmi} />
              </div>
            </ResultSection>

            {/* IBW - Style: Dashboard Grid (Min, Max, Current, Goal) */}
            {/* IBW - Style: Vertical Flow Dashboard */}
            <ResultSection id="ibw" sectionRefs={sectionRefs}>
              <SectionHeader
                title="Ideal Body"
                accent="Weight"
                sub="The healthy weight range for your height and gender, based on the Devine formula."
              />
              <div className="w-full max-w-lg mx-auto">
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ background: config.colors.accent }}
                >
                  {/* Top Row: Min & Max */}
                  <div className="grid grid-cols-2 border-b border-slate-900/10">
                    <div className="p-6 text-center border-r border-slate-900/10">
                      <p
                        className="text-xs font-black uppercase tracking-widest mb-2"
                        style={{ color: "#020a2166" }}
                      >
                        Min Ideal
                      </p>
                      <p
                        className="text-4xl font-black font-hero"
                        style={{ color: "#020a21" }}
                      >
                        {Math.floor(results.idealRangeMin)}
                        <span className="text-lg font-bold ml-1">kg</span>
                      </p>
                    </div>
                    <div className="p-6 text-center">
                      <p
                        className="text-xs font-black uppercase tracking-widest mb-2"
                        style={{ color: "#020a2166" }}
                      >
                        Max Ideal
                      </p>
                      <p
                        className="text-4xl font-black font-hero"
                        style={{ color: "#020a21" }}
                      >
                        {Math.floor(results.idealRangeMax)}
                        <span className="text-lg font-bold ml-1">kg</span>
                      </p>
                    </div>
                  </div>

                  {/* Middle: Current Weight */}
                  <div className="p-6 text-center border-b border-slate-900/10">
                    <p
                      className="text-xs font-black uppercase tracking-widest mb-2"
                      style={{ color: "#020a2166" }}
                    >
                      Your Current Weight
                    </p>
                    <p
                      className="text-5xl font-black font-hero"
                      style={{ color: "#020a21" }}
                    >
                      {inputs.weight}
                      <span className="text-xl font-bold ml-1">kg</span>
                    </p>
                  </div>

                  {/* Bottom: Goal Context */}
                  <div className="p-6 text-center">
                    <p
                      className="text-sm font-bold leading-relaxed"
                      style={{ color: "#020a21" }}
                    >
                      {inputs.weight < results.idealRangeMin ? (
                        <>
                          Goal: <span className="font-black">Gain Weight</span>.
                          You are below the healthy range.
                        </>
                      ) : inputs.weight > results.idealRangeMax ? (
                        <>
                          Goal: <span className="font-black">Lose Weight</span>.
                          You are above the healthy range.
                        </>
                      ) : (
                        <>
                          Goal: <span className="font-black">Maintain</span>.
                          You are in the healthy range.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </ResultSection>

            {/* BMR - Style: Engine Card (Horizontal, Minimal) */}
            <ResultSection id="bmr" sectionRefs={sectionRefs}>
              <SectionHeader
                title="Resting"
                accent="Burn"
                sub="Calories your body burns just to stay alive — heart, lungs, brain — even while you sleep."
              />
              <div className="w-full max-w-lg mx-auto">
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ background: config.colors.accent }}
                >
                  <div className="p-8 flex items-center justify-between">
                    <div className="flex-1">
                      <p
                        className="text-xs font-black uppercase tracking-[0.25em] mb-2"
                        style={{ color: "#020a21aa" }}
                      >
                        Basal Metabolic Rate
                      </p>
                      <div className="flex items-end gap-2">
                        <CountDisplay
                          value={results.bmr}
                          trigger={visibleSections["bmr"]}
                          className="text-5xl md:text-6xl font-black leading-none font-hero"
                          color="#020a21"
                        />
                        <span
                          className="text-lg font-bold mb-1"
                          style={{ color: "#020a2166" }}
                        >
                          kcal
                        </span>
                      </div>
                      <p
                        className="mt-3 text-xs font-bold uppercase tracking-wide opacity-70"
                        style={{ color: "#020a21" }}
                      >
                        This is 60-70% of your total burn
                      </p>
                    </div>
                    <div className="pl-4 opacity-20">
                      <BatteryMedium size={48} style={{ color: "#020a21" }} />
                    </div>
                  </div>
                  <div className="px-8 pb-8">
                    <div className="bg-slate-900/10 rounded-xl p-4">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#020a21cc" }}
                      >
                        Think of this as your "Idle Engine." Even if you lay in
                        bed all day watching TV, your body burns this many
                        calories just to keep your heart beating and lungs
                        breathing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ResultSection>

            {/* TDEE - Style: Dashboard (Breakdown Focus) */}
            <ResultSection id="tdee" sectionRefs={sectionRefs}>
              <SectionHeader
                title="Total Daily"
                accent="Burn"
                sub="Everything you burn in a full day — rest plus every step, workout, and daily task."
              />
              <div className="w-full max-w-lg mx-auto">
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ background: config.colors.accent }}
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <p
                          className="text-xs font-black uppercase tracking-[0.25em] mb-2"
                          style={{ color: "#020a21aa" }}
                        >
                          Total Energy Expenditure
                        </p>
                        <div className="flex items-end gap-2">
                          <CountDisplay
                            value={results.tdee}
                            trigger={visibleSections["tdee"]}
                            className="text-5xl md:text-6xl font-black leading-none font-hero"
                            color="#020a21"
                          />
                          <span
                            className="text-lg font-bold mb-1"
                            style={{ color: "#020a2166" }}
                          >
                            kcal
                          </span>
                        </div>
                      </div>
                      <Activity size={40} style={{ color: "#020a2118" }} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {[
                        ["Resting (BMR)", results.bmr],
                        ["Movement", results.tdee - results.bmr],
                      ].map(([label, val]) => (
                        <div
                          key={label}
                          className="bg-slate-900/5 rounded-xl p-4 text-center"
                        >
                          <p
                            className="text-xs font-bold uppercase tracking-wider mb-1 opacity-60"
                            style={{ color: "#020a21" }}
                          >
                            {label}
                          </p>
                          <p
                            className="text-xl font-black font-hero"
                            style={{ color: "#020a21" }}
                          >
                            {val}
                          </p>
                        </div>
                      ))}
                    </div>

                    <p
                      className="text-xs text-center font-semibold opacity-70"
                      style={{ color: "#020a21" }}
                    >
                      This is your maintenance number. Eat this much to stay
                      exactly where you are.
                    </p>
                  </div>
                </div>
              </div>
            </ResultSection>

            {/* TARGET - Style: Prescriptive Action Plan */}
            <ResultSection id="target" sectionRefs={sectionRefs}>
              <SectionHeader
                title="Daily Calorie"
                accent="Target"
                sub={`The exact number of calories to eat every day to ${goalLabel.toLowerCase()}.`}
              />
              <div className="w-full max-w-lg mx-auto">
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ background: config.colors.accent }}
                >
                  <div className="px-8 py-8 text-center">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-slate-900/10 mb-4">
                      <span
                        className="text-xs font-black uppercase tracking-widest"
                        style={{ color: "#020a21" }}
                      >
                        {goalLabel} Goal
                      </span>
                    </div>

                    <div className="flex items-end justify-center gap-2 mb-2">
                      <CountDisplay
                        value={results.targetCalories}
                        trigger={visibleSections["target"]}
                        className="text-7xl md:text-8xl font-black leading-none font-hero"
                        color="#020a21"
                      />
                      <span
                        className="text-2xl font-bold mb-2"
                        style={{ color: "#020a2166" }}
                      >
                        kcal
                      </span>
                    </div>
                    <p
                      className="text-xs font-bold opacity-70 mb-6"
                      style={{ color: "#020a21" }}
                    >
                      DAILY ALLOWANCE
                    </p>

                    <div className="bg-slate-900/10 rounded-xl p-4 text-left">
                      <p
                        className="text-sm font-semibold leading-relaxed"
                        style={{ color: "#020a21" }}
                      >
                        {inputs.goal === 0 &&
                          "Maintenance mode. You are eating exactly what you burn. Your weight should remain stable."}
                        {inputs.goal < 0 && (
                          <>
                            Creating a deficit. Consistency is key. At this
                            rate, you can expect to lose approx.{" "}
                            <span className="font-black">0.5 kg per week</span>.
                          </>
                        )}
                        {inputs.goal > 0 && (
                          <>
                            Creating a surplus. Combine this with resistance
                            training to ensure the weight gained is muscle, not
                            just fat.
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 border-t border-slate-900/10">
                    {[
                      ["Burn", results.tdee],
                      ["Eat", results.targetCalories],
                    ].map(([label, val], i) => (
                      <div
                        key={label}
                        className="px-7 py-5 text-center"
                        style={
                          i === 0
                            ? { borderRight: "1px solid rgba(2, 10, 33, 0.1)" }
                            : {}
                        }
                      >
                        <p
                          className="text-xs font-black uppercase tracking-widest mb-1 opacity-60"
                          style={{ color: "#020a21" }}
                        >
                          {label}
                        </p>
                        <p
                          className="text-2xl font-black font-hero"
                          style={{ color: "#020a21" }}
                        >
                          {val}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ResultSection>

            {/* MACROS - Style: Nutrition Label Grid */}
            <ResultSection id="macros" sectionRefs={sectionRefs}>
              <SectionHeader
                title="Macro"
                accent="Breakdown"
                sub="How to split your daily calories across protein, carbs, and fat for the best results."
              />
              <div className="w-full max-w-lg mx-auto">
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ background: config.colors.accent }}
                >
                  <div className="p-6 text-center border-b border-slate-900/10">
                    <p
                      className="text-xs font-black uppercase tracking-[0.25em] mb-1"
                      style={{ color: "#020a21aa" }}
                    >
                      Daily Nutrients
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      Total: {results.targetCalories} kcal
                    </p>
                  </div>

                  <div className="grid grid-cols-3">
                    {/* Protein */}
                    <div className="p-5 text-center border-r border-slate-900/10">
                      <div className="inline-block p-2 rounded-lg bg-slate-900/5 mb-2">
                        <Beef size={20} style={{ color: "#020a21" }} />
                      </div>
                      <p
                        className="text-xs font-black uppercase tracking-widest mb-1 opacity-60"
                        style={{ color: "#020a21" }}
                      >
                        Protein
                      </p>
                      <p
                        className="text-2xl font-black font-hero"
                        style={{ color: "#020a21" }}
                      >
                        {results.protein}g
                      </p>
                      <p className="text-xs mt-1 " style={{ color: "#020a21" }}>
                        Muscle Repair
                      </p>
                    </div>

                    {/* Carbs */}
                    <div className="p-5 text-center border-r border-slate-900/10">
                      <div className="inline-block p-2 rounded-lg bg-slate-900/5 mb-2">
                        <Wheat size={20} style={{ color: "#020a21" }} />
                      </div>
                      <p
                        className="text-xs font-black uppercase tracking-widest mb-1 opacity-60"
                        style={{ color: "#020a21" }}
                      >
                        Carbs
                      </p>
                      <p
                        className="text-2xl font-black font-hero"
                        style={{ color: "#020a21" }}
                      >
                        {results.carbs}g
                      </p>
                      <p className="text-xs mt-1 " style={{ color: "#020a21" }}>
                        Energy
                      </p>
                    </div>

                    {/* Fat */}
                    <div className="p-5 text-center">
                      <div className="inline-block p-2 rounded-lg bg-slate-900/5 mb-2">
                        <Droplets size={20} style={{ color: "#020a21" }} />
                      </div>
                      <p
                        className="text-xs font-black uppercase tracking-widest mb-1 opacity-60"
                        style={{ color: "#020a21" }}
                      >
                        Fat
                      </p>
                      <p
                        className="text-2xl font-black font-hero"
                        style={{ color: "#020a21" }}
                      >
                        {results.fat}g
                      </p>
                      <p className="text-xs mt-1 " style={{ color: "#020a21" }}>
                        Hormones
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <div className="bg-slate-900/5 rounded-xl p-3 text-center">
                      <p
                        className="text-xs font-semibold"
                        style={{ color: "#020a21aa" }}
                      >
                        Tip: Prioritize protein at every meal to stay full
                        longer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ResultSection>

            {/* HYDRATION - Style: Visual Liquid Card (Softer Blue) */}
            <ResultSection id="hydration" sectionRefs={sectionRefs}>
              <SectionHeader
                title="Daily"
                accent="Hydration"
                sub="How much water your body needs each day. Hydration directly impacts energy, focus, and recovery."
              />
              <div className="w-full max-w-lg mx-auto">
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ background: config.colors.accent }}
                >
                  <div className="px-8 py-8 flex items-start justify-between">
                    <div>
                      <p
                        className="text-xs font-black uppercase tracking-[0.25em] mb-3"
                        style={{ color: "#020a21aa" }}
                      >
                        Daily Water Target
                      </p>
                      <div className="flex items-end gap-2">
                        <CountDisplay
                          value={parseFloat(results.waterL)}
                          isFloat
                          trigger={visibleSections["hydration"]}
                          className="text-6xl md:text-7xl font-black leading-none font-hero"
                          color="#020a21"
                        />
                        <span
                          className="text-xl font-bold mb-1"
                          style={{ color: "#020a2166" }}
                        >
                          Liters
                        </span>
                      </div>
                      <p
                        className="mt-3 text-sm font-bold"
                        style={{ color: "#020a21aa" }}
                      >
                        Approx.{" "}
                        <span
                          className="font-black"
                          style={{ color: "#020a21" }}
                        >
                          {results.glasses} glasses
                        </span>
                      </p>
                    </div>
                    <div className="opacity-20">
                      <Droplets size={56} style={{ color: "#020a21" }} />
                    </div>
                  </div>
                  <div
                    className="px-8 py-4 border-t"
                    style={{ borderColor: "#020a2115" }}
                  >
                    <p
                      className="text-xs font-semibold leading-relaxed"
                      style={{ color: "#020a21aa" }}
                    >
                      <span className="font-black" style={{ color: "#020a21" }}>
                        When to drink:
                      </span>{" "}
                      1 glass upon waking, 1 glass before every meal, and sip
                      consistently during workouts.
                    </p>
                  </div>
                </div>
              </div>
            </ResultSection>

            {/* SUMMARY */}
            <ResultSection id="summary" sectionRefs={sectionRefs}>
              <div className="w-full max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <CheckCircle2
                    size={38}
                    className="mx-auto mb-3"
                    style={{ color: config.colors.accent }}
                  />
                  <h2 className="font-hero text-3xl md:text-4xl font-black uppercase">
                    Health{" "}
                    <span style={{ color: config.colors.accent }}>Report</span>
                  </h2>
                  <p className="text-slate-400 text-sm mt-2 font-medium">
                    Everything in one place
                  </p>
                </div>

                <div
                  className="flex rounded-xl overflow-hidden mb-4 md:hidden"
                  style={{ background: "#0c1a2e" }}
                >
                  {["Profile", "Results"].map((t, i) => (
                    <button
                      key={t}
                      onClick={() => setShowResults(i === 1)}
                      className="flex-1 py-3 text-xs font-black uppercase transition-all rounded-xl"
                      style={{
                        background:
                          showResults === (i === 1)
                            ? config.colors.accent
                            : "transparent",
                        color:
                          showResults === (i === 1)
                            ? config.colors.bgDark
                            : "rgba(255,255,255,0.35)",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`rounded-2xl p-6 ${showResults ? "hidden md:block" : ""}`}
                    style={{
                      background: "#0c1a2e",
                      border: `1px solid ${config.colors.accent}18`,
                    }}
                  >
                    <p
                      className="text-xs font-black uppercase tracking-widest mb-4"
                      style={{ color: config.colors.accent }}
                    >
                      Your Profile
                    </p>
                    <div className="space-y-3 text-sm">
                      {[
                        ["Gender", inputs.gender.toUpperCase()],
                        ["Age", `${inputs.age} years`],
                        ["Height", `${inputs.feet}' ${inputs.inches || 0}"`],
                        ["Weight", `${inputs.weight} kg`],
                        [
                          "Activity",
                          ACTIVITY_LEVELS.find((a) => a.val === inputs.activity)
                            ?.label,
                        ],
                        ["Goal", goalLabel],
                      ].map(([k, v]) => (
                        <div
                          key={k}
                          className="flex justify-between items-center"
                        >
                          <span className="text-slate-500 font-semibold">
                            {k}
                          </span>
                          <span className="text-white font-black">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className={`rounded-2xl p-6 ${!showResults ? "hidden md:block" : ""}`}
                    style={{
                      background: "#0c1a2e",
                      border: `1px solid ${config.colors.accent}18`,
                    }}
                  >
                    <p
                      className="text-xs font-black uppercase tracking-widest mb-4"
                      style={{ color: config.colors.accent }}
                    >
                      Your Results
                    </p>
                    <div className="space-y-3 text-sm">
                      {[
                        [
                          "BMI",
                          `${results.bmi} — ${results.cat.label}`,
                          results.cat.color,
                        ],
                        [
                          "Ideal Weight",
                          `${results.idealRangeMin}–${results.idealRangeMax} kg`,
                          null,
                        ],
                        ["Resting Burn", `${results.bmr} kcal`, "#60a5fa"],
                        ["Total Burn", `${results.tdee} kcal`, "#f59e0b"],
                        [
                          "Daily Target",
                          `${results.targetCalories} kcal`,
                          config.colors.accent,
                        ],
                        [
                          "Macros",
                          `P ${results.protein}g · C ${results.carbs}g · F ${results.fat}g`,
                          null,
                        ],
                        ["Hydration", `${results.waterL} L / day`, "#0ea5e9"],
                      ].map(([k, v, c]) => (
                        <div
                          key={k}
                          className="flex justify-between items-center"
                        >
                          <span className="text-slate-500 font-semibold">
                            {k}
                          </span>
                          <span
                            className="font-black"
                            style={{ color: c || "white" }}
                          >
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={resetAll}
                    className="flex-1 py-4 text-sm font-black uppercase border-2 rounded-2xl transition-all hover:bg-white/5"
                    style={{
                      borderColor: config.colors.accent + "44",
                      color: config.colors.accent,
                    }}
                  >
                    Start Over
                  </button>
                  <button
                    onClick={downloadReport}
                    className="flex-1 py-4 text-sm font-black uppercase flex items-center justify-center gap-2 rounded-2xl transition-all"
                    style={{
                      background: config.colors.accent,
                      color: config.colors.bgDark,
                      boxShadow: `0 0 24px ${config.colors.accent}30`,
                    }}
                  >
                    <Download size={16} /> Download Report
                  </button>
                </div>
              </div>
            </ResultSection>
          </>
        )}
      </div>
    </div>
  );
}
