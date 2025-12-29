import React from "react";
import { Activity, Trash2, Download, Dumbbell } from "lucide-react";

export default function RoutineBuilder({
  routine,
  onRemoveFromRoutine,
  onExportCSV,
}) {
  return (
    <div className="bg-white border-4 border-black p-6 mt-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-black text-black flex items-center gap-3 uppercase">
          <Activity size={32} strokeWidth={3} />
          Your Routine
        </h3>
        {routine.length > 0 && (
          <button
            onClick={() => onRemoveFromRoutine(-1)}
            className="bg-red-400 hover:bg-red-500 border-4 border-black text-black font-black py-2 px-4 text-sm transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 uppercase"
          >
            <Trash2 size={16} strokeWidth={3} /> Clear
          </button>
        )}
      </div>

      {routine.length === 0 ? (
        <div className="bg-blue-100 border-4 border-dashed border-black p-12 text-center">
          <Dumbbell
            size={64}
            className="mx-auto mb-4 text-black"
            strokeWidth={2}
          />
          <p className="text-black font-black text-xl">NO EXERCISES YET</p>
          <p className="text-black font-bold mt-2">
            Add exercises to build your routine!
          </p>
        </div>
      ) : (
        <ol className="space-y-3">
          {routine.map((item, index) => (
            <li
              key={index}
              className="bg-green-100 border-4 border-black p-4 flex flex-col sm:flex-row sm:items-center justify-between transition-all hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="mb-3 sm:mb-0 flex items-center gap-4">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg border-2 border-black">
                  {index + 1}
                </div>
                <div>
                  <div className="font-black text-black text-lg">
                    {item.name}
                  </div>
                  <div className="text-sm font-bold text-black">
                    {item.sets} sets × {item.reps} reps
                  </div>
                </div>
              </div>
              <button
                onClick={() => onRemoveFromRoutine(index)}
                className="bg-red-400 hover:bg-red-500 border-3 border-black text-black font-black py-2 px-4 text-sm transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 uppercase"
              >
                <Trash2 size={16} strokeWidth={3} /> Remove
              </button>
            </li>
          ))}
        </ol>
      )}

      {routine.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={onExportCSV}
            className="bg-green-400 hover:bg-green-500 border-4 border-black text-black font-black py-4 px-8 text-lg transition-all hover:translate-x-1 hover:translate-y-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 uppercase"
          >
            <Download size={24} strokeWidth={3} /> Export Routine
          </button>
        </div>
      )}
    </div>
  );
}
