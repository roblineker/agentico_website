import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollAnimation, StaggerContainer } from "@/components/ui/scroll-animation";
import { Hammer, Users, Scale, Building2 } from "lucide-react";

const industries = [
  {
    icon: Hammer,
    title: "Trades & Construction",
    services: [
      "Builders",
      "Plumbers", 
      "Electricians",
      "HVAC",
      "Landscapers",
      "Painters",
      "Carpenters"
    ]
  },
  {
    icon: Users,
    title: "Hospitality & Retail",
    services: [
      "Cafés",
      "Restaurants",
      "Retail stores",
      "Salons",
      "Gyms",
      "Beauty services"
    ]
  },
  {
    icon: Scale,
    title: "Professional Services",
    services: [
      "Accountants",
      "Bookkeepers",
      "Lawyers",
      "Consultants",
      "Recruiters",
      "Real estate agents"
    ]
  },
  {
    icon: Building2,
    title: "Other Services",
    services: [
      "Wholesale & Distribution",
      "Cleaning services",
      "Maintenance companies",
      "Event services",
      "Transport & logistics"
    ]
  }
];

export function IndustriesSection() {
  return (
    <section id="industries" className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <ScrollAnimation direction="up" className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">Built for Real Businesses</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We work with small businesses across industries who are tired of drowning in admin work.
          </p>
        </ScrollAnimation>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={0.15}>
          {industries.map((industry, index) => (
            <Card key={index} className="border-2">
              <CardHeader>
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <industry.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{industry.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {industry.services.map((service, serviceIndex) => (
                    <li key={serviceIndex}>{service}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
