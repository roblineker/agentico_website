import type { ContactFormData } from '../types/contact-form';

export interface LeadScore {
  totalScore: number;
  rating: 'Low' | 'Medium' | 'High';
  breakdown: {
    budget: { score: number; maxScore: 30; reason: string };
    projectCount: { score: number; maxScore: 25; reason: string };
    timeframe: { score: number; maxScore: 20; reason: string };
    callScheduled: { score: number; maxScore: 25; reason: string };
    
    // Additional scoring factors
    businessSize: { score: number; maxScore: 10; reason: string };
    urgency: { score: number; maxScore: 10; reason: string };
    clarity: { score: number; maxScore: 10; reason: string };
    integrationComplexity: { score: number; maxScore: 10; reason: string };
  };
  insights: string[];
  redFlags: string[];
  opportunities: string[];
}

/**
 * Evaluate budget score (30% of total)
 */
function evaluateBudget(budget: ContactFormData['budget']): { score: number; reason: string } {
  const budgetScores = {
    'under_10k': { score: 10, reason: 'Budget under $10k - small project potential' },
    '10k-25k': { score: 20, reason: 'Budget $10k-$25k - moderate project potential' },
    '25k-50k': { score: 25, reason: 'Budget $25k-$50k - good project potential' },
    '50k-100k': { score: 28, reason: 'Budget $50k-$100k - strong project potential' },
    '100k+': { score: 30, reason: 'Budget $100k+ - excellent project potential' },
    'not_sure': { score: 15, reason: 'Budget uncertain - requires qualification' },
  };
  
  return budgetScores[budget];
}

/**
 * Evaluate project count score (25% of total)
 */
function evaluateProjectCount(data: ContactFormData): { score: number; reason: string } {
  const projectIdeasCount = data.projectIdeas?.length || 0;
  const hasMultipleGoals = data.automationGoals.length >= 3;
  const hasDetailedProcesses = data.specificProcesses.length > 200;
  
  if (projectIdeasCount >= 2) {
    return {
      score: 25,
      reason: `${projectIdeasCount} specific project ideas - high commitment level`,
    };
  }
  
  if (projectIdeasCount === 1 && (hasMultipleGoals || hasDetailedProcesses)) {
    return {
      score: 20,
      reason: 'One project idea with detailed goals - moderate commitment',
    };
  }
  
  if (hasMultipleGoals && hasDetailedProcesses) {
    return {
      score: 15,
      reason: 'Multiple goals with detailed processes - potential for projects',
    };
  }
  
  return {
    score: 0,
    reason: 'Limited project scope defined - needs discovery',
  };
}

/**
 * Evaluate timeframe score (20% of total)
 */
function evaluateTimeframe(timeline: ContactFormData['timeline']): { score: number; reason: string } {
  const timelineScores = {
    'immediate': { score: 20, reason: 'Immediate timeline - high urgency' },
    '1-3_months': { score: 15, reason: '1-3 months timeline - moderate urgency' },
    '3-6_months': { score: 10, reason: '3-6 months timeline - planning phase' },
    '6+_months': { score: 5, reason: '6+ months timeline - early exploration' },
  };
  
  return timelineScores[timeline];
}

/**
 * Evaluate call scheduling (25% of total)
 * Note: This will be populated when we add call scheduling to the form
 * For now, we'll infer from urgency and completeness
 */
function evaluateCallScheduling(data: ContactFormData): { score: number; reason: string } {
  // Future: Check if they've scheduled a call in the form
  // For now, use proxy indicators
  
  const isUrgent = data.timeline === 'immediate';
  const hasHighBudget = ['50k-100k', '100k+'].includes(data.budget);
  const hasDetailedInfo = 
    data.specificProcesses.length > 300 &&
    data.successMetrics.length > 100 &&
    data.projectDescription.length > 200;
  
  if (isUrgent && hasHighBudget && hasDetailedInfo) {
    return {
      score: 20,
      reason: 'High intent signals - likely to schedule call soon',
    };
  }
  
  if (isUrgent || (hasHighBudget && hasDetailedInfo)) {
    return {
      score: 15,
      reason: 'Moderate intent signals - call scheduling probable',
    };
  }
  
  if (hasDetailedInfo) {
    return {
      score: 10,
      reason: 'Detailed submission - call may be needed',
    };
  }
  
  return {
    score: 5,
    reason: 'Basic submission - needs follow-up to qualify',
  };
}

