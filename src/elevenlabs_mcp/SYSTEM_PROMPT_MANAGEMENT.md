# System Prompt Management Strategy

## Overview

The ElevenLabs system prompt for Alex (the AI receptionist) is now managed **directly in the ElevenLabs dashboard** rather than via the MCP server.

## Why This Change?

1. **Immediate Updates**: Changes to the prompt are instantly available for testing
2. **Native ElevenLabs Features**: Better integration with ElevenLabs UI features
3. **Required Field**: ElevenLabs requires a system prompt in the agent configuration
4. **Simpler Architecture**: MCP focuses on what it does best - dynamic data access

## Current Setup

### System Prompt Location
- **Primary**: ElevenLabs Dashboard (agent configuration)
- **Version Control**: `elevenlabs_system_prompt_updated.md` (this directory)

### MCP Server Role
The MCP server at `https://www.agentico.com.au/api/mcp` now provides:
- ✅ Knowledge base access via `search_knowledge` tool
- ✅ Business demo data for conversations
- ✅ Dynamic data extraction tools
- ❌ ~~System prompt delivery~~ (removed)

## How to Update the System Prompt

### Step 1: Edit the Markdown File (Version Control)
```bash
# Edit the file
code src/elevenlabs_mcp/elevenlabs_system_prompt_updated.md

# Commit changes
git add src/elevenlabs_mcp/elevenlabs_system_prompt_updated.md
git commit -m "Update Alex system prompt: [description of changes]"
git push
```

### Step 2: Update ElevenLabs Dashboard
1. Open the markdown file: `elevenlabs_system_prompt_updated.md`
2. Copy the **entire contents** (Ctrl+A, Ctrl+C)
3. Go to [ElevenLabs Dashboard](https://elevenlabs.io/app/conversational-ai)
4. Select your agent (Alex)
5. Navigate to the System Prompt field
6. Paste the contents (Ctrl+V)
7. Click **Save Changes**

### Step 3: Test
1. Test the agent in the ElevenLabs testing interface
2. Verify changes are working as expected
3. Deploy to production when ready

## Available MCP Tools

The agent can use these MCP tools during conversations:

| Tool | Description | Use Case |
|------|-------------|----------|
| `search_knowledge` | Search across all knowledge bases | Finding relevant business data during demos |
| `get_knowledge_file` | Get a specific knowledge file | Accessing complete business context |
| `list_knowledge_files` | List available knowledge files | Discovering what business types exist |
| `extract_data` | Extract data by JSON path | Getting specific fields from knowledge |
| `get_company_info` | Get company information | Quick access to company details |

## What Was Removed

### From `src/app/api/mcp/route.ts`:
- ❌ `SYSTEM_PROMPT_PATH` constant
- ❌ `readSystemPrompt()` function
- ❌ `get_system_prompt` tool
- ❌ System prompt resource (`prompt://elevenlabs-system-prompt`)
- ❌ System prompt handling in `handleToolCall()`
- ❌ System prompt handling in `handleResourceRead()`

### MCP Resources (Before vs After):

**Before:**
```
prompt://elevenlabs-system-prompt
knowledge://plumber_knowledge
knowledge://lawfirm_knowledge
knowledge://realestate_knowledge
```

**After:**
```
knowledge://plumber_knowledge
knowledge://lawfirm_knowledge
knowledge://realestate_knowledge
```

## Benefits

✅ **Immediate Testing**: No deployment needed for prompt changes
✅ **Simpler MCP Server**: Focused on data access only
✅ **Better UX**: Use ElevenLabs native prompt editing features
✅ **Version Control**: Still tracked in git for audit trail
✅ **Team Collaboration**: Git workflow for prompt improvements
✅ **Clear Separation**: Prompt in ElevenLabs, data in MCP

## Troubleshooting

### Prompt not updating in agent
- Make sure you clicked "Save Changes" in ElevenLabs dashboard
- Clear browser cache and reload
- Verify you copied the entire prompt content

### Agent can't access knowledge bases
- Verify MCP server is connected in ElevenLabs
- Check MCP server is accessible: `curl https://www.agentico.com.au/api/mcp`
- Test the `search_knowledge` tool directly

### Need to rollback prompt
1. Find the previous version in git: `git log -- src/elevenlabs_mcp/elevenlabs_system_prompt_updated.md`
2. View the old version: `git show <commit-hash>:src/elevenlabs_mcp/elevenlabs_system_prompt_updated.md`
3. Copy the old prompt and paste into ElevenLabs dashboard

## Reference Files

- **System Prompt**: `src/elevenlabs_mcp/elevenlabs_system_prompt_updated.md`
- **MCP Server**: `src/app/api/mcp/route.ts`
- **Documentation**: `src/elevenlabs_mcp/README.md`
- **This Guide**: `src/elevenlabs_mcp/SYSTEM_PROMPT_MANAGEMENT.md`

---

*Last Updated: October 30, 2025*

