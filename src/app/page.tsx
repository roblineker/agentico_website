import { HeroSection } from "@/components/hero-section";
import { ServicesSection } from "@/components/services-section";
import { IndustriesSection } from "@/components/industries-section";
import { TechStack } from "@/components/tech-stack";
import { AboutSection } from "@/components/about-section";
import { FAQSection } from "@/components/faq-section";
import { ContactSection } from "@/components/contact-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TechStack />
      <AboutSection />
      <IndustriesSection />
      <ServicesSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
