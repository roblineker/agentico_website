import { Header } from "@/app/components/header";
import { HeroSection } from "@/app/components/hero-section";
import { ServicesSection } from "@/app/components/services-section";
import { IndustriesSection } from "@/app/components/industries-section";
import { TechStack } from "@/app/components/tech-stack";
import { AboutSection } from "@/app/components/about-section";
import { FAQSection } from "@/app/components/faq-section";
import { ContactSection } from "@/app/components/contact-section";
import { Footer } from "@/app/components/footer";
import { ElevenLabsWidget } from "@/app/components/elevenlabs-widget";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <TechStack />
        <AboutSection />
        <IndustriesSection />
        <ServicesSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <ElevenLabsWidget />
    </div>
  );
}
