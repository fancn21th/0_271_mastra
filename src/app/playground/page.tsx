"use client";

import { useState, useCallback } from "react";
import { Sender } from "./Sender";
import { Header } from "./Header";
import { MessageList } from "./MessageList";
import { BookOpen } from "lucide-react";
import type { MessagePart } from "./ComposedMarkdown";

// ==================== 消息项类型定义 ====================

export interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content?: string;
  parts?: MessagePart[];
  timestamp?: Date;
}

// ==================== 模拟消息数据 ====================

const mockMessages: MessageItem[] = [
  // 消息1: 完整的AI响应（包含所有parts）
  {
    id: "msg-1",
    role: "assistant",
    parts: [
      // 1. 欢迎 + 表单
      {
        type: "text",
        id: "p1",
        text: "您好！我来帮您处理这个招聘需求，请先填写以下信息：",
      },
      {
        type: "form",
        id: "p2",
        formId: "recruit-form",
        schema: {
          title: "招聘需求",
          fields: [
            {
              name: "position",
              label: "招聘职位",
              type: "input",
              required: true,
              placeholder: "例如：高级AI工程师",
            },
            {
              name: "priority",
              label: "优先级",
              type: "select",
              options: [
                { value: "high", label: "高" },
                { value: "medium", label: "中" },
                { value: "low", label: "低" },
              ],
              required: true,
            },
            {
              name: "department",
              label: "所属部门",
              type: "input",
              required: true,
            },
            {
              name: "upload",
              label: "上传JD文件",
              type: "input",
              disabled: true,
              description: "支持 PDF、Word 格式",
            },
          ],
        },
      },
      // 2. 分析完成 + taskList
      {
        type: "text",
        id: "p5",
        text: "根据分析结果，我为您生成以下待办事项：",
      },
      {
        type: "thinking",
        id: "p4",
        thinkingId: "analyze",
        title: "需求分析完成",
        status: "completed",
        duration: 3,
        steps: [
          {
            status: "success",
            title: "解析招聘需求",
            items: [
              {
                content: "明确研究目标与边界，我将调用知识和搜索工具。",
                toolCall: {
                  icon: <BookOpen className="size-4" />,
                  title: "调取知识",
                  content: "正在从知识库调取相关资料",
                },
                files: [
                  { icon: "📄", name: "AI发展趋势.pdf" },
                  { icon: "📄", name: "AI发展历史.doc" },
                ],
              },
            ],
          },
          {
            status: "success",
            title: "生成面试问题",
            items: [
              {
                content: "已生成 10 个面试问题",
                toolCall: {
                  icon: <BookOpen className="size-4" />,
                  title: "生成问题",
                  content: "基于职位要求生成面试题库",
                },
              },
            ],
          },
          {
            status: "success",
            title: "生成风险点说明",
            items: [{ content: "已识别 3 个潜在风险点" }],
          },
        ],
        taskList: {
          taskListId: "todos",
          title: "待办事项",
          tasks: [
            { id: "t1", content: "审核候选人简历", order: 1 },
            { id: "t2", content: "安排第一轮面试", order: 2 },
            { id: "t3", content: "发放offer", order: 3 },
          ],
        },
      },
      // 3. 搜索结果
      {
        type: "text",
        id: "p7",
        text: "让我帮您搜索合适的候选人...",
      },
      {
        type: "execution-result",
        id: "p8",
        execId: "search",
        title: "搜索候选人结果",
        items: [
          {
            key: "tool-1",
            status: "success",
            title: "找到 12 位候选人",
            toolName: "search_candidates",
            sections: [{ title: "结果", content: "返回 12 条匹配记录" }],
          },
          {
            key: "tool-2",
            status: "success",
            title: "分析完成",
            toolName: "analyze_candidates",
            sections: [{ title: "报告", content: "Top 3 候选人已标记" }],
          },
        ],
      },
      // 4. 确认表单
      {
        type: "text",
        id: "p9",
        text: "请确认以下信息是否正确：",
      },
      {
        type: "form",
        id: "p10",
        formId: "confirm-form",
        schema: {
          title: "确认信息",
          fields: [
            {
              name: "confirm",
              label: "确认继续处理此招聘需求",
              type: "switch",
              required: true,
            },
          ],
        },
      },
    ],
  },
];

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<MessageItem[]>(mockMessages);

  const handleSendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    // 添加用户消息
    const userMessage: MessageItem = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // 模拟 AI 回复
    setTimeout(() => {
      const aiMessage: MessageItem = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `收到你的消息："${content.trim()}"。这是 AI 的回复示例。`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="border-b border-[#E1E0E7] h-[64px] shrink-0">
        <Header />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="h-full w-[800px] mx-auto flex flex-col">
          <MessageList messages={messages} />
          <div className="pb-6">
            <Sender onSend={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}
