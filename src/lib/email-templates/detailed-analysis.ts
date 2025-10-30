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
 * Detailed analysis email sent after processing (with style guides)
 * This is the comprehensive follow-up with all insights and resources
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
      <h1 style="color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px;">
        Your Personalized AI Automation Analysis
      </h1>
      
      <p>Hi ${firstName},</p>
      
      <p>Thank you for your patience! Our team (and our AI 🤖) has completed a comprehensive analysis of ${data.company}'s automation needs. Here's what we discovered:</p>
      
      ${leadScore ? `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 12px; margin: 30px 0;">
        <h2 style="margin-top: 0; color: white;">📊 Lead Quality Assessment</h2>
        <div style="display: flex; align-items: center; gap: 20px;">
          <div style="font-size: 48px; font-weight: bold;">${((leadScore.totalScore / 140) * 100).toFixed(0)}%</div>
          <div>
            <div style="font-size: 24px; font-weight: bold;">${leadScore.rating} Priority</div>
            <div>Score: ${leadScore.totalScore}/140</div>
          </div>
        </div>
        <p style="margin-bottom: 0; opacity: 0.9;">
          Based on your budget, timeline, project scope, and business context, we believe this is ${
            leadScore.rating === 'High' ? 'an excellent fit with strong potential for immediate impact' :
            leadScore.rating === 'Medium' ? 'a good opportunity with solid automation potential' :
            'an interesting opportunity that may need some scoping discussion'
          }.
        </p>
      </div>
      ` : ''}
      
      ${webPresence ? `
      <div style="background: #f0f9ff; padding: 20px; border-left: 4px solid #2563eb; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #1e40af;">🌐 Digital Presence Analysis</h3>
        <p><strong>Digital Maturity:</strong> ${webPresence.digitalMaturity}</p>
        <p><strong>Establishment Score:</strong> ${webPresence.overallScore}/100</p>
        ${webPresence.hasWebsite ? `
        <p>✓ <strong>Website:</strong> ${webPresence.websiteAnalysis?.isAccessible ? 'Active and accessible' : 'Provided but not currently accessible'}</p>
        ` : ''}
        ${webPresence.hasSocialMedia ? `
        <p>✓ <strong>Social Media:</strong> ${webPresence.socialAnalysis.filter(s => s.isValid).length} active platform(s)</p>
        ` : ''}
      </div>
      ` : ''}
      
      ${aiResearch ? `
      <div style="background: #fff7ed; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #c2410c;">🎯 Top Automation Opportunities</h3>
        <ol style="margin: 10px 0; padding-left: 25px;">
          ${aiResearch.automationOpportunities.slice(0, 5).map(opp => `
            <li style="margin-bottom: 8px;">${opp}</li>
          `).join('')}
        </ol>
      </div>
      
      <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #15803d;">💰 Estimated ROI Potential</h3>
        <p>${aiResearch.estimatedROI}</p>
      </div>
      
      ${aiResearch.potentialChallenges && aiResearch.potentialChallenges.length > 0 ? `
      <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #991b1b;">⚠️ Things to Consider</h3>
        <ul style="margin: 10px 0; padding-left: 25px;">
          ${aiResearch.potentialChallenges.map(challenge => `
            <li style="margin-bottom: 8px;">${challenge}</li>
          `).join('')}
        </ul>
      </div>
      ` : ''}
      
      <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #6b21a8;">🚀 Recommended Next Steps</h3>
        <p>${aiResearch.recommendedApproach}</p>
      </div>
      ` : ''}
      
      ${styleGuideUrls?.companyGuideUrl || styleGuideUrls?.contactGuideUrl ? `
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 25px; border-radius: 12px; margin: 30px 0;">
        <h2 style="margin-top: 0; color: white;">🎁 Your Free Style Guides</h2>
        <p>As promised, we've created customized style guides just for you:</p>
        <div style="margin: 20px 0;">
          ${styleGuideUrls.companyGuideUrl ? `
          <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h4 style="margin: 0 0 10px 0; color: white;">📘 Company Style Guide</h4>
            <p style="margin-bottom: 10px;">Voice, tone, and communication guidelines tailored for ${data.company}</p>
            <a href="${styleGuideUrls.companyGuideUrl}" style="display: inline-block; background: white; color: #f5576c; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              View Company Style Guide →
            </a>
          </div>
          ` : ''}
          ${styleGuideUrls.contactGuideUrl ? `
          <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: white;">📗 Contact Style Guide</h4>
            <p style="margin-bottom: 10px;">Best practices for engaging customers in the ${formatIndustry(data.industry)} industry</p>
            <a href="${styleGuideUrls.contactGuideUrl}" style="display: inline-block; background: white; color: #f5576c; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              View Contact Style Guide →
            </a>
          </div>
          ` : ''}
        </div>
        <p style="margin-bottom: 0; font-size: 14px; opacity: 0.9;">
          <em>These guides are stored in our Notion workspace and are yours to keep, regardless of whether we work together.</em>
        </p>
      </div>
      ` : ''}
      
      <div style="background: #1e293b; color: white; padding: 30px; border-radius: 12px; margin: 30px 0;">
        <h2 style="margin-top: 0; color: white;">📅 Ready to Take the Next Step?</h2>
        <p>Based on our analysis, we believe we can help ${data.company} achieve significant results. Here's how to move forward:</p>
        
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: white;">Option 1: Book a Discovery Call</h3>
          <p>Let's dive deeper into your specific needs and create a custom automation roadmap.</p>
          <a href="https://agentico.com.au/booking" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
            Schedule Your Discovery Call →
          </a>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: white;">Option 2: Quick Chat</h3>
          <p>Prefer to talk right away? Give us a call:</p>
          <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">
            <a href="tel:0437034998" style="color: white; text-decoration: none;">📱 0437 034 998</a>
          </p>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: white;">Option 3: Email Discussion</h3>
          <p>Have questions? Just reply to this email and we'll get back to you within a few hours.</p>
        </div>
      </div>
      
      <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
        <p>We're genuinely excited about the potential here, ${firstName}. The combination of your ${
          data.timeline === 'immediate' ? 'urgent timeline' : 'timeline'
        }, ${
          ['50k-100k', '100k+'].includes(data.budget) ? 'solid budget' : 'budget considerations'
        }, and ${
          data.projectIdeas && data.projectIdeas.length > 0 ? 'clear project ideas' : 'automation goals'
        } suggests this could be a really impactful engagement.</p>
        
        <p>Let's make it happen! 🚀</p>
        
        <p style="margin-top: 30px;">
          <strong>The Agentico Team</strong><br>
          <a href="mailto:hello@agentico.com.au" style="color: #2563eb;">hello@agentico.com.au</a><br>
          <a href="https://agentico.com.au" style="color: #2563eb;">agentico.com.au</a><br>
          0437 034 998
        </p>
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
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hi ${firstName},

