import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Client } from '@notionhq/client';

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

// Initialize Notion client with latest API version
const initializeNotion = () => {
  const notionToken = process.env.NOTION_API_TOKEN;
  
  if (!notionToken) {
    console.warn('Notion API token not configured');
    return null;
  }
  
  return new Client({ 
    auth: notionToken,
    notionVersion: '2025-09-03', // Use latest API version
  });
};

// Helper function to find the contact form database
async function findContactDatabase(client: Client) {
  try {
    // Search for databases the integration has access to
    const response = await client.search({
      filter: {
        property: 'object',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: 'database' as any,
      },
      page_size: 100,
    });
    
    // Look for a database with "Contact" or "Form" or "Submission" in the title
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const databases = response.results.filter((result: any) => {
      if (result.object !== 'database') return false;
      
      const title = result.title?.[0]?.plain_text || '';
      const lowerTitle = title.toLowerCase();
      
      return lowerTitle.includes('contact') || 
             lowerTitle.includes('form') || 
             lowerTitle.includes('submission') ||
             lowerTitle.includes('lead');
    });
    
    if (databases.length === 0) {
      console.error('No suitable database found. Please create a database with "Contact", "Form", "Submission", or "Lead" in the title.');
      return null;
    }
    
    // If multiple found, use the first one and log a message
    if (databases.length > 1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const titles = databases.map((db: any) => db.title?.[0]?.plain_text || 'Untitled').join(', ');
      console.log(`Multiple contact databases found (${titles}). Using the first one.`);
    }
    
    return databases[0];
  } catch (error) {
    console.error('Error searching for database:', error);
    return null;
  }
}

