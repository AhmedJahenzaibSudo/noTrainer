"use client";
import React, { useState, useRef } from "react";

const ProteinCalculator = () => {
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("moderate");
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  const calculateProtein = () => {
    if (!weight || weight <= 0) return;

    // Recommended protein intake in grams per kg of body weight
    let multiplier = 0;
    if (activity === "sedentary") multiplier = 0.8;
    else if (activity === "moderate") multiplier = 1.2;
    else if (activity === "active") multiplier = 1.6;
    else if (activity === "athlete") multiplier = 2.0;

    const protein = (weight * multiplier).toFixed(1);
    setResult(protein);

    if (resultRef.current) {
      resultRef.current.classList.add("animate-pulse");
      setTimeout(() => resultRef.current.classList.remove("animate-pulse"), 500);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex flex-col items-center justify-center px-6 pb-16 pt-30">
      <div className="max-w-3xl w-full bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 md:p-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 text-[#c2c5ca]">
          Daily Protein Requirement
        </h1>

        <p className="text-center text-gray-300 mb-10 text-lg">
          Calculate your daily{" "}
          <span className="font-semibold text-[#c2c5ca]">protein intake</span>{" "}
          based on your weight and activity level.
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
              placeholder="Enter your weight in kg"
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
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="moderate">Moderate (3–5 days/week)</option>
              <option value="active">Active (daily exercise)</option>
              <option value="athlete">Athlete (intense training)</option>
            </select>
          </div>

          <button
            onClick={calculateProtein}
            className="w-full py-3 mt-6 bg-[#c2c5ca] hover:bg-gray-200 text-black font-semibold rounded-lg transition shadow-lg"
          >
            Calculate Protein
          </button>
        </div>

        {/* Result Section */}
        {result && (
          <div
            ref={resultRef}
            className="mt-10 bg-gray-900 border border-gray-700 rounded-xl p-8 text-center transition-all"
          >
            <h2 className="text-2xl font-bold mb-3 text-[#c2c5ca]">
              Your Daily Protein Need
            </h2>
            <p className="text-5xl font-extrabold text-white mb-3">
              {result} g/day
            </p>
            <p className="text-lg text-gray-300">
              Based on your{" "}
              <span className="font-semibold">{activity}</span> activity level
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProteinCalculator;
