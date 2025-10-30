'use client';

import { useState } from 'react';
import { ChatConfigPanel, ChatConfig } from './components/chat-config';
import { ChatInterface } from './components/chat-interface';

export default function DemoPage() {
  const [config, setConfig] = useState<ChatConfig>({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2000,
    industry: 'all',
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            AI Chatbot Demo
          </h1>
          <p className="text-zinc-400">
            Interact with our example business data using OpenAI&apos;s GPT models. 
            Configure the AI settings and ask questions about various businesses.
          </p>
        </div>

        {/* Example Queries */}
        <div className="mb-6 p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
          <h3 className="text-sm font-semibold text-zinc-300 mb-2">
            💡 Example Questions to Try:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-zinc-400">
            <div>• &quot;What are the top selling products at the bakery?&quot;</div>
            <div>• &quot;Show me unpaid invoices across all businesses&quot;</div>
            <div>• &quot;Which business has the highest sales?&quot;</div>
            <div>• &quot;List all staff members at the yoga studio&quot;</div>
            <div>• &quot;What are the trading hours for the coffee shop?&quot;</div>
            <div>• &quot;Calculate total revenue for the car detailing business&quot;</div>
          </div>
        </div>

        {/* Configuration Panel */}
        <ChatConfigPanel config={config} onConfigChange={setConfig} />

        {/* Configuration Summary */}
        <div className="mb-4 flex flex-wrap gap-2 text-xs">
          <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300">
            Model: <span className="text-blue-400 font-medium">{config.model}</span>
          </div>
          <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300">
            Industry: <span className="text-blue-400 font-medium">{config.industry}</span>
          </div>
          <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300">
            Temp: <span className="text-blue-400 font-medium">{config.temperature}</span>
          </div>
          <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300">
            Max Tokens: <span className="text-blue-400 font-medium">{config.maxTokens}</span>
          </div>
        </div>

        {/* Chat Interface */}
        <ChatInterface config={config} />

        {/* Info Footer */}
        <div className="mt-6 p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
          <h3 className="text-sm font-semibold text-zinc-300 mb-2">
            📊 Available Business Data:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-zinc-400">
            <div>• Bakery</div>
            <div>• Car Detailing</div>
            <div>• Yoga Studio</div>
            <div>• Bookstore Cafe</div>
            <div>• Florist</div>
            <div>• Veterinary</div>
            <div>• Tattoo Studio</div>
            <div>• Artist</div>
            <div>• Kebab Shop</div>
            <div>• Fund Manager</div>
            <div>• Plumber</div>
            <div>• Buyers Agent</div>
            <div>• Engineering Consultant</div>
            <div>• Online Education</div>
            <div>• Property Group</div>
            <div>• Real Estate</div>
            <div>• School</div>
            <div>• Maintenance Company</div>
            <div>• Event Planner</div>
            <div>• Gym</div>
            <div>• Photographer</div>
            <div>• Cleaning Company</div>
            <div>• Coffee Shop</div>
            <div>• Pizza Shop</div>
            <div>• Law Firm</div>
            <div>• Accounting Firm</div>
            <div>• Air Conditioning</div>
            <div>• Landscaper</div>
            <div>• Builder</div>
            <div>• Recruiting Company</div>
            <div>• Hair Salon</div>
            <div>• Electrical Company</div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-4 p-4 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-500">
          <p>
            <strong className="text-zinc-400">Technical Details:</strong> This demo uses the OpenAI API 
            with your configured model. The AI has access to comprehensive business data including 
            sales records, invoices, bills, staff information, trading hours, and more. All data is 
            loaded from JSON files in the <code className="bg-zinc-900 px-1 py-0.5 rounded">
            /public/mcp/example-data</code> directory.
          </p>
        </div>
      </div>
    </div>
  );
}

