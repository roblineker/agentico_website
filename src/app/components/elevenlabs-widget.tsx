"use client";

import { useEffect } from "react";

export function ElevenLabsWidget() {
  useEffect(() => {
    // Load the ElevenLabs ConvAI script
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    script.type = "text/javascript";
    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <elevenlabs-convai agent-id="agent_3301k7rd434me7qs5xqkjb6ayn7x"></elevenlabs-convai>
  );
}
