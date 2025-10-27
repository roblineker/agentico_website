# Custom Tech Stack Icons

This directory contains custom SVG icons for technologies that aren't available in the simple-icons package.

## Required Icons

To display custom icons properly, add the following SVG files to this directory:

1. **procore.svg** - Procore logo
   - Download from: https://design.procore.com/iconography or Procore's brand assets
   
2. **vapi.svg** - Vapi logo
   - Download from: https://vapi.ai/ or contact Vapi for brand assets

## File Format

- All icons should be in SVG format
- Name files exactly as shown above (lowercase, no spaces)
- Ensure SVGs are optimized and work well on both light and dark backgrounds
- Recommended: Use a viewBox of "0 0 24 24" for consistency

## How It Works

The `BrandIcon` component will automatically:
1. Check for custom icons in `/public/icons/` first (if `customIcon: true`)
2. Fall back to simple-icons package
3. Fall back to Font Awesome icons
4. Show the first letter as a final fallback

## Adding More Custom Icons

To add more custom icons:
1. Place the SVG file in this directory
2. Update the tech stack item in `src/components/tech-stack.tsx`:
   ```typescript
   {
     name: "Your Company",
     iconSlug: "yourcompany",  // matches filename: yourcompany.svg
     customIcon: true,          // enables custom icon lookup
     // ... other properties
   }
   ```

