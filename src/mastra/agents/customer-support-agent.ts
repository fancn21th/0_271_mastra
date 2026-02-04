import { Agent } from "@mastra/core/agent";

import { ProxyAgent, setGlobalDispatcher } from "undici";

// 如果设置了代理环境变量，配置全局代理
if (process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  if (proxyUrl) {
    setGlobalDispatcher(new ProxyAgent(proxyUrl));
  }
}

export const customerSupportAgent = new Agent({
  id: "weather-agent",
  name: "customerSupportAgent Agent",
  instructions: `
      You are a customer support agent that helps users with their inquiries and issues regarding products and services.
`,
  model: "openai/gpt-4o",
});
