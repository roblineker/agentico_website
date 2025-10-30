"use client";

import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { ContactForm } from "@/app/components/contact-form";

export function ContactSection() {
  return (
    <section id="contact" className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <ScrollAnimation direction="up" className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-5xl font-bold">Ready to Get <span className="text-primary">Your Time</span> Back?</h2>
          <div className="max-w-3xl mx-auto space-y-4 text-lg text-muted-foreground">
            <p>
              Curious how this could work for your business? Let&apos;s have a chat. No pressure, no confusing jargon, 
              no sales pitch. Just a straight-up conversation about your business and the specific headaches we might be able to solve.
            </p>
            <p>
              We&apos;ll talk about what&apos;s eating up your time, what&apos;s costing you money, and whether AI can actually help. 
              If it&apos;s a good fit, great. If it&apos;s not, we&apos;ll tell you honestly.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.2}>
          <ContactForm />
        </ScrollAnimation>
      </div>
    </section>
  );
}
