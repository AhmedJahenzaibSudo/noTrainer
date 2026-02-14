"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  RotateCcw,
  Coffee,
  ArrowRight,
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
  GlassWater, // Added for Hydration section
} from "lucide-react";

// ------------------------------
// Layout & Data Constants
// ------------------------------
const SECTION_HEIGHT = "93.5vh";

const ACTIVITY_LEVELS = [
  {
    label: "Sedentary",
    desc: "Little to no exercise",
    val: 1.2,
    icon: Coffee,
    idleCls:
      "bg-indigo-500/10 border-indigo-500/40 text-indigo-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600",
    activeCls:
      "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20",
  },
  {
    label: "Light",
    desc: "1-3 days/week",
    val: 1.375,
    icon: Footprints,
    idleCls:
      "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 hover:bg-cyan-600 hover:text-white hover:border-cyan-600",
    activeCls:
      "bg-cyan-600 text-white border-cyan-600 shadow-lg shadow-cyan-500/20",
  },
  {
    label: "Moderate",
    desc: "3-5 days/week",
    val: 1.55,
    icon: Dumbbell,
    idleCls:
      "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600",
    activeCls:
      "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20",
  },
  {
    label: "Active",
    desc: "6-7 days/week",
    val: 1.725,
    icon: Zap,
    idleCls:
      "bg-orange-500/10 border-orange-500/40 text-orange-400 hover:bg-orange-600 hover:text-white hover:border-orange-600",
    activeCls:
      "bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-500/20",
  },
  {
    label: "Athlete",
    desc: "Physical job + training",
    val: 1.9,
    icon: Trophy,
    idleCls:
      "bg-rose-500/10 border-rose-500/40 text-rose-400 hover:bg-rose-600 hover:text-white hover:border-rose-600",
    activeCls:
      "bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-500/20",
  },
];

const GOALS = [
  {
    label: "Lose Weight",
    val: -500,
    icon: TrendingDown,
    idleCls:
      "bg-rose-500/10 border-rose-500/60 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500",
    activeCls: "bg-rose-500 text-white border-rose-500",
  },
  {
    label: "Maintain",
    val: 0,
    icon: Shield,
    idleCls:
      "bg-[#bbfa26]/10 border-[#bbfa26]/60 text-[#bbfa26] hover:bg-[#bbfa26] hover:text-black hover:border-[#bbfa26]",
    activeCls: "bg-[#bbfa26] text-black border-[#bbfa26]",
  },
  {
    label: "Build Muscle",
    val: 500,
    icon: TrendingUp,
    idleCls:
      "bg-blue-500/10 border-blue-500/60 text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500",
    activeCls: "bg-blue-500 text-white border-blue-500",
  },
];

