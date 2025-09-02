import { z } from "zod";
import { BaseSchema } from "./baseSchema";

export const AccountSchema = BaseSchema.extend({
  name: z.string(),
});

export type Account = z.infer<typeof AccountSchema>;
