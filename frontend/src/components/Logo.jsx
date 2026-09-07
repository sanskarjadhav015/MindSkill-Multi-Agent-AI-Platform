import React from "react";

/**
 * ============================================================================
 * MINDSKILL PROJECT LOGO (`Logo.jsx`)
 * ============================================================================
 * Official Project Brandmark:
 * - Precision squircle icon with interlocking geometric loops.
 * - MindSkill text with "AI" in brand purple accent.
 * - "STUDIO" uppercase tracking subtitle.
 * ============================================================================
 */
export function LogoIcon({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <rect width="100" height="100" rx="26" fill="#0A0A0A" />
      {/* Vertical orbital loop */}
      <rect
        x="35"
        y="20"
        width="30"
        height="60"
        rx="15"
        fill="none"
        stroke="white"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Horizontal orbital loop */}
      <rect
        x="20"
        y="35"
        width="60"
        height="30"
        rx="15"
        fill="none"
        stroke="white"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo({
  iconSize = 34,
  showText = true,
  showSubtitle = true,
  variant = "light",
  className = "",
}) {
  const isDark = variant === "dark";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <LogoIcon size={iconSize} className="shadow-sm" />
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline">
            <span
              className={`text-[15px] font-extrabold tracking-tight ${
                isDark ? "text-white" : "text-[#0A0A0A]"
              }`}
            >
              MindSkill
            </span>
            <span className="text-[15px] font-extrabold text-[#7C3AED] ml-0.5">
              AI
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-400 mt-0.5">
              STUDIO
            </span>
          )}
        </div>
      )}
    </div>
  );
}
