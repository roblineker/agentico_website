# AI Chatbot Demo Setup Guide

## Overview

This guide will help you set up and run the AI chatbot demo that interacts with your example business data using OpenAI's GPT models.

## Prerequisites

- Node.js installed (v18 or higher)
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Example business data in `/public/mcp/example-data/` (already included)

## Installation Steps

### 1. Install Dependencies

The OpenAI SDK has already been installed. If you need to reinstall:

```bash
npm install openai
```

### 2. Configure Environment Variables

Create or update your `.env.local` file in the root directory:

```bash
OPENAI_API_KEY=sk-your-api-key-here
```

**Important**: Never commit your `.env.local` file to version control. It's already in `.gitignore`.

### 3. Run the Development Server

```bash
npm run dev
```

### 4. Access the Demo

Open your browser and navigate to:
```
http://localhost:3000/demo
```

## Features Implemented

### 1. API Route (`/api/chat`)
- **Location**: `src/app/api/chat/route.ts`
- Handles chat completions with OpenAI API
- Dynamically loads business data from JSON files
- Supports industry-specific filtering
- Returns AI responses with usage metrics

### 2. Chat Configuration Component
- **Location**: `src/app/demo/components/chat-config.tsx`
- Collapsible settings panel
- Model selection (GPT-4o, GPT-4o Mini, GPT-3.5 Turbo)
- Industry filter dropdown
- Temperature control (0-2)
- Max tokens control (100-4000)

### 3. Chat Interface Component
- **Location**: `src/app/demo/components/chat-interface.tsx`
- Real-time message display
- User and AI message differentiation
- Auto-expanding textarea
- Loading states
- Error handling
- Clear chat functionality

### 4. Demo Page
- **Location**: `src/app/demo/page.tsx`
- Main chatbot interface
- Example queries
- Configuration summary
- Business data overview
- Technical information

## Usage

### Example Queries

Try asking the chatbot questions like:

1. **Sales & Revenue**
   - "What are the total sales for the bakery?"
   - "Show me the daily sales breakdown for the coffee shop"
   - "Which business has the highest revenue?"

2. **Invoices & Billing**
   - "List all unpaid invoices"
   - "Show me bills that are due this month"
   - "What's the total amount owed by wholesale clients?"

3. **Staff Information**
   - "Who works at the yoga studio?"
   - "List all staff qualifications at the bakery"
   - "How many years of experience does the head baker have?"

4. **Products & Services**
   - "What products does the florist offer?"
   - "Show me the menu items at the pizza shop"
   - "What are the prices for car detailing services?"

5. **Business Operations**
   - "What are the trading hours for the gym?"
   - "Which businesses deliver on Sundays?"
   - "Show me the integration tools used by the law firm"

### Configuring the AI

#### Model Selection
- **GPT-4o**: Best for complex analysis and detailed responses
- **GPT-4o Mini**: Balanced option for most queries (recommended)
- **GPT-3.5 Turbo**: Fastest responses, best for simple queries

#### Temperature Setting
- **0.0-0.5**: More focused and deterministic (best for data queries)
- **0.5-1.0**: Balanced (recommended for general use)
- **1.0-2.0**: More creative and varied responses

#### Max Tokens
- **100-500**: Short, concise answers
- **500-2000**: Standard responses (recommended)
- **2000-4000**: Long, detailed explanations

#### Industry Filter
- Select "All Industries" to query across all business data
- Select a specific industry to focus on one business type
- The AI will only access data for the selected industry

## API Documentation

### POST /api/chat

