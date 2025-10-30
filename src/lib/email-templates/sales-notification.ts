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

export function getSalesNotificationEmail(
  data: ContactFormData,
  leadScore?: LeadScore,
  webPresence?: WebPresenceScore,
  aiResearch?: AIResearchResult
) {
  const htmlBody = `
    <div style="background: ${leadScore?.rating === 'High' ? '#dcfce7' : leadScore?.rating === 'Medium' ? '#fef9c3' : '#fee2e2'}; padding: 20px; border-left: 5px solid ${leadScore?.rating === 'High' ? '#16a34a' : leadScore?.rating === 'Medium' ? '#ca8a04' : '#dc2626'}; margin-bottom: 20px;">
      <h2 style="margin-top: 0;">🔥 ${leadScore?.rating || 'New'} Priority Lead - ${data.company}</h2>
      ${leadScore ? `
      <p style="font-size: 18px; margin: 10px 0;"><strong>Lead Score: ${leadScore.totalScore}/140 (${((leadScore.totalScore / 140) * 100).toFixed(0)}%)</strong></p>
      <p style="margin-bottom: 0;">
        ${leadScore.rating === 'High' ? '🎯 HIGH PRIORITY - Strong potential, follow up immediately!' : 
          leadScore.rating === 'Medium' ? '👍 MEDIUM PRIORITY - Good opportunity, follow up soon' : 
          '👀 LOW PRIORITY - Needs qualification'}
      </p>
      ` : ''}
    </div>
    
    <h2>New Contact Form Submission</h2>
    <p>You have received a new contact form submission from your website.</p>
    
    <h3>Contact Information</h3>
    <ul>
      <li><strong>Name:</strong> ${data.fullName}</li>
      <li><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></li>
      <li><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></li>
      <li><strong>Company:</strong> ${data.company}</li>
      ${data.website ? `<li><strong>Website:</strong> <a href="${data.website}">${data.website}</a></li>` : ''}
      ${data.socialLinks && data.socialLinks.length > 0 ? `
      <li><strong>Social Links:</strong>
        <ul>
          ${data.socialLinks.map(link => `<li><a href="${link.url}">${link.url}</a></li>`).join('')}
        </ul>
      </li>
      ` : ''}
    </ul>
    
    <h3>Business Details</h3>
    <ul>
      <li><strong>Industry:</strong> ${formatIndustry(data.industry)}</li>
      <li><strong>Business Size:</strong> ${data.businessSize} employees</li>
      <li><strong>Monthly Volume:</strong> ${data.monthlyVolume} transactions/jobs</li>
      <li><strong>Team Size:</strong> ${data.teamSize} people will use the solution</li>
    </ul>
    
    <h3>Project Scope</h3>
    <p><strong>Timeline:</strong> ${data.timeline.replace('_', '-')}</p>
    <p><strong>Budget:</strong> ${data.budget.replace('_', '-')}</p>
    
    <p><strong>Project Description:</strong></p>
    <p>${data.projectDescription}</p>
    
    <p><strong>Success Metrics:</strong></p>
    <p>${data.successMetrics}</p>
    
    <h3>Automation Goals</h3>
    <ul>
      ${data.automationGoals.map(goal => `<li>${goal.replace(/_/g, ' ')}</li>`).join('')}
    </ul>
    
    <p><strong>Specific Processes to Automate:</strong></p>
    <p>${data.specificProcesses}</p>
    
    ${data.projectIdeas && data.projectIdeas.length > 0 ? `
      <h3>Project Ideas</h3>
      ${data.projectIdeas.map(idea => `
        <div style="margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-left: 4px solid ${idea.priority === 'high' ? '#e53e3e' : idea.priority === 'medium' ? '#ecc94b' : '#48bb78'};">
          <strong>${idea.title}</strong> (Priority: ${idea.priority.toUpperCase()})
          <p>${idea.description}</p>
        </div>
      `).join('')}
    ` : ''}
    
    <h3>Integration Requirements</h3>
    <p><strong>Existing Tools:</strong> ${data.existingTools}</p>
    <p><strong>Integration Needs:</strong> ${data.integrationNeeds.join(', ') || 'None specified'}</p>
    <p><strong>Data Volume:</strong> ${data.dataVolume}</p>
    
    ${leadScore ? `
    <hr style="margin: 30px 0;">
    <h2>📊 LEAD EVALUATION REPORT</h2>
    
    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3>Score Breakdown</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #e5e7eb;">
          <th style="padding: 10px; text-align: left; border: 1px solid #d1d5db;">Factor</th>
          <th style="padding: 10px; text-align: center; border: 1px solid #d1d5db;">Score</th>
          <th style="padding: 10px; text-align: left; border: 1px solid #d1d5db;">Reason</th>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #d1d5db;">Budget</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #d1d5db;">${leadScore.breakdown.budget.score}/${leadScore.breakdown.budget.maxScore}</td>
          <td style="padding: 10px; border: 1px solid #d1d5db;">${leadScore.breakdown.budget.reason}</td>
        </tr>
        <tr style="background: #f9fafb;">
          <td style="padding: 10px; border: 1px solid #d1d5db;">Project Count</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #d1d5db;">${leadScore.breakdown.projectCount.score}/${leadScore.breakdown.projectCount.maxScore}</td>
          <td style="padding: 10px; border: 1px solid #d1d5db;">${leadScore.breakdown.projectCount.reason}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #d1d5db;">Timeframe</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #d1d5db;">${leadScore.breakdown.timeframe.score}/${leadScore.breakdown.timeframe.maxScore}</td>
          <td style="padding: 10px; border: 1px solid #d1d5db;">${leadScore.breakdown.timeframe.reason}</td>
        </tr>
        <tr style="background: #f9fafb;">
          <td style="padding: 10px; border: 1px solid #d1d5db;">Call Intent</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #d1d5db;">${leadScore.breakdown.callScheduled.score}/${leadScore.breakdown.callScheduled.maxScore}</td>
          <td style="padding: 10px; border: 1px solid #d1d5db;">${leadScore.breakdown.callScheduled.reason}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #d1d5db;">Business Size</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #d1d5db;">${leadScore.breakdown.businessSize.score}/${leadScore.breakdown.businessSize.maxScore}</td>
          <td style="padding: 10px; border: 1px solid #d1d5db;">${leadScore.breakdown.businessSize.reason}</td>
        </tr>
        <tr style="background: #f9fafb;">
          <td style="padding: 10px; border: 1px solid #d1d5db;">Urgency</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #d1d5db;">${leadScore.breakdown.urgency.score}/${leadScore.breakdown.urgency.maxScore}</td>
          <td style="padding: 10px; border: 1px solid #d1d5db;">${leadScore.breakdown.urgency.reason}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #d1d5db;">Clarity</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #d1d5db;">${leadScore.breakdown.clarity.score}/${leadScore.breakdown.clarity.maxScore}</td>
          <td style="padding: 10px; border: 1px solid #d1d5db;">${leadScore.breakdown.clarity.reason}</td>
        </tr>
        <tr style="background: #f9fafb;">
          <td style="padding: 10px; border: 1px solid #d1d5db;">Integration Complexity</td>
          <td style="padding: 10px; text-align: center; border: 1px solid #d1d5db;">${leadScore.breakdown.integrationComplexity.score}/${leadScore.breakdown.integrationComplexity.maxScore}</td>
          <td style="padding: 10px; border: 1px solid #d1d5db;">${leadScore.breakdown.integrationComplexity.reason}</td>
        </tr>
      </table>
    </div>
    
    ${leadScore.insights.length > 0 ? `
    <div style="background: #dbeafe; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
      <h4 style="margin-top: 0;">💡 Key Insights</h4>
      <ul style="margin: 10px 0;">
        ${leadScore.insights.map(insight => `<li>${insight}</li>`).join('')}
      </ul>
    </div>
    ` : ''}
    
    ${leadScore.opportunities.length > 0 ? `
    <div style="background: #d1fae5; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
      <h4 style="margin-top: 0;">🎯 Opportunities</h4>
      <ul style="margin: 10px 0;">
        ${leadScore.opportunities.map(opp => `<li>${opp}</li>`).join('')}
      </ul>
    </div>
    ` : ''}
    
    ${leadScore.redFlags.length > 0 ? `
    <div style="background: #fee2e2; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
      <h4 style="margin-top: 0;">⚠️ Red Flags</h4>
      <ul style="margin: 10px 0;">
        ${leadScore.redFlags.map(flag => `<li>${flag}</li>`).join('')}
      </ul>
    </div>
    ` : ''}
    ` : ''}
    
    ${webPresence ? `
    <hr style="margin: 30px 0;">
    <h2>🌐 WEB PRESENCE ANALYSIS</h2>
    
    <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p><strong>Digital Maturity:</strong> ${webPresence.digitalMaturity}</p>
      <p><strong>Overall Score:</strong> ${webPresence.overallScore}/100</p>
      
      ${webPresence.hasWebsite ? `
      <h4>Website Analysis</h4>
      <ul>
        <li><strong>Status:</strong> ${webPresence.websiteAnalysis?.isAccessible ? '✅ Accessible' : '❌ Not accessible'}</li>
        <li><strong>Security:</strong> ${webPresence.websiteAnalysis?.hasSSL ? '✅ HTTPS' : '❌ No HTTPS'}</li>
        ${webPresence.websiteAnalysis?.error ? `<li><strong>Error:</strong> ${webPresence.websiteAnalysis.error}</li>` : ''}
      </ul>
      ` : '<p>❌ No website provided</p>'}
      
      ${webPresence.hasSocialMedia ? `
      <h4>Social Media Presence</h4>
      <ul>
        ${webPresence.socialAnalysis.map(s => `<li>${s.isValid ? '✅' : '❌'} ${s.platform}: ${s.url}</li>`).join('')}
      </ul>
      ` : '<p>❌ No social media links provided</p>'}
      
      ${webPresence.recommendations.length > 0 ? `
      <h4>Recommendations</h4>
      <ul>
        ${webPresence.recommendations.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
      ` : ''}
    </div>
    ` : ''}
    
    ${aiResearch ? `
    <hr style="margin: 30px 0;">
    <h2>🤖 AI-POWERED DEEP RESEARCH</h2>
    
    <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3>Industry Insights</h3>
      <p>${aiResearch.industryInsights}</p>
      
      <h3>Competitive Analysis</h3>
      <p>${aiResearch.competitiveAnalysis}</p>
      
      <h3>Top Automation Opportunities</h3>
      <ol>
        ${aiResearch.automationOpportunities.map(opp => `<li>${opp}</li>`).join('')}
      </ol>
      
      <h3>Estimated ROI</h3>
      <p>${aiResearch.estimatedROI}</p>
      
      <h3>Implementation Strategy</h3>
      <p>${aiResearch.implementationStrategy}</p>
      
      ${aiResearch.potentialChallenges && aiResearch.potentialChallenges.length > 0 ? `
      <h3>Potential Challenges</h3>
      <ul>
        ${aiResearch.potentialChallenges.map(ch => `<li>${ch}</li>`).join('')}
      </ul>
      ` : ''}
      
      <h3>Recommended Approach</h3>
      <p>${aiResearch.recommendedApproach}</p>
    </div>
    ` : ''}
    
    <hr style="margin: 20px 0;">
    <p style="color: #666; font-size: 12px;">
      This submission has been automatically saved to your Notion workspace. Style guides have been generated and sent to the customer.
    </p>
  `;

  const textBody = `
${leadScore ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${leadScore.rating} PRIORITY LEAD - ${data.company}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lead Score: ${leadScore.totalScore}/140 (${((leadScore.totalScore / 140) * 100).toFixed(0)}%)

${leadScore.rating === 'High' ? '🎯 HIGH PRIORITY - Strong potential, follow up immediately!' : 
  leadScore.rating === 'Medium' ? '👍 MEDIUM PRIORITY - Good opportunity, follow up soon' : 
  '👀 LOW PRIORITY - Needs qualification'}

` : ''}
New Contact Form Submission

