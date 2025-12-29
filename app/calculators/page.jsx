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
    // New color themes for bright mode
    theme: {
      cardBg: "bg-gradient-to-br from-white via-lime-50 to-lime-100/50",
      border: "border-lime-200 hover:border-lime-400",
      iconBg: "bg-lime-100 text-lime-600",
      titleColor: "text-gray-900",
      descColor: "text-lime-700",
      shadow: "hover:shadow-lime-200/50",
    }
  },
  {
    title: "Ideal Weight",
    href: "/calculators/ibw",
    icon: Weight,
    desc: "Healthy Range Estimation",
    theme: {
      cardBg: "bg-gradient-to-br from-white via-sky-50 to-sky-100/50",
      border: "border-sky-200 hover:border-sky-400",
      iconBg: "bg-sky-100 text-sky-600",
      titleColor: "text-gray-900",
      descColor: "text-sky-700",
      shadow: "hover:shadow-sky-200/50",
      }
  },
  {
    title: "Calorie Burn",
    href: "/calculators/calorie-burn",
    icon: Flame,
    desc: "TDEE & Daily Output",
    theme: {
      cardBg: "bg-gradient-to-br from-white via-orange-50 to-orange-100/50",
      border: "border-orange-200 hover:border-orange-400",
      iconBg: "bg-orange-100 text-orange-600",
      titleColor: "text-gray-900",
      descColor: "text-orange-700",
      shadow: "hover:shadow-orange-200/50",
      }
  },
  {
    title: "Macro Split",
    href: "/calculators/macro",
    icon: PieChart,
    desc: "Nutrient Ratio Breakdown",
    theme: {
      cardBg: "bg-gradient-to-br from-white via-violet-50 to-violet-100/50",
      border: "border-violet-200 hover:border-violet-400",
      iconBg: "bg-violet-100 text-violet-600",
      titleColor: "text-gray-900",
      descColor: "text-violet-700",
      shadow: "hover:shadow-violet-200/50",
      }
  },
  {
    title: "Protein Needs",
    href: "/calculators/protein",
    icon: Dumbbell,
    desc: "Optimal Intake Target",
    theme: {
      cardBg: "bg-gradient-to-br from-white via-rose-50 to-rose-100/50",
      border: "border-rose-200 hover:border-rose-400",
      iconBg: "bg-rose-100 text-rose-600",
      titleColor: "text-gray-900",
      descColor: "text-rose-700",
      shadow: "hover:shadow-rose-200/50",
      }
  },
  {
    title: "Hydration",
    href: "/calculators/hydration",
    icon: Droplets,
    desc: "Daily Water Requirement",
    theme: {
      cardBg: "bg-gradient-to-br from-white via-cyan-50 to-cyan-100/50",
      border: "border-cyan-200 hover:border-cyan-400",
      iconBg: "bg-cyan-100 text-cyan-600",
      titleColor: "text-gray-900",
      descColor: "text-cyan-700",
      shadow: "hover:shadow-cyan-200/50",
      }
  },
];

export default function ToolsPage() {
  return (
    // Switched to a bright white/gray background
    <main className="min-h-screen bg-gray-50 text-gray-900 p-8 md:p-16 font-sans relative overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* Bright Ambient Background Lights */}
      <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-blue-200/60 rounded-full blur-[150px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[800px] h-[800px] bg-purple-200/60 rounded-full blur-[150px] pointer-events-none mix-blend-multiply" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-100/50 rounded-full blur-[150px] pointer-events-none mix-blend-multiply" />


      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header - Cleaner and brighter */}
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 mb-4">
            Fitness<span className="text-blue-600">Analytics</span>
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl">
            Advanced biometric tools for performance optimization.
          </p>
        </header>

        {/* Tools Grid - Smaller cards, more columns on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            const t = tool.theme;

            return (
              <Link
                key={tool.href}
                href={tool.href}
                // Compact card design with colored backgrounds and borders
                className={`
                  group relative p-6 rounded-2xl border ${t.border} ${t.cardBg}
                  shadow-sm ${t.shadow} hover:-translate-y-1
                  transition-all duration-300 ease-out
                  flex flex-col justify-between min-h-[180px]
                `}
              >
                <div className="flex justify-between items-start">
                  {/* Colored Glowing Icon */}
                  <div className={`p-3 rounded-xl ${t.iconBg} shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  
                  <ArrowUpRight size={20} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
                </div>

                <div>
                  <h3 className={`text-lg font-bold ${t.titleColor} mb-1`}>
                    {tool.title}
                  </h3>
                  <p className={`text-sm font-semibold ${t.descColor}`}>
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