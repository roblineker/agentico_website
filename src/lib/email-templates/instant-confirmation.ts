import type { ContactFormData } from '../types/contact-form';

// Helper function to format industry name for display
const formatIndustry = (industry: string) => {
  return industry.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

/**
 * Instant confirmation email sent immediately upon form submission
 * This is a quick acknowledgment while we process their information
 */
export function getInstantConfirmationEmail(data: ContactFormData) {
  const firstName = data.fullName.split(' ')[0];
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Thanks for reaching out, ${firstName}! 🎉</h2>
      
      <p>We've received your inquiry about AI automation for <strong>${data.company}</strong>.</p>
      
      <div style="background: #f0f9ff; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1e40af;">What's happening now?</h3>
        <ol style="margin: 10px 0; padding-left: 20px;">
          <li style="margin-bottom: 10px;">✅ <strong>Received</strong> - Your information has been saved (this email confirms it!)</li>
          <li style="margin-bottom: 10px;">🔍 <strong>Analyzing</strong> - Our AI is analyzing your needs and researching your industry</li>
          <li style="margin-bottom: 10px;">📊 <strong>Preparing</strong> - We're creating custom style guides and insights for your business</li>
          <li style="margin-bottom: 10px;">📧 <strong>Coming Soon</strong> - You'll receive a detailed follow-up email in the next 15-30 minutes</li>
        </ol>
      </div>
      
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #92400e;">📦 Your Free Gift Package</h4>
        <p style="margin-bottom: 0;">As a thank you for your interest, we're preparing customized resources for your business:</p>
        <ul style="margin: 10px 0;">
          <li><strong>Company Style Guide</strong> - Tailored communication guidelines for ${data.company}</li>
          <li><strong>Contact Style Guide</strong> - How to engage with customers in the ${formatIndustry(data.industry)} industry</li>
          <li><strong>Industry Insights</strong> - AI automation opportunities specific to your sector</li>
        </ul>
        <p style="margin-bottom: 0;"><em>These will arrive in your next email shortly!</em></p>
      </div>
      
      <h3 style="color: #1e40af;">Quick Summary of Your Inquiry:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: #f9fafb;">
          <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Company</td>
          <td style="padding: 10px; border: 1px solid #e5e7eb;">${data.company}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Industry</td>
          <td style="padding: 10px; border: 1px solid #e5e7eb;">${formatIndustry(data.industry)}</td>
        </tr>
        <tr style="background: #f9fafb;">
          <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Timeline</td>
          <td style="padding: 10px; border: 1px solid #e5e7eb;">${data.timeline.replace('_', '-')}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Budget Range</td>
          <td style="padding: 10px; border: 1px solid #e5e7eb;">${data.budget.replace('_', '-')}</td>
        </tr>
      </table>
      
      <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-top: 0;">Want to move faster?</h4>
        <p style="margin-bottom: 10px;">Don't wait for us to reach out - you can:</p>
        <ul style="margin: 10px 0;">
          <li>📅 <a href="https://agentico.com.au/booking" style="color: #2563eb; text-decoration: none;"><strong>Book a discovery call directly</strong></a></li>
          <li>📱 Call us now: <a href="tel:0437034998" style="color: #2563eb; text-decoration: none;">0437 034 998</a></li>
          <li>📧 Reply to this email with questions</li>
        </ul>
      </div>
      
      <p>We're excited to explore how AI automation can help ${data.company} achieve your goals!</p>
      
      <p style="margin-top: 30px;">
        <strong>The Agentico Team</strong><br>
        <a href="mailto:hello@agentico.com.au" style="color: #2563eb;">hello@agentico.com.au</a><br>
        <a href="https://agentico.com.au" style="color: #2563eb;">agentico.com.au</a><br>
        0437 034 998
      </p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px;">
        This is an automated confirmation email from agentico.com.au. 
        Your detailed analysis and free resources will arrive shortly in a separate email.
      </p>
    </div>
  `;

  const textBody = `
Thanks for reaching out, ${firstName}! 🎉

We've received your inquiry about AI automation for ${data.company}.

WHAT'S HAPPENING NOW?

1. ✅ Received - Your information has been saved
2. 🔍 Analyzing - Our AI is analyzing your needs and researching your industry
3. 📊 Preparing - We're creating custom style guides and insights for your business
4. 📧 Coming Soon - You'll receive a detailed follow-up email in the next 15-30 minutes

YOUR FREE GIFT PACKAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
As a thank you, we're preparing customized resources:
- Company Style Guide - Tailored for ${data.company}
- Contact Style Guide - For the ${formatIndustry(data.industry)} industry
- Industry Insights - AI automation opportunities specific to your sector

These will arrive in your next email shortly!

QUICK SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Company: ${data.company}
Industry: ${formatIndustry(data.industry)}
Timeline: ${data.timeline}
Budget Range: ${data.budget}

WANT TO MOVE FASTER?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Book a discovery call: https://agentico.com.au/booking
- Call us now: 0437 034 998
- Reply to this email with questions

We're excited to explore how AI automation can help ${data.company}!

The Agentico Team
hello@agentico.com.au
agentico.com.au
0437 034 998
  `;

  return {
    From: 'noreply@agentico.com.au',
    To: data.email,
    Subject: `✓ Received! Analyzing your inquiry now, ${firstName}...`,
    HtmlBody: htmlBody,
    TextBody: textBody,
    MessageStream: 'outbound',
  };
}

