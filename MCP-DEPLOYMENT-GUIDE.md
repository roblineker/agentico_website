# MCP Server Deployment Guide

## 🌐 Production Deployment (What You Actually Need!)

The MCP server is now deployed as a Next.js API route, accessible at:

**Production URL**: `https://www.agentico.com.au/api/mcp`

No separate server needed - it's part of your Next.js deployment!

## 🔗 Connecting ElevenLabs (Production)

### In your ElevenLabs Agent Configuration:

**Option 1: Direct API Calls (Recommended)**

Configure ElevenLabs to make HTTP requests to:
```
https://www.agentico.com.au/api/mcp
```

**Request Format:**
```json
POST https://www.agentico.com.au/api/mcp
Content-Type: application/json

{
  "tool": "search_knowledge",
  "params": {
    "query": "recruiting clients Brisbane",
    "maxResults": 3
  }
}
```

---

## 🛠️ Available Tools

### 1. **search_knowledge**
Search across all knowledge base files.

**Request:**
```json
{
  "tool": "search_knowledge",
  "params": {
    "query": "your search terms",
    "maxResults": 5
  }
}
```

**Response:**
```json
{
  "success": true,
  "tool": "search_knowledge",
  "result": {
    "results": [
      {
        "source": "recruiting_company_knowledge.json",
        "relevanceScore": 0.85,
        "matchedTerms": 3,
        "data": { ... }
      }
    ],
    "totalFound": 5,
    "message": "Found 5 matching knowledge base entries."
  }
}
```

---

### 2. **get_knowledge_file**
Get complete contents of a specific file.

**Request:**
```json
{
  "tool": "get_knowledge_file",
  "params": {
    "filename": "recruiting_company_knowledge.json"
  }
}
```

---

### 3. **list_knowledge_files**
List all available knowledge files.

**Request:**
```json
{
  "tool": "list_knowledge_files",
  "params": {}
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "files": [
      "recruiting_company_knowledge.json",
      "hair_salon_knowledge.json",
      "electrical_company_knowledge.json"
    ],
    "count": 3,
    "message": "Available knowledge files: 3"
  }
}
```

---

### 4. **extract_data**
Extract specific data using JSON path.

**Request:**
```json
{
  "tool": "extract_data",
  "params": {
    "filename": "recruiting_company_knowledge.json",
    "path": "company.name"
  }
}
```

**Example Paths:**
- `company.name` - Get company name
- `company.phone` - Get company phone
- `clients[0].company_name` - Get first client's company name
- `integrations.ats` - Get ATS system name

---

### 5. **get_company_info**
Get company information from all files or a specific file.

**Request (all files):**
```json
{
  "tool": "get_company_info",
  "params": {}
}
```

**Request (specific file):**
```json
{
  "tool": "get_company_info",
  "params": {
    "filename": "recruiting_company_knowledge.json"
  }
}
```

---

## 🧪 Testing the Deployment

### Health Check
Visit in browser or curl:
```bash
curl https://www.agentico.com.au/api/mcp
```

Or simply visit: https://www.agentico.com.au/api/mcp

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Agentico MCP Knowledge Server",
  "version": "1.0.0",
  "endpoint": "https://www.agentico.com.au/api/mcp",
  "knowledgeFiles": ["..."],
  "availableTools": ["search_knowledge", "get_knowledge_file", ...]
}
```

### Test a Tool
```bash
curl -X POST https://www.agentico.com.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "list_knowledge_files",
    "params": {}
  }'
```

---

## 📝 ElevenLabs Integration Examples

### Example 1: Search for Information
When a user asks: *"What are the recruiting clients in Brisbane?"*

ElevenLabs makes this request:
```json
POST https://www.agentico.com.au/api/mcp
{
  "tool": "search_knowledge",
  "params": {
    "query": "recruiting clients Brisbane",
    "maxResults": 5
  }
}
```

### Example 2: Get Company Details
When a user asks: *"What's the company's contact information?"*

```json
POST https://www.agentico.com.au/api/mcp
{
  "tool": "get_company_info",
  "params": {}
}
```

### Example 3: Extract Specific Data
When a user asks: *"What's the company phone number?"*

```json
POST https://www.agentico.com.au/api/mcp
{
  "tool": "extract_data",
  "params": {
    "filename": "recruiting_company_knowledge.json",
    "path": "company.phone"
  }
}
```

---

## 📁 Adding New Knowledge Files

1. Add your `.json` file to: `public/mcp/example-data/your-file.json`

2. Commit and deploy (or just save if using Vercel auto-deploy)

3. The new file is automatically available - no configuration needed!

4. Verify it's available:
```bash
curl https://www.agentico.com.au/api/mcp
```

---

## 🔒 Security (IMPORTANT!)

### Authentication is REQUIRED:

The MCP API uses Bearer token authentication to protect your knowledge base.

### Setup Instructions:

#### 1. **Local Development:**

Your `.env.local` file already contains:
```bash
MCP_API_SECRET=uTAG7qAwCcV5jPo/8vRYupxNJPnzOt5+KzmEQ3ERd8U=
```

#### 2. **Production (Vercel):**

Add the environment variable in Vercel:
1. Go to: **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**
2. Add new variable:
   - **Name**: `MCP_API_SECRET`
   - **Value**: `uTAG7qAwCcV5jPo/8vRYupxNJPnzOt5+KzmEQ3ERd8U=`
   - **Environments**: Production, Preview, Development
3. **Redeploy** your application

### How to Use with Authentication:

All requests must include the `Authorization` header:

```bash
curl -X POST https://www.agentico.com.au/api/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer uTAG7qAwCcV5jPo/8vRYupxNJPnzOt5+KzmEQ3ERd8U=" \
  -d '{"tool": "list_knowledge_files", "params": {}}'
```

### ElevenLabs Configuration:

When configuring ElevenLabs to use your MCP server:
- **URL**: `https://www.agentico.com.au/api/mcp`
- **Headers**: Add custom header
  - **Key**: `Authorization`
  - **Value**: `Bearer uTAG7qAwCcV5jPo/8vRYupxNJPnzOt5+KzmEQ3ERd8U=`

### Generate a New Secret (if needed):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**⚠️ IMPORTANT**: Never commit `.env.local` to git. It's already in `.gitignore`.

---

## 🚀 Deployment Checklist

- [x] MCP API route created at `/api/mcp`
- [ ] Test locally: `npm run dev` then visit `http://localhost:3000/api/mcp`
- [ ] Deploy to production (Vercel auto-deploys on git push)
- [ ] Test production: Visit `https://www.agentico.com.au/api/mcp`
- [ ] Configure ElevenLabs to use `https://www.agentico.com.au/api/mcp`
- [ ] Test with ElevenLabs agent
- [ ] Add knowledge files to `public/mcp/example-data/`

---

## 💡 Tips

1. **Knowledge Files Format**: Keep them as valid JSON
2. **File Updates**: Just redeploy - files are read on each request
3. **Performance**: Consider caching if you have many large files
4. **Monitoring**: Check Vercel logs for API usage and errors

---

## 🆘 Troubleshooting

### API Returns 404
- Ensure route file is at `src/app/api/mcp/route.ts`
- Redeploy your Next.js app

### Knowledge Files Not Found
- Check files are in `public/mcp/example-data/`
- Verify file names match exactly (case-sensitive)
- Check file permissions

### ElevenLabs Can't Connect
- Verify URL is `https://www.agentico.com.au/api/mcp` (not localhost)
- Check CORS headers are set (already configured in route.ts)
- Test the endpoint directly first

---

**Built with ❤️ by Agentico**

Production URL: https://www.agentico.com.au/api/mcp

