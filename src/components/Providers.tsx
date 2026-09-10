"use client";

import { ChatProvider } from "@/contexts/ChatContext";
import { useChatbot } from "@/contexts/ChatContext";
import dynamic from "next/dynamic";
import { ThemeProvider, useTheme } from "next-themes";
import React from "react";
import { Toaster } from "sonner";

const Chat = dynamic(() => import("./Chat"), { ssr: false });

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      enableSystem
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
    >
      <ChatProvider>
        {children}
        <ChatSurface />
      </ChatProvider>
      <ToastProvider />
    </ThemeProvider>
  );
}

function ChatSurface() {
  const { isVisible } = useChatbot();
  return isVisible ? <Chat /> : null;
}

function ToastProvider() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      className="mt-12"
      position="top-right"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}
