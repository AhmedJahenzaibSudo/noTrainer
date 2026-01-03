import React from "react";
import { Target } from "lucide-react";
import FrontView from "@/components/anatomy/FrontView";
import BackView from "@/components/anatomy/BackView";

export default function MuscleStep({
  view,
  setView,
  muscle,
  tooltip,
  highlightedMuscle,
  containerRef,
  onMuscleClick,
  onMouseMove,
  onMouseEnterMuscle,
  onMouseLeaveMuscle,
}) {
  return (
    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-3xl font-black text-black mb-4 md:mb-0 flex items-center gap-3">
          <Target size={32} strokeWidth={3} />
          SELECT MUSCLE
        </h2>

        <div className="flex bg-gray-100 border-4 border-black p-1 gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <button
            onClick={() => setView("front")}
            className={`px-6 py-2 font-black text-sm uppercase transition-all border-2 border-black ${
              view === "front"
                ? "bg-pink-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Front
          </button>
          <button
            onClick={() => setView("back")}
            className={`px-6 py-2 font-black text-sm uppercase transition-all border-2 border-black ${
              view === "back"
                ? "bg-pink-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Back
          </button>
        </div>
      </div>

      <div
        className="relative w-full max-w-md mx-auto"
        ref={containerRef}
        onMouseMove={onMouseMove}
      >
        {tooltip.show && (
          <div
            className="absolute bg-yellow-400 border-4 border-black text-black text-sm font-black px-4 py-2 z-50 pointer-events-none whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -120%)",
            }}
          >
            {tooltip.content}
          </div>
        )}

        {view === "front" ? (
          <FrontView
            onSelect={onMuscleClick}
            selectedMuscle={muscle}
            onHover={onMouseEnterMuscle}
            onLeave={onMouseLeaveMuscle}
            highlightedMuscle={highlightedMuscle}
          />
        ) : (
          <BackView
            onSelect={onMuscleClick}
            selectedMuscle={muscle}
            onHover={onMouseEnterMuscle}
            onLeave={onMouseLeaveMuscle}
            highlightedMuscle={highlightedMuscle}
          />
        )}
      </div>
    </div>
  );
}
