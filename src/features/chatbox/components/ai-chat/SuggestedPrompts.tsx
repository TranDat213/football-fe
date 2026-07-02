import React from "react";
import { motion } from "framer-motion";
import { MessageSquarePlus } from "lucide-react";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

const PROMPTS = [
  "Find available fields",
  "Book a field",
  "Pricing",
  "Contact support",
];

export const SuggestedPrompts = React.memo(({ onSelect, disabled }: SuggestedPromptsProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {PROMPTS.map((prompt, index) => (
        <motion.button
          key={prompt}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(prompt)}
          disabled={disabled}
          className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <MessageSquarePlus size={14} />
          {prompt}
        </motion.button>
      ))}
    </div>
  );
});

SuggestedPrompts.displayName = "SuggestedPrompts";
