import { Client } from '@notionhq/client';
import type { ContactFormData } from '../types/contact-form';

/**
 * Initialize Notion client
 */
function initializeNotion(): Client | null {
  const notionToken = process.env.NOTION_API_TOKEN;
  
  if (!notionToken) {
    console.warn('Notion API token not configured');
    return null;
  }
  
  return new Client({ 
    auth: notionToken,
    notionVersion: '2022-06-28',
  });
}

/**
 * Convert markdown-style text to Notion blocks
 */
function textToNotionBlocks(text: string): Array<// eslint-disable-next-line @typescript-eslint/no-explicit-any
any> {
  const blocks: Array<// eslint-disable-next-line @typescript-eslint/no-explicit-any
any> = [];
  
  const lines = text.split('\n');
  let currentParagraph = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines between sections
    if (trimmedLine === '') {
      if (currentParagraph) {
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { content: currentParagraph },
            }],
          },
        });
        currentParagraph = '';
      }
      continue;
    }
    
    // Check if it's a heading (lines that are ALL CAPS or start with #)
    if (trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 5 && !trimmedLine.match(/^\d+\./)) {
      if (currentParagraph) {
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { content: currentParagraph },
            }],
          },
        });
        currentParagraph = '';
      }
      
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{
            type: 'text',
            text: { content: trimmedLine },
          }],
        },
      });
      continue;
    }
    
    // Check if it's a heading with # marker
    if (trimmedLine.startsWith('# ')) {
      if (currentParagraph) {
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { content: currentParagraph },
            }],
          },
        });
        currentParagraph = '';
      }
      
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{
            type: 'text',
            text: { content: trimmedLine.substring(2) },
          }],
        },
      });
      continue;
    }
    
    if (trimmedLine.startsWith('## ')) {
      if (currentParagraph) {
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { content: currentParagraph },
            }],
          },
        });
        currentParagraph = '';
      }
      
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{
            type: 'text',
            text: { content: trimmedLine.substring(3) },
          }],
        },
      });
      continue;
    }
    
    // Check if it's a bullet point
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ') || trimmedLine.startsWith('* ')) {
      if (currentParagraph) {
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { content: currentParagraph },
            }],
          },
        });
        currentParagraph = '';
      }
      
      const bulletText = trimmedLine.substring(2);
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            type: 'text',
            text: { content: bulletText },
          }],
        },
      });
      continue;
    }
    
    // Check if it's a numbered list
    if (trimmedLine.match(/^\d+\.\s/)) {
      if (currentParagraph) {
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{
              type: 'text',
              text: { content: currentParagraph },
            }],
          },
        });
        currentParagraph = '';
      }
      
      const numberedText = trimmedLine.replace(/^\d+\.\s/, '');
      blocks.push({
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{
            type: 'text',
            text: { content: numberedText },
          }],
        },
      });
      continue;
    }
    
    // Regular paragraph - accumulate text
    if (currentParagraph) {
      currentParagraph += ' ' + trimmedLine;
    } else {
      currentParagraph = trimmedLine;
    }
    
    // If paragraph gets too long (approaching Notion's limit), split it
    if (currentParagraph.length > 1800) {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: { content: currentParagraph },
          }],
        },
      });
      currentParagraph = '';
    }
  }
  
  // Add any remaining paragraph
  if (currentParagraph) {
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{
          type: 'text',
          text: { content: currentParagraph },
        }],
      },
    });
  }
  
  return blocks;
}

/**
 * Save company style guide to Notion
 */
export async function saveCompanyStyleGuide(
  data: ContactFormData,
  styleGuideContent: string,
  clientPageId?: string
): Promise<{ success: boolean; pageId?: string; url?: string; error?: unknown }> {
  const notion = initializeNotion();
  
  if (!notion) {
    return { success: false, error: 'Notion not configured' };
  }

  try {
    // Company Style Guides database ID (you'll need to provide the actual ID)
    const styleGuidesDatabaseId = process.env.NOTION_COMPANY_STYLE_GUIDES_DB_ID;
    
    if (!styleGuidesDatabaseId) {
      console.warn('Company Style Guides database ID not configured');
      return { success: false, error: 'Database not configured' };
    }

    console.log(`Creating company style guide for ${data.company}...`);
    
    // Create the page
    const response = await notion.pages.create({
      parent: {
        type: 'database_id',
        database_id: styleGuidesDatabaseId,
      },
      properties: {
        'Name': {
          title: [{
            text: { content: `${data.company} - Company Style Guide` },
          }],
        },
        ...(clientPageId ? {
          'Client': {
            relation: [{ id: clientPageId }],
          },
        } : {}),
        'Status': {
          select: {
            name: 'Draft',
          },
        },
        'Created Date': {
          date: {
            start: new Date().toISOString().split('T')[0],
          },
        },
      },
    });

    // Add content as blocks (Notion has a limit, so we'll add in batches)
    const contentBlocks = textToNotionBlocks(styleGuideContent);
    const maxBlocksPerRequest = 100;
    
    for (let i = 0; i < contentBlocks.length; i += maxBlocksPerRequest) {
      const batch = contentBlocks.slice(i, i + maxBlocksPerRequest);
      await notion.blocks.children.append({
        block_id: response.id,
        children: batch,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pageUrl = (response as any).url || `https://notion.so/${response.id.replace(/-/g, '')}`;
    
    console.log(`Company style guide created: ${pageUrl}`);
    return { success: true, pageId: response.id, url: pageUrl };
  } catch (error) {
    console.error('Failed to save company style guide:', error);
    return { success: false, error };
  }
}

/**
 * Save contact style guide to Notion
 */
export async function saveContactStyleGuide(
  data: ContactFormData,
  styleGuideContent: string,
  clientPageId?: string
): Promise<{ success: boolean; pageId?: string; url?: string; error?: unknown }> {
  const notion = initializeNotion();
  
  if (!notion) {
    return { success: false, error: 'Notion not configured' };
  }

  try {
    // Contact Style Guides database ID (you'll need to provide the actual ID)
    const styleGuidesDatabaseId = process.env.NOTION_CONTACT_STYLE_GUIDES_DB_ID;
    
    if (!styleGuidesDatabaseId) {
      console.warn('Contact Style Guides database ID not configured');
      return { success: false, error: 'Database not configured' };
    }

    console.log(`Creating contact style guide for ${data.company}...`);
    
    // Create the page
    const response = await notion.pages.create({
      parent: {
        type: 'database_id',
        database_id: styleGuidesDatabaseId,
      },
      properties: {
        'Name': {
          title: [{
            text: { content: `${data.company} - Contact Style Guide` },
          }],
        },
        ...(clientPageId ? {
          'Client': {
            relation: [{ id: clientPageId }],
          },
        } : {}),
        'Status': {
          select: {
            name: 'Draft',
          },
        },
        'Created Date': {
          date: {
            start: new Date().toISOString().split('T')[0],
          },
        },
      },
    });

    // Add content as blocks
    const contentBlocks = textToNotionBlocks(styleGuideContent);
    const maxBlocksPerRequest = 100;
    
    for (let i = 0; i < contentBlocks.length; i += maxBlocksPerRequest) {
      const batch = contentBlocks.slice(i, i + maxBlocksPerRequest);
      await notion.blocks.children.append({
        block_id: response.id,
        children: batch,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pageUrl = (response as any).url || `https://notion.so/${response.id.replace(/-/g, '')}`;
    
    console.log(`Contact style guide created: ${pageUrl}`);
    return { success: true, pageId: response.id, url: pageUrl };
  } catch (error) {
    console.error('Failed to save contact style guide:', error);
    return { success: false, error };
  }
}

