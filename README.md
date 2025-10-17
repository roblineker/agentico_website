# Agentico - AI-Powered Business Automation

A modern React website for Agentico, showcasing AI automation services for trades and professional services businesses.

## Features

- **Modern React Stack**: Built with React 18, TypeScript, and Vite
- **Beautiful UI**: Styled with Tailwind CSS and shadcn/ui components
- **Contact Form**: Comprehensive form with Express.js backend API
- **Responsive Design**: Mobile-first design that works on all devices
- **Static Hosting Ready**: Optimized for deployment on Netlify, Vercel, or any static host

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express.js (for contact form API)
- **Routing**: Wouter (lightweight React router)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Development

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd agentico_website
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production (client + server)
- `pnpm build:client` - Build only client (static files)
- `pnpm build:server` - Build only server
- `pnpm start` - Start production server
- `pnpm preview` - Preview production build locally
- `pnpm check` - Type check
- `pnpm format` - Format code with Prettier

## Deployment

### Static Hosting (Netlify, Vercel)

For static hosting with serverless functions:

#### Netlify
1. Connect your repository to Netlify
2. Build settings are configured in `netlify.toml`
3. The contact form will use Netlify Functions

#### Vercel
1. Connect your repository to Vercel
2. Build settings are configured in `vercel.json`
3. The contact form will use Vercel Functions

#### GitHub Pages
1. Build the client: `pnpm build:client`
2. Deploy the `dist/public` folder
3. Note: Contact form won't work without backend - consider using Formspree or similar

### Full-Stack Hosting (Railway, Render, Heroku)

For platforms that support Node.js:

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Set environment variables**
   ```bash
   NODE_ENV=production
   PORT=3000
   ```

3. **Start the server**
   ```bash
   pnpm start
   ```

The Express server will serve both the API endpoints and static files.

## Project Structure

```
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
├── server/                # Backend Express server
├── shared/                # Shared constants/types
├── dist/                  # Build output
│   ├── public/           # Static files for hosting
│   └── index.js          # Server bundle
└── patches/              # Package patches (if any)
```

## Contact Form

The contact form collects detailed business information and sends it to the Express.js backend. In production, you'll want to:

1. **Add email sending**: Integrate with services like:
   - SendGrid
   - Mailgun  
   - AWS SES
   - Nodemailer with SMTP

2. **Add database storage**: Store submissions in:
   - PostgreSQL
   - MongoDB
   - Supabase
   - Airtable

3. **Add validation**: Server-side validation is included, but consider adding rate limiting

## Customization

### Branding
- Update logos in `client/public/`
- Modify colors in `client/src/index.css`
- Update company information in `client/src/pages/Home.tsx`

### Content
- Edit page content in `client/src/pages/Home.tsx`
- Update business information in `client/public/business-info.json`

### Styling
- Tailwind CSS configuration in `client/src/index.css`
- Component styles using shadcn/ui components

## License

MIT License - see LICENSE file for details
