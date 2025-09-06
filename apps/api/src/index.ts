import { connectDB } from "@swooche/models";
import * as trpcExpress from "@trpc/server/adapters/express";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { createContext } from "./context";
import { appRouter } from "./router";

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

app.listen(port, async () => {
  await connectDB();
  console.log(`🚀 Server running on port ${port}`);
});
