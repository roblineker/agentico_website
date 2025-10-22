import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define the same schema as in the form for validation
const contactFormSchema = z.object({
  // Contact Information
  fullName: z.string().min(2, "Please enter your full name (at least 2 characters)"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  company: z.string().min(2, "Please enter your company name"),
  
  // Business Information
  industry: z.enum(["trades", "professional_services", "other"], {
    message: "Please select your industry",
  }),
  businessSize: z.enum(["1-5", "6-20", "21-50", "51-200", "200+"], {
    message: "Please select your business size",
  }),
  
  // Current State Assessment
  currentSystems: z.string().min(1, "Please describe your current systems"),
  monthlyVolume: z.enum(["0-100", "100-500", "500-1000", "1000-5000", "5000+"], {
    message: "Please select your monthly volume",
  }),
  teamSize: z.enum(["1-2", "3-5", "6-10", "11-20", "20+"], {
    message: "Please select team size",
  }),
  
  // Automation Needs
  automationGoals: z.array(z.string()).min(1, "Please select at least one automation goal"),
  specificProcesses: z.string().min(1, "Please describe specific processes to automate"),
  projectIdeas: z.array(z.object({
    title: z.string().min(3, "Please enter an idea title (at least 3 characters)"),
    description: z.string().min(1, "Please enter a description"),
    priority: z.enum(["high", "medium", "low"], {
      message: "Please select a priority level",
    }),
  })).optional(),
  
  // Integration Requirements
  existingTools: z.string().min(1, "Please list your existing tools/software"),
  integrationNeeds: z.array(z.string()),
  dataVolume: z.enum(["minimal", "moderate", "large", "very_large"], {
    message: "Please select data volume",
  }),
  
  // Project Scope
  projectDescription: z.string().min(1, "Please describe your project"),
  successMetrics: z.string().min(1, "Please describe how you'll measure success"),
  timeline: z.enum(["immediate", "1-3_months", "3-6_months", "6+_months"], {
    message: "Please select a timeline",
  }),
  budget: z.enum(["under_10k", "10k-25k", "25k-50k", "50k-100k", "100k+", "not_sure"], {
    message: "Please select a budget range",
  }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the form data
    const validatedData = contactFormSchema.parse(body);
    
    // Get the webhook URL from environment variables
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    
    // Check if webhook URL is configured and not a placeholder
    const isWebhookConfigured = webhookUrl && 
      !webhookUrl.includes('your-n8n-instance.com') && 
      !webhookUrl.includes('localhost') &&
      webhookUrl.startsWith('http');
    
    if (isWebhookConfigured) {
      try {
        // Prepare data for n8n webhook
        const webhookData = {
          ...validatedData,
          submittedAt: new Date().toISOString(),
          source: 'agentico_website',
          // Add any additional metadata you want to send
          userAgent: request.headers.get('user-agent'),
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        };
        
        // Send data to n8n webhook with timeout
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });
        
        if (!webhookResponse.ok) {
          console.error('Failed to send data to n8n webhook:', webhookResponse.status, webhookResponse.statusText);
        } else {
          console.log('Successfully sent data to n8n webhook');
        }
      } catch (webhookError) {
        console.error('Webhook request failed:', webhookError);
        // Don't fail the request if webhook fails - we still want to show success to user
      }
    } else {
      // Log form data to console for development/testing
      console.log('N8N webhook not configured. Form data received:', {
        ...validatedData,
        submittedAt: new Date().toISOString(),
        source: 'agentico_website',
      });
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      redirectTo: '/booking'
    });
    
  } catch (error) {
    console.error('Contact form submission error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
