import React from "react";
import { TextRotate } from "@/components/ui/text-rotate";
import { motion, LayoutGroup } from "motion/react";

function Hero() {
  return (
    <section
      className="relative min-h-screen z-30 flex flex-col items-center justify-center text-center px-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl">
        {/* Main Heading - Bold, high-contrast with glow */}
        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
          Train Smart. Build Strong. <br /> No Trainer Needed.
        </h1>

        {/* Animated Text Section */}
        <div className="w-full h-full text-2xl sm:text-3xl md:text-5xl items-center justify-center text-white font-bold overflow-hidden p-12 sm:p-20 md:p-24">
          <LayoutGroup>
            <motion.p className="whitespace-pre" layout>
              <motion.span
                className="pt-0.5 font-bold sm:pt-1 md:pt-2"
                layout
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              >
                noTrainer helps in:{" "}
              </motion.span>
              <TextRotate
                texts={[
                  "custom workouts",
                  "training",
                  "calculating health metrics",
                  "exploring exercises",
                  "getting fit",
                ]}
                mainClassName="text-white px-2 mt-5 sm:px-2 md:px-3 bg-[#ff5941] font-bold overflow-hidden py-5 px-5 sm:py-1 md:py-2 justify-center rounded-lg"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              />
            </motion.p>
          </LayoutGroup>
        </div>

        {/* Subtitle - Consistent text hierarchy */}
        <p className="mt-6 text-xl md:text-2xl text-white/90 leading-relaxed">
          At <span className="font-bold text-[#c2c5ca]">noTrainer</span>, learn exercises,
          track your progress, and master every muscle — your journey starts here.
        </p>

        {/* CTA Button - Matches navbar interaction style */}
        <div className="mt-10">
          <a
            href="body"
            className="inline-block px-8 py-4 rounded-xl font-bold text-xl bg-[#c2c5ca] text-black hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          >
            Start Training
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;