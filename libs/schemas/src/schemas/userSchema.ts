import { z } from "zod";
import { BaseSchema } from "./baseSchema";
import { zObjectId } from "./zObjectId";

export const UserSchema = BaseSchema.extend({
  accountId: zObjectId(),
  name: z.string(),
  email: z.string().email(),
  supabaseUserId: z.string(),
});

export type User = z.infer<typeof UserSchema>;
