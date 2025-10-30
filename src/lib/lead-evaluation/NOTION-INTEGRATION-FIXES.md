# Notion Style Guide Integration - Fixes Applied

## Summary

Fixed the style guide integration to properly save data to Notion databases with the correct schema and property names.

## Issues Fixed

### 1. Incorrect Property Names
**Before:**
- Code used `'Name'` as the title property
- Code used `'Created Date'` property that doesn't exist

**After:**
- Uses `'Style Guide Name'` as the title property (matches database schema)
- Removed `'Created Date'` property (not in database schema)

### 2. Unstructured Content Storage
**Before:**
- Style guide content was only saved as page blocks
- Database properties were not populated
- No structured data for querying/filtering

**After:**
- Content is parsed into structured sections
- Database properties are populated with extracted content
- Full content still saved as blocks for reference

### 3. Incorrect Parameter Name
**Before:**
- `saveContactStyleGuide()` had `clientPageId` parameter
- Inconsistent with database schema (should link to Contact, not Client)

**After:**
- Changed to `contactPageId` parameter
- Matches database schema requirement for Contact relation

## New Features

### Content Parser
Added `parseStyleGuideContent()` function that intelligently extracts sections from AI-generated style guides:

- **Voice & Tone Profile** - Brand personality, tone guidelines
- **Key Phrases & Vocabulary** - Linguistic patterns, terminology
- **Content Structure** - Organization, formatting preferences
- **Content Themes & Pillars** - Main content categories
- **Practical Examples** - Voice examples and comparisons
- **AI Tells to Avoid** - Corporate jargon to skip

The parser uses pattern matching to identify section headers and extracts the relevant content.

### Structured Property Population
The system now:
1. Parses the AI-generated content
2. Extracts each section
3. Populates database properties (max 2000 chars each per Notion limit)
4. Adds full content as page blocks for reference
5. Links to website as Source Materials

## Database Schema Compatibility

The code now correctly matches the Notion database schemas:

### Client Style Guides Database
```
Schema ID: collection://452e3222-cdaf-4946-ba03-029d3fc9e498
Database URL: https://www.notion.so/b919f771bec746dd8ebdc956ec618176
```

Properties:
- ✅ Style Guide Name (Title)
- ✅ Status (Select: Draft/In Progress/Complete/Needs Review)
- ✅ Client (Relation to Clients database)
- ✅ Voice & Tone Profile (Rich Text)
- ✅ Key Phrases & Vocabulary (Rich Text)
- ✅ Content Structure (Rich Text)
- ✅ Content Themes & Pillars (Rich Text)
- ✅ Practical Examples (Rich Text)
- ✅ AI Tells to Avoid (Rich Text)
- ✅ Source Materials (URL)

### Contact Style Guides Database
```
Schema ID: collection://ce91750b-90d5-4a37-bc38-b336c2249469
Database URL: https://www.notion.so/2f196f71d920429e9a7318f43b154954
```

Properties:
- ✅ Style Guide Name (Title)
- ✅ Status (Select: Draft/In Progress/Complete/Needs Review)
- ✅ Contact (Relation to Contacts database)
- ✅ Voice & Tone Profile (Rich Text)
- ✅ Key Phrases & Vocabulary (Rich Text)
- ✅ Content Structure (Rich Text)
- ✅ Content Themes & Pillars (Rich Text)
- ✅ Practical Examples (Rich Text)
- ✅ AI Tells to Avoid (Rich Text)
- ✅ Source Materials (URL)

## Testing

To test the integration:

1. Ensure environment variables are set:
   ```env
   NOTION_API_TOKEN=secret_xxx
   NOTION_COMPANY_STYLE_GUIDES_DB_ID=b919f771bec746dd8ebdc956ec618176
   NOTION_CONTACT_STYLE_GUIDES_DB_ID=2f196f71d920429e9a7318f43b154954
   OPENAI_API_KEY=sk-xxx  # Required for generating style guides
   ```

2. Submit a test contact form with the development test data

3. Check Notion databases for:
   - ✅ New entries with correct Style Guide Name
   - ✅ Status set to "Draft"
   - ✅ Structured content in database properties
   - ✅ Full content visible when opening the page
   - ✅ Website URL in Source Materials (if provided)

## Benefits

1. **Queryable Data**: Style guides can now be filtered and searched by section
2. **Consistent Structure**: All style guides follow the same property schema
3. **Better UX**: Database views can show summaries without opening pages
4. **Integration Ready**: Structured data can be easily consumed by automations
5. **Future-Proof**: Follows existing Notion workspace conventions

## Files Modified

- `src/lib/lead-evaluation/notion-style-guides.ts` - Core integration logic
- `src/lib/lead-evaluation/README.md` - Added database schema documentation

## Environment Variables

No new environment variables required. The existing ones are used:
- `NOTION_COMPANY_STYLE_GUIDES_DB_ID` → Client Style Guides database
- `NOTION_CONTACT_STYLE_GUIDES_DB_ID` → Contact Style Guides database

Note: The variable names say "COMPANY" and "CONTACT" but map to "Client" and "Contact" databases in Notion, which is consistent with your workspace structure.