/**
 * Evaluate business size impact (10% of total)
 */
function evaluateBusinessSize(data: ContactFormData): { score: number; reason: string } {
  const sizeScores = {
    '1-5': { score: 5, reason: 'Small business - nimble but limited budget' },
    '6-20': { score: 7, reason: 'Growing business - good automation potential' },
    '21-50': { score: 9, reason: 'Mid-size business - strong automation needs' },
    '51-200': { score: 10, reason: 'Large business - significant automation budget' },
    '200+': { score: 10, reason: 'Enterprise - complex automation opportunities' },
  };
  
  return sizeScores[data.businessSize];
}

/**
 * Evaluate urgency signals (10% of total)
 */
function evaluateUrgency(data: ContactFormData): { score: number; reason: string } {
  let score = 0;
  const signals: string[] = [];
  
  // Timeline urgency
  if (data.timeline === 'immediate') {
    score += 5;
    signals.push('immediate timeline');
  } else if (data.timeline === '1-3_months') {
    score += 3;
  }
  
  // Pain point indicators in descriptions
  const painKeywords = [
    'overwhelmed', 'drowning', 'struggling', 'desperate', 'urgent',
    'asap', 'quickly', 'now', 'losing', 'losing money', 'losing customers',
    'behind', 'falling behind', 'competitor', 'can\'t keep up'
  ];
  
  const allText = `
    ${data.currentSystems} 
    ${data.specificProcesses} 
    ${data.projectDescription}
  `.toLowerCase();
  
  const painIndicators = painKeywords.filter(keyword => allText.includes(keyword));
  if (painIndicators.length >= 3) {
    score += 5;
    signals.push('multiple pain indicators');
  } else if (painIndicators.length > 0) {
    score += 3;
    signals.push('some pain indicators');
  }
  
  const reason = signals.length > 0 
    ? `Urgency signals: ${signals.join(', ')}`
    : 'Low urgency indicators';
  
  return { score, reason };
}

/**
 * Evaluate clarity and detail of submission (10% of total)
 */
function evaluateClarity(data: ContactFormData): { score: number; reason: string } {
  let score = 0;
  const factors: string[] = [];
  
  // Check length and detail of key fields
  if (data.projectDescription.length > 200) {
    score += 3;
    factors.push('detailed project description');
  }
  
  if (data.specificProcesses.length > 200) {
    score += 3;
    factors.push('detailed process description');
  }
  
  if (data.successMetrics.length > 100) {
    score += 2;
    factors.push('clear success metrics');
  }
  
  if (data.projectIdeas && data.projectIdeas.length > 0) {
    score += 2;
    factors.push('specific project ideas');
  }
  
  const reason = factors.length > 0
    ? `Good clarity: ${factors.join(', ')}`
    : 'Limited detail provided - needs qualification';
  
  return { score, reason };
}

/**
 * Evaluate integration complexity (10% of total)
 */
function evaluateIntegrationComplexity(data: ContactFormData): { score: number; reason: string } {
  const integrationCount = data.integrationNeeds.length;
  const hasCustomSoftware = data.integrationNeeds.includes('custom_software');
  const dataVolumeScore = {
    'minimal': 1,
    'moderate': 2,
    'large': 3,
    'very_large': 4,
  }[data.dataVolume];
  
  // More complexity = more opportunity = higher score
  let score = 0;
  const factors: string[] = [];
  
  if (integrationCount >= 4) {
    score += 4;
    factors.push(`${integrationCount} integration points`);
  } else if (integrationCount >= 2) {
    score += 3;
  }
  
  if (hasCustomSoftware) {
    score += 3;
    factors.push('custom software integration');
  }
  
  score += dataVolumeScore;
  factors.push(`${data.dataVolume} data volume`);
  
  const reason = `Complexity: ${factors.join(', ')}`;
  return { score, reason };
}

/**
 * Generate insights based on the lead data
 */
