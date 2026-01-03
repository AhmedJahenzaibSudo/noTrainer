"use client";
import React from "react";
import Header from "./Header";
import StepIndicators from "./StepIndicators";
import MuscleStep from "./MuscleStep";
import EquipmentStep from "./EquipmentStep";
import CategoryStep from "./CategoryStep";
import LevelStep from "./LevelStep";
import ResultsStep from "./ResultsStep";
import NavigationFooter from "./NavigationFooter";
import ExerciseModal from "./ExerciseModal";
import { useWorkoutWizard } from "./useWorkoutWizard";

export default function WorkoutWizard() {
  const {
    step,
    view,
    setView,
    muscle,
    equipment,
    category,
    level,
    routine,
    favorites,
    selectedExercise,
    tooltip,
    highlightedMuscle,
    containerRef,
    handlers,
    derivedData,
  } = useWorkoutWizard();

  return (
    <div className="min-h-screen bg-yellow-50 text-black p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <Header
          onReset={handlers.handleReset}
          onShare={handlers.copyShareLink}
        />

        <StepIndicators
          step={step}
          muscle={muscle}
          equipment={equipment}
          category={category}
          level={level}
        />

        <div className="min-h-[500px]">
          {step === 1 && (
            <MuscleStep
              view={view}
              setView={setView}
              muscle={muscle}
              tooltip={tooltip}
              highlightedMuscle={highlightedMuscle}
              containerRef={containerRef}
              onMuscleClick={handlers.handleMuscleClick}
              onMouseMove={handlers.handleMouseMove}
              onMouseEnterMuscle={handlers.handleMouseEnterMuscle}
              onMouseLeaveMuscle={handlers.handleMouseLeaveMuscle}
            />
          )}

          {step === 2 && (
            <EquipmentStep
              availableEquipment={derivedData.availableEquipment}
              equipment={equipment}
              setEquipment={handlers.setEquipment}
              exercisesForMuscle={derivedData.exercisesForMuscle}
            />
          )}

          {step === 3 && (
            <CategoryStep
              availableCategories={derivedData.availableCategories}
              category={category}
              setCategory={handlers.setCategory}
              exercisesForEquipment={derivedData.exercisesForEquipment}
            />
          )}

          {step === 4 && (
            <LevelStep
              availableLevels={derivedData.availableLevels}
              level={level}
              setLevel={handlers.setLevel}
            />
          )}

          {step === 5 && (
            <ResultsStep
              finalExercises={derivedData.finalExercises}
              routine={routine}
              favorites={favorites}
              onToggleFavorite={handlers.toggleFavorite}
              onAddToRoutine={handlers.addToRoutine}
              onRemoveFromRoutine={handlers.removeFromRoutine}
              onExportCSV={handlers.exportCSV}
              onExerciseClick={handlers.setSelectedExercise}
            />
          )}
        </div>

        {step < 5 && (
          <NavigationFooter
            step={step}
            canProceed={handlers.canProceed()}
            onPrev={handlers.prevStep}
            onNext={handlers.nextStep}
          />
        )}
      </div>

      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          isFavorited={favorites[selectedExercise.id]}
          onClose={() => handlers.setSelectedExercise(null)}
          onToggleFavorite={() => handlers.toggleFavorite(selectedExercise.id)}
          onAddToRoutine={() => {
            handlers.addToRoutine(selectedExercise);
            handlers.setSelectedExercise(null);
          }}
        />
      )}
    </div>
  );
}
