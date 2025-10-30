# Lead Evaluation System

## Quick Start

This module automatically evaluates and processes leads from the contact form with AI-powered insights.

### Basic Usage

```typescript
import { evaluateAndProcessLead } from '@/lib/lead-evaluation';

// Full evaluation with emails and style guides
const result = await evaluateAndProcessLead(formData, clientPageId);

// Quick evaluation (scoring only, no emails)
import { quickEvaluate } from '@/lib/lead-evaluation';
const { leadScore, webPresence } = await quickEvaluate(formData);
```

### What It Does

1. **Scores the lead** (0-140 points, categorized as Low/Medium/High)
2. **Analyzes web presence** (website accessibility, social media, digital maturity)
3. **Performs AI research** (industry insights, ROI estimation, opportunities)
4. **Creates/finds client** (in Notion Clients database)
5. **Generates style guides** (company & contact communication guides)
6. **Creates proposal with estimates** (auto-generates proposal and estimate entries)
7. **Saves to Notion** (stores everything in linked databases)
8. **Sends emails** (instant confirmation + detailed analysis)

### Features

#### Lead Scoring (140 points)
- Budget (30 pts): Higher budget = higher score
- Project Count (25 pts): More defined projects = more committed
- Timeframe (20 pts): Immediate timeline = highest urgency
- Call Intent (25 pts): Inferred from submission quality
- Business Size (10 pts): Larger businesses = bigger opportunities
- Urgency (10 pts): Pain keyword detection
- Clarity (10 pts): Detail and thoroughness of submission
- Integration Complexity (10 pts): More integrations = more opportunity

#### Web Presence Analysis (100 points)
- Website accessibility and HTTPS check
- Social media platform identification
- Digital maturity assessment (Low/Medium/High)
- Recommendations based on online presence

#### AI Research (Optional, requires OpenAI)
- Industry-specific insights
- Competitive analysis
- Top 5-7 automation opportunities
- ROI estimation with payback period
- Implementation strategy recommendations
- Potential challenges identification
- Customized engagement approach

#### Style Guide Generation (Optional, requires OpenAI)
- **Company Style Guide**: Voice, tone, brand personality
- **Contact Style Guide**: Communication best practices, templates

#### Proposal & Estimate Creation (Automatic)
- **Client Creation**: Automatically creates or finds client in Notion
- **Proposal Generation**: Creates draft proposal with AI insights
- **Estimate Creation**: Generates estimate for overall project + each project idea
- **Automatic Linking**: All entities properly linked in Notion

### Configuration

Required environment variables:
```env
NOTION_API_TOKEN=secret_xxx                           # Required for Notion integration
POSTMARK_API_TOKEN=xxx                               # Required for emails
OPENAI_API_KEY=sk-xxx                                # Optional, enables AI features

# Database IDs (Optional but recommended)
NOTION_COMPANY_STYLE_GUIDES_DB_ID=b919f771bec746dd8ebdc956ec618176
NOTION_CONTACT_STYLE_GUIDES_DB_ID=2f196f71d920429e9a7318f43b154954
NOTION_PROPOSALS_DB_ID=9bdf517b89d147a89963628d398870cc
NOTION_ESTIMATES_DB_ID=28753ceefab080e2842ccd40eaf73efe
NOTION_CLIENTS_DB_ID=28753ceefab08000a95cea49e7bf1762
```

### Notion Database Schema Requirements

The style guide databases should have the following properties:

**Client Style Guides Database** (`NOTION_COMPANY_STYLE_GUIDES_DB_ID`):
- `Style Guide Name` (Title) - Required
- `Status` (Select) - Options: Draft, In Progress, Complete, Needs Review
- `Client` (Relation) - Link to Clients database (optional)
- `Voice & Tone Profile` (Rich Text)
- `Key Phrases & Vocabulary` (Rich Text)
- `Content Structure` (Rich Text)
- `Content Themes & Pillars` (Rich Text)
- `Practical Examples` (Rich Text)
- `AI Tells to Avoid` (Rich Text)
- `Source Materials` (URL)

**Contact Style Guides Database** (`NOTION_CONTACT_STYLE_GUIDES_DB_ID`):
- `Style Guide Name` (Title) - Required
- `Status` (Select) - Options: Draft, In Progress, Complete, Needs Review
- `Contact` (Relation) - Link to Contacts database (optional)
- `Voice & Tone Profile` (Rich Text)
- `Key Phrases & Vocabulary` (Rich Text)
- `Content Structure` (Rich Text)
- `Content Themes & Pillars` (Rich Text)
- `Practical Examples` (Rich Text)
- `AI Tells to Avoid` (Rich Text)
- `Source Materials` (URL)

The system will automatically parse AI-generated style guide content and populate these structured fields. The full content is also saved as page blocks for reference.

