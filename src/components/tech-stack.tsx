"use client";

import React from "react";
import Image from "next/image";
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

interface TechStackItem {
  quote: string;
  name: string;
  title: string;
  iconSlug: string | null;
  faIcon: IconDefinition | null;
  url: string;
  customIcon?: boolean;
}

const techStack: TechStackItem[] = [
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
      title: "AI Platform",
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
    },
    {
      quote: "We use ElevenLabs' cutting-edge voice AI technology to create natural-sounding voice agents and text-to-speech solutions, enabling personalized customer experiences and automated voice interactions that sound remarkably human.",
      name: "ElevenLabs",
      title: "Voice AI Platform",
      iconSlug: "elevenlabs",
      faIcon: null,
      url: "https://elevenlabs.io/",
    },
    {
      quote: "We leverage Twilio's communications platform to build robust SMS, voice, and messaging solutions, enabling seamless customer engagement and automated notifications that keep your team and clients connected.",
      name: "Twilio",
      title: "Communications Platform",
      iconSlug: "twilio",
      faIcon: null,
      url: "https://www.twilio.com/",
    },
    {
      quote: "We integrate with Procore's construction management platform to automate project workflows, enhance collaboration, and deliver AI-powered insights that help construction teams stay on schedule and under budget.",
      name: "Procore",
      title: "Construction Management",
      iconSlug: "procore",
      faIcon: null,
      url: "https://www.procore.com/",
      customIcon: true,
    },
    {
      quote: "We build custom integrations with Jobpac to streamline job management, automate quoting and invoicing, and provide real-time visibility into your trade business operations.",
      name: "Jobpac",
      title: "Job Management",
      iconSlug: "trimble",
      faIcon: null,
      url: "https://www.jobpac.com/",
    },
    {
      quote: "We integrate with Aircall's cloud-based call center solution to create intelligent call routing, automated logging, and AI-powered call analytics that improve your team's productivity and customer satisfaction.",
      name: "Aircall",
      title: "Cloud Call Center",
      iconSlug: "aircall",
      faIcon: null,
      url: "https://aircall.io/",
    },
    {
      quote: "We utilize Vapi's voice AI infrastructure to build sophisticated phone agents that can handle customer inquiries, schedule appointments, and perform complex tasks through natural voice conversations.",
      name: "Vapi",
      title: "Voice AI Infrastructure",
      iconSlug: "vapi",
      faIcon: null,
      url: "https://vapi.ai/",
      customIcon: true,
    }
  
];

export function BrandIcon({ 
  iconSlug, 
  faIcon,
  name, 
  size = 48,
  customIcon = false
}: { 
  iconSlug: string | null; 
  faIcon?: IconDefinition | null;
  name: string; 
  size?: number;
  customIcon?: boolean;
}) {
  // Try custom local icon first (if customIcon flag is set)
  if (customIcon && iconSlug) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <Image
          src={`/icons/${iconSlug}.svg`}
          alt={`${name} logo`}
          width={size}
          height={size}
          className="object-contain"
        />
      </div>
    );
  }

  // Try Simple Icons (priority for standard icons)
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
  // Split the tech stack into two rows
  const midPoint = Math.ceil(techStack.length / 2);
  const firstRow = techStack.slice(0, midPoint);
  const secondRow = techStack.slice(midPoint);

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <ScrollAnimation direction="up" className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">
            Powered by <span className="text-primary">Industry-Leading</span> Technology
          </h2>
        </ScrollAnimation>

        <div className="flex flex-col items-center justify-center relative overflow-hidden space-y-8">
          <InfiniteMovingCards
            items={firstRow}
            direction="right"
            speed="slow"
          />
          <InfiniteMovingCards
            items={secondRow}
            direction="left"
            speed="slow"
          />
        </div>

      </div>
    </section>
  );
}

