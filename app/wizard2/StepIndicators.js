import React from "react";
import { Check } from "lucide-react";

const StepIndicator = ({ num, label, active, selection, currentStep }) => (
  <div className="flex flex-col items-center">
    <div
      className={`w-14 h-14 border-4 border-black flex items-center justify-center text-lg font-black mb-2 transition-all ${
        active
          ? "bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-110"
          : "bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
      }`}
    >
      {currentStep > num ? <Check size={24} className="text-black" /> : num}
    </div>
    <span className="text-xs font-black uppercase tracking-wide mb-1">
      {label}
    </span>
    {selection && (
      <span className="text-xs font-bold text-pink-600 max-w-24 text-center truncate">
        {selection}
      </span>
    )}
  </div>
);

export default function StepIndicators({ step, muscle, equipment, category, level }) {
  return (
    <div className="bg-white border-4 border-black p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex justify-between max-w-3xl mx-auto">
        <StepIndicator
          num={1}
          label="Muscle"
          active={step >= 1}
          selection={muscle}
          currentStep={step}
        />
        <StepIndicator
          num={2}
          label="Gear"
          active={step >= 2}
          selection={equipment}
          currentStep={step}
        />
        <StepIndicator
          num={3}
          label="Type"
          active={step >= 3}
          selection={category}
          currentStep={step}
        />
        <StepIndicator
          num={4}
          label="Level"
          active={step >= 4}
          selection={level}
          currentStep={step}
        />
      </div>
    </div>
  );
}
