# Notion Integration Testing Checklist

Use this checklist to verify that the Notion integration is working correctly.

## Pre-Testing Setup

- [ ] Notion integration created at https://www.notion.so/my-integrations
- [ ] Notion database created with all required properties
- [ ] Database shared with the integration
- [ ] `NOTION_API_TOKEN` added to `.env.local`
- [ ] `NOTION_DATABASE_ID` added to `.env.local`
- [ ] Development server restarted after adding environment variables

## Environment Variable Check

- [ ] `.env.local` file exists in project root
- [ ] `NOTION_API_TOKEN` starts with `secret_`
- [ ] `NOTION_DATABASE_ID` is 32 characters (with or without hyphens)
- [ ] No extra spaces or quotes around values
- [ ] File is listed in `.gitignore`

## Database Schema Verification

Verify your Notion database has these properties (case-sensitive):

- [ ] **Name** - Title
- [ ] **Email** - Email
- [ ] **Phone** - Phone number
- [ ] **Company** - Text
- [ ] **Website** - URL
- [ ] **Industry** - Select
- [ ] **Business Size** - Select
- [ ] **Monthly Volume** - Select
- [ ] **Team Size** - Select
- [ ] **Data Volume** - Select
- [ ] **Timeline** - Select
- [ ] **Budget** - Select
- [ ] **Status** - Status
- [ ] **Submitted** - Date

## Select Property Options

Verify these select options exist (add missing ones):

### Status Property
- [ ] New
- [ ] Contacted
- [ ] Qualified
- [ ] Proposal Sent
- [ ] Won
- [ ] Lost

### Industry Property (sample - add all from NOTION-SETUP.md)
- [ ] Construction Trades
- [ ] Legal Services
- [ ] Healthcare Medical
- [ ] Other

### Other Select Properties
- [ ] Business Size: 1-5, 6-20, 21-50, 51-200, 200+
- [ ] Monthly Volume: 0-100, 100-500, 500-1000, 1000-5000, 5000+
- [ ] Team Size: 1-2, 3-5, 6-10, 11-20, 20+
- [ ] Data Volume: Minimal, Moderate, Large, Very_large
- [ ] Timeline: immediate, 1-3-months, 3-6-months, 6+-months
- [ ] Budget: under 10k, 10k-25k, 25k-50k, 50k-100k, 100k+, not sure

## Server Startup Check

When starting the dev server (`npm run dev`), verify:

- [ ] No error messages about missing Notion credentials
- [ ] Server starts successfully on http://localhost:3000
- [ ] No TypeScript compilation errors
- [ ] Console shows no warnings about Notion configuration

## Form Submission Test

### Test 1: Basic Submission

1. Navigate to http://localhost:3000/#contact
2. Fill out all required fields:
   - [ ] Full Name
   - [ ] Email
   - [ ] Phone
   - [ ] Company Name
   - [ ] Industry (select one)
   - [ ] Business Size
   - [ ] Current Systems
   - [ ] Monthly Volume
   - [ ] Team Size
   - [ ] Automation Goals (at least one)
   - [ ] Specific Processes
   - [ ] Existing Tools
   - [ ] Data Volume
   - [ ] Project Description
   - [ ] Success Metrics
   - [ ] Timeline
   - [ ] Budget

3. Submit the form
4. Verify:
   - [ ] Form shows "Submitting..." state
   - [ ] Success toast appears
   - [ ] Redirects to /booking page
   - [ ] No error messages in browser console
   - [ ] No error messages in server terminal

5. Check Notion Database:
   - [ ] New entry appears in database
   - [ ] Name matches submitted name
   - [ ] Email is correct
   - [ ] Phone is correct
   - [ ] Company is correct
   - [ ] Industry is selected correctly
   - [ ] All select fields are populated
   - [ ] Status is set to "New"
   - [ ] Submitted date is today

6. Open the Notion Page:
   - [ ] Page opens successfully
   - [ ] Contact Information section exists
   - [ ] Current State Assessment section exists
   - [ ] Automation Goals section exists
   - [ ] Integration Requirements section exists
   - [ ] Project Scope section exists
   - [ ] All text content is properly formatted

### Test 2: With Optional Fields

