import { AccountModel, UserModel, BoardModel } from "@swooche/models";
import { BoardSchema } from "@swooche/schemas";
import { z } from "zod";
import { protectedProcedure, tokenOnlyProcedure } from "./procedures";
import { router } from "./trpc";

export const appRouter = router({
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

  // Create a new board
  createBoard: protectedProcedure
    .input(
      z.object({
        customerName: z
          .string()
          .min(2, "Customer name must be at least 2 characters"),
        projectName: z
          .string()
          .min(2, "Project name must be at least 2 characters"),
        projectGoal: z
          .string()
          .min(10, "Project goal must be at least 10 characters"),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        board: z.object({
          id: z.string(),
          customerName: z.string(),
          projectName: z.string(),
          projectGoal: z.string(),
          createdAt: z.string(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("🎯 Creating new board:", input);
        console.log("🔑 User:", ctx.user);

        // Create the board
        const board = await BoardModel.create({
          accountId: ctx.user.accountId,
          customerName: input.customerName,
          projectName: input.projectName,
          projectGoal: input.projectGoal,
          createdBy: ctx.user._id.toString(),
        });

        console.log("✅ Board created successfully:", board._id);

        return {
          success: true,
          board: {
            id: board._id.toString(),
            customerName: board.customerName,
            projectName: board.projectName,
            projectGoal: board.projectGoal,
            createdAt: board.createdAt.toISOString(),
          },
        };
      } catch (error) {
        console.error("❌ Error creating board:", error);
        throw new Error("Failed to create board");
      }
    }),

  // Get all boards for the current user's account
  getBoards: protectedProcedure.query(async ({ ctx }) => {
    console.log("🔍 Fetching boards for user:", ctx.user.id);

    try {
      const boards = await BoardModel.find({
        accountId: ctx.user.accountId,
      }).sort({ createdAt: -1 });

      return {
        success: true,
        boards: boards.map((board) => ({
          id: board._id.toString(),
          customerName: board.customerName,
          projectName: board.projectName,
          projectGoal: board.projectGoal,
          createdAt: board.createdAt,
        })),
      };
    } catch (error) {
      console.error("❌ Error fetching boards:", error);
      throw new Error("Failed to fetch boards");
    }
  }),
});

export type AppRouter = typeof appRouter;
