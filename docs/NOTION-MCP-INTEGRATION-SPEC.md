# Notion MCP Integration Specification

**Date**: October 30, 2025  
**Status**: 📋 Specification Ready for Implementation

## Overview

This document specifies how the contact form submission should create properly linked pages in Notion using the validated database structures from MCP.

## Database Structures (Validated via MCP)

### 1. 📋 Client Intake Forms
**Data Source ID**: `70e972d1-7a50-446f-9143-493e9253725f`

**Properties**:
- `Submission Name` (title) - Format: `{Company} - {Full Name}`
- `Full Name` (text)
- `Email` (email)
- `Phone Number` (phone_number)
- `Company Name` (text)
- `Industry` (select) - Must match exact option names
- `Total Employees` (select) - Format: `{size} employees`
- `Monthly Volume` (select) - Format: `{volume} per month`
- `Team Size Affected` (select) - Format: `{size} people`
- `Current Systems` (text)
- `Automation Goals` (text) - Comma-separated
- `Specific Processes` (text)
- `Existing Tools` (text)
- `Integration Needs` (text) - Comma-separated or "None specified"
- `Data Volume` (select) - Format: `{Volume} ({Description})`
- `Project Description` (text)
- `Success Metrics` (text)
- `Timeline` (select)
- `Budget Range` (select)
- `Project Ideas` (text) - Multi-line with priorities
- `Submission Status` (status) - Default: "New"
- `Submission Date` (date)
- `Follow-up Date` (date) - Optional
- **`Related Client` (relation)** - Links to Clients database
- `Assigned To` (person) - Optional

### 2. 💼 Clients
**Data Source ID**: `28753cee-fab0-8089-81b1-000b0adbfe30`

**Properties**:
- `Name` (title) - Company name
- `Type` (select) - e.g., "Prospect", "Active Client"
- `Website` (url)
- **`Contacts` (relation)** - Links to Contacts database
- **`Intake Forms` (relation)** - Links to Client Intake Forms database
- `Meeting Notes` (relation) - Links to Meeting Notes database
- `Proposals` (relation) - Links to Proposals database
- `Projects` (relation) - Links to Projects database
- `Estimates` (relation) - Links to Estimates database
- `Prompts` (relation) - Links to ChatGPT Prompts database
- `Related Regulations` (relation) - Links to AI Compliance Requirements database
- `Create Proposal` (button)

### 3. 🧑‍🤝‍🧑 Contacts
**Data Source ID**: `28753cee-fab0-803d-b224-000b57bdc6d6`

**Properties**:
- `Name` (title) - Full name
- `Email Address` (email)
- `Phone Number` (phone_number)
- `Title` (text) - Job title
- **`Company` (relation)** - Links to single Client (limit: 1)
- `Decision Maker` (checkbox) - `__YES__` or `__NO__`

## Implementation Flow

### Step 1: Search for Existing Client
```typescript
// Search for client by company name
const searchResults = await notionMCP.search({
  query: data.company,
  query_type: 'internal'
});

// Find exact match in Clients database
const existingClient = searchResults.results.find(r => 
  r.title === data.company && 
  r.type === 'page' &&
  r.url.includes('28753ceefab08000') // Clients database ID
);
```

###Step 2: Create Client (if doesn't exist)
```typescript
if (!existingClient) {
  const clientPage = await notionMCP.createPages({
    parent: {
      type: 'data_source_id',
      data_source_id: '28753cee-fab0-8089-81b1-000b0adbfe30'
    },
    pages: [{
      properties: {
        'Name': data.company,
        'Website': data.website || '',
        'Type': 'Prospect'
      }
    }]
  });
  
  clientPageUrl = clientPage.pages[0].url;
}
```

### Step 3: Create Contact Person
```typescript
const contactPage = await notionMCP.createPages({
  parent: {
    type: 'data_source_id',
    data_source_id: '28753cee-fab0-803d-b224-000b57bdc6d6'
  },
  pages: [{
    properties: {
      'Name': data.fullName,
      'Email Address': data.email,
      'Phone Number': data.phone,
      'Company': clientPageUrl, // Relation to Client
      'Decision Maker': '__YES__'
    }
  }]
});
```