1. Fill out the form with:
   - [ ] Website URL
   - [ ] Social media links (add 2-3)
   - [ ] Project ideas (add 1-2)

2. Submit and verify:
   - [ ] Submission succeeds
   - [ ] Social Links section appears in Notion page
   - [ ] Social links are formatted as clickable URLs
   - [ ] Project Ideas section appears
   - [ ] Ideas show emoji indicators (🔴/🟡/🟢)
   - [ ] Priority levels are correct

### Test 3: Different Industries

Submit forms with different industries:
- [ ] Construction Trades
- [ ] Legal Services
- [ ] Healthcare Medical
- [ ] Retail
- [ ] IT Services
- [ ] Other

Verify:
- [ ] Industry name is formatted correctly in Notion (title case, with spaces)
- [ ] Industry select option matches

### Test 4: Edge Cases

Test these scenarios:

- [ ] Very long text in description fields (no truncation errors)
- [ ] Special characters in text fields (&, <, >, quotes)
- [ ] Empty optional fields (website, social links, project ideas)
- [ ] Maximum number of social links (5+)
- [ ] Maximum number of project ideas (5+)
- [ ] Phone numbers in different formats

### Test 5: Error Handling

Test error scenarios:

1. Invalid Notion Token:
   - [ ] Temporarily change `NOTION_API_TOKEN` to invalid value
   - [ ] Submit form
   - [ ] Verify form still succeeds (graceful failure)
   - [ ] Check server logs for error message
   - [ ] Restore correct token

2. Invalid Database ID:
   - [ ] Temporarily change `NOTION_DATABASE_ID` to invalid value
   - [ ] Submit form
   - [ ] Verify form still succeeds (graceful failure)
   - [ ] Check server logs for error message
   - [ ] Restore correct database ID

3. Missing Environment Variables:
   - [ ] Comment out Notion variables in `.env.local`
   - [ ] Restart server
   - [ ] Submit form
   - [ ] Verify form still succeeds
   - [ ] Check logs for "Notion credentials not configured"
   - [ ] Restore environment variables

## Server Logs Verification

Check server terminal for these log messages:

✅ **Success messages:**
- `Successfully saved to Notion: <page_id>`

⚠️ **Warning messages (expected if not configured):**
- `Notion credentials not configured`
- `Skipping Notion save - not configured`

❌ **Error messages (should investigate):**
- `Failed to save to Notion:` (followed by error details)
- `Could not find database`
- `Unauthorized`
- `Validation failed`

## Performance Check

- [ ] Form submission completes in < 2 seconds
- [ ] Page loads quickly after submission
- [ ] No noticeable delay from Notion integration (runs non-blocking)

## Production Readiness

Before deploying to production:

- [ ] All tests pass successfully
- [ ] Notion integration works consistently
- [ ] Environment variables documented for deployment
- [ ] Team members have access to Notion database
- [ ] Backup/alternative tested (N8N webhooks or email)
- [ ] Error monitoring configured
- [ ] Database views set up for team workflow

## Common Issues & Solutions

### Issue: "Could not find database"
**Solution:** Verify database ID and ensure database is shared with integration

### Issue: "Unauthorized"
**Solution:** Check token is correct and starts with `secret_`

### Issue: Validation failed on select property
**Solution:** Verify all select options exist in Notion database

### Issue: Form succeeds but nothing in Notion
**Solution:** Check server logs for error messages, verify environment variables

### Issue: Some fields missing in Notion
**Solution:** Verify property names match exactly (case-sensitive)

## Success Criteria

All tests must pass:
- ✅ Form submits successfully
- ✅ Data appears in Notion database
- ✅ All fields are populated correctly
- ✅ Page content is formatted properly
- ✅ Optional fields work correctly
- ✅ Different industries work
- ✅ Error handling is graceful
- ✅ Performance is acceptable

## Next Steps After Testing

Once all tests pass:

1. Document any custom Notion database views
2. Set up Notion automation/notifications (if needed)
3. Train team on using Notion database
4. Deploy to production with production credentials
5. Test production deployment
6. Monitor for errors in production logs

---

**Testing Date:** _______________
**Tested By:** _______________
**Result:** ⬜ Pass / ⬜ Fail
**Notes:**



