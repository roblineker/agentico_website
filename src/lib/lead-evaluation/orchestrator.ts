/**
 * Lead Evaluation Orchestrator
 * 
 * This module coordinates all lead evaluation activities:
 * 1. Score the lead based on form data
 * 2. Evaluate web presence
 * 3. Perform AI-powered deep research
 * 4. Generate style guides
 * 5. Save everything to Notion
 * 6. Send staged emails (instant + detailed)
 */

import type { ContactFormData } from '../types/contact-form';
import { evaluateLead } from './scoring';
import { evaluateWebPresence } from './web-research';
import { performDeepResearch, generateStyleGuides } from './ai-research';
import { saveCompanyStyleGuide, saveContactStyleGuide } from './notion-style-guides';
import { createOrFindClient, createProposal } from './notion-proposals';
import { generateStyleGuidePDFs } from '../utils/pdf-generator';
import * as postmark from 'postmark';
import { getInstantConfirmationEmail } from '../email-templates/instant-confirmation';
// import { getDetailedAnalysisEmail } from '../email-templates/detailed-analysis-clean'; // DISABLED
import { getSalesNotificationEmail } from '../email-templates/sales-notification';

export interface EvaluationResult {
  success: boolean;
  leadScore?: ReturnType<typeof evaluateLead>;
  webPresence?: Awaited<ReturnType<typeof evaluateWebPresence>>;
  aiResearch?: Awaited<ReturnType<typeof performDeepResearch>>;
  styleGuides?: {
    companyGuideUrl?: string;
    contactGuideUrl?: string;
    companyGuidePDF?: string;  // base64-encoded PDF
    contactGuidePDF?: string;  // base64-encoded PDF
  };
  client?: {
    clientId?: string;
    clientUrl?: string;
  };
  proposal?: {
    proposalId?: string;
    proposalUrl?: string;
    estimateIds?: string[];
  };
  errors?: string[];
}

/**
 * Send instant confirmation email immediately
 */
async function sendInstantConfirmation(data: ContactFormData): Promise<boolean> {
  const postmarkToken = process.env.POSTMARK_API_TOKEN;
  
  if (!postmarkToken) {
    console.warn('Postmark not configured - skipping instant confirmation');
    return false;
  }

  try {
    const client = new postmark.ServerClient(postmarkToken);
    const email = getInstantConfirmationEmail(data);
    await client.sendEmail(email);
    console.log('Instant confirmation email sent');
    return true;
  } catch (error) {
    console.error('Failed to send instant confirmation:', error);
    return false;
  }
}

/**
 * Send detailed analysis email with all insights and style guides
 * CURRENTLY DISABLED - Uncomment to re-enable
 */
// async function sendDetailedAnalysis(
//   data: ContactFormData,
//   result: EvaluationResult
// ): Promise<boolean> {
//   const postmarkToken = process.env.POSTMARK_API_TOKEN;
//   
//   if (!postmarkToken) {
//     console.warn('Postmark not configured - skipping detailed analysis');
//     return false;
//   }

//   try {
//     const client = new postmark.ServerClient(postmarkToken);
//     const email = getDetailedAnalysisEmail(
//       data,
//       result.leadScore,
//       result.webPresence,
//       result.aiResearch ?? undefined,
//       result.styleGuides
//     );
//     
//     // Add PDF attachments if available
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const attachments: any[] = [];
//     
//     if (result.styleGuides?.companyGuidePDF) {
//       attachments.push({
//         Name: `${data.company} - Company Style Guide.pdf`,
//         Content: result.styleGuides.companyGuidePDF,
//         ContentType: 'application/pdf',
//       });
//     }
//     
//     if (result.styleGuides?.contactGuidePDF) {
//       attachments.push({
//         Name: `${data.company} - Contact Style Guide.pdf`,
//         Content: result.styleGuides.contactGuidePDF,
//         ContentType: 'application/pdf',
//       });
//     }
//     
//     // Send email with attachments
//     await client.sendEmail({
//       ...email,
//       Attachments: attachments.length > 0 ? attachments : undefined,
//     });
//     
//     console.log(`Detailed analysis email sent${attachments.length > 0 ? ` with ${attachments.length} PDF attachments` : ''}`);
//     return true;
//   } catch (error) {
//     console.error('Failed to send detailed analysis:', error);
//     return false;
//   }
// }

/**
 * Send sales notification email with full evaluation
 */
async function sendSalesNotification(
  data: ContactFormData,
  result: EvaluationResult
): Promise<boolean> {
  const postmarkToken = process.env.POSTMARK_API_TOKEN;
  
  if (!postmarkToken) {
    console.warn('Postmark not configured - skipping sales notification');
    return false;
  }

  try {
    const client = new postmark.ServerClient(postmarkToken);
    const email = getSalesNotificationEmail(
      data,
      result.leadScore,
      result.webPresence,
      result.aiResearch ?? undefined
    );
    await client.sendEmail(email);
    console.log('Sales notification email sent');
    return true;
  } catch (error) {
    console.error('Failed to send sales notification:', error);
    return false;
  }
}

/**
 * Main orchestration function
 * Performs all evaluation steps and sends emails
 */
