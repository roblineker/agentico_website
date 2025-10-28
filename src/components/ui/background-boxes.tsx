"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface BoxesCoreProps {
  className?: string;
  onBoxHover?: (rowIndex: number, colIndex: number) => void;
  highlightedBoxes?: Set<string>;
  showHighlighted?: boolean;
}

export const BoxesCore = ({ 
  className, 
  onBoxHover, 
  highlightedBoxes,
  showHighlighted = false,
  ...rest 
}: BoxesCoreProps) => {
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);
  const colors = [
    "oklch(0.696 0.17 162.48)",
    "#404040",
    "oklch(0.696 0.17 162.48)",
    "#474646",
    "#42464a",
    "#49484b",
  ];
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute -top-1/4 left-1/4 z-30 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4 pointer-events-none",
        className,
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="relative h-8 w-16 border-l border-slate-700"
        >
          {cols.map((_, j) => {
            const boxKey = `${i}-${j}`;
            const isHighlighted = showHighlighted && highlightedBoxes?.has(boxKey);
            
            return (
              <motion.div
                whileHover={{
                  backgroundColor: `${getRandomColor()}`,
                  transition: { duration: 0 },
                }}
                animate={{
                  backgroundColor: isHighlighted ? "oklch(0.696 0.17 162.48)" : "transparent",
                  transition: { duration: 5 },
                }}
                onMouseEnter={() => onBoxHover?.(i, j)}
                key={`col` + j}
                className="relative h-8 w-16 border-t border-r border-slate-700 pointer-events-auto"
              >
                {j % 2 === 0 && i % 2 === 0 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-slate-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                ) : null}
              </motion.div>
            );
          })}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
