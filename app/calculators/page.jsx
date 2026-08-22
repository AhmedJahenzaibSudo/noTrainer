"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
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

/* =========================================================
   DESIGN CONFIG
========================================================= */

const DESIGN = {
  colors: {
    background: "color(display-p3 0.056 0.958 0.949)",
    element: "color(display-p3 0.079 0.201 0.346)",

    // selected state only
    selected: "color(display-p3 0.98 0.78 0.12)",
  },
};

/* =========================================================
   DATA
========================================================= */

const ACTIVITY_LEVELS = [
  {
    label: "Sedentary",
    desc: "Desk job",
    val: 1.2,
    icon: Coffee,
  },
  {
    label: "Light",
    desc: "Walk 1-3×/wk",
    val: 1.375,
    icon: Footprints,
  },
  {
    label: "Moderate",
    desc: "Gym 3-5×/wk",
    val: 1.55,
    icon: Dumbbell,
  },
  {
    label: "Active",
    desc: "Train 6-7×/wk",
    val: 1.725,
    icon: Zap,
  },
  {
    label: "Athlete",
    desc: "Intense sport",
    val: 1.9,
    icon: Trophy,
  },
];

const GOALS = [
  {
    label: "Lose Weight",
    val: -500,
    icon: TrendingDown,
  },
  {
    label: "Maintain",
    val: 0,
    icon: Shield,
  },
  {
    label: "Build Muscle",
    val: 500,
    icon: TrendingUp,
  },
];

