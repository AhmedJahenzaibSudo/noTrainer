"use client";
import React, { useState, useRef } from "react";

const MacroCalculator = () => {
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("maintain");
  const [activity, setActivity] = useState(1.55);
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  const handleCalculate = () => {
    if (!weight || weight <= 0) return;

    // Basic BMR formula for average male (you can adjust later)
    const bmr = 88.362 + 13.397 * weight + 4.799 * 175 - 5.677 * 30;
    let calories = bmr * activity;

    if (goal === "loss") calories -= 500;
    if (goal === "gain") calories += 300;

    let proteinPercent, carbsPercent, fatPercent;
    if (goal === "gain") {
      proteinPercent = 0.3;
      carbsPercent = 0.4;
      fatPercent = 0.3;
    } else if (goal === "loss") {
      proteinPercent = 0.35;
      carbsPercent = 0.35;
      fatPercent = 0.3;
    } else {
      proteinPercent = 0.25;
      carbsPercent = 0.45;
      fatPercent = 0.3;
    }

    const proteinCal = calories * proteinPercent;
    const carbsCal = calories * carbsPercent;
    const fatCal = calories * fatPercent;

    const proteinGrams = Math.round(proteinCal / 4);
    const carbsGrams = Math.round(carbsCal / 4);
    const fatGrams = Math.round(fatCal / 9);

    setResult({
      calories: Math.round(calories),
      protein: { grams: proteinGrams, percent: Math.round(proteinPercent * 100) },
      carbs: { grams: carbsGrams, percent: Math.round(carbsPercent * 100) },
      fat: { grams: fatGrams, percent: Math.round(fatPercent * 100) },
    });

    if (resultRef.current) {
      resultRef.current.classList.add("animate-pulse");
      setTimeout(() => resultRef.current.classList.remove("animate-pulse"), 500);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex flex-col items-center justify-center px-6 pb-16 pt-30">
      <div className="max-w-3xl w-full bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 md:p-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 text-[#c2c5ca]">
          Macro Nutrient Calculator
        </h1>

        <p className="text-center text-gray-300 mb-10 text-lg">
          Calculate your <span className="font-semibold text-[#c2c5ca]">daily macros</span> to
          achieve your fitness goal effectively.
        </p>

        {/* Input Fields */}
        <div className="space-y-6">
          {/* Weight */}
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

          {/* Goal */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c2c5ca]"
            >
              <option value="maintain">Maintain Weight</option>
              <option value="loss">Weight Loss</option>
              <option value="gain">Muscle Gain</option>
            </select>
          </div>

          {/* Activity */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Activity Level
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(parseFloat(e.target.value))}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c2c5ca]"
            >
              <option value="1.2">Sedentary</option>
              <option value="1.375">Lightly Active</option>
              <option value="1.55">Moderately Active</option>
              <option value="1.725">Very Active</option>
              <option value="1.9">Super Active</option>
            </select>
          </div>

          {/* Button */}
          <button
            onClick={handleCalculate}
            className="w-full py-3 mt-6 bg-[#c2c5ca] hover:bg-gray-200 text-black font-semibold rounded-lg transition shadow-lg"
          >
            Calculate Macros
          </button>
        </div>

        {/* Result */}
        {result && (
          <div
            ref={resultRef}
            className="mt-10 bg-gray-900 border border-gray-700 rounded-xl p-8 text-center transition-all"
          >
            <h2 className="text-2xl font-bold mb-3 text-[#c2c5ca]">
              Your Daily Macros
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              Total Calories:{" "}
              <span className="font-semibold text-white">
                {result.calories} kcal
              </span>
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 w-32 text-center">
                <p className="text-sm text-gray-400">Protein</p>
                <p className="text-2xl font-bold text-blue-400">
                  {result.protein.grams}g
                </p>
                <p className="text-xs text-gray-400">
                  {result.protein.percent}%
                </p>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 w-32 text-center">
                <p className="text-sm text-gray-400">Carbs</p>
                <p className="text-2xl font-bold text-green-400">
                  {result.carbs.grams}g
                </p>
                <p className="text-xs text-gray-400">
                  {result.carbs.percent}%
                </p>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 w-32 text-center">
                <p className="text-sm text-gray-400">Fats</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {result.fat.grams}g
                </p>
                <p className="text-xs text-gray-400">
                  {result.fat.percent}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MacroCalculator;
