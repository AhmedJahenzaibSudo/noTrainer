"use client";
import React, { useEffect, useRef } from "react";

const Cursor = () => {
  const cursorRef = useRef(null);
  const requestRef = useRef();
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // 1. Smooth & Instant movement using requestAnimationFrame
    const updatePosition = () => {
      if (cursorRef.current) {
        // translate3d triggers hardware acceleration
        cursorRef.current.style.transform = `translate3d(calc(${mousePos.current.x}px - 50%), calc(${mousePos.current.y}px - 50%), 0)`;
      }
      requestRef.current = requestAnimationFrame(updatePosition);
    };

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // 2. Ripple using a simple DOM injection to avoid React state lag
    const onMouseDown = (e) => {
      const ripple = document.createElement("div");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);

      // Clean up DOM after animation
      ripple.addEventListener("animationend", () => ripple.remove());
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    requestRef.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <>
      <style>{`
        /* Hide real cursor globally */
        body, a, button, input, textarea, select {
          cursor: none !important;
        }

        .cursor-main {
          position: fixed;
          top: 0;
          left: 0;
          width: 20px;
          height: 20px;
          background-color: rgba(40, 239, 139, 0.4);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 2px solid rgba(249, 229, 10, 1);
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          will-change: transform;
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
        }

        .cursor-ripple {
          position: fixed;
          width: 60px;
          height: 60px;
          background: transparent;
          border: 2px solid rgba(212, 255, 39, 0.8);
          border-radius: 50%;
          pointer-events: none;
          z-index: 99998;
          transform: translate(-50%, -50%);
          animation: ripple-effect 0.7s ease-out forwards;
        }

        @keyframes ripple-effect {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
      `}</style>

      <div ref={cursorRef} className="cursor-main" />
    </>
  );
};

export default Cursor;