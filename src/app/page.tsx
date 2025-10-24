import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ServicesSection } from "@/components/services-section";
import { IndustriesSection } from "@/components/industries-section";
import { AboutSection } from "@/components/about-section";
import { FAQSection } from "@/components/faq-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { ElevenLabsWidget } from "@/components/elevenlabs-widget";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <IndustriesSection />
        <AboutSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      {/* <ElevenLabsWidget /> */}
    </div>
  );
}
