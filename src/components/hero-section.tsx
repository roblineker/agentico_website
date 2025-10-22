import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Boxes } from "@/components/ui/background-boxes";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { Bot, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 w-full h-full bg-slate-900/5 dark:bg-slate-900/20 z-0">
        <Boxes />
      </div>
      
      {/* Mask overlay - separate from boxes container */}
      <div className="absolute inset-0 w-full h-full bg-background/80 dark:bg-background/60 z-25 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      
      <div className="container relative z-20">
        <div className="max-w-3xl mx-auto text-center space-y-8 pointer-events-none">
          {/* Badge */}
          <ScrollAnimation delay={0.1} direction="fade">
            <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium">
              <Bot className="h-4 w-4" />
              AI Consulting, Engineering & Solutions
            </Badge>
          </ScrollAnimation>

          {/* Main Headline */}
          <ScrollAnimation delay={0.2} direction="up">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Stop Drowning in Paperwork.{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Start Growing Your Business.
              </span>
            </h1>
          </ScrollAnimation>

          {/* Subtitle */}
          <ScrollAnimation delay={0.3} direction="up">
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple AI tools for small businesses that automate the boring stuff—so you can focus on what actually makes you money.
            </p>
          </ScrollAnimation>

          {/* CTA Buttons */}
          <ScrollAnimation delay={0.4} direction="up" className="pointer-events-auto">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base">
                <Link href="#contact">
                  See How It Works
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="#services">Learn More</Link>
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
