# Notion Integration Setup Guide

This guide will help you set up the Notion integration for saving contact form submissions to your Notion workspace.

> **Note**: This integration uses the latest Notion API version `2025-09-03` with support for multi-source databases and the new data source model.

## Prerequisites

- A Notion account
- Access to create integrations in Notion
- Access to your project's environment variables

## Step 1: Create a Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Fill in the integration details:
   - **Name**: Agentico Contact Form (or any name you prefer)
   - **Associated workspace**: Select your workspace
   - **Type**: Internal integration
4. Under **Capabilities**, ensure these are enabled:
   - ✅ Read content
   - ✅ Update content
   - ✅ Insert content
5. Click **"Submit"** to create the integration
6. Copy the **"Internal Integration Token"** (starts with `secret_`)
   - This is your `NOTION_API_TOKEN`

## Step 2: Create a Notion Database

1. In your Notion workspace, create a new page or navigate to where you want the contact form database
2. Type `/database` and select **"Table - Full page"** or **"Table - Inline"**
3. Name your database (e.g., "Contact Form Submissions")

### Required Database Properties

Create the following properties in your database (click **"+"** to add new properties):

| Property Name | Property Type | Description |
|---------------|---------------|-------------|
| Name | Title | Contact's full name (default) |
| Email | Email | Contact's email address |
| Phone | Phone number | Contact's phone number |
| Company | Text | Company name |
| Website | URL | Company website |
| Industry | Select | Business industry |
| Business Size | Select | Number of employees |
| Monthly Volume | Select | Monthly transaction/job volume |
| Team Size | Select | Team members affected |
| Data Volume | Select | Data volume to process |
| Timeline | Select | Project timeline |
| Budget | Select | Budget range |
| Status | Status | Lead status (New, Contacted, Qualified, etc.) |
| Submitted | Date | Submission timestamp |

### Configure Select Property Options

For each **Select** property, add the following options:

**Industry** (Select):
- Construction Trades
- Electrical Plumbing
- Hvac
- Landscaping Gardening
- Painting Decorating
- Carpentry Joinery
- Roofing
- Other Trades Construction
- Legal Services
- Accounting Bookkeeping
- Financial Advisory
- Consulting
- Human Resources
- Real Estate
- Property Management
- Insurance
- Other Professional Services
- Healthcare Medical
- Dental
- Veterinary
- Fitness Wellness
- Beauty Salon
- Other Healthcare Wellness
- Retail
- Ecommerce
- Hospitality Hotels
- Restaurants Cafes
- Catering
- Other Retail Hospitality
- Event Planning
- Marketing Advertising
- It Services
- Software Development
- Design Creative
- Photography Videography
- Other Creative Tech
- Education Training
- Childcare
- Cleaning Services
- Logistics Transport
- Warehousing
- Manufacturing
- Wholesale Distribution
- Automotive Repair
- Security Services
- Recruitment Staffing
- Other Services
- Other

**Business Size** (Select):
- 1-5
- 6-20
- 21-50
- 51-200
- 200+

**Monthly Volume** (Select):
- 0-100
- 100-500
- 500-1000
- 1000-5000
- 5000+

**Team Size** (Select):
- 1-2
- 3-5
- 6-10
- 11-20
- 20+

**Data Volume** (Select):
- Minimal
- Moderate
- Large
- Very_large

**Timeline** (Select):
- immediate
- 1-3-months
- 3-6-months
- 6+-months

**Budget** (Select):
- under 10k
- 10k-25k
- 25k-50k
- 50k-100k
- 100k+
- not sure

**Status** (Status):
- New
- Contacted
- Qualified
- Proposal Sent
- Won
- Lost

## Step 3: Share Database with Integration

1. Open your database in Notion
2. Click the **"•••"** (three dots) menu in the top right
3. Scroll down and click **"Connect to"**
4. Find and select your integration (e.g., "Agentico Contact Form")
5. The database is now shared with your integration

## Step 4: Name Your Database (Important!)

**The integration automatically discovers your database by name!**

Make sure your database title includes one of these keywords:
- **"Contact"** (e.g., "Contact Form Submissions")
- **"Form"** (e.g., "Form Submissions")
- **"Submission"** (e.g., "Lead Submissions")
- **"Lead"** (e.g., "Sales Leads")

This allows the integration to automatically find the correct database without needing to manually configure the database ID.

> **💡 Pro Tip**: If you have multiple databases with these keywords, the integration will use the first one it finds and log which one it's using.

## Step 5: Configure Environment Variables

Add this environment variable to your `.env.local` file:

```env
NOTION_API_TOKEN=secret_your_actual_token_here
```

**That's it!** No need to configure the database ID - the integration will automatically find your database based on its name.

### For Production (Vercel, etc.)

Add the same environment variables in your hosting platform's environment variables section.

## Step 6: Test the Integration (Updated!)

1. Start your development server
2. Navigate to the contact form on your website
3. Fill out and submit the form
4. Check your Notion database for a new entry
5. Check the server logs for any errors

### Troubleshooting

If the integration doesn't work:

1. **Check the server logs** for error messages (especially database discovery messages)
2. **Verify the Integration Token** is correct and starts with `secret_`
3. **Ensure your database name** includes "Contact", "Form", "Submission", or "Lead"
4. **Ensure the database is shared** with your integration
5. **Check property names** match exactly (case-sensitive)
6. **Verify select options** exist in your database

### Common Errors

- **"Could not find contact form database"**: No database with "Contact", "Form", "Submission", or "Lead" in the name, or the database isn't shared with the integration
- **"Validation failed"**: A select property doesn't have the required option
- **"Unauthorized"**: The API token is invalid or expired
- **Property not found**: A required property doesn't exist or has the wrong name

> **💡 Tip**: Check the server logs to see which database the integration is attempting to use. It will log: `Using database: "[Database Name]"`

## What Gets Saved to Notion

The integration saves all form data to Notion, including:

### In the Database Properties:
- Contact information (name, email, phone, company, website)
- Business details (industry, size, volume)
- Project scope (timeline, budget)
- Submission timestamp
- Initial status ("New")

### In the Page Content:
- Detailed contact information
- Social media links (if provided)
- Current state assessment
- Automation goals and specific processes
- Project ideas with priorities (emoji indicators)
- Integration requirements
- Project description and success metrics

## Additional Features

### Status Workflow

You can create different views in your Notion database to track leads:
- **New Submissions**: Filter by Status = "New"
- **In Progress**: Filter by Status = "Contacted" or "Qualified"
- **Closed Won**: Filter by Status = "Won"
- **Closed Lost**: Filter by Status = "Lost"

### Automation with Notion

You can set up Notion automation to:
- Send email notifications when new submissions arrive
- Assign leads to team members based on industry
- Create follow-up tasks automatically
- Update CRM systems via API

## Support

If you need help with the Notion integration:
1. Check the [Notion API documentation](https://developers.notion.com/)
2. Review the server logs for error details
3. Verify all setup steps were completed correctly

---

**Note**: The integration is configured to fail gracefully. If Notion is not configured or has an error, form submissions will still be sent to N8N webhooks (if configured) and the form will still return success to the user.

