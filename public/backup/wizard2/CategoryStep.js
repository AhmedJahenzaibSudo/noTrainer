import React from "react";

export default function CategoryStep({
  availableCategories,
  category,
  setCategory,
  exercisesForEquipment,
}) {
  return (
    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-3xl font-black text-black mb-6 text-center uppercase">
        Workout Type
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {availableCategories.map((opt) => {
          const exerciseCount = exercisesForEquipment.filter(
            (e) => e.category === opt
          ).length;

          return (
            <button
              key={opt}
              onClick={() => setCategory(opt)}
              className={`p-6 text-center font-black text-lg transition-all hover:translate-x-1 hover:translate-y-1 capitalize border-4 border-black ${
                category === opt
                  ? "bg-pink-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              <div className="mb-1">{opt}</div>
              <p className="text-xs font-bold opacity-70">
                {exerciseCount} exercises
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
