import React from "react";

export default function LevelStep({ availableLevels, level, setLevel }) {
  return (
    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-3xl font-black text-black mb-6 text-center uppercase">
        Your Level
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {availableLevels.map((opt) => {
          const isActive = level === opt;
          let bgColor;

          if (opt === "beginner") bgColor = "bg-green-400";
          else if (opt === "intermediate") bgColor = "bg-yellow-400";
          else bgColor = "bg-pink-400";

          return (
            <button
              key={opt}
              onClick={() => setLevel(opt)}
              className={`p-10 flex flex-col items-center justify-center font-black text-2xl transition-all hover:translate-x-1 hover:translate-y-1 capitalize border-4 border-black ${bgColor} ${
                isActive
                  ? "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-105"
                  : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] opacity-60"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