export async function evaluateAndProcessLead(
  data: ContactFormData,
  existingClientId?: string,
  existingContactId?: string
): Promise<EvaluationResult> {
  const errors: string[] = [];
  const result: EvaluationResult = { success: false, errors };

  console.log(`Starting lead evaluation for ${data.company}...`);

  try {
    // Step 1: Send instant confirmation (non-blocking)
    sendInstantConfirmation(data).catch(err => {
      console.error('Instant confirmation failed:', err);
      errors.push('Failed to send instant confirmation');
    });

    // Step 2: Evaluate lead score
    console.log('Evaluating lead score...');
    try {
      result.leadScore = evaluateLead(data);
      console.log(`Lead score: ${result.leadScore.rating} (${result.leadScore.totalScore}/140)`);
    } catch (error) {
      console.error('Lead scoring failed:', error);
      errors.push('Lead scoring failed');
    }

    // Step 3: Evaluate web presence
    console.log('Evaluating web presence...');
    try {
      result.webPresence = await evaluateWebPresence(data);
      console.log(`Web presence: ${result.webPresence.digitalMaturity} (${result.webPresence.overallScore}/100)`);
    } catch (error) {
      console.error('Web presence evaluation failed:', error);
      errors.push('Web presence evaluation failed');
    }

    // Step 4: Perform AI research (if OpenAI is configured)
    console.log('Performing AI research...');
    try {
      if (result.leadScore && result.webPresence) {
        result.aiResearch = await performDeepResearch(
          data,
          result.leadScore,
          result.webPresence
        );
        if (result.aiResearch) {
          console.log('AI research completed');
        } else {
          console.log('AI research skipped (OpenAI not configured)');
        }
      }
    } catch (error) {
      console.error('AI research failed:', error);
      errors.push('AI research failed');
    }

    // Step 5: Use existing client/contact IDs or create new ones
    console.log('Preparing client and contact references...');
    let clientId: string | undefined = existingClientId;
    const contactId: string | undefined = existingContactId;
    
    // Only create client if we don't have one from route.ts
    if (!clientId) {
      try {
        const clientResult = await createOrFindClient(data);
        if (clientResult.success && clientResult.clientId) {
          clientId = clientResult.clientId;
          result.client = {
            clientId: clientResult.clientId,
            clientUrl: clientResult.url,
          };
          console.log(`Client ready: ${data.company}`);
        } else {
          console.warn('Client creation/lookup skipped or failed');
        }
      } catch (error) {
        console.error('Client creation/lookup failed:', error);
        errors.push('Client creation/lookup failed');
      }
    } else {
      console.log(`Using existing client ID: ${clientId}`);
      result.client = { clientId };
    }

    // Step 6: Generate style guides (if OpenAI is configured)
    console.log('Generating style guides...');
    try {
      const styleGuides = await generateStyleGuides(data, result.aiResearch || null);
      
      if (styleGuides) {
        console.log('Style guides generated, creating PDFs and saving to Notion...');
        
        // Generate PDFs for email attachments
        let pdfResults: { companyPDF: string; contactPDF: string } | null = null;
        try {
          pdfResults = await generateStyleGuidePDFs(
            data.company,
            styleGuides.companyStyleGuide,
            styleGuides.contactStyleGuide
          );
          console.log('Style guide PDFs generated');
        } catch (pdfError) {
          console.error('PDF generation failed:', pdfError);
          errors.push('PDF generation failed');
        }
        
        // Save company style guide (link to Client)
        const companyGuideResult = await saveCompanyStyleGuide(
          data,
          styleGuides.companyStyleGuide,
          clientId  // Link to Client
        );
        
        // Save contact style guide (link to Contact)
        const contactGuideResult = await saveContactStyleGuide(
          data,
          styleGuides.contactStyleGuide,
          contactId  // Link to Contact (not Client!)
        );
        
        result.styleGuides = {
          companyGuideUrl: companyGuideResult.url,
          contactGuideUrl: contactGuideResult.url,
          companyGuidePDF: pdfResults?.companyPDF,
          contactGuidePDF: pdfResults?.contactPDF,
        };
        
        console.log('Style guides saved to Notion');
      } else {
        console.log('Style guide generation skipped (OpenAI not configured)');
      }
    } catch (error) {
      console.error('Style guide generation failed:', error);
      errors.push('Style guide generation failed');
    }

    // Step 7: Create proposal with estimates
    console.log('Creating proposal and estimates...');
    try {
      const proposalResult = await createProposal(
        data,
        clientId,
        result.leadScore,
        result.aiResearch ?? undefined
      );
      
      if (proposalResult.success) {
        result.proposal = {
          proposalId: proposalResult.proposalId,
          proposalUrl: proposalResult.url,
          estimateIds: proposalResult.estimateIds,
        };
        console.log(`Proposal created: ${proposalResult.url}`);
        console.log(`Estimates created: ${proposalResult.estimateIds?.length || 0} estimates`);
      } else {
        console.warn('Proposal creation skipped or failed');
      }
    } catch (error) {
      console.error('Proposal creation failed:', error);
      errors.push('Proposal creation failed');
    }

    // Step 8: Send detailed analysis email to customer (DISABLED)
    console.log('Detailed analysis email is currently disabled');
    // try {
    //   await sendDetailedAnalysis(data, result);
    // } catch (error) {
    //   console.error('Failed to send detailed analysis:', error);
    //   errors.push('Failed to send detailed analysis');
    // }

    // Step 9: Send sales notification
    console.log('Sending sales notification...');
    try {
      await sendSalesNotification(data, result);
    } catch (error) {
      console.error('Failed to send sales notification:', error);
      errors.push('Failed to send sales notification');
    }

    result.success = errors.length === 0;
    console.log(`Lead evaluation completed. Success: ${result.success}, Errors: ${errors.length}`);
    
    return result;
  } catch (error) {
    console.error('Lead evaluation failed:', error);
    errors.push('Lead evaluation failed');
    result.success = false;
    return result;
  }
}

/**
 * Quick evaluation function for testing or when full processing isn't needed
 * Returns just the scores without sending emails or generating content
 */
export async function quickEvaluate(data: ContactFormData) {
  console.log(`Quick evaluation for ${data.company}...`);
  
  const leadScore = evaluateLead(data);
  const webPresence = await evaluateWebPresence(data);
  
  return {
    leadScore,
    webPresence,
  };
}

