   # Agentico - AI Consulting, Engineering & Solutions

A modern Next.js website for Agentico, an AI consultancy specializing in business automation for trades and professional services.

## Features

- **Modern Tech Stack**: Built with Next.js 15, TypeScript, and Tailwind CSS
- **Component Library**: Uses shadcn/ui for consistent, accessible UI components
- **Responsive Design**: Mobile-first approach with proper breakpoints
- **AI Integration**: ElevenLabs conversational AI widget embedded
- **SEO Optimized**: Proper meta tags, sitemap, and robots.txt
- **Form Integration**: Contact form with Notion database and N8N webhook integration
- **Performance**: Optimized images and lazy loading

## Sections

1. **Hero Section**: Main headline with gradient text and CTA buttons
2. **Services Section**: Six detailed service cards with problem/solution/example format
3. **Industries Section**: Four industry category cards
4. **About Section**: Company description and value proposition
5. **FAQ Section**: Common questions with expandable answers
6. **Contact Section**: Collapsible contact form (ready for backend integration)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and design tokens
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx            # Main homepage
│   └── sitemap.ts          # SEO sitemap
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── header.tsx          # Navigation header
│   ├── hero-section.tsx    # Hero section
│   ├── services-section.tsx # Services cards
│   ├── industries-section.tsx # Industry categories
│   ├── about-section.tsx   # About section
│   ├── faq-section.tsx     # FAQ cards
│   ├── contact-section.tsx # Contact form
│   ├── footer.tsx          # Footer
│   └── elevenlabs-widget.tsx # AI chat widget
└── lib/
    └── utils.ts            # Utility functions
```

## Customization

### Colors and Theming

The design system uses CSS custom properties defined in `src/app/globals.css`. The color scheme matches the Agentico brand with blue primary colors and neutral grays.

### Content Updates

All content is defined within the components. Update the arrays and text directly in:
- `services-section.tsx` for service cards
- `industries-section.tsx` for industry categories  
- `faq-section.tsx` for FAQ items

### Form Integration

The contact form in `contact-section.tsx` integrates with:
- **Notion Database**: Automatically saves all form submissions to a Notion database for lead tracking
- **N8N Webhooks**: Sends form data to N8N workflows for automation

See [NOTION-SETUP.md](./NOTION-SETUP.md) for detailed setup instructions.

## Deployment

The project is ready for deployment on Vercel, Netlify, or any platform supporting Next.js.

### Build for Production

```bash
npm run build
```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Notion Configuration (Required for form submissions to Notion)
NOTION_API_TOKEN=secret_your_notion_integration_token
# Note: Database is auto-discovered - no database ID needed!

# N8N Webhook Configuration (Optional)
N8N_TEST_WEBHOOK_URL=https://your-n8n-instance.com/webhook-test/path
N8N_PROD_WEBHOOK_URL=https://your-n8n-instance.com/webhook/path
N8N_SEND_TO_BOTH=false

# Next.js
NODE_ENV=development
```

See [NOTION-SETUP.md](./NOTION-SETUP.md) for detailed configuration instructions.

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library
- **Lucide React** - Icon library
- **ElevenLabs** - Conversational AI widget
- **Notion API** - Database integration for lead tracking (API v2025-09-03)
- **Notion MCP** - Model Context Protocol for AI workspace access
- **Zod** - Schema validation

## License

© 2025 Agentico. All rights reserved.