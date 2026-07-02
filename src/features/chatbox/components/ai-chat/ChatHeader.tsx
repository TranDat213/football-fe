import React from "react";
import { X, Minus, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onClose: () => void;
  onMinimize: () => void;
}

export const ChatHeader = React.memo(({ onClose, onMinimize }: ChatHeaderProps) => {
  return (
    <div className="flex h-16 items-center justify-between border-b bg-card px-4 py-2 shadow-sm z-10 shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bot size={20} />
          </div>
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold tracking-tight">AI Assistant</h2>
          <p className="text-[12px] text-muted-foreground flex items-center gap-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            Online
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hidden sm:inline-flex"
          onClick={onMinimize}
          aria-label="Minimize chat"
        >
          <Minus size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={onClose}
          aria-label="Close chat"
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
});

ChatHeader.displayName = "ChatHeader";
