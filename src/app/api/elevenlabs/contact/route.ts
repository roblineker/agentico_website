import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Client } from '@notionhq/client';
import * as postmark from 'postmark';
import { getCallConfirmationEmail } from '@/lib/email-templates/call-confirmation';
import { contactFormLimiter, checkRateLimit, getRequestIdentifier } from '@/lib/security/rate-limit';
import { sanitizeObject } from '@/lib/security/sanitize';
import { logger } from '@/lib/security/logger';

// Flexible schema for ElevenLabs - only requires the basics, everything else is optional
const elevenlabsContactSchema = z.object({
  // Required fields
  fullName: z.string().min(2, "Please provide a name"),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().min(10, "Please provide a valid phone number"),
  company: z.string().min(2, "Please provide a company name"),
  
  // Optional fields
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  socialLinks: z.array(z.object({
    url: z.string().url(),
  })).optional(),
  
  // Business Information (all optional)
  industry: z.enum([
    "construction_trades",
    "electrical_plumbing",
    "hvac",
    "landscaping_gardening",
    "painting_decorating",
    "carpentry_joinery",
    "roofing",
    "other_trades_construction",
    "legal_services",
    "accounting_bookkeeping",
    "financial_advisory",
    "consulting",
    "human_resources",
    "real_estate",
    "property_management",
    "insurance",
    "other_professional_services",
    "healthcare_medical",
    "dental",
    "veterinary",
    "fitness_wellness",
    "beauty_salon",
    "other_healthcare_wellness",
    "retail",
    "ecommerce",
    "hospitality_hotels",
    "restaurants_cafes",
    "catering",
    "other_retail_hospitality",
    "event_planning",
    "marketing_advertising",
    "it_services",
    "software_development",
    "design_creative",
    "photography_videography",
    "other_creative_tech",
    "education_training",
    "childcare",
    "cleaning_services",
    "logistics_transport",
    "warehousing",
    "manufacturing",
    "wholesale_distribution",
    "automotive_repair",
    "security_services",
    "recruitment_staffing",
    "other_services",
    "other"
  ]).optional(),
  businessSize: z.enum(["1-5", "6-20", "21-50", "51-200", "200+"]).optional(),
  
  // Current State Assessment (all optional)
  currentSystems: z.string().optional(),
  monthlyVolume: z.enum(["0-100", "100-500", "500-1000", "1000-5000", "5000+"]).optional(),
  teamSize: z.enum(["1-2", "3-5", "6-10", "11-20", "20+"]).optional(),
  
  // Automation Needs (all optional)
  automationGoals: z.array(z.string()).optional(),
  specificProcesses: z.string().optional(),
  projectIdeas: z.array(z.object({
    title: z.string().min(3),
    description: z.string().min(1),
    priority: z.enum(["high", "medium", "low"]),
  })).optional(),
  
  // Integration Requirements (all optional)
  existingTools: z.string().optional(),
  integrationNeeds: z.array(z.string()).optional(),
  dataVolume: z.enum(["minimal", "moderate", "large", "very_large"]).optional(),
  
  // Project Scope (all optional)
  projectDescription: z.string().optional(),
  successMetrics: z.string().optional(),
  timeline: z.enum(["immediate", "1-3_months", "3-6_months", "6+_months"]).optional(),
  budget: z.enum(["under_10k", "10k-25k", "25k-50k", "50k-100k", "100k+", "not_sure"]).optional(),
  
  // Call metadata
  callId: z.string().optional(),
  callDuration: z.number().optional(),
  callTranscript: z.string().optional(),
});

type ElevenlabsContactData = z.infer<typeof elevenlabsContactSchema>;

// Initialize Notion client
const initializeNotion = () => {
  const notionToken = process.env.NOTION_API_TOKEN;
  
  if (!notionToken) {
    console.warn('Notion API token not configured');
    return null;
  }
  
  return new Client({ 
    auth: notionToken,
    notionVersion: '2022-06-28',
  });
};

