import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// Path to the knowledge base
const KNOWLEDGE_BASE_PATH = path.join(process.cwd(), 'src', 'elevenlabs_mcp', 'example-data');

// Path to the system prompt
const SYSTEM_PROMPT_PATH = path.join(process.cwd(), 'src', 'elevenlabs_mcp', 'elevenlabs_system_prompt_updated.md');

// MCP API Secret from environment
const MCP_API_SECRET = process.env.MCP_API_SECRET;

// MCP Server Info
const SERVER_INFO = {
    name: 'agentico-knowledge-server',
    version: '1.0.0'
};

// Helper function to validate API authentication
function validateAuth(request: NextRequest): { valid: boolean; error?: string } {
    // If MCP_API_SECRET is not set, warn but allow (for development)
    if (!MCP_API_SECRET) {
        console.warn('WARNING: MCP_API_SECRET is not set. Authentication is disabled.');
        return { valid: true };
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
        return { valid: false, error: 'Missing Authorization header' };
    }

    // Support both "Bearer TOKEN" and just "TOKEN" formats
    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : authHeader;

    if (token !== MCP_API_SECRET) {
        return { valid: false, error: 'Invalid API secret' };
    }

    return { valid: true };
}

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

// Helper function to read the system prompt
function readSystemPrompt(): string {
    if (!fs.existsSync(SYSTEM_PROMPT_PATH)) {
        throw new Error('System prompt file not found');
    }
    return fs.readFileSync(SYSTEM_PROMPT_PATH, 'utf-8');
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

// MCP Tools Definitions
const TOOLS = [
    {
        name: 'search_knowledge',
        description: 'Search across all knowledge base files for relevant information. Returns matching data sorted by relevance.',
        inputSchema: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search query terms'
                },
                maxResults: {
                    type: 'number',
                    description: 'Maximum number of results to return',
                    default: 5
                }
            },
            required: ['query']
        }
    },
    {
        name: 'get_knowledge_file',
        description: 'Retrieve complete contents of a specific knowledge base file.',
        inputSchema: {
            type: 'object',
            properties: {
                filename: {
                    type: 'string',
                    description: 'Name of the knowledge file (e.g., "recruiting_company_knowledge.json")'
                }
            },
            required: ['filename']
        }
    },
    {
        name: 'list_knowledge_files',
        description: 'List all available knowledge base files.',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'extract_data',
        description: 'Extract specific data from a knowledge file using a JSON path (e.g., "company.name" or "clients[0].company_name").',
        inputSchema: {
            type: 'object',
            properties: {
                filename: {
                    type: 'string',
                    description: 'Name of the knowledge file'
                },
                path: {
                    type: 'string',
                    description: 'JSON path to the data (e.g., "company.name" or "clients[0]")'
                }
            },
            required: ['filename', 'path']
        }
    },
    {
        name: 'get_company_info',
        description: 'Get basic company information from any knowledge base file.',
        inputSchema: {
            type: 'object',
            properties: {
                filename: {
                    type: 'string',
                    description: 'Specific knowledge file to query, or omit to search all files'
                }
            }
        }
    },
    {
        name: 'get_system_prompt',
        description: 'Retrieve the ElevenLabs system prompt for the conversational AI agent.',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    }
];

// MCP Resources - dynamically generated to include system prompt and knowledge files
function getResources() {
    const knowledgeResources = listKnowledgeFiles().map(file => ({
        uri: `knowledge://${file.replace('.json', '')}`,
        name: file.replace('.json', '').replace(/_/g, ' '),
        description: `Direct access to ${file} knowledge base`,
        mimeType: 'application/json'
    }));

    // Add system prompt resource
    const systemPromptResource = {
        uri: 'prompt://elevenlabs-system-prompt',
        name: 'ElevenLabs System Prompt',
        description: 'System prompt for ElevenLabs conversational AI agent (Alex the receptionist)',
        mimeType: 'text/markdown'
    };

    return [systemPromptResource, ...knowledgeResources];
}

// Handle MCP Tool Calls
function handleToolCall(toolName: string, args: Record<string, unknown>) {
    switch (toolName) {
        case 'search_knowledge': {
            const query = args.query as string;
            const maxResults = (args.maxResults as number) || 5;
            const results = searchKnowledgeBase(query, maxResults);
            return {
                content: [{
                    type: 'text',
                    text: `Found ${results.length} matching knowledge base entries.\n\n${JSON.stringify(results, null, 2)}`
                }]
            };
        }

        case 'get_knowledge_file': {
            const filename = args.filename as string;
            const data = readKnowledgeFile(filename);
            return {
                content: [{
                    type: 'text',
                    text: `Knowledge file: ${filename}\n\n${JSON.stringify(data, null, 2)}`
                }]
            };
        }

        case 'list_knowledge_files': {
            const files = listKnowledgeFiles();
            return {
                content: [{
                    type: 'text',
                    text: `Available knowledge files (${files.length}):\n${files.map(f => `- ${f}`).join('\n')}`
                }]
            };
        }

        case 'extract_data': {
            const filename = args.filename as string;
            const jsonPath = args.path as string;
            const data = extractDataByPath(filename, jsonPath);
            return {
                content: [{
                    type: 'text',
                    text: `Extracted from ${filename} at path "${jsonPath}":\n\n${JSON.stringify(data, null, 2)}`
                }]
            };
        }

        case 'get_company_info': {
            const filename = args.filename as string | undefined;
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
                content: [{
                    type: 'text',
                    text: `Found ${companies.length} company information entries:\n\n${JSON.stringify(companies, null, 2)}`
                }]
            };
        }

        case 'get_system_prompt': {
            const prompt = readSystemPrompt();
            return {
                content: [{
                    type: 'text',
                    text: prompt
                }]
            };
        }

        default:
            throw new Error(`Unknown tool: ${toolName}`);
    }
}

