import React from "react";
import { Bot } from "lucide-react";
import { SuggestedPrompts } from "./SuggestedPrompts";

interface EmptyStateProps {
  onPromptClick: (prompt: string) => void;
  disabled?: boolean;
}

export const EmptyState = React.memo(({ onPromptClick, disabled }: EmptyStateProps) => {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 px-2 py-0 text-center animate-in fade-in zoom-in duration-300">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Bot size={32} />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight">How can I help you?</h3>
        <p className="text-sm text-muted-foreground">
          Ask me anything about football fields, booking, or pricing.
        </p>
      </div>

      <div className="w-full max-w-sm pt-4">
        <SuggestedPrompts onSelect={onPromptClick} disabled={disabled} />
      </div>
    </div>
  );
});

EmptyState.displayName = "EmptyState";
