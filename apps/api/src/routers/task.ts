import { BoardModel, ClickupTaskModel } from "@swooche/models";
import { z } from "zod";
import { protectedProcedure } from "../procedures";
import { router } from "../trpc";

// the schema for the raw clickup task (how they store it)
const RawClickupTaskSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.object({
    status: z.string(),
    color: z.string(),
    type: z.string(),
    orderindex: z.number(),
  }),
  date_created: z.string().optional(),
  date_updated: z.string().optional(),
  date_closed: z.string().optional(),
  priority: z
    .object({
      priority: z.string().optional(),
      color: z.string().optional(),
      orderindex: z.string().optional(),
      id: z.string().optional(),
    })
    .optional()
    .nullable(),
  due_date: z.string().optional(),
  assignee: z.string().optional(),
});

export const taskRouter = router({
  // Get tasks for a board
  getBoardTasks: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const tasks = await ClickupTaskModel.find({
          boardId: input.boardId,
          accountId: ctx.user.accountId,
        });

        return {
          success: true,
          tasks: tasks.map((task) => ({
            _id: task._id.toString(),
            clickupTaskId: task.clickupTaskId,
            name: task.name,
            description: task.description,
            status: task.status,
            dateCreated: task.dateCreated,
            dateUpdated: task.dateUpdated,
            dateClosed: task.dateClosed,
            priority: task.priority,
            dueDate: task.dueDate,
            assignee: task.assignee,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
          })),
        };
      } catch (error) {
        console.error("❌ Error fetching board tasks:", error);
        throw new Error("Failed to fetch board tasks");
      }
    }),

  // Link tasks to a board
  linkTasks: protectedProcedure
    .input(
      z.object({
        boardId: z.string(),
        tasks: z.array(RawClickupTaskSchema),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const board = await BoardModel.findOne({
          _id: input.boardId,
          accountId: ctx.user.accountId,
        });

        if (!board) {
          throw new Error("Board not found");
        }

        const existingTasks = await ClickupTaskModel.find({
          boardId: input.boardId,
          accountId: ctx.user.accountId,
        });

        if (existingTasks.length > 0) {
          await ClickupTaskModel.deleteMany({
            boardId: input.boardId,
            accountId: ctx.user.accountId,
          });
        }

        // Add format the task to match our internal schema
        const tasksWithAccountId = input.tasks.map((task) => ({
          accountId: ctx.user.accountId,
          clickupTaskId: task.id,
          boardId: input.boardId,
          name: task.name || undefined,
          description: task.description || undefined,
          status: task.status,
          dateCreated: task.date_created || undefined,
          dateUpdated: task.date_updated || undefined,
          dateClosed: task.date_closed || undefined,
          priority: task.priority || undefined,
          dueDate: task.due_date || undefined,
          assignee: task.assignee || undefined,
        }));

        const createdTasks = await ClickupTaskModel.create(tasksWithAccountId);

        return {
          success: true,
          board: {
            ...board,
            tasks: createdTasks.map((task) => ({
              ...task,
              _id: task._id,
            })),
          },
        };
      } catch (error) {
        console.error("❌ Error saving tasks:", error);
        throw new Error("Error saving tasks");
      }
    }),
});
