import { z } from "zod";
import { BaseSchema } from "./baseSchema";

export const BoardSchema = BaseSchema.extend({
  accountId: z.string(),
  customerName: z
    .string()
    .min(2, "Customer name must be at least 2 characters"),
  projectName: z.string().min(2, "Project name must be at least 2 characters"),
  projectGoal: z
    .string()
    .min(10, "Project goal must be at least 10 characters"),
  createdBy: z.string(), // User ID who created the board
});

export type Board = z.infer<typeof BoardSchema>;
