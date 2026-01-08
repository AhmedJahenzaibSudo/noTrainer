"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ruler, Venus, Mars, Activity, RefreshCw, CheckCircle } from "lucide-react";

export default function IBWCalculator() {
  const [gender, setGender] = useState("male");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  
  const [result, setResult] = useState(null);

  const calculateIBW = () => {
    if (!heightFt) return;

    const ft = parseFloat(heightFt);
    const inches = parseFloat(heightIn || 0);
    
    if (ft < 0 || inches < 0) return;

    // Convert to total inches
    const totalInches = (ft * 12) + inches;
    
    let ibw = 0;

    // Devine Formula (Output in KG)
    if (gender === "male") {
      ibw = 50 + 2.3 * (totalInches - 60);
    } else {
      ibw = 45.5 + 2.3 * (totalInches - 60);
    }

    setResult({
      value: ibw.toFixed(1),
      displayHeight: `${ft}' ${inches}"`,
      gender: gender
    });
  };

  const reset = () => {
    setHeightFt("");
    setHeightIn("");
    setGender("male");
    setResult(null);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 flex flex-col justify-center min-h-screen">
        
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white mb-4">
            Ideal <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Weight</span>
          </h1>
          <p className="text-neutral-400 text-lg font-light tracking-wide">
            Calculated using the standard Devine Formula.
          </p>
        </header>

        {/* Main Card */}
        <div className="bg-[#0A0A0A] border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            
            {/* Inputs */}
            <div className="space-y-8">
              {/* Gender Toggle */}
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Gender</label>
                <div className="grid grid-cols-2 gap-3 bg-neutral-900/50 p-1 rounded-xl border border-white/5">
                  <button
                    onClick={() => setGender("male")}
                    className={`py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-all duration-300 ${gender === "male" ? "bg-white text-black shadow-lg" : "text-neutral-500 hover:text-white"}`}
                  >
                    <Mars size={18} /> Male
                  </button>
                  <button
                    onClick={() => setGender("female")}
                    className={`py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-all duration-300 ${gender === "female" ? "bg-white text-black shadow-lg" : "text-neutral-500 hover:text-white"}`}
                  >
                    <Venus size={18} /> Female
                  </button>
                </div>
              </div>

              {/* Height Input (Ft/In) */}
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Height (ft + in)</label>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      placeholder="5"
                      className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-4 text-4xl font-bold text-white focus:border-blue-500 focus:bg-neutral-900 transition-all outline-none placeholder-neutral-800 text-center"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 font-bold text-sm uppercase">ft</span>
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      placeholder="9"
                      className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-4 text-4xl font-bold text-white focus:border-blue-500 focus:bg-neutral-900 transition-all outline-none placeholder-neutral-800 text-center"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 font-bold text-sm uppercase">in</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={calculateIBW}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 text-lg font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                >
                  Calculate
                </button>
                <button
                  onClick={reset}
                  className="px-5 bg-neutral-900 border border-white/10 rounded-xl hover:bg-neutral-800 transition-all"
                >
                  <RefreshCw size={20} className="text-neutral-400" />
                </button>
              </div>
            </div>

            {/* Result Display */}
            <div className="flex items-center justify-center bg-white/[0.02] rounded-3xl border border-white/5">
              <AnimatePresence mode="wait">
                {!result ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center p-8"
                  >
                    <Activity size={48} className="text-neutral-700 mx-auto mb-4" />
                    <p className="text-neutral-500 font-medium">Enter height to see result</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center w-full p-8"
                  >
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5">
                      <CheckCircle size={14} className="text-green-400" />
                      <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                        Based on {result.displayHeight}
                      </span>
                    </div>

                    <div className="text-[80px] leading-none font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2">
                      {result.value}
                    </div>
                    <div className="text-2xl font-bold text-neutral-300 mb-6">Kilograms</div>

                    <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                      <p className="text-sm text-neutral-400 leading-relaxed">
                        The estimated ideal weight for a <span className="text-white font-bold capitalize">{result.gender}</span> of this height according to the <span className="text-blue-400 font-semibold">Devine Formula</span>.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}