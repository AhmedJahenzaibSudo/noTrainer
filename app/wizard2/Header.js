import React from "react";
import { Zap, RefreshCw, Share2 } from "lucide-react";

export default function Header({ onReset, onShare }) {
  return (
    <div className="bg-white border-4 border-black p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-pink-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Zap size={36} className="text-black" strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight">
              WORKOUT WIZARD
            </h1>
            <p className="text-base font-bold text-black mt-1">
              Build your perfect routine
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onReset}
            className="bg-white hover:bg-gray-100 border-4 border-black text-black font-black py-3 px-5 text-sm transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 uppercase"
          >
            <RefreshCw size={18} strokeWidth={3} /> Reset
          </button>
          <button
            onClick={onShare}
            className="bg-blue-400 hover:bg-blue-500 border-4 border-black text-black font-black py-3 px-5 text-sm transition-all hover:translate-x-0.5 hover:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 uppercase"
          >
            <Share2 size={18} strokeWidth={3} /> Share
          </button>
        </div>
      </div>
    </div>
  );
}
