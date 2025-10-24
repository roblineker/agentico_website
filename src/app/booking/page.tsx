'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Declare Koalendar types for TypeScript
declare global {
  interface Window {
    Koalendar: {
      (action: string, config: { url: string; selector: string }): void;
      props?: unknown[];
    };
  }
}

export default function BookingPage() {
  useEffect(() => {
    // Initialize Koalendar function
    window.Koalendar = window.Koalendar || function(...args) {
      (window.Koalendar.props = window.Koalendar.props || []).push(...args);
    };

    // Load the Koalendar script
    const script = document.createElement('script');
    script.src = 'https://koalendar.com/assets/widget.js';
    script.async = true;
    
    script.onload = () => {
      // Initialize the widget after script loads
      if (window.Koalendar) {
        window.Koalendar('inline', {
          url: 'https://koalendar.com/e/discovery-call-with-agentico',
          selector: '#inline-widget-discovery-call-with-agentico'
        });
      }
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const existingScript = document.querySelector('script[src="https://koalendar.com/assets/widget.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logo and Back Button */}
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/images/logo-black.png"
              alt="Agentico Logo"
              width={120}
              height={40}
              className="h-8 w-auto dark:hidden"
            />
            <Image
              src="/images/logo-white.png"
              alt="Agentico Logo"
              width={120}
              height={40}
              className="h-8 w-auto hidden dark:block"
            />
          </Link>
          
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
          </Button>
        </div>

        {/* Page Title and Description */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            Let&apos;s Schedule Your Discovery Call
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thank you for providing detailed information about your business needs. 
            Now let&apos;s schedule a time to discuss how we can help automate your processes 
            and save you valuable time.
          </p>
        </div>

        {/* Duration Recommendations */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-center">Recommended Call Duration</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2 text-center p-4 rounded-md bg-muted/50">
                <div className="font-medium">Small Businesses</div>
                <div className="text-2xl font-bold text-primary">1 Hour</div>
                </div>
              <div className="space-y-2 text-center p-4 rounded-md bg-muted/50">
                <div className="font-medium">Medium Businesses</div>
                <div className="text-2xl font-bold text-primary">1.5 Hours</div>
                </div>
              <div className="space-y-2 text-center p-4 rounded-md bg-muted/50">
                <div className="font-medium">Complex Businesses</div>
                <div className="text-2xl font-bold text-primary">2 Hours</div></div>
            </div>
          </div>
        </div>

        {/* Koalendar Widget Container */}
        <div className="max-w-4xl mx-auto">
          <div 
            id="inline-widget-discovery-call-with-agentico" 
            className="min-h-[600px] rounded-lg border bg-card"
          />
        </div>

        {/* Additional Information */}
        <div className="max-w-2xl mx-auto mt-12 text-center space-y-4">
          <h2 className="text-xl font-semibold">What to Expect</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="space-y-2">
              <h3 className="font-medium">During the Call (60-120 Minutes)</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Review your specific automation needs</li>
                <li>• Discuss potential AI solutions</li>
                <li>• Provide preliminary cost estimates</li>
                <li>• Answer your technical questions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">After the Call (1-3 Business Days)</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Detailed proposal</li>
                <li>• Project timeline and milestones</li>
                <li>• Next steps if we&apos;re a good fit</li>
                <li>• Kick off the project</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Can&apos;t find a suitable time? Email us directly at{' '}
              <a 
                href="mailto:hello@agentico.com.au" 
                className="text-primary hover:underline"
              >
                hello@agentico.com.au
              </a>
              {' '}and we&apos;ll work something out.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