// Handle MCP Resource Reads
function handleResourceRead(uri: string) {
    // Handle system prompt resource
    if (uri === 'prompt://elevenlabs-system-prompt') {
        const prompt = readSystemPrompt();
        return {
            contents: [{
                uri,
                mimeType: 'text/markdown',
                text: prompt
            }]
        };
    }
    
    // Handle knowledge base resources
    const match = uri.match(/^knowledge:\/\/(.+)$/);
    if (!match) {
        throw new Error(`Invalid resource URI: ${uri}`);
    }
    
    const resourceName = match[1];
    const filename = `${resourceName}.json`;
    const data = readKnowledgeFile(filename);
    
    return {
        contents: [{
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(data, null, 2)
        }]
    };
}

// Handle JSON-RPC 2.0 requests
function handleJsonRpcRequest(request: {
    jsonrpc: string;
    id?: string | number | null;
    method: string;
    params?: Record<string, unknown>;
}) {
    const { method, params = {}, id } = request;

    try {
        let result;

        switch (method) {
            case 'initialize':
                result = {
                    protocolVersion: '2024-11-05',
                    capabilities: {
                        tools: {},
                        resources: {}
                    },
                    serverInfo: SERVER_INFO
                };
                break;

            case 'tools/list':
                result = {
                    tools: TOOLS
                };
                break;

            case 'tools/call':
                const toolName = params.name as string;
                const args = (params.arguments as Record<string, unknown>) || {};
                result = handleToolCall(toolName, args);
                break;

            case 'resources/list':
                result = {
                    resources: getResources()
                };
                break;

            case 'resources/read':
                const uri = params.uri as string;
                result = handleResourceRead(uri);
                break;

            case 'ping':
                result = {};
                break;

            default:
                return {
                    jsonrpc: '2.0',
                    id,
                    error: {
                        code: -32601,
                        message: `Method not found: ${method}`
                    }
                };
        }

        return {
            jsonrpc: '2.0',
            id,
            result
        };
    } catch (error) {
        console.error('MCP Error:', error);
        return {
            jsonrpc: '2.0',
            id,
            error: {
                code: -32603,
                message: error instanceof Error ? error.message : 'Internal error'
            }
        };
    }
}

// GET endpoint - for health checks and SSE
export async function GET(request: NextRequest) {
    // Validate authentication
    const auth = validateAuth(request);
    if (!auth.valid) {
        return NextResponse.json({
            error: 'Unauthorized',
            message: auth.error
        }, { status: 401 });
    }

    // Check if this is an SSE request
    const accept = request.headers.get('accept');
    if (accept?.includes('text/event-stream')) {
        // For now, return a simple SSE stream for notifications
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            start(controller) {
                // Send initial comment to establish connection
                controller.enqueue(encoder.encode(': connected\n\n'));
                
                // Keep connection alive with periodic ping
                const intervalId = setInterval(() => {
                    controller.enqueue(encoder.encode(': ping\n\n'));
                }, 30000);
                
                // Cleanup on close
                request.signal.addEventListener('abort', () => {
                    clearInterval(intervalId);
                    controller.close();
                });
            }
        });
        
        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    }

    // Regular health check
    return NextResponse.json({
        status: 'ok',
        message: 'Agentico MCP Knowledge Server',
        version: SERVER_INFO.version,
        protocol: 'JSON-RPC 2.0',
        endpoint: 'https://www.agentico.com.au/api/mcp',
        knowledgeFiles: listKnowledgeFiles(),
        tools: TOOLS.map(t => t.name),
        resources: getResources().map(r => r.uri)
    });
}

// POST endpoint - for JSON-RPC 2.0 requests
export async function POST(request: NextRequest) {
    // Validate authentication
    const auth = validateAuth(request);
    if (!auth.valid) {
        return NextResponse.json({
            jsonrpc: '2.0',
            id: null,
            error: {
                code: -32000,
                message: 'Unauthorized: ' + auth.error
            }
        }, { status: 401 });
    }

    try {
        const body = await request.json();

        // Handle batch requests
        if (Array.isArray(body)) {
            const responses = body.map(req => handleJsonRpcRequest(req));
            return NextResponse.json(responses);
        }

        // Handle single request
        const response = handleJsonRpcRequest(body);
        return NextResponse.json(response);

    } catch (error) {
        console.error('MCP POST Error:', error);
        return NextResponse.json({
            jsonrpc: '2.0',
            id: null,
            error: {
                code: -32700,
                message: 'Parse error'
            }
        }, { status: 400 });
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

