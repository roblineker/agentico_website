# ElevenLabs Integration Setup Guide

This guide walks you through setting up the complete ElevenLabs integration with your Agentico website, including contact form collection, email notifications, and booking system.

## Overview

The ElevenLabs AI agent ("Alex") can now:
- ✅ Collect contact information during phone calls
- ✅ Save data to Notion (Clients, Contacts, Intake Forms)
- ✅ Send confirmation emails with helpful links
- ✅ Send booking links for workshops
- ✅ Handle flexible data collection (not all fields required)
- ✅ Process call transcripts and metadata

## Architecture

```
ElevenLabs Agent (Alex)
    ↓
    ↓ API Calls (HTTPS)
    ↓
Agentico Website API
    ↓
    ├─→ Notion (Client data, Contact info, Intake forms)
    ├─→ Postmark (Confirmation emails, Booking links)
    └─→ n8n (Optional webhooks for automation)
```

## Prerequisites

Before starting, ensure you have:

1. **ElevenLabs Account** with Conversational AI enabled
2. **Notion Workspace** with databases set up (see below)
3. **Postmark Account** for transactional emails
4. **Domain configured** (or use localhost for testing)
5. **Node.js 18+** and npm/yarn installed

## Step 1: Environment Variables

Add these to your `.env` file:

```env
# Notion Integration
NOTION_API_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxx
# Get from: https://www.notion.so/my-integrations

# Postmark Email Service
POSTMARK_API_TOKEN=xxxxxxxxxxxxxxxxxxxxx
# Get from: https://account.postmarkapp.com/api_tokens

# n8n Webhooks (Optional)
N8N_ELEVENLABS_WEBHOOK_URL=https://your-n8n.com/webhook/elevenlabs
N8N_TEST_WEBHOOK_URL=https://your-n8n.com/webhook/test
N8N_PROD_WEBHOOK_URL=https://your-n8n.com/webhook/prod
N8N_SEND_TO_BOTH=false

# API Authentication (Optional - Recommended for Production)
ELEVENLABS_API_KEY=your-secret-api-key
```

## Step 2: Notion Database Setup

### Required Databases

You need three Notion databases with specific IDs configured in the code:

1. **Clients Database** (`28753ceefab08000a95cea49e7bf1762`)
   - Properties: Name (title), Website (url), Type (select)
   
2. **Contacts Database** (`28753ceefab080929025cf188f469668`)
   - Properties: Name (title), Email Address (email), Phone Number (phone), Company (relation), Decision Maker (checkbox)
   
3. **Intake Forms Database** (`0b2a39da34914320b1d9e621494ba183`)
   - Properties: Submission Name (title), Full Name (text), Email (email), Phone Number (phone), Company Name (text), Industry (select), Total Employees (select), Monthly Volume (select), Team Size Affected (select), Current Systems (text), Automation Goals (text), Specific Processes (text), Existing Tools (text), Integration Needs (text), Data Volume (select), Project Description (text), Success Metrics (text), Timeline (select), Budget Range (select), Project Ideas (text), Related Client (relation), Submission Date (date), Call Notes (text)

### Update Database IDs

If your database IDs are different, update them in:
- `src/app/api/elevenlabs/contact/route.ts`
- `src/app/api/contact/route.ts`

Look for these lines:
```typescript
const clientsDatabaseId = 'YOUR_CLIENTS_DB_ID';
const contactsDatabaseId = 'YOUR_CONTACTS_DB_ID';
const intakeFormsDatabaseId = 'YOUR_INTAKE_FORMS_DB_ID';
```

## Step 3: Postmark Email Setup

1. **Create Postmark Account:** https://postmarkapp.com
2. **Add Sender Signature:** Configure `noreply@agentico.com.au`
3. **Get API Token:** Copy from Settings → API Tokens
4. **Test Email Sending:**

```bash
curl -X POST "https://api.postmarkapp.com/email" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "X-Postmark-Server-Token: YOUR_TOKEN" \
  -d '{
    "From": "noreply@agentico.com.au",
    "To": "your-email@example.com",
    "Subject": "Test",
    "TextBody": "Test email from Postmark"
  }'
```

## Step 4: Deploy the API Endpoints

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Test the endpoint
curl -X POST http://localhost:3000/api/elevenlabs/contact \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "+61400000000",
    "company": "Test Company"
  }'
