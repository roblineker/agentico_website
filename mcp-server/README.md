# Agentico MCP Knowledge Server

A Model Context Protocol (MCP) server that allows ElevenLabs (and other MCP clients) to query your knowledge base files dynamically. Update your knowledge files and the server will automatically provide the latest data.

## 🚀 Features

- **Dynamic Knowledge Base Access**: Query JSON knowledge files in real-time
- **Smart Search**: Search across all knowledge bases with relevance scoring
- **Flexible Data Extraction**: Extract specific data using JSON paths
- **Company Information**: Quick access to company details across all knowledge bases
- **RESTful API**: HTTP-based MCP server compatible with ElevenLabs and other clients
- **Session Management**: Proper stateful session handling for multiple clients

## 📋 Available Tools

The MCP server provides the following tools that ElevenLabs can use:

### 1. `search_knowledge`
Search across all knowledge base files for relevant information.

**Input:**
- `query` (string): Search query terms
- `maxResults` (number, optional): Maximum results to return (default: 5)

**Example:**
```json
{
  "query": "recruiting clients Brisbane",
  "maxResults": 3
}
```

### 2. `get_knowledge_file`
Retrieve complete contents of a specific knowledge base file.

**Input:**
- `filename` (string): Name of the knowledge file (e.g., "recruiting_company_knowledge.json")

**Example:**
```json
{
  "filename": "recruiting_company_knowledge.json"
}
```

### 3. `list_knowledge_files`
List all available knowledge base files.

**Input:** None

### 4. `extract_data`
Extract specific data from a knowledge file using a JSON path.

**Input:**
- `filename` (string): Name of the knowledge file
- `path` (string): JSON path (e.g., "company.name" or "clients[0].company_name")

**Example:**
```json
{
  "filename": "recruiting_company_knowledge.json",
  "path": "company.name"
}
```

### 5. `get_company_info`
Get basic company information from any knowledge base file.

**Input:**
- `filename` (string, optional): Specific file to query, or omit to search all files

## 📁 Knowledge Base Structure

Place your knowledge JSON files in:
```
public/mcp/example-data/
```

The server automatically discovers and indexes all `.json` files in this directory.

### Current Knowledge Files:
- `recruiting_company_knowledge.json` - Recruiting company data
- `hair_salon_knowledge.json` - Hair salon data
- `electrical_company_knowledge.json` - Electrical company data

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the MCP server directory:
```bash
cd mcp-server
```

2. Install dependencies (they should already be installed in the parent project):
```bash
npm install
```

### Windows Users

Simply double-click `start.bat` to build and run the server!

Or manually:
```cmd
npm run build
npm start
```

### Mac/Linux Users

```bash
npm run build
npm start
```

## 🏃 Running the Server

### Option 1: Windows Batch File (Easiest)
Double-click `start.bat`

### Option 2: Command Line

**Build once:**
```bash
npm run build
```

**Start server:**
```bash
npm start
```

**Development mode (rebuild + start):**
```bash
npm run dev
```

### Server will start on:
- **MCP Endpoint**: `http://localhost:3001/mcp`
- **Health Check**: `http://localhost:3001/health`

## 🔗 Connecting to ElevenLabs

### Configuration

1. **Start the MCP Server** (using `start.bat` or `npm start`)

2. **Configure ElevenLabs Agent:**
   - In your ElevenLabs agent configuration
   - Add a new MCP server connection
   - Use the following settings:
     - **Server URL**: `http://localhost:3001/mcp`
     - **Protocol**: MCP over HTTP
     - **Session Management**: Enabled

3. **Available Tools in ElevenLabs:**
   Once connected, ElevenLabs will have access to all 5 tools:
   - `search_knowledge`
   - `get_knowledge_file`
   - `list_knowledge_files`
   - `extract_data`
   - `get_company_info`

### Example ElevenLabs Queries

Your ElevenLabs agent can now answer questions like:

- "What are the client details for TechFlow Solutions?"
- "Search for all recruiting candidates in Brisbane"
- "Get the company information from the recruiting knowledge base"
- "What services does the company offer?"
- "Find all active job roles"

## 📝 Adding New Knowledge Files

1. Add your `.json` file to:
   ```
   public/mcp/example-data/your-new-file.json
   ```

2. Restart the MCP server

3. The new file will automatically be:
   - Indexed for searching
   - Available as a resource
   - Queryable through all tools

## 🧪 Testing the Server

### Health Check
Visit in browser or curl:
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "server": "agentico-knowledge-server",
  "version": "1.0.0",
  "knowledgeFiles": ["recruiting_company_knowledge.json", ...]
}
```

### Testing with curl

**List Knowledge Files:**
```bash
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "list_knowledge_files",
      "arguments": {}
    },
    "id": 1
  }'
```

## 🏗️ Architecture

The server follows MCP best practices from the Model Context Protocol SDK:

- **McpServer**: Core MCP server implementation
- **StreamableHTTPServerTransport**: HTTP transport with session management
- **Tools**: 5 registered tools for querying knowledge
- **Resources**: Dynamic resources for each knowledge file
- **Session Management**: Stateful sessions for multiple concurrent clients

## 🔒 Security Notes

- This server is designed for **local development** and **trusted networks**
- DNS rebinding protection is disabled for localhost development
- For production use, enable proper security measures:
  - Enable DNS rebinding protection
  - Add authentication/authorization
  - Use HTTPS
  - Restrict allowed hosts

## 🐛 Troubleshooting

### Server won't start
- Check that port 3001 is available
- Verify Node.js version is 18+
- Ensure dependencies are installed: `npm install`

### Knowledge files not found
- Verify files are in `public/mcp/example-data/`
- Check file names end with `.json`
- Ensure valid JSON format

### ElevenLabs can't connect
- Verify server is running (check health endpoint)
- Check firewall settings allow localhost connections
- Ensure correct URL: `http://localhost:3001/mcp`

## 📚 Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [ElevenLabs Documentation](https://elevenlabs.io/docs)

## 🤝 Support

For issues or questions about this MCP server, please contact the Agentico team.

---

**Built with ❤️ by Agentico**

