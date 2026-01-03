import React, { useState, useEffect, useRef } from "react";

export default function RotatingImage({ images = [], name }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 300);
    }
    return () => clearInterval(intervalRef.current);
  }, [images.length]);

  return (
    <div className="relative w-full h-full bg-blue-100 border-4 border-black overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-300 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={`/exercises/${image || "placeholder.png"}`}
            alt={`${name} view ${index + 1}`}
            className="w-full h-full object-contain p-2"
          />
        </div>
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 font-bold border-2 border-black">
          {currentIndex + 1}/{images.length}
        </div>
      )}
    </div>
  );
}
