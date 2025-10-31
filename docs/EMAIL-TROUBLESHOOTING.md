# Email Troubleshooting Guide

This guide helps you diagnose and fix issues with emails not being sent from the Agentico contact form.

## Quick Diagnosis

Run this diagnostic script to check your configuration:

```bash
# Check configuration
node scripts/check-email-config.mjs

# Send a test email
TEST_EMAIL=your@email.com node scripts/check-email-config.mjs
```

## Common Issues & Solutions

### 1. Emails Work in Dev but NOT in Production

**Most Common Cause:** Missing `POSTMARK_API_TOKEN` environment variable in production.

#### ✅ Solution:

1. **Get your Postmark API token:**
   - Go to https://account.postmarkapp.com/servers
   - Select your server (or create one)
   - Copy the **Server API Token**

2. **Add to production environment:**
   
   **Vercel:**
   ```bash
   vercel env add POSTMARK_API_TOKEN
   # Paste your token when prompted
   # Select Production environment
   ```
   
   Or via Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add `POSTMARK_API_TOKEN` with your token value
   - Select "Production" environment
   - Redeploy your application

   **Netlify:**
   ```bash
   netlify env:set POSTMARK_API_TOKEN your-token-here
   ```
   
   Or via Netlify Dashboard:
   - Go to Site Settings → Environment Variables
   - Add `POSTMARK_API_TOKEN`
   - Redeploy

   **AWS / Other:**
   - Add `POSTMARK_API_TOKEN` to your environment configuration
   - Restart/redeploy your application

3. **Verify it's set:**
   - Check your deployment logs for `[EMAIL]` messages
   - You should see "Sending instant confirmation..." messages
   - If you see "POSTMARK_API_TOKEN not configured", it's not set correctly

---

### 2. "Sender Signature Not Verified" Error

**Symptom:** Logs show `Error 406` or "You must verify the sender signature"

#### ✅ Solution:

1. **Verify your sender domain:**
   - Go to https://account.postmarkapp.com/signature_domains
   - Click "Add Domain"
   - Enter `agentico.com.au`
   - Add the DNS records to your domain registrar
   - Wait for verification (usually 5-15 minutes)

2. **Or verify individual email addresses:**
   - Go to https://account.postmarkapp.com/signature_domains
   - Click "Add Signature"
   - Enter each email:
     - `alex@agentico.com.au`
     - `sales@agentico.com.au`
     - `rob@agentico.com.au`
   - Confirm via email link

---

### 3. Silent Failures (No Errors, No Emails)

**Symptom:** Form submits successfully but no emails are sent and no errors logged.

#### ✅ Solution:

**After the latest update**, all email operations now log to console with `[EMAIL]` prefix.

Check your production logs for these messages:

```
[CONTACT API] Starting lead evaluation for Company Name (email@example.com)
[EMAIL] Sending instant confirmation to email@example.com...
[EMAIL] ✓ Instant confirmation sent successfully
[EMAIL] Sending sales notification for Company Name...
[EMAIL] ✓ Sales notification sent successfully
```

**If you see nothing:**
- Environment variable is not set in production
- Application didn't restart after adding environment variables

**If you see errors:**
- Follow the error message guidance
- Common errors listed below

---

### 4. Network/Firewall Issues

**Symptom:** `ECONNREFUSED`, `ENOTFOUND`, or timeout errors

#### ✅ Solution:

1. **Check if your hosting platform blocks outbound SMTP:**
   - Most platforms (Vercel, Netlify, AWS) allow it
   - Some shared hosting blocks port 587/465
   - Postmark uses HTTPS API (port 443) - should work everywhere

2. **Verify Postmark service status:**
   - Check https://status.postmarkapp.com/

3. **Test from your server:**
   ```bash
   curl https://api.postmarkapp.com/server
   ```
   - Should return API response
   - If it fails, network is blocked

---

### 5. Invalid API Token Error

**Symptom:** `401 Unauthorized` or "Invalid API token"

#### ✅ Solution:

1. **Verify token format:**
   - Should be alphanumeric (not starting with `secret_`)
   - Get from: https://account.postmarkapp.com/servers
   - Select your server → copy "Server API Token"

2. **Common mistakes:**
   - Using Account API token instead of Server API token ❌
   - Including quotes in environment variable ❌
   - Extra spaces before/after token ❌

3. **Test the token:**
   ```bash
   POSTMARK_API_TOKEN=your-token node scripts/check-email-config.mjs
   ```

---

## Checking Production Logs

### Vercel

```bash
# View real-time logs
vercel logs --follow

# View recent logs
vercel logs
```

Look for `[EMAIL]` messages in the logs.

### Netlify

```bash
# View function logs
netlify functions:log contact

# Or via dashboard
# Go to Functions → contact → Logs
```

### AWS CloudWatch

```bash
# View logs
aws logs tail /aws/lambda/your-function-name --follow
```

---

## Email Flow Diagram

```
User submits form
    ↓
POST /api/contact
    ↓
Check POSTMARK_API_TOKEN ←─── ❌ If missing: Silent failure (now logged)
    ↓
Save to Notion
    ↓
evaluateAndProcessLead() ←──── Runs in background
    ↓
    ├─→ sendInstantConfirmation() ──→ Customer email
    ├─→ Lead scoring & evaluation
    └─→ sendSalesNotification() ──→ sales@agentico.com.au
```

---

## Detailed Log Messages

With the latest updates, you'll see these log messages:

