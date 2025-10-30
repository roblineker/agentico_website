import OpenAI from 'openai';
import type { ContactFormData } from '../types/contact-form';
import type { LeadScore } from './scoring';
import type { WebPresenceScore } from './web-research';

export interface AIResearchResult {
  industryInsights: string;
  competitiveAnalysis: string;
  automationOpportunities: string[];
  estimatedROI: string;
  implementationStrategy: string;
  potentialChallenges: string[];
  recommendedApproach: string;
  styleGuideTopics?: string[];
}

/**
 * Initialize OpenAI client
 */
function initializeOpenAI(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('OpenAI API key not configured');
    return null;
  }
  
  return new OpenAI({ apiKey });
}

/**
 * Generate industry-specific insights using OpenAI
 */
export async function performDeepResearch(
  data: ContactFormData,
  leadScore: LeadScore,
  webPresence: WebPresenceScore
): Promise<AIResearchResult | null> {
  const openai = initializeOpenAI();
  
  if (!openai) {
    console.log('OpenAI not configured - skipping deep research');
    return null;
  }

  try {
    const prompt = `You are an AI automation consultant analyzing a new business lead. Provide detailed insights and recommendations.

LEAD INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Company: ${data.company}
Industry: ${data.industry}
Business Size: ${data.businessSize} employees
Team Size: ${data.teamSize} people affected
Monthly Volume: ${data.monthlyVolume} transactions/jobs

CURRENT STATE:
Current Systems: ${data.currentSystems}
Existing Tools: ${data.existingTools}

AUTOMATION NEEDS:
Goals: ${data.automationGoals.join(', ')}
Specific Processes: ${data.specificProcesses}
Project Description: ${data.projectDescription}

PROJECT SCOPE:
Timeline: ${data.timeline}
Budget: ${data.budget}
Success Metrics: ${data.successMetrics}
Data Volume: ${data.dataVolume}
Integration Needs: ${data.integrationNeeds.join(', ')}

${data.projectIdeas && data.projectIdeas.length > 0 ? `
PROJECT IDEAS:
${data.projectIdeas.map(idea => `- [${idea.priority.toUpperCase()}] ${idea.title}: ${idea.description}`).join('\n')}
` : ''}

LEAD QUALITY SCORE: ${leadScore.rating} (${leadScore.totalScore}/140)
DIGITAL MATURITY: ${webPresence.digitalMaturity}

Please provide a comprehensive analysis in the following format:

1. INDUSTRY INSIGHTS (2-3 paragraphs):
   - Common automation challenges in ${data.industry}
   - Industry-specific opportunities
   - Regulatory or compliance considerations

2. COMPETITIVE ANALYSIS (1-2 paragraphs):
   - How competitors in this industry are using automation
   - Market positioning opportunities through automation

3. AUTOMATION OPPORTUNITIES (List 5-7 specific opportunities):
   - Rank by priority and impact
   - Include estimated time savings or efficiency gains

4. ESTIMATED ROI:
   - Provide realistic ROI projections based on their budget and goals
   - Include payback period estimate
   - Quantify potential savings where possible

5. IMPLEMENTATION STRATEGY (2-3 paragraphs):
   - Recommended phased approach
   - Quick wins to build trust
   - Long-term roadmap

6. POTENTIAL CHALLENGES (List 3-5 challenges):
   - Technical challenges
   - Change management considerations
   - Integration complexities

7. RECOMMENDED APPROACH (1 paragraph):
   - Summary recommendation for how to engage with this lead
   - Key talking points for discovery call
   - Risk mitigation strategies

8. STYLE GUIDE TOPICS (List 5-7 topics):
   - Specific topics that would be valuable for their company style guide
   - Specific topics that would be valuable for their contact style guide
   - Industry-specific considerations

Keep the tone professional but conversational. Be specific and actionable.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI automation consultant specializing in helping small to medium businesses implement AI solutions. You provide detailed, actionable insights based on industry knowledge and business context.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const responseText = completion.choices[0].message.content || '';

    // Parse the response into structured format
    const result = parseAIResponse(responseText);

    return result;
  } catch (error) {
    console.error('OpenAI research failed:', error);
    return null;
  }
}

/**
 * Parse the AI response into structured data
 */
function parseAIResponse(text: string): AIResearchResult {
  // Helper function to extract section content
  const extractSection = (sectionName: string): string => {
    const regex = new RegExp(`${sectionName}[:\\s]*([\\s\\S]*?)(?=\\n\\d+\\.|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  // Helper function to extract list items
  const extractList = (sectionName: string): string[] => {
    const section = extractSection(sectionName);
    const lines = section.split('\n').filter(line => line.trim().length > 0);
    return lines
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .filter(line => line.length > 0);
  };

  return {
    industryInsights: extractSection('INDUSTRY INSIGHTS'),
    competitiveAnalysis: extractSection('COMPETITIVE ANALYSIS'),
    automationOpportunities: extractList('AUTOMATION OPPORTUNITIES'),
    estimatedROI: extractSection('ESTIMATED ROI'),
    implementationStrategy: extractSection('IMPLEMENTATION STRATEGY'),
    potentialChallenges: extractList('POTENTIAL CHALLENGES'),
    recommendedApproach: extractSection('RECOMMENDED APPROACH'),
    styleGuideTopics: extractList('STYLE GUIDE TOPICS'),
  };
}

/**
 * Generate style guide content using AI
 */
export async function generateStyleGuides(
  data: ContactFormData,
  aiResearch: AIResearchResult | null
): Promise<{ companyStyleGuide: string; contactStyleGuide: string } | null> {
  const openai = initializeOpenAI();
  
  if (!openai) {
    console.log('OpenAI not configured - skipping style guide generation');
    return null;
  }

  try {
    // Generate Company Style Guide
    const companyGuidePrompt = `Create a comprehensive Company Style Guide for ${data.company} that captures their unique brand voice and communication preferences.

COMPANY DETAILS:
- Company: ${data.company}
- Industry: ${data.industry}
- Business Size: ${data.businessSize} employees
- Website: ${data.website || 'Not provided'}
- Target Audience: ${data.industry} sector businesses
- Current Systems: ${data.currentSystems}

${aiResearch?.styleGuideTopics ? `
KEY TOPICS TO ADDRESS:
${aiResearch.styleGuideTopics.join('\n')}
` : ''}

Create a detailed, actionable style guide following this structure:

## 1. VOICE & TONE PROFILE
- Primary Voice (describe in 2-3 sentences)
- Key Voice Characteristics (list 4-5 specific traits)
- Tone Spectrum (how tone varies by content type: formal communications, marketing, social media, customer support)

## 2. CONTENT STRUCTURE
- Preferred Opening Styles (how communications typically start)
- Paragraph Structure (preferred length, bullet point usage)
- Visual Elements (emoji usage, bold/italics, headings)
- Closing/Call to Action patterns

## 3. KEY PHRASES & VOCABULARY
- Frequently Used Phrases (industry-appropriate)
- Industry-Specific Terms they use
- Words/Phrases to AVOID (generic corporate jargon)

## 4. CONTENT THEMES & PILLARS
Identify 3-4 primary content pillars relevant to ${data.industry} industry:
- Pillar name, purpose, typical angle, example topics

## 5. AI TELLS TO AVOID
List specific corporate jargon, generic phrases, and AI-sounding language to avoid. Provide authentic alternatives.

## 6. PRACTICAL EXAMPLES
Provide 3 example pieces of content (emails, social posts, etc.) that demonstrate their voice.

Make this SPECIFIC and ACTIONABLE, not generic. Base recommendations on ${data.industry} industry best practices and their business context.`;

    const contactGuidePrompt = `Create a comprehensive Contact Style Guide for communicating with decision-makers in the ${data.industry} industry.

CONTACT PROFILE (INFERRED FROM FORM):
- Name: ${data.fullName}
- Role: Decision maker at ${data.company}
- Industry: ${data.industry}
- Company Size: ${data.businessSize} employees
- Pain Points: ${data.specificProcesses.substring(0, 400)}
- Goals: ${data.automationGoals.join(', ')}
- Communication Channels: Email, phone, ${data.socialLinks && data.socialLinks.length > 0 ? 'social media' : 'traditional channels'}

${aiResearch?.styleGuideTopics ? `
KEY TOPICS TO ADDRESS:
${aiResearch.styleGuideTopics.join('\n')}
` : ''}

Create a detailed, actionable contact style guide following this structure:

## 1. VOICE & TONE PROFILE
- Communication Style (formal, casual, direct, diplomatic based on ${data.industry} norms)
- Key Characteristics (how this type of professional typically communicates)
- Tone by Channel (Email, LinkedIn, Phone/Video, Text)

## 2. CONTENT STRUCTURE
- Opening Style (how to start messages with this type of contact)
- Closing Style (how to end messages)
- Signature Phrases (common in ${data.industry})

## 3. KEY PHRASES & VOCABULARY
- Frequently Used Words/Phrases in ${data.industry}
- Industry Jargon (technical terms vs plain language preferences)
- Communication Preferences

## 4. CONTENT THEMES & PILLARS
Professional topics and interests common to ${data.industry} decision-makers:
- Professional Topics
- Values & Causes
- Business Priorities

## 5. AI TELLS TO AVOID
Corporate jargon and generic sales language that doesn't resonate with ${data.industry} professionals. Provide authentic alternatives.

## 6. PRACTICAL EXAMPLES
Provide 3 example communications (email, LinkedIn message, follow-up) demonstrating effective engagement with ${data.industry} decision-makers.

## 7. DO'S AND DON'TS
- Specific do's for engaging ${data.industry} professionals
- Specific don'ts that turn off this audience

Make this HIGHLY SPECIFIC to ${data.industry} decision-makers, not generic sales advice. Base on industry best practices and professional communication norms.`;

    // Generate both guides in parallel
    const [companyGuideResponse, contactGuideResponse] = await Promise.all([
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert brand consultant specializing in creating comprehensive style guides for businesses.',
          },
          {
            role: 'user',
            content: companyGuidePrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert sales and communication consultant specializing in customer engagement strategies.',
          },
          {
            role: 'user',
            content: contactGuidePrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    ]);

    return {
      companyStyleGuide: companyGuideResponse.choices[0].message.content || '',
      contactStyleGuide: contactGuideResponse.choices[0].message.content || '',
    };
  } catch (error) {
    console.error('Style guide generation failed:', error);
    return null;
  }
}

/**
 * Format AI research for email
 */
export function formatAIResearchForEmail(research: AIResearchResult): string {
  return `
AI-POWERED DEEP RESEARCH & ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INDUSTRY INSIGHTS:
${research.industryInsights}

COMPETITIVE ANALYSIS:
${research.competitiveAnalysis}

AUTOMATION OPPORTUNITIES:
${research.automationOpportunities.map((opp, idx) => `${idx + 1}. ${opp}`).join('\n')}

ESTIMATED ROI:
${research.estimatedROI}

IMPLEMENTATION STRATEGY:
${research.implementationStrategy}

POTENTIAL CHALLENGES:
${research.potentialChallenges.map((ch, idx) => `${idx + 1}. ${ch}`).join('\n')}

RECOMMENDED APPROACH:
${research.recommendedApproach}

${research.styleGuideTopics && research.styleGuideTopics.length > 0 ? `
STYLE GUIDE TOPICS:
${research.styleGuideTopics.map((topic, idx) => `${idx + 1}. ${topic}`).join('\n')}
` : ''}
`;
}

