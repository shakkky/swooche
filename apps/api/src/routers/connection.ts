import { ConnectionModel } from "@swooche/models";
import { z } from "zod";
import { protectedProcedure } from "../procedures";
import { router } from "../trpc";

// Helper function to register ClickUp webhook
async function registerClickUpWebhook(
  accessToken: string,
  connectionId: string
) {
  try {
    // First, get the user's teams to find the team ID
    const teamsResponse = await fetch("https://api.clickup.com/api/v2/team", {
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
    });

    if (!teamsResponse.ok) {
      throw new Error(`Failed to fetch teams: ${teamsResponse.statusText}`);
    }

    const teamsData = (await teamsResponse.json()) as {
      teams: Array<{ id: string; name: string }>;
    };

    if (!teamsData.teams || teamsData.teams.length === 0) {
      throw new Error("No teams found for user");
    }

    // Use the first team for webhook registration
    const teamId = teamsData.teams[0].id;

    const baseWebhookUrl = `${
      process.env.API_URL || "https://api.swooche.com"
    }`;
    const webhookUrl = `${baseWebhookUrl}/webhooks/clickup/tasks/${connectionId}`;

    console.log(`🔗 Registering webhook for team ${teamId} at ${webhookUrl}`);

    const webhookResponse = await fetch(
      `https://api.clickup.com/api/v2/team/${teamId}/webhook`,
      {
        method: "POST",
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: webhookUrl,
          events: ["taskUpdated", "taskDeleted"],
        }),
      }
    );

    if (!webhookResponse.ok) {
      const errorData = (await webhookResponse.json()) as { error?: string };
      throw new Error(
        `Webhook registration failed: ${
          errorData.error || webhookResponse.statusText
        }`
      );
    }

    const webhookData = (await webhookResponse.json()) as {
      id: string;
      webhook: {
        id: string;
        endpoint: string;
        events: string[];
        status: string;
        secret: string;
      };
    };

    console.log("✅ Webhook registered:", webhookData);
    return webhookData;
  } catch (error) {
    console.error("❌ Error registering webhook:", error);
    throw error;
  }
}

