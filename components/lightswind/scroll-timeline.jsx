"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ScrollTimeline({
  events = [],
  title = "Platform Features",
  subtitle = "Everything you need to crush your fitness goals.",
  className = ""
}) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Adjusted offset for better snapping detection
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      const index = Math.min(Math.floor(v * (events.length)), events.length - 1);
      setActiveIndex(index);
    });
    return () => unsubscribe();
  }, [scrollYProgress, events.length]);

  return (
    /* The container must have snap-y snap-mandatory to work */
    <section
      ref={containerRef}
      className={cx(
        "relative py-24 text-white bg-zinc-950 snap-y snap-mandatory",
        className
      )}
    >
      <header className="relative z-10 text-center mb-40 px-6 snap-start h-[20vh] flex flex-col justify-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-blue-400 to-cyan-600"
        >
          {title}
        </motion.h2>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-medium italic">
          {subtitle}
        </p>
      </header>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Track Line (Dark Zinc) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-3 bg-zinc-900/50 rounded-full" />

        {/* Animated Progress Line (Blue Glow) */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-0 z-10 w-3 origin-top bg-gradient-to-b from-blue-400 via-cyan-500 to-blue-700 shadow-[0_0_20px_rgba(59,130,246,0.5)] rounded-full"
          style={{ height: progressHeight }}
        />

        <div className="relative z-20 space-y-40 pb-40">
          {events.map((feature, index) => {
            const isEven = index % 2 === 0;
            const isActive = index === activeIndex;

            return (
              <div 
                key={index} 
                className="relative flex flex-col items-center justify-center snap-center min-h-[60vh]"
              >
                {/* Visual Connector Dot */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-30">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.5 : 1,
                      backgroundColor: isActive ? "#22d3ee" : "#18181b",
                      boxShadow: isActive ? `0 0 30px #06b6d4` : "0 0 0px transparent"
                    }}
                    className="w-6 h-6 rounded-full border-4 border-zinc-950 shadow-xl transition-colors duration-300"
                  />
                </div>

                {/* Blue Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.6 }}
                  className={cx(
                    "relative w-full lg:w-[45%] p-10 rounded-[2.5rem] overflow-hidden",
                    isEven ? "lg:mr-auto" : "lg:ml-auto"
                  )}
                  style={{
                    background: isActive 
                      ? "linear-gradient(145deg, #1e3a8a, #0891b2)" // Bright blue when active
                      : "linear-gradient(145deg, #171717, #0f172a)", // Darker when inactive
                    boxShadow: isActive 
                      ? "0 25px 60px -15px rgba(6, 182, 212, 0.4)" 
                      : "0 10px 30px -10px rgba(0,0,0,0.5)",
                    transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={cx(
                        "p-3 rounded-2xl transition-colors duration-500",
                        isActive ? "bg-cyan-400 text-black" : "bg-zinc-800 text-white"
                      )}>
                        {React.cloneElement(feature.icon, { size: 32, strokeWidth: 2.5 })}
                      </div>
                      <span className={cx(
                        "text-xs font-black uppercase tracking-[0.2em]",
                        isActive ? "text-cyan-200" : "text-zinc-500"
                      )}>
                        {feature.tag}
                      </span>
                    </div>

                    <h3 className="text-4xl font-black text-white mb-3 tracking-tighter uppercase italic">
                      {feature.title}
                    </h3>
                    
                    <p className={cx(
                      "text-lg leading-relaxed font-medium transition-colors duration-500",
                      isActive ? "text-white" : "text-zinc-500"
                    )}>
                      {feature.description}
                    </p>
                  </div>

                  {/* Aesthetic Number Background */}
                  <div className="absolute -bottom-4 -right-2 opacity-10 text-white pointer-events-none">
                    <span className="text-[10rem] font-black select-none leading-none">
                      {index + 1}
                    </span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}