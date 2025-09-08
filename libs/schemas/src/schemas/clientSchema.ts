import { z } from "zod";
import { BaseSchema } from "./baseSchema";

export const ClientSchema = BaseSchema.extend({
  accountId: z.string(),
  name: z.string().min(2, "Client name must be at least 2 characters"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  createdBy: z.string(), // User ID who created the client
});

export type Client = z.infer<typeof ClientSchema>;
