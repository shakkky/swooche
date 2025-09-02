import { z } from "zod";
import { BaseSchema } from "./baseSchema";

export const PhoneNumberSchema = BaseSchema.extend({
  accountId: z.string(),
  sid: z.string(),
  e164: z.string(),
  capabilities: z.array(z.enum(["calls", "texts"])),
});

export type PhoneNumber = z.infer<typeof PhoneNumberSchema>;
