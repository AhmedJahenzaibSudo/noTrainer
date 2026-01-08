"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Scale, Ruler, RefreshCw, CheckCircle, Info, AlertTriangle, XCircle } from "lucide-react";

// Configuration for Categories used in the Chart
const CATEGORIES = [
  {
    key: "underweight",
    label: "Underweight",
    range: "< 18.5",
    color: "border-cyan-500 text-cyan-500",
    bgGradient: "from-cyan-500/20 to-blue-500/20",
    glow: "shadow-[0_0_30px_rgba(6,182,212,0.3)]",
    icon: <AlertTriangle size={20} />,
    advice: "Consider increasing caloric intake with nutrient-rich foods.",
  },
  {
    key: "normal",
    label: "Normal",
    range: "18.5 - 24.9",
    color: "border-emerald-500 text-emerald-500",
    bgGradient: "from-emerald-500/20 to-teal-500/20",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.3)]",
    icon: <CheckCircle size={20} />,
    advice: "Great job! Keep up your balanced lifestyle.",
  },
  {
    key: "overweight",
    label: "Overweight",
    range: "25 - 29.9",
    color: "border-amber-500 text-amber-500",
    bgGradient: "from-amber-500/20 to-orange-500/20",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.3)]",
    icon: <Info size={20} />,
    advice: "Increase physical activity and monitor your diet.",
  },
  {
    key: "obese",
    label: "Obese",
    range: "30+",
    color: "border-red-500 text-red-500",
    bgGradient: "from-red-500/20 to-rose-500/20",
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.3)]",
    icon: <XCircle size={20} />,
    advice: "Consult a healthcare provider for a tailored plan.",
  },
];

export default function BMIPage() {
  const [weight, setWeight] = useState(""); 
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateBMI = () => {
    setError("");
    setResult(null);

    if (!weight || !heightFt) {
      setError("Please enter both weight and height.");
      return;
    }

    const w = parseFloat(weight);
    const ft = parseFloat(heightFt);
    const inches = parseFloat(heightIn || 0);

    if (w <= 0 || ft < 0) {
      setError("Please enter valid positive numbers.");
      return;
    }

    setIsCalculating(true);

    setTimeout(() => {
      const totalInches = (ft * 12) + inches;
      const heightMeters = totalInches * 0.0254;
      const bmi = w / (heightMeters * heightMeters);
      const score = parseFloat(bmi.toFixed(1));

      let categoryKey = "underweight";
      if (score >= 18.5 && score < 25) categoryKey = "normal";
      else if (score >= 25 && score < 30) categoryKey = "overweight";
      else if (score >= 30) categoryKey = "obese";

      setResult({ score, categoryKey });
      setIsCalculating(false);
    }, 600);
  };

  const reset = () => {
    setWeight("");
    setHeightFt("");
    setHeightIn("");
    setResult(null);
    setError("");
  };

  // Find the active category object based on result
  const activeCategoryData = result 
    ? CATEGORIES.find(c => c.key === result.categoryKey) 
    : null;

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-pink-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        
        <header className="mb-20 text-center">
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white mb-4">
            BMI<span className="text-neutral-600">.</span>Check
          </h1>
          <p className="text-neutral-400 text-lg font-light tracking-wide">
            Simple. Accurate. Fast.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* --- INPUTS --- */}
          <section className="lg:col-span-4">
            <div className="sticky top-8 bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
              
              <div className="space-y-8">
                {/* Weight */}
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Weight (kg)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="70"
                      className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-4 text-4xl font-bold text-white focus:border-white focus:bg-neutral-900 transition-all outline-none placeholder-neutral-800"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 font-bold text-sm uppercase">kg</span>
                  </div>
                </div>

                {/* Height */}
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Height (ft + in)</label>
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={heightFt}
                        onChange={(e) => setHeightFt(e.target.value)}
                        placeholder="5"
                        className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-4 text-4xl font-bold text-white focus:border-white focus:bg-neutral-900 transition-all outline-none placeholder-neutral-800 text-center"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 font-bold text-sm uppercase">ft</span>
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={heightIn}
                        onChange={(e) => setHeightIn(e.target.value)}
                        placeholder="9"
                        className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-4 text-4xl font-bold text-white focus:border-white focus:bg-neutral-900 transition-all outline-none placeholder-neutral-800 text-center"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 font-bold text-sm uppercase">in</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-10 flex gap-4">
                <button
                  onClick={calculateBMI}
                  disabled={isCalculating}
                  className="flex-1 bg-white text-black py-5 text-lg font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
                >
                  {isCalculating ? "Calculating" : "Analyze"}
                </button>
                <button
                  onClick={reset}
                  className="px-5 bg-neutral-900 border border-white/10 rounded-xl hover:bg-neutral-800 transition-all"
                >
                  <RefreshCw size={20} className="text-neutral-400" />
                </button>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-red-400 text-sm font-medium text-center bg-red-500/10 py-3 rounded-lg border border-red-500/20">
                  {error}
                </motion.div>
              )}
            </div>
          </section>

          {/* --- RESULTS --- */}
          <section className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[500px] border border-white/5 rounded-3xl flex flex-col items-center justify-center bg-white/[0.02]"
                >
                  <Activity size={48} className="text-neutral-700 mb-6" />
                  <p className="text-neutral-500 font-medium">Enter your details to view results</p>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Main Score Card */}
                  <div className={`relative p-8 md:p-10 rounded-3xl border border-white/10 overflow-hidden bg-gradient-to-br ${activeCategoryData?.bgGradient} ${activeCategoryData?.glow} backdrop-blur-md`}>
                    
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-[#0A0A0A] rounded-2xl border border-white/10">
                        {activeCategoryData?.icon}
                      </div>
                      <span className="text-sm font-bold uppercase tracking-widest text-neutral-400">
                        Result
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                      <div>
                        <div className="text-[120px] leading-none font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                          {result.score}
                        </div>
                        <div className="text-4xl font-bold text-white mt-2 tracking-tight">
                          {activeCategoryData?.label}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* THE CATEGORY CHART */}
                  <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-3xl">
                    <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6 pl-1">Category Chart</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {CATEGORIES.map((cat) => {
                        const isActive = result.categoryKey === cat.key;
                        
                        return (
                          <motion.div
                            key={cat.key}
                            whileHover={{ scale: 1.02 }}
                            className={`
                              relative p-6 rounded-2xl border transition-all duration-500
                              ${isActive 
                                ? `${cat.color} ${cat.bgGradient} ${cat.glow} border-opacity-50 bg-opacity-50 scale-105` 
                                : `border-white/5 bg-white/5 opacity-40 hover:opacity-60`
                              }
                            `}
                          >
                            {isActive && (
                              <div className="absolute top-3 right-3">
                                <CheckCircle size={16} className="text-white drop-shadow-md" />
                              </div>
                            )}
                            <div className="mb-2">
                              <span className="text-xs font-bold uppercase tracking-wider block mb-1 opacity-70">
                                Range
                              </span>
                              <span className={`text-2xl font-black ${isActive ? 'text-white' : 'text-neutral-400'}`}>
                                {cat.range}
                              </span>
                            </div>
                            <div>
                              <span className={`text-lg font-bold uppercase ${isActive ? 'text-white' : 'text-neutral-500'}`}>
                                {cat.label}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Advice Card */}
                  <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl flex items-start gap-6 hover:border-white/20 transition-colors">
                    <div className="p-3 bg-white/5 rounded-xl text-neutral-400">
                      <Activity size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Recommendation</p>
                      <p className="text-xl font-medium text-white leading-snug">
                        {activeCategoryData?.advice}
                      </p>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </main>
  );
}