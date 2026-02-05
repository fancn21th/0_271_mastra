import z from "zod";

export const categorySchema = z.object({
  category: z.enum(["GENERAL", "ORDER INQUIRY"]),
});

export type StreamingStatus = "streaming" | "completed";

export type Category = z.infer<typeof categorySchema>;

export interface CategorizeQueryEventData {
  status: StreamingStatus;
  content: Partial<Category> | Category;
}
