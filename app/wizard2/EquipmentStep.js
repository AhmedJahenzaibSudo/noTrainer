import React from "react";
import {
  Dumbbell,
  Barbell,
  Weight,
  GitPullRequest,
  Activity,
  Coffee,
  Users,
  Wind,
  BookOpen,
} from "lucide-react";

const equipmentIcons = {
  dumbbell: Dumbbell,
  barbell: Barbell,
  machine: Weight,
  cable: GitPullRequest,
  bodyweight: Activity,
  bench: Coffee,
  "pull-up bar": Users,
  "resistance band": Wind,
  kettlebell: BookOpen,
};

export default function EquipmentStep({
  availableEquipment,
  equipment,
  setEquipment,
  exercisesForMuscle,
}) {
  return (
    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-3xl font-black text-black mb-6 text-center uppercase">
        Choose Equipment
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {availableEquipment.map((opt) => {
          const Icon = equipmentIcons[opt.toLowerCase()] || Dumbbell;
          const exerciseCount = exercisesForMuscle.filter(
            (e) => e.equipment === opt
          ).length;

          return (
            <button
              key={opt}
              onClick={() => setEquipment(opt)}
              className={`p-5 text-left font-bold text-base transition-all hover:translate-x-1 hover:translate-y-1 border-4 border-black ${
                equipment === opt
                  ? "bg-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon size={28} strokeWidth={2.5} />
                <span className="capitalize font-black">{opt}</span>
              </div>
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
