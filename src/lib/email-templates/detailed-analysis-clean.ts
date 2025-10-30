import type { ContactFormData } from '../types/contact-form';
import type { LeadScore } from '../lead-evaluation/scoring';
import type { WebPresenceScore } from '../lead-evaluation/web-research';
import type { AIResearchResult } from '../lead-evaluation/ai-research';

// Helper function to format industry name for display
const formatIndustry = (industry: string) => {
  return industry.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

interface StyleGuideUrls {
  companyGuideUrl?: string;
  contactGuideUrl?: string;
}

/**
 * Professional detailed analysis email (NO emojis, NO Notion links, NO internal info)
 */
export function getDetailedAnalysisEmail(
  data: ContactFormData,
  leadScore?: LeadScore,
  webPresence?: WebPresenceScore,
  aiResearch?: AIResearchResult,
  styleGuideUrls?: StyleGuideUrls
) {
  const firstName = data.fullName.split(' ')[0];
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; line-height: 1.6;">
      <h1 style="color: #22c55e; border-bottom: 3px solid #22c55e; padding-bottom: 10px;">
        Your Personalized AI Automation Analysis
      </h1>
      
      <p>Hi ${firstName},</p>
      
      <p>Thank you for your patience! We've completed a comprehensive analysis of ${data.company}'s automation needs. Here's what we discovered:</p>
      
      ${webPresence ? `
      <div style="background: #f0f9ff; padding: 20px; border-left: 4px solid #22c55e; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #16a34a;">Digital Presence Analysis</h3>
        <p><strong>Digital Maturity:</strong> ${webPresence.digitalMaturity}</p>
        <p><strong>Establishment Score:</strong> ${webPresence.overallScore}/100</p>
        ${webPresence.hasWebsite && webPresence.websiteAnalysis?.isAccessible ? `
        <p><strong>Website:</strong> Active and accessible</p>
        ` : ''}
        ${webPresence.hasSocialMedia ? `
        <p><strong>Social Media:</strong> ${webPresence.socialAnalysis.filter(s => s.isValid).length} active platform(s)</p>
        ` : ''}
      </div>
      ` : ''}
      
      ${aiResearch ? `
      <div style="background: #fff7ed; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #c2410c;">Top Automation Opportunities</h3>
        <ol style="margin: 10px 0; padding-left: 25px;">
          ${aiResearch.automationOpportunities.slice(0, 5).map(opp => `
            <li style="margin-bottom: 8px;">${opp}</li>
          `).join('')}
        </ol>
      </div>
      
      <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #15803d;">Estimated ROI Potential</h3>
        <p>${aiResearch.estimatedROI}</p>
      </div>
      
      ${aiResearch.potentialChallenges && aiResearch.potentialChallenges.length > 0 ? `
      <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #991b1b;">Things to Consider</h3>
        <ul style="margin: 10px 0; padding-left: 25px;">
          ${aiResearch.potentialChallenges.map(challenge => `
            <li style="margin-bottom: 8px;">${challenge}</li>
          `).join('')}
        </ul>
      </div>
      ` : ''}
      ` : ''}
      
      ${styleGuideUrls?.companyGuideUrl || styleGuideUrls?.contactGuideUrl ? `
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 25px; border-radius: 12px; margin: 30px 0;">
        <h2 style="margin-top: 0; color: white;">Your Complimentary Style Guides</h2>
        <p><strong>Attached to this email are two professional PDF documents we've created specifically for ${data.company}:</strong></p>
        <div style="margin: 20px 0;">
          <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h4 style="margin: 0 0 10px 0; color: white;">Company Style Guide</h4>
            <p style="margin-bottom: 0;">Voice, tone, and communication guidelines tailored for ${data.company}. This document can help ensure consistent brand messaging across your communications.</p>
          </div>
          <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: white;">Contact Style Guide</h4>
            <p style="margin-bottom: 0;">Best practices for engaging with customers in the ${formatIndustry(data.industry)} industry. Use this to train your team or refine your customer communications.</p>
          </div>
        </div>
        <p style="margin-bottom: 0; font-size: 14px; opacity: 0.9;">
          <em>These guides are yours to keep and use, regardless of whether we work together. We hope you find them valuable!</em>
        </p>
      </div>
      ` : ''}
      
      <div style="background: #1e293b; color: white; padding: 30px; border-radius: 12px; margin: 30px 0;">
        <h2 style="margin-top: 0; color: white;">Ready to Take the Next Step?</h2>
        <p>Based on our analysis, we believe we can help ${data.company} achieve significant results. Here's how to move forward:</p>
        
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: white;">Option 1: Book a Discovery Call</h3>
          <p>Let's dive deeper into your specific needs and create a custom automation roadmap.</p>
          <a href="https://agentico.com.au/booking" style="display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
            Schedule Your Discovery Call
          </a>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: white;">Option 2: Quick Chat</h3>
          <p>Prefer to talk right away? Give us a call:</p>
          <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">
            <a href="tel:0468068882" style="color: white; text-decoration: none;">0468 068 882</a>
          </p>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: white;">Option 3: Email Discussion</h3>
          <p>Have questions? Just reply to this email and we'll get back to you within a few hours.</p>
        </div>
      </div>
      
      <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
        <p>We're genuinely excited about the potential here, ${firstName}. Looking forward to discussing how we can help ${data.company} achieve your automation goals.</p>
        
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
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px;">
        This personalized analysis was generated for ${data.company} based on your inquiry submitted on ${new Date().toLocaleDateString()}.
        The insights and recommendations are tailored to your specific business context and industry.
      </p>
    </div>
  `;

  // Text version
  const textBody = `
YOUR PERSONALIZED AI AUTOMATION ANALYSIS
============================================

Hi ${firstName},

Thank you for your patience! We've completed a comprehensive analysis of ${data.company}'s automation needs.

${webPresence ? `
DIGITAL PRESENCE ANALYSIS
============================================
Digital Maturity: ${webPresence.digitalMaturity}
Establishment Score: ${webPresence.overallScore}/100
${webPresence.hasWebsite && webPresence.websiteAnalysis?.isAccessible ? 'Website: Active' : ''}
${webPresence.hasSocialMedia ? `Social Media: ${webPresence.socialAnalysis.filter(s => s.isValid).length} platform(s)` : ''}
` : ''}

${aiResearch ? `
TOP AUTOMATION OPPORTUNITIES
============================================
${aiResearch.automationOpportunities.slice(0, 5).map((opp, idx) => `${idx + 1}. ${opp}`).join('\n')}

ESTIMATED ROI POTENTIAL
============================================
${aiResearch.estimatedROI}

${aiResearch.potentialChallenges && aiResearch.potentialChallenges.length > 0 ? `
THINGS TO CONSIDER
============================================
${aiResearch.potentialChallenges.map((c, idx) => `${idx + 1}. ${c}`).join('\n')}
` : ''}
` : ''}

${styleGuideUrls?.companyGuideUrl || styleGuideUrls?.contactGuideUrl ? `
YOUR COMPLIMENTARY STYLE GUIDES
============================================
Attached to this email are two professional PDF documents:

1. Company Style Guide - Communication guidelines for ${data.company}
2. Contact Style Guide - Best practices for the ${formatIndustry(data.industry)} industry

These are yours to keep and use, regardless of whether we work together!
` : ''}

READY TO TAKE THE NEXT STEP?
============================================

Option 1: Book a Discovery Call
https://agentico.com.au/booking

Option 2: Call Us Now
0468 068 882

Option 3: Reply to This Email
Just hit reply with your questions

We're genuinely excited about the potential here, ${firstName}. Looking forward to discussing how we can help ${data.company}.

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
    Subject: `Your Personalized Analysis + Complimentary Style Guides for ${data.company}`,
    HtmlBody: htmlBody,
    TextBody: textBody,
    MessageStream: 'outbound',
  };
}

