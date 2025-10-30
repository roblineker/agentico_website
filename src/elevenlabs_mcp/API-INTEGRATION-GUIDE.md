# ElevenLabs API Integration Guide

This guide explains how the ElevenLabs AI agent ("Alex") integrates with the Agentico website backend to collect contact information, save client intakes, send confirmation emails, and handle workshop bookings.

## Overview

The ElevenLabs agent has access to several API endpoints that allow it to:
1. Submit contact form data (with flexible validation)
2. Send confirmation emails with helpful links
3. Send booking links to prospects
4. Check availability (provides booking link)
5. Book workshops (redirects to booking link)

## Base URLs

- **Development:** `http://localhost:3000`
- **Production:** `https://agentico.com.au`

## Authentication

Currently, these endpoints are **publicly accessible** for the ElevenLabs agent to call. In production, you may want to add API key authentication.

### Adding Authentication (Optional)

Add to `.env`:
```env
ELEVENLABS_API_KEY=your-secret-key-here
```

Then modify each endpoint to check for the `X-API-Key` header.

---

## API Endpoints

### 1. Submit Contact Form

**Endpoint:** `POST /api/elevenlabs/contact`

**Purpose:** Save contact information collected during a phone call. This endpoint accepts flexible data - you don't need all fields filled out.

**Required Fields:**
- `fullName` (string, min 2 chars)
- `email` (string, valid email)
- `phone` (string, min 10 chars)
- `company` (string, min 2 chars)

**Optional Fields:**
All other fields from the main contact form are optional. See below for the complete schema.

**Request Body Example (Minimal):**
```json
{
  "fullName": "John Smith",
  "email": "john@example.com",
  "phone": "+61 412 345 678",
  "company": "Smith Plumbing"
}
```

**Request Body Example (Detailed):**
```json
{
  "fullName": "John Smith",
  "email": "john@example.com",
  "phone": "+61 412 345 678",
  "company": "Smith Plumbing",
  "website": "https://www.smithplumbing.com.au",
  "industry": "electrical_plumbing",
  "businessSize": "6-20",
  "currentSystems": "Excel for quotes, Gmail, manual job tracking",
  "monthlyVolume": "100-500",
  "teamSize": "6-10",
  "automationGoals": ["reduce_manual_work", "improve_response_time"],
  "specificProcesses": "Automate quote generation and job scheduling",
  "existingTools": "Xero, Gmail, Google Drive",
  "integrationNeeds": ["accounting", "communication"],
  "dataVolume": "moderate",
  "projectDescription": "Want to automate quoting and reduce paperwork",
  "successMetrics": "Save 10 hours per week, respond to quotes same day",
  "timeline": "1-3_months",
  "budget": "25k-50k",
  "callId": "elevenlabs-call-123",
  "callDuration": 480,
  "callTranscript": "Full transcript of the call..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Contact information saved successfully",
  "data": {
    "fullName": "John Smith",
    "email": "john@example.com",
    "company": "Smith Plumbing"
  }
}
```

**Response (Error):**
```json
{
  "error": "Validation failed",
  "details": [...],
  "message": "Required fields: fullName, email, phone, company"
}
```

**What Happens:**
1. Data is validated against flexible schema
2. Saved to Notion (Clients, Contacts, and Intake Forms databases)
3. Confirmation email sent to the caller
4. Sales notification sent to team
5. Data sent to n8n webhook (if configured)

---

### 2. Send Booking Link

**Endpoint:** `POST /api/elevenlabs/booking/send-link`

**Purpose:** Email the Koalendar booking link to a prospect so they can schedule their own workshop.

**Required Fields:**
- `fullName` (string, min 2 chars)
- `email` (string, valid email)

**Request Body Example:**
```json
{
  "fullName": "John Smith",
  "email": "john@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Booking link sent successfully",
  "data": {
    "email": "john@example.com",
    "bookingUrl": "https://koalendar.com/e/discovery-call-with-agentico"
  }
}
```

**What Happens:**
1. Validates email address
2. Sends beautifully formatted email with:
   - Direct booking link button
   - Workshop details ($399, duration options)
   - What to prepare
   - Contact information

