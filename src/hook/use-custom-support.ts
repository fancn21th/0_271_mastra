"use client";

import { useChat } from "@ai-sdk/react";
import { useCallback, useMemo } from "react";
import { DefaultChatTransport } from "ai";

interface SendOptions {
  userPrompt: string;
}

export function useCustomerSupport() {
  const { messages, sendMessage, setMessages, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/workflow",
      prepareSendMessagesRequest({ messages }) {
        const lastMessage = messages[messages.length - 1];
        const userPrompt =
          lastMessage?.parts?.find((p) => p.type === "text")?.text || "";

        return {
          body: {
            userPrompt,
          },
        };
      },
    }),
  });

  const send = useCallback(
    ({ userPrompt }: SendOptions) => {
      if (!userPrompt.trim()) return;

      sendMessage({
        parts: [{ type: "text", text: userPrompt }],
      });
    },
    [sendMessage],
  );

  const reset = () => {
    setMessages([]);
  };

  const workflow = useMemo(() => {
    const assistantMessages = messages.filter((m) => m.role === "assistant");
    const lastAssistantMessage =
      assistantMessages[assistantMessages.length - 1];

    if (!lastAssistantMessage) return null;

    return lastAssistantMessage;
  }, [messages]);

  return {
    send,
    status,
    error,
    stop,
    workflow,
    reset,
  };
}
