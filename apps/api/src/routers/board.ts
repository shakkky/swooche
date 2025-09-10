import { BoardModel, ClientModel, ClickupTaskModel } from "@swooche/models";
import { z } from "zod";
import { protectedProcedure } from "../procedures";
import { router } from "../trpc";

// Utility function to generate a URL-friendly slug from a string
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Function to ensure slug uniqueness
async function ensureUniqueSlug(
  baseSlug: string,
  excludeBoardId?: string
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingBoard = await BoardModel.findOne({
      slug,
      ...(excludeBoardId && { _id: { $ne: excludeBoardId } }),
    });

    if (!existingBoard) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

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

        // Generate a unique slug for the board
        const baseSlug = generateSlug(input.projectName);
        const uniqueSlug = await ensureUniqueSlug(baseSlug);

        // Create the board
        const board = await BoardModel.create({
          accountId: ctx.user.accountId,
          clientId: input.clientId,
          projectName: input.projectName,
          projectGoal: input.projectGoal,
          createdBy: ctx.user._id,
          slug: uniqueSlug,
          isPublished: false,
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
            isPublished: board.isPublished,
            slug: board.slug,
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

  // Update a board
  editBoard: protectedProcedure
    .input(
      z.object({
        boardId: z.string(),
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
          updatedAt: z.string(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("✏️ Editing board:", input.boardId);
        console.log("🔑 User:", ctx.user);

        // Verify the board exists and belongs to the user's account
        const board = await BoardModel.findOne({
          _id: input.boardId,
          accountId: ctx.user.accountId,
        });

        if (!board) {
          throw new Error("Board not found");
        }

        // Verify the client exists and belongs to the user's account
        const client = await ClientModel.findOne({
          _id: input.clientId,
          accountId: ctx.user.accountId,
        });

        if (!client) {
          throw new Error("Client not found");
        }

        // Generate new slug if project name changed
        let updateData: any = {
          clientId: input.clientId,
          projectName: input.projectName,
          projectGoal: input.projectGoal,
        };

        // If project name changed, generate a new slug
        if (board.projectName !== input.projectName) {
          const baseSlug = generateSlug(input.projectName);
          const uniqueSlug = await ensureUniqueSlug(baseSlug, input.boardId);
          updateData.slug = uniqueSlug;
        }

        // Update the board
        const updatedBoard = await BoardModel.findOneAndUpdate(
          {
            _id: input.boardId,
            accountId: ctx.user.accountId,
          },
          updateData,
          { new: true }
        );

        if (!updatedBoard) {
          throw new Error("Failed to update board");
        }

        console.log("✅ Board updated successfully:", updatedBoard._id);

        return {
          success: true,
          board: {
            _id: updatedBoard._id.toString(),
            clientId: updatedBoard.clientId.toString(),
            projectName: updatedBoard.projectName,
            projectGoal: updatedBoard.projectGoal,
            updatedAt: updatedBoard.updatedAt.toISOString(),
            isPublished: updatedBoard.isPublished,
            slug: updatedBoard.slug,
          },
        };
      } catch (error) {
        console.error("❌ Error updating board:", error);
        throw new Error("Failed to update board");
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

  // Publish a board to make it publicly accessible
  publishBoard: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .output(
      z.object({
        success: z.boolean(),
        board: z.object({
          _id: z.string(),
          slug: z.string(),
          isPublished: z.boolean(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("📢 Publishing board:", input.boardId);
        console.log("🔑 User:", ctx.user);

        // Verify the board exists and belongs to the user's account
        const board = await BoardModel.findOne({
          _id: input.boardId,
          accountId: ctx.user.accountId,
        });

        if (!board) {
          throw new Error("Board not found");
        }

        // Update the board to be published
        const updatedBoard = await BoardModel.findOneAndUpdate(
          {
            _id: input.boardId,
            accountId: ctx.user.accountId,
          },
          {
            isPublished: true,
          },
          { new: true }
        );

        if (!updatedBoard) {
          throw new Error("Failed to publish board");
        }

        if (!updatedBoard.slug) {
          throw new Error("Failed to publish board");
        }

        console.log("✅ Board published successfully:", updatedBoard._id);

        return {
          success: true,
          board: {
            _id: updatedBoard._id.toString(),
            slug: updatedBoard.slug,
            isPublished: !!updatedBoard.isPublished,
          },
        };
      } catch (error) {
        console.error("❌ Error publishing board:", error);
        throw new Error("Failed to publish board");
      }
    }),

  // Toggle board publish status
  toggleBoardPublish: protectedProcedure
    .input(
      z.object({
        boardId: z.string(),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        board: z.object({
          _id: z.string(),
          slug: z.string().optional(),
          isPublished: z.boolean(),
          publicUrl: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("🔄 Toggling board publish status:", input.boardId);
        console.log("🔑 User:", ctx.user);

        // Verify the board exists and belongs to the user's account
        const board = await BoardModel.findOne({
          _id: input.boardId,
          accountId: ctx.user.accountId,
        });

        if (!board) {
          throw new Error("Board not found");
        }

        console.log("before:board.isPublished", board.isPublished);

        // Toggle the publish status
        const updatedBoard = await BoardModel.findOneAndUpdate(
          {
            _id: board._id,
            accountId: ctx.user.accountId,
          },
          {
            isPublished: !board.isPublished,
          },
          { new: true }
        );

        if (!updatedBoard) {
          throw new Error("Failed to update board publish status");
        }

        console.log("after:board.isPublished", updatedBoard.isPublished);

        console.log(
          "✅ Board publish status toggled successfully:",
          updatedBoard._id
        );

        return {
          success: true,
          board: {
            _id: updatedBoard._id.toString(),
            slug: updatedBoard.slug,
            isPublished: updatedBoard.isPublished,
          },
        };
      } catch (error) {
        console.error("❌ Error toggling board publish status:", error);
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to toggle board publish status"
        );
      }
    }),
});
