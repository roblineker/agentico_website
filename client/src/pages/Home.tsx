import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowRight, Bot, Building2, FileText, Hammer, Scale, Users, Zap } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo-black.png" alt="Agentico" className="h-8 dark:hidden" />
            <img src="/logo-white.png" alt="Agentico" className="h-8 hidden dark:block" />
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-sm font-medium hover:text-primary transition-colors">
              Services
            </a>
            <a href="#industries" className="text-sm font-medium hover:text-primary transition-colors">
              Industries
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </a>
          </nav>
          <Button asChild>
            <a href="#contact">Get Started</a>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Bot className="h-4 w-4" />
                AI-Powered Business Automation
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Stop Drowning in Paperwork.{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Start Growing Your Business.
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Simple AI tools for small businesses that automate the boring stuff—so you can focus on what actually makes you money.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="#contact">
                    See How It Works
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#services">Learn More</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How We Can Help Section */}
        <section id="services" className="py-20 md:py-32">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold">Your Business, on Autopilot</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Here are some real-world problems we solve for businesses like yours:
              </p>
            </div>
            <div className="space-y-16">
              {/* Service 1 */}
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Create Quotes and Proposals in Minutes, Not Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">The Problem:</h4>
                    <p className="text-muted-foreground">You spend your evenings and weekends putting together quotes, proposals, or estimates instead of switching off. By the time you send it, the client has already gone with someone faster.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">The Solution:</h4>
                    <p className="text-muted-foreground">Our AI can take photos, notes, or even a client's email and generate a professional quote or proposal automatically. What used to take two hours now takes five minutes.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">Real-World Example:</h4>
                    <p className="text-muted-foreground">A plumber finishes a site inspection, snaps a few photos, and dictates some notes. By the time they're back in the van, a detailed quote is ready to send. A café owner gets a wholesale inquiry and has a pricing proposal generated before the customer even finishes their coffee.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Service 2 */}
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Automate Your Invoicing and Get Paid Faster</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">The Problem:</h4>
                    <p className="text-muted-foreground">Chasing up unpaid invoices is awkward, time-consuming, and kills your cash flow. You're running a business, not a debt collection agency.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">The Solution:</h4>
                    <p className="text-muted-foreground">We set up an AI assistant that automatically sends invoices when a job is complete, tracks who has and hasn't paid, and sends polite (or progressively firmer) reminders on your behalf. It's like having a bookkeeper who never sleeps.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">Real-World Example:</h4>
                    <p className="text-muted-foreground">A builder marks a job as complete. The invoice goes out automatically. After seven days, a friendly reminder. After fourteen days, a firmer follow-up. After thirty days, you get an alert that personal intervention might be needed. You get paid faster without the awkward conversations.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Service 3 */}
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Never Miss a Customer Call or Inquiry Again</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">The Problem:</h4>
                    <p className="text-muted-foreground">You're serving a customer, on a job site, or in a meeting when the phone rings. That missed call is a lost sale because they'll just ring the next business on Google.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">The Solution:</h4>
                    <p className="text-muted-foreground">Get a 24/7 AI receptionist that answers calls and messages, books appointments, answers common questions about your services and pricing, and takes detailed messages. Your customers always get a response, even when you're busy.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">Real-World Example:</h4>
                    <p className="text-muted-foreground">A potential customer calls a hair salon at 2 PM on a Tuesday. The owner is mid-haircut. The AI receptionist answers, explains the services, checks the calendar, and books them in for Thursday. When the owner finishes with their client, the appointment is already in the calendar with all the details.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Service 4 */}
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Tame Your Messy Inbox and Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">The Problem:</h4>
                    <p className="text-muted-foreground">Your inbox is chaos. Supplier invoices mixed with customer emails, quotes you need to follow up on, and that one important document you can never find when you need it.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">The Solution:</h4>
                    <p className="text-muted-foreground">Our AI organizes your emails automatically, extracts important information like due dates and payment terms, and files your documents logically. Finding any invoice, contract, or email becomes a five-second job instead of a twenty-minute search.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">Real-World Example:</h4>
                    <p className="text-muted-foreground">A wholesaler needs to find a quote they sent to a customer three months ago. Instead of scrolling through hundreds of emails, they ask their AI assistant "Show me the Johnson quote from July" and it appears instantly.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Service 5 */}
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Simplify Your Scheduling and Team Coordination</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">The Problem:</h4>
                    <p className="text-muted-foreground">Juggling jobs, shifts, deliveries, and team schedules is exhausting. You spend half your morning coordinating instead of actually working.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">The Solution:</h4>
                    <p className="text-muted-foreground">We build a simple system that helps you schedule work, assign tasks, and see who's doing what at a glance. Your team gets notifications on their phones, and you can check progress without constant phone calls or messages.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">Real-World Example:</h4>
                    <p className="text-muted-foreground">Monday morning, a café owner opens their phone and sees the week laid out clearly. Sarah is on morning shift, Dave handles afternoon, and the weekend roster is sorted. Everyone already knows when they're working. No group chat chaos, no confusion.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Service 6 */}
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Hammer className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Automate Your Customer Follow-Ups</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">The Problem:</h4>
                    <p className="text-muted-foreground">You know you should follow up with customers after a job, send birthday offers, or check in with regulars—but who has the time? Meanwhile, your competitors are staying top-of-mind.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">The Solution:</h4>
                    <p className="text-muted-foreground">We can set up automated follow-ups that feel personal. Thank-you messages after a purchase, maintenance reminders for service businesses, or special offers for loyal customers—all sent automatically at the right time.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">Real-World Example:</h4>
                    <p className="text-muted-foreground">An electrician completes a safety inspection. Two weeks later, the customer gets a friendly message asking if everything is working well and reminding them about their next scheduled check. A retail store sends birthday discounts to customers automatically, bringing them back through the door.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section id="industries" className="py-20 md:py-32 bg-muted/30">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold">Built for Real Businesses</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We work with small businesses across industries who are tired of drowning in admin work.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="border-2">
                <CardHeader>
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Hammer className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Trades & Construction</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Builders</li>
                    <li>Plumbers</li>
                    <li>Electricians</li>
                    <li>HVAC</li>
                    <li>Landscapers</li>
                    <li>Painters</li>
                    <li>Carpenters</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Hospitality & Retail</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Cafés</li>
                    <li>Restaurants</li>
                    <li>Retail stores</li>
                    <li>Salons</li>
                    <li>Gyms</li>
                    <li>Beauty services</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Scale className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Professional Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Accountants</li>
                    <li>Bookkeepers</li>
                    <li>Lawyers</li>
                    <li>Consultants</li>
                    <li>Recruiters</li>
                    <li>Real estate agents</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Other Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Wholesale & Distribution</li>
                    <li>Cleaning services</li>
                    <li>Maintenance companies</li>
                    <li>Event services</li>
                    <li>Transport & logistics</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Agentico Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold">AI That Actually Makes Sense for Small Business</h2>
            </div>
            <div className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground">
              <p>
                Most AI companies talk in buzzwords and sell you complicated software that takes months to set up. We're different.
              </p>
              <p>
                We build practical AI tools for real businesses—trades, hospitality, retail, professional services, wholesalers. The kind of businesses where every hour counts and nobody has time for tech that doesn't just work.
              </p>
              <p>
                Our solutions are simple, fast to implement, and designed to solve the problems that actually keep you up at night: endless admin, chasing payments, missed opportunities, and never having enough hours in the day.
              </p>
              <p className="text-xl font-semibold text-foreground">
                No jargon. No six-month implementation timelines. Just tools that work.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact" className="py-20 md:py-32 bg-muted/30">
          <div className="container">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-5xl font-bold">Ready to Get Your Time Back?</h2>
              <div className="max-w-3xl mx-auto space-y-4 text-lg text-muted-foreground">
                <p>
                  Curious how this could work for your business? Let's have a chat. No pressure, no confusing jargon, no sales pitch. Just a straight-up conversation about your business and the specific headaches we might be able to solve.
                </p>
                <p>
                  We'll talk about what's eating up your time, what's costing you money, and whether AI can actually help. If it's a good fit, great. If it's not, we'll tell you honestly.
                </p>
              </div>
            </div>
            <Collapsible>
              <div className="flex justify-center mb-8">
                <CollapsibleTrigger asChild>
                  <Button size="lg">
                    Book a Chat
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <ContactForm />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold">Common Questions</h2>
            </div>
            <div className="max-w-4xl mx-auto space-y-8">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">Is this going to be complicated to set up?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nope. We handle the setup and make sure everything integrates with your existing tools. Most solutions are up and running within a week or two.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">Do I need to be "tech-savvy"?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Not at all. If you can use your phone and email, you can use our tools. We build them to be simple.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">What if I don't know what I need?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    That's totally fine. Most of our clients start with "I just need more time" or "I hate doing quotes." We help you figure out what would actually make a difference.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">How much does it cost?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    It depends on what you need. We start with a $399 workshop where we map out your specific challenges and solutions. From there, we give you a clear quote with no surprises.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">Will this replace my staff?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    No. Our tools handle the boring, repetitive stuff so your team can focus on the work that actually requires a human touch—like serving customers, doing quality work, and growing the business.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">What if it doesn't work for my industry?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We'll tell you upfront in the workshop if we don't think we can help. We're not here to sell you something that won't work.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <img src="/logo-black.png" alt="Agentico" className="h-8 dark:hidden" />
              <img src="/logo-white.png" alt="Agentico" className="h-8 hidden dark:block" />
              <p className="text-sm text-muted-foreground">
                AI-powered automation for trades and professional services businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#services" className="hover:text-foreground transition-colors">Process Automation</a></li>
                <li><a href="#services" className="hover:text-foreground transition-colors">Document Intelligence</a></li>
                <li><a href="#services" className="hover:text-foreground transition-colors">Custom AI Agents</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Industries</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#industries" className="hover:text-foreground transition-colors">Trades Businesses</a></li>
                <li><a href="#industries" className="hover:text-foreground transition-colors">Professional Services</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="mailto:sales@agentico.com.au" className="hover:text-foreground transition-colors">sales@agentico.com.au</a></li>
                <li>Sunshine Coast, QLD, Australia</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Agentico. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

