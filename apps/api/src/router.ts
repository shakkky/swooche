import { initTRPC } from "@trpc/server";
import { z } from "zod";
import twilio from "twilio";
import {
  AgentStatusUpdateSchema,
  NumberSchema,
  TokenResponseSchema,
} from "@swooche/schemas";

const t = initTRPC.create();

const { AccessToken } = twilio.jwt;
const { VoiceGrant } = AccessToken;

const AGENT_IDENTITY = "Shakeel"; // This might come from a model or something
const numbers = [
  {
    id: "1",
    number: "0483 943 524",
    capabilities: ["calls", "texts"] as ("calls" | "texts")[],
  },
  {
    id: "2",
    number: "1800 BITE ME",
    capabilities: ["calls"] as ("calls" | "texts")[],
  },
];

// Temporary in-memory store. Swap with Redis or DB in production.
const agentStatusMap = new Map<string, string>();

export const appRouter = t.router({
  getToken: t.procedure.output(TokenResponseSchema).query(() => {
    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_API_KEY!,
      process.env.TWILIO_API_SECRET!,
      { identity: AGENT_IDENTITY.toString(), region: "au1" }
    );

    token.addGrant(
      new VoiceGrant({
        outgoingApplicationSid: process.env.TWIML_APP_SID!,
        incomingAllow: true,
      })
    );

    return {
      token: token.toJwt(),
      identity: AGENT_IDENTITY,
      numbers,
    };
  }),

  updateAgentStatus: t.procedure
    .input(AgentStatusUpdateSchema)
    .mutation(({ input }) => {
      console.log("📡 Agent status updated: ", input);
      const { identity, status } = input;

      agentStatusMap.set(identity, status);
      console.log(`📡 Agent status updated: ${identity} → ${status}`);

      return { success: true };
    }),

  getAgentStatus: t.procedure
    .input(z.object({ identity: z.string() }))
    .query(({ input }) => {
      return agentStatusMap.get(input.identity) || "offline";
    }),

  getAllAgentStatuses: t.procedure.query(() => {
    return Object.fromEntries(agentStatusMap);
  }),
});

export type AppRouter = typeof appRouter;
