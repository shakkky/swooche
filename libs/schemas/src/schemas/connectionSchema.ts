import { z } from "zod";
import { BaseSchema } from "./baseSchema";
import { zObjectId } from "./zObjectId";

export const ConnectionSchema = BaseSchema.extend({
  accountId: zObjectId(),
  provider: z.string().min(2, "Provider must be at least 2 characters"),
  accessToken: z.string(),
  createdBy: zObjectId(), // User ID who created the connection
  webhookSecret: z.string().optional(), // Secret for webhook verification
});

export type Connection = z.infer<typeof ConnectionSchema>;
