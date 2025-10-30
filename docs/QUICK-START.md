# Quick Start Guide - Notion Integration

Complete setup checklist for getting the Notion integration working.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Notion account with workspace access
- [ ] Project cloned and dependencies installed (`npm install`)

## Part 1: Notion Integration Setup (Required for Form)

### Step 1: Create Notion Integration (5 minutes)

1. [ ] Go to https://www.notion.so/my-integrations
2. [ ] Click **"+ New integration"**
3. [ ] Name it: "Agentico Contact Form"
4. [ ] Select your workspace
5. [ ] Under **Capabilities**, enable:
   - [ ] Read content
   - [ ] Update content
   - [ ] Insert content
6. [ ] Click **"Submit"**
7. [ ] Copy the **Internal Integration Token** (starts with `secret_`)

### Step 2: Create Notion Database (5 minutes)

1. [ ] In Notion, create a new page
2. [ ] Type `/database` and select **"Table - Full page"**
3. [ ] Name it: **"Contact Form Submissions"** (or similar with "Contact", "Form", "Submission", or "Lead")
4. [ ] Add these properties (see [NOTION-SETUP.md](../NOTION-SETUP.md) for full list):

**Essential Properties:**
- [ ] Name (Title) - default
- [ ] Email (Email)
- [ ] Phone (Phone number)
- [ ] Company (Text)
- [ ] Website (URL)
- [ ] Industry (Select)
- [ ] Business Size (Select)
- [ ] Status (Status)
- [ ] Submitted (Date)

> **Note**: See full property list and select options in [NOTION-SETUP.md](../NOTION-SETUP.md)

### Step 3: Share Database with Integration (1 minute)

1. [ ] Open your database in Notion
2. [ ] Click **"•••"** (three dots) in top right
3. [ ] Click **"Connect to"**
4. [ ] Select **"Agentico Contact Form"** integration
5. [ ] Database is now shared ✅

### Step 4: Configure Environment Variables (2 minutes)

1. [ ] Create `.env.local` file in project root
2. [ ] Add this line:
   ```env
   NOTION_API_TOKEN=secret_your_actual_token_here
   ```
3. [ ] Save the file
4. [ ] **Important**: Restart your dev server if it's running

### Step 5: Test the Integration (2 minutes)

1. [ ] Start dev server: `npm run dev`
2. [ ] Navigate to http://localhost:3000/#contact
3. [ ] Fill out and submit the contact form
4. [ ] Check server logs for: `Using database: "Contact Form Submissions"`
5. [ ] Check Notion database for new entry
6. [ ] Verify all data was saved correctly

✅ **Part 1 Complete!** Your contact form now saves to Notion.

---

## Part 2: Notion MCP Setup (Optional - For AI Access)

This enables the AI in Cursor to directly access your Notion workspace.

### Step 1: Set System Environment Variable (Windows)

**Option A: PowerShell (Recommended)**
```powershell
[Environment]::SetEnvironmentVariable("NOTION_API_TOKEN", "secret_your_token_here", "User")
```

**Option B: Windows Settings**
1. [ ] Open Start Menu → Search "environment variables"
2. [ ] Click "Edit the system environment variables"
3. [ ] Click "Environment Variables" button
4. [ ] Under "User variables", click "New"
5. [ ] Variable name: `NOTION_API_TOKEN`
6. [ ] Variable value: `secret_your_token_here`
7. [ ] Click OK

### Step 2: Verify MCP Configuration (Already Done!)

The MCP config is already set up in `.cursor/mcp.json`:

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

### Step 3: Restart Cursor (1 minute)

1. [ ] Close Cursor completely
2. [ ] Reopen Cursor
3. [ ] Environment variable is now loaded

### Step 4: Test MCP Connection (1 minute)

1. [ ] Open AI chat in Cursor
2. [ ] Ask: **"Can you see my Notion databases?"**
3. [ ] AI should list your databases or search for them
4. [ ] Try: **"Show me the latest entries in my Contact Form Submissions database"**

✅ **Part 2 Complete!** AI can now access your Notion workspace.

---

## Troubleshooting

### Issue: "Notion credentials not configured"

**Check:**
- [ ] `.env.local` exists in project root
- [ ] `NOTION_API_TOKEN` is set in `.env.local`
- [ ] Token starts with `secret_`
- [ ] No extra spaces or quotes around the token
- [ ] Dev server was restarted after adding variable

### Issue: "Could not find contact form database"

**Check:**
- [ ] Database name includes: "Contact", "Form", "Submission", or "Lead"
- [ ] Database is shared with your integration
- [ ] Integration has Insert, Update, and Read permissions

### Issue: "Validation failed" or property errors

**Check:**
- [ ] All required properties exist in database
- [ ] Property names match exactly (case-sensitive)
- [ ] Select properties have all required options
- [ ] See full property list in [NOTION-SETUP.md](../NOTION-SETUP.md)

### Issue: MCP not working in Cursor

**Check:**
- [ ] `NOTION_API_TOKEN` set as **system environment variable** (not just `.env.local`)
- [ ] Cursor was restarted after setting variable
- [ ] Token is valid and has access to workspace
- [ ] See [NOTION-MCP-SETUP.md](./NOTION-MCP-SETUP.md) for detailed steps

---

## Verification Checklist

### Contact Form Integration ✓
- [ ] Form submits successfully
- [ ] Success toast appears
- [ ] Redirects to booking page
- [ ] New entry appears in Notion database
- [ ] All fields are populated correctly
- [ ] Server logs show: `Using database: "[Database Name]"`

### Notion MCP Integration ✓
- [ ] AI can list Notion databases
- [ ] AI can read database entries
- [ ] AI can search Notion content
- [ ] No authentication errors

---

## Time Estimate

- **Part 1** (Contact Form): ~15 minutes
- **Part 2** (MCP for AI): ~5 minutes
- **Total**: ~20 minutes

---

## Next Steps

Once everything is working:

1. [ ] Customize database views in Notion (filters, sorts, etc.)
2. [ ] Set up Notion automation (notifications, assignments, etc.)
3. [ ] Test with multiple form submissions
4. [ ] Deploy to production with production tokens
5. [ ] Monitor server logs for any issues

---

## Need Help?

- **Contact Form Setup**: See [NOTION-SETUP.md](../NOTION-SETUP.md)
- **MCP Setup**: See [NOTION-MCP-SETUP.md](./NOTION-MCP-SETUP.md)
- **Environment Variables**: See [ENV-VARIABLES.md](./ENV-VARIABLES.md)
- **API Version Info**: See [NOTION-API-VERSION.md](./NOTION-API-VERSION.md)
- **Auto-Discovery**: See [AUTO-DISCOVERY-UPGRADE.md](./AUTO-DISCOVERY-UPGRADE.md)
- **Testing**: See [TESTING-CHECKLIST.md](./TESTING-CHECKLIST.md)

---

**Status**: Ready to use! 🚀