function generateInsights(data: ContactFormData, score: number): string[] {
  const insights: string[] = [];
  
  // Budget insights
  if (['50k-100k', '100k+'].includes(data.budget)) {
    insights.push('💰 High budget indicates serious commitment and established business');
  } else if (data.budget === 'not_sure') {
    insights.push('💭 Uncertain budget - needs education on ROI and pricing');
  }
  
  // Industry insights
  const complexIndustries = ['healthcare_medical', 'legal_services', 'accounting_bookkeeping', 'financial_advisory'];
  if (complexIndustries.includes(data.industry)) {
    insights.push('🏥 Regulated industry - compliance considerations important');
  }
  
  // Volume insights
  if (['1000-5000', '5000+'].includes(data.monthlyVolume)) {
    insights.push('📈 High transaction volume - strong ROI potential for automation');
  }
  
  // Team size insights
  if (data.teamSize === '20+') {
    insights.push('👥 Large team affected - significant productivity gains possible');
  }
  
  // Timeline insights
  if (data.timeline === 'immediate' && score < 60) {
    insights.push('⚠️ Urgent timeline but lower score - may need scope adjustment');
  }
  
  // Project ideas insights
  if (data.projectIdeas && data.projectIdeas.some(p => p.priority === 'high')) {
    insights.push('🎯 High-priority projects identified - clear starting point');
  }
  
  return insights;
}

/**
 * Identify red flags
 */
function identifyRedFlags(data: ContactFormData): string[] {
  const redFlags: string[] = [];
  
  // Budget vs scope mismatch
  if (data.budget === 'under_10k' && data.projectIdeas && data.projectIdeas.length > 2) {
    redFlags.push('🚩 Budget may be too low for stated project scope');
  }
  
  // Vague descriptions
  if (data.projectDescription.length < 100 || data.specificProcesses.length < 100) {
    redFlags.push('🚩 Limited detail provided - needs qualification call');
  }
  
  // Long timeline with immediate pain
  if (data.timeline === '6+_months') {
    const painKeywords = ['overwhelmed', 'urgent', 'asap', 'desperate'];
    const hasPain = painKeywords.some(k => 
      `${data.currentSystems} ${data.projectDescription}`.toLowerCase().includes(k)
    );
    if (hasPain) {
      redFlags.push('🚩 Urgent pain but long timeline - may be budget constrained');
    }
  }
  
  // No success metrics defined
  if (data.successMetrics.length < 50) {
    redFlags.push('🚩 Success metrics unclear - needs definition');
  }
  
  // Very small business with complex requirements
  if (data.businessSize === '1-5' && data.integrationNeeds.length > 4) {
    redFlags.push('🚩 Small business with complex integrations - implementation challenges');
  }
  
  return redFlags;
}

/**
 * Identify opportunities
 */
function identifyOpportunities(data: ContactFormData): string[] {
  const opportunities: string[] = [];
  
  // Upsell opportunities
  if (data.projectIdeas && data.projectIdeas.length === 1 && ['50k-100k', '100k+'].includes(data.budget)) {
    opportunities.push('💡 Single project with high budget - opportunity for broader solution');
  }
  
  // Industry expertise
  const industries = ['construction_trades', 'legal_services', 'healthcare_medical', 'accounting_bookkeeping'];
  if (industries.includes(data.industry)) {
    opportunities.push(`💡 ${data.industry.replace(/_/g, ' ')} - leverage industry templates`);
  }
  
  // High automation potential
  if (data.automationGoals.includes('reduce_manual_work') && ['large', 'very_large'].includes(data.dataVolume)) {
    opportunities.push('💡 High-volume manual work - significant time savings opportunity');
  }
  
  // Customer service automation
  if (data.automationGoals.includes('customer_service') || data.automationGoals.includes('improve_response_time')) {
    opportunities.push('💡 Customer-facing automation - measurable satisfaction improvements');
  }
  
  // Integration opportunities
  if (data.integrationNeeds.length >= 3) {
    opportunities.push('💡 Multiple integrations needed - comprehensive solution opportunity');
  }
  
  // Quick wins
  if (data.specificProcesses.toLowerCase().includes('email') || data.specificProcesses.toLowerCase().includes('quote')) {
    opportunities.push('💡 Email/quote automation - potential quick win to build trust');
  }
  
  return opportunities;
}

