import { z } from "zod";

export const AgentStatusSchema = z.enum([
  "ready",
  "offline",
  "in-call",
  "error",
]);
export type AgentStatus = z.infer<typeof AgentStatusSchema>;

export const NumberSchema = z.object({
  id: z.string(),
  number: z.string(),
  capabilities: z.array(z.enum(["calls", "texts"])),
});

export const AgentStatusUpdateSchema = z.object({
  identity: z.string(),
  status: AgentStatusSchema,
});

export const TokenResponseSchema = z.object({
  token: z.string(),
  identity: z.string(),
  numbers: z.array(NumberSchema),
});

export type Number = z.infer<typeof NumberSchema>;
export type AgentStatusUpdate = z.infer<typeof AgentStatusUpdateSchema>;
export type TokenResponse = z.infer<typeof TokenResponseSchema>;