Thank you for your patience! Our team has completed a comprehensive analysis of ${data.company}'s automation needs.

${leadScore ? `
LEAD QUALITY ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rating: ${leadScore.rating} Priority
Score: ${leadScore.totalScore}/140 (${((leadScore.totalScore / 140) * 100).toFixed(0)}%)

${leadScore.insights.map(i => i).join('\n')}
` : ''}

${webPresence ? `
DIGITAL PRESENCE ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Digital Maturity: ${webPresence.digitalMaturity}
Establishment Score: ${webPresence.overallScore}/100
${webPresence.hasWebsite ? `✓ Website: ${webPresence.websiteAnalysis?.isAccessible ? 'Active' : 'Provided but not accessible'}` : ''}
${webPresence.hasSocialMedia ? `✓ Social Media: ${webPresence.socialAnalysis.filter(s => s.isValid).length} platform(s)` : ''}
` : ''}

${aiResearch ? `
TOP AUTOMATION OPPORTUNITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${aiResearch.automationOpportunities.slice(0, 5).map((opp, idx) => `${idx + 1}. ${opp}`).join('\n')}

ESTIMATED ROI POTENTIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${aiResearch.estimatedROI}

${aiResearch.potentialChallenges && aiResearch.potentialChallenges.length > 0 ? `
THINGS TO CONSIDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${aiResearch.potentialChallenges.map((c, idx) => `${idx + 1}. ${c}`).join('\n')}
` : ''}

RECOMMENDED NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${aiResearch.recommendedApproach}
` : ''}

${styleGuideUrls?.companyGuideUrl || styleGuideUrls?.contactGuideUrl ? `
YOUR FREE STYLE GUIDES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${styleGuideUrls.companyGuideUrl ? `
📘 Company Style Guide
${styleGuideUrls.companyGuideUrl}
` : ''}
${styleGuideUrls.contactGuideUrl ? `
📗 Contact Style Guide
${styleGuideUrls.contactGuideUrl}
` : ''}
` : ''}

READY TO TAKE THE NEXT STEP?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Option 1: Book a Discovery Call
https://agentico.com.au/booking

Option 2: Call Us Now
0437 034 998

Option 3: Reply to This Email
Just hit reply with your questions

Let's make it happen! 🚀

The Agentico Team
hello@agentico.com.au
agentico.com.au
0437 034 998
  `;

  return {
    From: 'noreply@agentico.com.au',
    To: data.email,
    Subject: `📊 Your Personalized Analysis + Free Style Guides for ${data.company}`,
    HtmlBody: htmlBody,
    TextBody: textBody,
    MessageStream: 'outbound',
  };
}

