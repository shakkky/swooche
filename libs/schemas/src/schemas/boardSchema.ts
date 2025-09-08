import { z } from "zod";
import { BaseSchema } from "./baseSchema";
import { zObjectId } from "./zObjectId";

export const BoardSchema = BaseSchema.extend({
  accountId: zObjectId(),
  clientId: zObjectId(),
  projectName: z.string().min(2, "Project name must be at least 2 characters"),
  projectGoal: z
    .string()
    // .min(10, "Project goal must be at least 10 characters")
    .optional(),
  createdBy: zObjectId(),
});

export type Board = z.infer<typeof BoardSchema>;
