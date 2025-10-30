# Test Data Feature

**Date**: October 30, 2025  
**Status**: ✅ Implemented

## Overview

Added a "Fill Test Data" button to the contact form that automatically populates all fields with realistic test data. This button is **only visible in development mode** and will not appear in production.

## Features

### Development Mode Only
- Button only renders when `NODE_ENV === 'development'`
- Automatically hidden in production builds
- No risk of test data accidentally being used in production

### Comprehensive Test Data

The test button fills all form fields with realistic data:

#### Contact Information
- Full Name: John Smith
- Email: john.smith@testcompany.com.au
- Phone: +61 412 345 678
- Company: Test Company Pty Ltd
- Website: https://www.testcompany.com.au
- Social Links: LinkedIn and Facebook profiles

#### Business Information
- Industry: Construction & Building Trades
- Business Size: 6-20 employees

#### Current State Assessment
- Current Systems: Detailed description of Excel, Gmail, paper-based tracking
- Monthly Volume: 100-500 per month
- Team Size: 6-10 people

#### Automation Goals
- Reduce manual data entry
- Improve customer response times
- Automate reporting
- Streamline internal workflows

#### Specific Processes
Realistic description of quote automation and photo management needs

#### Project Ideas (2 examples)
1. **AI-powered Quote Generator** (High Priority)
   - Automatic quote generation from customer emails
   - Integration with pricing database
   
2. **Photo Management System** (Medium Priority)
   - Mobile app for field workers
   - Automatic organization by client/job

#### Integration Requirements
- Tools: Xero, Gmail, Google Drive, QuickBooks
- Needs: Accounting, Communication, Document Storage
- Data Volume: Moderate (10-50 per day)

#### Project Scope
- Description: Growing construction business automation needs
- Success Metrics: Specific KPIs for quote turnaround and time savings
- Timeline: 1-3 months
- Budget: $25,000 - $50,000

## Usage

### In Development
1. Navigate to the contact form page
2. Look for the "🧪 Fill Test Data" button in the top-right of the form card
3. Click the button
4. All fields will be populated instantly
5. Review the data (you can still edit any field)
6. Submit the form to test the complete flow

### In Production
- Button is automatically hidden
- No code changes needed when deploying
- Uses `process.env.NODE_ENV` to detect environment

## Benefits

### For Development
- ✅ **Fast Testing**: Fill entire form in one click
- ✅ **Realistic Data**: Uses actual use-case scenarios
- ✅ **Complete Coverage**: Tests all form fields
- ✅ **Saves Time**: No manual data entry for each test

### For Testing Notion Integration
- ✅ Test Client creation with realistic company name
- ✅ Test Contact creation with proper person details
- ✅ Test Intake Form with comprehensive data
- ✅ Test all field mappings and formatting
- ✅ Test relationship creation between pages

### For QA
- ✅ Consistent test data across testers
- ✅ Easy to reproduce issues
- ✅ Quick validation of form flow
- ✅ No test data in production

## Technical Implementation

### Environment Detection
```typescript
const isDev = process.env.NODE_ENV === 'development';
```

### Conditional Rendering
```typescript
{isDev && (
  <Button
    type="button"
    variant="outline"
    size="sm"
    onClick={fillTestData}
    className="ml-4 shrink-0"
  >
    🧪 Fill Test Data
  </Button>
)}
```

### Data Population
Uses React Hook Form's `setValue()` to programmatically populate all fields:
```typescript
setValue("fullName", "John Smith");
setValue("email", "john.smith@testcompany.com.au");
// ... etc
```

## Testing the Feature

### Verify Development Mode
1. Run `npm run dev`
2. Navigate to contact form
3. Confirm button is visible

### Verify Production Mode
1. Run `npm run build && npm run start`
2. Navigate to contact form
3. Confirm button is NOT visible

### Test Data Quality
1. Click "Fill Test Data" button
2. Verify all fields are populated
3. Check that select dropdowns show correct values
4. Verify arrays (social links, project ideas) render correctly
5. Confirm toast notification appears
6. Submit form and check Notion pages are created correctly

## Future Enhancements

Potential improvements for the future:

### Multiple Test Scenarios
- Add dropdown to select different test personas
- "Small Business" vs "Enterprise" scenarios
- Different industries (construction, healthcare, retail, etc.)

### Random Data Generation
- Use faker.js or similar for varied test data
- Random company names, emails, phone numbers
- Helps test data validation edge cases

### Save/Load Custom Test Data
- Allow saving custom test data sets
- Load from localStorage or config file
- Team members can share test scenarios

## Security

### No Security Risk
- Only available in development
- Next.js environment variables are compile-time
- `NODE_ENV=production` removes the code entirely
- No way to access feature in production build

### Best Practices Followed
- ✅ Environment-based feature flag
- ✅ No test credentials in code
- ✅ Realistic but fake data
- ✅ Toast notification confirms action
- ✅ Data can still be edited before submission

## Troubleshooting

### Button Not Showing
**Issue**: Button not visible in development

**Solutions**:
1. Check you're running `npm run dev` (not build+start)
2. Verify `NODE_ENV=development` in your environment
3. Hard refresh the page (Ctrl+Shift+R)
4. Check browser console for errors

### Data Not Filling Correctly
**Issue**: Some fields remain empty

**Solutions**:
1. Check form field names match exactly
2. Verify React Hook Form's `setValue` is working
3. Check console for any errors
4. Ensure form is fully loaded before clicking button

### Button Showing in Production
**Issue**: Button visible after deployment

**Solutions**:
1. Verify you ran `npm run build` (not dev mode)
2. Check `NODE_ENV=production` is set on server
3. Clear build cache and rebuild
4. Check hosting platform environment variables

## Related Files

- **Component**: `src/components/contact-section.tsx`
- **API Route**: `src/app/api/contact/route.ts`
- **Form Schema**: Defined in contact-section.tsx (Zod schema)

## Summary

Simple but powerful feature that dramatically speeds up development and testing. The test data button:
- ✅ Only shows in development
- ✅ Fills all form fields with one click
- ✅ Uses realistic, comprehensive test data
- ✅ Perfect for testing Notion integration
- ✅ Zero security risk
- ✅ Zero production impact

---

**Added**: October 30, 2025  
**Environment**: Development only  
**Status**: Ready to use ✅

