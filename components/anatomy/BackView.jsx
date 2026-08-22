import React from "react";

/* =========================================================
   BACK VIEW CONFIG
========================================================= */

const CONFIG = {
  colors: {
    background: "color(display-p3 0.056 0.958 0.949)",
    dark: "color(display-p3 0.079 0.201 0.346)",

    // inactive muscle
    inactive: "color(display-p3 0.079 0.201 0.346)",

    // hovered / selected muscle
    active: "color(display-p3 1 0 0)",
  },

  interaction: {
    inactiveOpacity: 0.72,
    hoverOpacity: 1,
    activeOpacity: 1,
  },
};

export default function BackView({
  onSelect,
  selectedMuscle,
  highlightedMuscle,
  onHover,
  onLeave,
}) {
  const isActive = (id) =>
    id === selectedMuscle || id === highlightedMuscle;

  const pathProps = (id) => ({
    id,

    onMouseEnter: () => onHover?.(id),
    onMouseLeave: () => onLeave?.(),

    style: {
      fill: isActive(id)
        ? CONFIG.colors.active
        : CONFIG.colors.inactive,

      opacity: isActive(id)
        ? CONFIG.interaction.activeOpacity
        : CONFIG.interaction.inactiveOpacity,

      transition:
        "fill 180ms ease, opacity 180ms ease, transform 180ms ease",

      transformOrigin: "center",
      cursor: "pointer",
    },
  });

  return (
    <svg
      viewBox="0 0 529 853"
      className="h-auto w-full select-none"
      style={{
        color: CONFIG.colors.dark,
      }}
    >
      <g
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (e.target.id) {
            onSelect?.(e.target.id);
          }
        }}
      >
        {/* GLUTES */}
        <path
          {...pathProps("glutes")}
          d="m201 398l12-26 31-6 20 15 27-18 27 1 9 33 3 29-17 27c-12.52 1.5-42 3-42 3l-7-30-15 34-21 1-18-3-12-15-7-17z"
        />

        {/* HAMSTRINGS */}
        <path
          {...pathProps("hamstrings")}
          d="m192 579l15-96 9-19 14 3-9 38v32l-12 33-4 16z"
        />

        <path
          {...pathProps("hamstrings")}
          d="m289 464l15 64v44l12 32 4-47-5-48 1-24-5-14z"
        />

        {/* LOWER BACK */}
        <path
          {...pathProps("lower back")}
          d="m232 357v-47l14-29 8-26 10 7 20 29 7 21v14l6 23-20 1-22 8z"
        />

        {/* MIDDLE BACK */}
        <path
          {...pathProps("middle back")}
          d="m195 359l3-32-17-49-9-43v-21c11.46-8.98 44-27 44-27l20 32 7 26-9 29-13 38v25 16z"
        />

        <path
          {...pathProps("middle back")}
          d="m281 253l9-36 13-30 8-13 31 28 6 16-12 35-3 20-2 32 2 35-4 22-21-7-10-54z"
        />

        {/* ABDUCTORS */}
        <path
          {...pathProps("abductors")}
          d="m330 375l6 51-1 16 18-16-1-35-5-15z"
        />

        <path
          {...pathProps("abductors")}
          d="m194 385l-11 28-3 27-12-14v-27l8-15z"
        />

        {/* ADDUCTORS */}
        <path
          {...pathProps("adductors")}
          d="m239 475l-4 32-17 67v19l18-24 13-39 3-42z"
        />

        <path
          {...pathProps("adductors")}
          d="m284 475l10 103-19-26-11-34v-26z"
        />
      </g>
    </svg>
  );
}