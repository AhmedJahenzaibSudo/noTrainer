"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
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
  Flame,
  Droplets,
  Utensils,
  GlassWater,
  Download,
  CheckCircle2,
} from "lucide-react";

const SECTION_HEIGHT = "93.5dvh";

const PANEL = {
  hero: "bg-slate-950",
  inputs: "bg-blue-950",
  bmi: "bg-cyan-950",
  ibw: "bg-indigo-950",
  macros: "bg-amber-950",
  water: "bg-sky-950",
  summary: "bg-violet-950",
};

const UI = {
  btn: "bg-white text-black hover:bg-slate-200",
  btnGhost:
    "bg-transparent text-white border-2 border-white hover:bg-slate-900",
  btnDanger: "bg-red-600 text-white border-2 border-red-600 hover:bg-red-500",
  tag: "px-3 py-1.5 border-2 font-black text-xs md:text-sm uppercase tracking-wider",
  accentBlue: "text-blue-300",
};

const ACTIVITY_LEVELS = [
  {
    label: "Sedentary",
    desc: "Little to no exercise",
    val: 1.2,
    icon: Coffee,
    idle: "bg-violet-900 border-violet-300",
    active: "bg-violet-600 border-white",
  },
  {
    label: "Light",
    desc: "1-3 days/week",
    val: 1.375,
    icon: Footprints,
    idle: "bg-sky-900 border-sky-300",
    active: "bg-sky-600 border-white",
  },
  {
    label: "Moderate",
    desc: "3-5 days/week",
    val: 1.55,
    icon: Dumbbell,
    idle: "bg-indigo-900 border-indigo-300",
    active: "bg-indigo-600 border-white",
  },
  {
    label: "Active",
    desc: "6-7 days/week",
    val: 1.725,
    icon: Zap,
    idle: "bg-amber-800 border-amber-200",
    active: "bg-amber-600 border-white",
  },
  {
    label: "Athlete",
    desc: "Physical job + training",
    val: 1.9,
    icon: Trophy,
    idle: "bg-emerald-900 border-emerald-300",
    active: "bg-emerald-600 border-white",
  },
];

const GOALS = [
  {
    label: "Lose Weight",
    val: -500,
    icon: TrendingDown,
    idle: "bg-red-900 border-red-300",
    active: "bg-red-600 border-white",
  },
  {
    label: "Maintain",
    val: 0,
    icon: Shield,
    idle: "bg-blue-900 border-blue-300",
    active: "bg-blue-600 border-white",
  },
  {
    label: "Build Muscle",
    val: 500,
    icon: TrendingUp,
    idle: "bg-emerald-900 border-emerald-300",
    active: "bg-emerald-600 border-white",
  },
];

