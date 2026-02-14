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
  },
  {
    label: "Healthy",
    min: 18.5,
    max: 25,
    bar: "bg-[#bbfa26]",
    text: "text-[#bbfa26]",
  },
  {
    label: "Overweight",
    min: 25,
    max: 30,
    bar: "bg-orange-500",
    text: "text-orange-400",
  },
  {
    label: "Obese",
    min: 30,
    max: 1000,
    bar: "bg-rose-600",
    text: "text-rose-500",
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
      <div className="relative h-5 bg-slate-800 border border-slate-700 overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="w-[23%] bg-blue-500/70" />
          <div className="w-[23%] bg-[#bbfa26]/70" />
          <div className="w-[12%] bg-orange-500/70" />
          <div className="flex-1 bg-rose-600/70" />
        </div>
        <div
          className="absolute top-0 bottom-0 w-[3px] bg-white shadow-[0_0_18px_rgba(255,255,255,0.6)]"
          style={{ left: `${pos}%` }}
        />
      </div>

      <div className="flex justify-between text-xs uppercase tracking-widest font-bold text-slate-400 mt-3">
        <span>{min}</span>
        <span>{max}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          {
            name: "Underweight",
            range: "< 18.5",
            cls: "text-blue-400 border-blue-500/30",
          },
          {
            name: "Healthy",
            range: "18.5 - 25",
            cls: "text-[#bbfa26] border-[#bbfa26]/30",
          },
          {
            name: "Overweight",
            range: "25 - 30",
            cls: "text-orange-400 border-orange-500/30",
          },
          {
            name: "Obese",
            range: "> 30",
            cls: "text-rose-500 border-rose-500/30",
          },
        ].map((c) => (
          <div
            key={c.name}
            className={`border px-4 py-3 bg-slate-950/30 ${c.cls}`}
          >
            <div className="font-black uppercase">{c.name}</div>
            <div className="text-slate-400">{c.range}</div>
          </div>
        ))}
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

    // ✅ simple target weight
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

      // ✅ new fields
      idealRangeMin: Number(idealRangeMin.toFixed(1)),
      idealRangeMax: Number(idealRangeMax.toFixed(1)),
      targetWeight: Number(targetWeight.toFixed(1)),

      weightDiffText:
        Math.abs(diffToTarget) < 0.6
          ? "You’re on target"
          : `${diffToTarget > 0 ? "Lose" : "Gain"} ${Math.abs(diffToTarget).toFixed(1)}kg to hit target`,
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
          <h1 className="text-6xl md:text-8xl font-black   text-center leading-none">
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

        {/* 3) BMI */}
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

        {/* 4) IDEAL WEIGHT (Range + Target) */}
        {results && (
          <section
            style={{ height: SECTION_HEIGHT }}
            className="w-full snap-start flex flex-col items-center justify-center bg-slate-950 px-6"
          >
            <h2 className="text-4xl md:text-6xl font-black uppercase mb-10 text-center">
              Ideal Body Weight
            </h2>

            {/* Range */}
            <div className="text-center">
              <div className="text-[6rem] md:text-[7rem] font-black leading-none tracking-tight">
                {results.idealRangeMin} – {results.idealRangeMax}
              </div>
              <div className="text-2xl md:text-3xl font-black uppercase text-slate-500 tracking-widest mt-3">
                Kilograms
              </div>
            </div>

            {/* Target */}
            <div className="mt-10 text-center">
              <div className="text-slate-400 uppercase font-black tracking-widest">
                Simple Target Weight
              </div>
              <div className="text-6xl md:text-7xl font-black mt-2 text-white">
                {results.targetWeight}kg
              </div>
              <div
                className={`mt-6 text-3xl md:text-4xl font-black uppercase italic ${results.weightDiffColor}`}
              >
                {results.weightDiffText}
              </div>
            </div>
          </section>
        )}

        {/* 5) MACROS */}
        {results && (
          <section
            style={{ height: SECTION_HEIGHT }}
            className="w-full snap-start flex flex-col items-center justify-center bg-slate-800 px-6"
          >
            <h2 className="text-4xl md:text-6xl font-black uppercase mb-10 text-center">
              Macronutrients
            </h2>

            <div className="w-full max-w-7xl">
              <div className="bg-slate-900 border border-slate-700 p-6 md:p-10 mb-8">
                <div className="text-slate-400 uppercase font-black tracking-widest">
                  Total calories
                </div>
                <div className="text-6xl md:text-7xl font-black mt-2">
                  {results.targetCalories}
                </div>
                <div className="text-slate-500 font-bold uppercase mt-2">
                  per day (based on your goal)
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-slate-900 border-t-8 border-blue-500 text-center">
                  <Utensils className="mx-auto mb-6 text-blue-400" size={48} />
                  <div className="text-6xl font-black mb-2">
                    {results.protein}g
                  </div>
                  <div className="text-xl font-black uppercase text-blue-400 italic">
                    Protein
                  </div>
                  <div className="text-slate-400 mt-4 font-bold">
                    Chicken, eggs, fish, lentils, yogurt
                  </div>
                </div>

                <div className="p-8 bg-slate-900 border-t-8 border-[#bbfa26] text-center">
                  <Flame className="mx-auto mb-6 text-[#bbfa26]" size={48} />
                  <div className="text-6xl font-black mb-2">
                    {results.carbs}g
                  </div>
                  <div className="text-xl font-black uppercase text-[#bbfa26] italic">
                    Carbs
                  </div>
                  <div className="text-slate-400 mt-4 font-bold">
                    Rice, oats, potatoes, fruit, whole wheat bread
                  </div>
                </div>

                <div className="p-8 bg-slate-900 border-t-8 border-rose-500 text-center">
                  <Droplets className="mx-auto mb-6 text-rose-500" size={48} />
                  <div className="text-6xl font-black mb-2">{results.fat}g</div>
                  <div className="text-xl font-black uppercase text-rose-500 italic">
                    Fats
                  </div>
                  <div className="text-slate-400 mt-4 font-bold">
                    Olive oil, nuts, avocado, peanut butter, seeds
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 6) HYDRATION */}
        {results && (
          <section
            style={{ height: SECTION_HEIGHT }}
            className="w-full snap-start flex flex-col items-center justify-center bg-blue-950 relative overflow-hidden px-6"
          >
            <h2 className="text-4xl md:text-6xl font-black uppercase mb-10 z-10">
              Hydration
            </h2>

            <div className="text-[10rem] md:text-[12rem] font-black text-white leading-none z-10 drop-shadow-2xl">
              {results.waterL}
            </div>
            <div className="text-2xl md:text-3xl font-black uppercase text-blue-200 tracking-widest z-10 italic">
              Litres per day
            </div>

            <div className="grid grid-cols-2 gap-10 mt-14 z-10 w-full max-w-2xl">
              <div className="text-center bg-blue-900/20 border border-blue-400/20 p-6">
                <div className="text-6xl font-black">{results.glasses}</div>
                <div className="uppercase font-bold tracking-widest opacity-80">
                  Glasses
                </div>
                <div className="text-blue-200/80 font-bold mt-2">
                  250ml each
                </div>
              </div>
              <div className="text-center bg-blue-900/20 border border-blue-400/20 p-6">
                <div className="text-6xl font-black">
                  {Math.round(results.waterL / 0.5)}
                </div>
                <div className="uppercase font-bold tracking-widest opacity-80">
                  Bottles
                </div>
                <div className="text-blue-200/80 font-bold mt-2">
                  500ml each
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-blue-500/20 blur-3xl rounded-[100%] translate-y-1/2" />
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
