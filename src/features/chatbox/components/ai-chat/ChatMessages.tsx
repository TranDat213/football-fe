import React from "react";
import { ChatMessage as IChatMessage } from "../../types/chat.type";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { EmptyState } from "./EmptyState";

interface ChatMessagesProps {
  messages: IChatMessage[];
  isLoading: boolean;
  onRegenerate: () => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onPromptClick: (prompt: string) => void;
}

export const ChatMessages = React.memo(({
  messages,
  isLoading,
  onRegenerate,
  scrollRef,
  onPromptClick
}: ChatMessagesProps) => {
  if (messages.length === 0) {
    return <EmptyState onPromptClick={onPromptClick} disabled={isLoading} />;
  }

  return (
    <div 
      className="flex flex-col px-5 py-4 overflow-y-auto overflow-x-hidden w-full h-full space-y-4 scroll-smooth"
      ref={scrollRef}
    >
      {messages.map((msg, idx) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          isLast={idx === messages.length - 1}
          onRegenerate={onRegenerate}
        />
      ))}
      
      {isLoading && (
        <div className="flex w-full mt-2">
          <TypingIndicator />
        </div>
      )}
    </div>
  );
});

ChatMessages.displayName = "ChatMessages";
