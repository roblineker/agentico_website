import { Client } from '@notionhq/client';
import type { ContactFormData } from '../types/contact-form';
import type { LeadScore } from './scoring';
import type { AIResearchResult } from './ai-research';

/**
 * Initialize Notion client
 */
function initializeNotion(): Client | null {
  const notionToken = process.env.NOTION_API_TOKEN;
  
  if (!notionToken) {
    return null;
  }
  
  return new Client({ 
    auth: notionToken,
    notionVersion: '2022-06-28',
  });
}

/**
 * Create or find a client in Notion Clients database
 */
export async function createOrFindClient(
  data: ContactFormData
): Promise<{ success: boolean; clientId?: string; url?: string; error?: unknown }> {
  const notion = initializeNotion();
  
  if (!notion) {
    return { success: false, error: 'Notion not configured' };
  }

  try {
    const clientsDbId = process.env.NOTION_CLIENTS_DB_ID;
    
    if (!clientsDbId) {
      return { success: false, error: 'Database not configured' };
    }
    
    // Search for existing client by name using search API
    const searchResponse = await notion.search({
      query: data.company,
      filter: {
        property: 'object',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: 'page' as any,
      },
    });

    // Check if we found an exact match in Clients database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingClient = searchResponse.results.find((page: any) => {
      const title = page.properties?.Name?.title?.[0]?.plain_text || '';
      return title === data.company;
    });

    // If client exists, return it
    if (existingClient) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const url = (existingClient as any).url || `https://notion.so/${existingClient.id.replace(/-/g, '')}`;
      return { success: true, clientId: existingClient.id, url };
    }

    // Create new client
    const response = await notion.pages.create({
      parent: {
        type: 'database_id',
        database_id: clientsDbId,
      },
      properties: {
        'Name': {
          title: [{
            text: { content: data.company },
          }],
        },
        'Type': {
          select: {
            name: 'Prospect',
          },
        },
        ...(data.website ? {
          'Website': {
            url: data.website,
          },
        } : {}),
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const url = (response as any).url || `https://notion.so/${response.id.replace(/-/g, '')}`;
    
    return { success: true, clientId: response.id, url };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Create estimates for project ideas
 */
export async function createEstimates(
  data: ContactFormData,
  proposalId?: string
): Promise<{ success: boolean; estimateIds?: string[]; error?: unknown }> {
  const notion = initializeNotion();
  
  if (!notion) {
    return { success: false, error: 'Notion not configured' };
  }

  try {
    const estimatesDbId = process.env.NOTION_ESTIMATES_DB_ID;
    
    if (!estimatesDbId) {
      return { success: false, error: 'Database not configured' };
    }
    
    const estimateIds: string[] = [];
    const today = new Date().toISOString().split('T')[0];

    // Create estimate for overall project
    const overallEstimate = await notion.pages.create({
      parent: {
        type: 'database_id',
        database_id: estimatesDbId,
      },
      properties: {
        'Name': {
          title: [{
            text: { content: `${data.company} - Overall Project Estimate` },
          }],
        },
        'Status': {
          status: {
            name: 'Not started',
          },
        },
        'Estimate Date': {
          date: {
            start: today,
          },
        },
        ...(proposalId ? {
          'Proposals': {
            relation: [{ id: proposalId }],
          },
        } : {}),
      },
    });
    estimateIds.push(overallEstimate.id);

    // Create estimates for each project idea
    if (data.projectIdeas && data.projectIdeas.length > 0) {
      for (const idea of data.projectIdeas) {
        const projectEstimate = await notion.pages.create({
          parent: {
            type: 'database_id',
            database_id: estimatesDbId,
          },
          properties: {
            'Name': {
              title: [{
                text: { content: `${data.company} - ${idea.title}` },
              }],
            },
            'Status': {
              status: {
                name: 'Not started',
              },
            },
            'Estimate Date': {
              date: {
                start: today,
              },
            },
            ...(proposalId ? {
              'Proposals': {
                relation: [{ id: proposalId }],
              },
            } : {}),
          },
        });
        estimateIds.push(projectEstimate.id);
      }
    }

    return { success: true, estimateIds };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Create a proposal with estimates
 */
export async function createProposal(
  data: ContactFormData,
  clientId?: string,
  leadScore?: LeadScore,
  aiResearch?: AIResearchResult
): Promise<{ success: boolean; proposalId?: string; url?: string; estimateIds?: string[]; error?: unknown }> {
  const notion = initializeNotion();
  
  if (!notion) {
    return { success: false, error: 'Notion not configured' };
  }

  try {
    const proposalsDbId = process.env.NOTION_PROPOSALS_DB_ID;
    
    if (!proposalsDbId) {
      return { success: false, error: 'Database not configured' };
    }
    
    const today = new Date().toISOString().split('T')[0];

    // Create the proposal
    const response = await notion.pages.create({
      parent: {
        type: 'database_id',
        database_id: proposalsDbId,
      },
      properties: {
        'Proposal Name': {
          title: [{
            text: { content: `${data.company} - AI Automation Proposal` },
          }],
        },
        'Status': {
          status: {
            name: 'Draft',
          },
        },
        'Proposal Date': {
          date: {
            start: today,
          },
        },
        ...(clientId ? {
          'Client': {
            relation: [{ id: clientId }],
          },
        } : {}),
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const proposalUrl = (response as any).url || `https://notion.so/${response.id.replace(/-/g, '')}`;
    
    // Create estimates linked to this proposal
    const estimatesResult = await createEstimates(data, response.id);

    // Add content to the proposal page
    await addProposalContent(notion, response.id, data, leadScore, aiResearch);

    return { 
      success: true, 
      proposalId: response.id, 
      url: proposalUrl,
      estimateIds: estimatesResult.estimateIds,
    };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Add content blocks to the proposal page
 */
async function addProposalContent(
  notion: Client,
  pageId: string,
  data: ContactFormData,
  leadScore?: LeadScore,
  aiResearch?: AIResearchResult
): Promise<void> {
  try {
    const blocks: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any[] = [
      // Header
      {
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{
            type: 'text',
            text: { content: `AI Automation Proposal for ${data.company}` },
          }],
        },
      },
      // Overview
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{
            type: 'text',
            text: { content: '📋 Project Overview' },
          }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: { content: data.projectDescription },
          }],
        },
      },
    ];

    // Add lead score section if available
    if (leadScore) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{
            type: 'text',
            text: { content: '📊 Lead Quality Assessment' },
          }],
        },
      });
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Rating: ' },
            },
            {
              type: 'text',
              text: { content: `${leadScore.rating} Priority` },
              annotations: { bold: true },
            },
          ],
        },
      });
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: { content: `Score: ${leadScore.totalScore}/140 (${((leadScore.totalScore / 140) * 100).toFixed(0)}%)` },
          }],
        },
      });
    }

    // Add automation opportunities from AI research
    if (aiResearch && aiResearch.automationOpportunities.length > 0) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{
            type: 'text',
            text: { content: '🎯 Automation Opportunities' },
          }],
        },
      });
      
      aiResearch.automationOpportunities.forEach(opportunity => {
        blocks.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{
              type: 'text',
              text: { content: opportunity },
            }],
          },
        });
      });
    }

    // Add project ideas
    if (data.projectIdeas && data.projectIdeas.length > 0) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{
            type: 'text',
            text: { content: '💡 Specific Project Ideas' },
          }],
        },
      });

      data.projectIdeas.forEach(idea => {
        blocks.push({
          object: 'block',
          type: 'heading_3',
          heading_3: {
            rich_text: [{
              type: 'text',
              text: { content: `${idea.title} (${idea.priority.toUpperCase()} Priority)` },
            }],
          },
        });
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { content: idea.description },
            }],
          },
        });
      });
    }

    // Add ROI section if available
    if (aiResearch?.estimatedROI) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{
            type: 'text',
            text: { content: '💰 Estimated ROI' },
          }],
        },
      });
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: { content: aiResearch.estimatedROI },
          }],
        },
      });
    }

    // Add implementation strategy if available
    if (aiResearch?.implementationStrategy) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{
            type: 'text',
            text: { content: '🚀 Implementation Strategy' },
          }],
        },
      });
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: { content: aiResearch.implementationStrategy },
          }],
        },
      });
    }

    // Add success metrics
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{
          type: 'text',
          text: { content: '📈 Success Metrics' },
        }],
      },
    });
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{
          type: 'text',
          text: { content: data.successMetrics },
        }],
      },
    });

    // Add blocks in batches (Notion limit is 100 blocks per request)
    const maxBlocksPerRequest = 100;
    for (let i = 0; i < blocks.length; i += maxBlocksPerRequest) {
      const batch = blocks.slice(i, i + maxBlocksPerRequest);
      await notion.blocks.children.append({
        block_id: pageId,
        children: batch,
      });
    }
  } catch (error) {
    throw error;
  }
}