```

### Production Deployment

1. **Deploy to Vercel/Netlify/etc:**
   ```bash
   # Vercel
   vercel --prod
   
   # Or push to main branch if auto-deploy is configured
   git push origin main
   ```

2. **Configure Environment Variables** in your hosting platform

3. **Test Production URL:**
   ```bash
   curl -X POST https://agentico.com.au/api/elevenlabs/contact \
     -H "Content-Type: application/json" \
     -d '{"fullName":"Test","email":"test@example.com","phone":"+61400000000","company":"Test"}'
   ```

## Step 5: Configure ElevenLabs Agent

### Add Custom Tools/Functions

In your ElevenLabs agent configuration, add these custom functions:

#### 1. Submit Contact Form

```json
{
  "name": "submitContactForm",
  "description": "Save contact information and business details from phone call",
  "parameters": {
    "type": "object",
    "properties": {
      "fullName": {"type": "string", "description": "Full name of contact"},
      "email": {"type": "string", "description": "Email address"},
      "phone": {"type": "string", "description": "Phone number"},
      "company": {"type": "string", "description": "Company name"},
      "industry": {"type": "string", "description": "Industry code"},
      "projectDescription": {"type": "string", "description": "What they want to achieve"},
      "timeline": {"type": "string", "description": "When they need it"},
      "budget": {"type": "string", "description": "Budget range"}
    },
    "required": ["fullName", "email", "phone", "company"]
  },
  "endpoint": "https://agentico.com.au/api/elevenlabs/contact",
  "method": "POST"
}
```

#### 2. Send Booking Link

```json
{
  "name": "sendBookingLink",
  "description": "Email the workshop booking link to a prospect",
  "parameters": {
    "type": "object",
    "properties": {
      "fullName": {"type": "string", "description": "Full name"},
      "email": {"type": "string", "description": "Email address"}
    },
    "required": ["fullName", "email"]
  },
  "endpoint": "https://agentico.com.au/api/elevenlabs/booking/send-link",
  "method": "POST"
}
```

#### 3. Check Availability

```json
{
  "name": "checkAvailability",
  "description": "Check workshop availability (returns guidance to send booking link)",
  "parameters": {
    "type": "object",
    "properties": {
      "dateRange": {
        "type": "string",
        "enum": ["next_week", "next_two_weeks", "next_month"],
        "description": "Date range to check"
      }
    }
  },
  "endpoint": "https://agentico.com.au/api/elevenlabs/booking/availability",
  "method": "GET"
}
```

### Upload System Prompt

1. Copy contents from `src/elevenlabs_mcp/elevenlabs_system_prompt_updated.md`
2. Paste into ElevenLabs agent configuration → System Prompt
3. Test the agent with sample scenarios

## Step 6: Testing the Complete Flow

### Test Scenario 1: Minimal Contact Collection

**Phone Call Script:**
```
Agent: "What's your name?"
Caller: "John Smith"
Agent: "And your email?"
Caller: "john@example.com"
Agent: "Phone number?"
Caller: "0412 345 678"
Agent: "Company name?"
Caller: "Smith Plumbing"
```

**Expected Results:**
1. Agent calls `submitContactForm` with minimal data
2. Data saved to Notion (Client, Contact, Intake Form created)
3. Confirmation email sent to john@example.com
4. Sales notification sent to team

**Verify:**
- Check Notion for new entries
- Check email inbox for confirmation
- Check n8n webhook received data (if configured)

### Test Scenario 2: Detailed Information Collection

**Phone Call Script:**
```
Agent: "Would you like me to grab some more details to help us prepare?"
Caller: "Sure"
Agent: [Asks questions conversationally about business, systems, goals, etc.]
```

**Expected Results:**
1. Agent calls `submitContactForm` with detailed data
2. All optional fields populated in Notion
3. Rich confirmation email with full details
4. Sales team has comprehensive information

### Test Scenario 3: Booking Link

**Phone Call Script:**
```
Agent: "Ready to book a workshop?"
Caller: "Yes"
Agent: "I'll send you a booking link. What's your email?"
Caller: "john@example.com"
```

**Expected Results:**
1. Agent calls `sendBookingLink`
2. Email sent with Koalendar booking URL
3. Email includes workshop details, pricing, preparation tips
4. Caller can click link and book directly

**Verify:**
- Email received with correct link
- Link opens to Koalendar booking page
- Booking can be completed successfully

## Step 7: Monitoring and Debugging

### Check Logs

**Vercel:**
```bash
vercel logs
```

**Local Development:**
Check terminal output for console.log statements

### Common Issues

#### Issue: "Notion API token not configured"
**Solution:** Add `NOTION_API_TOKEN` to `.env` and restart server

#### Issue: "Email sending failed"
**Solution:** 
- Verify Postmark API token is correct
- Ensure sender signature is verified in Postmark
- Check email domain SPF/DKIM records

#### Issue: "Validation failed"
**Solution:** 
- Check that required fields are provided: fullName, email, phone, company
- Verify email format is valid
- Ensure phone number is at least 10 characters

#### Issue: "Failed to save to Notion"
**Solution:**
- Verify database IDs are correct
- Check Notion integration has access to databases
- Ensure property names match exactly (case-sensitive)

### Test API Endpoints Manually

```bash
# Test contact submission
curl -X POST http://localhost:3000/api/elevenlabs/contact \
  -H "Content-Type: application/json" \
  -d @test-data.json

