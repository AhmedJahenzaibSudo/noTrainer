import React from "react";

export default function BackView({
  onSelect,
  selectedMuscle,
  highlightedMuscle,
  onHover,
  onLeave,
}) {
  // Active if hovered OR selected
  const isActive = (id) => id === selectedMuscle || id === highlightedMuscle;

  const pathProps = (id) => ({
    id,
    onMouseEnter: () => onHover(id),
    onMouseLeave: onLeave,
    className: `
      cursor-pointer
      transition-colors duration-200 ease-in-out
      ${
        isActive(id)
          ? "fill-blue-600"
          : "fill-gray-400 hover:fill-blue-300"
      }
    `,
  });

  return (
    <svg
      viewBox="0 0 529 853"
      className="w-full h-auto select-none"
    >
      <g
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.target.id) onSelect(e.target.id);
        }}
      >
        <path
          {...pathProps("glutes")}
          d="m201 398l12-26 31-6 20 15 27-18 27 1 9 33 3 29-17 27c-12.52 1.5-42 3-42 3l-7-30-15 34-21 1-18-3-12-15-7-17z"
        />

        <path
          {...pathProps("hamstrings")}
          d="m192 579l15-96 9-19 14 3-9 38v32l-12 33-4 16z"
        />
        <path
          {...pathProps("hamstrings")}
          d="m289 464l15 64v44l12 32 4-47-5-48 1-24-5-14z"
        />

        <path
          {...pathProps("lower back")}
          d="m232 357v-47l14-29 8-26 10 7 20 29 7 21v14l6 23-20 1-22 8z"
        />

        <path
          {...pathProps("middle back")}
          d="m195 359l3-32-17-49-9-43v-21c11.46-8.98 44-27 44-27l20 32 7 26-9 29-13 38v25 16z"
        />
        <path
          {...pathProps("middle back")}
          d="m281 253l9-36 13-30 8-13 31 28 6 16-12 35-3 20-2 32 2 35-4 22-21-7-10-54z"
        />

        <path
          {...pathProps("abductors")}
          d="m330 375l6 51-1 16 18-16-1-35-5-15z"
        />
        <path
          {...pathProps("abductors")}
          d="m194 385l-11 28-3 27-12-14v-27l8-15z"
        />

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
