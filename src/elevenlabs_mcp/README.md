# ElevenLabs Integration for Agentico

This directory contains everything you need to integrate the ElevenLabs AI agent ("Alex") with your Agentico website backend.

## 🚀 Quick Start

1. **Read the Setup Guide:** [`SETUP-GUIDE.md`](SETUP-GUIDE.md)
2. **Configure Environment Variables:** See main [`docs/ENV-VARIABLES.md`](../../docs/ENV-VARIABLES.md)
3. **Upload System Prompt:** [`elevenlabs_system_prompt_updated.md`](elevenlabs_system_prompt_updated.md)
4. **Test the Integration:** Run [`test-integration.sh`](test-integration.sh)

## 📁 Files Overview

### Core System

- **`elevenlabs_system_prompt_updated.md`** ⭐ - The complete system prompt for the AI agent
  - Personality and tone guidelines
  - Conversation flow and scripts  
  - Tool usage instructions
  - Call management rules
  - Contact form collection flow
  - Booking system integration

### Documentation

- **`SETUP-GUIDE.md`** - Step-by-step setup instructions
  - Environment configuration
  - Notion database setup
  - Postmark email configuration
  - Testing procedures
  - Production checklist

- **`API-INTEGRATION-GUIDE.md`** - Complete API documentation
  - All endpoint specifications
  - Request/response examples
  - Industry codes and enums
  - Error handling
  - cURL examples

- **`QUICK-REFERENCE.md`** - Cheat sheet for the AI agent
  - Industry code lookup
  - Call flow patterns
  - Common phrases
  - Quick testing commands

- **`IMPLEMENTATION-SUMMARY.md`** - What was built and how it works
  - Architecture overview
  - Data flow diagrams
  - Success metrics
  - Next steps

### Testing

- **`test-integration.sh`** - Automated test script
  - Tests all API endpoints
  - Validates responses
  - Provides troubleshooting output

### MCP Server (Knowledge Base)

- **`example-data/`** - Business knowledge bases for demos (JSON files)
  - Plumber, law firm, real estate, etc.
  - Accessed via MCP server during conversations

## 🎯 What This Integration Does

The ElevenLabs AI agent can now:

- ✅ **Collect contact information** during phone calls
- ✅ **Save data to Notion** (flexible validation - not all fields required)
- ✅ **Send confirmation emails** with helpful resources
- ✅ **Send workshop booking links** via email
- ✅ **Handle call metadata** (transcripts, duration, etc.)
- ✅ **Trigger webhooks** for automation workflows
- ✅ **Run interactive demos** using business knowledge bases
- ✅ **Manage call flow** with time limits and natural wrap-ups

## 🔧 API Endpoints

All endpoints are under `/api/elevenlabs/`:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/contact` | POST | Submit contact form data |
| `/booking/send-link` | POST | Email booking link |
| `/booking/availability` | GET | Check availability |
| `/booking/book` | POST | Book workshop |

See [`API-INTEGRATION-GUIDE.md`](API-INTEGRATION-GUIDE.md) for complete documentation.

## 📧 Email Templates

Two email templates are automatically sent:

1. **Call Confirmation** (`src/lib/email-templates/call-confirmation.ts`)
   - Sent to caller after information is collected
   - Includes discussion summary, next steps, resources
   - Prominent workshop booking CTA

2. **Booking Link** (in `booking/send-link/route.ts`)
   - Sent when caller wants to book
   - Direct link to Koalendar
   - Workshop details and preparation tips

## 🗄️ Data Storage

Data is saved to three Notion databases:

1. **Clients** - Company information (deduplicated)
2. **Contacts** - Individual contact details  
3. **Intake Forms** - Detailed submission data with relations

All entries are automatically linked and tagged as "Phone Call" source.

## ⚙️ Environment Variables

**Required:**
```env
NOTION_API_TOKEN=secret_xxx
POSTMARK_API_TOKEN=xxx
```

**Optional:**
```env
N8N_ELEVENLABS_WEBHOOK_URL=https://your-n8n.com/webhook/elevenlabs
ELEVENLABS_API_KEY=your-secret-key
MCP_API_SECRET=your-mcp-secret
```

See main [`docs/ENV-VARIABLES.md`](../../docs/ENV-VARIABLES.md) for complete details.

## 🧪 Testing

### Automated Testing

```bash
# Make script executable (first time only)
chmod +x test-integration.sh

