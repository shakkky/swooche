import { AccountModel, UserModel } from "@swooche/models";
import { z } from "zod";
import { protectedProcedure, tokenOnlyProcedure } from "../procedures";
import { router } from "../trpc";

export const userRouter = router({
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

  // Handle user sign-in - uses insert with conflict handling to detect new users
  onUserSignIn: tokenOnlyProcedure
    .input(
      z.object({
        userMetadata: z.record(z.any()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userMetadata } = input;

      console.log("🔐 User signing in:", userMetadata);

      try {
        // Extract user data from metadata
        const userData = {
          firstName:
            userMetadata?.given_name || userMetadata?.name?.split(" ")[0] || "",
          lastName:
            userMetadata?.family_name ||
            userMetadata?.name?.split(" ").slice(1).join(" ") ||
            "",
          name:
            userMetadata?.name ||
            userMetadata?.full_name ||
            ctx.user?.email ||
            "",
          email: userMetadata?.email || "",
          supabaseUserId: ctx.supabaseUserId,
        };

        // Try to find existing user first
        const existingUser = await UserModel.findOne({
          supabaseUserId: ctx.supabaseUserId,
        });

        if (existingUser) {
          console.log("👤 Existing user signing in:", existingUser._id);
          return {
            isNewUser: false,
            userId: existingUser._id,
            message: "Existing user signed in",
          };
        }

        // User doesn't exist - this is a new signup!
        console.log("🎉 New user detected - creating account");

        // Create account
        const account = await AccountModel.create({
          name: `${userData.firstName} - Default Company`,
        });

        // Create user (this will succeed since we checked they don't exist)
        const user = await UserModel.create({
          firstName: userData.firstName,
          lastName: userData.lastName,
          name: userData.name,
          email: userData.email,
          supabaseUserId: userData.supabaseUserId,
          accountId: account._id,
        });

        console.log("✅ New user created in database:", user._id);

        // Trigger new user signup events
        console.log("🎉 NEW USER SIGNUP EVENT TRIGGERED!");
        console.log("📊 Analytics: New user signup logged", {
          userId: ctx.supabaseUserId,
          email: userData.email,
          timestamp: new Date().toISOString(),
          source: "google_oauth",
        });

        // Here you can add any custom signup logic:
        // - Send welcome emails
        // - Create analytics events
        // - Set up user preferences
        // - Trigger onboarding workflows
        // - Send notifications to admin
        // - Initialize user-specific data

        // send webhook contain user details
        await fetch(
          "https://hook.us1.make.com/8qi25etam4r04tmpyzgqt24kljgk1msy",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              timestamp: new Date().toISOString(),
              source: "google_oauth",
            }),
          }
        );

        return {
          isNewUser: true,
          userId: user._id,
          message: "New user signup processed successfully",
        };
      } catch (error) {
        console.error("❌ Error processing user sign-in:", error);
        throw error;
      }
    }),
});
