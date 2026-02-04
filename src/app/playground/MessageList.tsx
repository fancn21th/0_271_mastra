"use client";
import { StatusTag } from "@/components/wuhan/composed/status-tag";
export function MessageList() {
  return (
    <div className="flex-1 overflow-y-auto px-4">
      <div>消息列表</div>
       <StatusTag status="confirmed" />
    </div>
  );
}
