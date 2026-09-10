export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export const chatLimits = {
  messageIdLength: 200,
  messageLength: 4_000,
  conversationMessages: 20,
  conversationCharacters: 12_000,
  requestBytes: 16_000,
} as const;
