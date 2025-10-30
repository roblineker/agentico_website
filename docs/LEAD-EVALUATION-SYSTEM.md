# Lead Evaluation System

## Overview

The Lead Evaluation System is a comprehensive AI-powered solution that automatically evaluates, scores, and processes incoming leads from the contact form. It provides detailed insights, generates custom resources, and orchestrates a multi-stage email workflow.

## Features

### 1. **Lead Scoring (140 points total)**

The system evaluates leads based on 8 key factors:

#### Primary Factors (100 points)
- **Budget (30 points)**: Evaluates the stated budget range
  - Under $10k = 10 points
  - $10k-$25k = 20 points
  - $25k-$50k = 25 points
  - $50k-$100k = 28 points
  - $100k+ = 30 points
  - Not sure = 15 points

- **Project Count (25 points)**: Assesses commitment level based on defined projects
  - 2+ specific project ideas = 25 points
  - 1 project + detailed goals = 20 points
  - Multiple goals + detailed processes = 15 points
  - Limited scope = 0 points

- **Timeframe (20 points)**: Measures urgency
  - Immediate = 20 points
  - 1-3 months = 15 points
  - 3-6 months = 10 points
  - 6+ months = 5 points

- **Call Intent (25 points)**: Predicts likelihood of scheduling a call
  - Based on urgency, budget, and submission detail
  - 0-20 points based on intent signals

#### Additional Factors (40 points)
- **Business Size (10 points)**: Larger businesses typically have bigger budgets
- **Urgency Signals (10 points)**: Detects pain keywords and urgency indicators
- **Clarity & Detail (10 points)**: Rewards detailed, well-thought-out submissions
- **Integration Complexity (10 points)**: More complexity = more opportunity

### 2. **Web Presence Analysis**

Evaluates the company's digital maturity:

- **Website Analysis**
  - Accessibility check
  - HTTPS/SSL verification
  - Response time testing
  
- **Social Media Presence**
  - Platform identification (LinkedIn, Facebook, Twitter, etc.)
  - URL validation
  - Platform count assessment

- **Digital Maturity Rating**
  - Low (0-39 points): Minimal online presence
  - Medium (40-74 points): Moderate digital presence
  - High (75-100 points): Strong established presence

### 3. **AI-Powered Deep Research**

Uses OpenAI GPT-4 to generate:

- **Industry Insights**: Specific challenges and opportunities in their industry
- **Competitive Analysis**: How competitors use automation
- **Automation Opportunities**: 5-7 ranked opportunities
- **ROI Estimation**: Realistic projections with payback periods
- **Implementation Strategy**: Phased approach recommendations
- **Potential Challenges**: Technical and organizational hurdles
- **Recommended Approach**: How to engage with this specific lead

### 4. **Style Guide Generation**

Creates two custom style guides:

#### Company Style Guide
- Voice & tone guidelines
- Brand personality traits
- Industry-specific language
- Communication dos and don'ts
- Example phrases and templates
- Target audience communication style

#### Contact Style Guide
- First contact best practices
- Discovery call framework
- Email communication templates
- Objection handling scripts
- Follow-up sequences
- Industry-specific terminology
- Value proposition framing

### 5. **Multi-Stage Email Workflow**

#### Stage 1: Instant Confirmation (Immediate)
Sent immediately upon form submission:
- Confirms receipt
- Sets expectations
- Explains what's happening
- Provides booking link for impatient leads

#### Stage 2: Detailed Analysis (15-30 minutes later)
Sent after processing is complete:
- Full lead evaluation results
- Web presence analysis
- AI research insights
- Links to custom style guides
- Clear call-to-action options

#### Stage 3: Sales Notification (Immediate)
Sent to sales team with:
- Lead priority rating
- Complete score breakdown
- All insights and red flags
- Full customer submission details
- AI research summary

## Configuration

### Required Environment Variables

```env
# Notion (Required for style guides)
NOTION_API_TOKEN=secret_xxxxxxxxxxxxx
NOTION_COMPANY_STYLE_GUIDES_DB_ID=xxxxxxxxxxxxx
NOTION_CONTACT_STYLE_GUIDES_DB_ID=xxxxxxxxxxxxx

# OpenAI (Required for AI research and style guides)
OPENAI_API_KEY=sk-xxxxxxxxxxxxx

# Postmark (Required for emails)
POSTMARK_API_TOKEN=xxxxxxxxxxxxx
```

### Optional Environment Variables

If these are not configured, those features will be skipped gracefully:

```env
# N8N Webhooks (Optional)
N8N_TEST_WEBHOOK_URL=https://your-n8n.com/webhook/test
N8N_PROD_WEBHOOK_URL=https://your-n8n.com/webhook/prod
N8N_SEND_TO_BOTH=false
```

### Notion Database Setup

#### Company Style Guides Database
Required properties:
- `Name` (title): The style guide name
- `Client` (relation): Link to Clients database
- `Status` (select): Draft, In Review, Approved
- `Created Date` (date): When the guide was created

