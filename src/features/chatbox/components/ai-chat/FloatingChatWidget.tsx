"use client";

import React, { useState } from "react";
import { ChatWindow } from "./ChatWindow";
import { Bot, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const FloatingChatWidget = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleOpen = () => setIsOpen((prev) => !prev);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={toggleOpen}
                size="icon"
                className="h-16 w-16 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-[#0F172A] hover:bg-[#0F172A]/90 text-white group"
                aria-label="Open AI Chat"
              >
                <Bot className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ChatWindow
        isOpen={isOpen}
        onClose={handleClose}
        onMinimize={handleClose} 
      />
    </>
  );
});

FloatingChatWidget.displayName = "FloatingChatWidget";
