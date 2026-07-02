import React from "react";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatAvatarProps {
  role: "user" | "assistant";
  className?: string;
}

export const ChatAvatar = React.memo(({ role, className }: ChatAvatarProps) => {
  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm",
        role === "user"
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground",
        className
      )}
    >
      {role === "user" ? <User size={16} /> : <Bot size={16} />}
    </div>
  );
});

ChatAvatar.displayName = "ChatAvatar";
