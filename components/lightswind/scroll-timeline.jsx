"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence
} from "framer-motion";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ScrollTimeline({
  events = [], // Data now comes from your Features.jsx
  title = "Platform Features",
  subtitle = "Everything you need to crush your fitness goals.",
  className = ""
}) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Offset ensures the line starts filling as soon as the section enters
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.3", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      // Calculates which card is currently "Active" based on scroll position
      const index = Math.min(
        Math.floor(v * events.length),
        events.length - 1
      );
      if (index !== activeIndex && index >= 0) {
        setActiveIndex(index);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, events.length, activeIndex]);

  return (
    <section 
      ref={containerRef} 
      className={cx("relative bg-zinc-950 py-24 text-white overflow-hidden", className)}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_20%,rgba(120,119,198,0.05),transparent)] pointer-events-none" />

      <header className="relative z-10 text-center mb-20 px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500"
        >
          {title}
        </motion.h2>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-medium italic">
          {subtitle}
        </p>
      </header>

      <div className="relative max-w-5xl mx-auto px-6">
        {/* The Center Line Base */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-[2px] bg-zinc-900" />

        {/* The Animated Progress Line */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-0 z-10 w-[2px] origin-top bg-gradient-to-b from-yellow-400 via-orange-500 to-red-500 shadow-[0_0_15px_rgba(251,191,36,0.4)]"
          style={{ height: progressHeight }}
        />

        <div className="relative z-20 space-y-32">
          {events.map((feature, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <div key={index} className="relative flex flex-col items-center justify-center">
                
                {/* Visual Connector Dot */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-30">
                  <motion.div
                    animate={index <= activeIndex ? {
                      scale: [1, 1.4, 1],
                      backgroundColor: "#facc15",
                      boxShadow: "0 0 20px rgba(250,204,21,0.6)"
                    } : {
                      scale: 1,
                      backgroundColor: "#18181b",
                      boxShadow: "0 0 0px rgba(0,0,0,0)"
                    }}
                    className="w-4 h-4 rounded-full border-2 border-zinc-700 transition-colors duration-500"
                  />
                </div>

                {/* Feature Content Card */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className={cx(
                    "relative w-full lg:w-[45%] p-[1px] rounded-3xl bg-gradient-to-b from-zinc-700 to-transparent",
                    isEven ? "lg:mr-auto" : "lg:ml-auto"
                  )}
                >
                  <div className="bg-zinc-950/95 backdrop-blur-xl p-8 rounded-[calc(1.5rem-1px)] h-full border border-zinc-800/50 hover:border-zinc-600/50 transition-colors">
                    
                    {/* Icon & Tag Row */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className={cx(
                        "p-2.5 rounded-xl bg-gradient-to-br text-white shadow-xl",
                        feature.color || "from-zinc-700 to-zinc-900"
                      )}>
                        {feature.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        {feature.tag}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                      {feature.title}
                    </h3>
                    
                    <h4 className="text-xs font-bold text-yellow-500/90 mb-4 uppercase tracking-tighter">
                      {feature.subtitle}
                    </h4>

                    <p className="text-zinc-400 text-sm leading-relaxed font-normal">
                      {feature.description}
                    </p>

                    <AnimatePresence>
                      {index === activeIndex && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute top-6 right-6"
                        >
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                            <div className="w-1 h-1 rounded-full bg-yellow-500 animate-ping" />
                            <span className="text-[9px] font-black text-yellow-500 uppercase">Focus</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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