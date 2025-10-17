"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-9 w-9 p-0">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-1 p-2 w-32">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme("light")}
                className={`justify-start ${theme === "light" ? "bg-accent" : ""}`}
              >
                <Sun className="mr-2 h-4 w-4" />
                Light
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme("dark")}
                className={`justify-start ${theme === "dark" ? "bg-accent" : ""}`}
              >
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme("system")}
                className={`justify-start ${theme === "system" ? "bg-accent" : ""}`}
              >
                <Monitor className="mr-2 h-4 w-4" />
                System
              </Button>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
