import React, { useRef, useEffect } from "react";
import { Send, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export const ChatInput = React.memo(({ input, setInput, onSend, disabled }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="px-5 py-3 bg-background border-t h-[72px] shrink-0 flex items-center justify-center">
      <div className="relative flex items-center h-[52px] bg-muted/50 rounded-[26px] border px-4 shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:bg-background transition-colors w-full">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          className="w-full resize-none bg-transparent outline-none py-[15px] pt-[16px] text-sm placeholder:text-muted-foreground/70 scrollbar-none overflow-hidden h-[52px] leading-tight"
          rows={1}
          disabled={disabled}
        />
        <div className="ml-2 flex shrink-0 items-center justify-center">
          <Button
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={!input.trim() || disabled}
            onClick={onSend}
            aria-label="Send message"
          >
            <Send size={14} className="ml-0.5" />
          </Button>
        </div>
      </div>
      <div className="mt-2 text-center">
        <span className="text-[10px] text-muted-foreground/60 flex items-center justify-center gap-1">
          Press <CornerDownLeft size={10} /> to send, Shift + <CornerDownLeft size={10} /> for new line
        </span>
      </div>
    </div>
  );
});

ChatInput.displayName = "ChatInput";