**Agent Script:**
"Perfect! I'll send you a booking link right now. You'll get an email in the next minute with a link to choose a time that suits you. All our available slots are there."

---

### 3. Check Availability

**Endpoint:** `GET /api/elevenlabs/booking/availability?dateRange=next_two_weeks`

**Purpose:** Check workshop availability (currently returns guidance to use booking link instead).

**Query Parameters:**
- `dateRange` (optional): `next_week`, `next_two_weeks`, `next_month`

**Response:**
```json
{
  "success": true,
  "message": "Availability check requires booking link",
  "recommendation": "send_booking_link",
  "data": {
    "dateRange": "next_two_weeks",
    "bookingUrl": "https://koalendar.com/e/discovery-call-with-agentico",
    "agentMessage": "I can send you a link where you can see all our available times..."
  }
}
```

**Note:** Koalendar doesn't provide a public API for checking availability. The agent should use this response to transition to sending the booking link.

**Agent Script:**
"Let me check our calendar... Actually, the best way is for me to send you a link where you can see all our available times in real-time and pick one that works for you. Can I email that to you?"

---

### 4. Book Workshop

**Endpoint:** `POST /api/elevenlabs/booking/book`

**Purpose:** Book a workshop (currently redirects to send-link endpoint).

**Required Fields:**
- `fullName` (string)
- `email` (string)
- `phone` (string)

**Optional Fields:**
- `dateTime` (ISO string)
- `duration` (number: 60, 90, or 120)

**Response:**
```json
{
  "success": false,
  "requiresAlternativeAction": true,
  "action": "send_booking_link",
  "message": "Direct booking not available - send link instead",
  "agentMessage": "I've got your details saved. The easiest way to book is...",
  "recommendation": "Use the /api/elevenlabs/booking/send-link endpoint"
}
```

**Note:** Since Koalendar doesn't have a booking API, the agent should use the send-link endpoint instead.

---

## Industry Codes

When collecting industry information, use these codes:

### Trades & Construction
- `construction_trades`
- `electrical_plumbing`
- `hvac`
- `landscaping_gardening`
- `painting_decorating`
- `carpentry_joinery`
- `roofing`
- `other_trades_construction`

### Professional Services
- `legal_services`
- `accounting_bookkeeping`
- `financial_advisory`
- `consulting`
- `human_resources`
- `real_estate`
- `property_management`
- `insurance`
- `other_professional_services`

### Healthcare & Wellness
- `healthcare_medical`
- `dental`
- `veterinary`
- `fitness_wellness`
- `beauty_salon`
- `other_healthcare_wellness`

### Retail & Hospitality
- `retail`
- `ecommerce`
- `hospitality_hotels`
- `restaurants_cafes`
- `catering`
- `other_retail_hospitality`

### Creative & Tech
- `event_planning`
- `marketing_advertising`
- `it_services`
- `software_development`
- `design_creative`
- `photography_videography`
- `other_creative_tech`

### Other Services
- `education_training`
- `childcare`
- `cleaning_services`
- `logistics_transport`
- `warehousing`
- `manufacturing`
- `wholesale_distribution`
- `automotive_repair`
- `security_services`
- `recruitment_staffing`
- `other_services`
- `other`

---

## Automation Goals

When collecting automation goals, use these IDs:
- `reduce_manual_work`
- `improve_response_time`
- `automate_reporting`
- `document_processing`
- `workflow_automation`
- `customer_service`

---

## Integration Needs

When collecting integration needs, use these IDs:
- `crm`
- `accounting`
- `project_management`
- `communication`
- `document_storage`
- `custom_software`

---

## Enum Values Reference

### Business Size
- `1-5`
- `6-20`
- `21-50`
- `51-200`
- `200+`

### Monthly Volume
- `0-100`
- `100-500`
- `500-1000`
- `1000-5000`
- `5000+`

### Team Size
- `1-2`
- `3-5`
- `6-10`
- `11-20`
- `20+`

### Data Volume
- `minimal` (Few per day)
- `moderate` (10-50 per day)
- `large` (50-200 per day)
- `very_large` (200+ per day)