### Step 4: Create Intake Form with Relationships
```typescript
const intakeFormPage = await notionMCP.createPages({
  parent: {
    type: 'data_source_id',
    data_source_id: '70e972d1-7a50-446f-9143-493e9253725f'
  },
  pages: [{
    properties: {
      // Title
      'Submission Name': `${data.company} - ${data.fullName}`,
      
      // Contact Info
      'Full Name': data.fullName,
      'Email': data.email,
      'Phone Number': data.phone,
      'Company Name': data.company,
      
      // Business Info
      'Industry': formatIndustry(data.industry),
      'Total Employees': `${data.businessSize} employees`,
      
      // Current State
      'Current Systems': data.currentSystems,
      'Monthly Volume': `${data.monthlyVolume} per month`,
      'Team Size Affected': `${data.teamSize} people`,
      
      // Automation Needs
      'Automation Goals': data.automationGoals.join(', '),
      'Specific Processes': data.specificProcesses,
      'Project Ideas': formatProjectIdeas(data.projectIdeas),
      
      // Integration
      'Existing Tools': data.existingTools,
      'Integration Needs': data.integrationNeeds.join(', ') || 'None specified',
      'Data Volume': formatDataVolume(data.dataVolume),
      
      // Project Scope
      'Project Description': data.projectDescription,
      'Success Metrics': data.successMetrics,
      'Timeline': formatTimeline(data.timeline),
      'Budget Range': formatBudget(data.budget),
      
      // Meta
      'Submission Status': 'New',
      'date:Submission Date:start': new Date().toISOString().split('T')[0],
      'date:Submission Date:is_datetime': 0,
      
      // RELATIONSHIP
      'Related Client': clientPageUrl
    },
    content: buildIntakeFormContent(data)
  }]
});
```

## Formatting Functions

### formatIndustry
```typescript
function formatIndustry(industry: string): string {
  return industry.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
```

### formatDataVolume
```typescript
function formatDataVolume(volume: string): string {
  const descriptions = {
    'minimal': 'Few per day',
    'moderate': '10-50 per day',
    'large': '50-200 per day',
    'very_large': '200+ per day'
  };
  
  const capitalized = volume.charAt(0).toUpperCase() + volume.slice(1);
  return `${capitalized} (${descriptions[volume]})`;
}
```

### formatTimeline
```typescript
function formatTimeline(timeline: string): string {
  const mapping = {
    'immediate': 'Immediate (ASAP)',
    '1-3_months': '1-3 months',
    '3-6_months': '3-6 months',
    '6+_months': '6+ months'
  };
  return mapping[timeline];
}
```

### formatBudget
```typescript
function formatBudget(budget: string): string {
  const mapping = {
    'under_10k': 'Under $10,000',
    '10k-25k': '$10,000 - $25,000',
    '25k-50k': '$25,000 - $50,000',
    '50k-100k': '$50,000 - $100,000',
    '100k+': '$100,000+',
    'not_sure': 'Not sure yet'
  };
  return mapping[budget];
}
```

### formatProjectIdeas
```typescript
function formatProjectIdeas(ideas?: Array<{title: string, description: string, priority: string}>): string {
  if (!ideas || ideas.length === 0) {
    return 'No specific project ideas provided';
  }
  
  return ideas.map(idea => 
    `[${idea.priority.toUpperCase()}] ${idea.title}: ${idea.description}`
  ).join('\n\n');
}
```

### buildIntakeFormContent
```typescript
function buildIntakeFormContent(data: ContactFormData): string {
  return `# Contact Information

**Email:** ${data.email}
**Phone:** ${data.phone}
**Company:** ${data.company}
${data.website ? `**Website:** ${data.website}` : ''}

${data.socialLinks && data.socialLinks.length > 0 ? `### Social Links\n${data.socialLinks.map(l => `- ${l.url}`).join('\n')}` : ''}

# Current State Assessment

**Current Systems:**
${data.currentSystems}

# Automation Goals

**Goals:** ${data.automationGoals.join(', ')}

**Specific Processes:**
${data.specificProcesses}

${data.projectIdeas && data.projectIdeas.length > 0 ? `### Project Ideas\n\n${data.projectIdeas.map(idea => {
  const emoji = idea.priority === 'high' ? '🔴' : idea.priority === 'medium' ? '🟡' : '🟢';
  return `${emoji} **${idea.title}** (${idea.priority.toUpperCase()})\n${idea.description}`;
}).join('\n\n')}` : ''}

# Integration Requirements

**Existing Tools:**
${data.existingTools}

**Integration Needs:** ${data.integrationNeeds.join(', ') || 'None specified'}

# Project Scope

