# AI Chatbot Demo

This demo page showcases an AI-powered chatbot that can interact with example business data using OpenAI's GPT models.

## Features

- **Multi-Model Support**: Choose between GPT-4o, GPT-4o Mini, or GPT-3.5 Turbo
- **Industry-Specific Queries**: Filter data by specific business type or query across all industries
- **Configurable AI Parameters**: Adjust temperature and max tokens for different use cases
- **Rich Business Data**: Access to 32+ business examples with comprehensive operational data

## Setup

### 1. Environment Variables

Add your OpenAI API key to your `.env.local` file:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Example Data

The chatbot has access to business data located in `/public/mcp/example-data/`. Each JSON file contains:

- Company information (name, contact details, address)
- Integration details (POS, accounting, email systems)
- Trading hours
- Daily sales records
- Product/service menus
- Client information
- Invoices and bills
- Staff details
- Custom orders and enquiries
- File storage references

## Usage

### Access the Demo

Navigate to `/demo` in your browser to access the chatbot interface.

### Example Queries

Try these example questions:

1. **Sales Analysis**
   - "What are the top selling products at the bakery?"
   - "Show me the total sales for the coffee shop last week"
   - "Which business has the highest revenue?"

2. **Financial Queries**
   - "Show me all unpaid invoices"
   - "What bills are due this month?"
   - "Calculate the profit margin for the gym"

3. **Staff Information**
   - "List all staff members at the yoga studio"
   - "Who is the head baker at the bakery?"
   - "What qualifications do the plumbers have?"

4. **Operational Details**
   - "What are the trading hours for the tattoo studio?"
   - "Which businesses are closed on Mondays?"
   - "Show me the delivery schedule for wholesale clients"

5. **Client Management**
   - "List all wholesale clients for the bakery"
   - "What custom orders are pending?"
   - "Show me recent enquiries for the event planner"

## Configuration Options

### Model Selection

- **GPT-4o**: Most capable, best for complex queries
- **GPT-4o Mini**: Balanced performance and cost
- **GPT-3.5 Turbo**: Fast responses, lower cost

### Temperature (0.0 - 2.0)

- **Low (0.0-0.5)**: More focused and deterministic responses, best for factual queries
- **Medium (0.5-1.0)**: Balanced creativity and accuracy
- **High (1.0-2.0)**: More creative and varied responses

### Max Tokens (100 - 4000)

Controls the maximum length of the AI's response. Adjust based on whether you need brief answers or detailed explanations.

### Industry Filter

Select a specific business type to focus the AI's attention on that industry's data, or choose "All Industries" to query across all available data.

## Technical Details

### API Route

**Endpoint**: `/api/chat`

**Methods**:
- `POST`: Send chat messages and receive AI responses
- `GET`: Retrieve list of available industries

**POST Request Body**:
```json
{
  "messages": [
    { "role": "user", "content": "Your question here" }
  ],
  "model": "gpt-4o-mini",
  "temperature": 0.7,
  "maxTokens": 2000,
  "industry": "bakery"
}
```

**Response**:
```json
{
  "message": {
    "role": "assistant",
    "content": "AI response here"
  },
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 50,
    "total_tokens": 200
  }
}
```

### Components

1. **ChatConfigPanel** (`components/chat-config.tsx`)
   - Collapsible configuration panel
   - Model, industry, temperature, and token controls
   - Real-time industry loading from API

2. **ChatInterface** (`components/chat-interface.tsx`)
   - Message display with role-based styling
   - Auto-expanding textarea input
   - Loading states and error handling
   - Clear chat functionality

3. **Demo Page** (`page.tsx`)
   - Main layout and state management
   - Example queries and information
   - Business data overview

## Available Business Types

The demo includes data for the following industries:

- Accounting Firm
- Air Conditioning
- Artist
- Bakery
- Bookstore Cafe
- Builder
- Buyers Agent
- Car Detailing
- Cleaning Company
- Coffee Shop
- Electrical Company
- Engineering Consultant
- Event Planner
- Florist
- Fund Manager
- Gym
- Hair Salon
- Kebab Shop
- Landscaper
- Law Firm
- Maintenance Company
- Online Education
- Photographer
- Pizza Shop
- Plumber
- Property Group
- Real Estate
- Recruiting Company
- School
- Tattoo Studio
- Veterinary
- Yoga Studio

## Notes

- The AI has access to all data in the selected industry's JSON file
- Responses are grounded in actual data from the example files
- The system message provides the AI with complete business context
- All monetary values are in AUD (Australian Dollars)
- Date formats follow ISO 8601 standard (YYYY-MM-DD)

