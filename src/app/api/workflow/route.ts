import { mastra } from "@/mastra";
import { createUIMessageStreamResponse } from "ai";
import { handleWorkflowStream } from "@mastra/ai-sdk";

import { ProxyAgent, setGlobalDispatcher } from "undici";

// 如果设置了代理环境变量，配置全局代理
if (process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  if (proxyUrl) {
    setGlobalDispatcher(new ProxyAgent(proxyUrl));
  }
}

export async function POST(req: Request) {
  const params = await req.json();
  const stream = await handleWorkflowStream({
    mastra,
    workflowId: "customerSupportWorkflow",
    params: {
      inputData: {
        query: params.userPrompt,
      },
    },
  });
  return createUIMessageStreamResponse({ stream });
}
