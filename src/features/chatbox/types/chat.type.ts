export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: {
    role: "assistant";
    content: string;
  };
}