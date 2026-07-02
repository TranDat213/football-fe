"use client";

import { useState, useCallback, useRef } from "react";
import { ChatMessage } from "../types/chat.type";
import { chatApi, ChatApiError } from "../api/chat.api";
import { toast } from "sonner";
import { scrollToBottom } from "@/lib/scroll";

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const performScroll = useCallback(() => {
    // Provide a small timeout to allow DOM update
    setTimeout(() => {
      scrollToBottom(scrollRef.current);
    }, 100);
  }, []);

  const internalSendMessage = async (msgContent: string) => {
    if (!msgContent.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);

    const newUserMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: msgContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    performScroll();

    try {
      const result = await chatApi.sendMessage(msgContent);
      
      const newAssistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.message.content ,
        timestamp: new Date(),
      };
      console.log("assistant", newAssistantMsg);
      setMessages((prev) => [...prev, newAssistantMsg]);
    } catch (err) {
      const errMsg = err instanceof ChatApiError ? err.message : "Failed to connect to chat API.";
      setError(errMsg);
      toast.error(errMsg);
      // We keep the user message, so they can retry later.
    } finally {
      setIsLoading(false);
      performScroll();
    }
  };

  const sendMessage = useCallback(() => {
    internalSendMessage(input);
  }, [input, isLoading, internalSendMessage]);

  const sendSuggestedPrompt = useCallback((prompt: string) => {
    internalSendMessage(prompt);
  }, [isLoading, internalSendMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setInput("");
  }, []);

  const regenerateResponse = useCallback(() => {
    if (messages.length === 0 || isLoading) return;
    
    // Find the last user message
    let lastUserMessage = "";
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        lastUserMessage = messages[i].content;
        break;
      }
    }

    if (!lastUserMessage) return;

    // Remove the last assistant message if it failed or is incomplete
    if (messages[messages.length - 1].role === "assistant") {
       setMessages((prev) => prev.slice(0, -1));
    }

    internalSendMessage(lastUserMessage);
  }, [messages, isLoading, internalSendMessage]);

  return {
    messages,
    isLoading,
    error,
    input,
    setInput,
    sendMessage,
    sendSuggestedPrompt,
    clearChat,
    regenerateResponse,
    scrollRef,
  };
};
