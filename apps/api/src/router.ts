import {
  AccountModel,
  DeviceModel,
  PhoneNumberModel,
  UserModel,
} from "@swooche/models";
import {
  AgentStatusUpdateSchema,
  TokenResponseSchema,
  UserSignUpSchema,
} from "@swooche/schemas";
import twilio from "twilio";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import {
  publicProcedure,
  protectedProcedure,
  tokenOnlyProcedure,
} from "./procedures";
import { router } from "./trpc";

// the twilio config comes from env when deployed...
// i wonder if i can get it to pull from aws when running locally

const { AccessToken } = twilio.jwt;
const { VoiceGrant } = AccessToken;

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

export const appRouter = router({
  getToken: protectedProcedure
    .output(TokenResponseSchema)
    .query(async ({ ctx }) => {
      const { user } = ctx;

      // grab the identity (deviceId) from somewhere.
      // is user.devices[0].deviceId the right thing to do?
      const device = await DeviceModel.findOne({ userId: user._id }).orFail();
      const identity = device.token;

      const token = new AccessToken(
        "AC658c8196b697da2609b4165121d4c318",
        "SK0f3cdc7a2060e50bec51a007848eadb1",
        "5ghAM8WYGCn5jn0jcEiSWpFgTKQX1Anx",
        { identity, region: "au1" }
      );

      token.addGrant(
        new VoiceGrant({
          outgoingApplicationSid: "AP0c53c3f6171c0f9effb11b63d0ff7b49",
          incomingAllow: true,
        })
      );

      return {
        token: token.toJwt(),
        identity,
        numbers,
      };
    }),

  updateAgentStatus: protectedProcedure
    .input(AgentStatusUpdateSchema)
    .mutation(({ input }) => {
      console.log("📡 Agent status updated: ", input);
      const { identity, status } = input;

      agentStatusMap.set(identity, status);
      console.log(`📡 Agent status updated: ${identity} → ${status}`);

      return { success: true };
    }),

  getAgentStatus: publicProcedure
    .input(z.object({ identity: z.string() }))
    .query(({ input }) => {
      return agentStatusMap.get(input.identity) || "offline";
    }),

  getAllAgentStatuses: publicProcedure.query(() => {
    return Object.fromEntries(agentStatusMap);
  }),

  userSignUp: tokenOnlyProcedure
    .input(UserSignUpSchema)
    .mutation(async ({ input }) => {
      const { firstName, lastName, name, email, supabaseUserId } = input;

      const account = await AccountModel.create({
        name: "Placeholder company",
      });

      const user = await UserModel.create({
        firstName,
        lastName,
        name,
        email,
        supabaseUserId,
        accountId: account._id,
      });

      console.log("👋 User created: ", user);

      const device = new DeviceModel({
        accountId: account._id,
        userId: user._id,
        name: "My business phone",
        token: uuidv4(), // when calls come through, we use this to connect the call to the device
        capabilities: ["calls", "texts"],
        type: "phone",
      });

      // TODO: send a welcome email to the user

      // the welcome email will have a link to the console
      // where the user will add a device ?

      console.log("📱 Device created: ", device);

      const phoneNumber = await PhoneNumberModel.create({
        accountId: account._id,
        e164: "+61483943524",
        sid: "PN0c53c3f6171c0f9effb11b63d0ff7b49",
        capabilities: ["calls", "texts"],
      });
      console.log("📞 Phone number created: ", phoneNumber);

      return { success: true };
    }),

  me: protectedProcedure.query(({ ctx }) => {
    return {
      id: ctx.user.id,
      email: ctx.user.email,
      name: ctx.user.name,
      accountId: ctx.user.accountId,
    };
  }),

  // Example of token-only endpoint (just validates Supabase token)
  validateToken: tokenOnlyProcedure.query(({ ctx }) => {
    return {
      valid: true,
      supabaseUserId: ctx.supabaseUserId,
      email: ctx.user?.email,
    };
  }),
});

export type AppRouter = typeof appRouter;
