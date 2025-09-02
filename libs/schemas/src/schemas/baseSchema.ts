import { z } from "zod";

export const BaseSchema = z.object({
  _id: z.string(), // Store as string in frontend
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BaseSchemaType = z.infer<typeof BaseSchema>;
