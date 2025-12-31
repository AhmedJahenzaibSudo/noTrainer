"use client";

import React from "react";
import { motion } from "motion/react";

function AggressiveMarquee() {
  const quotes = [
    "Lift Heavy • Feel Strong",
    "Sweat > Excuses",
    "One More Rep",
    "Consistency Wins",
    "Progress Not Perfection",
    "Train Smart, Train Hard",
    "Stronger Every Day",
    "Move Your Body",
    "Own Your Journey",
    "Push Limits, Break Barriers"
  ];

  const colors = ["#ff595e", "#1982c4", "#6a4c93", "#ffca3a", "#8ac926", "#ff7f50", "#00bfae", "#f72585"];

  return (
    <div className="w-full overflow-hidden py-4 relative bg-[#1f1f1f] border-t border-b border-[#333]">
      <div className="flex whitespace-nowrap overflow-hidden items-center select-none relative z-10">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 70, // Very slow scroll
          }}
        >
          {[...Array(3)].map((_, repeatIndex) =>
            quotes.map((quote, i) => (
              <span
                key={`${repeatIndex}-${i}`}
                className="text-lg md:text-xl font-bold uppercase tracking-wider mx-8"
                style={{ color: colors[i % colors.length] }}
              >
                {quote}
              </span>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default AggressiveMarquee;
