import { z } from "zod";
import { BaseSchema } from "./baseSchema";

export const UserSchema = BaseSchema.extend({
  accountId: z.string(),
  name: z.string(),
  email: z.string().email(),
  supabaseUserId: z.string(),
});

export type User = z.infer<typeof UserSchema>;
