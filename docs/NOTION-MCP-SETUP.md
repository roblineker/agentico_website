# Notion MCP (Model Context Protocol) Setup

This guide explains how to connect to Notion via MCP in Cursor, allowing the AI to directly access and interact with your Notion workspace.

## What is Notion MCP?

Notion MCP is a Model Context Protocol server that provides:
- Direct access to Notion databases and pages
- Ability to query and search Notion content
- Real-time data access for the AI assistant
- Secure, authenticated connection to your Notion workspace

## Configuration File

The MCP configuration is in `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "Notion_Agentico": {
      "url": "https://mcp.notion.com/mcp",
      "headers": {
        "Authorization": "Bearer ${NOTION_API_TOKEN}"
      }
    }
  }
}
```

## Setup Instructions

### 1. Ensure You Have a Notion Integration Token

You should already have this from the main Notion integration setup:

```env
NOTION_API_TOKEN=secret_your_token_here
```

If not, follow the steps in [NOTION-SETUP.md](../NOTION-SETUP.md) to create one.

### 2. Set Environment Variable

The MCP configuration uses the `${NOTION_API_TOKEN}` environment variable.

#### On Windows (PowerShell)
```powershell
[Environment]::SetEnvironmentVariable("NOTION_API_TOKEN", "secret_your_token_here", "User")
```

Then restart Cursor for the change to take effect.

#### On Windows (Command Prompt)
```cmd
setx NOTION_API_TOKEN "secret_your_token_here"
```

Then restart Cursor.

#### On macOS/Linux
Add to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
export NOTION_API_TOKEN="secret_your_token_here"
```

Then restart your shell and Cursor.

### 3. Verify MCP Connection

After restarting Cursor:

1. Open the Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Look for MCP-related commands
3. The AI should now have access to your Notion workspace

## What Can the AI Do with MCP?

Once connected, the AI can:

### ✅ Read Operations
- Search across all your Notion pages and databases
- Read page content and properties
- Query database entries
- Retrieve specific information

### ✅ Write Operations
- Create new pages
- Update existing pages
- Add content to databases
- Modify page properties

### ✅ Search and Discovery
- Find databases by name or content
- Search for specific information
- Navigate page hierarchies
- Discover workspace structure

## Example Use Cases

### 1. Database Analysis
**You**: "What databases do we have in Notion?"

**AI** (via MCP): Searches and lists all databases you have access to.

### 2. Content Retrieval
**You**: "Show me the latest contact form submissions"

**AI** (via MCP): Queries your contact form database and displays recent entries.

### 3. Data Entry
**You**: "Add a note to the latest contact about following up tomorrow"

**AI** (via MCP): Updates the Notion page with your note.

### 4. Automated Testing
**You**: "Check if the contact form integration is working by looking at recent submissions"

**AI** (via MCP): Accesses the database and verifies recent entries.

## Security Considerations

### ✅ Best Practices

1. **Use Integration Tokens**: Not personal tokens
2. **Limit Permissions**: Only grant necessary access in Notion integration settings
3. **Environment Variables**: Store tokens securely, never commit to git
4. **Regular Rotation**: Rotate tokens periodically

### ⚠️ Security Notes

- The AI will have the same access as your integration
- Only share databases you want the AI to access
- Review Notion audit logs periodically
- Revoke tokens if compromised

## Troubleshooting

### MCP Not Connecting

**Issue**: "Could not connect to Notion MCP"

**Solutions**:
1. Verify `NOTION_API_TOKEN` is set as environment variable
2. Restart Cursor after setting the variable
3. Check token is valid and starts with `secret_`
4. Ensure integration has access to your workspace

### Authentication Errors

**Issue**: "Unauthorized" or "Invalid token"

**Solutions**:
1. Regenerate your integration token in Notion
2. Update the environment variable
3. Restart Cursor
4. Verify token doesn't have extra spaces or quotes

### AI Can't See Databases

**Issue**: AI says "No databases found"

**Solutions**:
1. Share databases with your integration in Notion
2. Wait a moment after sharing (may take a few seconds)
3. Ask the AI to search again
4. Check integration permissions

## MCP vs Direct API Integration

Our project uses **both** approaches:

### MCP (This Config)
- **Purpose**: Interactive AI access in Cursor
- **Used for**: Development, debugging, data exploration
- **Access**: Real-time, conversational
- **Location**: `.cursor/mcp.json`

### Direct API (Form Integration)
- **Purpose**: Production form submissions
- **Used for**: Saving contact form data
- **Access**: Automated, programmatic
- **Location**: `src/app/api/contact/route.ts`

Both use the same `NOTION_API_TOKEN` but serve different purposes.

## Verification Steps

To verify MCP is working:

1. **Start Cursor**
2. **Open AI chat**
3. **Ask**: "Can you see my Notion databases?"
4. **Expected**: AI lists your databases or asks to search
5. **Success**: ✅ MCP is connected

If the AI can't access Notion, follow the troubleshooting steps above.

## Advanced Configuration

### Multiple Notion Workspaces

If you have multiple Notion workspaces:

```json
{
  "mcpServers": {
    "Notion_Personal": {
      "url": "https://mcp.notion.com/mcp",
      "headers": {
        "Authorization": "Bearer ${NOTION_PERSONAL_TOKEN}"
      }
    },
    "Notion_Work": {
      "url": "https://mcp.notion.com/mcp",
      "headers": {
        "Authorization": "Bearer ${NOTION_WORK_TOKEN}"
      }
    }
  }
}
```

Set both environment variables accordingly.

### Custom MCP Timeout

If you have a large workspace, you might need to increase timeouts:

```json
{
  "mcpServers": {
    "Notion_Agentico": {
      "url": "https://mcp.notion.com/mcp",
      "headers": {
        "Authorization": "Bearer ${NOTION_API_TOKEN}"
      },
      "timeout": 30000
    }
  }
}
```

## Useful MCP Commands

Once connected, you can ask the AI:

- "Search Notion for [topic]"
- "Show me the structure of [database name]"
- "List all pages in [database]"
- "What's in the [page name] page?"
- "Create a new entry in [database]"
- "Update [page] with [information]"

## Environment Variable Quick Reference

### Windows
```powershell
# Set
[Environment]::SetEnvironmentVariable("NOTION_API_TOKEN", "secret_xxxxx", "User")

# View
[Environment]::GetEnvironmentVariable("NOTION_API_TOKEN", "User")

# Remove
[Environment]::SetEnvironmentVariable("NOTION_API_TOKEN", $null, "User")
```

### macOS/Linux
```bash
# Set (add to ~/.bashrc or ~/.zshrc)
export NOTION_API_TOKEN="secret_xxxxx"

# View
echo $NOTION_API_TOKEN

# Remove (remove from profile file)
```

## Additional Resources

- [Notion MCP Documentation](https://developers.notion.com/docs/notion-mcp)
- [MCP Protocol Spec](https://modelcontextprotocol.io/)
- [Notion API Reference](https://developers.notion.com/reference)

## Summary

1. ✅ Create Notion integration token
2. ✅ Set `NOTION_API_TOKEN` environment variable
3. ✅ Configure `.cursor/mcp.json` with token reference
4. ✅ Restart Cursor
5. ✅ Test by asking AI to access Notion

Now the AI can directly interact with your Notion workspace! 🎉

---

**Last Updated**: January 2025  
**Configuration File**: `.cursor/mcp.json`  
**Status**: ✅ Configured



