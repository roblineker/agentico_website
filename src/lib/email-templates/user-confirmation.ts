import type { ContactFormData } from '../types/contact-form';

// Helper function to format industry name for display
const formatIndustry = (industry: string) => {
  return industry.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export function getUserConfirmationEmail(data: ContactFormData) {
  const firstName = data.fullName.split(' ')[0];
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Thank you for reaching out, ${firstName}!</h2>
      
      <p>We've received your inquiry about AI automation for ${data.company}. Our team is excited to learn about your business and explore how we can help.</p>
      
      <h3>What happens next?</h3>
      <ol>
        <li><strong>Review (1-2 business days):</strong> We'll carefully review your submission and research your industry</li>
        <li><strong>Discovery Call:</strong> We'll reach out to schedule a no-pressure conversation</li>
        <li><strong>Assessment:</strong> We'll provide a preliminary assessment and discuss whether AI automation is a good fit</li>
      </ol>
      
      <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
        <h4 style="margin-top: 0;">Your Submission Summary</h4>
        <p><strong>Company:</strong> ${data.company}</p>
        <p><strong>Industry:</strong> ${formatIndustry(data.industry)}</p>
        <p><strong>Timeline:</strong> ${data.timeline.replace('_', '-')}</p>
        <p><strong>Budget Range:</strong> ${data.budget.replace('_', '-')}</p>
      </div>
      
      <p>In the meantime, feel free to:</p>
      <ul>
        <li>📅 <a href="https://agentico.com.au/booking">Book a discovery call directly</a></li>
        <li>🌐 Visit our website at <a href="https://agentico.com.au">agentico.com.au</a></li>
        <li>📧 Reply to this email with any questions</li>
        <li>📱 Call us on 0437 034 998</li>
      </ul>
      
      <p>Looking forward to speaking with you soon!</p>
      
      <p style="margin-top: 30px;">
        <strong>The Agentico Team</strong><br>
        <a href="mailto:hello@agentico.com.au">hello@agentico.com.au</a><br>
        <a href="https://agentico.com.au">agentico.com.au</a>
      </p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px;">
        You're receiving this email because you submitted a contact form at agentico.com.au.
        If you didn't submit this form, please let us know by replying to this email.
      </p>
    </div>
  `;

  const textBody = `
Thank you for reaching out, ${firstName}!

We've received your inquiry about AI automation for ${data.company}. Our team is excited to learn about your business and explore how we can help.

WHAT HAPPENS NEXT?

1. Review (1-2 business days): We'll carefully review your submission and research your industry
2. Discovery Call: We'll reach out to schedule a no-pressure conversation
3. Assessment: We'll provide a preliminary assessment and discuss whether AI automation is a good fit

YOUR SUBMISSION SUMMARY

Company: ${data.company}
Industry: ${formatIndustry(data.industry)}
Timeline: ${data.timeline}
Budget Range: ${data.budget}

IN THE MEANTIME

- Book a discovery call: https://agentico.com.au/booking
- Visit our website: https://agentico.com.au
- Email us: hello@agentico.com.au
- Call us: 0437 034 998

Looking forward to speaking with you soon!

The Agentico Team
hello@agentico.com.au
agentico.com.au
  `;

  return {
    From: 'noreply@agentico.com.au',
    To: data.email,
    Subject: 'Thank you for contacting Agentico - Next Steps',
    HtmlBody: htmlBody,
    TextBody: textBody,
    MessageStream: 'outbound',
  };
}

