import React from "react";
import { motion } from "framer-motion";

export const TypingIndicator = React.memo(() => {
  return (
    <div className="flex items-center space-x-1.5 p-4 pl-3" aria-label="AI is typing">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-muted-foreground/50"
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "loop",
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
});

TypingIndicator.displayName = "TypingIndicator";
