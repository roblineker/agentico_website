import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollAnimation, StaggerContainer } from "@/components/ui/scroll-animation";

const faqs = [
  {
    question: "Is this going to be complicated to set up?",
    answer: "Nope. We handle the setup and make sure everything integrates with your existing tools. Most solutions are up and running within a week or two."
  },
  {
    question: "Do I need to be \"tech-savvy\"?",
    answer: "Not at all. If you can use your phone and email, you can use our tools. We build them to be simple."
  },
  {
    question: "Wha if I don't have time to implement the tools?",
    answer: "We'll help you set up the tools so you can start using them right away. We'll also help you train your team to use the tools. We'll also help you troubleshoot any issues that come up."
  },
  {
    question: "What if I don't know what I need?",
    answer: "That's totally fine. Most of our clients start with \"I just need more time\" or \"I hate doing quotes.\" We help you figure out what would actually make a difference."
  },
  {
    question: "How much does it cost?",
    answer: "It depends on what you need. We start with a $399 workshop where we map out your specific challenges and solutions. To build and implement the infrastructure and modest AI capabilities, we recommend a budget of between $2,000 & $8,000."
  },
  {
    question: "Will this replace my staff?",
    answer: "No. Our tools handle the boring, repetitive stuff so your team can focus on the work that actually requires a human touch—like serving customers, doing quality work, and growing the business."
  },
  {
    question: "What if it doesn't work for my industry?",
    answer: "We'll tell you upfront in the workshop if we don't think we can help. We're not here to sell you something that won't work."
  },
];

export function FAQSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <ScrollAnimation direction="up" className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">Common Questions</h2>
        </ScrollAnimation>

        <StaggerContainer className="max-w-4xl mx-auto space-y-8" staggerDelay={0.1}>
          {faqs.map((faq, index) => (
            <Card key={index} className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
