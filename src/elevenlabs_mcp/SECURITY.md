# MCP Server Security

## Overview

Your Agentico MCP server **IS SECURED** with API key authentication. All endpoints require a valid API secret to access.

## Authentication Method

### Environment Variable

The server uses the `MCP_API_SECRET` environment variable for authentication:

- **Variable Name**: `MCP_API_SECRET`
- **Location**: Vercel environment variables + local `.env` file
- **Format**: String (any secure random string)
- **Required**: Yes (for production), Optional (for development with warning)

### How It Works

1. **Request**: Client sends request with `Authorization` header
2. **Validation**: Server checks the header against `MCP_API_SECRET`
3. **Response**: 
   - ✅ Valid → Returns requested data
   - ❌ Invalid → Returns 401 Unauthorized

### Supported Header Formats

The server accepts two header formats:

```bash
# Option 1: Bearer token (recommended)
Authorization: Bearer YOUR_API_SECRET_HERE

# Option 2: Direct token
Authorization: YOUR_API_SECRET_HERE
```

## Implementation Details

### Code Location

File: `src/app/api/mcp/route.ts`

### Authentication Function

```typescript
function validateAuth(request: NextRequest): { valid: boolean; error?: string } {
    // If MCP_API_SECRET is not set, warn but allow (for development)
    if (!MCP_API_SECRET) {
        console.warn('WARNING: MCP_API_SECRET is not set. Authentication is disabled.');
        return { valid: true };
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
        return { valid: false, error: 'Missing Authorization header' };
    }

    // Support both "Bearer TOKEN" and just "TOKEN" formats
    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : authHeader;

    if (token !== MCP_API_SECRET) {
        return { valid: false, error: 'Invalid API secret' };
    }

    return { valid: true };
}
```

### Protected Endpoints

All endpoints are protected:

- **GET `/api/mcp`** - Health check and SSE
- **POST `/api/mcp`** - JSON-RPC 2.0 requests
- **OPTIONS `/api/mcp`** - CORS preflight

### Error Responses

**401 Unauthorized (GET request):**
```json
{
  "error": "Unauthorized",
  "message": "Missing Authorization header"
}
```

**401 Unauthorized (JSON-RPC request):**
```json
{
  "jsonrpc": "2.0",
  "id": null,
  "error": {
    "code": -32000,
    "message": "Unauthorized: Invalid API secret"
  }
}
```

## Setting Up

### Step 1: Generate API Secret

Create a strong random secret:

```bash
# Option 1: Using openssl
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Use a password generator
# Generate a 32+ character random string
```

### Step 2: Add to Environment Variables

**Local Development** (`.env.local`):
```bash
MCP_API_SECRET=your-generated-secret-here
```

**Vercel** (Dashboard):
1. Go to your project settings
2. Navigate to Environment Variables
3. Add variable:
   - **Key**: `MCP_API_SECRET`
   - **Value**: Your generated secret
   - **Environments**: Production, Preview, Development

### Step 3: Configure ElevenLabs

When adding the MCP server to ElevenLabs:

**Option A: Secret Token Field**
```
Server URL: https://www.agentico.com.au/api/mcp
Secret Token: YOUR_MCP_API_SECRET_VALUE
```

**Option B: HTTP Headers**
```json
{
  "Authorization": "Bearer YOUR_MCP_API_SECRET_VALUE"
}
```

## Testing Authentication

### Test With Valid Secret

```bash
# Set your API secret
export MCP_API_SECRET="your-secret-here"

# Test request
curl -X POST https://www.agentico.com.au/api/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MCP_API_SECRET" \
  -d '{"jsonrpc":"2.0","id":1,"method":"ping"}'
```

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {}
}
```

### Test Without Secret (Should Fail)

```bash
curl -X POST https://www.agentico.com.au/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"ping"}'
```

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "id": null,
  "error": {
    "code": -32000,
    "message": "Unauthorized: Missing Authorization header"
  }
}
```

### Test With Invalid Secret (Should Fail)