#### Contact Style Guides Database
Required properties:
- `Name` (title): The style guide name
- `Client` (relation): Link to Clients database
- `Status` (select): Draft, In Review, Approved
- `Created Date` (date): When the guide was created

## Lead Rating Thresholds

The system automatically categorizes leads:

- **High Priority**: 70%+ (98+ points)
  - Strong budget, clear projects, urgent timeline
  - Follow up immediately

- **Medium Priority**: 45-69% (63-97 points)
  - Moderate budget or good potential
  - Follow up within 24 hours

- **Low Priority**: <45% (<63 points)
  - Limited budget or unclear scope
  - Needs qualification call

## Insights Generated

### Key Insights
- Budget analysis and business maturity
- Industry-specific opportunities
- High-volume automation potential
- Team size and impact potential
- Timeline vs. feasibility analysis

### Red Flags
- Budget-scope mismatches
- Vague or incomplete submissions
- Urgency-timeline conflicts
- Success metric gaps
- Resource constraints for small businesses

### Opportunities
- Upsell potential
- Industry template opportunities
- High-ROI automation areas
- Quick win possibilities
- Integration opportunities

## Code Structure

```
src/lib/lead-evaluation/
├── index.ts                    # Main exports
├── orchestrator.ts            # Coordinates all evaluation steps
├── scoring.ts                 # Lead scoring logic
├── web-research.ts           # Web presence analysis
├── ai-research.ts            # OpenAI integration
└── notion-style-guides.ts    # Style guide Notion saving

src/lib/email-templates/
├── instant-confirmation.ts    # Stage 1 email
├── detailed-analysis.ts      # Stage 2 email  
├── sales-notification.ts     # Sales team email
└── user-confirmation.ts      # (Deprecated - now split into 2 stages)
```

## Usage

### In API Route (Automatic)

The system is automatically triggered when a contact form is submitted:

```typescript
import { evaluateAndProcessLead } from '@/lib/lead-evaluation';

// In your POST handler
const result = await evaluateAndProcessLead(formData, clientPageId);
```

### Manual Testing

For testing or manual evaluation:

```typescript
import { quickEvaluate } from '@/lib/lead-evaluation';

const { leadScore, webPresence } = await quickEvaluate(formData);
console.log(`Rating: ${leadScore.rating}`);
console.log(`Digital Maturity: ${webPresence.digitalMaturity}`);
```

## Error Handling

The system is designed to fail gracefully:

- **OpenAI not configured**: Skips AI research and style guides, continues with scoring
- **Notion not configured**: Skips style guide storage, continues with emails
- **Postmark not configured**: Logs warnings, saves data to Notion
- **Website inaccessible**: Notes in report, continues evaluation
- **Individual step failures**: Logged but don't stop the process

All errors are collected and reported in the `EvaluationResult`.

## Performance

- **Instant Confirmation**: Sent immediately (<1 second)
- **Lead Scoring**: ~100ms
- **Web Presence Check**: ~2-5 seconds
- **AI Research**: ~10-20 seconds (OpenAI API)
- **Style Guide Generation**: ~15-30 seconds (OpenAI API)
- **Total Processing Time**: 30-60 seconds

The instant confirmation ensures the user gets immediate feedback while the detailed analysis processes in the background.

## Monitoring

Check logs for:
```
Starting lead evaluation for [Company]...
Evaluating lead score...
Lead score: [High/Medium/Low] ([X]/140)
Evaluating web presence...
Web presence: [High/Medium/Low] ([X]/100)
Performing AI research...
AI research completed
Generating style guides...
Style guides saved to Notion
Sending detailed analysis email...
Sending sales notification...
Lead evaluation completed. Success: [true/false], Errors: [X]
```

## Future Enhancements

Potential improvements:
1. Add call scheduling option to the form (25 point scoring factor)
2. LinkedIn company profile enrichment
3. Industry-specific scoring adjustments
4. Historical lead conversion tracking
5. A/B testing of email templates
6. Integration with CRM for automatic lead assignment
7. Sentiment analysis of submission text
8. Competitor research automation
9. Custom industry playbooks
10. Multi-language support for international leads

## Troubleshooting

### OpenAI Errors
- Check API key validity
- Ensure sufficient API credits
- Monitor rate limits
- Review model availability

### Notion Errors  
- Verify database IDs are correct
- Check integration permissions
- Ensure required properties exist
- Validate relation connections

### Email Errors
- Confirm Postmark API token
- Check sender domain verification
- Review email templates for syntax errors
- Monitor bounce rates

### Web Research Timeouts
- Default timeout is 10 seconds
- Some websites may block automated requests
- CORS and security policies may interfere
- Consider using a proxy service for reliability

## Support

For issues or questions:
- Check logs in the API route
- Review environment variable configuration
- Test individual components separately
- Validate Notion database structure
- Confirm API keys and permissions

