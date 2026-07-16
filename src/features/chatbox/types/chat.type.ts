export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  metadata?: {
    type: string;
    items: any[];
  } | null;
}

export interface ChatResponse {
  role: "assistant";
  content: string;
  metadata?: {
    type: string;
    items: any[];
  } | null;
}