Send a message and receive an AI response.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "What are the bakery's trading hours?" }
  ],
  "model": "gpt-4o-mini",
  "temperature": 0.7,
  "maxTokens": 2000,
  "industry": "bakery"
}
```

**Response:**
```json
{
  "message": {
    "role": "assistant",
    "content": "The Artisan Bread & Pastry Co. is open:\n- Tuesday to Saturday: 6:00 AM - 4:00 PM\n- Sunday: 7:00 AM - 2:00 PM\n- Monday: Closed"
  },
  "usage": {
    "prompt_tokens": 1234,
    "completion_tokens": 45,
    "total_tokens": 1279
  }
}
```

### GET /api/chat

Retrieve a list of available industries.

**Response:**
```json
{
  "industries": [
    { "value": "bakery", "label": "Bakery" },
    { "value": "coffeeshop", "label": "Coffee Shop" },
    { "value": "yogastudio", "label": "Yoga Studio" }
  ]
}
```

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # OpenAI API integration
│   ├── demo/
│   │   ├── components/
│   │   │   ├── chat-config.tsx   # Configuration panel
│   │   │   └── chat-interface.tsx # Chat UI
│   │   ├── page.tsx              # Main demo page
│   │   └── README.md             # Demo documentation
│   └── globals.css               # Custom styles (slider styles added)
└── public/
    └── mcp/
        └── example-data/          # Business JSON files
            ├── bakery_knowledge.json
            ├── coffeeshop_knowledge.json
            └── ... (32 total files)
```

## Data Structure

Each business JSON file contains:

```json
{
  "company": {
    "name": "Business Name",
    "abn": "...",
    "email": "...",
    "phone": "...",
    "address": "..."
  },
  "integrations": { ... },
  "trading_hours": { ... },
  "daily_sales": [ ... ],
  "product_menu": [ ... ],
  "wholesale_clients": [ ... ],
  "invoices": [ ... ],
  "bills": [ ... ],
  "staff": [ ... ],
  "custom_orders": [ ... ],
  "enquiries": [ ... ],
  "google_drive_files": [ ... ]
}
```

## Troubleshooting

### Issue: "OpenAI API key is not configured"
**Solution**: Make sure you've added `OPENAI_API_KEY` to your `.env.local` file and restarted the dev server.

### Issue: No industries showing in dropdown
**Solution**: Check that the `/public/mcp/example-data/` directory contains JSON files with the `_knowledge.json` suffix.

### Issue: AI responses are not accurate
**Solution**: 
1. Try lowering the temperature (0.3-0.5 for factual queries)
2. Ensure you've selected the correct industry filter
3. Check that the JSON data files are properly formatted

### Issue: Slow responses
**Solution**:
1. Switch to GPT-3.5 Turbo for faster responses
2. Reduce max tokens to 1000 or less
3. Filter to a specific industry instead of "All Industries"

### Issue: Rate limit errors
**Solution**: The OpenAI API has rate limits. Wait a moment between requests or upgrade your OpenAI plan.

## Security Considerations

1. **API Key Protection**: Never expose your OpenAI API key in client-side code
2. **Rate Limiting**: Consider implementing rate limiting on the `/api/chat` endpoint
3. **Input Validation**: The API route validates message format and required fields
4. **Error Handling**: Errors are caught and sanitized before being sent to the client

## Cost Management

OpenAI API charges based on tokens used. To manage costs:

1. Use GPT-4o Mini or GPT-3.5 Turbo for most queries
2. Set appropriate max token limits
3. Filter to specific industries when possible to reduce context size
4. Monitor usage through the OpenAI dashboard

### Approximate Costs (as of 2024)
- **GPT-4o**: ~$0.005 per 1K tokens
- **GPT-4o Mini**: ~$0.00015 per 1K tokens
- **GPT-3.5 Turbo**: ~$0.0005 per 1K tokens

## Future Enhancements

Potential improvements for the chatbot:

1. **Conversation Memory**: Persist chat history across sessions
2. **Export Chat**: Allow users to export conversations
3. **Voice Input**: Add speech-to-text functionality
4. **Data Visualization**: Generate charts based on queries
5. **Multi-Business Comparison**: Compare metrics across businesses
6. **Custom System Prompts**: Allow users to customize AI behavior
7. **Streaming Responses**: Implement real-time streaming for longer responses
8. **Suggested Questions**: Show relevant follow-up questions

## Support

For issues or questions:
1. Check this documentation
2. Review the example queries in the demo page
3. Consult the OpenAI API documentation
4. Check browser console for error messages

## Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Node.js SDK](https://github.com/openai/openai-node)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [React Hooks](https://react.dev/reference/react)

