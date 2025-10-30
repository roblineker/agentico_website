# Quick Setup: Add Database IDs to Fix Warnings

## The Warnings You're Seeing

```
Clients database ID not configured
Company Style Guides database ID not configured
Contact Style Guides database ID not configured
Proposals database ID not configured
```

## Quick Fix

Add these lines to your `.env.local` file:

```env
# Notion Database IDs (these are your actual database IDs)
NOTION_CLIENTS_DB_ID=28753ceefab08000a95cea49e7bf1762
NOTION_PROPOSALS_DB_ID=9bdf517b89d147a89963628d398870cc
NOTION_ESTIMATES_DB_ID=28753ceefab080e2842ccd40eaf73efe
NOTION_COMPANY_STYLE_GUIDES_DB_ID=b919f771bec746dd8ebdc956ec618176
NOTION_CONTACT_STYLE_GUIDES_DB_ID=2f196f71d920429e9a7318f43b154954
```

## What This Enables

Once you add these, the system will:

✅ **Create Client entries** in your Clients database  
✅ **Generate Proposals** automatically for each lead  
✅ **Create Estimates** for overall project + each project idea  
✅ **Save Style Guides** to proper databases with structured data  
✅ **Link everything together** (Client → Proposal → Estimates → Style Guides)

## Verify It's Working

After adding the env vars and restarting your dev server, submit a test form. You should see:

```
Creating/finding client...
Found existing client: {Company} OR Created new client: {Company}
Creating proposal and estimates...
Proposal created: https://notion.so/...
Estimates created: 4 estimates
```

Instead of:
```
Clients database ID not configured  ❌
Proposals database ID not configured ❌
```

## Current Status

Your system is **already working perfectly** for:
- ✅ Lead scoring
- ✅ Web presence analysis  
- ✅ AI research
- ✅ Email sending (instant + detailed + sales notification)
- ✅ Saving to intake forms database

Adding the database IDs will enable the **bonus features**:
- 🎁 Automatic proposal creation
- 🎁 Automatic estimate generation
- 🎁 Structured style guide storage
- 🎁 Full relationship linking

## Steps

1. Open your `.env.local` file
2. Copy the 5 database ID lines from above
3. Paste them into your file
4. Save the file
5. Restart your dev server (`npm run dev`)
6. Test with a form submission

Done! 🚀

