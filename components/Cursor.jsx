"use client";
import React, { useEffect, useRef, useState } from "react";

const Cursor = () => {
  const cursorRef = useRef(null);
  const [ripples, setRipples] = useState([]);

  // Move the cursor
  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleClick = (e) => {
      // Add a ripple at click position
      const id = Date.now();
      const rect = cursorRef.current.getBoundingClientRect();
      setRipples((prev) => [
        ...prev,
        { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
      ]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 500);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleClick);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <>
      <style>{`
        body, a, button, input, textarea, select {
          cursor: none !important;
        }
      `}</style>

      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "20px",
          height: "20px",
          backgroundColor: "rgba(40, 239, 139, 0.67)", // frosted glass
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          border: "3px solid rgba(249, 229, 10, 1)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 12px rgba(255,255,255,0.25)",
        }}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: "30px",
              height: "30px",
              borderRadius: "80%",
              border: "3px solid rgba(39, 255, 89, 0.96)",
              transform: "translate(-50%, -50%)",
              animation: "ripple 0.5s ease-out forwards",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
          }
          100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Cursor;