const BMI_CATEGORIES = [
  {
    label: "Underweight",
    min: 0,
    max: 18.5,
    bar: "bg-blue-500",
    text: "text-blue-400",
    border: "border-blue-500",
    bg: "bg-blue-500/20",
  },
  {
    label: "Healthy",
    min: 18.5,
    max: 25,
    bar: "bg-[#bbfa26]",
    text: "text-[#bbfa26]",
    border: "border-[#bbfa26]",
    bg: "bg-[#bbfa26]/20",
  },
  {
    label: "Overweight",
    min: 25,
    max: 30,
    bar: "bg-orange-500",
    text: "text-orange-400",
    border: "border-orange-500",
    bg: "bg-orange-500/20",
  },
  {
    label: "Obese",
    min: 30,
    max: 1000,
    bar: "bg-rose-600",
    text: "text-rose-500",
    border: "border-rose-600",
    bg: "bg-rose-600/20",
  },
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function BMIRangeBar({ bmi }) {
  const min = 12;
  const max = 40;
  const pos = ((clamp(bmi, min, max) - min) / (max - min)) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto mt-10">
      <div className="relative h-6 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
        <div className="absolute inset-0 flex">
          <div className="w-[23%] bg-blue-500/70" />
          <div className="w-[23%] bg-[#bbfa26]/70" />
          <div className="w-[12%] bg-orange-500/70" />
          <div className="flex-1 bg-rose-600/70" />
        </div>
        <div
          className="absolute top-0 bottom-0 w-[4px] bg-white shadow-[0_0_15px_rgba(255,255,255,1)] z-10"
          style={{ left: `${pos}%` }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {[
          {
            name: "Underweight",
            range: "< 18.5",
            min: 0,
            max: 18.5,
            activeColor: "bg-blue-500 text-black border-blue-500",
          },
          {
            name: "Healthy",
            range: "18.5 - 25",
            min: 18.5,
            max: 25,
            activeColor: "bg-[#bbfa26] text-black border-[#bbfa26]",
          },
          {
            name: "Overweight",
            range: "25 - 30",
            min: 25,
            max: 30,
            activeColor: "bg-orange-500 text-white border-orange-500",
          },
          {
            name: "Obese",
            range: "> 30",
            min: 30,
            max: 1000,
            activeColor: "bg-rose-600 text-white border-rose-600",
          },
        ].map((c) => {
          // Check if this category is currently active based on BMI
          const isActive = bmi >= c.min && bmi < c.max;

          return (
            <div
              key={c.name}
              className={`border-2 rounded-xl px-4 py-4 text-center transition-all duration-300 ${
                isActive
                  ? `${c.activeColor} scale-105 shadow-xl`
                  : "bg-slate-900/40 border-slate-800 text-slate-500 opacity-60"
              }`}
            >
              <div className="font-black uppercase text-sm md:text-base">
                {c.name}
              </div>
              <div
                className={`text-xs font-bold mt-1 ${isActive ? "opacity-100" : "opacity-50"}`}
              >
                BMI: {c.range}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HealthCalculators() {
  const scrollContainerRef = useRef(null);

  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState({
    gender: "",
    age: "",
    weight: "",
    feet: "",
    inches: "",
    activity: "",
    goal: "",
  });
  const [results, setResults] = useState(null);

  const numberInputNoSpinner =
    "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const inputStyle = `w-full bg-transparent text-white text-center text-6xl md:text-8xl font-black outline-none border-b-4 border-slate-700 focus:border-[#bbfa26] transition-all py-4 placeholder:text-slate-600 focus:placeholder-transparent ${numberInputNoSpinner}`;

  const scrollToPage = (index) => {
    if (!scrollContainerRef.current) return;
    const sectionHeight = scrollContainerRef.current.offsetHeight;
    scrollContainerRef.current.scrollTo({
      top: sectionHeight * index,
      behavior: "smooth",
    });
  };

  const resetAll = () => {
    setResults(null);
    setStep(0);
    setInputs({
      gender: "",
      age: "",
      weight: "",
      feet: "",
      inches: "",
      activity: "",
      goal: "",
    });
    scrollToPage(0);
  };

  const canNext = (() => {
    if (step === 0) return inputs.gender !== "";
    if (step === 1) return Number(inputs.age) > 0;
    if (step === 2) return Number(inputs.weight) > 0;
    if (step === 3) return Number(inputs.feet) > 0;
    if (step === 4) return Number(inputs.activity) > 0;
    if (step === 5) return inputs.goal !== "";
    return false;
  })();

  const calculate = () => {
    const feet = Number(inputs.feet);
    const inches = Number(inputs.inches || 0);
    const totalInches = feet * 12 + inches;

    const heightM = totalInches * 0.0254;
    const heightCm = heightM * 100;

    const weightKg = Number(inputs.weight);
    const age = Number(inputs.age);

    const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));
    const cat =
      BMI_CATEGORIES.find((c) => bmi >= c.min && bmi < c.max) ||
      BMI_CATEGORIES[3];

    const bmr =
      10 * weightKg +
      6.25 * heightCm -
      5 * age +
      (inputs.gender === "male" ? 5 : -161);

    const dailyBurn = Math.round(bmr * Number(inputs.activity));
    const targetCalories = dailyBurn + Number(inputs.goal);

    const inchesOver5ft = Math.max(0, totalInches - 60);
    const ibw = (inputs.gender === "male" ? 50 : 45.5) + 2.3 * inchesOver5ft;

    const idealRangeMin = ibw * 0.9;
    const idealRangeMax = ibw * 1.1;

    // simple target weight
    const midpoint = (idealRangeMin + idealRangeMax) / 2;
    const targetWeight =
      weightKg > idealRangeMax
        ? idealRangeMax
        : weightKg < idealRangeMin
          ? idealRangeMin
          : midpoint;

    const diffToTarget = weightKg - targetWeight;

    // Macro split (30/40/30)
    const protein = Math.round((targetCalories * 0.3) / 4);
    const carbs = Math.round((targetCalories * 0.4) / 4);
    const fat = Math.round((targetCalories * 0.3) / 9);

    // Water
    const waterL = Number((weightKg * 0.035).toFixed(1));
    const glasses = Math.round(waterL / 0.25);

    setResults({
      bmi,
      cat,
      targetCalories,
      protein,
      carbs,
      fat,
      waterL,
      glasses,

      // new fields
      idealRangeMin: Number(idealRangeMin.toFixed(1)),
      idealRangeMax: Number(idealRangeMax.toFixed(1)),
      targetWeight: Number(targetWeight.toFixed(1)),

      weightDiffText:
        Math.abs(diffToTarget) < 0.6
          ? "Perfect Range"
          : `${diffToTarget > 0 ? "Lose" : "Gain"} ${Math.abs(diffToTarget).toFixed(1)}kg`,
      weightDiffColor:
        Math.abs(diffToTarget) < 0.6
          ? "text-[#bbfa26]"
          : diffToTarget > 0
            ? "text-rose-500"
            : "text-blue-400",
    });

    requestAnimationFrame(() => scrollToPage(2));
  };

  return (
    <div className="bg-slate-950 text-white overflow-hidden selection:bg-[#bbfa26] selection:text-black font-sans">
      <div
        ref={scrollContainerRef}
        style={{ height: SECTION_HEIGHT }}
        className="overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth"
      >
        {/* 1) HERO */}
        <section
          style={{ height: SECTION_HEIGHT }}
          className="w-full snap-start flex flex-col items-center justify-center bg-slate-900 px-6"
        >
          <h1 className="text-6xl md:text-8xl font-black text-center leading-none">
            Health <br /> <span className="text-[#bbfa26]">Calculators</span>
          </h1>

          <button
            onClick={() => scrollToPage(1)}
            className="mt-10 bg-white text-black font-black px-12 py-5 text-2xl uppercase hover:bg-[#bbfa26] transition-all"
          >
            Start
          </button>
        </section>

        {/* 2) INPUTS */}
        <section
          style={{ height: SECTION_HEIGHT }}
          className="w-full snap-start relative flex flex-col items-center justify-center bg-slate-950 px-6"
        >
          <div className="absolute top-8 left-0 right-0 px-6 md:px-10 flex justify-center">
            <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl backdrop-blur-sm border border-slate-800">
              {/* Back Button */}
              <button
                onClick={() => step > 0 && setStep((s) => s - 1)}
                disabled={step === 0}
                className={`p-3 rounded-xl transition-all border ${
                  step === 0
                    ? "border-slate-800 text-slate-700 opacity-50 cursor-not-allowed"
                    : "border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white active:scale-95"
                }`}
                title="Back"
              >
                <ArrowLeft size={20} strokeWidth={2.5} />
              </button>

              {/* Reset Button */}
              <button
                onClick={resetAll}
                className="p-3 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                title="Reset All"
              >
                <RotateCcw size={20} strokeWidth={2.5} />
              </button>

              {/* Next Button */}
              <button
                onClick={() => canNext && step < 5 && setStep((s) => s + 1)}
                disabled={!canNext || step >= 5}
                className={`p-3 rounded-xl transition-all ${
                  canNext && step < 5
                    ? "bg-[#bbfa26] text-black shadow-lg shadow-[#bbfa26]/20 hover:scale-110 active:scale-95"
                    : "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700"
                }`}
                title="Next"
              >
                <ArrowRight size={20} strokeWidth={3} />
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
                className="w-full max-w-4xl"
              >
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 text-center text-[#bbfa26]">
                  Select Gender
                </h2>

                <div className="grid grid-cols-2 gap-6 md:gap-10 w-full">
                  <button
                    onClick={() => setInputs({ ...inputs, gender: "male" })}
                    className={`p-10 md:p-16 border-2 flex flex-col items-center gap-6 transition-all ${
                      inputs.gender === "male"
                        ? "bg-[#bbfa26] text-black border-[#bbfa26]"
                        : "bg-slate-900 border-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <Mars size={64} />
                    <span className="text-3xl md:text-4xl font-black uppercase italic">
                      Male
                    </span>
                  </button>

                  <button
                    onClick={() => setInputs({ ...inputs, gender: "female" })}
                    className={`p-10 md:p-16 border-2 flex flex-col items-center gap-6 transition-all ${
                      inputs.gender === "female"
                        ? "bg-[#bbfa26] text-black border-[#bbfa26]"
                        : "bg-slate-900 border-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <Venus size={64} />
                    <span className="text-3xl md:text-4xl font-black uppercase italic">
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
                className="w-full max-w-3xl text-center"
              >
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 text-[#bbfa26]">
                  How old are you?
                </h2>
                <input
                  type="number"
                  inputMode="numeric"
                  value={inputs.age}
                  onChange={(e) =>
                    setInputs({ ...inputs, age: e.target.value })
                  }
                  className={inputStyle}
                  placeholder="Enter age"
                  autoFocus
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="weight"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="w-full max-w-3xl text-center"
              >
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 text-[#bbfa26]">
                  Weight (KG)
                </h2>
                <input
                  type="number"
                  inputMode="decimal"
                  value={inputs.weight}
                  onChange={(e) =>
                    setInputs({ ...inputs, weight: e.target.value })
                  }
                  className={inputStyle}
                  placeholder="Enter weight"
                  autoFocus
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="height"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="w-full max-w-4xl mx-auto"
              >
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 text-center text-[#bbfa26]">
                  Height
                </h2>

                <div className="grid grid-cols-2 gap-8 md:gap-10">
                  <div className="text-center">
                    <p className="uppercase font-black text-slate-500 mb-4 tracking-widest">
                      Feet
                    </p>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={inputs.feet}
                      onChange={(e) =>
                        setInputs({ ...inputs, feet: e.target.value })
                      }
                      className={inputStyle}
                      autoFocus
                    />
                  </div>
                  <div className="text-center">
                    <p className="uppercase font-black text-slate-500 mb-4 tracking-widest">
                      Inches
                    </p>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={inputs.inches}
                      onChange={(e) =>
                        setInputs({ ...inputs, inches: e.target.value })
                      }
                      className={inputStyle}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="w-full max-w-7xl"
              >
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-10 text-center text-[#bbfa26]">
                  Activity Type
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {ACTIVITY_LEVELS.map((lvl) => {
                    const isActive = Number(inputs.activity) === lvl.val;
                    const cls = isActive ? lvl.activeCls : lvl.idleCls;
                    return (
                      <button
                        key={lvl.val}
                        onClick={() =>
                          setInputs({ ...inputs, activity: lvl.val })
                        }
                        className={`p-12 border-2 flex flex-col items-center gap-6 font-black uppercase transition-all text-center ${cls}`}
                      >
                        <lvl.icon size={48} />
                        <div className="leading-tight">
                          <div className="text-lg">{lvl.label}</div>
                          <div className="text-[10px] font-bold opacity-70 mt-2 tracking-widest">
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
                className="w-full max-w-5xl"
              >
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-10 text-center text-[#bbfa26]">
                  Choose your goal
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {GOALS.map((g) => {
                    const isActive = inputs.goal === g.val;
                    const cls = isActive ? g.activeCls : g.idleCls;
                    return (
                      <button
                        key={g.val}
                        onClick={() => setInputs({ ...inputs, goal: g.val })}
                        className={`p-12 border-2 flex flex-col items-center gap-6 font-black uppercase transition-all ${cls}`}
                      >
                        <g.icon size={48} /> {g.label}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => {
                      if (!canNext) return;
                      calculate();
                    }}
                    disabled={!canNext}
                    className={`px-14 py-4 font-black uppercase text-lg transition-all ${
                      canNext
                        ? "bg-white text-black hover:bg-[#bbfa26]"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                    }`}
                  >
                    Calculate
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 3) BMI - Highlighted Category */}
        {results && (
          <section
            style={{ height: SECTION_HEIGHT }}
            className="w-full snap-start flex flex-col items-center justify-center bg-slate-900 px-6"
          >
            <h2 className="text-4xl md:text-6xl font-black uppercase mb-6">
              Body Mass Index
            </h2>

            <div
              className={`text-[10rem] md:text-[12rem] leading-none font-black tracking-tighter ${results.cat.text}`}
            >
              {results.bmi}
            </div>

            <div
              className={`text-3xl md:text-4xl font-black uppercase tracking-widest ${results.cat.text}`}
            >
              {results.cat.label}
            </div>

            <BMIRangeBar bmi={results.bmi} />
          </section>
        )}

        {/* 4) IDEAL WEIGHT - Organized Layout */}
        {results && (
          <section
            style={{ height: SECTION_HEIGHT }}
            className="w-full snap-start flex flex-col items-center justify-center bg-slate-950 px-6"
          >
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-16 text-center text-white">
              Ideal Body Weight
            </h2>

            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              {/* Organized Min/Max Weight Range */}
              <div className="bg-slate-900/50 p-10 rounded-3xl border border-slate-800">
                <div className="flex flex-col gap-10">
                  <div className="flex justify-between items-end border-b border-slate-700 pb-4">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">
                      Min Weight
                    </span>
                    <span className="text-4xl font-black text-white">
                      {results.idealRangeMin}{" "}
                      <span className="text-lg">kg</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-700 pb-4">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">
                      Max Weight
                    </span>
                    <span className="text-4xl font-black text-white">
                      {results.idealRangeMax}{" "}
                      <span className="text-lg">kg</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actionable Target */}
              <div className="flex flex-col justify-center text-center">
                <div className="text-slate-500 uppercase font-black tracking-widest text-sm mb-4">
                  Recommended Action
                </div>
                <div
                  className={`text-5xl md:text-6xl font-black uppercase leading-tight ${results.weightDiffColor}`}
                >
                  {results.weightDiffText}
                </div>
                {Math.abs(results.targetWeight - inputs.weight) > 0.6 && (
                  <div className="mt-6 text-slate-400 font-bold">
                    Target: {results.targetWeight}kg
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 5) MACROS - Cleaner Layout & Simple Labels */}
        {results && (
          <section
            style={{ height: SECTION_HEIGHT }}
            className="w-full snap-start flex flex-col items-center justify-center bg-slate-800 px-6"
          >
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-12 text-center">
              Daily Nutrition
            </h2>

            <div className="w-full max-w-6xl">
              <div className="flex flex-col md:flex-row items-center justify-between bg-slate-900 rounded-3xl p-8 md:p-12 mb-8 border border-slate-700">
                <div>
                  <div className="text-slate-400 uppercase font-black tracking-widest mb-2">
                    Daily Energy Goal
                  </div>
                  <div className="text-6xl md:text-8xl font-black text-white leading-none">
                    {results.targetCalories}
                  </div>
                  <div className="text-[#bbfa26] font-bold uppercase mt-2 tracking-wide">
                    Calories
                  </div>
                </div>
                <div className="hidden md:block w-[1px] h-32 bg-slate-700 mx-8"></div>
                <div className="mt-6 md:mt-0 text-right">
                  <div className="text-slate-500 font-medium max-w-xs">
                    This breakdown is optimized for your goal to{" "}
                    <span className="text-white font-bold">
                      {inputs.goal === 0
                        ? "maintain weight"
                        : inputs.goal > 0
                          ? "build muscle"
                          : "lose weight"}
                    </span>
                    .
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-slate-900 rounded-2xl border-l-4 border-blue-500">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-xl font-black uppercase text-blue-400">
                      Protein
                    </div>
                    <Utensils size={24} className="text-blue-500/50" />
                  </div>
                  <div className="text-5xl font-black text-white mb-1">
                    {results.protein}g
                  </div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    Muscle Repair
                  </div>
                </div>

                <div className="p-6 bg-slate-900 rounded-2xl border-l-4 border-[#bbfa26]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-xl font-black uppercase text-[#bbfa26]">
                      Carbs
                    </div>
                    <Flame size={24} className="text-[#bbfa26]/50" />
                  </div>
                  <div className="text-5xl font-black text-white mb-1">
                    {results.carbs}g
                  </div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    Daily Energy
                  </div>
                </div>

                <div className="p-6 bg-slate-900 rounded-2xl border-l-4 border-rose-500">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-xl font-black uppercase text-rose-500">
                      Fats
                    </div>
                    <Droplets size={24} className="text-rose-500/50" />
                  </div>
                  <div className="text-5xl font-black text-white mb-1">
                    {results.fat}g
                  </div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    Hormone Health
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 6) HYDRATION - Visual Glass Icons */}
        {results && (
          <section
            style={{ height: SECTION_HEIGHT }}
            className="w-full snap-start flex flex-col items-center justify-center bg-blue-950 relative overflow-hidden px-6"
          >
            <div className="z-10 text-center w-full max-w-5xl">
              <h2 className="text-3xl md:text-5xl font-black uppercase mb-2 text-white">
                Daily Hydration
              </h2>
              <div className="text-blue-300 font-bold uppercase tracking-widest mb-10 opacity-80">
                Target: {results.waterL} Liters
              </div>

              {/* Visual Glasses Grid */}
              <div className="bg-blue-900/40 p-10 rounded-3xl border border-blue-500/30 backdrop-blur-md">
                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                  {Array.from({ length: results.glasses }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <GlassWater
                        size={48}
                        strokeWidth={1.5}
                        className="text-blue-200 fill-blue-500/20"
                      />
                      <span className="text-[10px] font-bold text-blue-300 opacity-50">
                        #{i + 1}
                      </span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-8 text-center text-blue-200 font-bold uppercase tracking-wide text-sm">
                  Drink {results.glasses} glasses (250ml) throughout the day
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-blue-500/10 blur-3xl rounded-[100%] translate-y-1/2 pointer-events-none" />
          </section>
        )}
      </div>

      <style jsx global>{`
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
    </div>
  );
}
