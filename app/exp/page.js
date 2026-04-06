"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  RotateCcw,
  ArrowRight,
  ArrowLeft,
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
  Download,
  GlassWater,
} from "lucide-react";

// Deep, solid flat backgrounds for high contrast wizard steps
const stepThemes = {
  "-1": "bg-slate-900",
  0: "bg-indigo-900",
  1: "bg-violet-900",
  2: "bg-cyan-900",
  3: "bg-teal-900",
  4: "bg-emerald-900",
  5: "bg-rose-900",
};

const ACTIVITY_LEVELS = [
  {
    label: "Sedentary",
    desc: "Desk job, little movement",
    val: 1.2,
    icon: Coffee,
  },
  { label: "Light", desc: "Walk 1-3× a week", val: 1.375, icon: Footprints },
  {
    label: "Moderate",
    desc: "Regular gym 3-5× a week",
    val: 1.55,
    icon: Dumbbell,
  },
  { label: "Active", desc: "Hard training 6-7× a week", val: 1.725, icon: Zap },
  {
    label: "Athlete",
    desc: "Physical job or intense sport",
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
  { label: "Underweight", min: 0, max: 18.5, color: "text-sky-300" },
  { label: "Healthy", min: 18.5, max: 25, color: "text-emerald-300" },
  { label: "Overweight", min: 25, max: 30, color: "text-amber-300" },
  { label: "Obese", min: 30, max: 1000, color: "text-rose-300" },
];

const INITIAL_INPUTS = {
  gender: "",
  age: "",
  weight: "",
  feet: "",
  inches: "",
  activity: "",
  goal: "",
};

// --- Helpers ---
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function parseNum(raw, mode = "float") {
  if (raw === "") return "";
  const v = mode === "int" ? parseInt(raw, 10) : parseFloat(raw);
  return Number.isFinite(v) ? v : "";
}

// --- Reusable CountUp Component ---
function CountDisplay({
  value,
  isFloat = false,
  className = "",
  duration = 1200,
}) {
  const [current, setCurrent] = useState(0);
  const target = isFloat ? parseFloat(value) : parseInt(value, 10);

  useEffect(() => {
    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCurrent(target * easeOutQuart);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return (
    <span className={className}>
      {isFloat ? current.toFixed(1) : Math.round(current)}
    </span>
  );
}

// --- Scrolling Results Component ---
// Extracted to properly isolate the `useScroll` hook and prevent hydration errors
function ScrollingResults({ results, inputs, onReset, onDownload }) {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });

  // Smoothly shift background colors as the user scrolls
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    ["#0f172a", "#1e1b4b", "#064e3b", "#7c2d12", "#831843", "#0f172a"], // slate-900 -> indigo-950 -> emerald-950 -> orange-950 -> rose-950 -> slate-900
  );

  return (
    <motion.div
      ref={scrollRef}
      style={{ backgroundColor: bgColor }}
      className="custom-scrollbar flex-1 overflow-y-auto w-full"
    >
      <div className="max-w-4xl mx-auto px-6 py-24 pb-48 flex flex-col gap-40 text-center">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-black uppercase tracking-widest text-white/50 mb-6">
            Analysis Complete
          </p>
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6 text-white">
            Your Results.
          </h2>
          <p className="text-xl md:text-2xl font-bold text-white/60">
            Scroll down to view your decoded metrics.
          </p>
        </motion.div>

        {/* 1. BMI Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.4 }}
          className="flex flex-col items-center"
        >
          <p className="text-sm font-black uppercase tracking-widest text-white/50 mb-8">
            Body Mass Index
          </p>
          <p className="text-3xl md:text-5xl font-black leading-tight text-white mb-8">
            Your BMI score is{" "}
            <span className="bg-white/10 px-3 py-1">
              <CountDisplay value={results.bmi} isFloat />
            </span>
            .
            <br className="hidden md:block mt-2" />
            You are in the{" "}
            <span className={results.cat.color}>{results.cat.label}</span> zone.
          </p>

          <div className="w-full max-w-2xl my-6">
            <div className="relative h-4 w-full flex bg-black/30 rounded-none overflow-hidden">
              <div className="h-full w-[25%] bg-sky-500 opacity-80"></div>
              <div className="h-full w-[25%] bg-emerald-500 opacity-80"></div>
              <div className="h-full w-[20%] bg-amber-500 opacity-80"></div>
              <div className="h-full w-[30%] bg-rose-500 opacity-80"></div>
              <motion.div
                initial={{ left: "0%" }}
                whileInView={{
                  left: `calc(${clamp(((results.bmi - 12) / 28) * 100, 0, 100)}% - 6px)`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 60,
                  damping: 12,
                  delay: 0.2,
                }}
                className="absolute top-[-8px] bottom-[-8px] w-3 bg-white shadow-xl rounded-none"
              />
            </div>
            <div className="flex justify-between mt-3 text-xs font-bold uppercase tracking-widest text-white/40">
              <span>Under</span>
              <span>Healthy</span>
              <span>Over</span>
              <span>Obese</span>
            </div>
          </div>
        </motion.section>

        {/* 2. Ideal Weight Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.4 }}
          className="flex flex-col items-center"
        >
          <p className="text-sm font-black uppercase tracking-widest text-white/50 mb-8">
            Body Weight
          </p>
          <div className="flex flex-col gap-6 text-left md:text-center w-full">
            <p className="text-3xl md:text-5xl font-black leading-tight text-white">
              Your current weight is{" "}
              <span className="text-indigo-300">{inputs.weight} kg</span>.
            </p>
            <p className="text-3xl md:text-5xl font-black leading-tight text-white">
              Your minimum weight should be{" "}
              <span className="text-emerald-300">
                <CountDisplay value={results.idealRangeMin} /> kg
              </span>
              .
            </p>
            <p className="text-3xl md:text-5xl font-black leading-tight text-white">
              Your maximum weight should be{" "}
              <span className="text-emerald-300">
                <CountDisplay value={results.idealRangeMax} /> kg
              </span>
              .
            </p>
            <p className="text-3xl md:text-5xl font-black leading-tight text-white mt-4">
              To reach your goal, you need to{" "}
              {results.diffToTarget > 0 ? (
                <span className="text-rose-400">lose</span>
              ) : results.diffToTarget < 0 ? (
                <span className="text-sky-400">gain</span>
              ) : (
                <span className="text-white">maintain</span>
              )}{" "}
              <span className="bg-white/10 px-3">
                {Math.abs(results.diffToTarget)} kg
              </span>
              .
            </p>
          </div>
        </motion.section>

        {/* 3. Energy Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.4 }}
          className="flex flex-col items-center"
        >
          <p className="text-sm font-black uppercase tracking-widest text-white/50 mb-12">
            Energy Burn
          </p>
          <div className="flex flex-col gap-12 w-full text-left md:text-center">
            <p className="text-3xl md:text-5xl font-black leading-tight text-white">
              Your resting burn is{" "}
              <span className="text-amber-400">
                <CountDisplay value={results.bmr} /> kcal
              </span>
              . <br className="hidden md:block" />
              It means calories burned doing nothing.
            </p>
            <p className="text-3xl md:text-5xl font-black leading-tight text-white">
              Your total burn is{" "}
              <span className="text-orange-400">
                <CountDisplay value={results.tdee} /> kcal
              </span>
              . <br className="hidden md:block" />
              It means calories burned with your activity.
            </p>
          </div>
        </motion.section>

        {/* 4. Target Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.4 }}
          className="flex flex-col items-center"
        >
          <p className="text-sm font-black uppercase tracking-widest text-white/50 mb-12">
            Daily Target
          </p>
          <p className="text-4xl md:text-6xl font-black leading-tight text-white">
            To{" "}
            {inputs.goal === 0
              ? "maintain"
              : inputs.goal > 0
                ? "build muscle"
                : "lose weight"}
            , eat{" "}
            <span className="text-rose-400 bg-white/10 px-4 py-2">
              <CountDisplay value={results.targetCalories} /> kcal
            </span>{" "}
            daily.
          </p>
        </motion.section>

        {/* 5. Macros Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          className="flex flex-col items-center"
        >
          <p className="text-sm font-black uppercase tracking-widest text-white/50 mb-12">
            Macro Breakdown
          </p>
          <div className="flex flex-col gap-8 w-full text-left md:text-center">
            <p className="text-3xl md:text-5xl font-black leading-tight text-white">
              Eat{" "}
              <span className="text-rose-400 bg-white/10 px-3">
                <CountDisplay value={results.protein} />g
              </span>{" "}
              of protein for muscle.
            </p>
            <p className="text-3xl md:text-5xl font-black leading-tight text-white">
              Eat{" "}
              <span className="text-sky-400 bg-white/10 px-3">
                <CountDisplay value={results.carbs} />g
              </span>{" "}
              of carbs for energy.
            </p>
            <p className="text-3xl md:text-5xl font-black leading-tight text-white">
              Eat{" "}
              <span className="text-amber-400 bg-white/10 px-3">
                <CountDisplay value={results.fat} />g
              </span>{" "}
              of fat for hormones.
            </p>
          </div>
        </motion.section>

        {/* 6. Hydration Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.3 }}
          className="flex flex-col items-center"
        >
          <p className="text-sm font-black uppercase tracking-widest text-white/50 mb-12">
            Hydration
          </p>
          <p className="text-3xl md:text-5xl font-black leading-tight text-white mb-12">
            Drink{" "}
            <span className="text-cyan-400 bg-white/10 px-3">
              <CountDisplay value={results.waterL} isFloat /> liters
            </span>{" "}
            of water daily. <br className="hidden md:block" />
            That is{" "}
            <span className="text-cyan-400 bg-white/10 px-3">
              {results.glasses}
            </span>{" "}
            glasses.
          </p>

          <div className="flex flex-wrap justify-center gap-4 w-full max-w-3xl mt-4 mb-24">
            {Array.from({ length: results.glasses }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.04,
                  type: "spring",
                  stiffness: 150,
                  damping: 12,
                }}
              >
                <GlassWater
                  className="text-cyan-400 fill-cyan-400/20"
                  size={48}
                  strokeWidth={1.5}
                />
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl mt-12">
            <button
              onClick={onDownload}
              className="flex-1 flex items-center justify-center gap-3 bg-emerald-500 px-8 py-5 text-base font-black uppercase tracking-widest text-slate-900 rounded-none transition-transform hover:scale-105 hover:bg-white"
            >
              <Download size={20} strokeWidth={3} />
              Save Report
            </button>
            <button
              onClick={onReset}
              className="flex-1 flex items-center justify-center gap-3 bg-white/10 border-2 border-white/20 px-8 py-5 text-base font-black uppercase tracking-widest text-white rounded-none transition-colors hover:bg-white hover:text-slate-900"
            >
              <RotateCcw size={20} strokeWidth={3} />
              Start Over
            </button>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}

// --- Main App Component ---
export default function HealthCalculators() {
  const [step, setStep] = useState(-1);
  const [inputs, setInputs] = useState(INITIAL_INPUTS);
  const [results, setResults] = useState(null);

  const feetRef = useRef(null);
  const inchesRef = useRef(null);

  const canNext = useMemo(() => {
    if (step === -1) return true;
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

  const resetAll = () => {
    setResults(null);
    setInputs(INITIAL_INPUTS);
    setStep(-1);
  };

  const handleNext = useCallback(() => {
    if (!canNext) return;
    if (step === 5) calculate();
    else setStep((s) => s + 1);
  }, [canNext, step]);

  const handleBack = () => {
    if (step > -1) setStep((s) => s - 1);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (step === 3 && e.target === feetRef.current) {
        inchesRef.current?.focus();
      } else {
        handleNext();
      }
    }
  };

  const calculate = () => {
    const feet = inputs.feet,
      inches = inputs.inches === "" ? 0 : inputs.inches;
    const totalInches = feet * 12 + inches;
    const heightM = totalInches * 0.0254;
    const heightCm = heightM * 100;
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
    const targetWeight =
      wkg > idealRangeMax
        ? idealRangeMax
        : wkg < idealRangeMin
          ? idealRangeMin
          : (idealRangeMin + idealRangeMax) / 2;
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
      diffToTarget,
    });
    setStep(6);
  };

  const downloadReport = () => {
    if (!results) return;
    const actObj = ACTIVITY_LEVELS.find((a) => a.val === inputs.activity);
    const goalLabel =
      inputs.goal === 0
        ? "Maintain"
        : inputs.goal > 0
          ? "Build Muscle"
          : "Lose Weight";
    const blob = new Blob(
      [
        `HEALTH CALCULATORS REPORT\n${new Date().toLocaleDateString()}\n${"─".repeat(40)}\nGender: ${inputs.gender} | Age: ${inputs.age} | Weight: ${inputs.weight}kg | Height: ${inputs.feet}'${inputs.inches || 0}"\nActivity: ${actObj?.label} | Goal: ${goalLabel}\n${"─".repeat(40)}\nBMI: ${results.bmi} (${results.cat.label})\nIdeal Weight: ${results.idealRangeMin}–${results.idealRangeMax} kg\nBase Burn (BMR): ${results.bmr} kcal\nTotal Burn (TDEE): ${results.tdee} kcal\nDaily Target: ${results.targetCalories} kcal\nProtein: ${results.protein}g | Carbs: ${results.carbs}g | Fat: ${results.fat}g\nHydration: ${results.waterL} L`,
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

  const currentTheme = stepThemes[step] || "";
  const noSpinner =
    "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  // Refined input style: completely transparent background, thick bottom border
  const lineInputStyle = `w-full bg-transparent border-0 border-b-4 border-white/20 outline-none text-center font-black transition-colors ${noSpinner} text-7xl md:text-9xl py-4 px-4 text-white focus:border-white focus:ring-0 placeholder:text-white/10 rounded-none`;

  return (
    <div
      className={`flex h-[calc(100dvh-40px)] md:h-[calc(100dvh-48px)] w-full flex-col ${step < 6 ? currentTheme : "bg-slate-900"} text-white overflow-hidden transition-colors duration-500`}
    >
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 0px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.4); }
      `}</style>

      {/* HEADER */}
      {step > -1 && step < 6 && (
        <header className="flex h-16 shrink-0 items-center justify-between px-6 bg-black/10 border-b-2 border-white/10">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 border-2 border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-slate-900 rounded-none"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <span className="hidden text-sm font-bold text-white/50 md:block tracking-widest uppercase">
              Step {step + 1} of 6
            </span>
          </div>
          <button
            onClick={resetAll}
            className="flex items-center gap-2 border-2 border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-slate-900 rounded-none"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </header>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent">
        <AnimatePresence mode="wait">
          {step < 6 ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex h-full w-full flex-col"
            >
              {/* HERO SECTION */}
              {step === -1 && (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <div className="flex flex-col items-center justify-center w-full max-w-4xl">
                    <h1 className="text-5xl font-black uppercase tracking-tighter text-white sm:text-7xl md:text-8xl leading-none">
                      Health
                      <br />
                      Calculators
                    </h1>
                    <p className="mt-8 text-base md:text-xl font-bold text-white/70 uppercase tracking-widest">
                      Know your numbers. Understand your body.
                    </p>

                    {/* Tags */}
                    <div className="mt-12 flex flex-wrap justify-center gap-3 max-w-2xl">
                      {[
                        "BMI",
                        "BMR",
                        "TDEE",
                        "Macros",
                        "Ideal Weight",
                        "Hydration",
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="border-2 border-white/20 px-4 py-2 text-xs md:text-sm font-bold uppercase tracking-widest text-white/80 rounded-none"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={handleNext}
                      className="mt-16 flex w-full max-w-xs items-center justify-between bg-white px-8 py-5 text-lg font-black uppercase tracking-widest text-slate-900 rounded-none transition-transform hover:scale-105"
                    >
                      <span>Start</span>
                      <ArrowRight size={24} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              )}

              {/* WIZARD INPUTS */}
              {step > -1 && (
                <div className="mx-auto flex h-full w-full max-w-5xl flex-col p-6 md:p-12">
                  <div className="flex flex-col items-center justify-center min-h-0 flex-1 w-full">
                    {/* STEP 0: GENDER */}
                    {step === 0 && (
                      <div className="w-full">
                        <h2 className="mb-16 text-5xl md:text-7xl font-black uppercase text-center tracking-tighter">
                          Gender
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
                          <button
                            onClick={() => {
                              setInputs((p) => ({ ...p, gender: "male" }));
                            }}
                            className={`flex flex-col items-center justify-center gap-6 p-12 transition-all duration-200 rounded-none ${
                              inputs.gender === "male"
                                ? "bg-white text-indigo-900 scale-105 shadow-xl ring-4 ring-white"
                                : "border-2 border-white/20 bg-transparent text-white/60 hover:bg-white/5"
                            }`}
                          >
                            <Mars size={80} strokeWidth={2} />
                            <span className="text-3xl font-black uppercase tracking-widest">
                              Male
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setInputs((p) => ({ ...p, gender: "female" }));
                            }}
                            className={`flex flex-col items-center justify-center gap-6 p-12 transition-all duration-200 rounded-none ${
                              inputs.gender === "female"
                                ? "bg-white text-indigo-900 scale-105 shadow-xl ring-4 ring-white"
                                : "border-2 border-white/20 bg-transparent text-white/60 hover:bg-white/5"
                            }`}
                          >
                            <Venus size={80} strokeWidth={2} />
                            <span className="text-3xl font-black uppercase tracking-widest">
                              Female
                            </span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 1: AGE */}
                    {step === 1 && (
                      <div className="w-full max-w-lg text-center">
                        <h2 className="mb-12 text-5xl md:text-7xl font-black uppercase tracking-tighter">
                          Age
                        </h2>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={inputs.age === "" ? "" : inputs.age}
                          onChange={(e) =>
                            setInputs((p) => ({
                              ...p,
                              age: parseNum(e.target.value, "int"),
                            }))
                          }
                          onKeyDown={handleInputKeyDown}
                          className={lineInputStyle}
                          placeholder="0"
                          autoFocus
                        />
                      </div>
                    )}

                    {/* STEP 2: WEIGHT */}
                    {step === 2 && (
                      <div className="w-full max-w-lg text-center">
                        <h2 className="mb-12 text-5xl md:text-7xl font-black uppercase tracking-tighter">
                          Weight
                        </h2>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={inputs.weight === "" ? "" : inputs.weight}
                          onChange={(e) =>
                            setInputs((p) => ({
                              ...p,
                              weight: parseNum(e.target.value, "float"),
                            }))
                          }
                          onKeyDown={handleInputKeyDown}
                          className={lineInputStyle}
                          placeholder="0"
                          autoFocus
                        />
                        <p className="mt-8 text-base font-bold uppercase tracking-widest text-white/80">
                          Kilograms
                        </p>
                      </div>
                    )}

                    {/* STEP 3: HEIGHT */}
                    {step === 3 && (
                      <div className="w-full max-w-3xl text-center">
                        <h2 className="mb-12 text-5xl md:text-7xl font-black uppercase tracking-tighter">
                          Height
                        </h2>
                        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                          <div className="flex-1">
                            <input
                              ref={feetRef}
                              type="number"
                              inputMode="numeric"
                              value={inputs.feet === "" ? "" : inputs.feet}
                              onChange={(e) =>
                                setInputs((p) => ({
                                  ...p,
                                  feet: parseNum(e.target.value, "int"),
                                }))
                              }
                              onKeyDown={handleInputKeyDown}
                              className={lineInputStyle}
                              placeholder="5"
                              autoFocus
                            />
                            <p className="mt-8 text-base font-bold uppercase tracking-widest text-white/80">
                              Feet
                            </p>
                          </div>
                          <div className="flex-1">
                            <input
                              ref={inchesRef}
                              type="number"
                              inputMode="numeric"
                              value={inputs.inches === "" ? "" : inputs.inches}
                              onChange={(e) =>
                                setInputs((p) => ({
                                  ...p,
                                  inches: parseNum(e.target.value, "int"),
                                }))
                              }
                              onKeyDown={handleInputKeyDown}
                              className={lineInputStyle}
                              placeholder="10"
                            />
                            <p className="mt-8 text-base font-bold uppercase tracking-widest text-white/80">
                              Inches
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: ACTIVITY */}
                    {step === 4 && (
                      <div className="w-full h-full flex flex-col justify-center">
                        <h2 className="mb-12 text-5xl md:text-7xl font-black uppercase text-center tracking-tighter shrink-0">
                          Activity
                        </h2>
                        <div className="flex flex-col md:flex-row gap-4 w-full">
                          {ACTIVITY_LEVELS.map((lvl) => {
                            const active = inputs.activity === lvl.val;
                            return (
                              <button
                                key={lvl.val}
                                onClick={() =>
                                  setInputs((p) => ({
                                    ...p,
                                    activity: lvl.val,
                                  }))
                                }
                                className={`flex-1 flex flex-row md:flex-col items-center justify-start md:justify-center p-6 gap-4 rounded-none transition-all duration-200 ${
                                  active
                                    ? "bg-white text-emerald-900 scale-105 shadow-xl ring-4 ring-white"
                                    : "border-2 border-white/20 text-white/60 hover:bg-white/5"
                                }`}
                              >
                                <lvl.icon size={36} strokeWidth={2} />
                                <div className="flex flex-col items-start md:items-center text-left md:text-center">
                                  <h3 className="text-lg md:text-xl font-black uppercase tracking-widest leading-tight">
                                    {lvl.label}
                                  </h3>
                                  <p
                                    className={`text-xs font-bold mt-2 ${active ? "opacity-80" : "opacity-50"}`}
                                  >
                                    {lvl.desc}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* STEP 5: GOAL */}
                    {step === 5 && (
                      <div className="w-full h-full flex flex-col justify-center">
                        <h2 className="mb-12 text-5xl md:text-7xl font-black uppercase text-center tracking-tighter shrink-0">
                          Goal
                        </h2>
                        <div className="flex flex-col md:flex-row gap-6 w-full">
                          {GOALS.map((g) => {
                            const active = inputs.goal === g.val;
                            return (
                              <button
                                key={g.val}
                                onClick={() =>
                                  setInputs((p) => ({ ...p, goal: g.val }))
                                }
                                className={`flex-1 flex flex-row md:flex-col items-center justify-start md:justify-center p-8 gap-6 rounded-none transition-all duration-200 ${
                                  active
                                    ? "bg-white text-rose-900 scale-105 shadow-xl ring-4 ring-white"
                                    : "border-2 border-white/20 text-white/60 hover:bg-white/5"
                                }`}
                              >
                                <g.icon size={48} strokeWidth={2} />
                                <h3 className="text-2xl font-black uppercase tracking-widest text-left md:text-center leading-tight">
                                  {g.label}
                                </h3>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* NEXT BUTTON */}
                  <div className="mt-12 shrink-0 flex justify-center">
                    <button
                      onClick={handleNext}
                      disabled={!canNext}
                      className={`group flex w-full max-w-sm items-center justify-between p-6 text-xl font-black uppercase tracking-widest rounded-none transition-all ${
                        canNext
                          ? "bg-white text-slate-900 shadow-xl hover:scale-[1.02]"
                          : "bg-white/10 text-white/20 cursor-not-allowed"
                      }`}
                    >
                      <span>{step === 5 ? "See Results" : "Next"}</span>
                      <ArrowRight
                        size={24}
                        strokeWidth={3}
                        className={
                          canNext
                            ? "transition-transform group-hover:translate-x-2"
                            : ""
                        }
                      />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            /* RESULTS VIEW SEPARATED TO AVOID HOOK REF ERRORS */
            <ScrollingResults
              key="results-view"
              results={results}
              inputs={inputs}
              onReset={resetAll}
              onDownload={downloadReport}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