### ✅ Success Messages

```
[CONTACT API] Starting lead evaluation for BuildRight Constructions (mike@example.com)
[EMAIL] Sending instant confirmation to mike@example.com...
[EMAIL] ✓ Instant confirmation sent successfully to mike@example.com
[EMAIL] Sending sales notification for BuildRight Constructions...
[EMAIL] ✓ Sales notification sent successfully for BuildRight Constructions
```

### ❌ Error Messages

**Missing API Token:**
```
[EMAIL] POSTMARK_API_TOKEN not configured - instant confirmation email NOT sent
[EMAIL] Would have sent to: mike@example.com
```
**Fix:** Add `POSTMARK_API_TOKEN` to production environment

**Unverified Sender:**
```
[EMAIL] ✗ Failed to send instant confirmation
[EMAIL] Error message: You must verify the sender signature
```
**Fix:** Verify sender domain at https://account.postmarkapp.com/signature_domains

**Network Error:**
```
[EMAIL] ✗ Failed to send instant confirmation
[EMAIL] Error message: getaddrinfo ENOTFOUND api.postmarkapp.com
```
**Fix:** Check network/firewall settings

---

## Test Email Sending

### From Local Development

```bash
# Load your .env.local
TEST_EMAIL=your@email.com node scripts/check-email-config.mjs
```

### From Production (if you have SSH access)

```bash
# Set environment and test
export POSTMARK_API_TOKEN=your-token
TEST_EMAIL=your@email.com node scripts/check-email-config.mjs
```

### Manual Test with cURL

```bash
curl "https://api.postmarkapp.com/email" \
  -X POST \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "X-Postmark-Server-Token: YOUR_SERVER_TOKEN" \
  -d '{
    "From": "alex@agentico.com.au",
    "To": "your@email.com",
    "Subject": "Test Email",
    "TextBody": "This is a test",
    "MessageStream": "outbound"
  }'
```

Expected response:
```json
{
  "To": "your@email.com",
  "SubmittedAt": "2024-01-01T12:00:00Z",
  "MessageID": "xxx-xxx-xxx",
  "ErrorCode": 0,
  "Message": "OK"
}
```

---

## Environment Variable Checklist

✅ **Required:**
- [ ] `POSTMARK_API_TOKEN` - Your Postmark Server API token

✅ **Recommended:**
- [ ] `OPENAI_API_KEY` - For AI research (optional, but emails will be simpler without it)
- [ ] `NOTION_API_TOKEN` - For saving to Notion (optional for emails)

✅ **Production-Specific:**
- [ ] Environment variables set in deployment platform
- [ ] Application redeployed after adding variables
- [ ] Variables don't contain quotes or extra spaces

---

## Postmark Dashboard Checks

1. **Server Status:**
   - https://account.postmarkapp.com/servers
   - Server should be active
   - Check message activity

2. **Sender Signatures:**
   - https://account.postmarkapp.com/signature_domains
   - `agentico.com.au` should be verified (green checkmark)
   - Or individual emails verified

3. **Message Streams:**
   - Default "outbound" stream should exist
   - Check recent activity

4. **Activity:**
   - https://account.postmarkapp.com/servers/[your-server]/streams/outbound/activity
   - Should show sent emails
   - Check for bounces or failures

---

## Still Having Issues?

### 1. Enable Maximum Logging

All logging is now enabled by default. Check your production logs for `[EMAIL]` prefixed messages.

### 2. Test Locally First

```bash
# Use test data from the form
npm run dev

# Fill form with test data
# Check terminal for [EMAIL] messages
```

### 3. Compare Dev vs Production

**In Dev:**
```bash
npm run dev
# Submit form
# Check terminal for [EMAIL] messages
```

**In Production:**
```bash
# Check deployment logs
vercel logs --follow  # or equivalent for your platform
# Submit form
# Compare [EMAIL] messages
```

### 4. Contact Support

If all else fails:

**Postmark Support:**
- https://postmarkapp.com/support
- Include: Server ID, error messages, timestamps

**Agentico Issues:**
- Check GitHub issues
- Include: logs with `[EMAIL]` messages, platform, configuration

---

## Quick Reference

| Issue | Log Message | Fix |
|-------|-------------|-----|
| Missing token | `POSTMARK_API_TOKEN not configured` | Add to production env vars |
| Unverified sender | `You must verify the sender signature` | Verify domain in Postmark |
| Invalid token | `401 Unauthorized` | Check token from server settings |
| Network error | `ECONNREFUSED` or `ENOTFOUND` | Check firewall/network |
| No logs | (silence) | Check env vars & restart app |

---

## Prevention Checklist

Before deploying to production:

- [ ] Run `node scripts/check-email-config.mjs` locally
- [ ] Verify `POSTMARK_API_TOKEN` is set in production
- [ ] Verify sender domain in Postmark dashboard
- [ ] Send test email successfully
- [ ] Deploy and check logs for `[EMAIL]` messages
- [ ] Submit test form in production
- [ ] Verify emails received

---

## Related Documentation

- [EMAIL-NOTIFICATION-SETUP.md](./EMAIL-NOTIFICATION-SETUP.md) - Initial setup guide
- [ENV-VARIABLES.md](./ENV-VARIABLES.md) - All environment variables
- [CONTACT-FORM-COMPLETE-SUMMARY.md](./CONTACT-FORM-COMPLETE-SUMMARY.md) - Form overview

