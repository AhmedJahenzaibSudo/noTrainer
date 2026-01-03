import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Zap, Play, Pause } from "lucide-react";
import ExerciseCard from "./ExerciseCard";

export default function ExerciseCarousel({
  exercises,
  favorites,
  onToggleFavorite,
  onAddToRoutine,
  onExerciseClick,
}) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  React.useEffect(() => {
    if (isPlaying && exercises.length > 1) {
      const interval = setInterval(() => {
        setCarouselIndex((prev) => (prev + 1) % exercises.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, exercises.length]);

  if (exercises.length === 0) {
    return (
      <div className="bg-white border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <Zap size={64} className="mx-auto mb-4 text-black" />
        <p className="text-black font-black text-xl">NO EXERCISES FOUND</p>
        <p className="text-black font-bold mt-2">Try different filters!</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative overflow-hidden">
        {exercises.map((ex, index) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            index={index}
            carouselIndex={carouselIndex}
            isFavorited={favorites[ex.id]}
            onToggleFavorite={() => onToggleFavorite(ex.id)}
            onAddToRoutine={() => onAddToRoutine(ex)}
            onClick={() => onExerciseClick(ex)}
          />
        ))}
      </div>

      {exercises.length > 1 && (
        <>
          <button
            onClick={() =>
              setCarouselIndex((prev) =>
                prev === 0 ? exercises.length - 1 : prev - 1
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-yellow-400 border-4 border-black text-black p-3 transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] z-10"
          >
            <ChevronLeft size={28} strokeWidth={3} />
          </button>
          <button
            onClick={() =>
              setCarouselIndex((prev) => (prev + 1) % exercises.length)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-yellow-400 border-4 border-black text-black p-3 transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] z-10"
          >
            <ChevronRight size={28} strokeWidth={3} />
          </button>
          <div className="flex justify-center mt-6 space-x-3">
            {exercises.map((_, index) => (
              <button
                key={index}
                onClick={() => setCarouselIndex(index)}
                className={`h-3 border-3 border-black transition-all ${
                  index === carouselIndex
                    ? "bg-pink-400 w-10 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white w-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute right-4 bottom-4 bg-white border-3 border-black text-black p-2 transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10"
          >
            {isPlaying ? (
              <Pause size={18} strokeWidth={3} />
            ) : (
              <Play size={18} strokeWidth={3} />
            )}
          </button>
        </>
      )}
    </div>
  );
}