const BMI_CATEGORIES = [
  { label: "Underweight", min: 0, max: 18.5 },
  { label: "Healthy", min: 18.5, max: 25 },
  { label: "Overweight", min: 25, max: 30 },
  { label: "Obese", min: 30, max: 1000 },
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
function parseNum(raw, mode = "float") {
  if (raw === "") return "";
  const v = mode === "int" ? parseInt(raw, 10) : parseFloat(raw);
  return Number.isFinite(v) ? v : "";
}

function BMIRangeBar({ bmi }) {
  const min = 12;
  const max = 40;
  const pos = ((clamp(bmi, min, max) - min) / (max - min)) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 md:mt-6">
      <div className="relative h-5 md:h-6 bg-slate-900 border-2 border-white overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="w-[23%] bg-sky-400" />
          <div className="w-[23%] bg-emerald-400" />
          <div className="w-[12%] bg-amber-400" />
          <div className="flex-1 bg-red-500" />
        </div>
        <div
          className="absolute top-0 bottom-0 w-[6px] bg-black border-2 border-white z-10"
          style={{ left: `${pos}%` }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {[
          {
            name: "Underweight",
            range: "< 18.5",
            min: 0,
            max: 18.5,
            active: "bg-sky-500 text-black border-2 border-sky-200",
          },
          {
            name: "Healthy",
            range: "18.5 - 25",
            min: 18.5,
            max: 25,
            active: "bg-emerald-500 text-black border-2 border-emerald-200",
          },
          {
            name: "Overweight",
            range: "25 - 30",
            min: 25,
            max: 30,
            active: "bg-amber-400 text-black border-2 border-amber-200",
          },
          {
            name: "Obese",
            range: "> 30",
            min: 30,
            max: 1000,
            active: "bg-red-500 text-white border-2 border-red-200",
          },
        ].map((c) => {
          const isActive = bmi >= c.min && bmi < c.max;
          return (
            <div
              key={c.name}
              className={`p-3 text-center transition border-2 ${
                isActive
                  ? c.active
                  : "bg-slate-900 text-white border-white hover:bg-slate-800"
              }`}
            >
              <div className="font-black uppercase text-xs md:text-sm">
                {c.name}
              </div>
              <div className="text-[10px] md:text-xs font-semibold mt-1">
                Score: {c.range}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SquareStat({
  title,
  value,
  hint,
  icon: Icon,
  tone = "border-white",
  bg = "bg-slate-900",
}) {
  return (
    <div
      className={`border-2 ${tone} ${bg} p-4 flex flex-col justify-center h-full`}
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 flex shrink-0 items-center justify-center">
          <Icon size={20} className="text-white" />
        </div>
        <div className="text-left w-full">
          <div className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-200">
            {title}
          </div>
          <div className="text-2xl md:text-3xl font-black text-white leading-tight mt-1">
            {value}
          </div>
          {hint ? (
            <div className="text-[10px] md:text-[11px] font-medium text-slate-300 mt-2 leading-snug">
              {hint}
            </div>
          ) : null}
        </div>
      </div>
    </div>
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

  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState(INITIAL_INPUTS);
  const [results, setResults] = useState(null);

  const numberInputNoSpinner =
    "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const inputStyle = useMemo(
    () =>
      `w-full bg-transparent text-white text-center text-4xl md:text-6xl font-black outline-none border-b-4 border-white focus:border-blue-300 transition-all py-2 placeholder:text-slate-200 ${numberInputNoSpinner}`,
    [numberInputNoSpinner],
  );

  const scrollToPage = (index) => {
    if (!scrollContainerRef.current) return;
    const h = scrollContainerRef.current.clientHeight;
    scrollContainerRef.current.scrollTo({ top: h * index, behavior: "smooth" });
  };

  const resetAll = () => {
    setResults(null);
    setStep(0);
    setInputs(INITIAL_INPUTS);
    scrollToPage(0);
  };

  const canNext = useMemo(() => {
    if (step === 0) return inputs.gender !== "";
    if (step === 1) return inputs.age >= 5 && inputs.age <= 120;
    if (step === 2) return inputs.weight >= 20 && inputs.weight <= 400;
    if (step === 3) {
      if (inputs.feet === "") return false;
      const totalInches = inputs.feet * 12 + (inputs.inches || 0);
      return totalInches >= 36 && totalInches <= 96; // Between 3'0" and 8'0"
    }
    if (step === 4) return inputs.activity !== "";
    if (step === 5) return inputs.goal !== "";
    return false;
  }, [step, inputs]);

  const setAgeInputRef = useCallback(
    (node) => {
      ageRef.current = node;
      if (node && step === 1) node.focus({ preventScroll: true });
    },
    [step],
  );

  const setWeightInputRef = useCallback(
    (node) => {
      weightRef.current = node;
      if (node && step === 2) node.focus({ preventScroll: true });
    },
    [step],
  );

  const setFeetInputRef = useCallback(
    (node) => {
      feetRef.current = node;
      if (node && step === 3) node.focus({ preventScroll: true });
    },
    [step],
  );

  const setInchesInputRef = useCallback((node) => {
    inchesRef.current = node;
  }, []);

  const validateInputs = () => {
    // Failsafe validation mirroring canNext constraints
    const age = inputs.age;
    const weightKg = inputs.weight;
    const feet = inputs.feet;
    const inches = inputs.inches === "" ? 0 : inputs.inches;
    const totalInches = feet * 12 + inches;

    if (!inputs.gender) return false;
    if (inputs.activity === "" || !inputs.activity) return false;
    if (inputs.goal === "") return false;

    if (age === "" || age < 5 || age > 120) return false;
    if (weightKg === "" || weightKg < 20 || weightKg > 400) return false;
    if (!Number.isFinite(totalInches) || totalInches < 36 || totalInches > 96)
      return false;

    return true;
  };

  const goalLabel =
    inputs.goal === 0
      ? "Maintain Weight"
      : inputs.goal > 0
        ? "Build Muscle"
        : "Lose Weight";

  const calculate = () => {
    if (!validateInputs()) return;

    const feet = inputs.feet;
    const inches = inputs.inches === "" ? 0 : inputs.inches;
    const totalInches = feet * 12 + inches;

    const heightM = totalInches * 0.0254;
    const heightCm = heightM * 100;

    const weightKg = inputs.weight;
    const age = inputs.age;

    const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));
    const cat =
      BMI_CATEGORIES.find((c) => bmi >= c.min && bmi < c.max) ||
      BMI_CATEGORIES[BMI_CATEGORIES.length - 1];

    const bmr =
      10 * weightKg +
      6.25 * heightCm -
      5 * age +
      (inputs.gender === "male" ? 5 : -161);

    const dailyBurn = Math.round(bmr * inputs.activity);
    const targetCalories = Math.max(1200, dailyBurn + inputs.goal);

    const inchesDiff = totalInches - 60;
    const base = inputs.gender === "male" ? 50 : 45.5;
    const ibw = clamp(base + 2.3 * inchesDiff, 30, 250);

    const idealRangeMin = Number((ibw * 0.9).toFixed(1));
    const idealRangeMax = Number((ibw * 1.1).toFixed(1));

    const midpoint = (idealRangeMin + idealRangeMax) / 2;
    const targetWeight =
      weightKg > idealRangeMax
        ? idealRangeMax
        : weightKg < idealRangeMin
          ? idealRangeMin
          : midpoint;

    const diffToTarget = Number((weightKg - targetWeight).toFixed(1));

    const protein = Math.round((targetCalories * 0.3) / 4);
    const carbs = Math.round((targetCalories * 0.4) / 4);
    const fat = Math.round((targetCalories * 0.3) / 9);

    const waterL = Number((weightKg * 0.035).toFixed(1));
    const glasses = Math.max(1, Math.round(waterL / 0.25));

    setResults({
      bmi,
      cat,
      bmr: Math.round(bmr),
      tdee: dailyBurn,
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

    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToPage(2));
    });
  };

  const onEnter = (e) => {
    if (e.key !== "Enter") return;

    if (step === 3 && e.target === feetRef.current && inchesRef.current) {
      inchesRef.current.focus({ preventScroll: true });
      return;
    }

    if (step < 5) {
      if (!canNext) return;
      setStep((s) => s + 1);
      return;
    }
    if (step === 5 && canNext) calculate();
  };

  const bmiColor = !results
    ? "text-white"
    : results.cat.label === "Underweight"
      ? "text-sky-300"
      : results.cat.label === "Healthy"
        ? "text-emerald-300"
        : results.cat.label === "Overweight"
          ? "text-amber-300"
          : "text-red-300";

  const goalSentence = useMemo(() => {
    if (!results) return { text: "", cls: "" };
    const d = results.diffToTarget;

    if (Math.abs(d) < 0.6)
      return {
        text: "You are already in a healthy range.",
        cls: "text-emerald-300",
      };
    if (d > 0)
      return {
        text: `Lose ${Math.abs(d).toFixed(1)} kg to reach the range.`,
        cls: "text-red-300",
      };
    return {
      text: `Gain ${Math.abs(d).toFixed(1)} kg to reach the range.`,
      cls: "text-emerald-300",
    };
  }, [results]);

  const downloadReport = () => {
    if (!results) return;

    const activityObj = ACTIVITY_LEVELS.find((a) => a.val === inputs.activity);
    const activityLabel = activityObj ? activityObj.label : "Unknown";

    const content = `
HEALTH REPORT
Generated on ${new Date().toLocaleDateString()}
----------------------------------------

PROFILE INPUTS:
• Gender: ${inputs.gender.toUpperCase()}
• Age: ${inputs.age}
• Weight: ${inputs.weight} kg
• Height: ${inputs.feet}'${inputs.inches || 0}"
• Activity: ${activityLabel}
• Goal: ${goalLabel.toUpperCase()}

----------------------------------------

YOUR RESULTS:

1. BMI (Body Mass Index)
   Formula: Weight (kg) / Height (m)²
   Score: ${results.bmi}
   Category: ${results.cat.label}

2. IBW (Ideal Body Weight)
   Formula: Devine Formula (1974)
   Recommended: ${results.idealRangeMin}kg - ${results.idealRangeMax}kg
   Target Adjustment: ${
     results.diffToTarget > 0.5
       ? `Lose ${Math.abs(results.diffToTarget)}kg`
       : results.diffToTarget < -0.5
         ? `Gain ${Math.abs(results.diffToTarget)}kg`
         : "Maintain Weight"
   }

3. BMR, TDEE & MACROS
   Formulas: Mifflin-St Jeor (BMR), Activity Multiplier (TDEE)
   
   BMR (Basal Metabolic Rate): ${results.bmr} kcal 
   -> Calories your body burns simply existing at rest.
   
   TDEE (Total Daily Energy Expenditure): ${results.tdee} kcal
   -> Maintenance calories based on your activity level.
   
   Your Target Calorie Goal: ${results.targetCalories} kcal
   
   • Protein (${results.protein}g) -> Builds/repairs muscle. Found in: Chicken, eggs, lentils, tofu.
   • Carbs (${results.carbs}g) -> Primary energy source. Found in: Rice, oats, potatoes, fruits.
   • Fats (${results.fat}g) -> Regulates hormones & brain health. Found in: Nuts, olive oil, fish, avocado.

4. HYDRATION TARGET
   Formula: Weight (kg) * 0.035 Liters
   Amount Needed: ${results.waterL} Liters
   (~${results.glasses} standard 250ml glasses)

----------------------------------------
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Health_Report_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-black text-white overflow-hidden selection:bg-white selection:text-black font-sans">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <style jsx global>{`
        body {
          font-family: "Inter", sans-serif;
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
      `}</style>

      <div
        ref={scrollContainerRef}
        style={{ height: SECTION_HEIGHT }}
        className="overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth"
      >
        {/* 1) HERO */}
        <section
          style={{ height: SECTION_HEIGHT }}
          className={`w-full snap-start flex flex-col items-center justify-center px-6 ${PANEL.hero}`}
        >
          <div className="text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Health <span className={UI.accentBlue}>Calculators</span>
            </h1>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:gap-3">
              {["BMI", "BMR", "TDEE", "IBW", "Macros", "Hydration"].map((t) => (
                <span
                  key={t}
                  className={`${UI.tag} bg-slate-900 border-white text-white`}
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => scrollToPage(1)}
                className={`px-8 py-3 border-2 border-white font-black text-base md:text-lg ${UI.btn} active:scale-95 transition`}
              >
                Start
              </button>
            </div>
          </div>
        </section>

        {/* 2) INPUTS */}
        <section
          style={{ height: SECTION_HEIGHT }}
          className={`w-full snap-start relative flex flex-col items-center justify-center px-4 md:px-6 ${PANEL.inputs}`}
        >
          <div className="absolute top-6 left-0 right-0 px-4 md:px-10 flex justify-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => step > 0 && setStep((s) => s - 1)}
                disabled={step === 0}
                aria-label="Back"
                className={`p-2 border-2 font-black transition active:scale-95 ${
                  step === 0
                    ? "border-slate-600 text-slate-500 cursor-not-allowed bg-transparent"
                    : UI.btnGhost
                }`}
                title="Back"
              >
                <ArrowLeft size={16} strokeWidth={2} />
              </button>

              <button
                onClick={resetAll}
                aria-label="Reset all"
                className={`p-2 font-black transition active:scale-95 ${UI.btnDanger}`}
                title="Reset All"
              >
                <RotateCcw size={16} strokeWidth={2} />
              </button>

              <button
                onClick={() => canNext && step < 5 && setStep((s) => s + 1)}
                disabled={!canNext || step >= 5}
                aria-label="Next"
                className={`p-2 border-2 font-black transition active:scale-95 ${
                  canNext && step < 5
                    ? "border-white bg-white text-black hover:bg-slate-200"
                    : "border-slate-600 text-slate-500 cursor-not-allowed bg-transparent"
                }`}
                title="Next"
              >
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="gender"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="w-full max-w-2xl"
              >
                <h2 className="text-2xl md:text-3xl font-black mb-6 text-center text-blue-200">
                  Select Your Gender
                </h2>

                <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
                  <button
                    onClick={() => setInputs((p) => ({ ...p, gender: "male" }))}
                    aria-pressed={inputs.gender === "male"}
                    className={`p-6 md:p-10 border-2 flex flex-col items-center gap-3 md:gap-4 transition-all active:scale-[0.99] ${
                      inputs.gender === "male"
                        ? "bg-blue-600 border-white text-white"
                        : "bg-blue-900 border-blue-300 text-white hover:border-white"
                    }`}
                  >
                    <Mars size={40} strokeWidth={1.5} className="text-white" />
                    <span className="text-lg md:text-xl font-black">Male</span>
                  </button>

                  <button
                    onClick={() =>
                      setInputs((p) => ({ ...p, gender: "female" }))
                    }
                    aria-pressed={inputs.gender === "female"}
                    className={`p-6 md:p-10 border-2 flex flex-col items-center gap-3 md:gap-4 transition-all active:scale-[0.99] ${
                      inputs.gender === "female"
                        ? "bg-pink-600 border-white text-white"
                        : "bg-pink-900 border-pink-300 text-white hover:border-white"
                    }`}
                  >
                    <Venus size={40} strokeWidth={1.5} className="text-white" />
                    <span className="text-lg md:text-xl font-black">
                      Female
                    </span>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="age"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="w-full max-w-2xl text-center"
              >
                <h2 className="text-2xl md:text-3xl font-black mb-4 text-blue-200">
                  Age (years)
                </h2>
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
                  aria-label="Age in years"
                />
                {inputs.age !== "" && (inputs.age < 5 || inputs.age > 120) && (
                  <p className="text-red-400 font-bold mt-4 animate-pulse">
                    Please enter an age between 5 and 120.
                  </p>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="weight"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="w-full max-w-2xl text-center"
              >
                <h2 className="text-2xl md:text-3xl font-black mb-4 text-blue-200">
                  Weight (Kg)
                </h2>
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
                  aria-label="Weight in kilograms"
                />
                {inputs.weight !== "" &&
                  (inputs.weight < 20 || inputs.weight > 400) && (
                    <p className="text-red-400 font-bold mt-4 animate-pulse">
                      Please enter a weight between 20kg and 400kg.
                    </p>
                  )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="height"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="w-full max-w-3xl mx-auto"
              >
                <h2 className="text-2xl md:text-3xl font-black mb-6 text-center text-blue-200">
                  Height
                </h2>

                <div className="grid grid-cols-2 gap-6 md:gap-10">
                  <div className="text-center">
                    <p className="text-slate-200 font-black mb-2 uppercase tracking-widest text-xs">
                      Feet
                    </p>
                    <input
                      ref={setFeetInputRef}
                      type="number"
                      inputMode="numeric"
                      value={inputs.feet === "" ? "" : String(inputs.feet)}
                      onKeyDown={onEnter}
                      onChange={(e) =>
                        setInputs((p) => ({
                          ...p,
                          feet: parseNum(e.target.value, "int"),
                        }))
                      }
                      className={inputStyle}
                      aria-label="Height feet"
                    />
                  </div>

                  <div className="text-center">
                    <p className="text-slate-200 font-black mb-2 uppercase tracking-widest text-xs">
                      Inches
                    </p>

                    <input
                      ref={setInchesInputRef}
                      type="number"
                      inputMode="numeric"
                      value={inputs.inches === "" ? "" : String(inputs.inches)}
                      onKeyDown={onEnter}
                      onChange={(e) =>
                        setInputs((p) => ({
                          ...p,
                          inches: parseNum(e.target.value, "int"),
                        }))
                      }
                      className={inputStyle}
                      aria-label="Height inches"
                    />
                  </div>
                </div>
                {inputs.feet !== "" &&
                  (inputs.feet * 12 + (inputs.inches || 0) < 36 ||
                    inputs.feet * 12 + (inputs.inches || 0) > 96) && (
                    <p className="text-red-400 font-bold mt-6 text-center animate-pulse">
                      Please enter a height between 3'0" and 8'0".
                    </p>
                  )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="w-full max-w-5xl"
              >
                <h2 className="text-2xl md:text-3xl font-black mb-6 text-center text-blue-200">
                  Activity Level
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                  {ACTIVITY_LEVELS.map((lvl) => {
                    const isActive = inputs.activity === lvl.val;
                    return (
                      <button
                        key={lvl.val}
                        onClick={() =>
                          setInputs((p) => ({ ...p, activity: lvl.val }))
                        }
                        aria-pressed={isActive}
                        className={`p-4 md:p-6 min-h-[130px] border-2 flex flex-col items-center justify-center gap-2 font-black transition-all text-center active:scale-[0.99] ${
                          isActive
                            ? `${lvl.active} text-white`
                            : `${lvl.idle} text-white hover:border-white`
                        }`}
                      >
                        <lvl.icon
                          size={28}
                          strokeWidth={1.7}
                          className="text-white"
                        />
                        <div>
                          <div className="text-base md:text-lg">
                            {lvl.label}
                          </div>
                          <div className="text-[10px] md:text-xs text-slate-200 font-semibold mt-1">
                            {lvl.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="goal"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="w-full max-w-4xl"
              >
                <h2 className="text-2xl md:text-3xl font-black mb-6 text-center text-blue-200">
                  Primary Goal
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                  {GOALS.map((g) => {
                    const isActive = inputs.goal === g.val;
                    return (
                      <button
                        key={g.val}
                        onClick={() =>
                          setInputs((p) => ({ ...p, goal: g.val }))
                        }
                        aria-pressed={isActive}
                        className={`p-6 md:p-8 min-h-[140px] border-2 flex flex-col items-center justify-center gap-3 font-black transition-all active:scale-[0.99] ${
                          isActive
                            ? `${g.active} text-white`
                            : `${g.idle} text-white hover:border-white`
                        }`}
                      >
                        <g.icon
                          size={32}
                          strokeWidth={1.6}
                          className="text-white"
                        />
                        <span className="text-lg md:text-xl">{g.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => canNext && calculate()}
                    disabled={!canNext}
                    className={`px-10 py-3 border-2 font-black text-base md:text-lg transition active:scale-95 ${
                      canNext
                        ? "border-white bg-white text-black hover:bg-slate-200"
                        : "border-slate-600 text-slate-500 cursor-not-allowed bg-transparent"
                    }`}
                  >
                    Calculate Results
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 3) BMI */}
        {results && (
          <section
            style={{ height: SECTION_HEIGHT }}
            className={`w-full snap-start flex flex-col items-center justify-center px-4 md:px-6 ${PANEL.bmi}`}
          >
            <div className="text-center max-w-3xl w-full">
              <h2 className="text-3xl md:text-4xl font-black mb-1">
                Body Mass Index (BMI)
              </h2>
              <p className="text-sm md:text-base font-semibold text-slate-200 mb-1">
                An estimate of body fat based on height and weight.
              </p>
              <p className="text-[10px] md:text-xs font-medium text-slate-400 mb-6">
                Formula used: Weight (kg) / Height (m)²
              </p>

              <div
                className={`text-7xl md:text-8xl font-black tracking-tight mb-4 ${bmiColor}`}
              >
                {results.bmi}
              </div>

              <div className="inline-flex items-center gap-2 px-5 py-2 border-2 border-white bg-slate-900 mb-6">
                <span className="text-xl font-black text-white">
                  {results.cat.label}
                </span>
              </div>

              <BMIRangeBar bmi={results.bmi} />
            </div>
          </section>
        )}

        {/* 4) IBW */}
        {results && (
          <section
            style={{ height: SECTION_HEIGHT }}
            className={`w-full snap-start flex flex-col items-center justify-center px-4 md:px-6 ${PANEL.ibw}`}
          >
            <div className="text-center max-w-4xl w-full">
              <h2 className="text-3xl md:text-4xl font-black mb-1">
                Ideal Body Weight (IBW)
              </h2>
              <p className="text-sm md:text-base font-semibold text-slate-200 mb-1">
                The recommended healthy weight range for your height.
              </p>
              <p className="text-[10px] md:text-xs font-medium text-slate-400 mb-8">
                Formula used: Devine Formula (1974)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <SquareStat
                  icon={TrendingDown}
                  title="Min Weight"
                  value={`${results.idealRangeMin} kg`}
                  hint="The lower boundary of your healthy range."
                  tone="border-indigo-300"
                  bg="bg-indigo-900"
                />
                <SquareStat
                  icon={TrendingUp}
                  title="Max Weight"
                  value={`${results.idealRangeMax} kg`}
                  hint="The upper boundary of your healthy range."
                  tone="border-indigo-300"
                  bg="bg-indigo-900"
                />
              </div>

              <div className="mt-6 border-2 border-white bg-slate-900 p-5 md:p-6">
                <div
                  className={`text-xl md:text-2xl font-black ${goalSentence.cls}`}
                >
                  {goalSentence.text}
                </div>
              </div>

              <div className="mt-6 border-2 border-white bg-slate-900 p-5 md:p-6">
                <div className="text-xs font-black uppercase tracking-widest text-slate-200">
                  Current Weight
                </div>
                <div className="text-3xl md:text-4xl font-black text-white mt-1">
                  {inputs.weight} kg
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 5) BMR, TDEE, MACROS */}
        {results && (
          <section
            style={{ height: SECTION_HEIGHT }}
            className={`w-full snap-start flex flex-col items-center justify-center px-4 md:px-6 ${PANEL.macros}`}
          >
            <div className="text-center max-w-5xl w-full">
              <h2 className="text-3xl md:text-4xl font-black mb-1">
                BMR, TDEE & Macros
              </h2>
              <p className="text-sm md:text-base font-semibold text-slate-200 mb-1">
                Your basal burn, maintenance burn, and nutrient split.
              </p>
              <p className="text-[10px] md:text-xs font-medium text-slate-400 mb-6">
                Formula used: Mifflin-St Jeor (BMR), BMR × Activity Multiplier
                (TDEE). Macros split 30% / 40% / 30%.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <SquareStat
                  icon={Coffee}
                  title="BMR (Basal Metabolic Rate)"
                  value={`${results.bmr} kcal`}
                  hint="Calories your body burns simply existing at rest."
                  tone="border-amber-400"
                  bg="bg-amber-900"
                />
                <SquareStat
                  icon={Zap}
                  title="TDEE (Total Daily Energy Exp.)"
                  value={`${results.tdee} kcal`}
                  hint="Maintenance calories based on your physical activity."
                  tone="border-amber-400"
                  bg="bg-amber-900"
                />
              </div>

              <div className="border-2 border-white bg-slate-900 p-4 md:p-6 mb-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-white text-black px-3 py-1 text-[10px] md:text-xs font-black uppercase tracking-widest">
                  {goalLabel} Goal
                </div>
                <div className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-200 mb-1 mt-1">
                  Your Adjusted Daily Calorie Target
                </div>
                <div className="text-4xl md:text-5xl font-black text-white">
                  {results.targetCalories}{" "}
                  <span className="text-lg font-bold text-slate-300">kcal</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <SquareStat
                  icon={Utensils}
                  title="Protein"
                  value={`${results.protein} g`}
                  hint="Builds and repairs muscle tissue. Found in: Chicken, eggs, lentils, fish, tofu."
                  tone="border-amber-200"
                  bg="bg-amber-800"
                />
                <SquareStat
                  icon={Flame}
                  title="Carbs"
                  value={`${results.carbs} g`}
                  hint="Your body's primary energy source. Found in: Rice, oats, potatoes, fruits."
                  tone="border-amber-200"
                  bg="bg-amber-800"
                />
                <SquareStat
                  icon={Droplets}
                  title="Fats"
                  value={`${results.fat} g`}
                  hint="Regulates hormones and brain health. Found in: Nuts, olive oil, fish, avocado."
                  tone="border-amber-200"
                  bg="bg-amber-800"
                />
              </div>
            </div>
          </section>
        )}

        {/* 6) HYDRATION */}
        {results && (
          <section
            style={{ height: SECTION_HEIGHT }}
            className={`w-full snap-start flex flex-col items-center justify-center px-4 md:px-6 ${PANEL.water}`}
          >
            <div className="text-center max-w-3xl w-full">
              <h2 className="text-3xl md:text-4xl font-black mb-1">
                Hydration Target
              </h2>
              <p className="text-sm md:text-base font-semibold text-slate-200 mb-1">
                The total amount of water you should drink daily.
              </p>
              <p className="text-[10px] md:text-xs font-medium text-slate-400 mb-8">
                Formula used: 35ml of water per kg of body weight.
              </p>

              <div className="border-2 border-white bg-sky-900 p-6 md:p-10">
                <div className="text-5xl md:text-6xl font-black text-white mb-2">
                  {results.waterL} Liters
                </div>
                <div className="text-sm md:text-base text-slate-200 font-semibold mb-6">
                  (~{results.glasses} standard 250ml glasses)
                </div>

                <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-6">
                  {Array.from({ length: Math.min(results.glasses, 12) }).map(
                    (_, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <GlassWater
                          size={28}
                          strokeWidth={1.8}
                          className="text-white"
                        />
                      </div>
                    ),
                  )}
                  {results.glasses > 12 && (
                    <div className="flex flex-col items-center justify-center font-black text-xl">
                      +{results.glasses - 12}
                    </div>
                  )}
                </div>

                <div className="text-sm md:text-base text-slate-200 font-semibold">
                  Calculated using your weight of{" "}
                  <span className="text-white font-black">
                    {inputs.weight} kg
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 7) SUMMARY & DOWNLOAD */}
        {results && (
          <section
            style={{ height: SECTION_HEIGHT }}
            className={`w-full snap-start flex flex-col items-center justify-center px-4 md:px-6 ${PANEL.summary}`}
          >
            <div className="text-center max-w-4xl w-full">
              <CheckCircle2
                size={40}
                className="mx-auto text-violet-300 mb-2"
              />
              <h2 className="text-2xl md:text-4xl font-black mb-2">
                Your Health Report
              </h2>
              <p className="text-sm md:text-base font-semibold text-violet-200 mb-6">
                A technical summary of your calculated targets.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-3xl mx-auto mb-6">
                {/* Inputs Summary */}
                <div className="bg-violet-900 border-2 border-violet-300 p-4 md:p-5">
                  <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-violet-200 border-b border-violet-700 pb-2 mb-3">
                    Your Profile
                  </h3>
                  <div className="space-y-2 text-xs md:text-sm font-bold">
                    <div className="flex justify-between">
                      <span className="text-violet-200">Gender</span>
                      <span className="capitalize">{inputs.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-violet-200">Age</span>
                      <span>{inputs.age} Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-violet-200">Height</span>
                      <span>
                        {inputs.feet}'{inputs.inches}"
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-violet-200">Weight</span>
                      <span>{inputs.weight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-violet-200">Activity</span>
                      <span>
                        {
                          ACTIVITY_LEVELS.find((a) => a.val === inputs.activity)
                            ?.label
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-violet-200">Goal</span>
                      <span className="text-white">{goalLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Results Summary */}
                <div className="bg-white text-black border-2 border-white p-4 md:p-5">
                  <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-2 mb-3">
                    Calculated Targets
                  </h3>
                  <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm font-bold">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">BMI</span>
                      <span className="bg-black text-white px-2 py-0.5 text-[10px] md:text-xs">
                        {results.bmi} ({results.cat.label})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">IBW Range</span>
                      <span>
                        {results.idealRangeMin}-{results.idealRangeMax} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">BMR</span>
                      <span>{results.bmr} kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">TDEE</span>
                      <span>{results.tdee} kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Target Calories</span>
                      <span className="text-black font-black">
                        {results.targetCalories} kcal
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Hydration</span>
                      <span className="text-blue-600">{results.waterL} L</span>
                    </div>

                    <div className="pt-2 mt-2 border-t border-slate-200 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Protein</span>
                        <span className="text-rose-600">
                          {results.protein}g
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Carbs</span>
                        <span className="text-emerald-600">
                          {results.carbs}g
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Fats</span>
                        <span className="text-amber-600">{results.fat}g</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={resetAll}
                  className="px-5 py-2.5 text-xs md:text-sm font-black border-2 border-violet-400 text-violet-200 hover:bg-violet-900 transition active:scale-95"
                >
                  Start Over
                </button>
                <button
                  onClick={downloadReport}
                  className="px-5 py-2.5 text-xs md:text-sm bg-white text-black font-black border-2 border-white hover:bg-slate-200 transition flex items-center gap-2 active:scale-95"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
