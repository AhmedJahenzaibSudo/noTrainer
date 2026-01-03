"use client";
import { useEffect, useState } from "react";
import { motion, useSpring, useAnimationControls } from "motion/react";

const CrosshairSVG = () => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      filter: "drop-shadow(0px 0px 6px currentColor)",
    }}
  >
    {/* Tactical geometric circles */}
    <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="3" />
    <circle cx="20" cy="20" r="2.5" fill="currentColor" />
    
    {/* Heavy crosshair lines */}
    <path d="M20 0V8" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    <path d="M20 32V40" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    <path d="M0 20H8" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    <path d="M32 20H40" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
  </svg>
);

export function Cursor({
  springConfig = { damping: 35, stiffness: 700, mass: 0.8 },
}) {
  const [isTargeting, setIsTargeting] = useState(false);
  
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const scale = useSpring(1, { stiffness: 1000, damping: 25 });
  
  const flashControls = useAnimationControls();

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = e.target;
      const isClickable = 
        target.closest('button') || 
        target.closest('a') || 
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsTargeting(!!isClickable);
    };

    const handleMouseDown = () => {
      scale.set(0.6); // Impact recoil
      
      // Muzzle Flash Effect
      flashControls.set({ scale: 0.1, opacity: 1 });
      flashControls.start({
        scale: 4,
        opacity: 0,
        transition: { duration: 0.3, ease: "circOut" }
      });
    };

    const handleMouseUp = () => {
      scale.set(isTargeting ? 1.3 : 1);
    };

    document.body.style.cursor = "none";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "auto";
    };
  }, [cursorX, cursorY, scale, flashControls, isTargeting]);

  useEffect(() => {
    scale.set(isTargeting ? 1.3 : 1);
  }, [isTargeting, scale]);

  return (
    <motion.div
      style={{
        position: "fixed",
        left: cursorX,
        top: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        scale: scale,
        zIndex: 9999,
        pointerEvents: "none",
        color: isTargeting ? "#FF0000" : "#1dd535ff",
        willChange: "transform",
      }}
    >
      {/* Constant Rotation Wrapper */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: isTargeting ? 1 : 4, // Spins 4x faster when red/targeting
          ease: "linear",
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CrosshairSVG />
      </motion.div>

      {/* Flash Ring */}
      <motion.div
        animate={flashControls}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
          width: 50,
          height: 50,
          borderRadius: "50%",
          border: "3px solid currentColor",
          opacity: 0,
          filter: "blur(2px)",
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}