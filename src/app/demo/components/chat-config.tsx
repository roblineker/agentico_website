'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

export interface ChatConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  industry: string;
}

interface ChatConfigProps {
  config: ChatConfig;
  onConfigChange: (config: ChatConfig) => void;
}

interface Industry {
  value: string;
  label: string;
}

export function ChatConfigPanel({ config, onConfigChange }: ChatConfigProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load available industries
    fetch('/api/chat')
      .then(res => res.json())
      .then(data => {
        setIndustries([{ value: 'all', label: 'All Industries' }, ...data.industries]);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load industries:', err);
        setIsLoading(false);
      });
  }, []);

  const handleChange = (field: keyof ChatConfig, value: string | number) => {
    onConfigChange({ ...config, [field]: value });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4">
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-900 transition-colors">
        <span>⚙️ AI Configuration</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950 p-4 space-y-4">
        {/* Model Selection */}
        <div className="space-y-2">
          <Label htmlFor="model" className="text-sm font-medium text-zinc-300">
            Model
          </Label>
          <Select
            value={config.model}
            onValueChange={(value) => handleChange('model', value)}
          >
            <SelectTrigger id="model" className="bg-zinc-900 border-zinc-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="gpt-4o" className="text-white hover:bg-zinc-800">
                GPT-4o (Most Capable)
              </SelectItem>
              <SelectItem value="gpt-4o-mini" className="text-white hover:bg-zinc-800">
                GPT-4o Mini (Balanced)
              </SelectItem>
              <SelectItem value="gpt-3.5-turbo" className="text-white hover:bg-zinc-800">
                GPT-3.5 Turbo (Fast)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Industry Selection */}
        <div className="space-y-2">
          <Label htmlFor="industry" className="text-sm font-medium text-zinc-300">
            Business Industry
          </Label>
          <Select
            value={config.industry}
            onValueChange={(value) => handleChange('industry', value)}
            disabled={isLoading}
          >
            <SelectTrigger id="industry" className="bg-zinc-900 border-zinc-800 text-white">
              <SelectValue placeholder={isLoading ? 'Loading...' : 'Select industry'} />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 max-h-[300px]">
              {industries.map((industry) => (
                <SelectItem 
                  key={industry.value} 
                  value={industry.value}
                  className="text-white hover:bg-zinc-800"
                >
                  {industry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-zinc-500">
            Select a specific industry or &quot;All Industries&quot; to query across all example data
          </p>
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <Label htmlFor="temperature" className="text-sm font-medium text-zinc-300">
            Temperature: {config.temperature}
          </Label>
          <input
            id="temperature"
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={config.temperature}
            onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Precise</span>
            <span>Creative</span>
          </div>
        </div>

        {/* Max Tokens */}
        <div className="space-y-2">
          <Label htmlFor="maxTokens" className="text-sm font-medium text-zinc-300">
            Max Tokens: {config.maxTokens}
          </Label>
          <input
            id="maxTokens"
            type="range"
            min="100"
            max="4000"
            step="100"
            value={config.maxTokens}
            onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Short (100)</span>
            <span>Long (4000)</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-4 p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
          <p className="text-xs text-zinc-400">
            <strong className="text-zinc-300">Tip:</strong> Start with GPT-4o Mini and adjust temperature 
            based on your needs. Lower temperature for factual queries, higher for creative responses.
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

