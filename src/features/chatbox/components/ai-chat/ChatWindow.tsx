import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { useChat } from "../../hooks/useChat";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export const ChatWindow = React.memo(({ isOpen, onClose, onMinimize }: ChatWindowProps) => {
  const {
    messages,
    isLoading,
    error,
    input,
    setInput,
    sendMessage,
    sendSuggestedPrompt,
    regenerateResponse,
    scrollRef,
  } = useChat();

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 sm:bottom-6 sm:right-6 sm:inset-auto z-50 flex h-[100dvh] w-full sm:h-[min(650px,calc(100vh-32px))] sm:w-[380px] lg:h-[680px] lg:max-h-[calc(100vh-48px)] lg:w-[420px] flex-col overflow-hidden bg-background sm:shadow-2xl sm:rounded-3xl border-t sm:border"
          role="dialog"
          aria-label="AI Chat Assistant"
          aria-modal="true"
        >
          <ChatHeader onClose={onClose} onMinimize={onMinimize} />
          
          <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-50/50 dark:bg-slate-900/20">
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              onRegenerate={regenerateResponse}
              scrollRef={scrollRef}
              onPromptClick={sendSuggestedPrompt}
            />
            
            {error && (
              <div className="absolute bottom-2 inset-x-4 animate-in slide-in-from-bottom flex items-center justify-between rounded-lg border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2 text-xs hover:bg-destructive/20"
                  onClick={regenerateResponse}
                >
                  <RefreshCw size={12} className="mr-1" />
                  Retry
                </Button>
              </div>
            )}
          </div>
          
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            disabled={isLoading}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
});

ChatWindow.displayName = "ChatWindow";
