import { BoardModel, ClientModel, ClickupTaskModel } from "@swooche/models";
import { z } from "zod";
import { protectedProcedure } from "../procedures";
import { router } from "../trpc";

export const boardRouter = router({
  // Create a new board
  createBoard: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        projectName: z
          .string()
          .min(2, "Project name must be at least 2 characters"),
        projectGoal: z.string().optional(),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        board: z.object({
          _id: z.string(),
          clientId: z.string(),
          projectName: z.string(),
          projectGoal: z.string().optional(),
          createdAt: z.string(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("🎯 Creating new board:", input);
        console.log("🔑 User:", ctx.user);

        // Verify the client exists and belongs to the user's account
        const client = await ClientModel.findOne({
          _id: input.clientId,
          accountId: ctx.user.accountId,
        });

        if (!client) {
          throw new Error("Client not found");
        }

        // Create the board
        const board = await BoardModel.create({
          accountId: ctx.user.accountId,
          clientId: input.clientId,
          projectName: input.projectName,
          projectGoal: input.projectGoal,
          createdBy: ctx.user._id,
        });

        console.log("✅ Board created successfully:", board._id);

        return {
          success: true,
          board: {
            _id: board._id.toString(),
            clientId: board.clientId.toString(),
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

  // Get a single board by ID
  getBoard: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .query(async ({ input, ctx }) => {
      console.log("🔍 Fetching board:", input.boardId);

      try {
        const board = await BoardModel.findOne({
          _id: input.boardId,
          accountId: ctx.user.accountId,
        });

        if (!board) {
          throw new Error("Board not found");
        }

        const client = await ClientModel.findOne({
          _id: board.clientId,
          accountId: ctx.user.accountId,
        });

        if (!client) {
          throw new Error("Client not found");
        }

        return {
          success: true,
          board: {
            _id: board._id.toString(),
            clientId: board.clientId,
            clientName: client.name,
            projectName: board.projectName,
            projectGoal: board.projectGoal,
            createdAt: board.createdAt,
          },
        };
      } catch (error) {
        console.error("❌ Error fetching board:", error);
        throw new Error("Failed to fetch board");
      }
    }),

  // Get all boards for the current user's account
  getBoards: protectedProcedure.query(async ({ ctx }) => {
    console.log("🔍 Fetching boards for user:", ctx.user.id);

    try {
      const boards = await BoardModel.find({
        accountId: ctx.user.accountId,
      }).sort({ createdAt: -1 });

      const clientIds = boards.map((board) => board.clientId);
      const clients = await ClientModel.find({
        _id: { $in: clientIds },
        accountId: ctx.user.accountId,
      });

      const mapped = boards.map((board) => {
        const client = clients.find(
          (client) => client._id.toString() === board.clientId.toString()
        );

        if (!client) {
          return null;
        }

        return {
          _id: board._id.toString(),
          clientId: board.clientId,
          clientName: client.name,
          projectName: board.projectName,
          projectGoal: board.projectGoal,
          createdAt: board.createdAt,
        };
      });

      return {
        success: true,
        boards: mapped.filter((board) => board !== null),
      };
    } catch (error) {
      console.error("❌ Error fetching boards:", error);
      throw new Error("Failed to fetch boards");
    }
  }),

  // Delete a board and all its linked tasks
  deleteBoard: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .output(
      z.object({
        success: z.boolean(),
        deletedBoardId: z.string(),
        deletedTasksCount: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("🗑️ Deleting board:", input.boardId);
        console.log("🔑 User:", ctx.user);

        // Verify the board exists and belongs to the user's account
        const board = await BoardModel.findOne({
          _id: input.boardId,
          accountId: ctx.user.accountId,
        });

        if (!board) {
          throw new Error("Board not found");
        }

        // Delete all tasks linked to this board
        const deleteTasksResult = await ClickupTaskModel.deleteMany({
          boardId: input.boardId,
          accountId: ctx.user.accountId,
        });

        console.log(
          `🗑️ Deleted ${deleteTasksResult.deletedCount} tasks for board ${input.boardId}`
        );

        // Delete the board
        await BoardModel.deleteOne({
          _id: input.boardId,
          accountId: ctx.user.accountId,
        });

        console.log("✅ Board deleted successfully:", input.boardId);

        return {
          success: true,
          deletedBoardId: input.boardId,
          deletedTasksCount: deleteTasksResult.deletedCount,
        };
      } catch (error) {
        console.error("❌ Error deleting board:", error);
        throw new Error("Failed to delete board");
      }
    }),
});
