import React from "react";
import { X, Star, Plus } from "lucide-react";
import RotatingImage from "./RotatingImage";

export default function ExerciseModal({
  exercise,
  isFavorited,
  onClose,
  onToggleFavorite,
  onAddToRoutine,
}) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border-4 border-black w-full max-w-5xl max-h-[90vh] overflow-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-yellow-400 border-b-4 border-black p-6 flex justify-between items-center z-10">
          <h2 className="text-3xl font-black text-black uppercase">
            {exercise.name}
          </h2>
          <button
            onClick={onClose}
            className="bg-white border-3 border-black text-black p-2 transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <X size={28} strokeWidth={3} />
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="h-80 mb-6">
                <RotatingImage images={exercise.images} name={exercise.name} />
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-blue-300 border-3 border-black text-black text-sm font-black uppercase">
                  {exercise.equipment || "BODYWEIGHT"}
                </span>
                <span className="px-4 py-2 bg-pink-300 border-3 border-black text-black text-sm font-black uppercase">
                  {exercise.category}
                </span>
                <span className="px-4 py-2 bg-green-300 border-3 border-black text-black text-sm font-black uppercase">
                  {exercise.level}
                </span>
              </div>
            </div>

            <div>
              <div className="bg-blue-100 border-4 border-black p-5 mb-6">
                <h3 className="text-xl font-black text-black mb-4 uppercase">
                  Instructions
                </h3>
                <ol className="list-decimal pl-5 space-y-2 text-base text-black font-bold">
                  {exercise.instructions?.map((ins, idx) => (
                    <li key={idx}>{ins}</li>
                  ))}
                </ol>
              </div>

              <div className="bg-pink-100 border-4 border-black p-5 mb-6">
                <h3 className="text-xl font-black text-black mb-4 uppercase">
                  Muscles
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="block text-sm font-black text-black mb-2 uppercase">
                      Primary
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {exercise.primaryMuscles?.map((muscle) => (
                        <span
                          key={muscle}
                          className="px-3 py-1 bg-yellow-400 border-3 border-black text-black text-sm font-bold uppercase"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                  {exercise.secondaryMuscles && (
                    <div>
                      <span className="block text-sm font-black text-black mb-2 uppercase">
                        Secondary
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {exercise.secondaryMuscles.map((muscle) => (
                          <span
                            key={muscle}
                            className="px-3 py-1 bg-white border-3 border-black text-black text-sm font-bold uppercase"
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onAddToRoutine}
                  className="flex-1 bg-pink-400 hover:bg-pink-500 border-4 border-black text-black font-black py-3 px-6 flex items-center justify-center gap-2 transition-all hover:translate-x-1 hover:translate-y-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] uppercase"
                >
                  <Plus size={22} strokeWidth={3} /> Add
                </button>
                <button
                  onClick={onToggleFavorite}
                  className={`px-6 py-3 font-black border-4 border-black flex items-center justify-center gap-2 transition-all hover:translate-x-1 hover:translate-y-1 uppercase ${
                    isFavorited
                      ? "bg-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  }`}
                >
                  <Star
                    size={22}
                    fill={isFavorited ? "#000" : "none"}
                    strokeWidth={2.5}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
