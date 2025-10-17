"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    ElevenLabsConvAI?: any;
  }
}

export function ElevenLabsWidget() {
  useEffect(() => {
    // Load the ElevenLabs ConvAI script
    const script = document.createElement("script");
    script.src = "https://elevenlabs.io/convai-widget/index.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <elevenlabs-convai 
      agent-id="agent_3301k7rd434me7qs5xqkjb6ayn7x"
    />
  );
}
