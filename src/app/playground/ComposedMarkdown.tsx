"use client";

import React from "react";
import Markdown from "@/components/wuhan/composed/markdown";
import {
  DynamicForm,
  type FormSchema,
} from "@/components/wuhan/composed/dynamic-form";
import {
  TaskList,
  type TodoItem,
} from "@/components/wuhan/composed/task-list";
import { ExecutionResult } from "@/components/wuhan/composed/execution-result";
import { ThinkingStep, type ThinkingStepContentBlock } from "@/components/wuhan/composed/thinking-process";
import type { ThinkingStepItemProps } from "@/components/wuhan/composed/thinking-step-item";

// ==================== 消息部分的类型定义 ====================

interface BasePart {
  id: string;
}

interface TextPart extends BasePart {
  type: "text";
  text: string;
}

interface FormPart extends BasePart {
  type: "form";
  formId: string;
  schema: FormSchema;
}

interface TaskListPart extends BasePart {
  type: "task-list";
  taskListId: string;
  title?: string;
  tasks: TodoItem[];
}

interface ExecutionResultPart extends BasePart {
  type: "execution-result";
  execId: string;
  title?: string;
  items: Array<{
    key?: string;
    status: "success" | "error" | "loading" | "idle";
    title?: string;
    toolName?: string;
    sections?: Array<{ title?: string; content?: string }>;
  }>;
}

interface ThinkingPart extends BasePart {
  type: "thinking";
  thinkingId: string;
  title: string;
  status: "pending" | "thinking" | "completed" | "cancelled";
  duration?: number;
  steps?: Array<{
    status: "idle" | "running" | "success" | "error" | "cancelled";
    title: string;
    items?: Array<{
      content: string;
      toolCall?: { icon?: React.ReactNode; title?: string; content?: string };
      files?: Array<{ icon?: string; name: string }>;
    }>;
    defaultOpen?: boolean;
  }>;
  taskList?: {
    taskListId: string;
    title?: string;
    tasks: TodoItem[];
  };
}

export type MessagePart =
  | TextPart
  | FormPart
  | TaskListPart
  | ExecutionResultPart
  | ThinkingPart;

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  parts: MessagePart[];
}

// ==================== 渲染单个 Part ====================

function renderTextPart(part: TextPart): React.ReactNode {
  return <Markdown key={part.id} content={part.text} />;
}

function renderFormPart(part: FormPart): React.ReactNode {
  return (
    <DynamicForm
      key={part.id}
      schema={part.schema}
      showActions={false}
      readonly={true}
    />
  );
}

function renderTaskListPart(part: TaskListPart): React.ReactNode {
  return (
    <TaskList
      key={part.id}
      dataSource={part.tasks}
      title={part.title || "待办清单"}
      status="pending"
      editable={false}
      onItemsChange={() => {}}
      onConfirmExecute={() => {}}
    />
  );
}

function renderExecutionResultPart(part: ExecutionResultPart): React.ReactNode {
  return (
    <ExecutionResult
      key={part.id}
      title={part.items.length > 0 ? part.title || "工具调用" : undefined}
      items={part.items}
    />
  );
}

function renderThinkingPart(part: ThinkingPart): React.ReactNode {
  const contentBlocks: ThinkingStepContentBlock[] = [];

  if (part.steps && part.steps.length > 0) {
    contentBlocks.push({
      type: "subSteps",
      steps: part.steps as ThinkingStepItemProps[],
    });
  }

  if (part.taskList) {
    contentBlocks.push({
      type: "node",
      key: `tasklist-${part.taskList.taskListId}`,
      node: (
        <div className="mt-4">
          <TaskList
            dataSource={part.taskList.tasks}
            title={part.taskList.title || "待办清单"}
            status="pending"
            editable={false}
            onItemsChange={() => {}}
            onConfirmExecute={() => {}}
          />
        </div>
      ),
    });
  }

  return (
    <ThinkingStep
      key={part.id}
      title={part.title}
      status={part.status}
      duration={part.duration}
      contentBlocks={contentBlocks.length > 0 ? contentBlocks : undefined}
    />
  );
}

// 渲染函数映射
const partRenderers: Record<string, (part: MessagePart) => React.ReactNode | null> = {
  text: renderTextPart as (part: MessagePart) => React.ReactNode,
  form: renderFormPart as (part: MessagePart) => React.ReactNode,
  "task-list": renderTaskListPart as (part: MessagePart) => React.ReactNode,
  "execution-result": renderExecutionResultPart as (part: MessagePart) => React.ReactNode,
  thinking: renderThinkingPart as (part: MessagePart) => React.ReactNode,
};

// ==================== 主组件 ====================

interface ComposerMarkdownProps {
  message?: ChatMessage | null;
}

export function ComposerMarkdown({
  message,
}: ComposerMarkdownProps) {
  if (!message) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p>暂无消息</p>
      </div>
    );
  }

  const containerClass = message.role === "user"
    ? "flex justify-end w-full"
    : "flex justify-start w-full";

  return (
    <div className={containerClass}>
      <div className="w-fit max-w-[80%]">
        {message.parts.map((part) => {
          if (part.type === "text") {
            return renderTextPart(part);
          }
          return (
            <div key={part.id} className="my-4 min-w-[600px]">
              {partRenderers[part.type]?.(part)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

ComposerMarkdown.displayName = "ComposerMarkdown";

export default ComposerMarkdown;

// ==================== 导出类型供外部使用 ====================
export type {
  TextPart,
  FormPart,
  TaskListPart,
  ExecutionResultPart,
  ThinkingPart,
};
