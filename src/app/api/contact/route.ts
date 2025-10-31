import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Client } from '@notionhq/client';
import { evaluateAndProcessLead } from '@/lib/lead-evaluation';
import { contactFormLimiter, checkRateLimit, getRequestIdentifier } from '@/lib/security/rate-limit';
import { sanitizeObject } from '@/lib/security/sanitize';
import { logger } from '@/lib/security/logger';

/**
 * Verify hCaptcha token
 */
async function verifyCaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.HCAPTCHA_SECRET_KEY;
  
  if (process.env.NODE_ENV === 'development' && token === 'dev-bypass') {
    return true;
  }
  
  if (!secretKey) {
    logger.warn('CAPTCHA secret key not configured');
    return process.env.NODE_ENV !== 'production';
  }
  
  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `response=${token}&secret=${secretKey}`,
    });
    
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    logger.error('CAPTCHA verification failed', { error });
    return false;
  }
}

// Define the same schema as in the form for validation
const contactFormSchema = z.object({
  // Contact Information
  fullName: z.string().min(2, "Please enter your full name (at least 2 characters)"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  company: z.string().min(2, "Please enter your company name"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  socialLinks: z.array(z.object({
    url: z.string().url("Please enter a valid URL"),
  })).optional(),
  
  // Business Information
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
  ], {
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

// Type definition for reference (exported for potential future use)
type ContactFormData = z.infer<typeof contactFormSchema>;

// Initialize Notion client
const initializeNotion = () => {
  const notionToken = process.env.NOTION_API_TOKEN;
  
  if (!notionToken) {
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

// Calculate follow-up date based on timeline urgency
const calculateFollowUpDate = (timeline: string): string => {
  const today = new Date();
  let daysToAdd = 2; // Default: 2 business days
  
  if (timeline === 'immediate') {
    daysToAdd = 1; // Next business day
  } else if (timeline === '1-3_months') {
    daysToAdd = 2; // 2 business days
  } else if (timeline === '3-6_months') {
    daysToAdd = 5; // 1 week
  } else {
    daysToAdd = 7; // 1 week for longer timelines
  }
  
  const followUpDate = new Date(today);
  followUpDate.setDate(today.getDate() + daysToAdd);
  
  return followUpDate.toISOString().split('T')[0];
};

// Helper to create or find client
async function createOrFindClient(notion: Client, data: ContactFormData) {
  try {
    // Database IDs (actual page IDs, not data source IDs)
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clientUrl = (existingClient as any).url || `https://notion.so/${existingClient.id.replace(/-/g, '')}`;
      return { success: true, pageId: existingClient.id, url: clientUrl };
    }
    
    // Create new client
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
    return { success: false, error };
  }
}

// Helper to create contact
async function createContact(
  notion: Client, 
  data: ContactFormData, 
  clientPageId?: string
): Promise<{ success: boolean; pageId?: string; url?: string; error?: unknown }> {
  try {
    const contactsDatabaseId = '28753ceefab080929025cf188f469668';
    
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
    return { success: false, error };
  }
}

// Main function to save data to Notion
async function saveToNotion(data: ContactFormData) {
  const notion = initializeNotion();
  
  if (!notion) {
    return { success: false, reason: 'not_configured' };
  }
  
  try {
    const intakeFormsDatabaseId = '0b2a39da34914320b1d9e621494ba183';
    
    // Step 1: Create or find client
    const clientResult = await createOrFindClient(notion, data);
    const clientPageId = clientResult.success ? clientResult.pageId : undefined;
    
    // Step 2: Create contact (if we have a client)
    let contactResult: { success: boolean; pageId?: string; url?: string; error?: unknown } = { success: false };
    if (clientPageId) {
      contactResult = await createContact(notion, data, clientPageId);
    }
    
    // Step 3: Create intake form (always, even if client/contact failed)
    
    const response = await notion.pages.create({
      parent: {
        type: 'database_id',
        database_id: intakeFormsDatabaseId,
      },
      properties: {
        'Submission Name': {
          title: [{
            text: { content: `${data.company} - ${data.fullName}` },
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
        'Industry': {
          select: {
            name: formatIndustry(data.industry),
          },
        },
        'Total Employees': {
          select: {
            name: `${data.businessSize} employees`,
          },
        },
        'Monthly Volume': {
          select: {
            name: `${data.monthlyVolume} per month`,
          },
        },
        'Team Size Affected': {
          select: {
            name: `${data.teamSize} people`,
          },
        },
        'Current Systems': {
          rich_text: [{
            text: { content: data.currentSystems.substring(0, 2000) },
          }],
        },
        'Automation Goals': {
          rich_text: [{
            text: { content: data.automationGoals.join(', ').substring(0, 2000) },
          }],
        },
        'Specific Processes': {
          rich_text: [{
            text: { content: data.specificProcesses.substring(0, 2000) },
          }],
        },
        'Existing Tools': {
          rich_text: [{
            text: { content: data.existingTools.substring(0, 2000) },
          }],
        },
        'Integration Needs': {
          rich_text: [{
            text: { content: (data.integrationNeeds.join(', ') || 'None specified').substring(0, 2000) },
          }],
        },
        'Data Volume': {
          select: {
            name: data.dataVolume.charAt(0).toUpperCase() + data.dataVolume.slice(1) + ' (' + (
              data.dataVolume === 'minimal' ? 'Few per day' :
              data.dataVolume === 'moderate' ? '10-50 per day' :
              data.dataVolume === 'large' ? '50-200 per day' :
              '200+ per day'
            ) + ')',
          },
        },
        'Project Description': {
          rich_text: [{
            text: { content: data.projectDescription.substring(0, 2000) },
          }],
        },
        'Success Metrics': {
          rich_text: [{
            text: { content: data.successMetrics.substring(0, 2000) },
          }],
        },
        'Timeline': {
          select: {
            name: data.timeline === 'immediate' ? 'Immediate (ASAP)' :
                  data.timeline === '1-3_months' ? '1-3 months' :
                  data.timeline === '3-6_months' ? '3-6 months' :
                  '6+ months',
          },
        },
        // Budget Range is intentionally omitted - Notion SDK has issues with this select field
        // We'll update it separately after page creation
        'Project Ideas': {
          rich_text: [{
            text: {
              content: data.projectIdeas && data.projectIdeas.length > 0
                ? data.projectIdeas.map(idea => 
                    `[${idea.priority.toUpperCase()}] ${idea.title}: ${idea.description}`
                  ).join('\n\n').substring(0, 2000)
                : 'No specific project ideas provided',
            },
          }],
        },
        ...(clientPageId ? {
          'Related Client': {
            relation: [{ id: clientPageId }],
          },
        } : {}),
        'Submission Date': {
          date: {
            start: new Date().toISOString().split('T')[0],
          },
        },
        'Follow-up Date': {
          date: {
            start: calculateFollowUpDate(data.timeline),
          },
        },
      },
    });
    
    const contactPageId = contactResult.success ? contactResult.pageId : undefined;
    
    // Update Budget Range separately (Notion SDK select field workaround)
    try {
      const budgetMap: Record<string, string> = {
        'under_10k': 'Under $10,000',
        '10k-25k': '$10,000 - $25,000',
        '25k-50k': '$25,000 - $50,000',
        '50k-100k': '$50,000 - $100,000',
        '100k+': '$100,000+',
        'not_sure': 'Not sure yet',
      };
      
      await notion.pages.update({
        page_id: response.id,
        properties: {
          'Budget Range': {
            select: {
              name: budgetMap[data.budget] || 'Not sure yet',
            },
          },
        },
      });
    } catch (budgetError) {
      // Don't fail the whole operation for this
    }
    
    return { 
      success: true, 
      pageId: response.id,
      clientPageId,
      contactPageId,
      contactCreated: contactResult.success
    };
  } catch (error) {
    return { success: false, error };
  }
}

// Note: Email sending is now handled by the evaluateAndProcessLead function

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting check
    const identifier = getRequestIdentifier(request);
    const rateLimit = await checkRateLimit(contactFormLimiter, identifier);
    
    if (!rateLimit.success) {
      logger.warn('Rate limit exceeded', { endpoint: '/api/contact', identifier });
      return NextResponse.json(
        { error: 'Too many submissions. Please try again in an hour.' },
        { status: 429, headers: rateLimit.headers }
      );
    }
    
    // 2. CAPTCHA verification
    const captchaToken = request.headers.get('x-captcha-token');
    const captchaValid = await verifyCaptcha(captchaToken || '');
    
    if (!captchaValid) {
      logger.warn('CAPTCHA verification failed', { endpoint: '/api/contact' });
      return NextResponse.json(
        { error: 'CAPTCHA verification failed. Please try again.' },
        { status: 400 }
      );
    }
    
    // 3. Parse and validate
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);
    
    // 4. Sanitize inputs (prevent XSS)
    const sanitizedData = sanitizeObject(validatedData);
    
    // Save to Notion (contact intake form) and get IDs
    const notionResult = await saveToNotion(validatedData);
    const clientId = notionResult.success ? notionResult.clientPageId : undefined;
    const contactId = notionResult.success ? notionResult.contactPageId : undefined;
    
    // 5. Perform comprehensive lead evaluation and processing (background)
    logger.info('Starting lead evaluation');
    evaluateAndProcessLead(sanitizedData, clientId, contactId).catch((err) => {
      logger.error('Lead evaluation error', { error: err });
    });
    
    // 6. Send to webhooks
    const testWebhookUrl = process.env.N8N_TEST_WEBHOOK_URL;
    const prodWebhookUrl = process.env.N8N_PROD_WEBHOOK_URL;
    const isProduction = process.env.NODE_ENV === 'production';
    const webhookUrl = isProduction ? prodWebhookUrl : testWebhookUrl;
    
    // Validate webhook URL (must be HTTPS in production)
    const isValidWebhookUrl = (url: string | undefined): boolean => {
      if (!url) return false;
      try {
        const parsed = new URL(url);
        if (isProduction && parsed.protocol !== 'https:') return false;
        return !url.includes('placeholder') && !url.includes('example.com');
      } catch {
        return false;
      }
    };
    
    const webhookData = {
      ...sanitizedData,
      submittedAt: new Date().toISOString(),
      source: 'agentico_website',
      environment: isProduction ? 'production' : 'development',
    };
    
    const sendToWebhook = async (url: string, label: string) => {
      try {
        const webhookResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });
        
        return webhookResponse.ok;
      } catch (webhookError) {
        logger.warn('Webhook failed', { label, error: webhookError });
        return false;
      }
    };
    
    // Send to appropriate webhook based on environment
    if (isValidWebhookUrl(webhookUrl)) {
      const label = isProduction ? 'production' : 'test';
      await sendToWebhook(webhookUrl!, label);
    }
    
    // Also send to both webhooks if both are configured (useful for testing)
    const sendToBoth = process.env.N8N_SEND_TO_BOTH === 'true';
    if (sendToBoth && isValidWebhookUrl(testWebhookUrl) && isValidWebhookUrl(prodWebhookUrl) && testWebhookUrl !== prodWebhookUrl) {
      await Promise.all([
        sendToWebhook(testWebhookUrl!, 'test'),
        sendToWebhook(prodWebhookUrl!, 'production')
      ]);
    }
    
    // Return success response with rate limit headers
    return NextResponse.json(
      {
        success: true,
        message: 'Form submitted successfully',
        redirectTo: '/booking'
      },
      {
        headers: rateLimit.headers,
      }
    );
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data. Please check your inputs.' },
        { status: 400 }
      );
    }
    
    logger.error('Contact form error', { error });
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
}
