# ElevenLabs Agent Quick Reference

Quick cheat sheet for the AI agent ("Alex") phone receptionist.

## Available API Tools

### 1. submitContactForm
**Save contact and business information**

```json
{
  "fullName": "John Smith",
  "email": "john@company.com",
  "phone": "+61 412 345 678",
  "company": "Smith Plumbing",
  "industry": "electrical_plumbing",
  "projectDescription": "Want to automate quotes",
  "timeline": "1-3_months",
  "budget": "25k-50k"
}
```

**Required:** fullName, email, phone, company  
**Optional:** Everything else  
**When:** After collecting contact info or detailed discovery

---

### 2. sendBookingLink
**Email workshop booking link**

```json
{
  "fullName": "John Smith",
  "email": "john@company.com"
}
```

**Required:** fullName, email  
**When:** Caller wants to book workshop or needs more time to decide

---

### 3. checkAvailability
**Check workshop availability (returns guidance to send link)**

```
GET /api/elevenlabs/booking/availability?dateRange=next_two_weeks
```

**Response:** Guidance to use sendBookingLink instead  
**When:** Caller asks "What times are available?"

---

### 4. bookWorkshop
**Book workshop directly (redirects to send link)**

**Note:** Currently redirects to sendBookingLink since Koalendar has no API  
**When:** Caller wants to book specific time slot

---

## Call Flow Patterns

### Pattern 1: Quick Call
```
1. Greet → Understand needs
2. Explain workshop ($399 fee)
3. Collect: name, email, phone, company
4. Call submitContactForm (minimal)
5. Offer: "Want booking link?"
6. Call sendBookingLink
7. Wrap up
```

### Pattern 2: Detailed Discovery
```
1. Greet → Understand needs
2. Demo (if requested)
3. Explain workshop
4. Ask: "Want to grab details now?"
5. Collect detailed info conversationally
6. Call submitContactForm (detailed)
7. Call sendBookingLink
8. Wrap up
```

### Pattern 3: Ready to Book
```
1. Greet
2. Caller: "I want to book"
3. Call checkAvailability
4. Agent: "I'll send you booking link"
5. Collect email (if needed)
6. Call submitContactForm (if not done yet)
7. Call sendBookingLink
8. Wrap up
```

---

## Industry Codes

**Quick lookup for common industries:**

| What they say | Use this code |
|--------------|---------------|
| Plumber | `electrical_plumbing` |
| Electrician | `electrical_plumbing` |
| Builder | `construction_trades` |
| Carpenter | `carpentry_joinery` |
| Painter | `painting_decorating` |
| Landscaper | `landscaping_gardening` |
| HVAC/Air con | `hvac` |
| Lawyer | `legal_services` |
| Accountant | `accounting_bookkeeping` |
| Financial advisor | `financial_advisory` |
| Real estate | `real_estate` |
| Doctor/GP | `healthcare_medical` |
| Dentist | `dental` |
| Vet | `veterinary` |
| Gym/fitness | `fitness_wellness` |
| Hairdresser | `beauty_salon` |
| Restaurant | `restaurants_cafes` |
| Hotel | `hospitality_hotels` |
| Online store | `ecommerce` |
| Retail shop | `retail` |
| IT support | `it_services` |
| Web developer | `software_development` |
| Photographer | `photography_videography` |
| Event planner | `event_planning` |
| Cleaner | `cleaning_services` |
| Transport | `logistics_transport` |
| Warehouse | `warehousing` |
| Factory | `manufacturing` |
| Mechanic | `automotive_repair` |
| Security | `security_services` |
| Recruiter | `recruitment_staffing` |
| Teacher | `education_training` |
| Childcare | `childcare` |
| Don't know | `other` |

---

## Enum Values

### Business Size
`1-5`, `6-20`, `21-50`, `51-200`, `200+`

### Monthly Volume
`0-100`, `100-500`, `500-1000`, `1000-5000`, `5000+`

### Team Size
`1-2`, `3-5`, `6-10`, `11-20`, `20+`

### Data Volume
`minimal`, `moderate`, `large`, `very_large`

### Timeline
`immediate`, `1-3_months`, `3-6_months`, `6+_months`

### Budget
`under_10k`, `10k-25k`, `25k-50k`, `50k-100k`, `100k+`, `not_sure`

---

## Automation Goals (Array)
```json
[
  "reduce_manual_work",
  "improve_response_time",
  "automate_reporting",
  "document_processing",
  "workflow_automation",
  "customer_service"
]
```

---

## Integration Needs (Array)
```json
[
  "crm",
  "accounting",
  "project_management",
  "communication",
  "document_storage",
  "custom_software"
]
```

---

## Common Phrases

### Asking Permission
- "Would you like me to grab some more details now?"
- "Is it okay to do this verbally over the phone?"
- "Want me to send you a booking link?"

### Transitioning
- "Let me save that information..."
- "I'll get that sent to you right now..."
- "Perfect, I've got all that noted..."

### Wrapping Up
- "You'll get an email in the next minute..."
- "Our team will review this and reach out within 1-2 days..."
- "Check your inbox for the booking link..."

### Error Handling
- "I'm having a bit of trouble saving that - let me make a note..."
- "The email might take a few minutes - check spam if you don't see it..."

---

## Key Reminders

1. **ONE question at a time** - Never spam with multiple questions
2. **Confirm spelling** - Email letter by letter, phone digit by digit  
3. **Workshop fee upfront** - $399, explain value before booking
4. **10-minute limit** - Wrap up naturally, don't rush
5. **Be conversational** - Not an interrogation, have a chat
6. **Make it optional** - "Totally optional if you'd rather not..."
7. **Flexible data** - Don't need all fields, submit what you have
8. **Send confirmation** - Always follow up with email

---

## Testing Commands

```bash
# Test contact submission
curl -X POST https://agentico.com.au/api/elevenlabs/contact \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@example.com","phone":"+61400000000","company":"Test Co"}'

# Test booking link
curl -X POST https://agentico.com.au/api/elevenlabs/booking/send-link \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@example.com"}'
```

---

## Emergency Contacts

- **Rob (Owner):** Transfer using `transfer_to_number` tool
- **Technical Issues:** Console.log will show in monitoring
- **Email Issues:** Check Postmark status page
- **Notion Issues:** Check notion.status.io

---

**Remember:** You're helpful, not pushy. Make it easy for them, gather what you can, and always follow up with an email!

