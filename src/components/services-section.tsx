import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Building2, 
  Users, 
  Bot, 
  Zap, 
  Hammer 
} from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "Create Quotes and Proposals in Minutes, Not Hours",
    problem: "You spend your evenings and weekends putting together quotes, proposals, or estimates instead of switching off. By the time you send it, the client has already gone with someone faster.",
    solution: "Our AI can take photos, notes, or even a client's email and generate a professional quote or proposal automatically. What used to take two hours now takes five minutes.",
    example: "A plumber finishes a site inspection, snaps a few photos, and dictates some notes. By the time they're back in the van, a detailed quote is ready to send. A café owner gets a wholesale inquiry and has a pricing proposal generated before the customer even finishes their coffee."
  },
  {
    icon: Building2,
    title: "Automate Your Invoicing and Get Paid Faster",
    problem: "Chasing up unpaid invoices is awkward, time-consuming, and kills your cash flow. You're running a business, not a debt collection agency.",
    solution: "We set up an AI assistant that automatically sends invoices when a job is complete, tracks who has and hasn't paid, and sends polite (or progressively firmer) reminders on your behalf. It's like having a bookkeeper who never sleeps.",
    example: "A builder marks a job as complete. The invoice goes out automatically. After seven days, a friendly reminder. After fourteen days, a firmer follow-up. After thirty days, you get an alert that personal intervention might be needed. You get paid faster without the awkward conversations."
  },
  {
    icon: Users,
    title: "Never Miss a Customer Call or Inquiry Again",
    problem: "You're serving a customer, on a job site, or in a meeting when the phone rings. That missed call is a lost sale because they'll just ring the next business on Google.",
    solution: "Get a 24/7 AI receptionist that answers calls and messages, books appointments, answers common questions about your services and pricing, and takes detailed messages. Your customers always get a response, even when you're busy.",
    example: "A potential customer calls a hair salon at 2 PM on a Tuesday. The owner is mid-haircut. The AI receptionist answers, explains the services, checks the calendar, and books them in for Thursday. When the owner finishes with their client, the appointment is already in the calendar with all the details."
  },
  {
    icon: Bot,
    title: "Tame Your Messy Inbox and Documents",
    problem: "Your inbox is chaos. Supplier invoices mixed with customer emails, quotes you need to follow up on, and that one important document you can never find when you need it.",
    solution: "Our AI organizes your emails automatically, extracts important information like due dates and payment terms, and files your documents logically. Finding any invoice, contract, or email becomes a five-second job instead of a twenty-minute search.",
    example: "A wholesaler needs to find a quote they sent to a customer three months ago. Instead of scrolling through hundreds of emails, they ask their AI assistant \"Show me the Johnson quote from July\" and it appears instantly."
  },
  {
    icon: Zap,
    title: "Simplify Your Scheduling and Team Coordination",
    problem: "Juggling jobs, shifts, deliveries, and team schedules is exhausting. You spend half your morning coordinating instead of actually working.",
    solution: "We build a simple system that helps you schedule work, assign tasks, and see who's doing what at a glance. Your team gets notifications on their phones, and you can check progress without constant phone calls or messages.",
    example: "Monday morning, a café owner opens their phone and sees the week laid out clearly. Sarah is on morning shift, Dave handles afternoon, and the weekend roster is sorted. Everyone already knows when they're working. No group chat chaos, no confusion."
  },
  {
    icon: Hammer,
    title: "Automate Your Customer Follow-Ups",
    problem: "You know you should follow up with customers after a job, send birthday offers, or check in with regulars—but who has the time? Meanwhile, your competitors are staying top-of-mind.",
    solution: "We can set up automated follow-ups that feel personal. Thank-you messages after a purchase, maintenance reminders for service businesses, or special offers for loyal customers—all sent automatically at the right time.",
    example: "An electrician completes a safety inspection. Two weeks later, the customer gets a friendly message asking if everything is working well and reminding them about their next scheduled check. A retail store sends birthday discounts to customers automatically, bringing them back through the door."
  }
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-32">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">Your Business, Supercharged</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Here are some real-world problems we solve for businesses like yours:
          </p>
        </div>

        <div className="space-y-16">
          {services.map((service, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-destructive mb-2">The Problem:</h4>
                  <p className="text-muted-foreground">{service.problem}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-2">The Solution:</h4>
                  <p className="text-muted-foreground">{service.solution}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Real-World Example:</h4>
                  <p className="text-muted-foreground">{service.example}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
