# Quick Start: Lead Evaluation System

## What You Get

When someone submits the contact form, the system automatically:

1. ✅ **Scores the lead** (Low/Medium/High priority)
2. 🌐 **Checks their website** and social media presence
3. 🤖 **Researches their industry** using AI (optional)
4. 📄 **Creates custom style guides** for them (optional)
5. 📧 **Sends 2 emails** to the customer:
   - Instant confirmation (immediate)
   - Detailed analysis with free style guides (30 mins later)
6. 📩 **Sends sales notification** with full evaluation to your team

## Setup (5 minutes)

### Step 1: Required Variables

Add to your `.env.local`:

```env
# Already configured (you should have these)
NOTION_API_TOKEN=secret_your_token
POSTMARK_API_TOKEN=your_token
```

✅ If these are already working, you're good to go with basic scoring!

### Step 2: Enable AI Features (Optional but Awesome)

Add OpenAI key for AI research and style guides:

```env
OPENAI_API_KEY=sk-your_openai_key_here
```

Get your key at: https://platform.openai.com/api-keys

**Cost**: ~$0.10-0.30 per lead (GPT-4 usage)

### Step 3: Enable Style Guide Storage (Optional)

Create two databases in Notion:

1. **Company Style Guides**
   - Properties: Name (title), Client (relation), Status (select), Created Date (date)
   
2. **Contact Style Guides**  
   - Properties: Name (title), Client (relation), Status (select), Created Date (date)

Add database IDs to `.env.local`:

```env
NOTION_COMPANY_STYLE_GUIDES_DB_ID=your_db_id_here
NOTION_CONTACT_STYLE_GUIDES_DB_ID=your_db_id_here
```

### Step 4: Test It!

1. Restart your dev server: `npm run dev`
2. Fill out the contact form
3. Check your email for instant confirmation
4. Wait 30 seconds, check for detailed analysis email
5. Check sales@ for the notification with full evaluation

## What Gets Scored

### High Priority Lead (70%+)
- Budget: $50k+ 💰
- Timeline: Immediate ⏱️
- Multiple project ideas 📋
- Large team/business 👥
- Detailed submission 📝

### Medium Priority Lead (45-69%)
- Budget: $10k-50k
- Timeline: 1-6 months
- Some project ideas
- Moderate business size
- Good detail level

### Low Priority Lead (<45%)
- Budget: Under $10k
- Timeline: 6+ months
- No clear projects
- Small business
- Minimal detail

## Email Examples

### Customer Gets:

**Email 1 (Instant):**
```
✓ Received! Analyzing your inquiry now...

What's happening:
1. ✅ Received
2. 🔍 Analyzing  
3. 📊 Preparing
4. 📧 Coming Soon (detailed email in 15-30 mins)
```

**Email 2 (After Processing):**
```
Your Personalized AI Automation Analysis

📊 Lead Quality: High (103/140 - 74%)
🌐 Digital Maturity: High
🎯 Top 5 Automation Opportunities
💰 Estimated ROI & Payback Period
🎁 Your Free Style Guides (links)
📅 Book a Call / Contact Options
```

### Sales Team Gets:

```
🔥 HIGH Priority Lead - BuildRight Constructions ($25k-50k)

Lead Score: 103/140 (74%)
🎯 HIGH PRIORITY - Strong potential, follow up immediately!

[Complete score breakdown]
[All insights and opportunities]
[Web presence analysis]
[AI research summary]
[Full customer submission]
```

## What Happens Without Optional Features?

| Feature | If Not Configured | Impact |
|---------|------------------|---------|
| OpenAI | ✅ Still works | No AI research, no style guides |
| Style Guide DBs | ✅ Still works | Style guides not saved to Notion |
| Postmark | ⚠️ Required | Emails won't send |
| Notion | ⚠️ Required | Data won't save |

**Bottom line**: Even without OpenAI, you get:
- Lead scoring (all 8 factors)
- Web presence analysis
- Priority rating
- Insights and red flags
- Email notifications

## Customization

### Change Scoring Weights

Edit `src/lib/lead-evaluation/scoring.ts`:

```typescript
// Change budget scoring
const budgetScores = {
  'under_10k': { score: 10, reason: '...' },
  // Modify scores here
};
```

### Change Lead Thresholds

```typescript
// In scoring.ts
if (percentage >= 70) {
  rating = 'High';
} else if (percentage >= 45) {
  rating = 'Medium';
} else {
  rating = 'Low';
}
```

### Customize Emails

Edit templates in `src/lib/email-templates/`:
- `instant-confirmation.ts` - First email
- `detailed-analysis.ts` - Second email with analysis
- `sales-notification.ts` - Sales team email

### Add More Scoring Factors

Add to `src/lib/lead-evaluation/scoring.ts`:

```typescript
function evaluateYourFactor(data: ContactFormData): { score: number; reason: string } {
  // Your logic
  return { score: 10, reason: 'Explanation' };
}

// Add to breakdown in evaluateLead()
```

## Monitoring

Watch your logs for:

```
Starting lead evaluation for BuildRight Constructions...
Evaluating lead score...
Lead score: High (103/140)
Evaluating web presence...
Web presence: High (85/100)
Performing AI research...
AI research completed
Generating style guides...
Style guides saved to Notion
Sending emails...
Lead evaluation completed. Success: true
```

## Troubleshooting

### No AI research happening
- Check `OPENAI_API_KEY` is set
- Verify GPT-4 access on your account
- Check OpenAI usage limits

### Style guides not saving
- Check Notion database IDs are correct
- Verify databases are shared with integration
- Check property names match exactly

### Emails not sending
- Verify `POSTMARK_API_TOKEN` is set
- Check sender domain is verified
- Look for errors in console

### Website checks failing
- This is normal for some sites (they block bots)
- Doesn't stop the evaluation
- Still provides useful data

## Performance

- **Instant confirmation**: <1 second ⚡
- **Basic scoring**: ~100ms
- **Web checks**: 2-5 seconds
- **AI research**: 10-20 seconds (if enabled)
- **Style guides**: 15-30 seconds (if enabled)
- **Total**: 30-60 seconds

User sees instant feedback, then gets detailed analysis shortly after.

## Next Steps

1. ✅ Set up required variables (Notion, Postmark)
2. 🎯 Test with a form submission
3. 🚀 Enable OpenAI for AI features (optional)
4. 📊 Monitor lead scores and adjust thresholds
5. 🎨 Customize email templates to match your brand
6. 📈 Track which lead scores convert best

## Need Help?

- Full documentation: [LEAD-EVALUATION-SYSTEM.md](LEAD-EVALUATION-SYSTEM.md)
- Environment setup: [ENV-VARIABLES.md](ENV-VARIABLES.md)
- Email setup: [EMAIL-NOTIFICATION-SETUP.md](EMAIL-NOTIFICATION-SETUP.md)
- Code reference: `src/lib/lead-evaluation/README.md`

## Cost Estimate

**With OpenAI enabled:**
- Per lead: $0.10-0.30 (GPT-4 API usage)
- 100 leads/month: ~$10-30/month
- Savings from better lead qualification: Priceless 😉

**Without OpenAI:**
- Free (just uses your existing Notion/Postmark subscriptions)
- Still get comprehensive lead scoring

