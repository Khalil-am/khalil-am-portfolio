import { chatLimits } from "@/lib/chat";
import { SendHorizontal, Trash } from "lucide-react";
import type { ChangeEventHandler } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

interface ChatInputProps {
  input: string;
  handleSubmit: () => void | Promise<void>;
  handleInputChange: ChangeEventHandler<HTMLInputElement>;
  clearChat: () => void;
  isLoading: boolean;
  hasMessages: boolean;
}

export default function ChatInput({
  input,
  handleSubmit,
  handleInputChange,
  clearChat,
  isLoading,
  hasMessages,
}: ChatInputProps) {
  const canSubmit = input.trim().length > 0 && !isLoading;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (canSubmit) void handleSubmit();
      }}
      className="flex gap-1 border-t px-2 py-3"
    >
      <Button
        title="Clear chat"
        variant="outline"
        onClick={clearChat}
        className="px-3 py-2"
        disabled={!hasMessages || isLoading}
        type="button"
      >
        <Trash className="size-4 text-rose-500" />
        <span className="sr-only">Clear chat</span>
      </Button>
      <label htmlFor="chat-message" className="sr-only">
        Message for Khalil&apos;s AI assistant
      </label>
      <Input
        id="chat-message"
        autoFocus
        placeholder="Ask about Khalil..."
        maxLength={chatLimits.messageLength}
        disabled={isLoading}
        value={input}
        onChange={handleInputChange}
      />
      <Button
        title="Send message"
        variant="default"
        className="px-3 py-2"
        disabled={!canSubmit}
        type="submit"
      >
        <SendHorizontal className="size-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
}
