import React from "react";

interface MehtaLogoProps {
  size?: number | string;
  withCircle?: boolean;
  className?: string;
  dark?: boolean;
}

export default function MehtaLogo({
  size = 120,
  withCircle = true,
  className = "",
  dark = false,
}: MehtaLogoProps) {
  const outerSize = typeof size === "number" ? `${size}px` : size;

  const content = (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none transition-transform duration-300"
    >
      {/* Optional Circular background */}
      {withCircle && (
        <circle cx="200" cy="200" r="195" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="3" />
      )}

      {/* Shoebox outline/shadow vector for footwear */}
      <g transform="translate(45, 80)">
        {/* Sole of the shoe */}
        <path
          d="M 60 145 C 90 145, 120 142, 150 144 C 180 146, 210 147, 240 141 C 243 140, 245 137, 245 133 C 244 128, 235 125, 230 125 C 220 125, 215 129, 205 130 C 190 131, 160 128, 140 128 C 110 128, 90 131, 60 131 C 60 135, 59 140, 60 145 Z"
          fill="#ffd700"
          stroke="#5c3818"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M 63 145 L 238 141"
          stroke="#ffffff"
          strokeWidth="2"
        />

        {/* Heel of the shoe */}
        <path
          d="M 60 131 L 62 153 C 62 156, 100 156, 100 153 L 100 131 Z"
          fill="#8d5b2c"
          stroke="#5c3818"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Shoe upper body */}
        <path
          d="M 60 131 C 58 110, 64 90, 75 80 C 85 70, 100 78, 120 85 C 130 90, 140 95, 155 100 C 165 104, 185 108, 195 109 C 205 110, 222 112, 230 114 C 238 116, 243 120, 244 125 C 244 129, 241 133, 230 131 C 220 129, 212 128, 200 129 L 60 131 Z"
          fill="#a1622b"
          stroke="#5c3818"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />

        {/* Contrast stitching/panel design on the shoe */}
        <path
          d="M 75 80 C 82 86, 92 100, 95 115"
          stroke="#fde047"
          strokeWidth="2"
          strokeDasharray="4,3"
          fill="none"
        />
        <path
          d="M 120 85 C 122 93, 118 112, 115 129"
          stroke="#fde047"
          strokeWidth="2.5"
          strokeDasharray="3,3"
          fill="none"
        />
        <path
          d="M 148 101 C 158 108, 165 118, 168 128"
          stroke="#fde047"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 195 109 C 208 112, 218 118, 225 127"
          stroke="#5c3818"
          strokeWidth="2"
          fill="none"
        />

        {/* Decorative brogue punches & laces */}
        <line x1="126" y1="91" x2="132" y2="85" stroke="#5c3818" strokeWidth="4" strokeLinecap="round" />
        <line x1="131" y1="93" x2="137" y2="87" stroke="#5c3818" strokeWidth="4" strokeLinecap="round" />
        <line x1="136" y1="95" x2="142" y2="89" stroke="#5c3818" strokeWidth="4" strokeLinecap="round" />

        {/* Subtle shoe lining highlights */}
        <path
          d="M 85 71 C 92 68, 98 70, 102 75"
          stroke="#ffd700"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Elegant Separator Line */}
      <line x1="120" y1="235" x2="280" y2="235" stroke="#5c3818" strokeWidth="2.5" strokeLinecap="round" />

      {/* "MEHTA" Typography */}
      <text
        x="200"
        y="285"
        textAnchor="middle"
        fill={withCircle ? "#1E293B" : dark ? "#F8FAFC" : "#1E293B"}
        fontSize="34"
        fontWeight="800"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        letterSpacing="8"
      >
        MEHTA
      </text>

      {/* "BOOT HOUSE" Typography */}
      <text
        x="200"
        y="325"
        textAnchor="middle"
        fill={withCircle ? "#475569" : dark ? "#CBD5E1" : "#475569"}
        fontSize="21"
        fontWeight="600"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        letterSpacing="6"
      >
        BOOT HOUSE
      </text>
    </svg>
  );

  return (
    <div
      style={{ width: outerSize, height: outerSize }}
      className={`relative flex items-center justify-center shrink-0 ${className}`}
    >
      {content}
    </div>
  );
}
