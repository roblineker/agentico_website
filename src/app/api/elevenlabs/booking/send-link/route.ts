import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import * as postmark from 'postmark';

// Schema for sending booking link
const sendLinkSchema = z.object({
  fullName: z.string().min(2, "Please provide a name"),
  email: z.string().email("Please provide a valid email address"),
});

type SendLinkData = z.infer<typeof sendLinkSchema>;

function getBookingLinkEmail(data: SendLinkData) {
  const firstName = data.fullName.split(' ')[0];
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">Agentico</h1>
        <p style="color: #64748b; margin: 5px 0;">Book Your Discovery Workshop</p>
      </div>

      <h2 style="color: #1e293b;">Hi ${firstName},</h2>
      
      <p style="color: #334155; line-height: 1.6;">
        As discussed on the phone, here's your booking link to schedule a discovery workshop with our team.
      </p>
      
      <div style="background: #f0f9ff; padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center;">
        <h3 style="margin-top: 0; color: #1e293b;">Ready to Get Started?</h3>
        <p style="color: #475569; margin: 15px 0;">
          Choose a time that works for you from our available slots.
        </p>
        <a href="https://koalendar.com/e/discovery-call-with-agentico" 
           style="display: inline-block; background: #2563eb; color: white; padding: 15px 40px; 
                  text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin: 20px 0;">
          Book Your Workshop
        </a>
        <p style="color: #64748b; font-size: 14px; margin: 10px 0;">
          Or copy this link: <br>
          <a href="https://koalendar.com/e/discovery-call-with-agentico" style="color: #2563eb; word-break: break-all;">
            https://koalendar.com/e/discovery-call-with-agentico
          </a>
        </p>
      </div>
      
      <div style="background: #fef3c7; padding: 20px; border-left: 4px solid #f59e0b; margin: 25px 0; border-radius: 4px;">
        <h4 style="margin-top: 0; color: #92400e;">Workshop Details</h4>
        <ul style="color: #78350f; line-height: 1.8; margin: 10px 0; padding-left: 20px;">
          <li><strong>Cost:</strong> $399 (one-time workshop fee)</li>
          <li><strong>Duration:</strong> Choose 1, 1.5, or 2 hours based on your needs</li>
          <li><strong>Format:</strong> Video call (Zoom/Teams)</li>
          <li><strong>What we'll cover:</strong> Your business processes, automation opportunities, and quick wins</li>
        </ul>
      </div>
      
      <h3 style="color: #1e293b;">What to Prepare</h3>
      <p style="color: #334155; line-height: 1.6;">
        To make the most of our workshop, have a think about:
      </p>
      <ul style="color: #334155; line-height: 1.8;">
        <li>The 3 most time-consuming tasks in your business</li>
        <li>Current tools and software you use</li>
        <li>Any specific pain points or frustrations</li>
        <li>What success would look like for you</li>
      </ul>
      
      <p style="color: #334155; line-height: 1.6; margin-top: 30px;">
        If you have any questions before the workshop, just reply to this email or give us a call.
      </p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
        <p style="margin: 5px 0; color: #64748b;">
          <strong>The Agentico Team</strong>
        </p>
        <p style="margin: 5px 0;">
          <a href="mailto:hello@agentico.com.au" style="color: #2563eb; text-decoration: none;">hello@agentico.com.au</a>
        </p>
        <p style="margin: 5px 0;">
          <a href="tel:+61437034998" style="color: #2563eb; text-decoration: none;">0437 034 998</a>
        </p>
        <p style="margin: 5px 0;">
          <a href="https://agentico.com.au" style="color: #2563eb; text-decoration: none;">agentico.com.au</a>
        </p>
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
      <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">
        You requested this booking link during your call with Agentico. 
        If you didn't request this, please let us know by replying to this email.
      </p>
    </div>
  `;

  const textBody = `
Hi ${firstName},

As discussed on the phone, here's your booking link to schedule a discovery workshop with our team.

BOOK YOUR WORKSHOP
-------------------
Visit: https://koalendar.com/e/discovery-call-with-agentico

Choose a time that works for you from our available slots.

WORKSHOP DETAILS
----------------
• Cost: $399 (one-time workshop fee)
• Duration: Choose 1, 1.5, or 2 hours based on your needs
• Format: Video call (Zoom/Teams)
• What we'll cover: Your business processes, automation opportunities, and quick wins

WHAT TO PREPARE
----------------
To make the most of our workshop, have a think about:
• The 3 most time-consuming tasks in your business
• Current tools and software you use
• Any specific pain points or frustrations
• What success would look like for you

If you have any questions before the workshop, just reply to this email or give us a call.

The Agentico Team
hello@agentico.com.au
0437 034 998
agentico.com.au
  `;

  return {
    From: 'noreply@agentico.com.au',
    To: data.email,
    Subject: `Your Workshop Booking Link - Agentico`,
    HtmlBody: htmlBody,
    TextBody: textBody,
    MessageStream: 'outbound',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request data
    const validatedData = sendLinkSchema.parse(body);
    
    const postmarkToken = process.env.POSTMARK_API_TOKEN;
    
    if (!postmarkToken) {
      console.error('Postmark API token not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }
    
    const client = new postmark.ServerClient(postmarkToken);
    const emailTemplate = getBookingLinkEmail(validatedData);
    
    await client.sendEmail(emailTemplate);
    
    console.log(`Booking link sent to ${validatedData.email}`);
    
    return NextResponse.json({
      success: true,
      message: 'Booking link sent successfully',
      data: {
        email: validatedData.email,
        bookingUrl: 'https://koalendar.com/e/discovery-call-with-agentico'
      }
    });
    
  } catch (error) {
    console.error('Send booking link error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.issues,
          message: 'Required fields: fullName, email'
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