// Helper function to save data to Notion
async function saveToNotion(data: ContactFormData) {
  const client = initializeNotion();
  
  if (!client) {
    console.log('Skipping Notion save - not configured');
    return { success: false, reason: 'not_configured' };
  }
  
  try {
    // Step 1: Find the contact form database automatically
    const database = await findContactDatabase(client);
    
    if (!database) {
      console.error('Could not find contact form database');
      return { success: false, error: 'no_database_found' };
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const databaseId = (database as any).id;
    
    // Step 2: Get the database to retrieve data source ID (new in API 2025-09-03)
    const fullDatabase = await client.databases.retrieve({ database_id: databaseId });
    
    // Type assertion for data_sources (new in API 2025-09-03)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataSources = (fullDatabase as any).data_sources || [];
    
    if (dataSources.length === 0) {
      console.error('No data sources found for database');
      return { success: false, error: 'no_data_sources' };
    }
    
    // Use the first data source (for single-source databases)
    const dataSourceId = dataSources[0].id;
    
    // Get database title for logging
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbTitle = (database as any).title?.[0]?.plain_text || 'Untitled';
    console.log(`Using database: "${dbTitle}" (ID: ${databaseId}, Data Source: ${dataSourceId})`);
    
    // Format industry name for display
    const formatIndustry = (industry: string) => {
      return industry.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    };
    
    // Step 2: Create the page in Notion using data_source_id (new in API 2025-09-03)
    const response = await client.pages.create({
      parent: { 
        type: 'data_source_id',
        data_source_id: dataSourceId 
      },
      properties: {
        'Submission Name': {
          title: [
            {
              text: {
                content: `${data.company} - ${data.fullName}`,
              },
            },
          ],
        },
        'Full Name': {
          rich_text: [
            {
              text: {
                content: data.fullName,
              },
            },
          ],
        },
        'Email': {
          email: data.email,
        },
        'Phone Number': {
          phone_number: data.phone,
        },
        'Company Name': {
          rich_text: [
            {
              text: {
                content: data.company,
              },
            },
          ],
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
          rich_text: [
            {
              text: {
                content: data.currentSystems,
              },
            },
          ],
        },
        'Automation Goals': {
          rich_text: [
            {
              text: {
                content: data.automationGoals.join(', '),
              },
            },
          ],
        },
        'Specific Processes': {
          rich_text: [
            {
              text: {
                content: data.specificProcesses,
              },
            },
          ],
        },
        'Existing Tools': {
          rich_text: [
            {
              text: {
                content: data.existingTools,
              },
            },
          ],
        },
        'Integration Needs': {
          rich_text: [
            {
              text: {
                content: data.integrationNeeds.join(', ') || 'None specified',
              },
            },
          ],
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
          rich_text: [
            {
              text: {
                content: data.projectDescription,
              },
            },
          ],
        },
        'Success Metrics': {
          rich_text: [
            {
              text: {
                content: data.successMetrics,
              },
            },
          ],
        },
        'Timeline': {
          select: {
            name: data.timeline === 'immediate' ? 'Immediate (ASAP)' :
                  data.timeline === '1-3_months' ? '1-3 months' :
                  data.timeline === '3-6_months' ? '3-6 months' :
                  '6+ months',
          },
        },
        'Budget Range': {
          select: {
            name: data.budget === 'under_10k' ? 'Under $10,000' :
                  data.budget === '10k-25k' ? '$10,000 - $25,000' :
                  data.budget === '25k-50k' ? '$25,000 - $50,000' :
                  data.budget === '50k-100k' ? '$50,000 - $100,000' :
                  data.budget === '100k+' ? '$100,000+' :
                  'Not sure yet',
          },
        },
        'Project Ideas': {
          rich_text: [
            {
              text: {
                content: data.projectIdeas && data.projectIdeas.length > 0
                  ? data.projectIdeas.map(idea => 
                      `[${idea.priority.toUpperCase()}] ${idea.title}: ${idea.description}`
                    ).join('\n\n')
                  : 'No specific project ideas provided',
              },
            },
          ],
        },
        'Submission Status': {
          status: {
            name: 'New',
          },
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      children: [
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{
              type: 'text',
              text: { content: 'Contact Information' },
            }],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { content: `Email: ${data.email}\nPhone: ${data.phone}\nCompany: ${data.company}${data.website ? `\nWebsite: ${data.website}` : ''}` },
            }],
          },
        },
        ...(data.socialLinks && data.socialLinks.length > 0 ? [
          {
            object: 'block' as const,
            type: 'heading_3' as const,
            heading_3: {
              rich_text: [{
                type: 'text' as const,
                text: { content: 'Social Links' },
              }],
            },
          },
          {
            object: 'block' as const,
            type: 'bulleted_list_item' as const,
            bulleted_list_item: {
              rich_text: data.socialLinks.map((link) => ({
                type: 'text' as const,
                text: { 
                  content: link.url,
                  link: { url: link.url },
                },
              })),
            },
          },
        ] : []),
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{
              type: 'text',
              text: { content: 'Current State Assessment' },
            }],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { content: `Current Systems:\n${data.currentSystems}` },
            }],
          },
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{
              type: 'text',
              text: { content: 'Automation Goals' },
            }],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { content: `Goals: ${data.automationGoals.join(', ')}` },
            }],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { content: `Specific Processes:\n${data.specificProcesses}` },
            }],
          },
        },
        ...(data.projectIdeas && data.projectIdeas.length > 0 ? [
          {
            object: 'block' as const,
            type: 'heading_3' as const,
            heading_3: {
              rich_text: [{
                type: 'text' as const,
                text: { content: 'Project Ideas' },
              }],
            },
          },
          ...data.projectIdeas.flatMap((idea) => [
            {
              object: 'block' as const,
              type: 'callout' as const,
              callout: {
                rich_text: [{
                  type: 'text' as const,
                  text: { content: `${idea.title} (${idea.priority.toUpperCase()})\n${idea.description}` },
                }],
                icon: { emoji: idea.priority === 'high' ? '🔴' : idea.priority === 'medium' ? '🟡' : '🟢' },
              },
            },
          ]),
        ] : []),
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{
              type: 'text',
              text: { content: 'Integration Requirements' },
            }],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { content: `Existing Tools:\n${data.existingTools}` },
            }],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { content: `Integration Needs: ${data.integrationNeeds.join(', ') || 'None specified'}` },
            }],
          },
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{
              type: 'text',
              text: { content: 'Project Scope' },
            }],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { content: `Project Description:\n${data.projectDescription}` },
            }],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { content: `Success Metrics:\n${data.successMetrics}` },
            }],
          },
        },
      ],
    });
    
    console.log('Successfully saved to Notion:', response.id);
    return { success: true, pageId: response.id };
  } catch (error) {
    console.error('Failed to save to Notion:', error);
    return { success: false, error };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the form data
    const validatedData = contactFormSchema.parse(body);
    
    // Save to Notion (non-blocking)
    saveToNotion(validatedData).catch((error) => {
      console.error('Notion save failed:', error);
    });
    
    // Get webhook URLs from environment variables
    const testWebhookUrl = process.env.N8N_TEST_WEBHOOK_URL;
    const prodWebhookUrl = process.env.N8N_PROD_WEBHOOK_URL;
    
    // Determine which environment we're in
    const isProduction = process.env.NODE_ENV === 'production';
    const webhookUrl = isProduction ? prodWebhookUrl : testWebhookUrl;
    
    // Check if webhook URL is configured and not a placeholder
    const isValidWebhookUrl = (url: string | undefined): boolean => {
      return !!(url && 
        !url.includes('your-n8n-instance.com') && 
        !url.includes('placeholder') &&
        url.startsWith('http'));
    };
    
    // Prepare data for webhook(s)
    const webhookData = {
      ...validatedData,
      submittedAt: new Date().toISOString(),
      source: 'agentico_website',
      environment: isProduction ? 'production' : 'development',
      // Add any additional metadata you want to send
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
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
        
        if (!webhookResponse.ok) {
          console.error(`Failed to send data to ${label} webhook:`, webhookResponse.status, webhookResponse.statusText);
          return false;
        } else {
          console.log(`Successfully sent data to ${label} webhook`);
          return true;
        }
      } catch (webhookError) {
        console.error(`${label} webhook request failed:`, webhookError);
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
      console.log('Sending to both test and production webhooks...');
      await Promise.all([
        sendToWebhook(testWebhookUrl!, 'test'),
        sendToWebhook(prodWebhookUrl!, 'production')
      ]);
    }
    
    // Log to console if no valid webhooks configured
    if (!isValidWebhookUrl(testWebhookUrl) && !isValidWebhookUrl(prodWebhookUrl)) {
      console.log('No valid webhooks configured. Form data received:', webhookData);
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
          details: error.issues 
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
