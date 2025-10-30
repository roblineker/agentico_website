# ElevenLabs MCP Integration

This directory contains the system prompt and knowledge base for the ElevenLabs conversational AI agent (Alex the receptionist).

## Overview

Instead of storing the system prompt directly in ElevenLabs, we manage it here in our codebase and expose it via our MCP (Model Context Protocol) server. This provides:

- **Version Control**: Track changes to the system prompt through git
- **Centralized Management**: Update the prompt in one place
- **Dynamic Updates**: ElevenLabs agents fetch the latest prompt via MCP
- **Knowledge Base Access**: Agents can access business-specific knowledge during conversations

## Files

- `elevenlabs_system_prompt_updated.md` - The system prompt for Alex (the AI receptionist)
- `example-data/` - Directory containing business knowledge bases (JSON files)

## MCP Server Endpoints

Your MCP server is available at: `https://www.agentico.com.au/api/mcp`

### Available Resources

1. **System Prompt**
   - URI: `prompt://elevenlabs-system-prompt`
   - Type: `text/markdown`
   - Description: The complete system prompt for Alex the receptionist

2. **Knowledge Base Files**
   - URI Pattern: `knowledge://{filename}` (without .json extension)
   - Type: `application/json`
   - Examples:
     - `knowledge://plumber_knowledge`
     - `knowledge://lawfirm_knowledge`
     - `knowledge://realestate_knowledge`

### Available Tools

1. **get_system_prompt** - Retrieve the ElevenLabs system prompt
2. **search_knowledge** - Search across all knowledge base files
3. **get_knowledge_file** - Get a specific knowledge base file
4. **list_knowledge_files** - List all available knowledge files
5. **extract_data** - Extract specific data using JSON path
6. **get_company_info** - Get company information from knowledge bases

## Setting Up in ElevenLabs

### Step 1: Add MCP Server Integration

1. Go to your ElevenLabs dashboard
2. Navigate to **Settings** → **Integrations** → **MCP Servers**
3. Click **Add Custom MCP Server**
4. Configure:
   - **Name**: `Agentico Knowledge Server`
   - **Description**: `MCP server providing system prompts and business knowledge bases`
   - **Server URL**: `https://www.agentico.com.au/api/mcp`
   - **Secret Token**: Your `MCP_API_SECRET` (get this from Vercel environment variables)
   - **OR HTTP Headers**: 
     ```json
     {
       "Authorization": "Bearer YOUR_MCP_API_SECRET_HERE"
     }
     ```

### Step 2: Configure Your Agent

When creating or updating your ElevenLabs agent:

#### Option A: Use MCP Resource (Recommended)

In your agent configuration, you can reference the MCP resource directly:

```json
{
  "agent": {
    "prompt": {
      "prompt": "{{mcp://prompt://elevenlabs-system-prompt}}"
    }
  }
}
```

#### Option B: Use MCP Tool in Agent Prompt

Configure your agent to call the `get_system_prompt` tool on initialization, or reference it in the agent's configuration.

### Step 3: Enable Knowledge Base Access

In your agent's system prompt (the markdown file), the agent can use the `searchKnowledgeBase` tool. Make sure this tool is available to your agent by:

1. Ensuring the MCP server connection is active
2. Adding the `search_knowledge` tool to your agent's available tools
3. The agent will automatically use it during demo conversations

## Usage Examples

### For Developers (Testing the MCP Server)

Test the MCP server endpoints (replace `YOUR_API_SECRET` with your actual `MCP_API_SECRET`):

```bash
# Set your API secret
export MCP_API_SECRET="your-secret-here"

# Health check
curl https://www.agentico.com.au/api/mcp \
  -H "Authorization: Bearer $MCP_API_SECRET"

# List resources (JSON-RPC 2.0)
curl -X POST https://www.agentico.com.au/api/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MCP_API_SECRET" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "resources/list"
  }'

# Get system prompt (JSON-RPC 2.0)
curl -X POST https://www.agentico.com.au/api/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MCP_API_SECRET" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "resources/read",
    "params": {
      "uri": "prompt://elevenlabs-system-prompt"
    }
  }'

# Search knowledge base (JSON-RPC 2.0)
curl -X POST https://www.agentico.com.au/api/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MCP_API_SECRET" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "search_knowledge",
      "arguments": {
        "query": "plumber",
        "maxResults": 3
      }
    }
  }'
```

