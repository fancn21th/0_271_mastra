import { Agent } from "@mastra/core/agent";

import { ProxyAgent, setGlobalDispatcher } from "undici";

// 如果设置了代理环境变量，配置全局代理
if (process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  if (proxyUrl) {
    setGlobalDispatcher(new ProxyAgent(proxyUrl));
  }
}

export const queryEvaluatorAgent = new Agent({
  id: "query-evaluator-agent",
  name: "Query Evaluator Agent",
  instructions: `
      Your task is to evaluate the nature of the given question related to customer support.
      Determine whether the question is a general inquiry or an order-related inquiry.
      For each question, classify it into one of the following categories:

      Category: Indicate "GENERAL" or "ORDER INQUIRY"
`,
  model: "openai/gpt-4o",
});
