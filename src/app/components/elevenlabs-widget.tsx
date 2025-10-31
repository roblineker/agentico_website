"use client";

import { useEffect, useState } from "react";

export function ElevenLabsWidget() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    const existingScript = document.querySelector(
      'script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]'
    );

    if (existingScript) {
      // Script already exists, just mark it as loaded
      setIsScriptLoaded(true);
      return;
    }

    // Check if custom element is already defined (prevents re-registration)
    if (customElements.get("elevenlabs-convai")) {
      setIsScriptLoaded(true);
      return;
    }

    // Load the ElevenLabs ConvAI script
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    script.type = "text/javascript";
    
    script.onload = () => {
      setIsScriptLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load ElevenLabs ConvAI script");
    };

    document.head.appendChild(script);

    return () => {
      // Don't remove the script on unmount to prevent re-registration issues
      // The script and custom element should persist across component remounts
    };
  }, []);

  // Only render the widget once the script is loaded
  if (!isScriptLoaded) {
    return null;
  }

  return (
    <elevenlabs-convai agent-id="agent_3301k7rd434me7qs5xqkjb6ayn7x"></elevenlabs-convai>
  );
}
