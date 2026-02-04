import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { customerSupportAgent } from "../agents/customer-support-agent";

const generateAnswer = createStep({
  id: "generate-answer",
  description: "Generates a customer support answer based on the query",
  inputSchema: z.object({
    query: z.string().describe("The customer's support query"),
  }),
  outputSchema: z.object({
    answer: z.string().describe("The support agent's response to the query"),
  }),
  execute: async ({ inputData }) => {
    const result = await customerSupportAgent.generate(
      `Answer the following customer query:\n\n${inputData?.query}`,
    );

    return { answer: result.text };
  },
});

const askUserForApproval = createStep({
  id: "ask-user-for-approval",
  description: "Asks the user for approval before sending the response",
  inputSchema: z.object({
    answer: z.string().describe("The support agent's response to the query"),
  }),
  outputSchema: z.object({
    answer: z.string().describe("The approved support agent's response"),
  }),
  resumeSchema: z.object({
    approved: z
      .boolean()
      .optional()
      .describe("Whether the user approved the response"),
  }),
  execute: async ({ inputData, resumeData, suspend }) => {
    if (!resumeData) {
      return suspend({});
    }

    if (!resumeData.approved) {
      throw new Error("User did not approve the response.");
    }

    return { answer: inputData!.answer };
  },
});

const respond = createStep({
  id: "respond",
  description: "Formats the agent's answer for output",
  inputSchema: z.object({
    answer: z.string().describe("The support agent's response to the query"),
  }),
  outputSchema: z.object({}),
  execute: async ({ inputData }) => {
    console.log("Support Agent Response:", inputData?.answer);
    return {};
  },
});

export const customerSupportWorkflow = createWorkflow({
  id: "customer-support-workflow",
  inputSchema: z.object({
    query: z.string().describe("The customer's support query"),
  }),
  outputSchema: z.object({
    response: z.string().describe("The support agent's response to the query"),
  }),
})
  .then(generateAnswer)
  .then(askUserForApproval)
  .then(respond)
  .commit();
