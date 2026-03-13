"use client";
import React, { useEffect, useRef } from "react";

const Cursor = () => {
  const cursorRef = useRef(null);
  const requestRef = useRef();
  const mousePos = useRef({ x: 0, y: 0 });
  const isTouchDevice = useRef(false);

  useEffect(() => {
    // Detect touch — if any touch event fires, this is a touch device
    const onTouch = () => { isTouchDevice.current = true; };
    window.addEventListener("touchstart", onTouch, { once: true });

    // Web Audio click sound — short soft tick
    const playClick = () => {
      if (isTouchDevice.current) return;
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        const now  = ctx.currentTime;
        osc.type = "sine";
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.06);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
        osc.onended = () => ctx.close();
      } catch {}
    };

    // rAF position update
    const updatePosition = () => {
      if (cursorRef.current && !isTouchDevice.current) {
        cursorRef.current.style.transform = `translate3d(calc(${mousePos.current.x}px - 50%), calc(${mousePos.current.y}px - 50%), 0)`;
      }
      requestRef.current = requestAnimationFrame(updatePosition);
    };

    const onMouseMove = (e) => {
      if (isTouchDevice.current) return;
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
    };

    const onMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
    };

    const onMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
    };

    // Ripple + sound on click
    const onMouseDown = (e) => {
      if (isTouchDevice.current) return;
      playClick();

      const ripple = document.createElement("div");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top  = `${e.clientY}px`;
      document.body.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    };

    window.addEventListener("mousemove",  onMouseMove);
    window.addEventListener("mousedown",  onMouseDown);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    requestRef.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("mousedown",  onMouseDown);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("touchstart", onTouch);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <>
      <style>{`
        /* Hide real cursor only on non-touch (pointer: fine = mouse) */
        @media (pointer: fine) {
          body, a, button, input, textarea, select {
            cursor: none !important;
          }
        }

        .cursor-main {
          position: fixed;
          top: 0;
          left: 0;
          width: 18px;
          height: 18px;
          background-color: rgba(24, 37, 224, 0.88);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1.5px solid rgba(17, 228, 21, 0.79);
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          will-change: transform;
          opacity: 0;
          box-shadow: 0 0 8px rgba(43, 54, 181, 0.88);
          transition: opacity 0.2s ease;
        }

        /* Only render on mouse devices */
        @media (pointer: coarse) {
          .cursor-main { display: none !important; }
        }

        .cursor-ripple {
          position: fixed;
          width: 52px;
          height: 52px;
          background: transparent;
          border: 1.5px solid rgba(26, 240, 190, 0.7);
          border-radius: 50%;
          pointer-events: none;
          z-index: 99998;
          transform: translate(-50%, -50%);
          animation: ripple-effect 0.55s ease-out forwards;
        }

        @keyframes ripple-effect {
          0%   { transform: translate(-50%, -50%) scale(0.4); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
        }
      `}</style>

      <div ref={cursorRef} className="cursor-main" />
    </>
  );
};

export default Cursor;