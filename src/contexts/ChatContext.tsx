import { createContext, ReactNode, useContext, useState } from "react";

// Define the ChatContext with initial values
const ChatContext = createContext({
  isVisible: true,
  toggleChatbot: () => {},
});

// Hook to use the ChatContext
export const useChatbot = () => useContext(ChatContext);

interface Props {
  children: ReactNode;
}

// ChatProvider component
export function ChatProvider({ children }: Props) {
  const [isVisible, setIsVisible] = useState(true);

  // Function to toggle the chatbot's visibility
  const toggleChatbot = () => {
    setIsVisible(!isVisible);
  };

  return (
    <ChatContext.Provider value={{ isVisible, toggleChatbot }}>
      {children}
    </ChatContext.Provider>
  );
}
