"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ArrowRight } from "lucide-react";

export function ContactSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="contact" className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-5xl font-bold">Ready to Get Your Time Back?</h2>
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
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex justify-center mb-8">
            <CollapsibleTrigger asChild>
              <Button size="lg" className="text-base">
                Book a Chat
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-4">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Let&apos;s Talk About Your Business</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Your last name" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="business">Business Name</Label>
                  <Input id="business" placeholder="Your business name" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" placeholder="e.g., Plumbing, Café, Accounting" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="challenge">What&apos;s your biggest time-waster right now?</Label>
                  <Textarea 
                    id="challenge" 
                    placeholder="Tell us about the admin tasks or processes that eat up your time..."
                    rows={4}
                  />
                </div>
                
                <Button type="submit" className="w-full" size="lg">
                  Send Message
                </Button>
                
                <p className="text-sm text-muted-foreground text-center">
                  We&apos;ll get back to you within 24 hours to schedule a brief chat.
                </p>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
}
