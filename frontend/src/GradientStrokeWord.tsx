// GradientStrokeWord.tsx
import React from "react";

type Props = {
  text: string;
  className?: string;
  strokeWidth?: number; // tweak thickness (default 3)
};

const GradientStrokeWord: React.FC<Props> = ({
  text,
  className = "",
  strokeWidth = 3,
}) => {
  const id = React.useId(); // unique gradient id per instance

  return (
    <span className={`inline-block align-baseline leading-none ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-[1em] w-auto overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`strokeGrad-${id}`}
            x1="0%"
            y1="0%"
            x2="200%"
            y2="0%"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="#00aaff" />
            <stop offset="50%" stopColor="#00ffbb" />
            <stop offset="100%" stopColor="#8e54e9" />
            {/* Smooth translate across the word */}
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="-1 0"
              to="1 0"
              dur="4s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>

        {/* The actual text: white fill + gradient stroke only on border */}
        <text
          x="0"
          y="0"
          dy="0.8em"
          fontSize="1em"
          fontWeight={800}
          stroke={`url(#strokeGrad-${id})`}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          fill="white"
          paintOrder="stroke fill"
        >
          {text}
        </text>
      </svg>
    </span>
  );
};

export default GradientStrokeWord;
