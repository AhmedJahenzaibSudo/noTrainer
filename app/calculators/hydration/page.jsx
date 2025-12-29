"use client";
import React, { useState, useRef } from "react";

const HydrationCalculator = () => {
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("1.4");
  const [climate, setClimate] = useState("1.0");
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  const calculateHydration = () => {
    if (!weight || weight <= 0) return;

    const baseWater = weight * 0.033; // 33ml per kg
    const totalWater = baseWater * activity * climate;
    const liters = totalWater.toFixed(1);
    const glasses = Math.round(totalWater / 0.25);
    const ounces = Math.round(totalWater * 33.814);

    setResult({ liters, glasses, ounces });

    if (resultRef.current) {
      resultRef.current.classList.add("animate-pulse");
      setTimeout(() => resultRef.current.classList.remove("animate-pulse"), 500);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex flex-col items-center justify-center px-6 py-30">
      <div className="max-w-3xl w-full bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 md:p-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 text-[#c2c5ca]">
          Hydration Calculator 💧
        </h1>

        <p className="text-center text-gray-300 mb-10 text-lg">
          Estimate your daily <span className="font-semibold text-[#c2c5ca]">water intake</span> based on weight, activity level, and climate.
        </p>

        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Weight (in kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your weight"
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c2c5ca] placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Activity Level
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c2c5ca]"
            >
              <option value="1.0">Sedentary</option>
              <option value="1.2">Lightly Active</option>
              <option value="1.4">Moderately Active</option>
              <option value="1.6">Very Active</option>
              <option value="1.8">Extremely Active</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Climate
            </label>
            <select
              value={climate}
              onChange={(e) => setClimate(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c2c5ca]"
            >
              <option value="1.0">Temperate</option>
              <option value="1.1">Warm</option>
              <option value="1.2">Hot</option>
              <option value="1.3">Very Hot</option>
            </select>
          </div>

          <button
            onClick={calculateHydration}
            className="w-full py-3 mt-6 bg-[#c2c5ca] hover:bg-gray-200 text-black font-semibold rounded-lg transition shadow-lg"
          >
            Calculate Hydration
          </button>
        </div>

        {/* Result Section */}
        {result && (
          <div
            ref={resultRef}
            className="mt-10 bg-gray-900 border border-gray-700 rounded-xl p-8 text-center transition-all"
          >
            <h2 className="text-2xl font-bold mb-3 text-[#c2c5ca]">
              Your Daily Water Needs
            </h2>
            <p className="text-5xl font-extrabold text-white mb-3">
              {result.liters} L/day
            </p>
            <p className="text-lg text-gray-300 mb-2">
              ≈ {result.glasses} glasses or {result.ounces} oz
            </p>
            <p className="text-sm text-gray-400">
              Based on weight, activity level & climate
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default HydrationCalculator;
