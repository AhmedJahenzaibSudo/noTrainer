"use client";

//========== IMPORTS ==========
import React, { useRef } from "react";
import Image from "next/image";
import { TextRotate } from "@/components/ui/text-rotate";
import { motion, LayoutGroup } from "framer-motion";
import { ArrowDown, Zap, Target, Flame } from "lucide-react";

function Hero() {
  const containerRef = useRef(null);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-black"
    >
      
      // ========== MAIN LOGO SECTION ==========
      {/* 3. Content Container */}
      <div className="relative z-10 max-w-6xl ">
        
        {/* LOGO + TEXT SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex justify-center"
        >
          <div className="bg-white border-4 border-black p-2 shadow-[5px_5px_0px_#E6E676] flex items-center gap-4 px-4">
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                fill
                priority
                className="object-contain"
              />
            </div>
            <span className="text-3xl md:text-4xl font-[1000] text-black tracking-tighter italic">
              no<span className="text-[#FF5941]">TRAINER</span>
            </span>
          </div>
        </motion.div>

        // ========== HERO TITLES ==========
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-0"
        >
          <h1 className="text-6xl md:text-9xl font-[800] text-white leading-none uppercase tracking-tighter">
            <span className="bg-[#FFDE03] text-black px-10 py-4 border-t-4 border-x-4 border-black inline-block">
              Train Smart.
            </span>
            <br />
            <span className="bg-white text-black px-10 py-4 border-4 border-black shadow-[12px_12px_0px_black] inline-block">
              Build Strong.
            </span>
          </h1>
          
          <div className="mt-12 bg-black text-[#00E676] px-10 py-4 border-4 border-[#00E676] text-2xl md:text-4xl font-black uppercase tracking-[0.2em]">
            No Trainer Needed.
          </div>
        </motion.div>

        // ========== DYNAMIC TEXT ROTATOR ==========
        {/* 4. Dynamic Text Section */}
        <div className="mt-6 flex flex-col items-center justify-center font-mono">
          <LayoutGroup>
            <motion.div 
              className="flex flex-col mb-10 md:flex-row items-center gap-6 text-3xl md:text-5xl font-black text-white uppercase"
              layout
            >
              <div className="min-w-[400px]">
                <TextRotate
                  texts={[
                    "custom workouts",
                    "training splits",
                    "health metrics",
                    "exercise form",
                    "goal tracking",
                  ]}
                  mainClassName="text-black px-8 bg-[#00E676] border-4 border-black font-black py-3 justify-center shadow-[8px_8px_0px_black]"
                  staggerFrom={"last"}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  transition={{ type: "tween", duration: 0.3 }}
                  rotationInterval={2000}
                />
              </div>
            </motion.div>
          </LayoutGroup>
        </div>
      </div>
    </section>
  );
}

export default Hero;