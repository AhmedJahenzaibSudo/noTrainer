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
    "Push Limits, Break Barriers",
  ];

  const colors = [
    "#ff595e",
    "#1982c4",
    "#6a4c93",
    "#ffca3a",
    "#8ac926",
    "#ff7f50",
    "#00bfae",
    "#f72585",
  ];

  const bgColors = [
    "#141414",
    "#151a18",
    "#16141a",
    "#1a1614",
    "#14161a",
  ];

  return (
    <motion.div
      className="
        sticky top-0 z-50
        w-full overflow-hidden
        border-b border-[#333]
        py-2
      "
      animate={{
        backgroundColor: bgColors,
      }}
      transition={{
        duration: 40,       // VERY slow
        repeat: Infinity,
        repeatType: "mirror",
        ease: "linear",
      }}
    >
      <div className="flex whitespace-nowrap items-center select-none">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 70,
          }}
        >
          {[...Array(3)].map((_, repeatIndex) =>
            quotes.map((quote, i) => (
              <span
                key={`${repeatIndex}-${i}`}
                className="
                  text-sm md:text-base
                  font-bold uppercase
                  tracking-wider
                  mx-6
                "
                style={{ color: colors[i % colors.length] }}
              >
                {quote}
              </span>
            ))
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AggressiveMarquee;
