"use client";
import React, { useState, useRef } from "react";

const CalorieBurnCalculator = () => {
  const [weight, setWeight] = useState("");
  const [duration, setDuration] = useState("");
  const [activity, setActivity] = useState("Running");
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  const activityData = {
    Running: 8,
    Walking: 3.5,
    Cycling: 6,
    Swimming: 7,
    Yoga: 2.5,
    "Weight Training": 5,
    Dancing: 4.5,
    Hiking: 5.5,
  };

  const calculateCalories = () => {
    if (!weight || !duration || weight <= 0 || duration <= 0) return;

    const met = activityData[activity];
    const calories = Math.round(met * weight * (duration / 60));

    setResult(calories);

    if (resultRef.current) {
      resultRef.current.classList.add("animate-pulse");
      setTimeout(
        () => resultRef.current.classList.remove("animate-pulse"),
        500
      );
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex flex-col items-center justify-center px-6 pb-16 pt-30">
      <div className="max-w-3xl w-full bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 md:p-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 text-[#c2c5ca]">
          Calorie Burn Calculator
        </h1>

        <p className="text-center text-gray-300 mb-10 text-lg">
          Estimate how many calories you burn based on your{" "}
          <span className="font-semibold text-[#c2c5ca]">
            weight, activity, and duration
          </span>
          .
        </p>

        {/* Input Fields */}
        <div className="space-y-6">
          {/* Weight Input */}
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

          {/* Activity Select */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Activity Type
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c2c5ca]"
            >
              {Object.keys(activityData).map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Input */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Duration (in minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter duration"
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c2c5ca] placeholder-gray-500"
            />
          </div>

          {/* Calculate Button */}
          <button
            onClick={calculateCalories}
            className="w-full py-3 mt-6 bg-[#c2c5ca] hover:bg-gray-200 text-black font-semibold rounded-lg transition shadow-lg"
          >
            Calculate Calories Burned
          </button>
        </div>

        {/* Result Section */}
        {result && (
          <div
            ref={resultRef}
            className="mt-10 bg-gray-900 border border-gray-700 rounded-xl p-8 text-center transition-all"
          >
            <h2 className="text-2xl font-bold mb-3 text-[#c2c5ca]">
              Calories Burned
            </h2>
            <p className="text-5xl font-extrabold text-white mb-3">
              {result} kcal
            </p>
            <p className="text-lg text-gray-300">
              You burned approximately{" "}
              <span className="font-semibold text-[#c2c5ca]">{result}</span> kcal
              doing <span className="font-semibold">{activity}</span> for{" "}
              <span className="font-semibold">{duration}</span> minutes at{" "}
              <span className="font-semibold">{weight}</span> kg body weight.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CalorieBurnCalculator;