// Helper function to format industry name for display
const formatIndustry = (industry: string) => {
  return industry.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Helper to create or find client
async function createOrFindClient(notion: Client, data: ElevenlabsContactData) {
  try {
    const clientsDatabaseId = '28753ceefab08000a95cea49e7bf1762';
    
    // Search for existing client
    const searchResponse = await notion.search({
      query: data.company,
      filter: {
        property: 'object',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: 'page' as any,
      },
    });
    
    // Check if we found an exact match in Clients database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingClient = searchResponse.results.find((page: any) => {
      const title = page.properties?.Name?.title?.[0]?.plain_text || '';
      return title === data.company;
    });
    
    if (existingClient) {
      console.log(`Found existing client: ${data.company}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clientUrl = (existingClient as any).url || `https://notion.so/${existingClient.id.replace(/-/g, '')}`;
      return { success: true, pageId: existingClient.id, url: clientUrl };
    }
    
    // Create new client
    console.log(`Creating new client: ${data.company}`);
    const response = await notion.pages.create({
      parent: {
        type: 'database_id',
        database_id: clientsDatabaseId,
      },
      properties: {
        'Name': {
          title: [{
            text: { content: data.company },
          }],
        },
        ...(data.website ? {
          'Website': {
            url: data.website,
          },
        } : {}),
        'Type': {
          select: {
            name: 'Prospect',
          },
        },
      },
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clientUrl = (response as any).url || `https://notion.so/${response.id.replace(/-/g, '')}`;
    return { success: true, pageId: response.id, url: clientUrl };
  } catch (error) {
    console.error('Failed to create/find client:', error);
    return { success: false, error };
  }
}

// Helper to create contact
async function createContact(notion: Client, data: ElevenlabsContactData, clientPageId?: string) {
  try {
    const contactsDatabaseId = '28753ceefab080929025cf188f469668';
    
    console.log(`Creating contact: ${data.fullName}`);
    const response = await notion.pages.create({
      parent: {
        type: 'database_id',
        database_id: contactsDatabaseId,
      },
      properties: {
        'Name': {
          title: [{
            text: { content: data.fullName },
          }],
        },
        'Email Address': {
          email: data.email,
        },
        'Phone Number': {
          phone_number: data.phone,
        },
        ...(clientPageId ? {
          'Company': {
            relation: [{ id: clientPageId }],
          },
        } : {}),
        'Decision Maker': {
          checkbox: true,
        },
      },
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contactUrl = (response as any).url || `https://notion.so/${response.id.replace(/-/g, '')}`;
    return { success: true, pageId: response.id, url: contactUrl };
  } catch (error) {
    console.error('Failed to create contact:', error);
    return { success: false, error };
  }
}

// Main function to save data to Notion
async function saveToNotion(data: ElevenlabsContactData) {
  const notion = initializeNotion();
  
  if (!notion) {
    console.log('Skipping Notion save - not configured');
    return { success: false, reason: 'not_configured' };
  }
  
  try {
    const intakeFormsDatabaseId = '0b2a39da34914320b1d9e621494ba183';
    
    // Step 1: Create or find client
    const clientResult = await createOrFindClient(notion, data);
    const clientPageId = clientResult.success ? clientResult.pageId : undefined;
    
    // Step 2: Create contact (if we have a client)
    let contactResult = { success: false };
    if (clientPageId) {
      contactResult = await createContact(notion, data, clientPageId);
    }
    
    // Step 3: Create intake form
    console.log('Creating intake form submission from ElevenLabs call...');
    
    // Build properties object with only available data
    const properties: Record<string, unknown> = {
      'Submission Name': {
        title: [{
          text: { content: `${data.company} - ${data.fullName} (Phone Call)` },
        }],
      },
      'Full Name': {
        rich_text: [{
          text: { content: data.fullName },
        }],
      },
      'Email': {
        email: data.email,
      },
      'Phone Number': {
        phone_number: data.phone,
      },
      'Company Name': {
        rich_text: [{
          text: { content: data.company },
        }],
      },
      'Submission Date': {
        date: {
          start: new Date().toISOString().split('T')[0],
        },
      },
    };
    
    // Add optional fields only if provided
    if (data.industry) {
      properties['Industry'] = {
        select: { name: formatIndustry(data.industry) }
      };
    }
    
    if (data.businessSize) {
      properties['Total Employees'] = {
        select: { name: `${data.businessSize} employees` }
      };
    }
    
    if (data.monthlyVolume) {
      properties['Monthly Volume'] = {
        select: { name: `${data.monthlyVolume} per month` }
      };
    }
    
    if (data.teamSize) {
      properties['Team Size Affected'] = {
        select: { name: `${data.teamSize} people` }
      };
    }
    
    if (data.currentSystems) {
      properties['Current Systems'] = {
        rich_text: [{ text: { content: data.currentSystems.substring(0, 2000) } }]
      };
    }
    
    if (data.automationGoals && data.automationGoals.length > 0) {
      properties['Automation Goals'] = {
        rich_text: [{ text: { content: data.automationGoals.join(', ').substring(0, 2000) } }]
      };
    }
    
    if (data.specificProcesses) {
      properties['Specific Processes'] = {
        rich_text: [{ text: { content: data.specificProcesses.substring(0, 2000) } }]
      };
    }
    
    if (data.existingTools) {
      properties['Existing Tools'] = {
        rich_text: [{ text: { content: data.existingTools.substring(0, 2000) } }]
      };
    }
    
    if (data.integrationNeeds && data.integrationNeeds.length > 0) {
      properties['Integration Needs'] = {
        rich_text: [{ text: { content: data.integrationNeeds.join(', ').substring(0, 2000) } }]
      };
    }
    
    if (data.dataVolume) {
      const volumeLabel = 
        data.dataVolume === 'minimal' ? 'Minimal (Few per day)' :
        data.dataVolume === 'moderate' ? 'Moderate (10-50 per day)' :
        data.dataVolume === 'large' ? 'Large (50-200 per day)' :
        'Very Large (200+ per day)';
      
      properties['Data Volume'] = {
        select: { name: volumeLabel }
      };
    }
    
    if (data.projectDescription) {
      properties['Project Description'] = {
        rich_text: [{ text: { content: data.projectDescription.substring(0, 2000) } }]
      };
    }
    
    if (data.successMetrics) {
      properties['Success Metrics'] = {
        rich_text: [{ text: { content: data.successMetrics.substring(0, 2000) } }]
      };
    }
    
    if (data.timeline) {
      const timelineLabel = 
        data.timeline === 'immediate' ? 'Immediate (ASAP)' :
        data.timeline === '1-3_months' ? '1-3 months' :
        data.timeline === '3-6_months' ? '3-6 months' :
        '6+ months';
      
      properties['Timeline'] = {
        select: { name: timelineLabel }
      };
    }
    
    if (data.budget) {
      const budgetLabel = 
        data.budget === 'under_10k' ? 'Under $10,000' :
        data.budget === '10k-25k' ? '$10,000 - $25,000' :
        data.budget === '25k-50k' ? '$25,000 - $50,000' :
        data.budget === '50k-100k' ? '$50,000 - $100,000' :
        data.budget === '100k+' ? '$100,000+' :
        'Not sure yet';
      
      properties['Budget Range'] = {
        select: { name: budgetLabel }
      };
    }
    
    if (data.projectIdeas && data.projectIdeas.length > 0) {
      properties['Project Ideas'] = {
        rich_text: [{
          text: {
            content: data.projectIdeas.map(idea => 
              `[${idea.priority.toUpperCase()}] ${idea.title}: ${idea.description}`
            ).join('\n\n').substring(0, 2000)
          }
        }]
      };
    }
    
    if (clientPageId) {
      properties['Related Client'] = {
        relation: [{ id: clientPageId }]
      };
    }
    
    // Add call metadata if provided
    if (data.callTranscript) {
      properties['Call Notes'] = {
        rich_text: [{ text: { content: `Call Transcript:\n\n${data.callTranscript}`.substring(0, 2000) } }]
      };
    }
    
    const response = await notion.pages.create({
      parent: {
        type: 'database_id',
        database_id: intakeFormsDatabaseId,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      properties: properties as any,
    });
    
    console.log('Successfully saved to Notion:', response.id);
    console.log(`Source: ElevenLabs Phone Call, Client=${clientPageId}, Contact=${contactResult.success ? 'created' : 'failed'}`);
    
    return { 
      success: true, 
      pageId: response.id,
      clientPageId,
      contactCreated: contactResult.success
    };
  } catch (error) {
    console.error('Failed to save to Notion:', error);
    return { success: false, error };
  }
}

// Helper function to send confirmation email
async function sendConfirmationEmail(data: ElevenlabsContactData) {
  const postmarkToken = process.env.POSTMARK_API_TOKEN;
  
  if (!postmarkToken) {
    console.warn('Postmark API token not configured - skipping confirmation email');
    return { success: false, reason: 'not_configured' };
  }
  
  try {
    const client = new postmark.ServerClient(postmarkToken);
    const emailTemplate = getCallConfirmationEmail(data);
    
    await client.sendEmail(emailTemplate);
    
    console.log(`Confirmation email sent to ${data.email}`);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return { success: false, error };
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Optional authentication (only if ELEVENLABS_API_KEY is set)
    const expectedKey = process.env.ELEVENLABS_API_KEY;
    if (expectedKey) {
      const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');
      if (apiKey !== expectedKey) {
        logger.warn('Invalid API key for ElevenLabs endpoint');
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }
    
    // 2. Rate limiting
    const identifier = getRequestIdentifier(request);
    const rateLimit = await checkRateLimit(contactFormLimiter, identifier);
    
    if (!rateLimit.success) {
      logger.warn('Rate limit exceeded', { endpoint: '/api/elevenlabs/contact' });
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429, headers: rateLimit.headers }
      );
    }
    
    // 3. Parse and validate
    const body = await request.json();
    const validatedData = elevenlabsContactSchema.parse(body);
    
    // 4. Sanitize inputs
    const sanitizedData = sanitizeObject(validatedData);
    
    // 5. Save to Notion (non-blocking)
    saveToNotion(sanitizedData).catch((error) => {
      logger.error('Notion save failed', { error });
    });
    
    // 6. Send confirmation email (non-blocking)
    sendConfirmationEmail(sanitizedData).catch((error) => {
      logger.warn('Email sending failed', { error });
    });
    
    // 7. Send to webhook
    const webhookUrl = process.env.N8N_ELEVENLABS_WEBHOOK_URL;
    
    if (webhookUrl && webhookUrl.startsWith('https')) {
      const webhookData = {
        ...sanitizedData,
        submittedAt: new Date().toISOString(),
        source: 'elevenlabs_phone_call',
        environment: process.env.NODE_ENV,
      };
      
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
          signal: AbortSignal.timeout(10000),
        });
        
        if (!webhookResponse.ok) {
          logger.warn('Webhook failed', { status: webhookResponse.status });
        }
      } catch (webhookError) {
        logger.error('Webhook request failed', { error: webhookError });
      }
    }
    
    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Contact information saved successfully',
        data: {
          fullName: sanitizedData.fullName,
          email: sanitizedData.email,
          company: sanitizedData.company,
        }
      },
      {
        headers: rateLimit.headers,
      }
    );
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          message: 'Required fields: fullName, email, phone, company'
        },
        { status: 400 }
      );
    }
    
    logger.error('ElevenLabs contact submission error', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

