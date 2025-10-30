# Notion API Version - 2025-09-03

This document explains our use of the latest Notion API version and what it means for this integration.

## Current Implementation

We are using:
- **Notion SDK**: `@notionhq/client` v5.3.0 (latest major version)
- **API Version**: `2025-09-03` (latest stable version)
- **Release Date**: September 3, 2025

## Why We Upgraded

The latest API version (`2025-09-03`) introduces critical updates:

### 1. **Multi-Source Database Support**
- Notion databases can now contain multiple linked data sources
- Enables powerful new workflows and data organization
- Required for future-proofing integrations

### 2. **Breaking Changes from Previous Versions**
According to the [Notion API upgrade guide](https://developers.notion.com/docs/upgrade-guide-2025-09-03):

> ❗️ **Code changes required**  
> If your integration is still using a previous API version and a user adds another data source to a database, **the following API actions will fail:**
> - Create page when using the database as the parent
> - Database read, write, or query
> - Writing relation properties that point to that database

### 3. **New Data Model**
- `database_id` → `data_source_id` for most operations
- Pages are now created within data sources, not directly in databases
- Better support for complex database relationships

## What Changed in Our Implementation

### Before (Old API)
```typescript
// Initialize without version (uses default old version)
const client = new Client({ auth: token });

// Create page directly in database
await client.pages.create({
  parent: { database_id: databaseId },
  properties: { /* ... */ }
});
```

### After (API 2025-09-03)
```typescript
// Initialize with explicit latest version
const client = new Client({ 
  auth: token,
  notionVersion: '2025-09-03' // Explicit version
});

// Step 1: Get database to retrieve data source ID
const database = await client.databases.retrieve({ 
  database_id: databaseId 
});
const dataSourceId = database.data_sources[0].id;

// Step 2: Create page in data source
await client.pages.create({
  parent: { 
    type: 'data_source_id',
    data_source_id: dataSourceId 
  },
  properties: { /* ... */ }
});
```

## Key Changes in Our Code

### 1. Client Initialization
**File**: `src/app/api/contact/route.ts`

```typescript
return {
  client: new Client({ 
    auth: notionToken,
    notionVersion: '2025-09-03', // Explicit API version
  }),
  databaseId: notionDatabaseId,
};
```

### 2. Data Source Retrieval
We added a discovery step to fetch the data source ID:

```typescript
// Get the database to retrieve data source ID
const database = await client.databases.retrieve({ 
  database_id: databaseId 
});
const dataSources = database.data_sources || [];

if (dataSources.length === 0) {
  console.error('No data sources found for database');
  return { success: false, error: 'no_data_sources' };
}

// Use the first data source (for single-source databases)
const dataSourceId = dataSources[0].id;
```

### 3. Page Creation with Data Source
Changed from `database_id` to `data_source_id`:

```typescript
const response = await client.pages.create({
  parent: { 
    type: 'data_source_id',
    data_source_id: dataSourceId  // New approach
  },
  properties: { /* ... */ }
});
```

## Benefits of Using Latest API

### ✅ Future-Proof
- Compatible with multi-source databases
- Won't break when users add additional data sources
- Follows Notion's recommended best practices

### ✅ Better Error Handling
- Clear error messages for missing data sources
- Graceful degradation if database structure changes

### ✅ Performance
- Optimized for latest Notion infrastructure
- Better response times and reliability

### ✅ New Features
- Access to latest Notion API capabilities
- Support for future enhancements

## Backward Compatibility

Our implementation is **forward-compatible** but uses the new API version exclusively:

- **Single-source databases**: Works perfectly (most common case)
- **Multi-source databases**: Uses the first data source automatically
- **Legacy databases**: Automatically upgraded to have a default data source by Notion

## Testing Considerations

When testing the integration:

1. ✅ **Single-source databases** (default): Should work immediately
2. ✅ **Newly created databases**: Will have one data source by default
3. ⚠️ **Multi-source databases**: Will use the first data source (index 0)

## Troubleshooting

### Error: "No data sources found for database"

**Cause**: The database doesn't have any data sources (unusual but possible)

**Solution**: 
1. Check the database ID is correct
2. Verify the integration has access to the database
3. Try re-sharing the database with the integration

### Error: "Could not find database"

**Cause**: Database ID is incorrect or integration doesn't have access

**Solution**:
1. Verify `NOTION_DATABASE_ID` in environment variables
2. Ensure database is shared with the integration
3. Check the integration token is valid

### Multiple Data Sources

If a database has multiple data sources and you need to use a specific one:

**Current behavior**: Uses the first data source (index 0)

**To customize**: Modify the code to select a specific data source by name or other criteria:

```typescript
// Example: Select by data source name
const dataSource = dataSources.find(ds => ds.name === 'Main Source');
const dataSourceId = dataSource?.id || dataSources[0].id;
```

## Migration Checklist (Completed)

According to the [Notion upgrade guide](https://developers.notion.com/docs/upgrade-guide-2025-09-03), we've completed all required steps:

- ✅ **Step 1**: Add discovery step to fetch `data_source_id`
- ✅ **Step 2**: Provide data source IDs when creating pages
- ✅ **Step 3**: Migrate database endpoints to data sources
- ✅ **Step 4**: Handle search results (N/A - we don't use search)
- ✅ **Step 5**: Upgrade SDK to v5.x
- ✅ **Step 6**: Upgrade webhooks (N/A - not using webhooks yet)

## References

- [Notion API Upgrade Guide](https://developers.notion.com/docs/upgrade-guide-2025-09-03)
- [Notion API v5 SDK Release](https://github.com/makenotion/notion-sdk-js/releases)
- [Notion API Reference](https://developers.notion.com/reference)

## Future Considerations

### When Multi-Source Support Matters

If you need to support multiple data sources in the future:

1. Modify the data source selection logic
2. Allow users to specify which data source to use
3. Store data source preferences
4. Add UI to select data sources

### API Version Updates

To stay current with future API versions:

1. Monitor [Notion's changelog](https://developers.notion.com/reference/changes-by-version)
2. Review breaking changes before upgrading
3. Test thoroughly in development
4. Update the `notionVersion` parameter in `initializeNotion()`

---

**Last Updated**: January 2025  
**API Version**: 2025-09-03  
**SDK Version**: 5.3.0



