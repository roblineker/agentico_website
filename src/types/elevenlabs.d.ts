declare namespace JSX {
  interface IntrinsicElements {
    'elevenlabs-convai': {
      'agent-id': string;
    };
  }
}

declare global {
  interface Window {
    ElevenLabsConvAI?: {
      init: (config: Record<string, unknown>) => void;
      [key: string]: unknown;
    };
  }
}

export {};
