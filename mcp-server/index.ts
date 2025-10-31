import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize MCP Server
const server = new McpServer({
    name: 'agentico-knowledge-server',
    version: '1.0.0'
});

// Path to the knowledge base
const KNOWLEDGE_BASE_PATH = path.join(__dirname, '..', 'public', 'mcp', 'example-data');

// Helper function to read JSON files
function readKnowledgeFile(filename: string): any {
    const filePath = path.join(KNOWLEDGE_BASE_PATH, filename);
    if (!fs.existsSync(filePath)) {
        throw new Error(`Knowledge file not found: ${filename}`);
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
}

// Helper function to list all knowledge files
function listKnowledgeFiles(): string[] {
    if (!fs.existsSync(KNOWLEDGE_BASE_PATH)) {
        return [];
    }
    return fs.readdirSync(KNOWLEDGE_BASE_PATH).filter(file => file.endsWith('.json'));
}

// Helper function to search across all knowledge bases
function searchKnowledgeBase(query: string, category?: string): any[] {
    const files = listKnowledgeFiles();
    const results: any[] = [];
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
        }
    }

    // Sort by relevance
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    return results;
}

// Helper function to extract specific data from knowledge base
function extractDataByPath(filename: string, jsonPath: string): any {
    const data = readKnowledgeFile(filename);
    const pathParts = jsonPath.split('.');
    
    let current = data;
    for (const part of pathParts) {
        if (current === null || current === undefined) {
            return null;
        }
        
        // Handle array indexing
        const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
        if (arrayMatch) {
            const [, key, index] = arrayMatch;
            current = current[key]?.[parseInt(index)];
        } else {
            current = current[part];
        }
    }
    
    return current;
}

// Register Tool: Search Knowledge Base
server.registerTool(
    'search_knowledge',
    {
        title: 'Search Knowledge Base',
        description: 'Search across all knowledge base files for relevant information. Returns matching data sorted by relevance.',
        inputSchema: {
            query: z.string().describe('Search query terms'),
            maxResults: z.number().optional().default(5).describe('Maximum number of results to return')
        },
        outputSchema: {
            results: z.array(z.object({
                source: z.string(),
                relevanceScore: z.number(),
                matchedTerms: z.number(),
                data: z.any()
            })),
            totalFound: z.number()
        }
    },
    async ({ query, maxResults = 5 }) => {
        const results = searchKnowledgeBase(query);
        const limitedResults = results.slice(0, maxResults);
        
        const output = {
            results: limitedResults,
            totalFound: results.length
        };
        
        return {
            content: [{ 
                type: 'text', 
                text: `Found ${results.length} matching knowledge base entries.\n\n${JSON.stringify(limitedResults, null, 2)}` 
            }],
            structuredContent: output
        };
    }
);

// Register Tool: Get Knowledge File
server.registerTool(
    'get_knowledge_file',
    {
        title: 'Get Knowledge File',
        description: 'Retrieve complete contents of a specific knowledge base file.',
        inputSchema: {
            filename: z.string().describe('Name of the knowledge file (e.g., "recruiting_company_knowledge.json")')
        },
        outputSchema: {
            filename: z.string(),
            data: z.any()
        }
    },
    async ({ filename }) => {
        const data = readKnowledgeFile(filename);
        
        const output = {
            filename,
            data
        };
        
        return {
            content: [{ 
                type: 'text', 
                text: `Knowledge file: ${filename}\n\n${JSON.stringify(data, null, 2)}` 
            }],
            structuredContent: output
        };
    }
);

// Register Tool: List Knowledge Files
server.registerTool(
    'list_knowledge_files',
    {
        title: 'List Knowledge Files',
        description: 'List all available knowledge base files.',
        inputSchema: {},
        outputSchema: {
            files: z.array(z.string()),
            count: z.number()
        }
    },
    async () => {
        const files = listKnowledgeFiles();
        
        const output = {
            files,
            count: files.length
        };
        
        return {
            content: [{ 
                type: 'text', 
                text: `Available knowledge files (${files.length}):\n${files.map(f => `- ${f}`).join('\n')}` 
            }],
            structuredContent: output
        };
    }
);

