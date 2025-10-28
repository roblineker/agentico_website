"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "#services", label: "Services" },
    { href: "#industries", label: "Industries" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo-black.png"
            alt="Agentico"
            width={120}
            height={32}
            className="h-8 w-auto dark:hidden"
            priority
          />
          <Image
            src="/images/logo-white.png"
            alt="Agentico"
            width={120}
            height={32}
            className="h-8 w-auto hidden dark:block"
            priority
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/fidget">Procrastinate</Link>
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link href="#contact">Get Started</Link>
          </Button>

          {/* Mobile Theme Toggle */}
          <div className="md:hidden">
            <ThemeToggle />
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-6 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/fidget" onClick={() => setIsOpen(false)}>
                    Procrastinate
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="#contact" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
