import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// Path to the knowledge base
const KNOWLEDGE_BASE_PATH = path.join(process.cwd(), 'public', 'mcp', 'example-data');

// Helper function to read JSON files
function readKnowledgeFile(filename: string): Record<string, unknown> {
    const filePath = path.join(KNOWLEDGE_BASE_PATH, filename);
    if (!fs.existsSync(filePath)) {
        throw new Error(`Knowledge file not found: ${filename}`);
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as Record<string, unknown>;
}

// Helper function to list all knowledge files
function listKnowledgeFiles(): string[] {
    if (!fs.existsSync(KNOWLEDGE_BASE_PATH)) {
        return [];
    }
    return fs.readdirSync(KNOWLEDGE_BASE_PATH).filter(file => file.endsWith('.json'));
}

// Helper function to search across all knowledge bases
function searchKnowledgeBase(query: string, maxResults: number = 5): Array<{
    source: string;
    relevanceScore: number;
    data: Record<string, unknown>;
    matchedTerms: number;
}> {
    const files = listKnowledgeFiles();
    const results: Array<{
        source: string;
        relevanceScore: number;
        data: Record<string, unknown>;
        matchedTerms: number;
    }> = [];
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);

    for (const file of files) {
        try {
            const data = readKnowledgeFile(file);
            const dataString = JSON.stringify(data).toLowerCase();
            
            // Check if search terms match
            const matchCount = searchTerms.filter(term => dataString.includes(term)).length;
            
            if (matchCount > 0) {
                // Calculate relevance score
                const relevanceScore = matchCount / searchTerms.length;
                
                results.push({
                    source: file,
                    relevanceScore,
                    data,
                    matchedTerms: matchCount
                });
            }
        } catch (error) {
            console.error(`Error reading ${file}:`, error);
        }
    }

    // Sort by relevance
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    return results.slice(0, maxResults);
}

// Helper function to extract specific data from knowledge base
function extractDataByPath(filename: string, jsonPath: string): unknown {
    const data = readKnowledgeFile(filename);
    const pathParts = jsonPath.split('.');
    
    let current: unknown = data;
    for (const part of pathParts) {
        if (current === null || current === undefined) {
            return null;
        }
        
        // Handle array indexing
        const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
        if (arrayMatch) {
            const [, key, index] = arrayMatch;
            current = (current as Record<string, unknown>)[key];
            if (Array.isArray(current)) {
                current = current[parseInt(index)];
            }
        } else {
            current = (current as Record<string, unknown>)[part];
        }
    }
    
    return current;
}

// MCP Tool Handlers
const tools = {
    search_knowledge: ({ query, maxResults = 5 }: { query: string; maxResults?: number }) => {
        const results = searchKnowledgeBase(query, maxResults);
        return {
            results,
            totalFound: results.length,
            message: `Found ${results.length} matching knowledge base entries.`
        };
    },

    get_knowledge_file: ({ filename }: { filename: string }) => {
        const data = readKnowledgeFile(filename);
        return {
            filename,
            data,
            message: `Retrieved knowledge file: ${filename}`
        };
    },

    list_knowledge_files: () => {
        const files = listKnowledgeFiles();
        return {
            files,
            count: files.length,
            message: `Available knowledge files: ${files.length}`
        };
    },

    extract_data: ({ filename, path: jsonPath }: { filename: string; path: string }) => {
        const data = extractDataByPath(filename, jsonPath);
        return {
            filename,
            path: jsonPath,
            data,
            message: `Extracted data from ${filename} at path "${jsonPath}"`
        };
    },

    get_company_info: ({ filename }: { filename?: string } = {}) => {
        let filesToCheck: string[];
        
        if (filename) {
            filesToCheck = [filename];
        } else {
            filesToCheck = listKnowledgeFiles();
        }
        
        const companies = [];
        
        for (const file of filesToCheck) {
            try {
                const data = readKnowledgeFile(file);
                if (data.company) {
                    companies.push({
                        source: file,
                        company: data.company
                    });
                }
            } catch (error) {
                console.error(`Error reading ${file}:`, error);
            }
        }
        
        return {
            companies,
            message: `Found ${companies.length} company information entries.`
        };
    }
};

// GET endpoint - for health checks and info
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const tool = searchParams.get('tool');

    // Health check
    if (!tool) {
        return NextResponse.json({
            status: 'ok',
            message: 'Agentico MCP Knowledge Server',
            version: '1.0.0',
            endpoint: 'https://www.agentico.com.au/api/mcp',
            knowledgeFiles: listKnowledgeFiles(),
            availableTools: Object.keys(tools),
            usage: {
                search: 'POST /api/mcp with {"tool": "search_knowledge", "params": {"query": "your search"}}',
                getFile: 'POST /api/mcp with {"tool": "get_knowledge_file", "params": {"filename": "file.json"}}',
                list: 'POST /api/mcp with {"tool": "list_knowledge_files", "params": {}}',
                extract: 'POST /api/mcp with {"tool": "extract_data", "params": {"filename": "file.json", "path": "company.name"}}',
                company: 'POST /api/mcp with {"tool": "get_company_info", "params": {}}'
            }
        });
    }

    return NextResponse.json({ error: 'Use POST for tool calls' }, { status: 405 });
}

// POST endpoint - for MCP tool calls
export async function POST(request: NextRequest) {
    try {
        // Check for API secret
        const authHeader = request.headers.get('authorization');
        const expectedSecret = process.env.MCP_API_SECRET;
        
        // Only enforce auth if MCP_API_SECRET is set
        if (expectedSecret) {
            if (!authHeader) {
                return NextResponse.json({
                    error: 'Unauthorized - Missing authorization header',
                    hint: 'Include Authorization header with Bearer token'
                }, { status: 401 });
            }

            const token = authHeader.replace('Bearer ', '');
            if (token !== expectedSecret) {
                return NextResponse.json({
                    error: 'Unauthorized - Invalid API secret'
                }, { status: 401 });
            }
        }

        const body = await request.json();
        const { tool, params = {} } = body;

        // Validate tool exists
        if (!tool || !(tool in tools)) {
            return NextResponse.json({
                error: 'Invalid tool',
                availableTools: Object.keys(tools)
            }, { status: 400 });
        }

        // Execute tool
        const toolFunction = tools[tool as keyof typeof tools];
        const result = toolFunction(params);

        return NextResponse.json({
            success: true,
            tool,
            result
        });

    } catch (error) {
        console.error('MCP Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({
            success: false,
            error: errorMessage
        }, { status: 500 });
    }
}

// OPTIONS endpoint - for CORS
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