export const connectionRouter = router({
  // Exchange ClickUp OAuth code for access token
  exchangeClickUpCode: protectedProcedure
    .input(
      z.object({
        code: z.string(),
        state: z.string().optional(),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
        connectionId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("🔄 Exchanging ClickUp OAuth code:", input.code);

        const clientId = process.env.CLICKUP_CLIENT_ID;
        const clientSecret = process.env.CLICKUP_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
          throw new Error("ClickUp client ID or secret is not set");
        }

        const accessTokenResponse = await fetch(
          "https://api.clickup.com/api/v2/oauth/token",
          {
            method: "POST",
            headers: {
              accept: "application/json",
              "content-type": "application/json",
            },
            body: JSON.stringify({
              client_id: clientId,
              client_secret: clientSecret,
              code: input.code,
            }),
          }
        );

        if (!accessTokenResponse.ok) {
          const errorData = (await accessTokenResponse.json()) as {
            error?: string;
          };
          console.error("❌ ClickUp OAuth error:", errorData);
          throw new Error(
            `ClickUp OAuth failed: ${errorData.error || "Unknown error"}`
          );
        }

        const accessTokenData = (await accessTokenResponse.json()) as {
          access_token: string;
        };

        if (!accessTokenData.access_token) {
          throw new Error("No access token received from ClickUp");
        }

        console.log("🔑 Access token:", accessTokenData);

        const connection = await ConnectionModel.create({
          accountId: ctx.user.accountId,
          createdBy: ctx.user._id,
          provider: "clickup",
          accessToken: accessTokenData.access_token,
        });

        console.log("✅ ClickUp connection established successfully");

        // Register webhook for task changes
        try {
          const webhookData = await registerClickUpWebhook(
            connection.accessToken,
            connection._id.toString()
          );

          // Store the webhook secret in the connection
          await ConnectionModel.findByIdAndUpdate(connection._id, {
            webhookSecret: webhookData.webhook.secret,
          } as any);

          console.log("✅ ClickUp webhook registered successfully");
        } catch (webhookError) {
          console.error("⚠️ Failed to register ClickUp webhook:", webhookError);
          // Don't fail the connection if webhook registration fails
        }

        return {
          success: true,
          message: "ClickUp connection established successfully",
          connectionId: connection._id.toString(), // Would be the actual connection ID
        };
      } catch (error) {
        console.error("❌ Error exchanging ClickUp OAuth code:", error);
        throw new Error("Failed to establish ClickUp connection");
      }
    }),

  // Get user's connections
  getConnections: protectedProcedure
    .output(
      z.object({
        success: z.boolean(),
        connections: z.array(
          z.object({
            _id: z.string(),
            provider: z.string(),
            createdAt: z.string(),
          })
        ),
      })
    )
    .query(async ({ ctx }) => {
      try {
        console.log("🔍 Fetching connections for user:", ctx.user.id);

        const connections = await ConnectionModel.find({
          accountId: ctx.user.accountId,
        });

        return {
          success: true,
          connections: connections.map((connection) => ({
            _id: connection._id.toString(),
            provider: connection.provider,
            createdAt: connection.createdAt.toISOString(),
          })),
        };
      } catch (error) {
        console.error("❌ Error fetching connections:", error);
        throw new Error("Failed to fetch connections");
      }
    }),

  // Test a connection
  testConnection: protectedProcedure
    .input(
      z.object({
        connectionId: z.string(),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
        isActive: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("🧪 Testing connection:", input.connectionId);

        // TODO: Implement actual connection test
        // This would typically involve:
        // 1. Fetch the connection from database
        // 2. Make a test API call to the provider
        // 3. Update the connection status based on the result

        // Simulate test
        await new Promise((resolve) => setTimeout(resolve, 500));

        return {
          success: true,
          message: "Connection is active and working",
          isActive: true,
        };
      } catch (error) {
        console.error("❌ Error testing connection:", error);
        return {
          success: false,
          message: "Connection test failed",
          isActive: false,
        };
      }
    }),

  // Get ClickUp workspaces
  getClickUpWorkspaces: protectedProcedure
    .output(
      z.object({
        success: z.boolean(),
        workspaces: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            color: z.string().optional(),
          })
        ),
      })
    )
    .query(async ({ ctx }) => {
      try {
        console.log("🔍 Fetching ClickUp workspaces for user:", ctx.user.id);

        // Find ClickUp connection
        const connection = await ConnectionModel.findOne({
          accountId: ctx.user.accountId,
          provider: "clickup",
        });

        if (!connection) {
          throw new Error("No ClickUp connection found");
        }

        const response = await fetch("https://api.clickup.com/api/v2/team", {
          headers: {
            Authorization: connection.accessToken,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`ClickUp API error: ${response.statusText}`);
        }

        const data = (await response.json()) as {
          teams: Array<{
            id: string;
            name: string;
            color: string;
          }>;
        };

        return {
          success: true,
          workspaces: data.teams.map((team) => ({
            id: team.id,
            name: team.name,
            color: team.color,
          })),
        };
      } catch (error) {
        console.error("❌ Error fetching ClickUp workspaces:", error);
        throw new Error("Failed to fetch ClickUp workspaces");
      }
    }),

  // Get ClickUp spaces for a workspace
  getClickUpSpaces: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        spaces: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            color: z.string().optional().nullable(),
          })
        ),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        console.log(
          "🔍 Fetching ClickUp spaces for workspace:",
          input.workspaceId
        );

        // Find ClickUp connection
        const connection = await ConnectionModel.findOne({
          accountId: ctx.user.accountId,
          provider: "clickup",
        });

        if (!connection) {
          throw new Error("No ClickUp connection found");
        }

        const response = await fetch(
          `https://api.clickup.com/api/v2/team/${input.workspaceId}/space`,
          {
            headers: {
              Authorization: connection.accessToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`ClickUp API error: ${response.statusText}`);
        }

        const data = (await response.json()) as {
          spaces: Array<{
            id: string;
            name: string;
            color: string;
          }>;
        };

        console.log("🔍 ClickUp spaces:", data.spaces);

        return {
          success: true,
          spaces: data.spaces.map((space) => ({
            id: space.id,
            name: space.name,
            color: space.color,
          })),
        };
      } catch (error) {
        console.error("❌ Error fetching ClickUp spaces:", error);
        throw new Error("Failed to fetch ClickUp spaces");
      }
    }),

  // Get ClickUp folderless lists for a space
  getClickUpFolderlessLists: protectedProcedure
    .input(
      z.object({
        spaceId: z.string(),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        lists: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            color: z.string().optional().nullable(),
          })
        ),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        console.log(
          "🔍 Fetching ClickUp folderless lists for space:",
          input.spaceId
        );

        // Find ClickUp connection
        const connection = await ConnectionModel.findOne({
          accountId: ctx.user.accountId,
          provider: "clickup",
        });

        if (!connection) {
          throw new Error("No ClickUp connection found");
        }

        const response = await fetch(
          `https://api.clickup.com/api/v2/space/${input.spaceId}/list`,
          {
            headers: {
              Authorization: connection.accessToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`ClickUp API error: ${response.statusText}`);
        }

        const data = (await response.json()) as {
          lists: Array<{
            id: string;
            name: string;
            color: string | null;
          }>;
        };

        console.log("🔍 ClickUp folderless lists:", data.lists);

        return {
          success: true,
          lists: data.lists.map((list) => ({
            id: list.id,
            name: list.name,
            color: list.color,
          })),
        };
      } catch (error) {
        console.error("❌ Error fetching ClickUp folderless lists:", error);
        throw new Error("Failed to fetch ClickUp folderless lists");
      }
    }),

  // Get tasks from a ClickUp list
  getClickUpTasks: protectedProcedure
    .input(
      z.object({
        listId: z.string(),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        tasks: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().optional(),
            status: z.object({
              status: z.string(),
              id: z.string(),
              color: z.string(),
              type: z.string(),
              orderindex: z.number(),
            }),
            priority: z
              .object({
                priority: z.string(),
                color: z.string(),
                orderindex: z.string(),
                id: z.string(),
              })
              .optional()
              .nullable(),
          })
        ),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        console.log("🔍 Fetching ClickUp tasks for list:", input.listId);

        // Find ClickUp connection
        const connection = await ConnectionModel.findOne({
          accountId: ctx.user.accountId,
          provider: "clickup",
        });

        if (!connection) {
          throw new Error("No ClickUp connection found");
        }

        const response = await fetch(
          `https://api.clickup.com/api/v2/list/${input.listId}/task`,
          {
            headers: {
              Authorization: connection.accessToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`ClickUp API error: ${response.statusText}`);
        }

        const data = (await response.json()) as {
          tasks: Array<{
            id: string;
            name: string;
            description?: string;
            status: {
              status: string;
              id: string;
              color: string;
              type: string;
              orderindex: number;
            };
            priority?: {
              priority: string;
              color: string;
              orderindex: string;
              id: string;
            };
          }>;
        };

        console.log("🔍 ClickUp tasks:", data.tasks);

        return {
          success: true,
          tasks: data.tasks.map((task) => ({
            id: task.id,
            name: task.name,
            description: task.description,
            status: task.status,
            priority: task.priority,
          })),
        };
      } catch (error) {
        console.error("❌ Error fetching ClickUp tasks:", error);
        throw new Error("Failed to fetch ClickUp tasks");
      }
    }),

  // Get ClickUp webhooks for a connection
  getClickUpWebhooks: protectedProcedure
    .output(
      z.object({
        success: z.boolean(),
        webhooks: z.array(
          z.object({
            id: z.string(),
            endpoint: z.string(),
            events: z.array(z.string()),
            status: z.string(),
          })
        ),
      })
    )
    .query(async ({ ctx }) => {
      try {
        console.log("🔍 Fetching ClickUp webhooks for user:", ctx.user.id);

        // Find ClickUp connection
        const connection = await ConnectionModel.findOne({
          accountId: ctx.user.accountId,
          provider: "clickup",
        });

        if (!connection) {
          throw new Error("No ClickUp connection found");
        }

        // Get teams first
        const teamsResponse = await fetch(
          "https://api.clickup.com/api/v2/team",
          {
            headers: {
              Authorization: connection.accessToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (!teamsResponse.ok) {
          throw new Error(`ClickUp API error: ${teamsResponse.statusText}`);
        }

        const teamsData = (await teamsResponse.json()) as {
          teams: Array<{ id: string; name: string }>;
        };

        if (!teamsData.teams || teamsData.teams.length === 0) {
          return { success: true, webhooks: [] };
        }

        // Get webhooks for the first team
        const teamId = teamsData.teams[0].id;
        const webhooksResponse = await fetch(
          `https://api.clickup.com/api/v2/team/${teamId}/webhook`,
          {
            headers: {
              Authorization: connection.accessToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (!webhooksResponse.ok) {
          throw new Error(`ClickUp API error: ${webhooksResponse.statusText}`);
        }

        const webhooksData = (await webhooksResponse.json()) as {
          webhooks: Array<{
            id: string;
            endpoint: string;
            events: string[];
            status: string;
          }>;
        };

        return {
          success: true,
          webhooks: webhooksData.webhooks || [],
        };
      } catch (error) {
        console.error("❌ Error fetching ClickUp webhooks:", error);
        throw new Error("Failed to fetch ClickUp webhooks");
      }
    }),

  // Delete a ClickUp webhook
  deleteClickUpWebhook: protectedProcedure
    .input(
      z.object({
        webhookId: z.string(),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("🗑️ Deleting ClickUp webhook:", input.webhookId);

        // Find ClickUp connection
        const connection = await ConnectionModel.findOne({
          accountId: ctx.user.accountId,
          provider: "clickup",
        });

        if (!connection) {
          throw new Error("No ClickUp connection found");
        }

        // Get teams first
        const teamsResponse = await fetch(
          "https://api.clickup.com/api/v2/team",
          {
            headers: {
              Authorization: connection.accessToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (!teamsResponse.ok) {
          throw new Error(`ClickUp API error: ${teamsResponse.statusText}`);
        }

        const teamsData = (await teamsResponse.json()) as {
          teams: Array<{ id: string; name: string }>;
        };

        if (!teamsData.teams || teamsData.teams.length === 0) {
          throw new Error("No teams found");
        }

        // Delete webhook
        const teamId = teamsData.teams[0].id;
        const deleteResponse = await fetch(
          `https://api.clickup.com/api/v2/webhook/${input.webhookId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: connection.accessToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (!deleteResponse.ok) {
          throw new Error(
            `Failed to delete webhook: ${deleteResponse.statusText}`
          );
        }

        return {
          success: true,
          message: "Webhook deleted successfully",
        };
      } catch (error) {
        console.error("❌ Error deleting ClickUp webhook:", error);
        throw new Error("Failed to delete ClickUp webhook");
      }
    }),

  // Manually register a ClickUp webhook
  registerClickUpWebhook: protectedProcedure
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
        webhookId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx }) => {
      try {
        console.log(
          "🔗 Manually registering ClickUp webhook for user:",
          ctx.user.id
        );

        // Find ClickUp connection
        const connection = await ConnectionModel.findOne({
          accountId: ctx.user.accountId,
          provider: "clickup",
        });

        if (!connection) {
          throw new Error("No ClickUp connection found");
        }

        const webhookData = await registerClickUpWebhook(
          connection.accessToken,
          connection._id.toString()
        );

        // Store the webhook secret in the connection
        await ConnectionModel.findByIdAndUpdate(connection._id, {
          webhookSecret: webhookData.webhook.secret,
        } as any);

        return {
          success: true,
          message: "Webhook registered successfully",
          webhookId: webhookData.webhook.id,
        };
      } catch (error) {
        console.error("❌ Error registering ClickUp webhook:", error);
        throw new Error("Failed to register ClickUp webhook");
      }
    }),
});
