"use client";

import React from "react";
import ScrollTimeline from "./lightswind/scroll-timeline";
import { Wand2, UserCircle, Database, Calculator, MessageSquare, Columns3, Gamepad2, Trophy } from "lucide-react";

const Features = () => {
  const features = [
    {
      tag: "Core",
      title: "Custom Workout Wizard",
      subtitle: "Personalized training engine",
      description: "Select body muscles from an interactive SVG diagram and generate relevant workouts instantly.",
      icon: <Wand2 className="w-5 h-5" />,
      color: "cyan-500"
    },
    {
      tag: "Visualization",
      title: "SVG Muscle Selection",
      subtitle: "Visual body-based targeting",
      description: "Interactive human body diagram lets you visually select muscle groups for intuitive discovery.",
      icon: <UserCircle className="w-5 h-5" />,
      color: "blue-500"
    },
    {
      tag: "Data",
      title: "Rich Workout Dataset",
      subtitle: "Always expanding",
      description: "A continuously growing collection of exercises categorized by muscle and goals.",
      icon: <Database className="w-5 h-5" />,
      color: "indigo-500"
    },
    {
      tag: "Health",
      title: "Health Calculators",
      subtitle: "Science-based metrics",
      description: "BMI, calorie needs, and protein intake calculated instantly with modern formulas.",
      icon: <Calculator className="w-5 h-5" />,
      color: "purple-500"
    },
    {
      tag: "AI",
      title: "24/7 Fitness Chatbot",
      subtitle: "Always available",
      description: "Ask fitness or nutrition questions anytime with an intelligent assistant.",
      icon: <MessageSquare className="w-5 h-5" />,
      color: "pink-500"
    },
    {
      tag: "Productivity",
      title: "Workout Kanban Board",
      subtitle: "Plan and track progress",
      description: "Organize workouts and fitness tasks using a visual Kanban board.",
      icon: <Columns3 className="w-5 h-5" />,
      color: "rose-500"
    },
    {
      tag: "Focus",
      title: "Mini Games",
      subtitle: "Relax and refocus",
      description: "Simple games designed to improve focus and keep motivation high between workouts.",
      icon: <Gamepad2 className="w-5 h-5" />,
      color: "orange-500"
    },
    {
      tag: "Engagement",
      title: "Daily Challenges",
      subtitle: "Consistency made fun",
      description: "Fresh daily challenges that push consistency and encourage healthy habits.",
      icon: <Trophy className="w-5 h-5" />,
      color: "emerald-500"
    }
  ];


  return (
    <section className="bg-black text-white py-16 px-6 md:px-20 border-t-4 border-yellow-400">
      <ScrollTimeline
        title="noTrainer Features"
        subtitle="No Trainer needed! Yes"
        events={features}
        cardAlignment="alternating"
        revealAnimation="slide"
        animationOrder="staggered"
        cardVariant="elevated"
        cardEffect="glow"
        progressIndicator
      />
    </section>
  );
};

export default Features;