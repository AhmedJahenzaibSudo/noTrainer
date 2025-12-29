"use client";

import React from "react";
import { Target, Sparkles, Brain, Activity } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white pt-30 pb-20 px-6 flex items-center justify-center">
      <div className="max-w-5xl mx-auto space-y-14">
        {/* Header Section */}
        <section className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#c2c5ca] mb-4">
            About <span className="text-[#9ca3af]">noTrainer</span>
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
            <span className="text-[#c2c5ca] font-semibold">noTrainer</span> is a
            smart fitness companion built to guide you — not control you.
            <br />
            We believe that **fitness should be free, personalized, and powered
            by knowledge** — not by expensive subscriptions or personal trainers.
          </p>
        </section>

        {/* Our Mission */}
        <section className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl shadow-lg p-10 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-[#c2c5ca]" size={28} />
            <h2 className="text-3xl font-bold text-[#c2c5ca]">Our Mission</h2>
          </div>
          <p className="text-gray-400 leading-relaxed text-lg">
            Our mission is to **empower individuals to understand their bodies**
            using simple yet powerful tools.  
            Whether you want to calculate your **BMI**, manage **hydration**, track
            **calories**, or balance your **protein intake**,  
            noTrainer helps you make smarter fitness decisions — without confusion,
            guesswork, or paid coaching.
          </p>
        </section>

        {/* Our Vision */}
        <section className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl shadow-lg p-10 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-[#c2c5ca]" size={28} />
            <h2 className="text-3xl font-bold text-[#c2c5ca]">Our Vision</h2>
          </div>
          <p className="text-gray-400 leading-relaxed text-lg">
            We envision a world where **fitness knowledge is accessible to
            everyone**, regardless of income, age, or background.  
            Our goal is to replace complex training programs with **data-driven,
            user-friendly insights** that anyone can understand and use daily.
          </p>
        </section>

        {/* Our Philosophy */}
        <section className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl shadow-lg p-10 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="text-[#c2c5ca]" size={28} />
            <h2 className="text-3xl font-bold text-[#c2c5ca]">
              Our Philosophy
            </h2>
          </div>
          <p className="text-gray-400 leading-relaxed text-lg">
            We believe the human body is intelligent — it doesn’t need extreme
            diets or impossible routines.  
            It just needs the **right guidance**.  
            That’s why noTrainer focuses on clarity, education, and simplicity.
            <br />
            You shouldn’t need to hire someone to understand your own body — you
            just need the right tools.
          </p>
        </section>

        {/* Why Choose Us */}
        <section className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl shadow-lg p-10 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-[#c2c5ca]" size={28} />
            <h2 className="text-3xl font-bold text-[#c2c5ca]">Why Choose noTrainer?</h2>
          </div>
          <ul className="list-disc list-inside text-gray-400 text-lg space-y-2">
            <li>100% free tools designed for your fitness goals</li>
            <li>Accurate, science-based calculations</li>
            <li>Simple and intuitive interface</li>
            <li>Built for everyone — from beginners to athletes</li>
            <li>Constantly evolving with user feedback</li>
          </ul>
        </section>

        {/* Footer Message */}
        <section className="text-center text-gray-400 text-sm mt-10">
          <p>
            noTrainer is built for people who believe in progress through
            knowledge — not pressure.  
            <br />
            <span className="text-[#c2c5ca]">Train Smart. Build Strong. No Trainer Needed.</span>
          </p>
        </section>
      </div>
    </main>
  );
}