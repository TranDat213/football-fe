import { ChatResponse } from '../types/chat.type';

export class ChatApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChatApiError';
  }
}

export const chatApi = {
  async sendMessage(message: string): Promise<ChatResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: message,
            },
          ],
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new ChatApiError(
          `API Error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      return this.parseResponse(data);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ChatApiError('Request timeout. Please try again.');
      }
      if (error instanceof ChatApiError) {
        throw error;
      }
      throw new ChatApiError(
        'An unexpected error occurred while sending the message.',
      );
    } finally {
      clearTimeout(timeoutId);
    }
  },

  // Isolate parsing logic for easy updates
  parseResponse(data: any): ChatResponse {
    if (data && typeof data.content === 'string') {
      return data;
    }
    // Fallback if the data shape changes, attempt to parse or return a generic error
    console.error('Invalid chat response format:', data);
    throw new ChatApiError('Invalid response format received from server.');
  },
};
