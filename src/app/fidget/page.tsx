"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { BoxesCore } from "@/components/ui/background-boxes";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff, RotateCcw, Share2, Maximize } from "lucide-react";

// Box dimensions in pixels (Tailwind: h-8 = 32px, w-16 = 64px)
const BOX_HEIGHT = 32;
const BOX_WIDTH = 64;
const SCALE_FACTOR = 0.675; // From the transform in background-boxes

export default function FidgetPage() {
  const [showHighlighted, setShowHighlighted] = useState(false);
  const [hoveredCount, setHoveredCount] = useState(0);
  const [viewableBoxes, setViewableBoxes] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoveredBoxesRef = useRef<Set<string>>(new Set());

  // Show dialog on first visit
  useEffect(() => {
    setDialogOpen(true);
  }, []);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Request fullscreen
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement && containerRef.current) {
      try {
        await containerRef.current.requestFullscreen();
      } catch (error) {
        console.error('Error attempting to enable fullscreen:', error);
      }
    } else if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (error) {
        console.error('Error attempting to exit fullscreen:', error);
      }
    }
  };

  // Calculate viewable boxes based on viewport size
  useEffect(() => {
    const calculateViewableBoxes = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // After scale, each box is effectively this size in pixels
      const scaledBoxWidth = BOX_WIDTH * SCALE_FACTOR; // 43.2px
      const scaledBoxHeight = BOX_HEIGHT * SCALE_FACTOR; // 21.6px
      
      // The skew and rotation make boxes take up more space
      // The skewX(-48deg) and skewY(14deg) create diagonal patterns
      // Mobile screens are typically narrower, so fewer boxes fit horizontally
      const isMobile = viewportWidth < 768;
      
      // Calculate approximate visible boxes accounting for the transform
      // The skew makes the grid stretch diagonally, so we need different calculations
      const horizontalBoxes = Math.ceil(viewportWidth / scaledBoxWidth);
      const verticalBoxes = Math.ceil(viewportHeight / scaledBoxHeight);
      
      // Skew multiplier is lower for mobile due to narrower viewport
      const skewMultiplier = isMobile ? 1.2 : 1.8;
      
      const visibleBoxes = Math.ceil(horizontalBoxes * verticalBoxes * skewMultiplier);
      setViewableBoxes(visibleBoxes);
    };

    calculateViewableBoxes();
    window.addEventListener('resize', calculateViewableBoxes);
    
    return () => window.removeEventListener('resize', calculateViewableBoxes);
  }, []);

  const handleBoxHover = useCallback((rowIndex: number, colIndex: number) => {
    // Only track if we're not currently showing highlighted boxes
    if (!showHighlighted) {
      const boxKey = `${rowIndex}-${colIndex}`;
      hoveredBoxesRef.current.add(boxKey);
    }
  }, [showHighlighted]);

  const toggleShowHighlighted = () => {
    setShowHighlighted(prev => {
      // If we're currently showing and about to hide, clear the memory
      if (prev) {
        hoveredBoxesRef.current.clear();
        setHoveredCount(0);
      } else {
        // About to show, update the count
        setHoveredCount(hoveredBoxesRef.current.size);
      }
      return !prev;
    });
  };

  const handleReset = () => {
    hoveredBoxesRef.current.clear();
    setHoveredCount(0);
    setShowHighlighted(false);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const scorePercentage = ((hoveredCount / viewableBoxes) * 100).toFixed(2);
    const shareText = `I scored ${scorePercentage}% on the Fidget Thingy! Can you beat my score?`;
    
    // Try to use native Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Fidget Thingy Challenge",
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log("Share cancelled or failed", error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        const fullMessage = `${shareText}\n${shareUrl}`;
        await navigator.clipboard.writeText(fullMessage);
        alert("Link and score copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy link", error);
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden touch-none"
      style={{ 
        WebkitUserSelect: 'none',
        userSelect: 'none',
        touchAction: 'none',
        height: '100dvh',
        overscrollBehavior: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Animated Background Boxes */}
      <div className="absolute inset-0 w-full h-full bg-slate-900/5 dark:bg-slate-900/20 z-0">
        <BoxesCore 
          onBoxHover={handleBoxHover}
          highlightedBoxes={hoveredBoxesRef.current}
          showHighlighted={showHighlighted}
        />
      </div>
      
      {/* Logo and Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <Image 
          src="/images/logo-white.png" 
          alt="Agentico Logo" 
          width={120} 
          height={40}
          className="dark:block hidden"
        />
        <Image 
          src="/images/logo-black.png" 
          alt="Agentico Logo" 
          width={120} 
          height={40}
          className="dark:hidden block"
        />
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" variant="ghost">Fidget Thingy</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How to Use</DialogTitle>
              <DialogDescription asChild>
                <div className="space-y-3 pt-4">
                  <p>
                    <strong>Desktop:</strong> Hover your mouse over the boxes and watch them light up with random colors.
                  </p>
                  <p>
                    <strong>Mobile:</strong> Swipe your finger across the screen to light up the boxes.
                  </p>
                  <p>
                    Click the <Eye className="inline h-4 w-4 mx-1" /> <strong>Eye button</strong> in the top right to reveal all the boxes you have touched.
                  </p>
                  <p>
                    Click <EyeOff className="inline h-4 w-4 mx-1" /> again to hide them and clear your history to start fresh.
                  </p>
                  <p>
                    Use the <Maximize className="inline h-4 w-4 mx-1" /> <strong>Fullscreen button</strong> for an immersive experience.
                  </p>
                  <p className="text-primary font-medium pt-2">
                    It really is quite pointless.
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="default" onClick={() => setDialogOpen(false)}>
                Got it
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Control Buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button 
          variant="default" 
          size="icon"
          onClick={toggleShowHighlighted}
          title={showHighlighted ? "Hide and clear memory" : "Show all touched boxes"}
        >
          {showHighlighted ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          <Maximize className="h-4 w-4" />
        </Button>
        <Button asChild variant="outline" size="icon">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Score Display */}
      {showHighlighted && viewableBoxes > 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-background/90 backdrop-blur-sm border-2 border-primary rounded-xl px-8 py-6 shadow-2xl">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Score
                </p>
                <p className="text-6xl font-bold text-primary">
                  {((hoveredCount / viewableBoxes) * 100).toFixed(2)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {hoveredCount.toLocaleString()} / {viewableBoxes.toLocaleString()} boxes
                </p>
              </div>
              <div className="flex gap-2 w-full">
                <Button 
                  onClick={handleReset} 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  onClick={handleShare} 
                  variant="default" 
                  size="sm"
                  className="flex-1"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

