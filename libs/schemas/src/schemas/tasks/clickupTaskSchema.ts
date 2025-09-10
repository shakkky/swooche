import { z } from "zod";
import { BaseSchema } from "../baseSchema";
import { zObjectId } from "../zObjectId";

export const ClickupTaskSchema = BaseSchema.extend({
  accountId: zObjectId(),
  boardId: zObjectId(),
  clickupTaskId: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.object({
    status: z.string(),
    color: z.string(),
    type: z.string(),
    orderindex: z.number(),
  }),
  dateCreated: z.string().optional(),
  dateUpdated: z.string().optional(),
  dateClosed: z.string().optional(),
  priority: z
    .object({
      priority: z.string().optional(),
      color: z.string().optional(),
      orderindex: z.string().optional(),
      id: z.string().optional(),
    })
    .optional(),
  dueDate: z.string().optional(),
  assignee: z.string().optional(),
});

export type ClickupTask = z.infer<typeof ClickupTaskSchema>;