const BMI_CATEGORIES = [
  {
    label: "Underweight",
    min: 0,
    max: 18.5,
    color: "bmi-under-text",
  },
  {
    label: "Healthy",
    min: 18.5,
    max: 25,
    color: "bmi-healthy-text",
  },
  {
    label: "Overweight",
    min: 25,
    max: 30,
    color: "bmi-over-text",
  },
  {
    label: "Obese",
    min: 30,
    max: 1000,
    color: "bmi-obese-text",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function parseNum(raw, mode = "float") {
  if (raw === "") return "";

  const value =
    mode === "int"
      ? parseInt(raw, 10)
      : parseFloat(raw);

  return Number.isFinite(value) ? value : "";
}

/* =========================================================
   COUNT ANIMATION
========================================================= */

function CountDisplay({
  value,
  isFloat = false,
  className = "",
}) {
  const [current, setCurrent] = useState(0);

  const target = isFloat
    ? parseFloat(value)
    : parseInt(value, 10);

  useEffect(() => {
    let start = null;

    const duration = 1000;

    const animate = (timestamp) => {
      if (!start) start = timestamp;

      const progress = Math.min(
        (timestamp - start) / duration,
        1,
      );

      const easeOutQuart =
        1 - Math.pow(1 - progress, 4);

      setCurrent(target * easeOutQuart);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target]);

  return (
    <span className={className}>
      {isFloat
        ? current.toFixed(1)
        : Math.round(current)}
    </span>
  );
}

/* =========================================================
   INITIAL INPUTS
========================================================= */

const INITIAL_INPUTS = {
  gender: "",
  age: "",
  weight: "",
  feet: "",
  inches: "",
  activity: "",
  goal: "",
};

/* =========================================================
   RESULTS VIEW
   No gradient / color-changing scroll
========================================================= */

function ResultsView({
  results,
  inputs,
  resetAll,
  downloadReport,
}) {
  return (
    <motion.div
      key="results"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="custom-scrollbar calc-bg min-h-0 flex-1 overflow-y-auto w-full"
    >
      <div className="mx-auto max-w-5xl pb-32 pt-16">
        {/* HEADER ACTION */}

        <div className="mb-12 flex justify-end px-8">
          <button
            onClick={resetAll}
            className="calc-block calc-hover-fill flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <RotateCcw size={14} />

            Start Over
          </button>
        </div>

        {/* TITLE */}

        <div className="calc-text mb-12 px-8 text-center">
          <h2 className="mb-6 text-5xl font-black uppercase leading-none tracking-tighter md:text-8xl">
            Your Results.
          </h2>
        </div>

        {/* =================================================
            BMI
        ================================================= */}

        <section className="calc-text flex flex-col items-center px-8 py-24 text-center">
          <p className="calc-muted mb-8 text-sm font-black uppercase tracking-widest">
            Body Mass Index
          </p>

          <p className="mb-10 max-w-3xl text-3xl font-black leading-tight md:text-5xl">
            Your BMI is{" "}
<span className="calc-number-box">
  <CountDisplay value={results.bmi} isFloat />
</span>
. It means you are{" "}
<span className={results.cat.color}>
  {results.cat.label}
</span>
.
          </p>

          {/* BMI BAR */}

          <div className="my-6 w-full max-w-3xl px-4">
  <div className="relative flex h-4 w-full overflow-hidden border-2 border-[var(--calc-element)]">
    <div className="bmi-under h-full w-[25%]" />
    <div className="bmi-healthy h-full w-[25%]" />
    <div className="bmi-over h-full w-[20%]" />
    <div className="bmi-obese h-full w-[30%]" />

    <motion.div
      initial={{ left: "0%" }}
      whileInView={{
        left: `calc(${clamp(
          ((results.bmi - 12) / 28) * 100,
          0,
          100,
        )}% - 6px)`,
      }}
      viewport={{ once: true }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 12,
        delay: 0.2,
      }}
      className="bmi-marker absolute bottom-[-8px] top-[-8px] w-3"
    />
  </div>

  <div className="mt-3 flex justify-between text-xs font-bold uppercase tracking-widest">
    <span className="bmi-under-text">Under</span>
    <span className="bmi-healthy-text">Healthy</span>
    <span className="bmi-over-text">Over</span>
    <span className="bmi-obese-text">Obese</span>
  </div>
</div>
        </section>

        {/* =================================================
            IDEAL WEIGHT
        ================================================= */}

        <section className="calc-text flex flex-col items-center px-8 py-24 text-center">
          <p className="calc-muted mb-8 text-sm font-black uppercase tracking-widest">
            Ideal Body Weight
          </p>

          <p className="text-3xl font-black leading-tight md:text-5xl">
  Your min weight should be:{" "}
  <span className="calc-number-box">
    <CountDisplay value={results.idealRangeMin} /> kg
  </span>
  .
</p>

<p className="text-3xl font-black leading-tight md:text-5xl">
  Your max weight should be:{" "}
  <span className="calc-number-box">
    <CountDisplay value={results.idealRangeMax} /> kg
  </span>
  .
</p>

<p className="mt-6 text-3xl font-black leading-tight md:text-5xl">
  You currently weigh:{" "}
  <span className="calc-number-box">
    {inputs.weight} kg
  </span>
  .
</p>

<p className="text-3xl font-black leading-tight md:text-5xl">
  You need to{" "}
  <span className="calc-accent-text">
    {results.diffToTarget > 0
      ? "lose"
      : results.diffToTarget < 0
        ? "gain"
        : "maintain"}
  </span>{" "}
  <span className="calc-number-box">
    {Math.abs(results.diffToTarget)} kg
  </span>
  .
</p>
        </section>

        {/* =================================================
            ENERGY
        ================================================= */}

        <section className="calc-text flex flex-col items-center px-8 py-24 text-center">
          <p className="calc-muted mb-12 text-sm font-black uppercase tracking-widest">
            Energy
          </p>

          <div className="flex max-w-4xl flex-col gap-12 text-left md:text-center">
            <p className="text-3xl font-black leading-tight md:text-5xl">
  Your resting burn is{" "}
  <span className="calc-number-box">
    <CountDisplay value={results.bmr} /> kcal
  </span>
  . It means calories burned doing nothing.
</p>

<p className="text-3xl font-black leading-tight md:text-5xl">
  Your total burn is{" "}
  <span className="calc-number-box">
    <CountDisplay value={results.tdee} /> kcal
  </span>
  . It means calories burned with your activity.
</p>
          </div>
        </section>

        {/* =================================================
            TARGET
        ================================================= */}

        <section className="calc-text flex flex-col items-center px-8 py-24 text-center">
          <p className="calc-muted mb-12 text-sm font-black uppercase tracking-widest">
            Target
          </p>

          <p className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">
  To{" "}
  {inputs.goal === 0
    ? "maintain"
    : inputs.goal > 0
      ? "build muscle"
      : "lose weight"}
  , eat{" "}
  <span className="calc-number-box">
    <CountDisplay value={results.targetCalories} /> kcal
  </span>{" "}
  daily.
</p>
        </section>

        {/* =================================================
            MACROS
        ================================================= */}

        <section className="calc-text flex flex-col items-center px-8 py-24 text-center">
          <p className="calc-muted mb-12 text-sm font-black uppercase tracking-widest">
            Macros
          </p>

          <div className="flex max-w-4xl flex-col gap-8 text-left md:text-center">
            <p className="text-3xl font-black leading-tight md:text-5xl">
  Eat{" "}
  <span className="calc-number-box">
    <CountDisplay value={results.protein} />g
  </span>{" "}
  protein for muscle.
</p>

<p className="text-3xl font-black leading-tight md:text-5xl">
  Eat{" "}
  <span className="calc-number-box">
    <CountDisplay value={results.carbs} />g
  </span>{" "}
  carbs for energy.
</p>

<p className="text-3xl font-black leading-tight md:text-5xl">
  Eat{" "}
  <span className="calc-number-box">
    <CountDisplay value={results.fat} />g
  </span>{" "}
  fat for hormones.
</p>
          </div>
        </section>

        {/* =================================================
            HYDRATION
        ================================================= */}

        <section className="calc-text flex flex-col items-center px-8 py-24 text-center">
          <p className="calc-muted mb-12 text-sm font-black uppercase tracking-widest">
            Hydration
          </p>

          <p className="mb-12 max-w-4xl text-3xl font-black leading-tight md:text-5xl">
  Drink{" "}
  <span className="calc-number-box">
    <CountDisplay value={results.waterL} isFloat /> liters
  </span>{" "}
  of water daily. That is{" "}
  <span className="calc-number-box">
    {results.glasses}
  </span>{" "}
  glasses.
</p>

          <div className="mb-24 mt-4 flex max-w-3xl flex-wrap justify-center gap-4">
            {Array.from({
              length: results.glasses,
            }).map((_, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: -20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.04,
                  type: "spring",
                  stiffness: 150,
                  damping: 12,
                }}
              >
                <GlassWater
                  className="calc-text"
                  size={48}
                  strokeWidth={1.5}
                />
              </motion.div>
            ))}
          </div>

          <div className="flex w-full justify-center">
            <button
              onClick={downloadReport}
              className="calc-selected flex w-full max-w-sm items-center justify-center gap-3 px-8 py-6 text-lg font-black uppercase tracking-widest transition-transform hover:scale-[1.02] md:text-xl"
            >
              <Download
                size={24}
                strokeWidth={3}
              />

              Save Report
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

/* =========================================================
   HEALTH CALCULATORS
========================================================= */

export default function HealthCalculators() {
  const [step, setStep] = useState(-1);

  const [inputs, setInputs] =
    useState(INITIAL_INPUTS);

  const [results, setResults] =
    useState(null);

  const feetRef = useRef(null);
  const inchesRef = useRef(null);

  /* =======================================================
     NEXT VALIDATION
  ======================================================= */

  const canNext = useMemo(() => {
    if (step === -1) return true;

    if (step === 0) {
      return inputs.gender !== "";
    }

    if (step === 1) {
      return (
        inputs.age >= 5 &&
        inputs.age <= 120
      );
    }

    if (step === 2) {
      return (
        inputs.weight >= 20 &&
        inputs.weight <= 400
      );
    }

    if (step === 3) {
      const total =
        (inputs.feet || 0) * 12 +
        (inputs.inches || 0);

      return (
        inputs.feet !== "" &&
        total >= 36 &&
        total <= 96
      );
    }

    if (step === 4) {
      return inputs.activity !== "";
    }

    if (step === 5) {
      return inputs.goal !== "";
    }

    return false;
  }, [step, inputs]);

  /* =======================================================
     RESET
  ======================================================= */

  const resetAll = () => {
    setResults(null);
    setInputs(INITIAL_INPUTS);
    setStep(-1);
  };

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const handleNext = useCallback(() => {
    if (!canNext) return;

    if (step === 5) {
      calculate();
    } else {
      setStep((current) => current + 1);
    }
  }, [canNext, step, inputs]);

  const handleBack = () => {
    if (step > -1) {
      setStep((current) => current - 1);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    if (
      step === 3 &&
      e.target === feetRef.current
    ) {
      inchesRef.current?.focus();
    } else {
      handleNext();
    }
  };

  /* =======================================================
     CALCULATIONS
  ======================================================= */

  const calculate = () => {
    const feet = inputs.feet;

    const inches =
      inputs.inches === ""
        ? 0
        : inputs.inches;

    const totalInches =
      feet * 12 + inches;

    const heightM =
      totalInches * 0.0254;

    const heightCm =
      heightM * 100;

    const {
      weight: weightKg,
      age,
    } = inputs;

    /* BMI */

    const bmi = Number(
      (
        weightKg /
        heightM ** 2
      ).toFixed(1),
    );

    const cat =
      BMI_CATEGORIES.find(
        (category) =>
          bmi >= category.min &&
          bmi < category.max,
      ) || BMI_CATEGORIES[3];

    /* BMR */

    const bmr = Math.round(
      10 * weightKg +
        6.25 * heightCm -
        5 * age +
        (inputs.gender === "male"
          ? 5
          : -161),
    );

    /* TDEE */

    const tdee = Math.round(
      bmr * inputs.activity,
    );

    /* TARGET */

    const targetCalories = Math.max(
      1200,
      tdee + inputs.goal,
    );

    /* IDEAL WEIGHT */

    const ibw = clamp(
      (inputs.gender === "male"
        ? 50
        : 45.5) +
        2.3 *
          (totalInches - 60),
      30,
      250,
    );

    const idealRangeMin = Number(
      (ibw * 0.9).toFixed(1),
    );

    const idealRangeMax = Number(
      (ibw * 1.1).toFixed(1),
    );

    const targetWeight =
      weightKg > idealRangeMax
        ? idealRangeMax
        : weightKg < idealRangeMin
          ? idealRangeMin
          : (idealRangeMin +
              idealRangeMax) /
            2;

    const diffToTarget = Number(
      (
        weightKg - targetWeight
      ).toFixed(1),
    );

    /* MACROS */

    const protein = Math.round(
      (targetCalories * 0.3) / 4,
    );

    const carbs = Math.round(
      (targetCalories * 0.4) / 4,
    );

    const fat = Math.round(
      (targetCalories * 0.3) / 9,
    );

    /* WATER */

    const waterL = Number(
      (weightKg * 0.035).toFixed(1),
    );

    const glasses = Math.max(
      1,
      Math.round(waterL / 0.25),
    );

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

  /* =======================================================
     DOWNLOAD
  ======================================================= */

  const downloadReport = () => {
    if (!results) return;

    const activityObject =
      ACTIVITY_LEVELS.find(
        (activity) =>
          activity.val ===
          inputs.activity,
      );

    const goalLabel =
      inputs.goal === 0
        ? "Maintain"
        : inputs.goal > 0
          ? "Build Muscle"
          : "Lose Weight";

    const report = `HEALTH CALCULATORS REPORT
${new Date().toLocaleDateString()}
${"─".repeat(40)}

Gender: ${inputs.gender}
Age: ${inputs.age}
Weight: ${inputs.weight}kg
Height: ${inputs.feet}'${inputs.inches || 0}"

Activity: ${activityObject?.label}
Goal: ${goalLabel}

${"─".repeat(40)}

BMI: ${results.bmi} (${results.cat.label})
Ideal Weight: ${results.idealRangeMin}–${results.idealRangeMax} kg

Base Burn (BMR): ${results.bmr} kcal
Total Burn (TDEE): ${results.tdee} kcal
Daily Target: ${results.targetCalories} kcal

Protein: ${results.protein}g
Carbs: ${results.carbs}g
Fat: ${results.fat}g

Hydration: ${results.waterL} L`;

    const blob = new Blob(
      [report],
      {
        type: "text/plain",
      },
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;

    anchor.download = `Health_Report_${new Date()
      .toISOString()
      .slice(0, 10)}.txt`;

    document.body.appendChild(anchor);

    anchor.click();

    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
  };

  /* =======================================================
     INPUT STYLE
  ======================================================= */

  const noSpinner =
    "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const giantInputStyle = `
    w-full
    bg-transparent
    border-0
    border-b-4
    calc-input-border
    outline-none
    text-center
    font-black
    transition-colors
    ${noSpinner}
    text-7xl
    md:text-9xl
    py-4
    px-4
    calc-text
    focus:ring-0
    placeholder:opacity-25
    rounded-none
  `;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="calculator-page calc-bg flex h-[calc(100dvh-40px)] w-full flex-col overflow-hidden md:h-[calc(100dvh-48px)]">
      <style>{`
  .calculator-page {
    --calc-bg: ${DESIGN.colors.background};
    --calc-element: ${DESIGN.colors.element};
    --calc-selected: ${DESIGN.colors.selected};

    background: var(--calc-bg);
    color: var(--calc-element);
  }

  /* =====================================================
     PAGE
  ===================================================== */

  .calc-bg {
    background: var(--calc-bg) !important;
    color: var(--calc-element) !important;
  }

  .calc-text {
    color: var(--calc-element) !important;
  }

  .calc-muted {
    color: var(--calc-element) !important;
    opacity: 0.55;
  }

  /* =====================================================
     STANDARD DARK BLOCK

     All normal cards / boxes:
     dark bg
     bright text
     dark border
  ===================================================== */

  .calc-block {
    background: var(--calc-element) !important;
    color: var(--calc-bg) !important;
    border: 2px solid var(--calc-element) !important;
  }

  .calc-block * {
    color: var(--calc-bg);
  }

  /* =====================================================
     SELECTED

     Third color only when something is selected.
  ===================================================== */

  .calc-selected {
    background: var(--calc-selected) !important;
    color: var(--calc-element) !important;
    border: 2px solid var(--calc-element) !important;
    box-shadow: 0 0 0 2px var(--calc-element);
  }

  .calc-selected * {
    color: var(--calc-element) !important;
  }

  /* =====================================================
     NORMAL OUTLINE BUTTON

     Used for things like Back / Reset if you don't want
     them to look selected.
  ===================================================== */

  .calc-outline {
    background: transparent !important;
    color: var(--calc-element) !important;
    border: 2px solid var(--calc-element) !important;
  }

  .calc-outline:hover {
    background: var(--calc-element) !important;
    color: var(--calc-bg) !important;
  }

  .calc-outline:hover * {
    color: var(--calc-bg) !important;
  }

  /* =====================================================
     INPUTS

     Keep every input visually consistent:
     bright bg
     dark text
     dark border
  ===================================================== */

  .calc-input {
    background: var(--calc-bg) !important;
    color: var(--calc-element) !important;

    border: 2px solid var(--calc-element) !important;
    border-bottom-width: 5px !important;

    outline: none !important;
  }

  .calc-input::placeholder {
    color: var(--calc-element) !important;
    opacity: 0.25;
  }

  .calc-input:focus {
    border-color: var(--calc-element) !important;
    box-shadow: 0 5px 0 0 var(--calc-selected);
  }

  /* =====================================================
     RESULT VALUE BLOCK
  ===================================================== */

  .calc-value {
    display: inline-block;

    background: var(--calc-element);
    color: var(--calc-bg) !important;

    padding: 0.08em 0.25em;

    border: 2px solid var(--calc-element);
  }

  .calc-value * {
    color: var(--calc-bg) !important;
  }

  /* =====================================================
     RESULT HIGHLIGHT
  ===================================================== */

  .calc-highlight {
    display: inline-block;

    background: var(--calc-selected);
    color: var(--calc-element) !important;

    padding: 0.08em 0.25em;

    border: 2px solid var(--calc-element);
  }

  /* =====================================================
     HOVER
  ===================================================== */

  .calc-block-hover:hover {
    background: var(--calc-selected) !important;
    color: var(--calc-element) !important;
  }

  .calc-block-hover:hover * {
    color: var(--calc-element) !important;
  }

  /* =====================================================
     BMI SCALE

     Keep semantic color coding.
  ===================================================== */

  .bmi-under {
    background: #0ea5e9;
  }

  .bmi-healthy {
    background: #10b981;
  }

  .bmi-over {
    background: #f59e0b;
  }

  .bmi-obese {
    background: #f43f5e;
  }

  .bmi-under-text {
    color: #0284c7 !important;
  }

  .bmi-healthy-text {
    color: #047857 !important;
  }

  .bmi-over-text {
    color: #b45309 !important;
  }

  .bmi-obese-text {
    color: #be123c !important;
  }

  .bmi-marker {
    background: var(--calc-element) !important;
    border: 2px solid var(--calc-bg);
  }

  /* =====================================================
     SCROLLBAR
  ===================================================== */

  .custom-scrollbar::-webkit-scrollbar {
    width: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: var(--calc-bg);
    border-left: 2px solid var(--calc-element);
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--calc-element);
    border-radius: 0;
  }
.calc-number-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: var(--calc-element);
  color: var(--calc-bg) !important;

  border: 2px solid var(--calc-element);

  padding: 0.12em 0.3em;
  margin: 0 0.08em;

  line-height: 1;
  white-space: nowrap;
}

.calc-number-box * {
  color: var(--calc-bg) !important;
}
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--calc-selected);
  }
`}</style>

      {/* =====================================================
          HEADER
      ===================================================== */}

      {step > -1 && step < 6 && (
        <header className="calc-block flex h-16 shrink-0 items-center justify-between border-b-4 px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="calc-selected flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-[1.03]"
            >
              <ArrowLeft size={16} />

              <span className="hidden sm:inline">
                Back
              </span>
            </button>

            <span className="hidden text-sm font-bold uppercase tracking-widest opacity-60 md:block">
              Step {step + 1} of 6
            </span>
          </div>

          <button
            onClick={resetAll}
            className="calc-selected flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-[1.03]"
          >
            <RotateCcw size={14} />

            <span className="hidden sm:inline">
              Reset
            </span>
          </button>
        </header>
      )}

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {step < 6 ? (
            <motion.div
              key={step}
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -20,
              }}
              transition={{
                duration: 0.25,
              }}
              className="flex h-full w-full flex-col"
            >
              {/* =============================================
                  HERO
              ============================================= */}

              {step === -1 && (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <div className="flex w-full max-w-4xl flex-col items-center justify-center">
                    <h1 className="calc-text text-5xl font-black uppercase leading-none tracking-tighter sm:text-7xl md:text-8xl">
                      Health
                      <br />
                      Calculators
                    </h1>

                    <div className="mt-12 flex max-w-2xl flex-wrap justify-center gap-3">
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
                          className="calc-block border-2 px-4 py-2 text-xs font-bold uppercase tracking-widest md:text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={handleNext}
                      className="calc-selected mt-16 flex w-full max-w-xs items-center justify-between px-8 py-5 text-lg font-black uppercase tracking-widest transition-transform hover:scale-[1.03]"
                    >
                      <span>Start</span>

                      <ArrowRight
                        size={24}
                        strokeWidth={3}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* =============================================
                  WIZARD
              ============================================= */}

              {step > -1 && (
                <div className="mx-auto flex h-full w-full max-w-5xl flex-col p-6 md:p-12">
                  <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center">
                    {/* =========================================
                        GENDER
                    ========================================= */}

                    {step === 0 && (
                      <div className="w-full">
                        <h2 className="mb-16 text-center text-5xl font-black uppercase tracking-tighter md:text-7xl">
                          Gender
                        </h2>

                        <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
                          <button
                            onClick={() =>
                              setInputs(
                                (previous) => ({
                                  ...previous,
                                  gender:
                                    "male",
                                }),
                              )
                            }
                            className={`flex flex-col items-center justify-center gap-6 p-12 transition-all duration-200 ${
                              inputs.gender ===
                              "male"
                                ? "calc-selected scale-105"
                                : "calc-block opacity-70 hover:opacity-100"
                            }`}
                          >
                            <Mars
                              size={80}
                              strokeWidth={2}
                            />

                            <span className="text-3xl font-black uppercase tracking-widest">
                              Male
                            </span>
                          </button>

                          <button
                            onClick={() =>
                              setInputs(
                                (previous) => ({
                                  ...previous,
                                  gender:
                                    "female",
                                }),
                              )
                            }
                            className={`flex flex-col items-center justify-center gap-6 p-12 transition-all duration-200 ${
                              inputs.gender ===
                              "female"
                                ? "calc-selected scale-105"
                                : "calc-block opacity-70 hover:opacity-100"
                            }`}
                          >
                            <Venus
                              size={80}
                              strokeWidth={2}
                            />

                            <span className="text-3xl font-black uppercase tracking-widest">
                              Female
                            </span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* =========================================
                        AGE
                    ========================================= */}

                    {step === 1 && (
                      <div className="w-full max-w-lg text-center">
                        <h2 className="mb-12 text-5xl font-black uppercase tracking-tighter md:text-7xl">
                          Age
                        </h2>

                        <input
                          type="number"
                          inputMode="numeric"
                          value={
                            inputs.age === ""
                              ? ""
                              : inputs.age
                          }
                          onChange={(e) =>
                            setInputs(
                              (previous) => ({
                                ...previous,
                                age: parseNum(
                                  e.target
                                    .value,
                                  "int",
                                ),
                              }),
                            )
                          }
                          onKeyDown={
                            handleInputKeyDown
                          }
                          className={
                            giantInputStyle
                          }
                          placeholder="0"
                          autoFocus
                        />
                      </div>
                    )}

                    {/* =========================================
                        WEIGHT
                    ========================================= */}

                    {step === 2 && (
                      <div className="w-full max-w-lg text-center">
                        <h2 className="mb-12 text-5xl font-black uppercase tracking-tighter md:text-7xl">
                          Weight
                        </h2>

                        <input
                          type="number"
                          inputMode="decimal"
                          value={
                            inputs.weight === ""
                              ? ""
                              : inputs.weight
                          }
                          onChange={(e) =>
                            setInputs(
                              (previous) => ({
                                ...previous,
                                weight:
                                  parseNum(
                                    e.target
                                      .value,
                                    "float",
                                  ),
                              }),
                            )
                          }
                          onKeyDown={
                            handleInputKeyDown
                          }
                          className={
                            giantInputStyle
                          }
                          placeholder="0"
                          autoFocus
                        />

                        <p className="calc-muted mt-8 text-base font-bold uppercase tracking-widest">
                          Kilograms
                        </p>
                      </div>
                    )}

                    {/* =========================================
                        HEIGHT
                    ========================================= */}

                    {step === 3 && (
                      <div className="w-full max-w-3xl text-center">
                        <h2 className="mb-12 text-5xl font-black uppercase tracking-tighter md:text-7xl">
                          Height
                        </h2>

                        <div className="flex flex-col gap-8 md:flex-row md:gap-16">
                          <div className="flex-1">
                            <input
                              ref={feetRef}
                              type="number"
                              inputMode="numeric"
                              value={
                                inputs.feet ===
                                ""
                                  ? ""
                                  : inputs.feet
                              }
                              onChange={(
                                e,
                              ) =>
                                setInputs(
                                  (
                                    previous,
                                  ) => ({
                                    ...previous,
                                    feet:
                                      parseNum(
                                        e
                                          .target
                                          .value,
                                        "int",
                                      ),
                                  }),
                                )
                              }
                              onKeyDown={
                                handleInputKeyDown
                              }
                              className={
                                giantInputStyle
                              }
                              placeholder="5"
                              autoFocus
                            />

                            <p className="calc-muted mt-8 text-base font-bold uppercase tracking-widest">
                              Feet
                            </p>
                          </div>

                          <div className="flex-1">
                            <input
                              ref={
                                inchesRef
                              }
                              type="number"
                              inputMode="numeric"
                              value={
                                inputs.inches ===
                                ""
                                  ? ""
                                  : inputs.inches
                              }
                              onChange={(
                                e,
                              ) =>
                                setInputs(
                                  (
                                    previous,
                                  ) => ({
                                    ...previous,
                                    inches:
                                      parseNum(
                                        e
                                          .target
                                          .value,
                                        "int",
                                      ),
                                  }),
                                )
                              }
                              onKeyDown={
                                handleInputKeyDown
                              }
                              className={
                                giantInputStyle
                              }
                              placeholder="10"
                            />

                            <p className="calc-muted mt-8 text-base font-bold uppercase tracking-widest">
                              Inches
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* =========================================
                        ACTIVITY
                    ========================================= */}

                    {step === 4 && (
                      <div className="flex h-full w-full flex-col justify-center">
                        <h2 className="mb-12 shrink-0 text-center text-5xl font-black uppercase tracking-tighter md:text-7xl">
                          Activity
                        </h2>

                        <div className="flex w-full flex-col gap-4 md:flex-row">
                          {ACTIVITY_LEVELS.map(
                            (level) => {
                              const active =
                                inputs.activity ===
                                level.val;

                              const Icon =
                                level.icon;

                              return (
                                <button
                                  key={
                                    level.val
                                  }
                                  onClick={() =>
                                    setInputs(
                                      (
                                        previous,
                                      ) => ({
                                        ...previous,
                                        activity:
                                          level.val,
                                      }),
                                    )
                                  }
                                  className={`flex flex-1 flex-row items-center justify-start gap-4 p-6 transition-all duration-200 md:flex-col md:justify-center ${
                                    active
                                      ? "calc-selected z-10 scale-105 shadow-2xl"
                                      : "calc-block opacity-70 hover:opacity-100"
                                  }`}
                                >
                                  <Icon
                                    size={
                                      36
                                    }
                                    strokeWidth={
                                      2
                                    }
                                  />

                                  <div className="flex flex-col items-start text-left md:items-center md:text-center">
                                    <h3 className="text-lg font-black uppercase leading-tight tracking-widest md:text-xl">
                                      {
                                        level.label
                                      }
                                    </h3>

                                    <p className="mt-2 text-xs font-bold opacity-80">
                                      {
                                        level.desc
                                      }
                                    </p>
                                  </div>
                                </button>
                              );
                            },
                          )}
                        </div>
                      </div>
                    )}

                    {/* =========================================
                        GOAL
                    ========================================= */}

                    {step === 5 && (
                      <div className="flex h-full w-full flex-col justify-center">
                        <h2 className="mb-12 shrink-0 text-center text-5xl font-black uppercase tracking-tighter md:text-7xl">
                          Goal
                        </h2>

                        <div className="flex w-full flex-col gap-6 md:flex-row">
                          {GOALS.map(
                            (goal) => {
                              const active =
                                inputs.goal ===
                                goal.val;

                              const Icon =
                                goal.icon;

                              return (
                                <button
                                  key={
                                    goal.val
                                  }
                                  onClick={() =>
                                    setInputs(
                                      (
                                        previous,
                                      ) => ({
                                        ...previous,
                                        goal:
                                          goal.val,
                                      }),
                                    )
                                  }
                                  className={`flex flex-1 flex-row items-center justify-start gap-6 p-8 transition-all duration-200 md:flex-col md:justify-center ${
                                    active
                                      ? "calc-selected z-10 scale-105 shadow-2xl"
                                      : "calc-block opacity-70 hover:opacity-100"
                                  }`}
                                >
                                  <Icon
                                    size={
                                      48
                                    }
                                    strokeWidth={
                                      2
                                    }
                                  />

                                  <h3 className="text-left text-2xl font-black uppercase leading-tight tracking-widest md:text-center">
                                    {
                                      goal.label
                                    }
                                  </h3>
                                </button>
                              );
                            },
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* =========================================
                      NEXT BUTTON
                  ========================================= */}

                  <div className="mt-12 flex shrink-0 justify-center">
                    <button
                      onClick={handleNext}
                      disabled={!canNext}
                      className={`group flex w-full max-w-sm items-center justify-between p-6 text-xl font-black uppercase tracking-widest transition-all ${
                        canNext
                          ? "calc-selected hover:scale-[1.02]"
                          : "calc-block cursor-not-allowed opacity-30"
                      }`}
                    >
                      <span>
                        {step === 5
                          ? "See Results"
                          : "Next"}
                      </span>

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
            <ResultsView
              key="results-view"
              results={results}
              inputs={inputs}
              resetAll={resetAll}
              downloadReport={
                downloadReport
              }
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}