/**
 * Main evaluation function
 */
export function evaluateLead(data: ContactFormData): LeadScore {
  // Calculate individual scores
  const budget = evaluateBudget(data.budget);
  const projectCount = evaluateProjectCount(data);
  const timeframe = evaluateTimeframe(data.timeline);
  const callScheduled = evaluateCallScheduling(data);
  
  // Additional factors
  const businessSize = evaluateBusinessSize(data);
  const urgency = evaluateUrgency(data);
  const clarity = evaluateClarity(data);
  const integrationComplexity = evaluateIntegrationComplexity(data);
  
  // Calculate total score (out of 140 max)
  const totalScore = 
    budget.score + 
    projectCount.score + 
    timeframe.score + 
    callScheduled.score +
    businessSize.score +
    urgency.score +
    clarity.score +
    integrationComplexity.score;
  
  // Determine rating based on percentage
  const percentage = (totalScore / 140) * 100;
  let rating: 'Low' | 'Medium' | 'High';
  
  if (percentage >= 70) {
    rating = 'High';
  } else if (percentage >= 45) {
    rating = 'Medium';
  } else {
    rating = 'Low';
  }
  
  // Generate insights, red flags, and opportunities
  const insights = generateInsights(data, totalScore);
  const redFlags = identifyRedFlags(data);
  const opportunities = identifyOpportunities(data);
  
  return {
    totalScore,
    rating,
    breakdown: {
      budget: { ...budget, maxScore: 30 },
      projectCount: { ...projectCount, maxScore: 25 },
      timeframe: { ...timeframe, maxScore: 20 },
      callScheduled: { ...callScheduled, maxScore: 25 },
      businessSize: { ...businessSize, maxScore: 10 },
      urgency: { ...urgency, maxScore: 10 },
      clarity: { ...clarity, maxScore: 10 },
      integrationComplexity: { ...integrationComplexity, maxScore: 10 },
    },
    insights,
    redFlags,
    opportunities,
  };
}

/**
 * Format lead score for email or display
 */
export function formatLeadScoreForEmail(score: LeadScore): string {
  const percentage = ((score.totalScore / 140) * 100).toFixed(1);
  
  return `
LEAD QUALITY SCORE: ${score.rating} (${score.totalScore}/140 - ${percentage}%)

Score Breakdown:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Budget: ${score.breakdown.budget.score}/${score.breakdown.budget.maxScore} - ${score.breakdown.budget.reason}
• Project Count: ${score.breakdown.projectCount.score}/${score.breakdown.projectCount.maxScore} - ${score.breakdown.projectCount.reason}
• Timeframe: ${score.breakdown.timeframe.score}/${score.breakdown.timeframe.maxScore} - ${score.breakdown.timeframe.reason}
• Call Intent: ${score.breakdown.callScheduled.score}/${score.breakdown.callScheduled.maxScore} - ${score.breakdown.callScheduled.reason}
• Business Size: ${score.breakdown.businessSize.score}/${score.breakdown.businessSize.maxScore} - ${score.breakdown.businessSize.reason}
• Urgency: ${score.breakdown.urgency.score}/${score.breakdown.urgency.maxScore} - ${score.breakdown.urgency.reason}
• Clarity: ${score.breakdown.clarity.score}/${score.breakdown.clarity.maxScore} - ${score.breakdown.clarity.reason}
• Integration Complexity: ${score.breakdown.integrationComplexity.score}/${score.breakdown.integrationComplexity.maxScore} - ${score.breakdown.integrationComplexity.reason}

${score.insights.length > 0 ? `
Key Insights:
${score.insights.map(i => `  ${i}`).join('\n')}
` : ''}

${score.redFlags.length > 0 ? `
⚠️ Red Flags:
${score.redFlags.map(f => `  ${f}`).join('\n')}
` : ''}

${score.opportunities.length > 0 ? `
💡 Opportunities:
${score.opportunities.map(o => `  ${o}`).join('\n')}
` : ''}
`;
}