# Test booking link
curl -X POST http://localhost:3000/api/elevenlabs/booking/send-link \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com"}'

# Test availability check
curl http://localhost:3000/api/elevenlabs/booking/availability?dateRange=next_week
```

## Step 8: Production Checklist

Before going live:

- [ ] Environment variables configured in production
- [ ] Notion databases created and IDs updated
- [ ] Postmark sender signature verified
- [ ] API endpoints tested in production
- [ ] ElevenLabs agent configured with tools
- [ ] System prompt uploaded to ElevenLabs
- [ ] Test calls completed successfully
- [ ] Email templates reviewed and branded
- [ ] Monitoring and logging configured
- [ ] Error handling tested
- [ ] API rate limiting considered (if needed)
- [ ] CORS configured for allowed origins
- [ ] SSL/HTTPS enabled
- [ ] Webhook endpoints secured (if using n8n)

## Advanced Configuration

### Add API Key Authentication

1. Generate secret key:
   ```bash
   openssl rand -hex 32
   ```

2. Add to `.env`:
   ```env
   ELEVENLABS_API_KEY=your_generated_key
   ```

3. Update each API route to check header:
   ```typescript
   const apiKey = request.headers.get('X-API-Key');
   if (apiKey !== process.env.ELEVENLABS_API_KEY) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
   ```

4. Configure ElevenLabs to send header with each request

### Custom Email Branding

Edit email templates:
- `src/lib/email-templates/call-confirmation.ts`
- `src/lib/email-templates/user-confirmation.ts`

Add your:
- Logo images
- Brand colors
- Custom footer
- Social media links

### Enable Real-time Booking

To enable programmatic booking:

**Option A: Switch to Calendly**
1. Sign up for Calendly with API access
2. Replace Koalendar URLs with Calendly
3. Use Calendly API for booking

**Option B: Custom Booking System**
1. Set up Google Calendar API
2. Create availability checking logic
3. Build booking creation endpoint
4. Update agent tools to use new endpoints

## Support and Documentation

- **API Documentation:** `API-INTEGRATION-GUIDE.md`
- **System Prompt:** `elevenlabs_system_prompt_updated.md`
- **Contact Form Types:** `src/lib/types/contact-form.ts`
- **Environment Variables:** Check main project `ENV-VARIABLES.md`

For help:
- Email: hello@agentico.com.au
- Phone: 0437 034 998

## Next Steps

After setup is complete:

1. **Train the Agent:** Test with various scenarios
2. **Monitor Calls:** Review transcripts and data quality
3. **Iterate Prompts:** Refine based on real interactions
4. **Add Analytics:** Track conversion rates, data completeness
5. **Optimize Flow:** Reduce friction points in user journey
6. **Scale Up:** Handle increased call volume

## Success Metrics

Track these KPIs:
- **Call completion rate:** % of calls that collect all required info
- **Email delivery rate:** % of confirmation emails successfully sent
- **Booking conversion rate:** % of callers who book a workshop
- **Data completeness:** Average number of fields collected per call
- **Agent performance:** Call handling time, customer satisfaction

---

**You're all set! 🎉**

The ElevenLabs agent can now collect contact information, save it to your systems, send beautiful confirmation emails, and help prospects book workshops.

