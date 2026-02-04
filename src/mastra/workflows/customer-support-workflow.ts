import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { customerSupportAgent } from "../agents/customer-support-agent";
import { queryEvaluatorAgent } from "../agents/query-evaluator-agent";

const categorySchema = z.enum(["GENERAL", "ORDER INQUIRY"]);

const categorizeQuery = createStep({
  id: "categorize-query",
  description: "Categorizes the customer support query",
  inputSchema: z.object({
    query: z.string().describe("The customer's support query"),
  }),
  outputSchema: z.object({
    query: z.string().describe("The customer's support query"),
    category: categorySchema.describe("The category of the support query"),
  }),
  execute: async ({ inputData }) => {
    const result = await queryEvaluatorAgent.generate(
      `Evaluate the following customer query: ${inputData?.query}`,
      {
        structuredOutput: {
          schema: z.object({ category: categorySchema }),
        },
      },
    );

    return { query: inputData!.query, category: result.object.category };
  },
});

const generateAnswer = createStep({
  id: "generate-answer",
  description: "Generates a customer support answer based on the query",
  inputSchema: z.object({
    query: z.string().describe("The customer's support query"),
    category: categorySchema.describe("The category of the support query"),
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

// const askUserForApproval = createStep({
//   id: "ask-user-for-approval",
//   description: "Asks the user for approval before sending the response",
//   inputSchema: z.object({
//     answer: z.string().describe("The support agent's response to the query"),
//   }),
//   outputSchema: z.object({
//     answer: z.string().describe("The approved support agent's response"),
//   }),
//   resumeSchema: z.object({
//     approved: z
//       .boolean()
//       .optional()
//       .describe("Whether the user approved the response"),
//   }),
//   execute: async ({ inputData, resumeData, suspend }) => {
//     if (!resumeData) {
//       return suspend({});
//     }

//     if (!resumeData.approved) {
//       throw new Error("User did not approve the response.");
//     }

//     return { answer: inputData!.answer };
//   },
// });

const askUserForAnswer = createStep({
  id: "ask-user-for-answer",
  description: "Asks the user for their input",
  inputSchema: z.object({
    query: z.string().describe("The customer's support query"),
    category: categorySchema.describe("The category of the support query"),
  }),
  outputSchema: z.object({
    answer: z.string().describe("The user's input"),
  }),
  resumeSchema: z.object({
    answer: z.string().describe("The user's input"),
  }),
  execute: async ({ resumeData, suspend }) => {
    if (!resumeData) {
      return suspend({});
    }

    return { answer: resumeData.answer };
  },
});

const respond = createStep({
  id: "respond",
  description: "Formats the agent's answer for output",
  inputSchema: z.object({
    "generate-answer": z.object({ answer: z.string() }).optional(),
    "ask-user-for-answer": z.object({ answer: z.string() }).optional(),
  }),
  outputSchema: z.object({
    response: z.string().describe("The support agent's response to the query"),
  }),
  execute: async ({ inputData }) => {
    const answer =
      inputData?.["generate-answer"]?.answer ||
      inputData?.["ask-user-for-answer"]?.answer ||
      "";
    console.log("Support Agent Response:", answer);
    return { response: answer };
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
  // .then(generateAnswer)
  .then(categorizeQuery)
  .branch([
    [
      async ({ inputData: { category } }) => category === "GENERAL",
      generateAnswer,
    ],
    [
      async ({ inputData: { category } }) => category === "ORDER INQUIRY",
      askUserForAnswer,
    ],
  ])
  // .then(askUserForApproval)
  .then(respond)
  .commit();