### For ElevenLabs Agent (During Conversation)

The agent can call these tools during conversations:

- `search_knowledge` - When running demos to fetch business-specific data
- `get_knowledge_file` - To access a specific business's complete knowledge base
- `list_knowledge_files` - To see what business types are available

## Updating the System Prompt

To update Alex's system prompt:

1. Edit `elevenlabs_system_prompt_updated.md` in this directory
2. Commit and push your changes
3. Deploy to production
4. ElevenLabs will automatically fetch the updated prompt on the next agent initialization

No need to manually update anything in the ElevenLabs UI!

## Adding New Knowledge Bases

To add a new business knowledge base:

1. Create a new JSON file in `example-data/` directory
2. Follow the naming pattern: `{business_type}_knowledge.json`
3. Use the same structure as existing files (company info, clients, jobs, etc.)
4. The file will automatically be exposed as an MCP resource
5. URI will be: `knowledge://{business_type}_knowledge`

## Benefits of This Approach

1. **Single Source of Truth**: The prompt lives in your codebase, not scattered across UIs
2. **Version History**: Every change is tracked in git with commit messages
3. **Easy Rollback**: Can revert to previous prompt versions if needed
4. **Testing**: Can test prompt changes locally before deploying
5. **Documentation**: Keep prompt and knowledge base documentation together
6. **Team Collaboration**: Use pull requests for prompt improvements
7. **Environment Management**: Can have different prompts for dev/staging/production

## Security

### Authentication

Your MCP server **IS SECURED** with API key authentication:

- **Environment Variable**: `MCP_API_SECRET`
- **Required Header**: `Authorization: Bearer YOUR_API_SECRET` (or just `YOUR_API_SECRET`)
- **Configured in**: Vercel environment variables and local `.env`
- **Behavior**: If `MCP_API_SECRET` is not set, authentication is disabled (development mode with warning)

### Setting Up Authentication in ElevenLabs

When adding the MCP server to ElevenLabs:

1. Go to Settings → Integrations → MCP Servers
2. Add Custom MCP Server
3. Fill in:
   - **Server URL**: `https://www.agentico.com.au/api/mcp`
   - **Secret Token**: Your `MCP_API_SECRET` value (from Vercel environment variables)
   - Or use **HTTP Headers**:
     ```json
     {
       "Authorization": "Bearer YOUR_API_SECRET_HERE"
     }
     ```

### Security Best Practices

✅ **Implemented:**
- API key authentication on all endpoints
- Environment variable for secret storage
- Support for Bearer token format
- Development mode warning when secret is missing

⚠️ **Recommended:**
- Rotate API secret periodically
- Use different secrets for dev/staging/prod
- Monitor access logs for unusual activity
- Consider rate limiting for production

🔐 **Your Data:**
- System prompt: Not sensitive, but access controlled
- Knowledge base: Contains demo business data, access controlled
- All requests require valid API secret

## Troubleshooting

**ElevenLabs can't connect to MCP server:**
- Verify the server URL is correct
- Check that the API route is deployed and accessible
- Test the health check endpoint: `GET https://www.agentico.com.au/api/mcp`

**Agent not using the latest prompt:**
- ElevenLabs may cache prompts - try recreating the agent
- Verify the MCP connection is active in ElevenLabs dashboard
- Check the server logs for any errors

**Knowledge base searches return no results:**
- Verify knowledge files are in the correct directory
- Check file naming (must end with `.json`)
- Test the search endpoint directly via curl

## Reference

- [ElevenLabs MCP Documentation](https://elevenlabs.io/docs/conversational-ai/customization/mcp)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)