CONTACT INFORMATION
Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Company: ${data.company}
${data.website ? `Website: ${data.website}` : ''}
${data.socialLinks && data.socialLinks.length > 0 ? `Social Links: ${data.socialLinks.map(l => l.url).join(', ')}` : ''}

BUSINESS DETAILS
Industry: ${formatIndustry(data.industry)}
Business Size: ${data.businessSize} employees
Monthly Volume: ${data.monthlyVolume}
Team Size: ${data.teamSize} people

PROJECT SCOPE
Timeline: ${data.timeline}
Budget: ${data.budget}

Project Description:
${data.projectDescription}

Success Metrics:
${data.successMetrics}

AUTOMATION GOALS
${data.automationGoals.map(goal => `- ${goal.replace(/_/g, ' ')}`).join('\n')}

Specific Processes:
${data.specificProcesses}

${data.projectIdeas && data.projectIdeas.length > 0 ? `
PROJECT IDEAS
${data.projectIdeas.map(idea => `
[${idea.priority.toUpperCase()}] ${idea.title}
${idea.description}
`).join('\n')}
` : ''}

INTEGRATION REQUIREMENTS
Existing Tools: ${data.existingTools}
Integration Needs: ${data.integrationNeeds.join(', ') || 'None specified'}
Data Volume: ${data.dataVolume}
  `;

  return {
    From: 'Alex from Agentico <alex@agentico.com.au>',
    To: 'sales@agentico.com.au',
    Cc: 'rob@agentico.com.au',
    Subject: `${leadScore ? `${leadScore.rating === 'High' ? '🔥 HIGH' : leadScore.rating === 'Medium' ? '👍 MEDIUM' : '👀 LOW'} Priority - ` : ''}New Lead: ${data.company} (${data.budget})`,
    HtmlBody: htmlBody,
    TextBody: textBody,
    MessageStream: 'outbound',
  };
}

