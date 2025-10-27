"use client";

import React from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import * as SimpleIcons from "simple-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faMicrosoft,
  faGoogle,
  faOpenid,
} from "@fortawesome/free-brands-svg-icons";

const techStack = [
    {
      quote: "We leverage OpenAI's advanced models to build custom AI solutions that automate complex workflows, enhance customer engagement through intelligent chatbots, and generate powerful business insights from your data.",
      name: "OpenAI",
      title: "AI Platform",
      iconSlug: "openai",
      faIcon: null,
      url: "https://openai.com/api/",
    },
    {
      quote: "With a focus on safety and reliability, we use Anthropic's Claude AI to develop AI systems that can handle sensitive data, perform nuanced analysis, and provide trustworthy, helpful interactions for your team and customers.",
      name: "Anthropic",
      title: "AI Safety & Research",
      iconSlug: "anthropic",
      faIcon: null,
      url: "https://www.anthropic.com/claude",
    },
    {
      quote: "We use n8n to create powerful workflow automations, connecting all your business-critical applications (like CRM, ERP, and marketing platforms) to ensure a seamless flow of data and eliminate manual tasks.",
      name: "n8n",
      title: "Automation Platform",
      iconSlug: "n8n",
      faIcon: null,
      url: "https://n8n.io/integrations/ai",
    },
    {
      quote: "By building on Microsoft's enterprise-grade cloud, we deliver secure, scalable, and integrated AI solutions that seamlessly connect with your existing business systems and drive operational efficiency.",
      name: "Microsoft",
      title: "Business & Enterprise Cloud",
      iconSlug: "microsoft",
      faIcon: faMicrosoft,
      url: "https://azure.microsoft.com/en-us/solutions/ai",
    },
    {
      quote: "We utilize Google's powerful Cloud AI and machine learning services to build and scale enterprise-grade AI applications, enabling data-driven decision-making and predictive analytics to keep you ahead of the competition.",
      name: "Google",
      title: "Cloud AI",
      iconSlug: "google",
      faIcon: faGoogle,
      url: "https://cloud.google.com/products/ai",
    },
    {
      quote: "Our ability to use OpenRouter as an AI gateway allows us to select the best-performing AI model for each specific task, giving you a flexible, cost-effective, and powerful solution that isn't locked into a single provider.",
      name: "OpenRouter",
      title: "AI Gateway",
      iconSlug: null,
      faIcon: faOpenid,
      url: "https://openrouter.ai/",
    },
    {
      quote: "We build reliable and scalable applications with Supabase's modern backend infrastructure, ensuring your AI-powered tools are fast, secure, and ready to grow with your business.",
      name: "Supabase",
      title: "Backend Platform",
      iconSlug: "supabase",
      faIcon: null,
      url: "https://supabase.com/",
    },
    {
      quote: "We integrate with Xero's cloud accounting platform to build AI-powered solutions for financial forecasting, automated reporting, and streamlined expense management, giving you real-time insights into your business performance.",
      name: "Xero",
      title: "Accounting Platform",
      iconSlug: "xero",
      faIcon: null,
      url: "https://www.xero.com/",
    }
  
];

export function BrandIcon({ 
  iconSlug, 
  faIcon,
  name, 
  size = 48 
}: { 
  iconSlug: string | null; 
  faIcon?: IconDefinition | null;
  name: string; 
  size?: number;
}) {
  // Try Simple Icons first (priority)
  if (iconSlug) {
    const icon = SimpleIcons[`si${iconSlug.charAt(0).toUpperCase()}${iconSlug.slice(1)}` as keyof typeof SimpleIcons] as SimpleIcons.SimpleIcon | undefined;
    
    if (icon) {
      return (
        <div className="flex items-center justify-center" style={{ width: size, height: size }}>
          <svg
            role="img"
            viewBox="0 0 24 24"
            className="w-full h-full"
            fill="currentColor"
            dangerouslySetInnerHTML={{ __html: icon.svg }}
          />
        </div>
      );
    }
  }

  // Try Font Awesome as fallback
  if (faIcon) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <FontAwesomeIcon icon={faIcon} style={{ width: size, height: size }} />
      </div>
    );
  }

  // Fallback to letter
  return (
    <div 
      className="rounded-lg bg-primary/10 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <span className="text-primary font-bold text-2xl">
        {name.charAt(0)}
      </span>
    </div>
  );
}

export function TechStack() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <ScrollAnimation direction="up" className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">
            Powered by Industry-Leading Technology
          </h2>
        </ScrollAnimation>

        <div className="flex flex-col items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={techStack}
            direction="right"
            speed="slow"
          />
        </div>

      </div>
    </section>
  );
}

