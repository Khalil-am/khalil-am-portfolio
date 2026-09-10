"use client";

import { useChatbot } from "@/contexts/ChatContext";
import type { ChatMessage as ChatMessageData } from "@/lib/chat";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/Accordion";

function messageId() {
  return crypto.randomUUID();
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

async function responseError(response: Response) {
  const payload: unknown = await response.json().catch(() => null);
  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    return new Error(payload.error);
  }

  return new Error("The portfolio assistant could not complete this request.");
}

export default function Chat() {
  const { isVisible } = useChatbot();
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const requestControllerRef = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      requestControllerRef.current?.abort();
      requestControllerRef.current = null;
    },
    [],
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const clearChat = () => {
    setMessages([]);
    setInput("");
    setError(undefined);
  };

  const handleSubmit = async () => {
    const content = input.trim();
    if (!content || isLoading || requestControllerRef.current) return;

    const userMessage: ChatMessageData = {
      id: messageId(),
      role: "user",
      content,
    };
    const requestMessages = [...messages, userMessage];
    const assistantMessageId = messageId();
    const requestController = new AbortController();

    requestControllerRef.current = requestController;
    setMessages(requestMessages);
    setInput("");
    setError(undefined);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: requestMessages.map(({ role, content }) => ({
            role,
            content,
          })),
        }),
        cache: "no-store",
        signal: requestController.signal,
      });

      if (!response.ok) throw await responseError(response);
      if (!response.body) {
        throw new Error("The portfolio assistant returned an empty response.");
      }

      const contentType = response.headers.get("content-type")?.toLowerCase();
      if (!contentType?.startsWith("text/plain")) {
        throw new Error(
          "The portfolio assistant returned an invalid response.",
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let receivedText = false;

      const appendText = (text: string) => {
        if (!text) return;
        receivedText = true;
        setMessages((currentMessages) => {
          const lastMessage = currentMessages[currentMessages.length - 1];
          if (lastMessage?.id === assistantMessageId) {
            return [
              ...currentMessages.slice(0, -1),
              { ...lastMessage, content: lastMessage.content + text },
            ];
          }

          return [
            ...currentMessages,
            {
              id: assistantMessageId,
              role: "assistant",
              content: text,
            },
          ];
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        appendText(decoder.decode(value, { stream: true }));
      }
      appendText(decoder.decode());

      if (!receivedText) {
        throw new Error("The portfolio assistant returned an empty response.");
      }
    } catch (requestError) {
      if (!isAbortError(requestError)) {
        setMessages(messages);
        setError(
          requestError instanceof Error
            ? requestError
            : new Error("The portfolio assistant request failed."),
        );
      }
    } finally {
      if (requestControllerRef.current === requestController) {
        requestControllerRef.current = null;
        setIsLoading(false);
      }
    }
  };

  return (
    isVisible && (
      <Accordion
        type="single"
        collapsible
        defaultValue="item-1"
        className="flexs relative z-40"
      >
        <AccordionItem
          id="khalil-ai-assistant"
          value="item-1"
          className="fixed bottom-4 left-4 right-4 rounded-md border bg-background shadow-lg sm:bottom-8 sm:left-auto sm:right-8 sm:w-80"
          aria-label="Khalil Abu Mushref AI assistant"
        >
          <AccordionTrigger className="border-b px-6">
            <ChatHeader />
          </AccordionTrigger>
          <AccordionContent className="flex max-h-96 min-h-80 flex-col justify-between p-0">
            <ChatMessages
              messages={messages}
              error={error}
              isLoading={isLoading}
            />
            <ChatInput
              input={input}
              handleSubmit={handleSubmit}
              handleInputChange={handleInputChange}
              clearChat={clearChat}
              isLoading={isLoading}
              hasMessages={messages.length > 0}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  );
}
