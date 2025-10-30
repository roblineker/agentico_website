/**
 * Lead Evaluation Module
 * 
 * Comprehensive lead evaluation system that includes:
 * - Lead scoring based on multiple factors
 * - Web presence analysis
 * - AI-powered deep research
 * - Style guide generation
 * - Proposal and estimate creation
 * - Automated email workflows
 */

export { evaluateLead, formatLeadScoreForEmail } from './scoring';
export type { LeadScore } from './scoring';

export { evaluateWebPresence, formatWebPresenceForEmail } from './web-research';
export type { WebPresenceScore } from './web-research';

export { performDeepResearch, generateStyleGuides, formatAIResearchForEmail } from './ai-research';
export type { AIResearchResult } from './ai-research';

export { saveCompanyStyleGuide, saveContactStyleGuide } from './notion-style-guides';

export { createOrFindClient, createProposal, createEstimates } from './notion-proposals';

export { evaluateAndProcessLead, quickEvaluate } from './orchestrator';
export type { EvaluationResult } from './orchestrator';

