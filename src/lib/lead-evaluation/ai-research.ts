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
    const companyGuidePrompt = `Create a comprehensive Company Style Guide for ${data.company}.

COMPANY DETAILS:
- Company: ${data.company}
- Industry: ${data.industry}
- Business Size: ${data.businessSize} employees
- Website: ${data.website || 'Not provided'}

${aiResearch?.styleGuideTopics ? `
RELEVANT TOPICS TO COVER:
${aiResearch.styleGuideTopics.join('\n')}
` : ''}

Create a professional company style guide that includes:
1. Voice & Tone Guidelines
2. Brand Personality Traits
3. Industry-Specific Language Considerations
4. Communication Dos and Don'ts
5. Example Phrases and Templates
6. Target Audience Communication Style

Format as a professional document with clear sections. Make it specific and actionable for their industry.`;

    const contactGuidePrompt = `Create a comprehensive Contact Style Guide for how to communicate with potential customers in the ${data.industry} industry.

CONTEXT:
- Industry: ${data.industry}
- Target Business Size: ${data.businessSize} employees
- Common Pain Points: ${data.specificProcesses.substring(0, 500)}

${aiResearch?.styleGuideTopics ? `
RELEVANT TOPICS TO COVER:
${aiResearch.styleGuideTopics.join('\n')}
` : ''}

Create a professional contact style guide that includes:
1. First Contact Best Practices
2. Discovery Call Framework
3. Email Communication Templates
4. Objection Handling Scripts
5. Follow-up Sequences
6. Industry-Specific Terminology to Use/Avoid
7. Value Proposition Framing

Format as a professional document with clear sections and actionable examples.`;

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

