import React from "react";
import { Star, Plus } from "lucide-react";
import RotatingImage from "./RotatingImage";

export default function ExerciseCard({
  exercise,
  index,
  carouselIndex,
  isFavorited,
  onToggleFavorite,
  onAddToRoutine,
  onClick,
}) {
  if (index !== carouselIndex) return null;

  return (
    <div
      className="bg-white border-4 border-black p-6 cursor-pointer transition-all hover:translate-x-1 hover:translate-y-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-52 h-52">
          <RotatingImage images={exercise.images} name={exercise.name} />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-black text-2xl text-black leading-tight">
              {exercise.name}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className={`p-2 border-4 border-black transition-all hover:translate-x-0.5 hover:translate-y-0.5 ${
                isFavorited
                  ? "bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              <Star
                size={20}
                fill={isFavorited ? "#000" : "none"}
                className="text-black"
              />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-300 border-3 border-black text-black text-sm font-black uppercase">
              {exercise.equipment || "BODYWEIGHT"}
            </span>
            <span className="px-3 py-1 bg-pink-300 border-3 border-black text-black text-sm font-black uppercase">
              {exercise.category}
            </span>
            <span className="px-3 py-1 bg-green-300 border-3 border-black text-black text-sm font-black uppercase">
              {exercise.level}
            </span>
          </div>

          <div className="mb-4">
            <span className="block text-xs font-black text-black mb-2 tracking-wider">
              PRIMARY MUSCLES
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

          <div className="flex justify-between items-center pt-4 border-t-4 border-black">
            <p className="text-sm font-bold text-black">
              Click for details →
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToRoutine();
              }}
              className="bg-pink-400 hover:bg-pink-500 border-4 border-black text-black font-black py-2 px-5 text-sm transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 uppercase"
            >
              <Plus size={18} strokeWidth={3} /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
