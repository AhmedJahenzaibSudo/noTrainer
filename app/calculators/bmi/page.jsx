"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Zap, Info, ChevronRight, Activity } from "lucide-react";

export default function BMIPage() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState("metric");
  const [result, setResult] = useState(null);

  const calculateBMI = () => {
    if (!weight || !height) return;
    let bmiValue = unit === "metric" 
      ? weight / ((height / 100) ** 2) 
      : (weight / (height ** 2)) * 703;

    const score = parseFloat(bmiValue.toFixed(1));
    let category, color, protocol, fact;

    if (score < 18.5) { category = "Underweight"; color = "#7EE8FA"; protocol = "Increase caloric density."; fact = "Muscle is 3x denser than fat."; }
    else if (score < 25) { category = "Optimal"; color = "#00F58C"; protocol = "Maintain equilibrium."; fact = "This is the metabolic sweet spot."; }
    else if (score < 30) { category = "Overweight"; color = "#FFE500"; protocol = "Increase cardio output."; fact = "BMI was invented in 1830!"; }
    else { category = "Obese"; color = "#FF6B4A"; protocol = "Consult a specialist."; fact = "A 5% drop aids heart health."; }

    setResult({ score, category, color, protocol, fact });
  };

  return (
    // ADDED: Solid background color + Architectural grid pattern
    <main className="min-h-screen bg-[#F0F0F0] text-black pt-20 pb-10 px-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-15" style={{ backgroundImage: 'linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* COMPACT HEADER */}
        <header className="flex justify-between items-end border-b-8 border-black pb-4 mb-8">
          <div>
            <div className="bg-black text-white px-3 py-1 inline-block font-black uppercase text-xs mb-2 shadow-[3px_3px_0_#00F58C]">
              Terminal v1.0 // BMI
            </div>
            <h1 className="text-5xl md:text-7xl font-[1000] uppercase tracking-tighter leading-none">
              BODY <span className="text-[#FF6B4A]">STATS</span>
            </h1>
          </div>
          <Activity size={48} strokeWidth={3} className="hidden md:block" />
        </header>

        {/* TWO-COLUMN DASHBOARD (Fits on one screen) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* INPUT SECTION (5 Cols) */}
          <section className="lg:col-span-5 border-4 border-black p-6 bg-white shadow-[8px_8px_0px_black]">
            <div className="flex gap-2 mb-6">
              {['metric', 'imperial'].map((u) => (
                <button
                  key={u}
                  onClick={() => { setUnit(u); setResult(null); }}
                  className={`flex-1 py-2 font-black uppercase border-2 border-black text-sm transition-all ${
                    unit === u ? "bg-black text-white" : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-black uppercase text-xs mb-1">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full border-4 border-black p-3 text-xl font-black focus:bg-[#7EE8FA] outline-none"
                    placeholder="00"
                  />
                </div>
                <div>
                  <label className="block font-black uppercase text-xs mb-1">Height ({unit === 'metric' ? 'cm' : 'in'})</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full border-4 border-black p-3 text-xl font-black focus:bg-[#7EE8FA] outline-none"
                    placeholder="00"
                  />
                </div>
              </div>

              <button
                onClick={calculateBMI}
                className="w-full bg-black text-white py-4 text-2xl font-black uppercase flex items-center justify-center gap-2 hover:bg-[#00F58C] hover:text-black transition-colors border-2 border-black"
              >
                Execute <ChevronRight size={28} />
              </button>
            </div>

            {/* QUICK LEGEND (Moved inside left column to save space) */}
            <div className="mt-8 pt-6 border-t-2 border-dashed border-black/20">
              <h4 className="text-xs font-black uppercase mb-3">Reference Ranges</h4>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#7EE8FA] border border-black"/> &lt; 18.5 Under</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#00F58C] border border-black"/> 18-25 Norm</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#FFE500] border border-black"/> 25-30 Over</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#FF6B4A] border border-black"/> 30+ Obese</div>
              </div>
            </div>
          </section>

          {/* RESULTS SECTION (7 Cols) */}
          <section className="lg:col-span-7 h-full">
            <AnimatePresence mode="wait">
              {!result ? (
                <div className="h-full min-h-[300px] border-4 border-dashed border-black/20 bg-black/5 flex flex-col items-center justify-center p-6 text-center">
                  <Calculator size={48} className="opacity-20 mb-2" />
                  <p className="font-black uppercase text-lg opacity-20 tracking-widest">Input Parameters Required</p>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="border-4 border-black p-6 shadow-[8px_8px_0px_black]" style={{ backgroundColor: result.color }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black uppercase text-sm italic">Diagnostic Result</span>
                      <Zap size={24} fill="black" />
                    </div>
                    <div className="flex items-baseline gap-4">
                      <div className="text-8xl font-[1000] tracking-tighter leading-none">{result.score}</div>
                      <div className="bg-black text-white px-3 py-1 font-black uppercase text-xl h-fit">
                        {result.category}
                      </div>
                    </div>
                    <div className="w-full h-6 border-[3px] border-black bg-white/40 mt-6 relative overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(result.score * 2.5, 100)}%` }} className="h-full bg-black" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-4 border-black p-4 bg-white shadow-[4px_4px_0px_black] flex items-start gap-3">
                      <div className="bg-black text-white p-1 border-2 border-black"><Activity size={18}/></div>
                      <div>
                        <h4 className="font-black uppercase text-[10px]">Protocol</h4>
                        <p className="font-bold text-xs leading-tight uppercase">{result.protocol}</p>
                      </div>
                    </div>
                    <div className="border-4 border-black p-4 bg-[#B197FC] shadow-[4px_4px_0px_black] flex items-start gap-3">
                      <div className="bg-white p-1 border-2 border-black"><Info size={18}/></div>
                      <div>
                        <h4 className="font-black uppercase text-[10px]">Stat Fact</h4>
                        <p className="font-bold text-xs leading-tight uppercase">{result.fact}</p>
                      </div>
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