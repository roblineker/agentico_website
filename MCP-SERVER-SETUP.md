# Quick Start: MCP Server for ElevenLabs

## 🎯 What This Does

This MCP (Model Context Protocol) server lets ElevenLabs query your knowledge base files in real-time. Update any JSON file in `public/mcp/example-data/` and ElevenLabs will automatically access the latest data.

## ⚡ Quick Start (Windows)

1. **Navigate to the MCP server folder:**
   ```cmd
   cd mcp-server
   ```

2. **Install dependencies** (first time only):
   ```cmd
   npm install
   ```

3. **Start the server** - just double-click:
   ```
   start.bat
   ```

   Or run manually:
   ```cmd
   npm run build
   npm start
   ```

4. **Verify it's running:**
   - Open browser: `http://localhost:3001/health`
   - You should see: `{"status":"ok",...}`

## 🔗 Connect to ElevenLabs

In your ElevenLabs agent settings:

- **MCP Server URL**: `http://localhost:3001/mcp`
- **Protocol**: HTTP MCP
- **Enable Session Management**: Yes

## 🛠️ Available Tools for ElevenLabs

Once connected, your ElevenLabs agent can use these tools:

1. **search_knowledge** - Search all knowledge files
2. **get_knowledge_file** - Get complete file contents
3. **list_knowledge_files** - See all available files
4. **extract_data** - Get specific data using JSON paths
5. **get_company_info** - Get company details from any file

## 📁 Adding New Knowledge Files

1. Add your `.json` file to: `public/mcp/example-data/`
2. Restart the MCP server
3. Done! ElevenLabs can now query it

## 🔍 Example Queries for ElevenLabs

- "What are our recruiting clients in Brisbane?"
- "Get the company contact information"
- "Search for active job positions"
- "What services does the company offer?"

## 📖 Full Documentation

See `mcp-server/README.md` for complete details.

---

**Port**: 3001  
**Endpoint**: http://localhost:3001/mcp  
**Health Check**: http://localhost:3001/health

