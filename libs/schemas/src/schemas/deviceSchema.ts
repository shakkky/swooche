import { z } from "zod";
import { BaseSchema } from "./baseSchema";

// a device is a user's phone or computer
// this will eventually contain a token for push notifications
// also might have ping timestamps, etc
//
export const DeviceSchema = BaseSchema.extend({
  accountId: z.string(),
  userId: z.string(),
  name: z.string(),
  token: z.string(),
  type: z.enum(["phone", "computer"]),
  // deviceToken: z.string().optional(),
  // lastPing: z.date().optional(),
  // lastSeen: z.date().optional(),
  // lastSeenIp: z.string().optional(),
  // lastSeenLocation: z.string().optional(),
  // lastSeenUserAgent: z.string().optional(),
});

export type Device = z.infer<typeof DeviceSchema>;