### Module Structure

```
lead-evaluation/
├── index.ts                 # Exports
├── orchestrator.ts         # Main coordination logic
├── scoring.ts              # Lead scoring algorithm
├── web-research.ts         # Web presence analysis
├── ai-research.ts          # OpenAI integration
├── notion-style-guides.ts  # Notion style guide storage
└── README.md              # This file
```

### Email Workflow

1. **Instant Confirmation** (immediate)
   - "Thanks for reaching out!"
   - What's happening next
   - Quick summary of their inquiry
   - Booking link for impatient leads

2. **Detailed Analysis** (15-30 minutes later)
   - Full lead evaluation
   - AI research insights
   - Links to custom style guides
   - Multiple call-to-action options

3. **Sales Notification** (immediate)
   - Priority rating prominently displayed
   - Complete score breakdown with reasoning
   - All insights, opportunities, and red flags
   - Full customer submission details

### Error Handling

The system fails gracefully:
- Missing OpenAI → Skips AI research, continues with scoring
- Missing Notion databases → Skips style guide storage
- Missing Postmark → Logs warnings, saves data
- Website unreachable → Notes in report, continues

All errors are collected and returned in `EvaluationResult.errors`.

### Performance

- Instant confirmation: <1 second
- Lead scoring: ~100ms
- Web presence check: 2-5 seconds
- AI research: 10-20 seconds
- Style guides: 15-30 seconds
- Total: 30-60 seconds

### Testing

```typescript
// Test scoring only
import { evaluateLead } from '@/lib/lead-evaluation';
const score = evaluateLead(testData);
console.log(`Rating: ${score.rating} (${score.totalScore}/140)`);

// Test web presence
import { evaluateWebPresence } from '@/lib/lead-evaluation';
const web = await evaluateWebPresence(testData);
console.log(`Digital Maturity: ${web.digitalMaturity}`);

// Test AI research
import { performDeepResearch } from '@/lib/lead-evaluation';
const research = await performDeepResearch(testData, score, web);
console.log(research?.industryInsights);
```

### Examples

#### Example High Priority Lead
- Budget: $50k-100k (28 points)
- Timeline: Immediate (20 points)
- 3 detailed project ideas (25 points)
- Large business (10 points)
- High urgency keywords (10 points)
- Very detailed submission (10 points)
- **Total: 103/140 (74%) = HIGH**

#### Example Medium Priority Lead
- Budget: $10k-25k (20 points)
- Timeline: 1-3 months (15 points)
- 1 project idea (20 points)
- Small business (5 points)
- Some urgency (5 points)
- Good detail (7 points)
- **Total: 72/140 (51%) = MEDIUM**

#### Example Low Priority Lead
- Budget: Under $10k (10 points)
- Timeline: 6+ months (5 points)
- No project ideas (0 points)
- Very small business (5 points)
- No urgency (0 points)
- Minimal detail (3 points)
- **Total: 23/140 (16%) = LOW**

### Monitoring

Check logs for progress:
```
Starting lead evaluation for [Company]...
Evaluating lead score...
Lead score: High (103/140)
Evaluating web presence...
Web presence: High (85/100)
Performing AI research...
AI research completed
Generating style guides...
Style guides saved to Notion
Sending detailed analysis email...
Sending sales notification...
Lead evaluation completed. Success: true, Errors: 0
```

### Troubleshooting

**No emails sent**
- Check POSTMARK_API_TOKEN is set
- Verify sender domain is verified in Postmark
- Check logs for specific email errors

**No AI research**
- Check OPENAI_API_KEY is set
- Verify you have GPT-4 access
- Check OpenAI API credits/usage limits

**Style guides not saved**
- Check NOTION_API_TOKEN is set
- Verify style guide database IDs are correct
- Ensure databases are shared with Notion integration
- Check database property schemas match requirements

**Website checks failing**
- Some sites block automated requests
- Timeouts after 10 seconds
- CORS policies may prevent access
- This is non-critical and won't stop the process

### Future Enhancements

- [ ] Add call scheduling field to form (25 point factor)
- [ ] LinkedIn company enrichment
- [ ] Industry-specific scoring weights
- [ ] Historical conversion tracking
- [ ] A/B test email templates
- [ ] Multi-language support
- [ ] Sentiment analysis
- [ ] Automated competitor research
- [ ] Custom industry playbooks

### Documentation

- [LEAD-EVALUATION-SYSTEM.md](../../../docs/LEAD-EVALUATION-SYSTEM.md) - Full documentation
- [ENV-VARIABLES.md](../../../docs/ENV-VARIABLES.md) - Environment setup
- [EMAIL-NOTIFICATION-SETUP.md](../../../docs/EMAIL-NOTIFICATION-SETUP.md) - Email configuration

