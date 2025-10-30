# Email Notification Setup - Postmark Integration

**Date**: October 30, 2025  
**Status**: ✅ Implemented

## Overview

Contact form submissions now trigger automated email notifications via Postmark:
1. **Sales Team Notification** → sales@agentico.com.au
2. **User Confirmation** → Submitted email address

## Features

### Sales Team Notification

When a form is submitted, the sales team receives a comprehensive email with:

- **Contact Information**: Name, email, phone, company, website
- **Business Details**: Industry, size, volume, team size
- **Project Scope**: Timeline, budget, description, success metrics
- **Automation Goals**: Selected goals and specific processes
- **Project Ideas**: Color-coded by priority (High=Red, Medium=Yellow, Low=Green)
- **Integration Requirements**: Existing tools, integration needs, data volume

### User Confirmation Email

The submitter receives a professional confirmation email with:

- **Personalized Greeting**: Uses first name
- **Next Steps**: Clear timeline of what happens next
- **Submission Summary**: Key details they provided
- **Helpful Links**: Booking page, website, contact info
- **Professional Branding**: Agentico branding and contact details

## Email Templates

### Sales Email Format

```
Subject: New Contact Form Submission - {Company Name}

NEW CONTACT FORM SUBMISSION

You have received a new contact form submission from your website.

CONTACT INFORMATION
- Name: {Full Name}
- Email: {Email}
- Phone: {Phone}
- Company: {Company}
- Website: {Website URL}

BUSINESS DETAILS
- Industry: {Formatted Industry}
- Business Size: {Size} employees
- Monthly Volume: {Volume} transactions/jobs
- Team Size: {Size} people will use the solution

[...full details...]
```

### User Confirmation Format

```
Subject: Thank you for contacting Agentico - Next Steps

Thank you for reaching out, {First Name}!

We've received your inquiry about AI automation for {Company}. 
Our team is excited to learn about your business and explore how we can help.

WHAT HAPPENS NEXT?

1. Review (1-2 business days): We'll carefully review your submission
2. Discovery Call: We'll reach out to schedule a conversation
3. Assessment: We'll provide a preliminary assessment

YOUR SUBMISSION SUMMARY
- Company: {Company}
- Industry: {Industry}
- Timeline: {Timeline}
- Budget Range: {Budget}

[...helpful links...]
```

## Environment Variables

Add to `.env.local`:

```env
# Postmark API Token
POSTMARK_API_TOKEN=your-postmark-server-api-token

# Sender email must be verified in Postmark
# Default: noreply@agentico.com.au
```

## Postmark Setup Required

### 1. Verify Sender Domain

In your Postmark account:
1. Go to **Sender Signatures**
2. Add and verify **agentico.com.au** domain
3. Add DNS records as instructed
4. Wait for verification (usually a few minutes)

### 2. Verify Sender Email

Ensure these emails are verified:
- `noreply@agentico.com.au` (sender)
- `sales@agentico.com.au` (recipient)

### 3. Get API Token

1. Go to **Servers** in Postmark
2. Select your server (or create one)
3. Copy the **Server API Token**
4. Add to `.env.local` as `POSTMARK_API_TOKEN`

### 4. Set Message Stream

Emails use the `outbound` message stream (default for transactional emails).

## Error Handling

### Non-Blocking
- Emails are sent asynchronously (non-blocking)
- Form submission succeeds even if emails fail
- Errors are logged but don't affect user experience

### Graceful Degradation
```typescript
if (!postmarkToken) {
  console.warn('Postmark not configured - skipping emails');
  return { success: false, reason: 'not_configured' };
}
```

### Dual Send with Promise.allSettled
```typescript
const results = await Promise.allSettled([
  client.sendEmail(salesEmail),
  client.sendEmail(userEmail),
]);
```

Both emails are attempted independently - if one fails, the other still sends.

## Testing

### Development Testing

With test data dropdown, all test cases use `dev@agentico.com.au`:
- ✅ Emails sent to dev team (not actual customers)
- ✅ Safe to test in development
- ✅ No risk of spamming real users

### Test Cases Available

1. **🏗️ Construction (Small)** - BuildRight Constructions
2. **🏥 Medical Practice** - Sunshine Coast Medical Centre  
3. **⚖️ Law Firm (Enterprise)** - Martinez & Associates Legal
4. **🛍️ E-commerce Startup** - EcoStyle Australia
5. **📊 Accounting Firm** - Williams & Co Chartered Accountants

### Manual Testing Steps

1. Select a test case from dropdown
2. Review the populated data
3. Submit the form
4. Check `dev@agentico.com.au` for user confirmation
5. Check `sales@agentico.com.au` for sales notification
6. Verify Notion pages created with relationships

## Email Content Features

### HTML Email Styling
- Professional layout with max-width container
- Color-coded project ideas by priority
- Responsive design for mobile
- Branded colors (Agentico blue: #2563eb)

### Plain Text Fallback
- Every email includes text-only version
- Properly formatted for email clients without HTML support
- Maintains readability and structure

### Personalization
- Uses first name in greeting
- Includes company name throughout
- Tailored call-to-action links

## Monitoring

### Console Logs
```typescript
console.log(`Email results - Sales: ${salesSent}, User: ${userSent}`);
```

Check server logs to verify:
- Both emails sent successfully
- Any errors or failures
- Postmark API responses

### Postmark Dashboard

Monitor in Postmark:
- **Activity** - See all sent emails
- **Bounces** - Track delivery issues
- **Opens/Clicks** - Track engagement (if enabled)

## Security & Privacy

### Sender Domain
- Uses verified `noreply@agentico.com.au`
- Prevents spoofing and improves deliverability
- SPF, DKIM, DMARC configured via Postmark

### User Privacy
- Only sends to email provided in form
- Clear unsubscribe/contact information
- Compliant with Australian privacy laws

### Data in Emails
- Contains full submission details for sales team
- User receives summary only (not all internal details)
- No sensitive data stored in email

## Troubleshooting

### Emails Not Sending

**Check:**
1. `POSTMARK_API_TOKEN` is set in `.env.local`
2. Sender domain verified in Postmark
3. Server logs for specific error messages
4. Postmark account has available credits

### Emails in Spam

**Solutions:**
1. Ensure SPF/DKIM records added to DNS
2. Use verified sender domain
3. Avoid spam trigger words in content
4. Ask recipients to whitelist noreply@agentico.com.au

### Wrong Email Address

**User email:**
- Sent to whatever they enter in form
- Validate email format client-side (already done)

**Sales email:**
- Hardcoded to `sales@agentico.com.au`
- Update in code if needed

## Future Enhancements

### Possible Improvements
- Add email templates in Postmark (instead of inline HTML)
- Track email opens and clicks
- Send follow-up emails automatically
- CC additional team members based on industry
- Add calendar invite for discovery call
- Include PDF attachment with submission summary

### Advanced Features
- Trigger different email templates based on budget/timeline
- A/B test email content
- Segment notifications by lead quality
- Integration with CRM for email tracking

## Related Files

- **API Route**: `src/app/api/contact/route.ts` (email logic)
- **Email Function**: `sendEmails()` starting at line ~420
- **Environment**: `.env.local` (Postmark token)

## Summary

✅ Sales team gets detailed notifications  
✅ Users receive professional confirmation  
✅ Non-blocking implementation  
✅ Graceful error handling  
✅ HTML + Plain text versions  
✅ Personalized content  
✅ Safe for testing (uses dev@agentico.com.au)  
✅ Production ready  

---

**Implementation Date**: October 30, 2025  
**Dependencies**: Postmark (already installed)  
**Status**: Ready for testing ✅

