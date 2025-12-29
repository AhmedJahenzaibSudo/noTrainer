import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function NavigationFooter({ step, canProceed, onPrev, onNext }) {
  return (
    <div className="bg-white border-4 border-black p-4 mt-6 flex flex-col sm:flex-row sm:justify-between items-center gap-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <button
        onClick={onPrev}
        disabled={step === 1}
        className={`py-3 px-6 font-black text-base flex items-center gap-2 border-4 border-black uppercase transition-all ${
          step === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-50 hover:translate-x-0.5 hover:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        }`}
      >
        <ChevronLeft size={20} strokeWidth={3} /> Back
      </button>

      <div className="text-base font-black text-black uppercase">
        Step {step} / 4
      </div>

      <button
        onClick={onNext}
        disabled={!canProceed}
        className={`py-3 px-6 font-black text-base flex items-center gap-2 border-4 border-black uppercase transition-all ${
          !canProceed
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-yellow-400 hover:bg-yellow-500 hover:translate-x-0.5 hover:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        }`}
      >
        {step === 4 ? "See Results" : "Next"}{" "}
        <ChevronRight size={20} strokeWidth={3} />
      </button>
    </div>
  );
}
