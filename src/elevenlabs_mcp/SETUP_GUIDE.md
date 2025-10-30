# Quick Setup Guide: ElevenLabs MCP Integration

This guide will help you connect your ElevenLabs conversational AI agent to your Agentico MCP server.

## What This Does

Instead of manually entering your system prompt in the ElevenLabs UI, your agent will fetch it directly from your application via MCP (Model Context Protocol). This means:

- ✅ Update prompts in your codebase
- ✅ Track changes with git
- ✅ No manual copy/paste into ElevenLabs
- ✅ Agents always use the latest version
- ✅ Access to business knowledge bases during demos

## Prerequisites

- An ElevenLabs account with Conversational AI access
- Your MCP server deployed at: `https://www.agentico.com.au/api/mcp`

## Setup Steps

### 1. Test Your MCP Server

First, verify your MCP server is running:

```bash
curl https://www.agentico.com.au/api/mcp
```

You should see a JSON response with status "ok" and a list of available tools and resources.

### 2. Add MCP Server to ElevenLabs

1. Log in to [ElevenLabs](https://elevenlabs.io)
2. Go to **Settings** → **Integrations** (or look for MCP Servers section)
3. Click **Add Custom MCP Server** or **Add Integration**
4. Fill in the form:

```
Name: Agentico Knowledge Server
Description: System prompts and business knowledge bases for demos
Server URL: https://www.agentico.com.au/api/mcp
```

5. Click **Save** or **Add Integration**
6. Verify the connection shows as "Active" or "Connected"

### 3. Configure Your ElevenLabs Agent

#### Option A: Using ElevenLabs UI

1. Go to **Conversational AI** → **Agents**
2. Create a new agent or edit existing "Alex" agent
3. In the **System Prompt** section:
   - Instead of typing the prompt, reference the MCP resource
   - Use: `{{mcp://prompt://elevenlabs-system-prompt}}`
4. Save the agent

#### Option B: Using ElevenLabs API

```python
from elevenlabs import ElevenLabs

client = ElevenLabs(api_key="YOUR_API_KEY")

# Create agent with MCP system prompt
agent = client.conversational_ai.agents.create(
    name="Alex - Agentico Receptionist",
    conversation_config={
        "agent": {
            "prompt": {
                "prompt": "{{mcp://prompt://elevenlabs-system-prompt}}"
            },
            "first_message": "Hi there, you've reached Agentico, this is Alex speaking! How can I help you today?"
        },
        "tts": {
            "voice_id": "YOUR_VOICE_ID"  # Use your preferred voice
        }
    }
)

print(f"Agent created: {agent.agent_id}")
```

#### Option C: Using ElevenLabs CLI

```bash
# Install CLI if you haven't
npm install -g @elevenlabs/cli

# Login
convai login

# Create agent with MCP reference
convai add agent "Alex - Agentico Receptionist" --template assistant
```

Then edit the agent configuration file to use the MCP prompt reference.

### 4. Enable Knowledge Base Tools

Your agent needs access to the MCP tools to search business knowledge during demos.

1. In your agent configuration, ensure these tools are enabled:
   - `search_knowledge` - Search across knowledge bases
   - `get_knowledge_file` - Get specific business data
   - `list_knowledge_files` - List available businesses

2. The tools are automatically available once your MCP server is connected

### 5. Test the Integration

Test your agent:

1. Start a conversation with your agent
2. Ask: "Can you show me a demo for a plumbing business?"
3. The agent should:
   - Use the system prompt from your MCP server
   - Access plumber knowledge from the knowledge base
   - Conduct a realistic demo

## Verification Checklist

- [ ] MCP server is accessible at `https://www.agentico.com.au/api/mcp`
- [ ] MCP server is added and connected in ElevenLabs
- [ ] Agent configuration references MCP prompt
- [ ] Agent can search knowledge bases during conversations
- [ ] Test conversation works end-to-end

## Common Issues

### "MCP server not responding"

**Solution:** Check that your Next.js app is deployed and the `/api/mcp` route is accessible:

```bash
curl https://www.agentico.com.au/api/mcp
```

### "System prompt not loading"

**Solution:** Verify the resource URI is correct:
- Should be: `prompt://elevenlabs-system-prompt`
- Check it exactly matches what's in your MCP server

### "Knowledge base searches return empty"

**Solution:** Ensure:
- Knowledge files are in `src/elevenlabs_mcp/example-data/`
- Files are valid JSON
- Files end with `.json` extension

## Updating the System Prompt

When you need to update Alex's behavior:

1. Edit: `src/elevenlabs_mcp/elevenlabs_system_prompt_updated.md`
2. Commit and push changes
3. Deploy to production
4. ElevenLabs will fetch the new prompt automatically

**No UI changes needed!**

## Adding New Business Knowledge

To add a new business type for demos:

1. Create: `src/elevenlabs_mcp/example-data/your_business_knowledge.json`
2. Follow the structure of existing files
3. Deploy to production
4. Agent can now demo that business type

## Next Steps

- [ ] Customize the system prompt for your needs
- [ ] Add more business knowledge bases
- [ ] Test different demo scenarios
- [ ] Set up CI/CD for automatic deployments
- [ ] Add authentication to MCP server (optional)

## Resources

- [Main README](./README.md) - Detailed technical documentation
- [System Prompt](./elevenlabs_system_prompt_updated.md) - Current prompt for Alex
- [Example Knowledge Base](./example-data/plumber_knowledge.json) - Sample business data
- [ElevenLabs MCP Docs](https://elevenlabs.io/docs/conversational-ai/customization/mcp)

## Support

If you run into issues:

1. Check the troubleshooting section in the [main README](./README.md)
2. Test the MCP server endpoints directly with curl
3. Review ElevenLabs agent logs for errors
4. Verify your deployment is successful

---

**Ready to go!** Your ElevenLabs agent is now connected to your codebase. Any prompt updates you make will automatically be available to your agent.