// Register Tool: Extract Specific Data
server.registerTool(
    'extract_data',
    {
        title: 'Extract Specific Data',
        description: 'Extract specific data from a knowledge file using a JSON path (e.g., "company.name" or "clients[0].company_name").',
        inputSchema: {
            filename: z.string().describe('Name of the knowledge file'),
            path: z.string().describe('JSON path to the data (e.g., "company.name" or "clients[0]")')
        },
        outputSchema: {
            filename: z.string(),
            path: z.string(),
            data: z.any()
        }
    },
    async ({ filename, path: jsonPath }) => {
        const data = extractDataByPath(filename, jsonPath);
        
        const output = {
            filename,
            path: jsonPath,
            data
        };
        
        return {
            content: [{ 
                type: 'text', 
                text: `Extracted from ${filename} at path "${jsonPath}":\n\n${JSON.stringify(data, null, 2)}` 
            }],
            structuredContent: output
        };
    }
);

// Register Tool: Get Company Information
server.registerTool(
    'get_company_info',
    {
        title: 'Get Company Information',
        description: 'Get basic company information from any knowledge base file.',
        inputSchema: {
            filename: z.string().optional().describe('Specific knowledge file to query, or omit to search all files')
        },
        outputSchema: {
            companies: z.array(z.object({
                source: z.string(),
                company: z.any()
            }))
        }
    },
    async ({ filename }) => {
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
            }
        }
        
        const output = { companies };
        
        return {
            content: [{ 
                type: 'text', 
                text: `Found ${companies.length} company information entries:\n\n${JSON.stringify(companies, null, 2)}` 
            }],
            structuredContent: output
        };
    }
);

// Register Resources for direct file access
for (const file of listKnowledgeFiles()) {
    const resourceName = file.replace('.json', '');
    
    server.registerResource(
        resourceName,
        new ResourceTemplate(`knowledge://${resourceName}`, { list: undefined }),
        {
            title: `${resourceName} Knowledge Base`,
            description: `Direct access to ${file} knowledge base`
        },
        async (uri) => ({
            contents: [
                {
                    uri: uri.href,
                    mimeType: 'application/json',
                    text: JSON.stringify(readKnowledgeFile(file), null, 2)
                }
            ]
        })
    );
}

// Setup Express HTTP server
const app = express();
app.use(express.json());

// Store active transports
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        server: 'agentico-knowledge-server',
        version: '1.0.0',
        knowledgeFiles: listKnowledgeFiles()
    });
});

// MCP endpoint - POST for client-to-server communication
app.post('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
        // Reuse existing transport
        transport = transports[sessionId];
    } else if (!sessionId) {
        // New session
        transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            onsessioninitialized: (newSessionId) => {
                transports[newSessionId] = transport;
            },
            enableDnsRebindingProtection: false  // For local development
        });

        // Clean up on close
        transport.onclose = () => {
            if (transport.sessionId) {
                delete transports[transport.sessionId];
            }
        };

        await server.connect(transport);
    } else {
        res.status(400).json({
            jsonrpc: '2.0',
            error: {
                code: -32000,
                message: 'Invalid session'
            },
            id: null
        });
        return;
    }

    await transport.handleRequest(req, res, req.body);
});

// MCP endpoint - GET for server-to-client notifications via SSE
app.get('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    
    if (!sessionId || !transports[sessionId]) {
        res.status(400).send('Invalid or missing session ID');
        return;
    }

    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
});

// MCP endpoint - DELETE for session termination
app.delete('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    
    if (!sessionId || !transports[sessionId]) {
        res.status(400).send('Invalid or missing session ID');
        return;
    }

    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
});

