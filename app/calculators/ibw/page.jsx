"use client";
import React, { useState, useRef } from "react";

const IBWCalculator = () => {
  const [heightCm, setHeightCm] = useState("");
  const [gender, setGender] = useState("male");
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  const calculateIBW = () => {
    if (!heightCm || heightCm <= 0) return;

    const heightInInches = heightCm / 2.54;
    let ibw = 0;

    if (gender === "male") {
      ibw = 50 + 2.3 * (heightInInches - 60);
    } else {
      ibw = 45.5 + 2.3 * (heightInInches - 60);
    }

    const roundedIBW = ibw.toFixed(1);
    setResult(roundedIBW);

    if (resultRef.current) {
      resultRef.current.classList.add("animate-pulse");
      setTimeout(() => resultRef.current.classList.remove("animate-pulse"), 500);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex flex-col items-center justify-center px-6 pt-30 pb-16">
      <div className="max-w-3xl w-full bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 md:p-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 text-[#c2c5ca]">
          Ideal Body Weight (IBW)
        </h1>

        <p className="text-center text-gray-300 mb-10 text-lg">
          Discover your ideal weight using the{" "}
          <span className="font-semibold text-[#c2c5ca]">Devine Formula</span>.
        </p>

        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Height (in cm)
            </label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="Enter your height in cm"
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c2c5ca] placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c2c5ca]"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <button
            onClick={calculateIBW}
            className="w-full py-3 mt-6 bg-[#c2c5ca] hover:bg-gray-200 text-black font-semibold rounded-lg transition shadow-lg"
          >
            Calculate IBW
          </button>
        </div>

        {/* Result Section */}
        {result && (
          <div
            ref={resultRef}
            className="mt-10 bg-gray-900 border border-gray-700 rounded-xl p-8 text-center transition-all"
          >
            <h2 className="text-2xl font-bold mb-3 text-[#c2c5ca]">
              Your Ideal Body Weight
            </h2>
            <p className="text-5xl font-extrabold text-white mb-3">
              {result} kg
            </p>
            <p className="text-lg text-gray-300">
              For a <span className="font-semibold">{gender}</span> based on the
              <span className="text-[#c2c5ca] font-semibold"> Devine Method</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default IBWCalculator;
