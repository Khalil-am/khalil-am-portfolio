"use client";

import { useChatbot } from "@/contexts/ChatContext";
import { Bot, BotOff } from "lucide-react";
import { Button } from "./ui/Button";

export default function ChatToggle() {
  const { isVisible, toggleChatbot } = useChatbot();

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={toggleChatbot}
      aria-expanded={isVisible}
      aria-controls="khalil-ai-assistant"
      aria-label={isVisible ? "Close AI assistant" : "Open AI assistant"}
    >
      {isVisible ? <Bot className="size-5" /> : <BotOff className="size-5" />}
    </Button>
  );
}