# Test local development
./test-integration.sh

# Test production
./test-integration.sh https://agentico.com.au your-email@example.com
```

### Manual Testing

1. Test contact submission (minimal data)
2. Test contact submission (full data)
3. Test booking link email
4. Verify Notion entries created
5. Check email delivery
6. Test actual ElevenLabs call

See [`SETUP-GUIDE.md`](SETUP-GUIDE.md) for detailed test scenarios.

## 📊 Success Metrics

Track these KPIs:

- **Data Collection Rate:** % of calls collecting minimum info
- **Email Performance:** Delivery, open, and click rates
- **Conversion Metrics:** Call → Contact → Booking
- **Data Quality:** Completeness and accuracy
- **System Performance:** API response times and error rates

## 🔒 Security

- API endpoints are public by design (for ElevenLabs)
- Optional API key authentication available
- Add rate limiting for production
- Configure CORS for allowed origins
- All sensitive data in environment variables

## 🚦 Production Checklist

Before going live:

- [ ] Environment variables configured in production
- [ ] Notion databases set up with correct IDs
- [ ] Postmark sender signature verified
- [ ] API endpoints tested in production
- [ ] ElevenLabs agent configured with tools
- [ ] System prompt uploaded to ElevenLabs
- [ ] Test calls completed successfully
- [ ] Email templates reviewed and branded
- [ ] Monitoring configured
- [ ] MCP server tested (for demos)

## 🔄 MCP Server (Knowledge Base Access)

The MCP server at `https://www.agentico.com.au/api/mcp` provides:

- **Knowledge Base Access:** Agent can search business data during demos
- **Dynamic Demo Data:** Real-time access to example business scenarios
- **Version Control:** Knowledge bases tracked through git

### Available Tools

- `search_knowledge` - Search across all knowledge bases
- `get_knowledge_file` - Get specific business knowledge
- `list_knowledge_files` - List available businesses

See the original sections above for MCP setup details.

## 📚 Additional Resources

- **Contact Form Types:** `src/lib/types/contact-form.ts`
- **Main Contact API:** `src/app/api/contact/route.ts`
- **Email Templates:** `src/lib/email-templates/`
- **Booking Page:** `src/app/booking/page.tsx`

## 🆘 Support

For questions or issues:
- **Email:** hello@agentico.com.au
- **Phone:** 0437 034 998
- **Documentation:** This directory

## 🎓 Learning Path

**New to this integration?** Follow this order:

1. Read [`IMPLEMENTATION-SUMMARY.md`](IMPLEMENTATION-SUMMARY.md) - Understand what was built
2. Read [`SETUP-GUIDE.md`](SETUP-GUIDE.md) - Learn how to set it up
3. Use [`QUICK-REFERENCE.md`](QUICK-REFERENCE.md) - Quick lookups
4. Reference [`API-INTEGRATION-GUIDE.md`](API-INTEGRATION-GUIDE.md) - Deep technical details
5. Review [`elevenlabs_system_prompt_updated.md`](elevenlabs_system_prompt_updated.md) - Agent behavior

## 🔄 Recent Updates

**2025-10-30:**
- ✅ Complete integration system built
- ✅ Flexible contact form validation
- ✅ Email confirmation templates created
- ✅ Booking link system implemented
- ✅ Comprehensive documentation written
- ✅ Testing scripts provided
- ✅ System prompt updated with new flows

## 🎯 Next Steps

1. **Immediate:** Complete setup and testing
2. **Short-term:** Monitor and iterate based on real calls
3. **Medium-term:** Add analytics and optimize
4. **Long-term:** Programmatic booking, CRM integration

---

**Status: ✅ Complete and ready for deployment**

*Last updated: 2025-10-30*
