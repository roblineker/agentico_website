export function AboutSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">
            AI That Actually Makes Sense for Small Business
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground">
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
            No jargon. No six-month implementation timelines. Just tools that work.
          </p>
        </div>
      </div>
    </section>
  );
}
