// Email template for confirming phone call and providing information

export type CallConfirmationData = {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  // Optional fields from the call
  industry?: string;
  projectDescription?: string;
  timeline?: string;
  budget?: string;
};

// Helper function to format industry name for display
const formatIndustry = (industry: string) => {
  return industry.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export function getCallConfirmationEmail(data: CallConfirmationData) {
  const firstName = data.fullName.split(' ')[0];
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <!-- Header with Logo -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">Agentico</h1>
        <p style="color: #64748b; margin: 5px 0;">AI Automation for Australian Businesses</p>
      </div>

      <h2 style="color: #1e293b;">Thanks for the chat, ${firstName}!</h2>
      
      <p style="color: #334155; line-height: 1.6;">
        It was great speaking with you about ${data.company} and how AI automation could help your business. 
        This email confirms we've received your information and outlines what happens next.
      </p>
      
      <div style="background: #f0f9ff; padding: 20px; border-left: 4px solid #2563eb; margin: 25px 0; border-radius: 4px;">
        <h3 style="margin-top: 0; color: #1e293b;">What We Discussed</h3>
        <p style="margin: 5px 0;"><strong>Company:</strong> ${data.company}</p>
        ${data.industry ? `<p style="margin: 5px 0;"><strong>Industry:</strong> ${formatIndustry(data.industry)}</p>` : ''}
        ${data.projectDescription ? `<p style="margin: 5px 0;"><strong>Your Goal:</strong> ${data.projectDescription}</p>` : ''}
        ${data.timeline ? `<p style="margin: 5px 0;"><strong>Timeline:</strong> ${data.timeline.replace('_', '-')}</p>` : ''}
        ${data.budget ? `<p style="margin: 5px 0;"><strong>Budget Range:</strong> ${data.budget.replace('_', '-')}</p>` : ''}
      </div>
      
      <h3 style="color: #1e293b;">Next Steps</h3>
      <ol style="color: #334155; line-height: 1.8;">
        <li><strong>We'll review your information</strong> and do some research on your industry</li>
        <li><strong>You'll hear from us within 1-2 business days</strong> with our initial thoughts</li>
        <li><strong>If it's a good fit,</strong> we'll discuss booking a workshop to dive deeper</li>
      </ol>
      
      <div style="background: #fef3c7; padding: 20px; border-left: 4px solid #f59e0b; margin: 25px 0; border-radius: 4px;">
        <h4 style="margin-top: 0; color: #92400e;">Ready to Book a Workshop?</h4>
        <p style="color: #78350f; margin: 10px 0;">
          If you'd like to skip the wait and book a discovery workshop directly, you can do that now. 
          The workshop is $399 and typically lasts 1-2 hours where we map out exactly how AI can help your business.
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://agentico.com.au/booking" 
             style="display: inline-block; background: #2563eb; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 6px; font-weight: bold;">
            Book Your Workshop Now
          </a>
        </div>
      </div>
      
      <h3 style="color: #1e293b;">Helpful Resources</h3>
      <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <ul style="color: #334155; line-height: 1.8; padding-left: 20px;">
          <li>
            <strong>Our Website:</strong> 
            <a href="https://agentico.com.au" style="color: #2563eb; text-decoration: none;">agentico.com.au</a>
          </li>
          <li>
            <strong>Case Studies:</strong> 
            <a href="https://agentico.com.au/#how-it-works" style="color: #2563eb; text-decoration: none;">See how we've helped businesses like yours</a>
          </li>
          <li>
            <strong>FAQ:</strong> 
            <a href="https://agentico.com.au/#faq" style="color: #2563eb; text-decoration: none;">Common questions answered</a>
          </li>
          <li>
            <strong>Email Us:</strong> 
            <a href="mailto:hello@agentico.com.au" style="color: #2563eb; text-decoration: none;">hello@agentico.com.au</a>
          </li>
          <li>
            <strong>Call Us:</strong> 
            <a href="tel:+61437034998" style="color: #2563eb; text-decoration: none;">0437 034 998</a>
          </li>
        </ul>
      </div>
      
      <div style="background: #f1f5f9; padding: 20px; border-radius: 6px; margin: 30px 0;">
        <h4 style="margin-top: 0; color: #1e293b;">What Makes Agentico Different?</h4>
        <p style="color: #475569; line-height: 1.6; margin: 10px 0;">
          🎯 <strong>No Jargon:</strong> We speak your language, not tech-speak<br>
          🔧 <strong>Practical Solutions:</strong> We focus on solving real business problems, not selling you AI for the sake of it<br>
          🇦🇺 <strong>Local Support:</strong> Australian-based team who understands local business<br>
          ⚡ <strong>Quick Wins:</strong> We find immediate improvements while building long-term solutions<br>
          💰 <strong>Clear Pricing:</strong> No surprises, no hidden costs
        </p>
      </div>
      
      <p style="color: #334155; line-height: 1.6;">
        Looking forward to helping you get your time back!
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
        You're receiving this email because you called Agentico and spoke with our AI receptionist, Alex. 
        We've saved your information to follow up on your inquiry about AI automation for ${data.company}.
      </p>
    </div>
  `;

  const textBody = `
Thanks for the chat, ${firstName}!

It was great speaking with you about ${data.company} and how AI automation could help your business. 
This email confirms we've received your information and outlines what happens next.

WHAT WE DISCUSSED
-----------------
Company: ${data.company}
${data.industry ? `Industry: ${formatIndustry(data.industry)}` : ''}
${data.projectDescription ? `Your Goal: ${data.projectDescription}` : ''}
${data.timeline ? `Timeline: ${data.timeline}` : ''}
${data.budget ? `Budget Range: ${data.budget}` : ''}

NEXT STEPS
----------
1. We'll review your information and do some research on your industry
2. You'll hear from us within 1-2 business days with our initial thoughts
3. If it's a good fit, we'll discuss booking a workshop to dive deeper

READY TO BOOK A WORKSHOP?
--------------------------
If you'd like to skip the wait and book a discovery workshop directly, visit:
https://agentico.com.au/booking

The workshop is $399 and typically lasts 1-2 hours where we map out exactly how AI can help your business.

HELPFUL RESOURCES
-----------------
• Our Website: https://agentico.com.au
• Case Studies: https://agentico.com.au/#how-it-works
• FAQ: https://agentico.com.au/#faq
• Email: hello@agentico.com.au
• Phone: 0437 034 998

WHAT MAKES AGENTICO DIFFERENT?
-------------------------------
🎯 No Jargon: We speak your language, not tech-speak
🔧 Practical Solutions: We focus on solving real business problems
🇦🇺 Local Support: Australian-based team who understands local business
⚡ Quick Wins: We find immediate improvements while building long-term solutions
💰 Clear Pricing: No surprises, no hidden costs

Looking forward to helping you get your time back!

The Agentico Team
hello@agentico.com.au
0437 034 998
agentico.com.au
  `;

  return {
    From: 'noreply@agentico.com.au',
    To: data.email,
    Subject: `Great chatting with you, ${firstName}! Here's what's next - Agentico`,
    HtmlBody: htmlBody,
    TextBody: textBody,
    MessageStream: 'outbound',
  };
}

