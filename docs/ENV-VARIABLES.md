# Environment Variables Reference

This document lists all environment variables used in the Agentico website.

## Required for Development

### Notion Integration (for contact form)

```env
NOTION_API_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- **Description**: Your Notion integration token
- **How to get**: Create an integration at https://www.notion.so/my-integrations
- **Format**: Starts with `secret_`
- **Required**: Yes (for form submissions to save to Notion)
- **See**: [NOTION-SETUP.md](../NOTION-SETUP.md) for setup instructions
- **Note**: The database is automatically discovered - no need for database ID!

## Optional Integrations

### N8N Webhooks (for automation workflows)

```env
N8N_TEST_WEBHOOK_URL=https://your-n8n-instance.com/webhook-test/your-webhook-path
```
- **Description**: Test/development webhook URL for N8N workflows
- **How to get**: Create a webhook node in your N8N workflow
- **Required**: No (optional automation)
- **Used when**: `NODE_ENV !== 'production'`

```env
N8N_PROD_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-path
```
- **Description**: Production webhook URL for N8N workflows
- **How to get**: Create a webhook node in your N8N workflow
- **Required**: No (optional automation)
- **Used when**: `NODE_ENV === 'production'`

```env
N8N_SEND_TO_BOTH=false
```
- **Description**: Send to both test and production webhooks
- **Options**: `true` or `false`
- **Default**: `false`
- **Required**: No
- **Use case**: Testing production workflows in development

## Next.js Configuration

```env
NODE_ENV=development
```
- **Description**: Environment mode
- **Options**: `development`, `production`, `test`
- **Required**: Set automatically by Next.js
- **Manual override**: Usually not needed

## Setup Instructions

### For Local Development

1. Create a `.env.local` file in the project root
2. Add the required environment variables (see example below)
3. Restart your development server

**Example `.env.local`:**

```env
# Notion Integration (Required)
NOTION_API_TOKEN=secret_abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx1234yz567890

# N8N Webhooks (Optional)
N8N_TEST_WEBHOOK_URL=https://n8n.example.com/webhook-test/contact-form
N8N_PROD_WEBHOOK_URL=https://n8n.example.com/webhook/contact-form
N8N_SEND_TO_BOTH=false

# Next.js
NODE_ENV=development
```

### For Production (Vercel, etc.)

Add the same environment variables in your hosting platform's settings:

#### Vercel
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable with its value
4. Select appropriate environments (Production, Preview, Development)
5. Redeploy to apply changes

#### Netlify
1. Go to Site Settings
2. Navigate to "Build & deploy" → "Environment"
3. Add each variable with its value
4. Trigger a new deploy

#### Other Platforms
- Refer to your platform's documentation for setting environment variables
- Always use the platform's secure environment variable storage
- Never commit `.env` files with real values to git

## Security Notes

⚠️ **Important Security Guidelines:**

1. **Never commit environment variables to git**
   - `.env.local` is in `.gitignore` by default
   - Use `.env.example` for templates (without real values)

2. **Protect your Notion token**
   - Treat it like a password
   - Regenerate if exposed
   - Limit integration permissions to what's needed

3. **Use different credentials for development and production**
   - Separate Notion databases for test vs production
   - Separate N8N webhooks for test vs production

4. **Rotate tokens periodically**
   - Update Notion integration tokens annually
   - Update webhook URLs if exposed

## Troubleshooting

### "Notion credentials not configured"
- Check that `NOTION_API_TOKEN` and `NOTION_DATABASE_ID` are set
- Verify they don't have extra spaces or quotes
- Restart your dev server after adding variables

### "Could not find database"
- Verify the `NOTION_DATABASE_ID` is correct
- Ensure the database is shared with your integration
- Check that the database ID doesn't have extra characters

### "Unauthorized" error
- Verify `NOTION_API_TOKEN` is correct and starts with `secret_`
- Check that the token hasn't expired
- Regenerate the integration token if needed

### Form submissions not saving
- Check server logs for error messages
- Verify all environment variables are set correctly
- Test that Notion integration has database access
- Ensure database properties match expected schema

## Validation

To verify your environment variables are loaded correctly:

1. Check the terminal output when starting the dev server
2. Look for console warnings about missing credentials
3. Test the contact form and check server logs
4. Verify entries appear in Notion database

## References

- [Notion API Documentation](https://developers.notion.com/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [NOTION-SETUP.md](../NOTION-SETUP.md) - Detailed Notion setup guide

