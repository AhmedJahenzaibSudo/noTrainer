import React from "react";
import ExerciseCarousel from "./ExerciseCarousel";
import RoutineBuilder from "./RoutineBuilder";

export default function ResultsStep({
  finalExercises,
  routine,
  favorites,
  onToggleFavorite,
  onAddToRoutine,
  onRemoveFromRoutine,
  onExportCSV,
  onExerciseClick,
}) {
  return (
    <div>
      <div className="bg-white border-4 border-black p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
        <h2 className="text-3xl font-black text-black uppercase">
          Your Exercises
        </h2>
        <p className="text-lg font-bold mt-2">
          Found {finalExercises.length} exercise
          {finalExercises.length !== 1 ? "s" : ""}
        </p>
      </div>

      <ExerciseCarousel
        exercises={finalExercises}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onAddToRoutine={onAddToRoutine}
        onExerciseClick={onExerciseClick}
      />

      <RoutineBuilder
        routine={routine}
        onRemoveFromRoutine={onRemoveFromRoutine}
        onExportCSV={onExportCSV}
      />
    </div>
  );
}
