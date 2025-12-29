import React from "react";
import { Dumbbell, Activity, Timer, LineChart } from "lucide-react";

function Features() {
  const features = [
    {
      icon: <Dumbbell size={36} className="text-blue-500" />,
      title: "Workout Library",
      desc: "Access hundreds of exercises with proper form and step-by-step guidance.",
    },
    {
      icon: <Activity size={36} className="text-green-500" />,
      title: "Track Progress",
      desc: "Monitor your improvements, set goals, and stay consistent every week.",
    },
    {
      icon: <Timer size={36} className="text-yellow-400" />,
      title: "Custom Plans",
      desc: "Get personalized workout splits and training programs designed for you.",
    },
    {
      icon: <LineChart size={36} className="text-purple-500" />,
      title: "Calorie & Macro Tracking",
      desc: "Visualize your growth with progress charts and analytics that motivate you.",
    },
  ];

  return (
    <section className="bg-gray-950 text-white py-20 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-12">
          Why Choose <span className="text-[#c2c5ca]">noTrainer?</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-blue-500/10 transition transform hover:-translate-y-1"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
