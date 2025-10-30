import type { ContactFormData } from '../types/contact-form';

// Helper function to format industry name for display
const formatIndustry = (industry: string) => {
  return industry.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

/**
 * Instant confirmation email sent immediately upon form submission
 * This is a quick acknowledgment with full enquiry details for their records
 */
export function getInstantConfirmationEmail(data: ContactFormData) {
  const firstName = data.fullName.split(' ')[0];
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #22c55e;">Thanks for reaching out, ${firstName}!</h2>
      
      <p>We've received your inquiry about AI automation for <strong>${data.company}</strong>. We're reviewing your submission and will be in touch shortly.</p>
      
      <p>For your records, here's a copy of the information you submitted:</p>
      
      <h3 style="color: #16a34a; border-bottom: 2px solid #22c55e; padding-bottom: 5px;">Contact Information</h3>
      <ul style="list-style: none; padding-left: 0;">
        <li style="margin-bottom: 8px;"><strong>Name:</strong> ${data.fullName}</li>
        <li style="margin-bottom: 8px;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #22c55e;">${data.email}</a></li>
        <li style="margin-bottom: 8px;"><strong>Phone:</strong> <a href="tel:${data.phone}" style="color: #22c55e;">${data.phone}</a></li>
        <li style="margin-bottom: 8px;"><strong>Company:</strong> ${data.company}</li>
        ${data.website ? `<li style="margin-bottom: 8px;"><strong>Website:</strong> <a href="${data.website}" style="color: #22c55e;">${data.website}</a></li>` : ''}
        ${data.socialLinks && data.socialLinks.length > 0 ? `
        <li style="margin-bottom: 8px;"><strong>Social Links:</strong>
          <ul style="margin-top: 5px; padding-left: 20px;">
            ${data.socialLinks.map(link => `<li><a href="${link.url}" style="color: #22c55e;">${link.url}</a></li>`).join('')}
          </ul>
        </li>
        ` : ''}
      </ul>
      
      <h3 style="color: #16a34a; border-bottom: 2px solid #22c55e; padding-bottom: 5px;">Business Details</h3>
      <ul style="list-style: none; padding-left: 0;">
        <li style="margin-bottom: 8px;"><strong>Industry:</strong> ${formatIndustry(data.industry)}</li>
        <li style="margin-bottom: 8px;"><strong>Business Size:</strong> ${data.businessSize} employees</li>
        <li style="margin-bottom: 8px;"><strong>Monthly Volume:</strong> ${data.monthlyVolume} transactions/jobs</li>
        <li style="margin-bottom: 8px;"><strong>Team Size:</strong> ${data.teamSize} people will use the solution</li>
      </ul>
      
      <h3 style="color: #16a34a; border-bottom: 2px solid #22c55e; padding-bottom: 5px;">Current State Assessment</h3>
      <p><strong>Current Systems:</strong></p>
      <p style="margin-left: 20px;">${data.currentSystems}</p>
      
      <h3 style="color: #16a34a; border-bottom: 2px solid #22c55e; padding-bottom: 5px;">Project Scope</h3>
      <ul style="list-style: none; padding-left: 0;">
        <li style="margin-bottom: 8px;"><strong>Timeline:</strong> ${data.timeline.replace(/_/g, '-')}</li>
        <li style="margin-bottom: 8px;"><strong>Budget Range:</strong> ${data.budget.replace(/_/g, '-')}</li>
      </ul>
      
      <p><strong>Project Description:</strong></p>
      <p style="margin-left: 20px;">${data.projectDescription}</p>
      
      <p><strong>Success Metrics:</strong></p>
      <p style="margin-left: 20px;">${data.successMetrics}</p>
      
      <h3 style="color: #16a34a; border-bottom: 2px solid #22c55e; padding-bottom: 5px;">Automation Goals</h3>
      <ul style="padding-left: 20px;">
        ${data.automationGoals.map(goal => `<li>${goal.replace(/_/g, ' ')}</li>`).join('')}
      </ul>
      
      <p><strong>Specific Processes to Automate:</strong></p>
      <p style="margin-left: 20px;">${data.specificProcesses}</p>
      
      ${data.projectIdeas && data.projectIdeas.length > 0 ? `
        <h3 style="color: #16a34a; border-bottom: 2px solid #22c55e; padding-bottom: 5px;">Project Ideas</h3>
        ${data.projectIdeas.map(idea => `
          <div style="margin-bottom: 15px; padding: 10px; border-left: 4px solid ${idea.priority === 'high' ? '#dc2626' : idea.priority === 'medium' ? '#f59e0b' : '#16a34a'};">
            <strong>${idea.title}</strong> (Priority: ${idea.priority.charAt(0).toUpperCase() + idea.priority.slice(1)})
            <p style="margin: 5px 0 0 0;">${idea.description}</p>
          </div>
        `).join('')}
      ` : ''}
      
      <h3 style="color: #16a34a; border-bottom: 2px solid #22c55e; padding-bottom: 5px;">Integration Requirements</h3>
      <p><strong>Existing Tools:</strong> ${data.existingTools}</p>
      <p><strong>Integration Needs:</strong> ${data.integrationNeeds.length > 0 ? data.integrationNeeds.join(', ') : 'None specified'}</p>
      <p><strong>Data Volume:</strong> ${data.dataVolume.charAt(0).toUpperCase() + data.dataVolume.slice(1)}</p>
      
      <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 30px 0 20px 0;">
        <h4 style="margin-top: 0;">Want to move faster?</h4>
        <p style="margin-bottom: 10px;">Don't wait for us to reach out - you can:</p>
        <ul style="margin: 10px 0;">
          <li><a href="https://agentico.com.au/booking" style="color: #22c55e; text-decoration: none;"><strong>Book a discovery call directly</strong></a></li>
          <li>Call us now: <a href="tel:0468068882" style="color: #22c55e; text-decoration: none;">0468 068 882</a></li>
          <li>Reply to this email with questions</li>
        </ul>
      </div>
      
      <p>We're excited to explore how AI automation can help ${data.company} achieve your goals!</p>
      
      <p style="margin-top: 30px; margin-bottom: 5px;">Regards,</p>
      <p style="margin: 0;"><strong>Alex</strong><br>
      AI Consultant<br>
      <strong>M:</strong> <a href="tel:0468068882" style="color: #22c55e; text-decoration: none;">0468 068 882</a><br>
      <strong>W:</strong> <a href="https://agentico.com.au" style="color: #22c55e; text-decoration: none;">agentico.com.au</a><br>
      <strong>A:</strong> 253-255 David Low Way, Peregian Beach QLD 4573</p>
      
      <div style="margin: 30px 0;">
        <img src="https://agentico.com.au/images/logo-black.png" alt="Agentico" style="max-width: 150px; height: auto;" />
        <p style="margin: 10px 0 0 0; color: #22c55e; font-weight: bold; font-size: 12px; letter-spacing: 0.5px;">AI CONSULTING, ENGINEERING & SOLUTIONS</p>
      </div>
      
      <div style="margin: 20px 0;">
        <a href="https://agentico.com.au/booking" style="display: inline-block; padding: 10px 20px; background: #22c55e; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Book a Discovery Call</a>
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px;">
        This is an automated confirmation email from agentico.com.au. 
        If you didn't submit this form, please let us know by replying to this email.
      </p>
    </div>
  `;

  const textBody = `
Thanks for reaching out, ${firstName}!

We've received your inquiry about AI automation for ${data.company}. We're reviewing your submission and will be in touch shortly.

For your records, here's a copy of the information you submitted:

CONTACT INFORMATION
============================================
Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Company: ${data.company}
${data.website ? `Website: ${data.website}` : ''}
${data.socialLinks && data.socialLinks.length > 0 ? `Social Links:\n${data.socialLinks.map(link => `- ${link.url}`).join('\n')}` : ''}

BUSINESS DETAILS
============================================
Industry: ${formatIndustry(data.industry)}
Business Size: ${data.businessSize} employees
Monthly Volume: ${data.monthlyVolume} transactions/jobs
Team Size: ${data.teamSize} people will use the solution

CURRENT STATE ASSESSMENT
============================================
Current Systems:
${data.currentSystems}

PROJECT SCOPE
============================================
Timeline: ${data.timeline.replace(/_/g, '-')}
Budget Range: ${data.budget.replace(/_/g, '-')}

Project Description:
${data.projectDescription}

Success Metrics:
${data.successMetrics}

AUTOMATION GOALS
============================================
${data.automationGoals.map(goal => `- ${goal.replace(/_/g, ' ')}`).join('\n')}

Specific Processes to Automate:
${data.specificProcesses}

${data.projectIdeas && data.projectIdeas.length > 0 ? `
PROJECT IDEAS
============================================
${data.projectIdeas.map(idea => `[${idea.priority.toUpperCase()}] ${idea.title}\n${idea.description}`).join('\n\n')}
` : ''}

INTEGRATION REQUIREMENTS
============================================
Existing Tools: ${data.existingTools}
Integration Needs: ${data.integrationNeeds.length > 0 ? data.integrationNeeds.join(', ') : 'None specified'}
Data Volume: ${data.dataVolume.charAt(0).toUpperCase() + data.dataVolume.slice(1)}

WANT TO MOVE FASTER?
============================================
- Book a discovery call: https://agentico.com.au/booking
- Call us now: 0468 068 882
- Reply to this email with questions

We're excited to explore how AI automation can help ${data.company} achieve your goals!

Regards,
Alex
AI Consultant
M: 0468 068 882
W: agentico.com.au
A: 253-255 David Low Way, Peregian Beach QLD 4573

AGENTICO
AI CONSULTING, ENGINEERING & SOLUTIONS
  `;

  return {
    From: 'Alex from Agentico <alex@agentico.com.au>',
    To: data.email,
    Cc: 'rob@agentico.com.au',
    Subject: 'Agentico form confirmation',
    HtmlBody: htmlBody,
    TextBody: textBody,
    MessageStream: 'outbound',
  };
}