```bash
curl -X POST https://www.agentico.com.au/api/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wrong-secret" \
  -d '{"jsonrpc":"2.0","id":1,"method":"ping"}'
```

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "id": null,
  "error": {
    "code": -32000,
    "message": "Unauthorized: Invalid API secret"
  }
}
```

## Development Mode

### Behavior Without MCP_API_SECRET

If `MCP_API_SECRET` is not set (development only):

1. ⚠️ Server logs warning: `WARNING: MCP_API_SECRET is not set. Authentication is disabled.`
2. ✅ All requests are allowed (no authentication required)
3. 🚨 **DO NOT** use this in production

### Purpose

- Allows local testing without setting up secrets
- Makes initial development easier
- Clear warning so you don't forget to add it later

## Security Best Practices

### ✅ Do This

1. **Use Strong Secrets**
   - Minimum 32 characters
   - Random, cryptographically secure
   - Use generator tools (not keyboard mashing)

2. **Rotate Secrets Periodically**
   - Change every 90 days (recommended)
   - Change immediately if compromised
   - Update both Vercel and ElevenLabs

3. **Different Secrets Per Environment**
   ```
   Development:  MCP_API_SECRET_DEV
   Staging:      MCP_API_SECRET_STAGING
   Production:   MCP_API_SECRET_PROD
   ```

4. **Store Securely**
   - Use environment variables (never commit to git)
   - Use secret management tools (Vercel, 1Password, etc.)
   - Limit access to team members who need it

5. **Monitor Access**
   - Check Vercel logs for unauthorized attempts
   - Set up alerts for 401 responses
   - Review access patterns regularly

### ❌ Don't Do This

1. **Never Commit Secrets to Git**
   ```bash
   # BAD - Don't do this!
   # .env
   MCP_API_SECRET=abc123
   ```

2. **Don't Use Weak Secrets**
   ```bash
   # BAD - Too weak!
   MCP_API_SECRET=password123
   MCP_API_SECRET=secret
   ```

3. **Don't Share Secrets via Insecure Channels**
   - ❌ Email
   - ❌ Slack (unencrypted)
   - ❌ Text message
   - ✅ Use secure sharing tools (1Password, Bitwarden)

4. **Don't Use Same Secret Everywhere**
   - Each environment should have unique secrets
   - Each service should have unique secrets

5. **Don't Hardcode Secrets**
   ```typescript
   // BAD - Never do this!
   const API_SECRET = "abc123";
   ```

## Threat Model

### What This Protects Against

✅ **Unauthorized Access**
- Random bots scanning the internet
- Malicious actors trying to access your data
- Accidental public exposure

✅ **API Abuse**
- Rate limiting (can be added later)
- Resource exhaustion
- Cost attacks

✅ **Data Leakage**
- System prompts (though not highly sensitive)
- Business knowledge bases
- Demo data

### What This Does NOT Protect Against

❌ **Compromised ElevenLabs Account**
- If someone has access to your ElevenLabs account, they have the secret
- Use strong ElevenLabs password + 2FA

❌ **Man-in-the-Middle (without HTTPS)**
- Always use HTTPS (which you do with Vercel)
- Don't disable SSL/TLS

❌ **Server-Side Vulnerabilities**
- Keep dependencies updated
- Monitor for security advisories
- Use Vercel's security features

## Advanced Security (Optional)

### Additional Layers You Can Add

1. **IP Whitelisting**
   ```typescript
   // Only allow requests from ElevenLabs IPs
   const ALLOWED_IPS = ['1.2.3.4', '5.6.7.8'];
   ```

2. **Rate Limiting**
   ```typescript
   // Limit requests per IP per minute
   import rateLimit from '@vercel/rate-limit';
   ```

3. **Request Signing**
   ```typescript
   // HMAC-based request signing for extra security
   ```

4. **API Key Rotation**
   ```typescript
   // Support multiple valid keys during rotation period
   ```

5. **Audit Logging**
   ```typescript
   // Log all requests to a database or service
   ```

## Troubleshooting

### ElevenLabs Can't Connect

**Problem**: "Failed to connect to MCP server"

**Solutions**:
1. Verify `MCP_API_SECRET` is set in Vercel
2. Check the secret value matches exactly (no extra spaces)
3. Ensure ElevenLabs has the correct secret configured
4. Test with curl to verify server is working

### Authentication Fails Locally

**Problem**: 401 Unauthorized when testing locally

**Solutions**:
1. Check `.env.local` has `MCP_API_SECRET`
2. Restart Next.js dev server after adding variable
3. Verify environment variable is loaded: `console.log(process.env.MCP_API_SECRET)`

### Different Secrets in Dev/Prod

**Problem**: Works locally but not in production

**Solutions**:
1. Ensure Vercel has the variable set
2. Check variable is set for correct environment (Production)
3. Redeploy after adding variable
4. Verify with: `GET /api/mcp` (should work if deployed)

## Compliance

### Data Protection

- System prompt: Not personally identifiable
- Knowledge bases: Demo/example data only
- No sensitive user data stored

### GDPR / Privacy

- No personal data collection
- No tracking or analytics
- No cookies or session storage

### Audit Trail

Current: Vercel's built-in logs

Recommended for production:
- Add structured logging
- Store in a dedicated logging service
- Set up alerts for security events

## Summary

✅ **Your MCP server IS SECURE:**
- API key authentication required
- Environment variable based configuration
- Support for Bearer token format
- Clear error messages
- Development mode with warnings

🔐 **Best Practices:**
- Strong, random API secrets
- Stored in environment variables
- Different secrets per environment
- Regular rotation schedule

📊 **Next Steps:**
1. Verify `MCP_API_SECRET` is set in Vercel
2. Test authentication with curl
3. Configure ElevenLabs with the secret
4. Monitor access logs
5. Set rotation reminder (90 days)

---

**Questions?** Check the [main README](./README.md) or run the test scripts to verify authentication is working.

