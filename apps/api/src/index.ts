import { ClickupTaskModel, connectDB, ConnectionModel } from "@swooche/models";
import * as trpcExpress from "@trpc/server/adapters/express";
import bodyParser from "body-parser";
import cors from "cors";
import crypto from "crypto";
import express from "express";
import { createContext } from "./context";
import { appRouter } from "./router";
import { rawClickupTaskToClickupTask } from "./routers/task";

const app = express();
const port = process.env.PORT || 3002;

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3001",
  // Add additional origins for different stages
  "https://app.swooche.com",
  "https://dev-app.swooche.com",
  "https://staging-app.swooche.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        console.log("CORS: Allowing request with no origin");
        return callback(null, true);
      }

      console.log(`CORS: Checking origin: ${origin}`);
      console.log(`CORS: Allowed origins:`, allowedOrigins);

      if (allowedOrigins.indexOf(origin) !== -1) {
        console.log(`CORS: Allowing origin: ${origin}`);
        callback(null, true);
      } else {
        console.log(`CORS: Blocking origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(bodyParser.json());

// Helper function to verify webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    console.log("🔍 Expected signature:", expectedSignature);
    console.log("🔍 Received signature:", signature);
    console.log("🔍 Signatures match:", expectedSignature === signature);

    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch (error) {
    console.error("❌ Error verifying webhook signature:", error);
    return false;
  }
}

// tRPC middleware with authentication context
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ClickUp webhook endpoint
app.post("/webhooks/clickup/tasks/:connectionId", async (req, res) => {
  try {
    const { connectionId } = req.params;
    const rawBody = JSON.stringify(req.body);

    console.log(
      "🔔 Received ClickUp webhook for connection:",
      connectionId,
      JSON.stringify(req.body, null, 2)
    );

    // Debug: Log all headers to see what's being sent
    console.log("📋 Request headers:", req.headers);

    // Find the connection to get the webhook secret
    const connection = await ConnectionModel.findById(connectionId);
    if (!connection) {
      console.error("❌ Connection not found:", connectionId);
      return res.status(404).json({
        success: false,
        message: "Connection not found",
      });
    }

    // Verify webhook signature if secret is available
    const webhookSecret = (connection as any).webhookSecret;
    if (webhookSecret) {
      const signature = req.headers["x-signature"] as string;
      console.log("🔐 Webhook secret found, signature from header:", signature);

      if (!signature) {
        console.error("❌ Missing webhook signature");
        return res.status(401).json({
          success: false,
          message: "Missing webhook signature",
        });
      }

      console.log("🔍 Verifying signature with body:", rawBody);
      console.log("🔍 Using secret:", webhookSecret.substring(0, 8) + "...");

      if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        console.error("❌ Invalid webhook signature");
        return res.status(401).json({
          success: false,
          message: "Invalid webhook signature",
        });
      }

      console.log("✅ Webhook signature verified");
    } else {
      console.log(
        "⚠️ No webhook secret found for connection, skipping verification"
      );
    }

    const {
      event,
      task_id,
      webhook_id,
      history_items,
      user_id,
      space_id,
      list_id,
    } = req.body;

    // Validate required fields
    if (!event || !task_id) {
      console.error("❌ Invalid webhook payload: missing event or task_id");
      return res.status(400).json({
        success: false,
        message: "Invalid webhook payload: missing required fields",
      });
    }

    // Log the webhook event with more details
    console.log(`📝 ClickUp webhook event: ${event} for task ${task_id}`);
    console.log(`📍 Location: space=${space_id}, list=${list_id}`);
    console.log(`👤 User: ${user_id}`);
    console.log(`🔗 Webhook ID: ${webhook_id}`);

    if (history_items && history_items.length > 0) {
      console.log(`📋 History items (${history_items.length}):`);
      history_items.forEach((item: any, index: number) => {
        console.log(
          `  ${index + 1}. ${item.field} changed from "${item.before}" to "${
            item.after
          }"`
        );
      });
    }

    // Process different event types
    console.log(`🔄 Processing ${event} event for task ${task_id}`);
    switch (event) {
      case "taskUpdated":
        console.log("🔄 Processing task update...");
        const existingTask = await ClickupTaskModel.findOne({
          clickupTaskId: task_id,
          accountId: connection.accountId,
        });
        if (existingTask) {
          // Fetch the complete task data from ClickUp API
          const clickupTaskResponse = await fetch(
            `https://api.clickup.com/api/v2/task/${task_id}`,
            {
              headers: {
                Authorization: connection.accessToken,
                "Content-Type": "application/json",
              },
            }
          );

          if (!clickupTaskResponse.ok) {
            console.error(
              `❌ Failed to fetch task from ClickUp: ${clickupTaskResponse.statusText}`
            );
            break;
          }

          const clickupTaskData = await clickupTaskResponse.json();
          console.log("📥 Fetched task data from ClickUp:", clickupTaskData);

          const parsedClickupTaskData = rawClickupTaskToClickupTask(
            clickupTaskData as any
          );
          console.log("📥 Parsed task data:", parsedClickupTaskData);

          // Convert and update the task
          const updatedTask = await ClickupTaskModel.findByIdAndUpdate(
            existingTask._id,
            { $set: parsedClickupTaskData },
            { new: true }
          );
          console.log("✅ Task updated:", updatedTask);
        } else {
          console.log("❌ Task not found in local database:", task_id);
        }
        break;

      case "taskCreated":
        console.log("✨ Processing task creation...");
        // Fetch the complete task data from ClickUp API
        const clickupTaskResponse = await fetch(
          `https://api.clickup.com/api/v2/task/${task_id}`,
          {
            headers: {
              Authorization: connection.accessToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (!clickupTaskResponse.ok) {
          console.error(
            `❌ Failed to fetch new task from ClickUp: ${clickupTaskResponse.statusText}`
          );
          break;
        }

        const clickupTaskData = await clickupTaskResponse.json();
        console.log("📥 Fetched new task data from ClickUp:", clickupTaskData);

        // Create the new task in our database
        const newTask = await ClickupTaskModel.create({
          ...rawClickupTaskToClickupTask(clickupTaskData as any),
          accountId: connection.accountId,
        });
        console.log("✅ New task created:", newTask);
        break;

      case "taskDeleted":
        console.log("🗑️ Processing task deletion...");
        await ClickupTaskModel.findOneAndDelete({
          clickupTaskId: task_id,
          accountId: connection.accountId,
        });
        console.log("✅ Task deleted:", task_id);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event}`);
    }

    // Acknowledge receipt
    return res.status(200).json({
      success: true,
      message: "Webhook received and processed successfully",
      event,
      task_id,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error processing ClickUp webhook:", error);
    return res.status(500).json({
      success: false,
      message: "Error processing webhook",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(port, async () => {
  await connectDB();
  console.log(`🚀 Server running on port ${port}`);
});
