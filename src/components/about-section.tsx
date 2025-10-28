import { ScrollAnimation, StaggerContainer } from "@/components/ui/scroll-animation";

export function AboutSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <ScrollAnimation direction="up" className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">
            AI That Actually Makes Sense for Small Business
          </h2>
        </ScrollAnimation>

        <StaggerContainer className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground" staggerDelay={0.2}>
          <p>
            Most AI companies talk in buzzwords and sell you complicated software that takes months to set up. We&apos;re different.
          </p>
          
          <p>
            We build practical AI tools for real businesses—trades, hospitality, retail, professional services, wholesalers. 
            The kind of businesses where every hour counts and nobody has time for tech that doesn&apos;t just work.
          </p>
          
          <p>
            Our solutions are simple, fast to implement, and designed to solve the problems that actually keep you up at night: 
            endless admin, chasing payments, missed opportunities, and never having enough hours in the day.
          </p>
          
          <p className="text-xl font-semibold text-foreground">
            No jargon. No six-month implementation timelines. <span className="text-primary">Just tools that work.</span>
          </p>
        </StaggerContainer>
      </div>
    </section>
  );
}
