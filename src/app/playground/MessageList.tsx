"use client";

import { useEffect, useRef } from "react";
import { AIMessage, UserMessage } from "@/components/wuhan/composed/message";
import type { MessageItem } from "./page";
import { cn } from "@/lib/utils";
import ComposedMarkdown from "./ComposedMarkdown";

interface MessageListProps {
  messages: MessageItem[];
}

export function MessageList({ messages }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4">
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <p>暂无消息，开始对话吧</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto" ref={scrollRef}>
      <div className={cn("flex flex-col gap-4 py-4")}>
        {messages.map((message) => {
          if (message.role === "user") {
            return (
              <div key={message.id} className="flex justify-end w-full">
                <UserMessage>{message.content}</UserMessage>
              </div>
            );
          }

          return (
            <div key={message.id} className="flex justify-start w-full">
              <AIMessage>
                {/* 如果有 parts，用 ComposedMarkdown 渲染 */}
                {message.parts ? (
                  <ComposedMarkdown
                    message={{
                      id: message.id,
                      role: "assistant",
                      parts: message.parts,
                    }}
                  />
                ) : (
                  /* 否则渲染简单的文本内容 */
                  <UserMessage>{message.content}</UserMessage>
                )}
              </AIMessage>
            </div>
          );
        })}
      </div>
    </div>
  );
}
