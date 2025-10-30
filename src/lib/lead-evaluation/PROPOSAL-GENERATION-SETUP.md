# Automatic Proposal & Estimate Generation

## Overview

The lead evaluation system now automatically creates **Proposals** and **Estimates** in Notion when a contact form is submitted. This creates a complete workflow from lead → client → proposal → estimates.

## What Gets Created

### 1. Client Entry
- **Database**: `💼 Clients`
- **Action**: Checks if client already exists by name, creates if not found
- **Properties Set**:
  - Name: Company name from form
  - Type: "Prospect"
  - Website: If provided in form
- **Linked To**: Style Guides, Proposals, Estimates

### 2. Proposal
- **Database**: `📋 Proposals`
- **Properties Set**:
  - Proposal Name: `{Company} - AI Automation Proposal`
  - Status: "Draft"
  - Proposal Date: Today's date
  - Client: Linked to client entry
  - Estimates: Linked to generated estimates
- **Page Content Includes**:
  - Project Overview (from form description)
  - Lead Quality Assessment (if scoring ran)
  - Automation Opportunities (from AI research)
  - Specific Project Ideas (from form)
  - Estimated ROI (from AI research)
  - Implementation Strategy (from AI research)
  - Success Metrics (from form)

### 3. Estimates
- **Database**: `💰 Estimates`
- **Number of Estimates**: 1 + number of project ideas
  1. Overall Project Estimate
  2. Individual estimate for each project idea (if any)
- **Properties Set**:
  - Name: `{Company} - {Project Name}`
  - Status: "Not started"
  - Estimate Date: Today's date
  - Proposals: Linked to parent proposal

## Database Relationships

```
Contact Form Submission
    ↓
💼 Client (created/found)
    ↓
├─→ 📝 Company Style Guide (linked to client)
├─→ 👤 Contact Style Guide (linked to client)
└─→ 📋 Proposal (linked to client)
        ↓
        └─→ 💰 Estimates (linked to proposal)
            ├─ Overall Project Estimate
            ├─ Project Idea 1 Estimate
            ├─ Project Idea 2 Estimate
            └─ ...
```

## Example Workflow

When someone submits the contact form:

1. **Form Data Captured**:
   - Company: "BuildRight Constructions"
   - Budget: $25k-50k
   - Timeline: 1-3 months
   - Project Ideas: 
     - AI Quote Generator (High priority)
     - Job Photo Management (Medium priority)

2. **System Creates**:
   - ✅ Client: "BuildRight Constructions" (if doesn't exist)
   - ✅ Proposal: "BuildRight Constructions - AI Automation Proposal" (Draft)
   - ✅ Estimates:
     1. "BuildRight Constructions - Overall Project Estimate"
     2. "BuildRight Constructions - AI Quote Generator"
     3. "BuildRight Constructions - Job Photo Management"

3. **All Linked**:
   - Proposal links to Client
   - Estimates link to Proposal
   - Style Guides link to Client

## Benefits

### For Sales Team
1. **Instant Structure**: Every lead immediately has a proposal started
2. **Pre-populated Content**: AI research and form data automatically added
3. **Ready to Edit**: Just need to add pricing and finalize
4. **Tracking**: All estimates linked so nothing gets lost

### For Operations
1. **No Manual Entry**: Eliminates copying form data into Notion
2. **Consistent Format**: Every proposal follows same structure
3. **Full Context**: Lead score and research included in proposal

### For Reporting
1. **Complete Pipeline**: See from first contact to proposal to estimates
2. **Conversion Tracking**: Track which leads convert to clients
3. **Estimate Analysis**: See which types of projects are most common

## Configuration

Add these environment variables to enable proposal/estimate generation:

```env
# Required
NOTION_API_TOKEN=secret_xxx

# Databases (these are your actual database IDs)
NOTION_CLIENTS_DB_ID=28753ceefab08000a95cea49e7bf1762
NOTION_PROPOSALS_DB_ID=9bdf517b89d147a89963628d398870cc
NOTION_ESTIMATES_DB_ID=28753ceefab080e2842ccd40eaf73efe
```

The system will automatically detect if these are configured and gracefully skip if not.

## Testing

To test the system:

1. Submit a contact form with test data
2. Check your Notion workspace:
   - Look in `💼 Clients` for the company
   - Look in `📋 Proposals` for the draft proposal
   - Look in `💰 Estimates` for the generated estimates
3. Verify all items are properly linked

## Monitoring

Check server logs for progress:
```
Creating/finding client...
Client ready: {Company Name}
Creating proposal and estimates...
Proposal created: {URL}
Estimates created: {Count} estimates
```

## Error Handling

If proposal/estimate creation fails:
- ✅ System continues with rest of workflow
- ✅ Error is logged but doesn't stop email sending
- ✅ Lead score and research still complete
- ⚠️ Check logs for specific error messages

Common issues:
- **"Database not configured"**: Add NOTION_PROPOSALS_DB_ID or NOTION_ESTIMATES_DB_ID
- **"Unauthorized"**: Check NOTION_API_TOKEN has access to databases
- **"Invalid property"**: Verify database schemas match expected format

## Customization

### Modify Proposal Content
Edit `src/lib/lead-evaluation/notion-proposals.ts` function `addProposalContent()` to change what gets added to the proposal page.

### Change Estimate Naming
Edit the `createEstimates()` function to customize estimate titles.

### Add Custom Fields
Extend the properties being set in `createProposal()` and `createEstimates()` to populate additional database fields.

## Future Enhancements

Potential improvements:
- [ ] AI-generated cost estimates based on project scope
- [ ] Automatic proposal templating with standard sections
- [ ] Budget allocation across estimates
- [ ] Timeline/Gantt chart generation
- [ ] Resource allocation suggestions
- [ ] Competitive pricing analysis
- [ ] ROI calculator integration

## Files Involved

- `src/lib/lead-evaluation/notion-proposals.ts` - Main proposal/estimate logic
- `src/lib/lead-evaluation/orchestrator.ts` - Integration into workflow
- `src/lib/lead-evaluation/index.ts` - Public API exports
- `src/lib/lead-evaluation/README.md` - User documentation
- `docs/ENV-VARIABLES.md` - Environment variable documentation

