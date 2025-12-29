"use client"
import React from "react";
import { motion } from "motion/react";

function AggressiveMarquee() {
  const marqueeText = "NO TRAINER NEEDED • BUILD PURE STRENGTH • TRAIN YOUR WAY •";

  return (
    <div className="w-full bg-[#ff5941] overflow-hidden py-4 border-y border-black">
      <div className="flex whitespace-nowrap overflow-hidden items-center select-none">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 10, // Adjust speed: lower is faster
          }}
        >
          {/* Repeat text enough times to fill width + scroll */}
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-4xl md:text-6xl font-black italic uppercase text-black mx-4 tracking-tighter"
            >
              {marqueeText}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default AggressiveMarquee;
