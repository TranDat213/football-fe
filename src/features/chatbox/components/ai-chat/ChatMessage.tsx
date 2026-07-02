import React from "react";
import { motion } from "framer-motion";
import { Copy, RefreshCw, ThumbsDown, ThumbsUp, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ChatMessage as IChatMessage } from "../../types/chat.type";
import { ChatAvatar } from "./ChatAvatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  message: IChatMessage;
  onRegenerate?: () => void;
  isLast?: boolean;
}

export const ChatMessage = React.memo(({ message, onRegenerate, isLast }: ChatMessageProps) => {
  const isUser = message.role === "user";
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex w-full gap-3 text-sm group", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <ChatAvatar role={message.role} />
      
      <div className={cn("flex flex-col gap-2 max-w-[78%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2 shadow-sm",
            isUser ? "bg-green-600 text-white rounded-tr-sm" : "bg-muted/60 text-foreground rounded-tl-sm"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-none break-words">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus as any}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-md my-2"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-background/50 rounded px-1.5 py-0.5 text-xs font-mono" {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        
        {!isUser && (
          <div className="flex items-center gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7 transition-opacity hover:opacity-100" onClick={handleCopy} title="Copy response">
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 transition-opacity hover:opacity-100" title="Good response">
              <ThumbsUp size={14} />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 transition-opacity hover:opacity-100" title="Bad response">
              <ThumbsDown size={14} />
            </Button>
            {isLast && onRegenerate && (
              <Button variant="ghost" size="icon" className="h-7 w-7 transition-opacity hover:opacity-100" onClick={onRegenerate} title="Regenerate">
                <RefreshCw size={14} />
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
});

ChatMessage.displayName = "ChatMessage";