**Project Description:**
${data.projectDescription}

**Success Metrics:**
${data.successMetrics}`;
}
```

## Relationship Diagram

```
┌─────────────────────┐
│   💼 Clients DB     │
│  (1 record per      │
│   company)          │
└──────┬──────────────┘
       │
       │ Relation: "Contacts"
       ├──────────────────────────┐
       │                          │
       │                   ┌──────▼───────────┐
       │                   │  🧑 Contacts DB  │
       │                   │  (multiple per   │
       │                   │   company)       │
       │                   └──────────────────┘
       │
       │ Relation: "Intake Forms"
       │
       ▼
┌──────────────────────┐
│ 📋 Client Intake     │
│    Forms DB          │
│ (1 per submission)   │
│                      │
│ Related Client: ─────┘
└──────────────────────┘
```

## Data Flow Summary

1. **Form Submitted** → API receives data
2. **Search Clients** → Check if company exists
3. **Create/Get Client** → Create new or use existing
4. **Create Contact** → Link to Client
5. **Create Intake Form** → Link to Client
6. **Result** → 3 pages created with proper relationships

## Required Environment Variables

```env
# Notion API Token (for server-side SDK)
NOTION_API_TOKEN=secret_xxxxx

# OR use MCP if available
NOTION_MCP_ENABLED=true
```

## Error Handling

```typescript
try {
  // Step 1: Client
  const clientResult = await createOrFindClient(data);
  if (!clientResult.success) {
    console.warn('Client creation failed, proceeding without link');
  }
  
  // Step 2: Contact
  const contactResult = await createContact(data, clientResult.url);
  if (!contactResult.success) {
    console.warn('Contact creation failed');
  }
  
  // Step 3: Intake Form (always create, even if relationships fail)
  const intakeResult = await createIntakeForm(data, clientResult.url);
  
  return {
    success: true,
    intakeFormUrl: intakeResult.url,
    clientUrl: clientResult.url,
    contactUrl: contactResult.url
  };
  
} catch (error) {
  console.error('Notion integration failed:', error);
  // Don't fail the entire form submission
  return { success: false, reason: 'notion_error', error };
}
```

## Testing Checklist

### Database Structure Validation
- [x] Verified Client Intake Forms schema via MCP
- [x] Verified Clients schema via MCP
- [x] Verified Contacts schema via MCP
- [x] Confirmed relationship properties exist
- [x] Confirmed data source IDs

### Relation Testing
- [ ] Submit form with new company
- [ ] Verify Client page created
- [ ] Verify Contact page created and linked to Client
- [ ] Verify Intake Form created and linked to Client
- [ ] Submit another form with same company
- [ ] Verify it uses existing Client (doesn't duplicate)
- [ ] Verify new Contact created
- [ ] Verify new Intake Form linked to existing Client

### Field Mapping
- [ ] All select options match exactly
- [ ] Industry formatting correct (Title Case with spaces)
- [ ] Employee count has " employees" suffix
- [ ] Monthly volume has " per month" suffix
- [ ] Team size has " people" suffix
- [ ] Data volume has description in parentheses
- [ ] Timeline matches option names exactly
- [ ] Budget range shows dollar amounts
- [ ] Project ideas formatted with priorities
- [ ] Submission status set to "New"
- [ ] Submission date populated

### Content Blocks
- [ ] Contact information section present
- [ ] Social links section (if provided)
- [ ] Current state assessment section
- [ ] Automation goals section
- [ ] Project ideas with emojis (if provided)
- [ ] Integration requirements section
- [ ] Project scope section

## Implementation Priority

1. **Phase 1**: Basic intake form creation (no relationships)
2. **Phase 2**: Client creation/search
3. **Phase 3**: Contact creation with Client relationship
4. **Phase 4**: Intake Form with Client relationship
5. **Phase 5**: Error handling and edge cases

## Notes

- The Notion SDK is already installed (`@notionhq/client`)
- MCP tools are available in Cursor but not in Next.js API routes
- Must use Notion SDK directly in API route
- All data source IDs and schemas verified via MCP on Oct 30, 2025
- Relations require page URLs, not page IDs
- Date properties use expanded format: `date:{PropertyName}:start`, `date:{PropertyName}:is_datetime`
- Checkbox properties use `__YES__` or `__NO__` strings

---

**Status**: Ready for implementation  
**Next Step**: Implement `saveToNotion()` function in `src/app/api/contact/route.ts`

