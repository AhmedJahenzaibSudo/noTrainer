"use client";

import Link from "next/link";
import {
  Scale,
  Weight,
  Flame,
  PieChart,
  Dumbbell,
  Droplets,
  ArrowUpRight,
} from "lucide-react";

const TOOLS = [
  {
    title: "BMI Calculator",
    href: "/calculators/bmi",
    icon: Scale,
    desc: "Body Mass Index",
  },
  {
    title: "Ideal Weight",
    href: "/calculators/ibw",
    icon: Weight,
    desc: "Healthy Range Estimation",
  },
  {
    title: "Calorie Burn",
    href: "/calculators/calorie-burn",
    icon: Flame,
    desc: "TDEE & Daily Output",
  },
  {
    title: "Macro Split",
    href: "/calculators/macro",
    icon: PieChart,
    desc: "Nutrient Ratio Breakdown",
  },
  {
    title: "Protein Needs",
    href: "/calculators/protein",
    icon: Dumbbell,
    desc: "Optimal Intake Target",
  },
  {
    title: "Hydration",
    href: "/calculators/hydration",
    icon: Droplets,
    desc: "Daily Water Requirement",
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
      {/* Simple geometric background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10 p-8 md:p-16">
        {/* Header */}
        <header className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-4">
            Fitness<span className="text-yellow-400">Analytics</span>
          </h1>
          <div className="h-1 w-24 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 font-medium max-w-2xl mx-auto">
            Advanced biometric tools for performance optimization.
          </p>
        </header>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool, index) => {
            const Icon = tool.icon;
            
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative bg-yellow-400 border-4 border-black rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[200px]"
              >
                <div className="flex justify-between items-start">
                  {/* Icon */}
                  <div className="p-3 bg-black rounded-xl group-hover:scale-105 transition-transform">
                    <Icon size={24} className="text-yellow-400" strokeWidth={2} />
                  </div>
                  
                  <ArrowUpRight size={20} className="text-black" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-black mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-sm font-bold text-black">
                    {tool.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}