### Timeline
- `immediate`
- `1-3_months`
- `3-6_months`
- `6+_months`

### Budget
- `under_10k`
- `10k-25k`
- `25k-50k`
- `50k-100k`
- `100k+`
- `not_sure`

### Priority (for project ideas)
- `high`
- `medium`
- `low`

---

## Error Handling

All endpoints return consistent error responses:

**400 Bad Request (Validation Error):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["email"],
      "message": "Please enter a valid email address"
    }
  ]
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

The agent should handle errors gracefully:
- If submission fails: "I'm having trouble saving that information right now. Let me take note of it and make sure our team follows up with you directly."
- If email fails: "I've saved your information, but the email might take a few minutes to arrive. If you don't see it, check your spam folder or give us a call."

---

## Testing the Integration

### Using cURL

**Submit Contact (Minimal):**
```bash
curl -X POST http://localhost:3000/api/elevenlabs/contact \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "+61 400 000 000",
    "company": "Test Company"
  }'
```

**Send Booking Link:**
```bash
curl -X POST http://localhost:3000/api/elevenlabs/booking/send-link \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com"
  }'
```

**Check Availability:**
```bash
curl -X GET "http://localhost:3000/api/elevenlabs/booking/availability?dateRange=next_week"
```

---

## Environment Variables Required

Make sure these are configured in `.env`:

```env
# Notion Integration (for saving contacts and intake forms)
NOTION_API_TOKEN=secret_xxx

# Postmark (for sending emails)
POSTMARK_API_TOKEN=xxx

# n8n Webhook (optional, for custom workflows)
N8N_ELEVENLABS_WEBHOOK_URL=https://your-n8n-instance.com/webhook/elevenlabs
```

---

## Agent Workflow Examples

### Scenario 1: Quick Call - Minimal Info
1. Caller asks about services
2. Agent provides info and explains workshop
3. Caller interested but in a hurry
4. Agent collects: name, email, phone, company
5. Agent calls `/api/elevenlabs/contact` with minimal data
6. Agent offers: "I can send you more info and a booking link"
7. Agent calls `/api/elevenlabs/booking/send-link`
8. Caller receives two emails: confirmation + booking link

### Scenario 2: Detailed Call - Full Discovery
1. Caller very interested and has time
2. Agent asks: "Would you like me to grab some details now to speed things up?"
3. Caller agrees
4. Agent collects detailed information conversationally
5. Agent calls `/api/elevenlabs/contact` with comprehensive data
6. Agent: "Want to book the workshop now?"
7. Agent calls `/api/elevenlabs/booking/send-link`
8. Caller receives detailed confirmation + booking link

### Scenario 3: Ready to Book
1. Caller: "I want to book a workshop"
2. Agent: "Great! Let me check our availability..."
3. Agent calls `/api/elevenlabs/booking/availability`
4. Agent: "I can send you a link to see all our times"
5. Caller: "Yes, please"
6. Agent collects email if not already provided
7. Agent calls `/api/elevenlabs/booking/send-link`
8. Agent: "You'll get it in the next minute. All our slots are there."

---

## Future Enhancements

### Programmatic Booking
To enable true programmatic booking:
1. **Option A:** Switch from Koalendar to Calendly or Cal.com (both have APIs)
2. **Option B:** Build custom booking system with Google Calendar API
3. **Option C:** Integrate with Koalendar webhooks to maintain local availability cache

### Real-time Availability
To check real-time availability:
1. Set up Koalendar webhook to notify on bookings
2. Maintain availability state in database
3. Update `/api/elevenlabs/booking/availability` to query database
4. Sync with Google Calendar via API

### Enhanced Authentication
For production security:
1. Add API key authentication
2. Rate limiting per IP/key
3. Request logging and monitoring
4. CORS configuration for allowed origins

---

## Support

For questions or issues with the API integration:
- **Email:** hello@agentico.com.au
- **Phone:** 0437 034 998
- **Documentation:** This file + `/src/elevenlabs_mcp/elevenlabs_system_prompt_updated.md`

