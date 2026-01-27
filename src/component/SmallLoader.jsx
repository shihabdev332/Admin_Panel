import React from "react";

const SmallLoader = ({ size = 20, stroke = 3, className = "", ariaLabel = "Loading..." }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      className={`animate-spin ${className}`}
      aria-label={ariaLabel}
      role="img"
    >
      <circle
        cx="25"
        cy="25"
        r={20 - stroke / 2}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray="90"
        strokeDashoffset="60"
        className="opacity-30"
      />
      <circle
        cx="25"
        cy="25"
        r={20 - stroke / 2}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray="45"
        strokeDashoffset="0"
      />
    </svg>
  );
};

export default SmallLoader;
