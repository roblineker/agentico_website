import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Load example data from JSON files
function loadExampleData(industry?: string) {
  const exampleDataPath = path.join(process.cwd(), 'public', 'mcp', 'example-data');
  
  if (industry && industry !== 'all') {
    // Load specific industry data
    const filePath = path.join(exampleDataPath, `${industry}_knowledge.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return { [industry]: data };
    }
  }
  
  // Load all example data
  const files = fs.readdirSync(exampleDataPath);
  const allData: Record<string, any> = {};
  
  for (const file of files) {
    if (file.endsWith('_knowledge.json')) {
      const industry = file.replace('_knowledge.json', '');
      const filePath = path.join(exampleDataPath, file);
      allData[industry] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  }
  
  return allData;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, model = 'gpt-4o-mini', temperature = 0.7, maxTokens = 2000, industry = 'all' } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Load relevant example data
    const exampleData = loadExampleData(industry);
    
    // Create system message with example data context
    const systemMessage = {
      role: 'system' as const,
      content: `You are a helpful AI assistant that can answer questions about various businesses and their operations. 

You have access to detailed information about the following businesses:
${Object.keys(exampleData).join(', ')}

Here is the business data you can reference:
${JSON.stringify(exampleData, null, 2)}

When answering questions:
1. Reference specific data from the business information provided
2. Be precise and accurate with numbers, dates, and names
3. If asked about data you don't have, clearly state that
4. Format monetary values properly with currency symbols
5. Be conversational and helpful

Always ground your answers in the actual data provided above.`
    };

    // Combine system message with user messages
    const allMessages = [systemMessage, ...messages];

    // Create chat completion
    const completion = await openai.chat.completions.create({
      model,
      messages: allMessages,
      temperature,
      max_tokens: maxTokens,
    });

    return NextResponse.json({
      message: completion.choices[0].message,
      usage: completion.usage,
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    
    return NextResponse.json(
      { 
        error: error?.message || 'An error occurred while processing your request',
        details: error?.response?.data || null 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to list available industries
export async function GET() {
  try {
    const exampleDataPath = path.join(process.cwd(), 'public', 'mcp', 'example-data');
    const files = fs.readdirSync(exampleDataPath);
    
    const industries = files
      .filter(file => file.endsWith('_knowledge.json'))
      .map(file => {
        const industry = file.replace('_knowledge.json', '');
        const displayName = industry
          .split(/(?=[A-Z])/)
          .join(' ')
          .replace(/^\w/, c => c.toUpperCase());
        return { value: industry, label: displayName };
      });

    return NextResponse.json({ industries });
  } catch (error) {
    console.error('Error loading industries:', error);
    return NextResponse.json(
      { error: 'Failed to load industries' },
      { status: 500 }
    );
  }
}

