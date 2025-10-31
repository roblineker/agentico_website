"use client";
import React, { useRef, memo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface BoxesCoreProps {
  className?: string;
  onBoxHover?: (rowIndex: number, colIndex: number) => void;
  highlightedBoxes?: Set<string>;
  showHighlighted?: boolean;
}

// Memoized individual box component to prevent unnecessary re-renders
const Box = memo(({ 
  rowIndex, 
  colIndex, 
  onHover, 
  isHighlighted, 
  showIcon 
}: { 
  rowIndex: number; 
  colIndex: number; 
  onHover: (row: number, col: number) => void;
  isHighlighted: boolean;
  showIcon: boolean;
}) => {
  const colors = [
    "oklch(0.696 0.17 162.48)",
    "#404040",
    "oklch(0.696 0.17 162.48)",
    "#474646",
    "#42464a",
    "#49484b",
  ];
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
  const boxKey = `${rowIndex}-${colIndex}`;

  return (
    <motion.div
      whileHover={{
        backgroundColor: getRandomColor(),
        transition: { duration: 0 },
      }}
      animate={{
        backgroundColor: isHighlighted ? "oklch(0.696 0.17 162.48)" : "rgba(0, 0, 0, 0)",
        transition: { duration: 5 },
      }}
      onMouseEnter={() => onHover(rowIndex, colIndex)}
      data-box-id={boxKey}
      className="relative h-8 w-16 border-t border-r border-slate-700 pointer-events-auto"
    >
      {showIcon && (
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
      )}
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if isHighlighted changes or other props change
  return prevProps.isHighlighted === nextProps.isHighlighted &&
         prevProps.showIcon === nextProps.showIcon;
});

Box.displayName = "Box";

const BoxesCoreComponent = ({ 
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

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTouchedRef = useRef<string>("");

  // Handle touch events for mobile with throttling
  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const touch = e.touches[0];
    if (!touch) return;

    // Get the element at the touch point
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!element) return;

    // Find the closest box element
    const boxElement = element.closest('[data-box-id]');
    if (boxElement && boxElement instanceof HTMLElement) {
      const boxId = boxElement.getAttribute('data-box-id');
      if (boxId && boxId !== lastTouchedRef.current) {
        lastTouchedRef.current = boxId;
        const [rowIndex, colIndex] = boxId.split('-').map(Number);
        onBoxHover?.(rowIndex, colIndex);
        
        // Trigger color change manually on touch
        boxElement.style.backgroundColor = getRandomColor();
        setTimeout(() => {
          if (!showHighlighted) {
            boxElement.style.backgroundColor = 'rgba(0, 0, 0, 0)';
          }
        }, 1500);
      }
    }
  };

  const handleTouchEnd = () => {
    lastTouchedRef.current = "";
  };

  return (
    <div
      ref={containerRef}
      onTouchMove={handleTouch}
      onTouchStart={handleTouch}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
        willChange: 'transform',
      }}
      className={cn(
        "absolute -top-1/4 left-1/4 z-30 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4 pointer-events-none",
        className,
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row-${i}`}
          className="relative h-8 w-16 border-l border-slate-700"
        >
          {cols.map((_, j) => {
            const boxKey = `${i}-${j}`;
            const isHighlighted = showHighlighted && (highlightedBoxes?.has(boxKey) ?? false);
            const showIcon = j % 2 === 0 && i % 2 === 0;
            
            return (
              <Box
                key={`col-${j}`}
                rowIndex={i}
                colIndex={j}
                onHover={onBoxHover || (() => {})}
                isHighlighted={isHighlighted}
                showIcon={showIcon}
              />
            );
          })}
        </motion.div>
      ))}
    </div>
  );
};

// Memoize the entire component
export const BoxesCore = memo(BoxesCoreComponent, (prevProps, nextProps) => {
  // Only re-render if showHighlighted changes
  // The highlightedBoxes set is managed via ref, so we don't check it
  return prevProps.showHighlighted === nextProps.showHighlighted &&
         prevProps.className === nextProps.className;
});

export const Boxes = React.memo(BoxesCore);
