# Test Data Feature - Multiple Test Cases

**Date**: October 30, 2025  
**Status**: ✅ Implemented & Enhanced

## Overview

Added a test data dropdown to the contact form that allows selecting from 5 different realistic test scenarios. This dropdown is **only visible in development mode** and will not appear in production.

## Features

### Development Mode Only
- Dropdown only renders when `NODE_ENV === 'development'`
- Automatically hidden in production builds
- No risk of test data accidentally being used in production

### 5 Realistic Test Cases

Choose from diverse business scenarios:

#### 1. 🏗️ Construction (Small Business)
- **Company**: BuildRight Constructions
- **Industry**: Construction & Building Trades
- **Size**: 6-20 employees
- **Budget**: $25k-50k
- **Timeline**: 1-3 months
- **Focus**: Quote automation, job photo management
- **Use Case**: Typical tradies business looking to reduce paperwork

#### 2. 🏥 Medical Practice (Medium)
- **Company**: Sunshine Coast Medical Centre
- **Industry**: Healthcare & Medical
- **Size**: 21-50 employees
- **Budget**: $50k-100k
- **Timeline**: Immediate
- **Focus**: Patient triage, appointment automation, digital forms
- **Use Case**: Busy practice overwhelmed with phone calls and admin

#### 3. ⚖️ Law Firm (Enterprise)
- **Company**: Martinez & Associates Legal
- **Industry**: Legal Services
- **Size**: 51-200 employees
- **Budget**: $100k+
- **Timeline**: 3-6 months
- **Focus**: Document review, client intake, legal document generation
- **Use Case**: Large firm needing document automation and efficiency

#### 4. 🛍️ E-commerce Startup
- **Company**: EcoStyle Australia
- **Industry**: E-commerce & Online Retail
- **Size**: 1-5 employees
- **Budget**: Under $10k
- **Timeline**: Immediate
- **Focus**: Customer service chatbot, order automation
- **Use Case**: Fast-growing startup needing to scale support cheaply

#### 5. 📊 Accounting Firm
- **Company**: Williams & Co Chartered Accountants
- **Industry**: Accounting & Bookkeeping
- **Size**: 6-20 employees
- **Budget**: $50k-100k
- **Timeline**: 3-6 months
- **Focus**: Document processing, BAS automation, client portal
- **Use Case**: Established firm wanting to handle more clients efficiently

### Email Address for Testing

All test cases use `dev@agentico.com.au` so:
- ✅ Confirmation emails go to your dev inbox
- ✅ No risk of emailing fake/test addresses
- ✅ Perfect for testing email integration

### Comprehensive Test Data

Each test case fills ALL form fields with realistic data:

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
2. Look for the "🧪 Load Test Data" dropdown in the top-right of the form card
3. Click the dropdown to see 5 test case options
4. Select a scenario (Construction, Medical, Law, E-commerce, or Accounting)
5. All fields will be populated instantly with scenario-specific data
6. Review the data (you can still edit any field)
7. Submit the form to test the complete flow
8. Check emails at `dev@agentico.com.au` and `sales@agentico.com.au`

### In Production
- Dropdown is automatically hidden
- No code changes needed when deploying
- Uses `process.env.NODE_ENV` to detect environment

## Benefits

### For Development
- ✅ **Fast Testing**: Fill entire form in one click
- ✅ **5 Realistic Scenarios**: Test different industries and business sizes
- ✅ **Complete Coverage**: Each scenario tests all form fields
- ✅ **Saves Time**: No manual data entry for each test
- ✅ **Safe Email Testing**: All use dev@agentico.com.au

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
  <Select onValueChange={(value) => fillTestData(value as keyof typeof testCases)}>
    <SelectTrigger className="w-[220px] ml-4 shrink-0">
      <SelectValue placeholder="🧪 Load Test Data" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="construction_small">🏗️ Construction (Small)</SelectItem>
      <SelectItem value="healthcare_medium">🏥 Medical Practice</SelectItem>
      <SelectItem value="legal_enterprise">⚖️ Law Firm (Enterprise)</SelectItem>
      <SelectItem value="retail_startup">🛍️ E-commerce Startup</SelectItem>
      <SelectItem value="accounting_firm">📊 Accounting Firm</SelectItem>
    </SelectContent>
  </Select>
)}
```

### Test Case Data Structure
```typescript
const testCases = {
  construction_small: {
    name: "Small Construction Business",
    data: {
      fullName: "Mike Johnson",
      email: "dev@agentico.com.au", // All test cases use dev email
      // ... all form fields
    }
  },
  // ... 4 more test cases
};
```

### Data Population
Uses React Hook Form's `setValue()` to programmatically populate all fields:
```typescript
const caseData = testCases[selectedCase].data;
setValue("fullName", caseData.fullName);
setValue("email", caseData.email);
setValue("industry", caseData.industry, { shouldValidate: true });
// ... etc
```

## Testing the Feature

### Verify Development Mode
1. Run `npm run dev`
2. Navigate to contact form
3. Confirm dropdown is visible in top-right

### Verify Production Mode
1. Run `npm run build && npm run start`
2. Navigate to contact form
3. Confirm dropdown is NOT visible

### Test Each Scenario
For each of the 5 test cases:
1. Select from dropdown (e.g., "🏗️ Construction (Small)")
2. Verify all fields are populated
3. Check that select dropdowns show correct values
4. Verify arrays (social links, project ideas) render correctly
5. Confirm toast notification shows scenario name
6. Submit form
7. Check Notion pages created (Client, Contact, Intake Form)
8. Check emails received at `dev@agentico.com.au` and `sales@agentico.com.au`

### Test Diversity
- ✅ Test different industries (construction, healthcare, legal, retail, accounting)
- ✅ Test different business sizes (1-5 up to 200+)
- ✅ Test different budgets ($10k to $100k+)
- ✅ Test different timelines (immediate to 6+ months)
- ✅ Test different data volumes (minimal to very large)

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

